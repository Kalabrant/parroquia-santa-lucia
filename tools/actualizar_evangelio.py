#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Descarga el Evangelio de cada día y lo guarda en evangelio.json.

    py tools/actualizar_evangelio.py

Lo ejecuta solo GitHub Actions cada madrugada (.github/workflows/evangelio.yml),
pero se puede lanzar a mano para probarlo.

Fuente: feed.evangelizo.org, el servicio gratuito que usan muchas parroquias.
Devuelve texto plano en UTF-8 y solo permite pedir hasta 30 días por delante.

Se guardan VARIOS días de golpe (no solo hoy) por dos razones:
  · si un día falla la tarea automática, la web sigue mostrando el Evangelio;
  · quien tenga la web instalada sin conexión conserva unos días de margen.
"""

import html
import json
import re
import sys
import urllib.error
import urllib.request
from datetime import date, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "evangelio.json"

BASE = "https://feed.evangelizo.org/v2/reader.php"
IDIOMA = "SP"
DIAS_POR_DELANTE = 7
TIEMPO_ESPERA = 25


def pedir(dia, tipo, contenido=None):
    params = "date={}&type={}&lang={}".format(dia.strftime("%Y%m%d"), tipo, IDIOMA)
    if contenido:
        params += "&content=" + contenido
    url = BASE + "?" + params

    peticion = urllib.request.Request(url, headers={
        "User-Agent": "ParroquiaSantaLucia/1.0 (+https://parroquiasantalucia.org)"
    })
    with urllib.request.urlopen(peticion, timeout=TIEMPO_ESPERA) as r:
        return r.read().decode("utf-8", errors="replace").strip()


def limpiar(texto):
    # El feed cuela etiquetas sueltas (<font dir="ltr">, <br>...) que no
    # queremos volcar tal cual en la web. Los <br> pasan a salto de línea
    # y el resto de marcas se eliminan.
    t = texto.replace("\r", "")
    t = re.sub(r"<br\s*/?>", "\n", t, flags=re.IGNORECASE)
    t = re.sub(r"<[^>]+>", "", t)
    t = html.unescape(t)

    lineas = [l.strip() for l in t.split("\n")]
    return "\n".join(l for l in lineas if l)


def parece_error(texto):
    """Si los parámetros no le gustan, el servicio devuelve su página de ayuda
    en lugar de un error HTTP. Se detecta por el tamaño y el contenido."""
    if not texto or len(texto) < 20:
        return True
    pistas = ("reader.php", "<!doctype", "<html", "web service", "parameter")
    bajo = texto[:600].lower()
    return any(p in bajo for p in pistas)


def obtener_dia(dia):
    try:
        titulo = limpiar(pedir(dia, "liturgic_t"))
        cita = limpiar(pedir(dia, "reading_lt", "GSP"))
        texto = limpiar(pedir(dia, "reading", "GSP"))
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as e:
        print("  {} -> sin respuesta ({})".format(dia, e))
        return None

    if parece_error(texto) or parece_error(cita):
        print("  {} -> el servicio no devolvió lecturas".format(dia))
        return None

    return {
        "fecha": dia.isoformat(),
        "diaLiturgico": titulo if not parece_error(titulo) else "",
        "cita": cita,
        "texto": texto,
    }


def main():
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    hoy = date.today()
    dias = []

    print("Descargando el Evangelio de {} días desde {}\n".format(DIAS_POR_DELANTE, hoy))
    for i in range(DIAS_POR_DELANTE):
        d = hoy + timedelta(days=i)
        entrada = obtener_dia(d)
        if entrada:
            print("  {} -> {}".format(d, entrada["cita"]))
            dias.append(entrada)

    if not dias:
        # Mejor dejar el archivo viejo que machacarlo con uno vacío:
        # la web seguirá mostrando el último Evangelio que sí se descargó.
        print("\nNo se pudo descargar ningún día. Se conserva el evangelio.json anterior.")
        return 1

    salida = {
        "actualizado": hoy.isoformat(),
        "fuente": "evangelizo.org",
        "dias": dias,
    }
    DESTINO.write_text(json.dumps(salida, ensure_ascii=False, indent=1) + "\n",
                       encoding="utf-8", newline="\n")
    print("\n{} días guardados en evangelio.json".format(len(dias)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
