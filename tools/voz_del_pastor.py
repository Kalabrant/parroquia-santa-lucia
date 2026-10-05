#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
"La voz del pastor": la homilía de cada día convertida en una entrada de blog.

    py tools/voz_del_pastor.py                         -> regenera todas las entradas y el índice
    py tools/voz_del_pastor.py publicar 2026-10-06 --imagen C:/ruta/imagen.png
                                                       -> pasa el borrador del día a la web

Cómo funciona:
  · Cada entrada es una ficha en voz-del-pastor/entradas.json.
  · Antes de publicarse vive en voz-del-pastor/borradores/AAAA-MM-DD.json
    (esa carpeta no se sube a GitHub).
  · "publicar" mete el borrador en entradas.json, convierte la imagen a WebP
    en voz-del-pastor/img/AAAA-MM-DD.webp y vuelve a generarlo todo.
  · Cada entrada se escribe en voz-del-pastor/AAAA-MM-DD.html con el mismo
    menú, pie y etiquetas que el resto del sitio (los toma de sincronizar.py).
  · El índice es la-voz-del-pastor.html, en la raíz: su lista de entradas
    va entre <!--#voz-entradas--> y <!--/#voz-entradas-->.

sincronizar.py llama a este script al terminar, así que si cambias el menú
o el pie, las entradas se actualizan solas.

Formato de una ficha:
  {
    "fecha": "2026-10-06",
    "titulo": "...",
    "resumen": "Una o dos frases (para Google, WhatsApp, X y Facebook).",
    "cita": "Lc 10, 38-42",            # el Evangelio del día
    "parrafos": ["...", "> cita bíblica destacada", "..."],
    "imagen": "voz-del-pastor/img/2026-10-06.webp",
    "alt": "Descripción de la imagen",
    "prompt": "El prompt usado en Google Flow"
  }
En los párrafos, *texto* sale en cursiva y un párrafo que empieza por "> "
se muestra como cita destacada.
"""

import html as htmlmod
import json
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import quote

sys.path.insert(0, str(Path(__file__).resolve().parent))
import sincronizar as sinc  # noqa: E402

RAIZ = sinc.RAIZ
CARPETA = RAIZ / "voz-del-pastor"
DATOS = CARPETA / "entradas.json"
BORRADORES = CARPETA / "borradores"
IMG = CARPETA / "img"
INDICE = "la-voz-del-pastor.html"

FIRMA = "Pbro. Rafael Villalobos"
CARGO = "Párroco de Santa Lucía"
IMAGEN_POR_DEFECTO = "parroco.webp"
RECIENTES = 12   # tarjetas con foto en el índice; el resto, en el archivo por meses

DIAS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]
MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
         "agosto", "septiembre", "octubre", "noviembre", "diciembre"]


# ─────────────────────────────────────────────────────────────
#  Utilidades
# ─────────────────────────────────────────────────────────────

def fecha_larga(iso, con_dia=True):
    d = date.fromisoformat(iso)
    texto = "{} de {} de {}".format(d.day, MESES[d.month - 1], d.year)
    return (DIAS[d.weekday()].capitalize() + ", " + texto) if con_dia else texto


def esc(texto):
    return htmlmod.escape(texto, quote=True)


def parrafo_html(texto):
    t = esc(texto.strip())
    t = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", t)
    if t.startswith("&gt; "):
        return '<blockquote class="voz-destacado">{}</blockquote>'.format(t[5:])
    return "<p>{}</p>".format(t)


def subir_un_nivel(fragmento):
    """Las entradas viven en una subcarpeta: los enlaces relativos del menú,
    el pie y el <head> necesitan "../" delante."""
    return re.sub(r'(\s(?:href|src)=")(?!https?:|#|mailto:|tel:|data:|\.\./|/)([^"]+")',
                  r"\1../\2", fragmento)


def cargar_entradas():
    if not DATOS.exists():
        return []
    datos = sinc.cargar_json(DATOS)
    return sorted(datos.get("entradas", []), key=lambda e: e["fecha"], reverse=True)


def guardar_entradas(entradas):
    CARPETA.mkdir(exist_ok=True)
    datos = {
        "_comentario": "Entradas de La voz del pastor. Tras editar, ejecuta 'py tools/sincronizar.py'.",
        "entradas": sorted(entradas, key=lambda e: e["fecha"], reverse=True),
    }
    DATOS.write_text(json.dumps(datos, ensure_ascii=False, indent=2) + "\n",
                     encoding="utf-8", newline="\n")


def url_entrada(cfg, e):
    return "{}/voz-del-pastor/{}.html".format(cfg["sitio"]["dominio"], e["fecha"])


def botones_compartir(cfg, e):
    url = url_entrada(cfg, e)
    texto = "{} — {}".format(e["titulo"], FIRMA)
    wa = "https://wa.me/?text=" + quote(texto + "\n" + url)
    fb = "https://www.facebook.com/sharer/sharer.php?u=" + quote(url, safe="")
    x = "https://x.com/intent/post?text={}&url={}".format(quote(texto), quote(url, safe=""))
    return (
        '<div class="voz-compartir" aria-label="Compartir esta reflexión">\n'
        '            <span class="voz-compartir-titulo">Compártela</span>\n'
        '            <a class="voz-btn voz-btn-wa" href="{wa}" target="_blank" rel="noopener noreferrer">'
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.5-.3z"/></svg>'
        'WhatsApp</a>\n'
        '            <a class="voz-btn voz-btn-fb" href="{fb}" target="_blank" rel="noopener noreferrer">'
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.5 1.6-1.5h1.7V4.4a22 22 0 0 0-2.5-.1c-2.4 0-4.1 1.5-4.1 4.2v2.3H7.5V14h2.7v8z"/></svg>'
        'Facebook</a>\n'
        '            <a class="voz-btn voz-btn-x" href="{x}" target="_blank" rel="noopener noreferrer">'
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 3h3.1l-6.7 7.7L22 21h-6.2l-4.8-6.3L5.4 21H2.3l7.2-8.2L2 3h6.3l4.4 5.8zm-1.1 16.2h1.7L7.4 4.7H5.6z"/></svg>'
        'X</a>\n'
        '            <button type="button" class="voz-btn voz-btn-copiar" data-url="{url}">'
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.6 13.4a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2m1 4.7a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
        '<span>Copiar enlace</span></button>\n'
        '        </div>'
    ).format(wa=esc(wa), fb=esc(fb), x=esc(x), url=esc(url))


SCRIPT_COPIAR = """<script>
document.querySelectorAll('.voz-btn-copiar').forEach(function (b) {
    b.addEventListener('click', function () {
        var url = b.getAttribute('data-url'), t = b.querySelector('span');
        function hecho() { t.textContent = '¡Enlace copiado!'; setTimeout(function () { t.textContent = 'Copiar enlace'; }, 2200); }
        if (navigator.clipboard) { navigator.clipboard.writeText(url).then(hecho, function () { prompt('Copia el enlace:', url); }); }
        else { prompt('Copia el enlace:', url); }
    });
});
</script>"""


# ─────────────────────────────────────────────────────────────
#  Página de cada entrada
# ─────────────────────────────────────────────────────────────

def pagina_entrada(cfg, paginas, nav_tpl, pie_tpl, e, anterior, siguiente):
    pagina = "voz-del-pastor/{}.html".format(e["fecha"])
    imagen = e.get("imagen") or IMAGEN_POR_DEFECTO
    meta = {
        "titulo": "{} | La voz del pastor".format(e["titulo"]),
        "desc": e["resumen"],
        "imagen": imagen,
    }
    head = sinc.construir_head(cfg, pagina, meta, False)
    head = head.replace('<meta property="og:type" content="website">',
                        '<meta property="og:type" content="article">\n    '
                        '<meta property="article:published_time" content="{}T19:00:00-04:00">\n    '
                        '<meta property="article:author" content="{}">'.format(e["fecha"], FIRMA))
    head = subir_un_nivel(head).replace('<script>window.__vSitio',
                                        "<script>window.__raiz='../';</script>\n    <script>window.__vSitio", 1)

    nav = subir_un_nivel(sinc.construir_nav(nav_tpl, INDICE))
    pie = subir_un_nivel(sinc.construir_footer(pie_tpl, cfg))

    migas = (
        '<nav class="migas" aria-label="Ruta de navegación">\n'
        '    <ol>\n'
        '        <li><a href="../index.html">Inicio</a></li>\n'
        '        <li><a href="../{}">La voz del pastor</a></li>\n'
        '        <li><span aria-current="page">{}</span></li>\n'
        '    </ol>\n'
        '</nav>'.format(INDICE, esc(e["titulo"]))
    )

    cuerpo = "\n            ".join(parrafo_html(p) for p in e["parrafos"] if p.strip())

    cita = ' · <span class="voz-cita">{}</span>'.format(esc(e["cita"])) if e.get("cita") else ""

    figura = ""
    if e.get("imagen"):
        figura = (
            '<figure class="voz-imagen">\n'
            '            <img src="../{}" alt="{}" width="1600" height="900" fetchpriority="high">\n'
            '            <figcaption>Ilustración en acuarela creada con inteligencia artificial.</figcaption>\n'
            '        </figure>'.format(esc(e["imagen"]), esc(e.get("alt", "")))
        )

    vecinas = []
    if anterior:
        vecinas.append('<a class="voz-vecina voz-vecina-ant" href="{f}.html"><small>← Anterior</small>{t}</a>'
                       .format(f=anterior["fecha"], t=esc(anterior["titulo"])))
    else:
        vecinas.append('<span></span>')
    if siguiente:
        vecinas.append('<a class="voz-vecina voz-vecina-sig" href="{f}.html"><small>Siguiente →</small>{t}</a>'
                       .format(f=siguiente["fecha"], t=esc(siguiente["titulo"])))

    jsonld = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": e["titulo"],
        "description": e["resumen"],
        "datePublished": e["fecha"],
        "image": cfg["sitio"]["dominio"] + "/" + imagen,
        "url": url_entrada(cfg, e),
        "inLanguage": "es",
        "author": {"@type": "Person", "name": FIRMA},
        "publisher": {"@type": "Organization", "name": cfg["sitio"]["nombre"],
                      "logo": {"@type": "ImageObject", "url": cfg["sitio"]["dominio"] + "/favicon.svg"}},
    }

    return """<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Generado por tools/voz_del_pastor.py — no editar a mano: cambia voz-del-pastor/entradas.json -->
    {head}
</head>
<body>
{nav}

<main id="contenido">
{migas}

    <article class="voz-articulo">
        <header class="voz-cabecera">
            <p class="voz-fecha"><time datetime="{fecha}">{fecha_larga}</time>{cita}</p>
            <h1>{titulo}</h1>
            <p class="voz-resumen">{resumen}</p>
        </header>

        {figura}

        <div class="voz-cuerpo">
            {cuerpo}
        </div>

        <div class="voz-firma">
            <img src="../parroco.webp" alt="" width="64" height="64">
            <p><strong>{firma}</strong><span>{cargo}</span></p>
        </div>

        {compartir}

        <nav class="voz-vecinas" aria-label="Otras reflexiones">
            {vecinas}
        </nav>
        <p class="voz-volver"><a href="../{indice}">Ver todas las reflexiones</a></p>
    </article>
</main>

{pie}

{script}
<script type="application/ld+json">
{jsonld}
</script>
</body>
</html>
""".format(head=head, nav=nav, migas=migas, fecha=e["fecha"], fecha_larga=fecha_larga(e["fecha"]),
           cita=cita, titulo=esc(e["titulo"]), resumen=esc(e["resumen"]), figura=figura,
           cuerpo=cuerpo, firma=FIRMA, cargo=CARGO, compartir=botones_compartir(cfg, e),
           vecinas="\n            ".join(vecinas), indice=INDICE, pie=pie, script=SCRIPT_COPIAR,
           jsonld=json.dumps(jsonld, ensure_ascii=False, indent=2))


# ─────────────────────────────────────────────────────────────
#  Lista del índice
# ─────────────────────────────────────────────────────────────

def lista_indice(entradas):
    if not entradas:
        return ('    <p class="voz-vacio">La primera reflexión se publicará muy pronto. '
                'Vuelve esta tarde, después de la Misa de 6:00 PM.</p>')

    def tarjeta(e, destacada=False):
        img = e.get("imagen") or IMAGEN_POR_DEFECTO
        return (
            '        <a class="voz-tarjeta{cls}" href="voz-del-pastor/{f}.html">\n'
            '            <img src="{img}" alt="" width="1600" height="900">\n'
            '            <span class="voz-tarjeta-texto">\n'
            '                <small>{fl}{cita}</small>\n'
            '                <strong>{t}</strong>\n'
            '                <span>{r}</span>\n'
            '            </span>\n'
            '        </a>'
        ).format(cls=" voz-tarjeta-destacada" if destacada else "", f=e["fecha"], img=esc(img),
                 fl=fecha_larga(e["fecha"]), cita=(" · " + esc(e["cita"])) if e.get("cita") else "",
                 t=esc(e["titulo"]), r=esc(e["resumen"]))

    partes = ['    <div class="voz-rejilla">',
              tarjeta(entradas[0], destacada=True)]
    partes += [tarjeta(e) for e in entradas[1:RECIENTES]]
    partes.append('    </div>')

    resto = entradas[RECIENTES:]
    if resto:
        partes.append('    <section class="voz-archivo">\n        <h2>Archivo</h2>')
        mes_actual = None
        for e in resto:
            d = date.fromisoformat(e["fecha"])
            mes = "{} {}".format(MESES[d.month - 1].capitalize(), d.year)
            if mes != mes_actual:
                if mes_actual:
                    partes.append('        </ul>')
                partes.append('        <h3>{}</h3>\n        <ul>'.format(mes))
                mes_actual = mes
            partes.append('            <li><a href="voz-del-pastor/{f}.html"><time datetime="{f}">{d}</time> {t}</a></li>'
                          .format(f=e["fecha"], d=d.day, t=esc(e["titulo"])))
        partes.append('        </ul>\n    </section>')
    return "\n".join(partes)


# ─────────────────────────────────────────────────────────────
#  Generación y publicación
# ─────────────────────────────────────────────────────────────

def generar(cfg=None, paginas=None, nav_tpl=None, pie_tpl=None):
    cfg = cfg or sinc.cargar_json(sinc.TOOLS / "config.json")
    paginas = paginas or sinc.cargar_json(sinc.TOOLS / "paginas.json")
    nav_tpl = nav_tpl or (sinc.PARTIALS / "nav.html").read_text(encoding="utf-8").strip()
    pie_tpl = pie_tpl or (sinc.PARTIALS / "footer.html").read_text(encoding="utf-8").strip()

    entradas = cargar_entradas()
    CARPETA.mkdir(exist_ok=True)

    escritas = 0
    for i, e in enumerate(entradas):
        siguiente = entradas[i - 1] if i > 0 else None
        anterior = entradas[i + 1] if i + 1 < len(entradas) else None
        ruta = CARPETA / "{}.html".format(e["fecha"])
        nuevo = pagina_entrada(cfg, paginas, nav_tpl, pie_tpl, e, anterior, siguiente)
        if not ruta.exists() or ruta.read_text(encoding="utf-8") != nuevo:
            ruta.write_text(nuevo, encoding="utf-8", newline="\n")
            escritas += 1

    # páginas de entradas que ya no están en el JSON
    vigentes = {"{}.html".format(e["fecha"]) for e in entradas}
    for vieja in CARPETA.glob("????-??-??.html"):
        if vieja.name not in vigentes:
            vieja.unlink()

    indice = RAIZ / INDICE
    if indice.exists():
        html = indice.read_text(encoding="utf-8")
        html2, ok = sinc.reemplazar_bloque(html, "voz-entradas", lista_indice(entradas))
        if ok and html2 != html:
            indice.write_text(html2, encoding="utf-8", newline="\n")

    # sitemap: sincronizar.py lo regenera sin las entradas; se añaden aquí
    sitemap = RAIZ / "sitemap.xml"
    if sitemap.exists() and entradas:
        xml = sitemap.read_text(encoding="utf-8")
        xml = re.sub(r"   <url>\n      <loc>[^<]*/voz-del-pastor/[^<]*</loc>.*?</url>\n", "", xml, flags=re.DOTALL)
        filas = "".join(
            "   <url>\n      <loc>{}</loc>\n      <lastmod>{}</lastmod>\n      <priority>0.5</priority>\n   </url>\n"
            .format(url_entrada(cfg, e), e["fecha"]) for e in entradas)
        xml = xml.replace("</urlset>", filas + "</urlset>")
        sitemap.write_text(xml, encoding="utf-8", newline="\n")

    return len(entradas), escritas


def convertir_imagen(origen, fecha):
    from PIL import Image, ImageOps
    IMG.mkdir(parents=True, exist_ok=True)
    destino = IMG / "{}.webp".format(fecha)
    with Image.open(origen) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        # 16:9, recortando al centro si hace falta
        w, h = im.size
        if abs(w / h - 16 / 9) > 0.02:
            if w / h > 16 / 9:
                nw = int(h * 16 / 9)
                im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
            else:
                nh = int(w * 9 / 16)
                im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
        im = im.resize((1600, 900), Image.LANCZOS)
        im.save(destino, "WEBP", quality=82, method=6)
    return destino.relative_to(RAIZ).as_posix()


def publicar(fecha, origen_imagen=None):
    borrador = BORRADORES / "{}.json".format(fecha)
    if not borrador.exists():
        sys.exit("No encuentro el borrador {}".format(borrador))
    e = sinc.cargar_json(borrador)
    e["fecha"] = fecha
    for campo in ("titulo", "resumen", "parrafos"):
        if not e.get(campo):
            sys.exit("Al borrador le falta «{}»".format(campo))
    if origen_imagen:
        e["imagen"] = convertir_imagen(origen_imagen, fecha)
    entradas = [x for x in cargar_entradas() if x["fecha"] != fecha]
    entradas.append(e)
    guardar_entradas(entradas)
    print("Entrada del {} añadida a entradas.json".format(fecha))


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    args = sys.argv[1:]
    if args and args[0] == "publicar":
        if len(args) < 2:
            sys.exit("Uso: py tools/voz_del_pastor.py publicar AAAA-MM-DD [--imagen ruta]")
        origen = args[args.index("--imagen") + 1] if "--imagen" in args else None
        publicar(args[1], origen)
        # sincronizar.py regenera el sitio entero y, al final, estas páginas
        sys.argv = [sys.argv[0]]
        sinc.main()
        return

    total, escritas = generar()
    print("La voz del pastor: {} entradas · {} páginas reescritas".format(total, escritas))


if __name__ == "__main__":
    main()
