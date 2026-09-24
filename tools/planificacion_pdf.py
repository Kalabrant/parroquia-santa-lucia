#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera planificacion-pastoral-agosto-diciembre-2026.pdf.

    py tools/planificacion_pdf.py                 -> deja fuera lo ya celebrado
    py tools/planificacion_pdf.py --desde 2026-10-01
    py tools/planificacion_pdf.py --todo          -> el documento completo

El PDF que descarga la gente desde eventos.html sale de aquí. Cuando cambie
una actividad, se corrige en la tabla CALENDARIO de este archivo y se vuelve a
ejecutar el script; así el PDF y la agenda de la web no se van separando.

Las actividades anteriores a la fecha de corte se omiten (es lo que pidió el
Consejo: que el documento muestre solo lo que queda por delante). Un mes que
se queda sin actividades desaparece del documento.

Necesita Pillow y ReportLab:  py -m pip install Pillow reportlab
"""

import argparse
import datetime as dt
import sys
from pathlib import Path

try:
    from reportlab.lib import colors
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.platypus import (BaseDocTemplate, CondPageBreak, Frame,
                                    KeepTogether, PageTemplate, Paragraph, Spacer,
                                    Table, TableStyle)
except ImportError:
    sys.exit("Falta ReportLab. Instálalo con:  py -m pip install reportlab")

RAIZ = Path(__file__).resolve().parent.parent
SELLO = Path(__file__).resolve().parent / "sello-parroquia.png"
SALIDA = RAIZ / "planificacion-pastoral-agosto-diciembre-2026.pdf"

AZUL = colors.HexColor("#1F3864")     # cabecera de las tablas
FILA_ALT = colors.HexColor("#EDF1F7")  # fila alterna
BORDE = colors.HexColor("#BFC7D6")

MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
         'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']


# ═══════════════════════════════════════════════════════════════════
#  EL CALENDARIO
#  Cada actividad: (fecha, fecha_fin, «Fecha», «Fiesta / Actividad»,
#                   «Actividades», «Responsables»)
#  fecha_fin solo se usa en las actividades de varios días: mientras no
#  haya pasado, la actividad sigue apareciendo.
# ═══════════════════════════════════════════════════════════════════
CALENDARIO = [
    {
        "mes": "AGOSTO",
        "subtitulo": "Mes de la Asunción",
        "filas": [
            ("2026-08-14", "2026-08-16", "Viernes 14 al\ndomingo 16",
             "Retiro de los niños de Serafines",
             "Fin de semana de retiro",
             "Serafines"),
            ("2026-08-15", None, "Sábado 15",
             "Solemnidad de la Asunción de la Santísima Virgen María",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)",
             "Legión de María"),
            ("2026-08-29", None, "Sábado 29",
             "Novena a la Natividad — Día 1.º",
             "Rezo de la novena y Eucaristía (6:00 p. m.)\nCanta: María Parra",
             "Legión de María"),
            ("2026-08-30", None, "Domingo 30",
             "Novena — Día 2.º",
             "Novena y Eucaristía\nCanta: Gina Guadama",
             "Sociedad de Santa Lucía, Servidores de Santa Lucía, Sociedad de San José "
             "y Vasallos de San Benito"),
            ("2026-08-30", None, "Domingo 30",
             "Jornada de Convivencia Inter-Grupos",
             "Desde las 6:00 p. m., después de la santa misa, en la sede de la Banda "
             "Rafael Urdaneta. Compartir fraterno y «fiesta de traje», con aporte de cada grupo",
             "Karina Medina y Víctor García"),
            ("2026-08-31", None, "Lunes 31",
             "Sin novena",
             "Día de descanso del Párroco; la novena se reanuda el martes 1 de septiembre",
             "—"),
        ],
    },
    {
        "mes": "SEPTIEMBRE",
        "subtitulo": "Mes de la Biblia",
        "filas": [
            ("2026-09-01", None, "Martes 1",
             "Novena — Día 3.º\nApertura del Mes de la Biblia",
             "Novena y Eucaristía\nCanta: Coro Camino de Luz\nMisa de apertura y "
             "entronización de la Palabra",
             "Cursillos de Cristiandad, Ministerio de Catequesis y Flores de Misericordia"),
            ("2026-09-02", None, "Miércoles 2",
             "Novena — Día 4.º",
             "Novena y Eucaristía\nCanta: Coro Juvenil",
             "Sociedades del Corazón de Jesús, Jesús de la Divina Misericordia, "
             "Nuestra Señora del Perpetuo Socorro y Santa Rita de Casia"),
            ("2026-09-03", None, "Jueves 3",
             "Novena — Día 5.º\n«Jueves de Palabra» 1",
             "Novena y Eucaristía\nCanta: María Parra\nFormación bíblica (7:00 p. m.)",
             "Ministerio de Liturgia, Ostiarios, Servidores del Altar y Asociación "
             "Virgen de la Luz\nPárroco"),
            ("2026-09-04", None, "Viernes 4",
             "Novena — Día 6.º",
             "Novena y Eucaristía\nCanta: Coro Juvenil",
             "Hermandad de Emaús (hombres y mujeres)"),
            ("2026-09-05", None, "Sábado 5",
             "Novena — Día 7.º",
             "Novena y Eucaristía\nCanta: María Parra",
             "El Llamado de Samuel, Serafines y Pastoral Juvenil"),
            ("2026-09-06", None, "Domingo 6",
             "Novena — Día 8.º",
             "Novena y Eucaristía\nCanta: Gina Guadama",
             "Cáritas Parroquial"),
            ("2026-09-07", None, "Lunes 7",
             "Novena — Día 9.º",
             "Novena y misa de primeras vísperas\nCanta: Coro Camino de Luz",
             "Legión de María"),
            ("2026-09-08", None, "Martes 8",
             "SOLEMNIDAD DE LA NATIVIDAD DE LA SANTÍSIMA VIRGEN MARÍA",
             "Misa solemne (6:00 p. m.) y procesión",
             "Servidores de Santa Lucía y Flores de Misericordia"),
            ("2026-09-10", None, "Jueves 10",
             "«Jueves de Palabra» 2",
             "Formación bíblica (7:00 p. m.)",
             "Párroco"),
            ("2026-09-11", None, "Viernes 11",
             "Nuestra Señora de Coromoto",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)",
             "Legión de María"),
            ("2026-09-15", None, "Martes 15",
             "Nuestra Señora de los Dolores",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)",
             "Legión de María"),
            ("2026-09-16", None, "Miércoles 16",
             "20.º Aniversario Sacerdotal del Párroco",
             "Eucaristía de acción de gracias en la Basílica (5:00 p. m.), con los "
             "compañeros de ordenación. Ese día no se anotan intenciones",
             "Párroco"),
            ("2026-09-17", None, "Jueves 17",
             "Celebración parroquial del 20.º aniversario",
             "Después de la Hora Santa, compartir con la comunidad. Sustituye la "
             "formación ordinaria de ese jueves",
             "Todos los grupos"),
            ("2026-09-18", "2026-09-20", "Viernes 18 al\ndomingo 20",
             "Tercer Retiro de jóvenes «El Llamado de Samuel»",
             "Sede de la Banda Rafael Urdaneta",
             "El Llamado de Samuel"),
            ("2026-09-24", None, "Jueves 24",
             "«Jueves de Palabra» 3",
             "Formación bíblica (7:00 p. m.): el Evangelio",
             "Párroco"),
            ("2026-09-26", None, "Sábado 26",
             "Llegada de los seminaristas",
             "Los seminaristas del Seminario Mayor Santo Tomás de Aquino acompañan el "
             "encuentro de la Palabra y el curso de liturgia (9:00 a. m.)",
             "Seminaristas y Proyecto Palabra"),
            ("2026-09-29", None, "Martes 29",
             "Santos Arcángeles",
             "Santa Misa (6:00 p. m.) y bendición de los rosarios de San Miguel",
             "Servidores del Altar"),
        ],
    },
    {
        "mes": "OCTUBRE",
        "subtitulo": "Mes de las Misiones y del Santo Rosario",
        "filas": [
            ("2026-10-01", None, "Jueves 1", "Santa Teresita del Niño Jesús\n«Jueves de Palabra»",
             "Santa Misa (6:00 p. m.), con su imagen en lugar destacado y flores\n"
             "Charla sobre su espiritualidad (7:00 p. m.)",
             "Párroco o sacerdote invitado"),
            ("2026-10-02", None, "Viernes 2", "Santos Ángeles Custodios\nProyecto Palabra",
             "Misa con devoción especial a los Ángeles Custodios\nEl Párroco celebra la "
             "Palabra en la comunidad de la Zona de la Natividad (7:00 p. m.)",
             "Servidores del Altar\nLegión de María"),
            ("2026-10-03", None, "Sábado 3", "Venta de almuerzo\nHora Santa de los sábados",
             "Venta de almuerzo pro «María Móvil» para los traslados de la réplica\n"
             "Comienza la Hora Santa de los sábados (7:00 p. m.)\nLos seminaristas "
             "comienzan el visiteo en los sectores",
             "Sociedades de damas y Servidores de Santa Lucía\nCoros parroquiales"),
            ("2026-10-04", None, "Domingo 4", "San Francisco de Asís",
             "Eucaristías dominicales\nVIII centenario de su muerte", "—"),
            ("2026-10-07", None, "Miércoles 7", "Nuestra Señora del Rosario",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)", "Legión de María"),
            ("2026-10-08", None, "Jueves 8", "«Jueves de Palabra» 4",
             "Lectio divina (7:00 p. m.), cierre del ciclo", "Párroco"),
            ("2026-10-10", None, "Sábado 10", "Reparto de alimentos",
             "Jornada de reparto para los más necesitados",
             "Cáritas Parroquial, con el apoyo de la Hermandad de Samuel"),
            ("2026-10-15", None, "Jueves 15", "Santa Teresa de Jesús\nAniversario de Cursillos",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)", "Cursillos de Cristiandad"),
            ("2026-10-17", None, "Sábado 17", "Aniversario de la Sociedad de la Divina Misericordia",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)",
             "Sociedad de la Divina Misericordia"),
            ("2026-10-24", None, "Sábado 24", "Gran Misión Parroquial",
             "Visiteo por los sectores para invitar a las comunidades de la Palabra; "
             "se organizará más adelante", "Todos los grupos"),
            ("2026-10-31", None, "Sábado 31", "Fiesta de Holywins",
             "Santa Misa (6:00 p. m.) y fiesta para los niños",
             "Ministerio de Catequesis"),
        ],
    },
    {
        "mes": "NOVIEMBRE",
        "subtitulo": "Mes de los Santos y de La Chinita",
        "filas": [
            ("2026-11-01", None, "Domingo 1", "Solemnidad de Todos los Santos",
             "Eucaristías dominicales", "Servidores del Altar"),
            ("2026-11-02", None, "Lunes 2", "Conmemoración de los Fieles Difuntos",
             "Una sola misa, por los difuntos", "Servidores del Altar"),
            ("2026-11-12", None, "Jueves 12", "Anuncio de las Fiestas Patronales",
             "Entrega de pasquines", "Todos los grupos de apostolado"),
            ("2026-11-13", None, "Viernes 13",
             "Juramentación de los Servidores y de la Sociedad de Santa Lucía",
             "Rosario (5:30 p. m.)\nSanta Misa (6:00 p. m.)\nLa bendición, en la "
             "Eucaristía que presida el Obispo",
             "Servidores y Sociedad de Santa Lucía"),
            ("2026-11-14", None, "Sábado 14", "BAJADA DE SANTA LUCÍA",
             "Eucaristía por la mañana\nBajada por la tarde, con homenaje gaitero\n"
             "Recorrido: Natividad, Federación, Dos Rosas, Nueva Venecia, Belén, "
             "Santa Lucía, Nueva Belloso, Casanova, Natividad y templo",
             "Servidores de Santa Lucía"),
            ("2026-11-18", None, "Miércoles 18", "Solemnidad de Nuestra Señora de Chiquinquirá",
             "Misa parroquial (9:00 a. m.) y traslado a la Basílica", "Servidores del Altar"),
            ("2026-11-20", "2026-11-22", "Viernes 20 al\ndomingo 22",
             "Cuarenta Horas\nSolemnidad de Cristo Rey",
             "Adoración al Santísimo en la jornada del apostolado seglar",
             "Sra. Verónica Rosales, Sr. Gustavo Velazco y Sra. Gisela Aranguren"),
            ("2026-11-22", None, "Domingo 22", "Cristo Rey del Universo\nSanta Cecilia",
             "Eucaristías dominicales\nEncuentro con los coros parroquiales tras la "
             "misa de 6:00 p. m.\nLa réplica en Guarero (9:00 a. m.) y Paraguaipoa "
             "(5:00 p. m.)", "Coros Parroquiales\nServidores de Santa Lucía"),
            ("2026-11-27", None, "Viernes 27", "Peregrinación de la réplica",
             "Parroquia Cristo Rey, Curva de Molina (6:00 p. m.)",
             "Servidores de Santa Lucía"),
            ("2026-11-28", None, "Sábado 28", "Encuentro de Santa Lucía y La Chinita",
             "La réplica en Potrerito (mañana) y El Carmelo (Eucaristía, tarde)\n"
             "Encuentro con la procesión patronal de La Chinita (8:00 p. m.)",
             "Servidores de Santa Lucía y Flores de Misericordia"),
            ("2026-11-29", None, "Domingo 29", "I Domingo de Adviento",
             "Eucaristías dominicales y bendición de las coronas\nLa réplica en San "
             "Benito del Bajo y Santísimo Cristo de San Francisco (por confirmar)",
             "Servidores del Altar\nServidores de Santa Lucía"),
        ],
    },
    {
        "mes": "DICIEMBRE",
        "subtitulo": "Adviento, Fiestas Patronales y Navidad",
        "filas": [
            ("2026-12-04", "2026-12-12", "Viernes 4 al\nsábado 12", "Novena a Santa Lucía",
             "Rezo de la novena (5:30 p. m.) y Eucaristía (6:00 p. m.), con un grupo "
             "responsable cada día", "Todos los grupos, por días"),
            ("2026-12-05", "2026-12-06", "Sábado 5 y\ndomingo 6", "Peregrinación de la réplica",
             "El Moján: salida el sábado por la mañana; Eucaristía el domingo (6:00 p. m.)",
             "Servidores de Santa Lucía"),
            ("2026-12-08", None, "Martes 8",
             "Solemnidad de la Inmaculada Concepción\nCumpleaños del Párroco",
             "Novena (5:30 p. m.) y Eucaristía (6:00 p. m.)\nTortazo comunitario",
             "Sociedades y Servidores del Altar"),
            ("2026-12-11", None, "Viernes 11", "Peregrinación de la réplica",
             "Iglesia Nuestra Señora de Guadalupe (5:00 p. m.)",
             "Servidores de Santa Lucía"),
            ("2026-12-12", None, "Sábado 12", "Novena — último día\nMañanitas a Santa Lucía",
             "Novena, Eucaristía y mañanitas (11:00 p. m.)",
             "Servidores y Sociedad de Santa Lucía"),
            ("2026-12-13", None, "Domingo 13", "SOLEMNIDAD DE SANTA LUCÍA",
             "Eucaristías solemnes y procesión\nRecorrido: Múcura, Candelaria, Plaza de "
             "la Muñeca, San Ramón, Nueva Belloso, San Luis, Belén, San Pablo, El Rosal, "
             "El Valle, Santa Lucía, Triana, San Antonio, Santa Genoveva, Nueva Belloso "
             "y Santa Lucía hasta el templo",
             "Todos los grupos parroquiales"),
            ("2026-12-14", None, "Lunes 14", "Ofrenda de los chimbángueles",
             "Ofrenda a Santa Lucía", "—"),
            ("2026-12-15", "2026-12-23", "Martes 15 al\nmiércoles 23", "Misas de aguinaldo",
             "Eucaristía (6:00 a. m.), con una intención y un grupo responsable cada día",
             "Por grupos"),
            ("2026-12-24", None, "Jueves 24", "Nochebuena",
             "Misa solemne de Nochebuena (7:00 p. m.)", "Servidores del Altar"),
            ("2026-12-25", None, "Viernes 25", "Solemnidad de la Natividad del Señor",
             "Eucaristía solemne (6:00 p. m.)", "Servidores del Altar"),
            ("2026-12-27", None, "Domingo 27", "Fiesta de la Sagrada Familia",
             "Eucaristías dominicales y bendición para las familias",
             "Servidores del Altar"),
        ],
    },
]

CRITERIOS = [
    "Novena de la Natividad: comienza el sábado 29 de agosto y concluye el lunes 7 de "
    "septiembre, omitiendo el lunes 31 de agosto por corresponder al día de descanso del "
    "Párroco. Cada día lo anima un grupo de la parroquia, y los coros y cantores se alternan "
    "durante los nueve días y el día de la fiesta.",

    "Mes de la Biblia: todo septiembre, con misa de apertura y entronización de la Palabra el "
    "martes 1 y el ciclo «Jueves de Palabra», que por haberse corrido termina en octubre: el "
    "Evangelio el jueves 24 de septiembre, Santa Teresita el jueves 1 de octubre y la lectio "
    "divina el jueves 8 de octubre. El jueves 17 se sustituyó por la celebración del "
    "aniversario sacerdotal.",

    "Horas Santas: la de los jueves la asumen por turno los grupos de apostolado y "
    "hermandades, con su coro; coordina la Sra. Ana Lucía Nava. Desde el sábado 3 de "
    "octubre hay una segunda Hora Santa los sábados a las 7:00 p. m.",

    "Fiestas patronales: lema «150 años fieles a la tradición, abiertos a la misión». La "
    "réplica de la imagen peregrina por parroquias lejanas entre el 22 de noviembre y el 11 "
    "de diciembre; la imagen original no sale del templo.",

    "Cuarenta Horas: se trasladan a la solemnidad de Cristo Rey, fuera de la novena de Santa "
    "Lucía. Los turnos de madrugada los cubren solo adultos; si no pueden cubrirse, el "
    "Santísimo se reserva y la adoración sigue de día.",

    "Ciento cincuenta años de la parroquia: la celebración central será el sábado 20 de marzo "
    "de 2027, con misa solemne presidida por el Obispo, y los festejos mayores, del lunes 5 "
    "al sábado 10 de abril de 2027, II Semana de Pascua. Coordinador general: Sr. Manuel Badell.",
]

PENDIENTES = [
    "Organización de la Gran Misión del sábado 24 de octubre.",
    "Fecha de la bendición de los Servidores y de la Sociedad de Santa Lucía por el Obispo.",
    "Confirmación de San Benito del Bajo y del Santísimo Cristo de San Francisco para el "
    "domingo 29 de noviembre.",
    "Distribución por grupos de los nueve días de la novena a Santa Lucía y de las nueve "
    "misas de aguinaldo.",
    "Vehículo para los traslados de la réplica, que indicarán los Servidores de Santa Lucía.",
    "Propuesta de rally de la Pastoral Juvenil para Navidad.",
    "Reactivación del grupo de mensajería parroquial y designación de quien lo administre.",
]


# ═══════════════════════════════════════════════════════════════════
#  ESTILOS
# ═══════════════════════════════════════════════════════════════════
def estilos():
    base = ParagraphStyle('base', fontName='Times-Roman', fontSize=10.5, leading=14)
    return {
        'titulo': ParagraphStyle('titulo', base, fontName='Times-Bold', fontSize=17,
                                 leading=21, alignment=TA_CENTER, textColor=AZUL,
                                 spaceAfter=4),
        'subtitulo': ParagraphStyle('subtitulo', base, fontName='Times-Italic', fontSize=12.5,
                                    leading=16, alignment=TA_CENTER, textColor=AZUL,
                                    spaceAfter=2),
        'lema': ParagraphStyle('lema', base, fontName='Times-Italic', fontSize=9.5,
                               leading=13, alignment=TA_CENTER, textColor=colors.HexColor("#444444"),
                               spaceAfter=16),
        'apartado': ParagraphStyle('apartado', base, fontName='Times-Bold', fontSize=11.5,
                                   leading=15, textColor=AZUL, spaceBefore=12, spaceAfter=6),
        'parrafo': ParagraphStyle('parrafo', base, alignment=TA_JUSTIFY, spaceAfter=8),
        'vineta': ParagraphStyle('vineta', base, alignment=TA_JUSTIFY, spaceAfter=7,
                                 leftIndent=12, bulletIndent=0),
        'mes': ParagraphStyle('mes', base, fontName='Times-Bold', fontSize=14, leading=18,
                              alignment=TA_CENTER, textColor=AZUL, spaceBefore=16, spaceAfter=2),
        'mes_sub': ParagraphStyle('mes_sub', base, fontName='Times-Italic', fontSize=10,
                                  leading=13, alignment=TA_CENTER,
                                  textColor=colors.HexColor("#444444"), spaceAfter=8),
        'th': ParagraphStyle('th', base, fontName='Times-Bold', fontSize=9.5, leading=12,
                             alignment=TA_CENTER, textColor=colors.white),
        'td': ParagraphStyle('td', base, fontSize=9, leading=11.5),
        'td_fuerte': ParagraphStyle('td_fuerte', base, fontName='Times-Bold', fontSize=9,
                                    leading=11.5),
        'firma': ParagraphStyle('firma', base, alignment=TA_CENTER, spaceBefore=26),
    }


def membrete(canvas, doc):
    """Sello, encabezado y pie, iguales en todas las páginas."""
    canvas.saveState()
    canvas.drawImage(str(SELLO), 71.75, 792 - 156.9, width=122.15, height=120.45,
                     mask='auto', preserveAspectRatio=True)
    canvas.setFont('Times-Roman', 15)
    canvas.setFillColor(colors.black)
    lineas = ["ARQUIDIÓCESIS DE MARACAIBO", "PARROQUIA ECLESIÁSTICA DE",
              "SANTA LUCÍA", "MARACAIBO – ESTADO ZULIA", "VENEZUELA"]
    y = 792 - 54
    for linea in lineas:
        canvas.drawCentredString(373, y - 12, linea)
        y -= 20

    canvas.setStrokeColor(BORDE)
    canvas.setLineWidth(0.6)
    canvas.line(72, 60, 540, 60)
    canvas.setFont('Times-Roman', 9.5)
    canvas.setFillColor(colors.HexColor("#333333"))
    canvas.drawCentredString(306, 46, "Av. 3 con calle 90, C. 90, Maracaibo 4001, Zulia")
    if doc.page > 1:
        canvas.drawRightString(540, 46, str(doc.page))
    canvas.restoreState()


DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo']


def fecha_larga(f):
    return f"{f.day} de {MESES[f.month - 1]} de {f.year}"


def fecha_con_dia(f):
    return f"el {DIAS[f.weekday()]} {f.day} de {MESES[f.month - 1]}"


def tabla_mes(mes, est):
    """Devuelve los flowables de un mes, o None si no le queda ninguna actividad."""
    if not mes["filas"]:
        return None

    cabecera = [Paragraph(t, est['th']) for t in
                ("Fecha", "Fiesta / Actividad", "Actividades", "Responsables")]
    datos = [cabecera]
    for _, _, fecha, actividad, acciones, resp in mes["filas"]:
        datos.append([
            Paragraph(fecha.replace("\n", "<br/>"), est['td']),
            Paragraph(actividad.replace("\n", "<br/>"), est['td_fuerte']),
            Paragraph(acciones.replace("\n", "<br/>"), est['td']),
            Paragraph(resp.replace("\n", "<br/>"), est['td']),
        ])

    tabla = Table(datos, colWidths=[74, 122, 138, 134], repeatRows=1, hAlign='CENTER')
    estilo = [
        ('BACKGROUND', (0, 0), (-1, 0), AZUL),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('GRID', (0, 0), (-1, -1), 0.4, BORDE),
        ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ('RIGHTPADDING', (0, 0), (-1, -1), 6),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    for i in range(1, len(datos)):
        if i % 2 == 0:
            estilo.append(('BACKGROUND', (0, i), (-1, i), FILA_ALT))
    tabla.setStyle(TableStyle(estilo))

    return [
        # Que el nombre del mes no se quede solo al pie de una página
        CondPageBreak(120),
        KeepTogether([
            Paragraph(mes["mes"], est['mes']),
            Paragraph(f"({mes['subtitulo']})", est['mes_sub']),
        ]),
        tabla,
    ]


def construir(corte, todo=False):
    est = estilos()
    hoy = dt.date.today()

    # Se van las actividades ya celebradas; las de varios días aguantan
    # hasta que pasa el último.
    meses = []
    for mes in CALENDARIO:
        filas = []
        for fila in mes["filas"]:
            fin = dt.date.fromisoformat(fila[1] or fila[0])
            if todo or fin >= corte:
                filas.append(fila)
        if filas:
            meses.append({**mes, "filas": filas})

    primera = meses[0]["filas"][0] if meses else None
    desde_txt = (fecha_con_dia(dt.date.fromisoformat(primera[0])) if primera
                 else "el cierre del año")

    doc = BaseDocTemplate(
        str(SALIDA), pagesize=letter,
        leftMargin=72, rightMargin=72, topMargin=186, bottomMargin=72,
        title="Planificación Pastoral Agosto – Diciembre de 2026",
        author="Parroquia Eclesiástica de Santa Lucía · Maracaibo",
        subject="Programación pastoral aprobada por el Consejo Pastoral Parroquial",
    )
    marco = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id='cuerpo')
    doc.addPageTemplates([PageTemplate(id='membrete', frames=[marco], onPage=membrete)])

    hist = []
    hist.append(Paragraph("PLANIFICACIÓN PASTORAL", est['titulo']))
    hist.append(Paragraph("Agosto – Diciembre de 2026", est['subtitulo']))
    hist.append(Paragraph(
        "Parroquia Eclesiástica de Santa Lucía · El Empedrao · Maracaibo<br/>"
        f"Actualizado el {fecha_larga(hoy)}", est['lema']))

    hist.append(Paragraph("1. Alcance de este documento", est['apartado']))
    hist.append(Paragraph(
        f"Este documento recoge la programación pastoral que resta del año 2026, desde "
        f"{desde_txt} hasta el 31 de diciembre. Las actividades ya celebradas quedan omitidas.",
        est['parrafo']))
    hist.append(Paragraph(
        "Las actividades reproducen lo acordado en la Junta del Consejo Pastoral Parroquial del "
        "14 de agosto de 2026, asentado en la minuta N° M-002/2026, con las correcciones "
        "posteriores del programa de la novena a la Natividad, y lo acordado en la Junta del 23 "
        "de septiembre de 2026, asentado en la minuta N° M-030/2026, que fijó el calendario de "
        "octubre y noviembre, las fiestas patronales y las Cuarenta Horas. Las memorias "
        "litúrgicas no tratadas expresamente en esas juntas se proponen por continuidad con la "
        "Propuesta de Planificación Pastoral del año 2027.", est['parrafo']))

    hist.append(Paragraph("2. Criterios", est['apartado']))
    for c in CRITERIOS:
        hist.append(Paragraph(c, est['vineta'], bulletText='•'))

    for mes in meses:
        bloque = tabla_mes(mes, est)
        if bloque:
            hist.extend(bloque)

    # El cierre viaja entero: los pendientes y la firma no se separan
    cierre = [Spacer(1, 0.25 * inch),
              Paragraph("3. Puntos pendientes", est['apartado'])]
    for i, p in enumerate(PENDIENTES):
        cierre.append(Paragraph(p, est['vineta'], bulletText=f"{chr(ord('a') + i)})"))
    cierre.append(Paragraph(
        "Pbro. Lic. Rafael Ángel Villalobos Carmona<br/>Párroco", est['firma']))
    hist.append(KeepTogether(cierre))

    doc.build(hist)
    return meses


def main():
    ap = argparse.ArgumentParser(description="Genera el PDF de la planificación pastoral.")
    ap.add_argument("--desde", metavar="AAAA-MM-DD",
                    help="fecha de corte (por defecto, hoy)")
    ap.add_argument("--todo", action="store_true",
                    help="incluye también lo ya celebrado")
    args = ap.parse_args()

    if not SELLO.exists():
        sys.exit(f"No encuentro el sello: {SELLO}")

    corte = dt.date.fromisoformat(args.desde) if args.desde else dt.date.today()
    meses = construir(corte, todo=args.todo)

    total = sum(len(m["filas"]) for m in meses)
    print(f"{SALIDA.name}: {total} actividades en {len(meses)} meses "
          f"({'documento completo' if args.todo else 'desde ' + corte.isoformat()})")


if __name__ == "__main__":
    main()
