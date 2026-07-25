#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Reduce el peso de las fotos del sitio sin que se note en pantalla.

    py tools/optimizar_imagenes.py --revisar   -> dice qué haría, sin tocar nada
    py tools/optimizar_imagenes.py             -> optimiza de verdad

Qué hace:
  · Reduce cualquier imagen cuyo lado mayor pase de 1600 px.
    (El contenedor más ancho del sitio mide 1100 px, así que 1600 ya da
     margen de sobra incluso en pantallas retina.)
  · La vuelve a guardar en WebP con calidad 82.
  · Antes de tocar nada, guarda el original en imagenes_originales/.
    Esa carpeta está en .gitignore, así que no engorda el repositorio.

Se puede ejecutar las veces que haga falta: si una imagen ya está optimizada,
la deja como está.
"""

import shutil
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    sys.exit("Falta Pillow. Instálalo con:  py -m pip install Pillow")

RAIZ = Path(__file__).resolve().parent.parent
RESPALDO = RAIZ / "imagenes_originales"

LADO_MAXIMO = 1600
CALIDAD = 82
AHORRO_MINIMO = 0.15   # por debajo de un 15 % no compensa perder calidad
PESO_MINIMO = 150 * 1024  # las imágenes ya ligeras se dejan en paz


def optimizar(ruta, revisar=False):
    peso_antes = ruta.stat().st_size

    # Recomprimir un archivo pequeño degrada la imagen a cambio de nada.
    # Solo lo tocamos si además hay que reducir sus dimensiones.
    with Image.open(ruta) as sonda:
        necesita_encoger = max(sonda.size) > LADO_MAXIMO
    if peso_antes < PESO_MINIMO and not necesita_encoger:
        return None

    with Image.open(ruta) as im:
        ancho, alto = im.size
        formato_original = im.format
        im.load()
        lado = max(ancho, alto)

        if lado > LADO_MAXIMO:
            escala = LADO_MAXIMO / lado
            nuevo = (round(ancho * escala), round(alto * escala))
            im_final = im.resize(nuevo, Image.LANCZOS)
        else:
            nuevo = (ancho, alto)
            im_final = im.copy()

        destino_tmp = ruta.with_suffix(".tmp.webp")
        im_final.save(destino_tmp, "WEBP", quality=CALIDAD, method=6)

    peso_despues = destino_tmp.stat().st_size
    ahorro = 1 - peso_despues / peso_antes

    if ahorro < AHORRO_MINIMO:
        destino_tmp.unlink()
        return None

    detalle = "{:>7.0f} KB -> {:>6.0f} KB  ({:.0f}% menos)  {}x{} -> {}x{}".format(
        peso_antes / 1024, peso_despues / 1024, ahorro * 100,
        ancho, alto, nuevo[0], nuevo[1])

    if revisar:
        destino_tmp.unlink()
        return detalle

    RESPALDO.mkdir(exist_ok=True)
    copia = RESPALDO / ruta.name
    if not copia.exists():
        shutil.copy2(ruta, copia)

    destino_tmp.replace(ruta)
    return detalle


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    revisar = "--revisar" in sys.argv
    imagenes = sorted(RAIZ.glob("*.webp"))

    print("Revisando {} imágenes{}\n".format(
        len(imagenes), " (modo revisión, no se escribe nada)" if revisar else ""))

    tocadas = 0
    antes = despues = 0

    for ruta in imagenes:
        peso_previo = ruta.stat().st_size
        antes += peso_previo
        try:
            res = optimizar(ruta, revisar)
        except Exception as e:
            print("  !!  {:<32} {}".format(ruta.name, e))
            despues += peso_previo
            continue

        if res:
            print("  OK  {:<32} {}".format(ruta.name, res))
            tocadas += 1
        despues += ruta.stat().st_size

    print("\n{} imágenes optimizadas".format(tocadas))
    print("Peso total: {:.1f} MB -> {:.1f} MB".format(antes / 1048576, despues / 1048576))
    if revisar:
        print("(en modo revisión el peso final es una estimación: no se escribió nada)")
    else:
        print("Los originales quedaron guardados en imagenes_originales/")


if __name__ == "__main__":
    main()
