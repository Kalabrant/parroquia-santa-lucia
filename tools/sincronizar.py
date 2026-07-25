#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sincroniza los bloques comunes de todas las páginas del sitio.

    py tools/sincronizar.py            -> aplica los cambios
    py tools/sincronizar.py --revisar  -> solo dice qué cambiaría, sin tocar nada

Qué sincroniza en cada .html de la raíz:
  · <head>: título, descripción, Open Graph, canónica, favicon, fuentes, CSS
  · el menú de navegación  (tools/partials/nav.html)
  · el pie de página       (tools/partials/footer.html)
  · las migas de pan       (según "seccion" en tools/paginas.json)
  · <main id="contenido">  para que funcione el enlace de salto
  · datos estructurados schema.org
  · rel="noopener" y loading="lazy"

Los datos salen de tools/config.json y tools/paginas.json.
Edita esos dos archivos (o los partials) y vuelve a ejecutar el script.
"""

import json
import re
import sys
from pathlib import Path
from urllib.parse import quote

RAIZ = Path(__file__).resolve().parent.parent
TOOLS = RAIZ / "tools"
PARTIALS = TOOLS / "partials"

# Carpetas que este script NO toca (la app del mapa se compila aparte)
EXCLUIR_DIRS = {"mapa-zonas-pastorales", "parroquia-santa-lucia", "comunidades-palabra",
                "node_modules", "imagenes_originales", "imagenes_webp", "Ostiariado", "tools"}

MARCA_INI = "<!--#{}-->"
MARCA_FIN = "<!--/#{}-->"


# ─────────────────────────────────────────────────────────────
#  Utilidades
# ─────────────────────────────────────────────────────────────

def cargar_json(ruta):
    with open(ruta, "r", encoding="utf-8") as f:
        return json.load(f)


def reemplazar_bloque(html, nombre, contenido):
    """Sustituye lo que haya entre <!--#nombre--> y <!--/#nombre-->.
    Devuelve (html, True) si encontró las marcas."""
    ini, fin = MARCA_INI.format(nombre), MARCA_FIN.format(nombre)
    patron = re.compile(re.escape(ini) + r".*?" + re.escape(fin), re.DOTALL)
    if patron.search(html):
        return patron.sub(lambda _: ini + "\n" + contenido + "\n" + fin, html, count=1), True
    return html, False


def envolver(nombre, contenido):
    return MARCA_INI.format(nombre) + "\n" + contenido + "\n" + MARCA_FIN.format(nombre)


def wa_url(cfg, clave):
    """URL de WhatsApp con el mensaje ya redactado."""
    plantillas = cfg["whatsappPlantillas"]
    msg = plantillas.get(clave, plantillas["general"])["mensaje"]
    return "https://wa.me/{}?text={}".format(cfg["contacto"]["whatsapp"], quote(msg))


# ─────────────────────────────────────────────────────────────
#  Construcción de los bloques
# ─────────────────────────────────────────────────────────────

def html_horarios_misas(cfg, clase="pie-horario"):
    filas = []
    for bloque in cfg["horarios"]["misas"]:
        horas = " · ".join(bloque["horas"])
        filas.append(
            '<p class="{}"><span class="dia">{}</span><span class="hora">{}</span></p>'.format(
                clase, bloque["dias"], horas))
    return "\n            ".join(filas)


def construir_head(cfg, pagina, meta, tiene_iconos_fa):
    sitio = cfg["sitio"]
    v = cfg.get("version", 1)
    dominio = sitio["dominio"]
    url = dominio + "/" + ("" if pagina == "index.html" else pagina)
    imagen = dominio + "/" + meta.get("imagen", "foto-templo.webp")

    partes = [
        '<title>{}</title>'.format(meta["titulo"]),
        '<meta name="description" content="{}">'.format(meta["desc"]),
        '<link rel="canonical" href="{}">'.format(url),
        '',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="{}">'.format(sitio["nombre"]),
        '<meta property="og:locale" content="es_VE">',
        '<meta property="og:title" content="{}">'.format(meta["titulo"]),
        '<meta property="og:description" content="{}">'.format(meta["desc"]),
        '<meta property="og:url" content="{}">'.format(url),
        '<meta property="og:image" content="{}">'.format(imagen),
        '<meta name="twitter:card" content="summary_large_image">',
        '',
        '<link rel="icon" type="image/svg+xml" href="favicon.svg">',
        '<link rel="apple-touch-icon" href="favicon.svg">',
        '<link rel="manifest" href="manifest.webmanifest">',
        '<meta name="theme-color" content="#0077b6">',
        '',
        '<link rel="preconnect" href="https://fonts.googleapis.com">',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
        '<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Lora:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet">',
        '<link rel="stylesheet" href="style.css?v={}">'.format(v),
    ]
    if tiene_iconos_fa:
        partes.append('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">')
    partes.append('<script>window.__vSitio={};</script>'.format(v))
    partes.append('<script src="js/sitio.js?v={}" defer></script>'.format(v))
    partes.append('<script src="js/buscador.js?v={}" defer></script>'.format(v))
    # Datos que el código inline de la página necesita tener ya cargados.
    # Van SIN defer a propósito: con defer se ejecutarían después del
    # <script> del final del body y las variables no existirían aún.
    for extra in meta.get("datos", []):
        partes.append('<script src="{}?v={}"></script>'.format(extra, v))
    # Scripts de comportamiento, que sí pueden esperar
    for extra in meta.get("scripts", []):
        partes.append('<script src="{}?v={}" defer></script>'.format(extra, v))
    return "\n    ".join(partes)


def construir_nav(plantilla, pagina):
    """Marca el enlace de la página actual."""
    nav = plantilla
    # aria-current en el enlace exacto
    nav = re.sub(r'(<a href="' + re.escape(pagina) + r'")',
                 r'\1 aria-current="page"', nav, count=1)
    # si el enlace vive dentro de un submenú, marca también el botón que lo abre
    for bloque in re.findall(r'<li class="tiene-submenu">.*?</li>\s*</ul>\s*</li>', nav, re.DOTALL):
        if 'href="{}"'.format(pagina) in bloque:
            nuevo = bloque.replace('class="submenu-toggle"', 'class="submenu-toggle activo"', 1)
            nav = nav.replace(bloque, nuevo, 1)
    return nav


def construir_footer(plantilla, cfg):
    c, s = cfg["contacto"], cfg["sitio"]
    valores = {
        "direccionCalle": c["direccionCalle"],
        "direccionCiudad": c["direccionCiudad"],
        "whatsapp": c["whatsapp"],
        "whatsappVisible": c["whatsappVisible"],
        "instagram": c["instagram"],
        "instagramUrl": c["instagramUrl"],
        "mapsUrl": c["mapsUrl"],
        "anio": s["anioCopyright"],
        "arquidiocesis": s["arquidiocesis"],
        "horariosMisas": html_horarios_misas(cfg),
        "msgGeneral": quote(cfg["whatsappPlantillas"]["general"]["mensaje"]),
    }
    pie = plantilla
    for clave, valor in valores.items():
        pie = pie.replace("{{" + clave + "}}", valor)
    return pie


def construir_tramites(cfg):
    """Tarjetas de trámite que abren WhatsApp con el mensaje ya redactado.

    En Venezuela no hay pago en línea, así que no tiene sentido un
    formulario: el trámite se inicia por WhatsApp y se completa en el
    despacho. Lo que sí evitamos es el ir y venir de preguntas, porque
    el mensaje ya lleva todos los datos que secretaría necesita.
    """
    orden = ["partida-bautismo", "partida-matrimonio", "partida-confirmacion",
             "intencion-misa", "bautizo", "matrimonio", "catequesis",
             "enfermo", "columbario", "grupo"]

    tarjetas = []
    for clave in orden:
        p = cfg["whatsappPlantillas"].get(clave)
        if not p:
            continue
        tarjetas.append(
            '        <a class="tramite" href="{url}" target="_blank" rel="noopener noreferrer">\n'
            '            <span class="tramite-icono" aria-hidden="true">{icono}</span>\n'
            '            <span class="tramite-texto">\n'
            '                <strong>{etiqueta}</strong>\n'
            '                <span>Abre WhatsApp con el mensaje ya escrito.</span>\n'
            '            </span>\n'
            '        </a>'.format(url=wa_url(cfg, clave), icono=p["icono"], etiqueta=p["etiqueta"])
        )

    return (
        '<section class="contenedor" id="tramites">\n'
        '    <h2>Trámites y solicitudes</h2>\n'
        '    <p class="entradilla entradilla-centrada">Toca el trámite que necesitas y se abrirá WhatsApp '
        'con el mensaje ya redactado: solo tienes que rellenar tus datos y enviarlo. '
        'Te responderemos con los pasos a seguir.</p>\n'
        '    <div class="tramites-grid">\n' + "\n\n".join(tarjetas) + '\n    </div>\n'
        '    <div class="aviso-tramites">\n'
        '        <span aria-hidden="true" style="font-size:1.4rem;">ℹ️</span>\n'
        '        <p><strong>El trámite se completa en el despacho parroquial</strong> '
        '(martes a viernes, de 2:00 PM a 5:00 PM). El mensaje de WhatsApp sirve para '
        'adelantar los datos y que te digamos qué traer y cuándo pasar, de modo que '
        'no tengas que venir dos veces.</p>\n'
        '    </div>\n'
        '</section>'
    )


def construir_migas(pagina, meta, paginas):
    """Migas de pan + su JSON-LD. Devuelve '' si la página es de primer nivel."""
    seccion = meta.get("seccion")
    if not seccion:
        return ""
    padre = paginas.get(seccion)
    if not padre:
        return ""
    nombre_padre = padre["titulo"].split("|")[0].strip()
    nombre_actual = meta["titulo"].split("|")[0].split("—")[0].strip()
    return (
        '<nav class="migas" aria-label="Ruta de navegación">\n'
        '    <ol>\n'
        '        <li><a href="index.html">Inicio</a></li>\n'
        '        <li><a href="{}">{}</a></li>\n'
        '        <li><span aria-current="page">{}</span></li>\n'
        '    </ol>\n'
        '</nav>'.format(seccion, nombre_padre, nombre_actual)
    )


def construir_jsonld(cfg, pagina, meta, paginas):
    """schema.org: la parroquia en las páginas clave, migas en las profundas."""
    bloques = []
    s, c, h = cfg["sitio"], cfg["contacto"], cfg["horarios"]

    if pagina in ("index.html", "horarios.html", "contacto.html"):
        misas = [b["schema"] for b in h["misas"]]
        iglesia = {
            "@context": "https://schema.org",
            "@type": "Church",
            "name": s["nombreLargo"],
            "url": s["dominio"] + "/",
            "logo": s["dominio"] + "/favicon.svg",
            "image": s["dominio"] + "/foto-templo.webp",
            "description": paginas["index.html"]["desc"],
            "address": {
                "@type": "PostalAddress",
                "streetAddress": c["direccionCalle"],
                "addressLocality": "Maracaibo",
                "addressRegion": "Zulia",
                "addressCountry": "VE",
            },
            "geo": {
                "@type": "GeoCoordinates",
                "latitude": c["geo"]["lat"],
                "longitude": c["geo"]["lon"],
            },
            "telephone": "+" + c["whatsapp"],
            "sameAs": [c["instagramUrl"]],
            "openingHours": misas,
            "parentOrganization": {"@type": "Organization", "name": s["arquidiocesis"]},
        }
        bloques.append(iglesia)

    seccion = meta.get("seccion")
    if seccion and seccion in paginas:
        dominio = s["dominio"]
        bloques.append({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Inicio", "item": dominio + "/"},
                {"@type": "ListItem", "position": 2,
                 "name": paginas[seccion]["titulo"].split("|")[0].strip(),
                 "item": dominio + "/" + seccion},
                {"@type": "ListItem", "position": 3,
                 "name": meta["titulo"].split("|")[0].split("—")[0].strip(),
                 "item": dominio + "/" + pagina},
            ],
        })

    if not bloques:
        return ""
    return "\n".join(
        '<script type="application/ld+json">\n{}\n</script>'.format(
            json.dumps(b, ensure_ascii=False, indent=2))
        for b in bloques
    )


# ─────────────────────────────────────────────────────────────
#  Limpieza de etiquetas que ahora gestiona el script
# ─────────────────────────────────────────────────────────────

PATRONES_A_QUITAR = [
    r'[ \t]*<title>.*?</title>\n?',
    r'[ \t]*<meta\s+name="description"[^>]*>\n?',
    r'[ \t]*<meta\s+property="og:[^"]*"[^>]*>\n?',
    r'[ \t]*<meta\s+name="twitter:[^"]*"[^>]*>\n?',
    r'[ \t]*<meta\s+name="theme-color"[^>]*>\n?',
    r'[ \t]*<link\s+rel="canonical"[^>]*>\n?',
    r'[ \t]*<link\s+rel="icon"[^>]*>\n?',
    r'[ \t]*<link\s+rel="apple-touch-icon"[^>]*>\n?',
    r'[ \t]*<link\s+rel="manifest"[^>]*>\n?',
    r'[ \t]*<link\s+rel="preconnect"[^>]*>\n?',
    r'[ \t]*<link[^>]*fonts\.googleapis\.com[^>]*>\n?',
    r'[ \t]*<link[^>]*font-awesome[^>]*>\n?',
    r'[ \t]*<link\s+rel="stylesheet"\s+href="style\.css(\?[^"]*)?"[^>]*>\n?',
    r'[ \t]*<script\s+src="js/[^"]*"[^>]*></script>\n?',
    r'[ \t]*<script>window\.__vSitio=\d+;</script>\n?',
    # el antiguo script del badge, repetido en cada página
    r'\s*<script>\s*document\.addEventListener\("DOMContentLoaded",\s*function\(\)\s*\{\s*var expireDate.*?</script>\n?',
]


def limpiar_head(html):
    for patron in PATRONES_A_QUITAR:
        html = re.sub(patron, "", html, flags=re.DOTALL | re.IGNORECASE)
    return html


# ─────────────────────────────────────────────────────────────
#  Retoques sueltos
# ─────────────────────────────────────────────────────────────

def rellenar_enlaces_whatsapp(html, cfg):
    """Pone el href a cualquier <a data-wa="clave">.

    Así los mensajes preescritos viven solo en tools/config.json:
    se escriben una vez y se propagan a todas las páginas.
    """
    def _fix(m):
        etiqueta, clave = m.group(0), m.group(1)
        if clave not in cfg["whatsappPlantillas"]:
            return etiqueta
        url = wa_url(cfg, clave)
        if 'href="' in etiqueta:
            return re.sub(r'href="[^"]*"', 'href="{}"'.format(url), etiqueta, count=1)
        return etiqueta.replace('<a ', '<a href="{}" '.format(url), 1)

    return re.sub(r'<a\s[^>]*data-wa="([a-z-]+)"[^>]*>', _fix, html)


def arreglar_target_blank(html):
    """Añade rel="noopener noreferrer" a los enlaces que abren pestaña nueva."""
    def _fix(m):
        etiqueta = m.group(0)
        if "rel=" in etiqueta:
            return etiqueta
        return etiqueta[:-1].rstrip() + ' rel="noopener noreferrer">'
    return re.sub(r'<a\s[^>]*target="_blank"[^>]*>', _fix, html)


def anadir_lazy(html):
    """loading="lazy" y decoding="async" en las imágenes.

    Se dejan fuera las del principio de la página (logo y portada): esas
    tienen que cargar cuanto antes porque son lo primero que se ve.
    El límite es el final del primer <header>; si no hay, la primera imagen.
    """
    fin_cabecera = html.find("</header>")
    if fin_cabecera == -1:
        primera = re.search(r'<img\s[^>]*>', html)
        fin_cabecera = primera.end() if primera else 0

    imgs = list(re.finditer(r'<img\s[^>]*>', html))
    for m in reversed(imgs):
        etiqueta = m.group(0)
        nueva = etiqueta
        arriba_del_todo = m.start() < fin_cabecera
        prioritaria = 'fetchpriority="high"' in etiqueta

        if arriba_del_todo or prioritaria:
            # Si en una pasada anterior se le puso lazy, se lo quitamos
            nueva = re.sub(r'\s+loading="lazy"', '', nueva)
        elif 'loading=' not in nueva:
            nueva = nueva[:-1].rstrip() + ' loading="lazy">'

        if 'decoding=' not in nueva:
            nueva = nueva[:-1].rstrip() + ' decoding="async">'
        if nueva != etiqueta:
            html = html[:m.start()] + nueva + html[m.end():]
    return html


def envolver_main(html):
    """Mete el contenido entre el nav y el pie dentro de <main id="contenido">."""
    if '<main id="contenido">' in html:
        return html
    fin_nav = MARCA_FIN.format("nav")
    ini_pie = MARCA_INI.format("footer")
    if fin_nav not in html or ini_pie not in html:
        return html
    html = html.replace(fin_nav, fin_nav + '\n\n<main id="contenido">', 1)
    html = html.replace(ini_pie, '</main>\n\n' + ini_pie, 1)
    return html


# ─────────────────────────────────────────────────────────────
#  Proceso principal
# ─────────────────────────────────────────────────────────────

def procesar(ruta, cfg, paginas, nav_tpl, pie_tpl, revisar=False):
    pagina = ruta.name
    meta = paginas.get(pagina)
    if not meta:
        return "sin metadatos en paginas.json — omitida"

    original = ruta.read_text(encoding="utf-8")
    html = original

    tiene_iconos_fa = bool(re.search(r'class="[^"]*\bfa[srlbd]?\b[^"]*fa-', html))

    # ── head ──────────────────────────────────────────────
    bloque_head = construir_head(cfg, pagina, meta, tiene_iconos_fa)
    html, ok = reemplazar_bloque(html, "meta", "    " + bloque_head)
    if not ok:
        html = limpiar_head(html)
        ancla = re.search(r'<meta\s+name="viewport"[^>]*>', html)
        if not ancla:
            return "ERROR: no encuentro <meta viewport>"
        ins = envolver("meta", "    " + bloque_head)
        html = html[:ancla.end()] + "\n    " + ins + html[ancla.end():]
    else:
        html = limpiar_head_fuera_de_marcas(html)

    # ── nav ───────────────────────────────────────────────
    nav = construir_nav(nav_tpl, pagina)
    html, ok = reemplazar_bloque(html, "nav", nav)
    if not ok:
        patron_nav = re.compile(r'(<a class="saltar-contenido".*?</a>\s*)?<nav\b.*?</nav>', re.DOTALL)
        if not patron_nav.search(html):
            return "ERROR: no encuentro el <nav>"
        html = patron_nav.sub(lambda _: envolver("nav", nav), html, count=1)

    # ── pie ───────────────────────────────────────────────
    pie = construir_footer(pie_tpl, cfg)
    html, ok = reemplazar_bloque(html, "footer", pie)
    if not ok:
        patron_pie = re.compile(r'<footer\b.*?</footer>', re.DOTALL)
        if not patron_pie.search(html):
            return "ERROR: no encuentro el <footer>"
        html = patron_pie.sub(lambda _: envolver("footer", pie), html, count=1)

    # ── main, migas, datos estructurados ──────────────────
    html = envolver_main(html)

    migas = construir_migas(pagina, meta, paginas)
    html, ok = reemplazar_bloque(html, "migas", migas)
    if not ok and migas:
        html = html.replace('<main id="contenido">',
                            '<main id="contenido">\n' + envolver("migas", migas), 1)

    # Bloque de trámites por WhatsApp (solo donde se pida en paginas.json)
    if meta.get("tramites"):
        html, ok = reemplazar_bloque(html, "tramites", construir_tramites(cfg))
        if not ok:
            return "ERROR: falta <!--#tramites--><!--/#tramites--> en la página"

    jsonld = construir_jsonld(cfg, pagina, meta, paginas)
    html, ok = reemplazar_bloque(html, "jsonld", jsonld)
    if not ok and jsonld:
        html = html.replace("</body>", envolver("jsonld", jsonld) + "\n</body>", 1)

    # ── retoques ──────────────────────────────────────────
    html = rellenar_enlaces_whatsapp(html, cfg)
    html = arreglar_target_blank(html)
    html = anadir_lazy(html)
    html = re.sub(r'\n{4,}', '\n\n\n', html)

    if html == original:
        return None
    if not revisar:
        ruta.write_text(html, encoding="utf-8", newline="\n")
    return "actualizada"


def generar_sitemap(cfg, paginas):
    """Reconstruye sitemap.xml con TODAS las páginas, no solo un puñado."""
    dominio = cfg["sitio"]["dominio"]

    # Cuanto más arriba en la jerarquía, más prioridad.
    prioridades = {
        "index.html": "1.0",
        "horarios.html": "0.9",
        "eventos.html": "0.9",
        "sacramentos.html": "0.9",
        "contacto.html": "0.8",
        "nosotros.html": "0.8",
        "comunidad.html": "0.8",
        "evangelizacion.html": "0.8",
        "oracion.html": "0.8",
    }

    filas = []
    for pagina, meta in paginas.items():
        if pagina.startswith("_"):
            continue
        if not (RAIZ / pagina).exists():
            continue
        loc = dominio + "/" + ("" if pagina == "index.html" else pagina)
        prioridad = prioridades.get(pagina, "0.6" if meta.get("seccion") else "0.7")
        filas.append("   <url>\n      <loc>{}</loc>\n      <priority>{}</priority>\n   </url>".format(loc, prioridad))

    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(filas) + "\n</urlset>\n")

    (RAIZ / "sitemap.xml").write_text(xml, encoding="utf-8", newline="\n")
    return len(filas)


def generar_indice_busqueda(paginas):
    """Construye js/indice-busqueda.js leyendo el contenido real de cada página.

    Guarda título, descripción, los encabezados y un extracto del texto.
    Con 35 páginas el índice pesa unas pocas decenas de KB, así que el
    buscador funciona entero en el navegador, sin servidor.
    """
    registros = []

    for pagina, meta in paginas.items():
        if pagina.startswith("_"):
            continue
        ruta = RAIZ / pagina
        if not ruta.exists():
            continue

        html = ruta.read_text(encoding="utf-8")

        # Fuera lo que no es contenido: menús, pie, scripts y estilos
        cuerpo = html
        for nombre in ("meta", "nav", "footer", "jsonld", "migas"):
            cuerpo = re.sub(re.escape(MARCA_INI.format(nombre)) + r".*?" + re.escape(MARCA_FIN.format(nombre)),
                            " ", cuerpo, flags=re.DOTALL)
        cuerpo = re.sub(r"<script.*?</script>", " ", cuerpo, flags=re.DOTALL | re.IGNORECASE)
        cuerpo = re.sub(r"<style.*?</style>", " ", cuerpo, flags=re.DOTALL | re.IGNORECASE)

        encabezados = [re.sub(r"<[^>]+>", "", h).strip()
                       for h in re.findall(r"<h[1-4][^>]*>(.*?)</h[1-4]>", cuerpo, re.DOTALL | re.IGNORECASE)]
        encabezados = [h for h in (re.sub(r"\s+", " ", e) for e in encabezados) if h]

        texto = re.sub(r"<[^>]+>", " ", cuerpo)
        texto = re.sub(r"&[a-z]+;|&#\d+;", " ", texto)
        texto = re.sub(r"\s+", " ", texto).strip()

        registros.append({
            "u": pagina,
            "t": meta["titulo"].split("|")[0].strip(),
            "d": meta["desc"],
            "h": encabezados[:24],
            "x": texto[:1400],
            "s": meta.get("seccion") or "",
        })

    js = ("/* Generado por tools/sincronizar.py — no editar a mano.\n"
          "   Se reconstruye solo cada vez que se ejecuta el script. */\n"
          "const INDICE_BUSQUEDA = " +
          json.dumps(registros, ensure_ascii=False, separators=(",", ":")) + ";\n")

    (RAIZ / "js").mkdir(exist_ok=True)
    (RAIZ / "js" / "indice-busqueda.js").write_text(js, encoding="utf-8", newline="\n")
    return len(registros), len(js)


def actualizar_version_sw(cfg):
    """Mantiene sw.js en la misma versión que el resto del sitio.

    Si no se toca, el navegador seguiría sirviendo la caché vieja y el
    visitante vería el diseño antiguo indefinidamente.
    """
    ruta = RAIZ / "sw.js"
    if not ruta.exists():
        return None
    v = "v{}".format(cfg.get("version", 1))
    txt = ruta.read_text(encoding="utf-8")
    nuevo = re.sub(r"const VERSION = '[^']*';", "const VERSION = '{}';".format(v), txt, count=1)
    if nuevo != txt:
        ruta.write_text(nuevo, encoding="utf-8", newline="\n")
    return v


def generar_robots(cfg):
    txt = ("User-agent: *\n"
           "Allow: /\n\n"
           "Sitemap: {}/sitemap.xml\n".format(cfg["sitio"]["dominio"]))
    (RAIZ / "robots.txt").write_text(txt, encoding="utf-8", newline="\n")


def limpiar_head_fuera_de_marcas(html):
    """En re-ejecuciones, quita etiquetas gestionadas que hayan quedado sueltas
    fuera del bloque <!--#meta-->."""
    ini, fin = MARCA_INI.format("meta"), MARCA_FIN.format("meta")
    if ini not in html or fin not in html:
        return html
    a = html.index(ini)
    b = html.index(fin) + len(fin)
    cabeza, medio, cola = html[:a], html[a:b], html[b:]
    corte = cola.find("</head>")
    if corte == -1:
        return html
    resto_head, tras_head = cola[:corte], cola[corte:]
    return cabeza + medio + limpiar_head(resto_head) + tras_head


def main():
    # La consola de Windows usa cp1252 por defecto y se atraganta con los acentos
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

    revisar = "--revisar" in sys.argv

    cfg = cargar_json(TOOLS / "config.json")
    paginas = cargar_json(TOOLS / "paginas.json")
    nav_tpl = (PARTIALS / "nav.html").read_text(encoding="utf-8").strip()
    pie_tpl = (PARTIALS / "footer.html").read_text(encoding="utf-8").strip()

    archivos = sorted(p for p in RAIZ.glob("*.html"))
    cambiadas = omitidas = errores = 0

    print("Sincronizando {} páginas{}\n".format(
        len(archivos), " (modo revisión, no se escribe nada)" if revisar else ""))

    for ruta in archivos:
        res = procesar(ruta, cfg, paginas, nav_tpl, pie_tpl, revisar)
        if res is None:
            print("  .   {:<34} sin cambios".format(ruta.name))
        elif res.startswith("ERROR"):
            print("  !!  {:<34} {}".format(ruta.name, res))
            errores += 1
        elif "omitida" in res:
            print("  --  {:<34} {}".format(ruta.name, res))
            omitidas += 1
        else:
            print("  OK  {:<34} {}".format(ruta.name, res))
            cambiadas += 1

    print("\n{} actualizadas · {} omitidas · {} con error".format(cambiadas, omitidas, errores))

    if not revisar:
        n = generar_sitemap(cfg, paginas)
        generar_robots(cfg)
        print("sitemap.xml regenerado con {} páginas · robots.txt actualizado".format(n))

        n_idx, peso = generar_indice_busqueda(paginas)
        print("índice del buscador: {} páginas, {:.0f} KB".format(n_idx, peso / 1024))

        v_sw = actualizar_version_sw(cfg)
        if v_sw:
            print("service worker en la versión {}".format(v_sw))

    if errores:
        sys.exit(1)


if __name__ == "__main__":
    main()
