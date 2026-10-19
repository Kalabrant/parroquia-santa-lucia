#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Convierte el dibujo del generador de imágenes en la tira de fotogramas
de la avatar de Santa Lucía.

    py tools/sprite_lucia.py imagen.png            -> todas las poses que encuentre
    py tools/sprite_lucia.py imagen.png --poses 4  -> fuerza 4 poses (rejilla 2×2)
    py tools/sprite_lucia.py imagen.png --poses 1  -> solo la primera pose

Escribe lucia-sprite.png en la raíz: una tira de 64·n × 64 px.
Se ejecuta una vez, a mano, cuando cambia el dibujo.

El algoritmo es el de las mascotas de Sacred Flame:
  1. quitar el fondo (transparencia, croma tipo magenta o relleno desde el borde);
  2. separar las poses por manchas conectadas, no partiendo la imagen a ojo;
  3. reducir a 64×64 con la misma escala para todas, apoyadas abajo y
     centradas por su centro de masas para que no «bailen» entre fotogramas.
"""

import sys
from collections import deque
from pathlib import Path

from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
SALIDA = RAIZ / "lucia-sprite.png"

LADO = 64          # fotograma de salida
ALTO_FIGURA = 60   # mayor dimensión de la figura más grande
MARGEN_ABAJO = 2
CELDA = 4          # rejilla para separar las poses
ENSANCHE = 2       # celdas que se ensancha cada mancha
COLORES = 128      # paleta de la tira final


# ─────────────────────────────────────────────────────────────
#  1. Quitar el fondo → máscara de figura (lista de bool)
# ─────────────────────────────────────────────────────────────

def pixeles(im):
    """Lista plana de píxeles (getdata está en desuso en Pillow 12+)."""
    f = getattr(im, "get_flattened_data", None)
    return list(f() if f else im.getdata())


def borde(w, h):
    for x in range(w):
        yield x, 0
        yield x, h - 1
    for y in range(1, h - 1):
        yield 0, y
        yield w - 1, y


def mediana(valores):
    v = sorted(valores)
    return v[len(v) // 2]


def mascara_figura(im):
    w, h = im.size
    px = im.load()
    pb = [px[x, y] for x, y in borde(w, h)]

    # a) la imagen ya trae transparencia en el borde
    if sum(1 for p in pb if p[3] < 128) > len(pb) // 2:
        print("fondo: transparencia de la imagen")
        return [px[i % w, i // w][3] >= 128 for i in range(w * h)]

    fondo = tuple(mediana([p[c] for p in pb]) for c in range(3))
    croma = max(fondo) - min(fondo) > 120

    def dist2(p):
        return (p[0] - fondo[0]) ** 2 + (p[1] - fondo[1]) ** 2 + (p[2] - fondo[2]) ** 2

    # b) croma (magenta, verde…): fuera en TODA la imagen, también los huecos
    if croma:
        print("fondo: croma {} (se quita en toda la imagen)".format(fondo))
        lim = 110 ** 2
        datos = pixeles(im)
        return [p[3] >= 128 and dist2(p) >= lim for p in datos]

    # c) fondo liso no croma: relleno desde los bordes
    print("fondo: liso {} (relleno desde los bordes)".format(fondo))
    lim = 60 ** 2
    fig = [True] * (w * h)
    cola = deque()
    for x, y in borde(w, h):
        i = y * w + x
        if fig[i] and dist2(px[x, y]) < lim:
            fig[i] = False
            cola.append((x, y))
    while cola:
        x, y = cola.popleft()
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h:
                i = ny * w + nx
                if fig[i] and dist2(px[nx, ny]) < lim:
                    fig[i] = False
                    cola.append((nx, ny))
    return fig


# ─────────────────────────────────────────────────────────────
#  2. Separar las poses
# ─────────────────────────────────────────────────────────────

def separar_poses(fig, w, h):
    """Devuelve (etiquetas por píxel, lista de figuras ordenadas como se lee).
    Cada figura: dict con id, bbox, centro y número de píxeles."""
    gw, gh = (w + CELDA - 1) // CELDA, (h + CELDA - 1) // CELDA
    lleno = [False] * (gw * gh)
    for i, f in enumerate(fig):
        if f:
            lleno[(i // w) // CELDA * gw + (i % w) // CELDA] = True

    # ensanchar para que la lámpara o la palma sueltas sigan unidas al cuerpo
    ancho = [False] * (gw * gh)
    for cy in range(gh):
        for cx in range(gw):
            if lleno[cy * gw + cx]:
                for yy in range(max(0, cy - ENSANCHE), min(gh, cy + ENSANCHE + 1)):
                    for xx in range(max(0, cx - ENSANCHE), min(gw, cx + ENSANCHE + 1)):
                        ancho[yy * gw + xx] = True

    # manchas conectadas (8 vecinos)
    etq_celda = [-1] * (gw * gh)
    n = 0
    for inicio in range(gw * gh):
        if not ancho[inicio] or etq_celda[inicio] != -1:
            continue
        etq_celda[inicio] = n
        cola = deque([inicio])
        while cola:
            c = cola.popleft()
            cx, cy = c % gw, c // gw
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    nx, ny = cx + dx, cy + dy
                    if 0 <= nx < gw and 0 <= ny < gh:
                        j = ny * gw + nx
                        if ancho[j] and etq_celda[j] == -1:
                            etq_celda[j] = n
                            cola.append(j)
        n += 1

    # estadísticas por mancha, contando solo píxeles de figura
    est = [{"n": 0, "sx": 0, "sy": 0, "x0": w, "y0": h, "x1": 0, "y1": 0} for _ in range(n)]
    etq = [-1] * (w * h)
    for i, f in enumerate(fig):
        if not f:
            continue
        x, y = i % w, i // w
        e = etq_celda[y // CELDA * gw + x // CELDA]
        etq[i] = e
        s = est[e]
        s["n"] += 1; s["sx"] += x; s["sy"] += y
        s["x0"] = min(s["x0"], x); s["y0"] = min(s["y0"], y)
        s["x1"] = max(s["x1"], x + 1); s["y1"] = max(s["y1"], y + 1)

    mayor = max(s["n"] for s in est) if est else 0
    if not mayor:
        sys.exit("No encuentro ninguna figura en la imagen.")

    figuras = [e for e in range(n) if est[e]["n"] >= 0.20 * mayor]
    destino = {e: e for e in figuras}
    for e in range(n):
        if e in destino or est[e]["n"] == 0:
            continue
        if est[e]["n"] < 0.02 * mayor:
            destino[e] = -1                       # motas y chispas
            continue
        cx, cy = est[e]["sx"] / est[e]["n"], est[e]["sy"] / est[e]["n"]
        destino[e] = min(figuras, key=lambda f: (est[f]["sx"] / est[f]["n"] - cx) ** 2 +
                                                (est[f]["sy"] / est[f]["n"] - cy) ** 2)
    etq = [destino.get(e, -1) if e >= 0 else -1 for e in etq]

    return etq, ordenar(recalcular(etq, w, h))


def recalcular(etq, w, h):
    est = {}
    for i, e in enumerate(etq):
        if e < 0:
            continue
        x, y = i % w, i // w
        s = est.setdefault(e, {"id": e, "n": 0, "sx": 0, "sy": 0,
                               "x0": w, "y0": h, "x1": 0, "y1": 0})
        s["n"] += 1; s["sx"] += x; s["sy"] += y
        s["x0"] = min(s["x0"], x); s["y0"] = min(s["y0"], y)
        s["x1"] = max(s["x1"], x + 1); s["y1"] = max(s["y1"], y + 1)
    for s in est.values():
        s["cx"], s["cy"] = s["sx"] / s["n"], s["sy"] / s["n"]
    return list(est.values())


def ordenar(figs):
    """Como se lee: por filas y, dentro de cada fila, de izquierda a derecha."""
    figs = sorted(figs, key=lambda f: f["cy"])
    filas = []
    for f in figs:
        if filas:
            ref = filas[-1][0]
            if abs(f["cy"] - ref["cy"]) < (ref["y1"] - ref["y0"]) / 2:
                filas[-1].append(f)
                continue
        filas.append([f])
    return [f for fila in filas for f in sorted(fila, key=lambda f: f["cx"])]


def cortar_2x2(fig, w, h):
    """Plan B: corta por la columna y la fila con menos figura, a ±25 % del centro."""
    col = [0] * w
    fil = [0] * h
    for i, f in enumerate(fig):
        if f:
            col[i % w] += 1
            fil[i // w] += 1
    cx = min(range(int(w * 0.25), int(w * 0.75) + 1), key=lambda x: (col[x], abs(x - w / 2)))
    cy = min(range(int(h * 0.25), int(h * 0.75) + 1), key=lambda y: (fil[y], abs(y - h / 2)))
    etq = [-1] * (w * h)
    for i, f in enumerate(fig):
        if f:
            etq[i] = (1 if (i // w) >= cy else 0) * 2 + (1 if (i % w) >= cx else 0)
    print("cortado en 2×2 por x={} y={}".format(cx, cy))
    return etq, ordenar(recalcular(etq, w, h))


# ─────────────────────────────────────────────────────────────
#  3. Reducir a 64×64
# ─────────────────────────────────────────────────────────────

def reducir(im, etq, f, escala):
    w, h = im.size
    datos = pixeles(im)
    paso = 1.0 / escala
    base_y = f["y1"]           # el borde inferior de la figura cae en LADO - MARGEN_ABAJO
    cx = f["cx"] + 0.5         # centro de masas al centro del fotograma

    salida = Image.new("RGBA", (LADO, LADO), (0, 0, 0, 0))
    po = salida.load()
    for oy in range(LADO):
        sy0 = base_y - (LADO - MARGEN_ABAJO - oy) * paso
        y0, y1 = int(round(sy0)), int(round(sy0 + paso))
        if y1 <= 0 or y0 >= h:
            continue
        for ox in range(LADO):
            sx0 = cx + (ox - LADO / 2) * paso
            x0, x1 = int(round(sx0)), int(round(sx0 + paso))
            if x1 <= 0 or x0 >= w:
                continue
            total = dentro = r = g = b = 0
            for y in range(max(0, y0), min(h, y1)):
                fila = y * w
                for x in range(max(0, x0), min(w, x1)):
                    total += 1
                    if etq[fila + x] == f["id"]:
                        p = datos[fila + x]
                        dentro += 1; r += p[0]; g += p[1]; b += p[2]
            if total and dentro / total >= 0.45:
                po[ox, oy] = (r // dentro, g // dentro, b // dentro, 255)
    return salida


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    args = [a for a in sys.argv[1:]]
    poses = None
    if "--poses" in args:
        i = args.index("--poses")
        poses = int(args[i + 1])
        del args[i:i + 2]
        if poses not in (1, 4):
            sys.exit("--poses admite 1 o 4")
    if not args:
        sys.exit(__doc__)

    im = Image.open(args[0]).convert("RGBA")
    w, h = im.size
    print("imagen: {}×{}".format(w, h))

    fig = mascara_figura(im)
    etq, figs = separar_poses(fig, w, h)
    print("figuras encontradas: {}".format(len(figs)))

    if poses == 4 and len(figs) not in (1, 4):
        etq, figs = cortar_2x2(fig, w, h)
    if poses == 1:
        figs = figs[:1]

    mayor = max(max(f["x1"] - f["x0"], f["y1"] - f["y0"]) for f in figs)
    escala = ALTO_FIGURA / mayor

    tira = Image.new("RGBA", (LADO * len(figs), LADO), (0, 0, 0, 0))
    for k, f in enumerate(figs):
        tira.paste(reducir(im, etq, f, escala), (k * LADO, 0))

    # Paleta reducida: el pixel art no usa más de unas decenas de colores y
    # así la tira pesa menos de 10 KB. El alfa ya es todo o nada.
    tira.quantize(COLORES, method=Image.Quantize.FASTOCTREE,
                  dither=Image.Dither.NONE).save(SALIDA, optimize=True)
    print("escrito {} · {} pose(s) · {}×{} · {:.1f} KB".format(
        SALIDA.name, len(figs), tira.width, tira.height, SALIDA.stat().st_size / 1024))


if __name__ == "__main__":
    main()
