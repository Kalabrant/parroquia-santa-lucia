/* ============================================================
   agenda-datos.js — la agenda pastoral en un solo sitio.

   Antes estos datos vivían dentro de eventos.html. Ahora los
   comparten la portada, el buscador y la propia agenda, así que
   solo hay que actualizarlos AQUÍ.

   Para añadir una actividad, copia una línea de EVENTOS y cambia
   los datos. El formato de fecha es 'AAAA-MM-DD'.
   ============================================================ */

// ─────────────────────────────────────────────────
//  CONSTANTES DE CATEGORÍA
// ─────────────────────────────────────────────────
const CAT = {
    SOLEMNE:    'cat-solemne',
    VIA_CRUCIS: 'cat-via-crucis',
    MISION:     'cat-mision',
    FORMACION:  'cat-formacion',
    PATRONAL:   'cat-patronal',
    RETIRO:     'cat-retiro',
    NORMAL:     'cat-normal'
};

const MESES_CORTO = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
const MESES_LARGO = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                     'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const MESES_TEMATICO = {
    0:'', 1:'Cuaresma', 2:'Cuaresma · San José', 3:'Semana Santa y Pascua',
    4:'Mes de la Virgen', 5:'Mes del Sagrado Corazón', 6:'Virgen del Carmen',
    7:'Mes de la Asunción', 8:'Mes de la Biblia', 9:'Misiones y el Rosario',
    10:'Santos y La Chinita', 11:'Navidad · Fiestas Patronales'
};

// ─────────────────────────────────────────────────
//  BASE DE DATOS COMPLETA
// ─────────────────────────────────────────────────
const EVENTOS = [
    // FEBRERO
    {fecha:'2026-02-11',titulo:'Ntra. Sra. de Lourdes — Jornada del Enfermo',hora:'5:30 PM',desc:'Rosario por los enfermos en la gruta.',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-02-12',titulo:'Día de la Juventud',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Pastoral Juvenil',cat:CAT.NORMAL},
    {fecha:'2026-02-15',titulo:'Apertura Pastoral: "Café con la Comunidad"',hora:'9:00 AM · 11:00 AM · 6:00 PM',desc:'Compartir fraterno tras cada Misa. Todos los fieles invitados.',resp:'Todos los grupos',cat:CAT.MISION},
    {fecha:'2026-02-17',titulo:'37° Aniversario Praesidium Ntra. Sra. de la Natividad',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.NORMAL},
    {fecha:'2026-02-18',titulo:'MIÉRCOLES DE CENIZA',hora:'8:00 AM / 6:00 PM',desc:'Imposición de la Ceniza. Inicio de la Cuaresma.',resp:'Todos los grupos',cat:CAT.SOLEMNE,imagen:'foto-ceniza.webp'},
    {fecha:'2026-02-20',titulo:'1er Vía Crucis Intergrupal: "Caminando con María"',hora:'7:00 PM',desc:'Después de la Misa.',resp:'Legión de María + Emaús (Mujeres)',cat:CAT.VIA_CRUCIS},
    {fecha:'2026-02-21',titulo:'Retiro de Cuaresma',hora:'9:00 AM – 12:00 M',desc:'Jornada de reflexión y oración cuaresmal.',resp:'Consejo Pastoral',cat:CAT.RETIRO},
    {fecha:'2026-02-22',titulo:'38° Aniversario Praesidium María Esposa del Espíritu Santo',hora:'8:30 AM',desc:'Rosario (8:30 a.m.) y Santa Misa (9:00 a.m.).',resp:'Legión de María',cat:CAT.NORMAL},
    {fecha:'2026-02-23',titulo:'Lunes Cuaresmal Arciprestal',hora:'',desc:'Acto penitencial en una de las parroquias del arciprestazgo.',resp:'Arciprestazgo',cat:CAT.NORMAL},
    {fecha:'2026-02-27',titulo:'2do Vía Crucis Intergrupal: "Jóvenes y Caridad"',hora:'7:00 PM',desc:'Zona Pastoral 1: Santa Lucía. Después de la Misa.',resp:'Pastoral Juvenil (Samuel) + Cáritas',cat:CAT.VIA_CRUCIS},
    // MARZO
    {fecha:'2026-03-02',titulo:'Lunes Cuaresmal Arciprestal',hora:'',desc:'Acto penitencial en una de las parroquias del arciprestazgo.',resp:'Arciprestazgo',cat:CAT.NORMAL},
    {fecha:'2026-03-03',titulo:'2° Aniversario Praesidium Juvenil María Madre Purísima',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.NORMAL},
    {fecha:'2026-03-06',titulo:'3er Vía Crucis Intergrupal: "Liturgia y Palabra"',hora:'7:00 PM',desc:'Después de la Misa.',resp:'Lectores + Servidores del Altar',cat:CAT.VIA_CRUCIS},
    {fecha:'2026-03-09',titulo:'Lunes Cuaresmal Arciprestal',hora:'',desc:'Acto penitencial en una de las parroquias del arciprestazgo.',resp:'Arciprestazgo',cat:CAT.NORMAL},
    {fecha:'2026-03-13',titulo:'4to Vía Crucis Intergrupal: "La Fuerza de la Oración"',hora:'7:00 PM',desc:'Después de la Misa.',resp:'Emaús (Hombres) + Cursillos de Cristiandad',cat:CAT.VIA_CRUCIS},
    {fecha:'2026-03-14',titulo:'Olla Solidaria',hora:'12:00 M',desc:'Jornada de caridad y servicio a los más necesitados.',resp:'Cáritas + Todos los Grupos',cat:CAT.MISION},
    {fecha:'2026-03-16',titulo:'Lunes Cuaresmal Arciprestal',hora:'',desc:'Acto penitencial en una de las parroquias del arciprestazgo.',resp:'Arciprestazgo',cat:CAT.NORMAL},
    {fecha:'2026-03-19',titulo:'Solemnidad de San José',hora:'6:00 PM',desc:'Misa y bendición de los padres de familia (6:00 p.m.). Procesión (7:00 p.m.).',resp:'Sociedad de San José',cat:CAT.SOLEMNE,imagen:'foto-san-jose.webp'},
    {fecha:'2026-03-20',titulo:'5to Vía Crucis Intergrupal: "Tradición y Alabanza"',hora:'7:00 PM',desc:'Zona Pastoral 7: Sto. Tomás de Aquino. Después de la Misa.',resp:'Vasallos de San Benito + Coros',cat:CAT.VIA_CRUCIS},
    {fecha:'2026-03-25',titulo:'La Anunciación del Señor',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-03-27',titulo:'6to Vía Crucis Intergrupal: "Devoción y Familia"',hora:'7:00 PM',desc:'Después de la Misa.',resp:'Soc. Sagrado Corazón + Catequesis',cat:CAT.VIA_CRUCIS},
    // SEMANA SANTA
    {fecha:'2026-03-28',titulo:'Víspera de Ramos',hora:'',desc:'Celebración vespertina.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-03-29',titulo:'DOMINGO DE RAMOS',hora:'8:00 AM',desc:'Procesión solemne (8:00 a.m.). Misas (9:00 a.m. y 6:00 p.m.).',resp:'Todos los grupos',cat:CAT.SOLEMNE,imagen:'foto-ramos.webp'},
    {fecha:'2026-03-30',titulo:'Lunes Santo — Concierto Sacro',hora:'6:00 PM',desc:'Rosario (5:30 p.m.), Misa (6:00 p.m.) y Concierto Sacro Banda Rafael Urdaneta (por confirmar).',resp:'Banda Rafael Urdaneta',cat:CAT.SOLEMNE},
    {fecha:'2026-03-31',titulo:'Martes Santo — Misa Crismal',hora:'9:00 AM',desc:'Misa Crismal (9:00 a.m.). Rosario (5:30 p.m.) y Misa (6:00 p.m.).',resp:'',cat:CAT.SOLEMNE},
    {fecha:'2026-04-01',titulo:'Miércoles Santo — Procesión de los Pasos',hora:'6:00 PM',desc:'Rosario (5:30 p.m.), Misa (6:00 p.m.) y Procesión de los Pasos de la Pasión en la Catedral.',resp:'',cat:CAT.SOLEMNE},
    {fecha:'2026-04-02',titulo:'JUEVES SANTO: Cena del Señor',hora:'7:00 PM',desc:'Misa de la Cena del Señor (7:00 p.m.). Adoración en la reserva hasta el Viernes (12:00 m.).',resp:'Todos los grupos',cat:CAT.SOLEMNE,imagen:'foto-jueves-santo.webp'},
    {fecha:'2026-04-03',titulo:'VIERNES SANTO: Pasión del Señor',hora:'5:00 PM',desc:'Celebración de la Pasión (5:00 p.m.). Vía Crucis Viviente organizado por los jóvenes (7:00 p.m.).',resp:'Pastoral Juvenil (Samuel)',cat:CAT.SOLEMNE,imagen:'foto-viernes-santo.webp'},
    {fecha:'2026-04-04',titulo:'SOLEMNE VIGILIA PASCUAL',hora:'8:00 PM',desc:'La madre de todas las vigilias. Bautismo de los Catecúmenos.',resp:'Todos los grupos',cat:CAT.SOLEMNE,imagen:'foto-vigilia-pascual.webp'},
    {fecha:'2026-04-05',titulo:'Domingo de Pascua — ¡Aleluya!',hora:'11:00 AM / 6:00 PM',desc:'Eucaristías de Resurrección.',resp:'Todos los grupos',cat:CAT.SOLEMNE},
    // ABRIL
    {fecha:'2026-04-11',titulo:'Víspera de la Divina Misericordia',hora:'',desc:'Celebración en la Misa de la tarde y procesión con el Cuadro.',resp:'Soc. Misericordia',cat:CAT.SOLEMNE},
    {fecha:'2026-04-12',titulo:'Fiesta de la Divina Misericordia',hora:'9:00 AM / 11:00 AM',desc:'Eucaristías solemnes. Se suprime la Misa de la tarde.',resp:'Soc. Misericordia',cat:CAT.SOLEMNE,imagen:'foto-misericordia.webp'},
    {fecha:'2026-04-23',titulo:'6° Retiro de Emaús (Mujeres)',hora:'',desc:'Retiro los días 23, 24 y 25 de abril.',resp:'Hermandad de Emaús',cat:CAT.RETIRO},
    // MAYO
    {fecha:'2026-05-01',titulo:'San José Obrero — Misa por los Trabajadores',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión y Sociedad de S. José',cat:CAT.SOLEMNE},
    {fecha:'2026-05-01',titulo:'6° Retiro de Emaús (Hombres)',hora:'',desc:'Retiro los días 1, 2 y 3 de mayo.',resp:'Hermandad de Emaús',cat:CAT.RETIRO},
    {fecha:'2026-05-22',titulo:'Santa Rita de Casia',hora:'6:00 PM',desc:'Misa Solemne (6:00 p.m.) y Bendición de las Rosas al finalizar la Misa.',resp:'Sociedad de Santa Rita',cat:CAT.SOLEMNE},
    {fecha:'2026-05-24',titulo:'PENTECOSTÉS — Confirmaciones',hora:'11:00 AM',desc:'Eucaristías (9:00 a.m., 11:00 a.m. con Confirmaciones y 6:00 p.m.).',resp:'Ministerio de Catequesis',cat:CAT.SOLEMNE,imagen:'foto-pentecostes.webp'},
    {fecha:'2026-05-30',titulo:'Misión Mariana "Iglesia en Salida"',hora:'9:00 AM',desc:'Visitas misioneras a hogares. De 9:00 a.m. a 12:00 m.',resp:'Legión de María',cat:CAT.MISION},
    {fecha:'2026-05-31',titulo:'La Visitación — Cierre del Mes de María',hora:'7:00 PM',desc:'Coronación de la imagen de Nuestra Señora (7:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    // JUNIO
    {fecha:'2026-06-04',titulo:'Inicio de las 40 Horas de Adoración',hora:'6:00 PM',desc:'Misa solemne de apertura y turnos de adoración nocturna.',resp:'Todos los grupos',cat:CAT.SOLEMNE},
    {fecha:'2026-06-05',titulo:'40 Horas de Adoración — Día 2',hora:'Todo el día',desc:'Continuación de la adoración eucarística.',resp:'Todos los grupos',cat:CAT.SOLEMNE},
    {fecha:'2026-06-06',titulo:'Clausura 40 Horas — Vísperas del Corpus',hora:'6:00 PM',desc:'Misa solemne de clausura (6:00 p.m.).',resp:'Todos los grupos',cat:CAT.SOLEMNE},
    {fecha:'2026-06-07',titulo:'CORPUS CHRISTI — Primeras Comuniones',hora:'6:00 PM',desc:'Primeras Comuniones (6:00 p.m.) y Procesión Eucarística parroquial.',resp:'Todos los grupos',cat:CAT.SOLEMNE,imagen:'foto-corpus-christi.webp'},
    {fecha:'2026-06-12',titulo:'Sagrado Corazón de Jesús',hora:'5:00 PM',desc:'Hora Santa (5:00 p.m.) y Santa Misa (6:00 p.m.).',resp:'Soc. Sagrado Corazón',cat:CAT.SOLEMNE},
    {fecha:'2026-06-13',titulo:'Inmaculado Corazón de María — San Antonio',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-06-27',titulo:'Nuestra Señora del Perpetuo Socorro',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Sociedad del Perpetuo Socorro',cat:CAT.SOLEMNE},
    // JULIO
    {fecha:'2026-07-11',titulo:'San Benito, Abad',hora:'6:00 PM',desc:'Misa solemne con bendición de medallas de San Benito (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-07-16',titulo:'Virgen del Carmen',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    // AGOSTO
    {fecha:'2026-08-06',titulo:'Transfiguración del Señor',hora:'6:00 PM',desc:'Misa solemne (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-08-14',titulo:'Retiro de los niños de Serafines',hora:'',desc:'Fin de semana de retiro, del viernes 14 al domingo 16 de agosto.',resp:'Serafines',cat:CAT.RETIRO},
    {fecha:'2026-08-15',titulo:'Solemnidad de la Asunción de la Virgen',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-08-29',titulo:'Inicio de la Novena a la Natividad de la Virgen — Día 1°',hora:'6:00 PM',desc:'Primer día: rezo de la novena y Eucaristía (6:00 p.m.). Canta María Parra. La novena va del 29 de agosto al 7 de septiembre, con un grupo responsable cada día. El lunes 31 no hay novena.',resp:'Legión de María',cat:CAT.NORMAL},
    {fecha:'2026-08-30',titulo:'Novena a la Natividad — Día 2°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta Gina Guadama.',resp:'Sociedad y Servidores de Santa Lucía, Sociedad de San José y Vasallos de San Benito',cat:CAT.NORMAL},
    {fecha:'2026-08-30',titulo:'Jornada de Convivencia Inter-Grupos',hora:'6:00 PM',desc:'Después de la Santa Misa, en la sede de la Banda Rafael Urdaneta. Compartir fraterno y «fiesta de traje», con el aporte de cada grupo. Coordinan Karina Medina y Víctor García.',resp:'Todos los grupos',cat:CAT.MISION},
    // SEPTIEMBRE
    {fecha:'2026-09-01',titulo:'Apertura del Mes de la Biblia — Entronización de la Palabra',hora:'6:00 PM',desc:'Misa de apertura y entronización de la Palabra. Ese mismo día se reanuda la novena a la Natividad (día 3°).',resp:'Cursillos de Cristiandad',cat:CAT.SOLEMNE},
    {fecha:'2026-09-01',titulo:'Novena a la Natividad — Día 3°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta el Coro Camino de Luz.',resp:'Cursillos de Cristiandad, Ministerio de Catequesis y Flores de Misericordia',cat:CAT.NORMAL},
    {fecha:'2026-09-02',titulo:'Novena a la Natividad — Día 4°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta el Coro Juvenil.',resp:'Sociedades del Corazón de Jesús, Jesús de la Divina Misericordia, Perpetuo Socorro y Santa Rita de Casia',cat:CAT.NORMAL},
    {fecha:'2026-09-03',titulo:'Novena a la Natividad — Día 5°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta María Parra.',resp:'Ministerio de Liturgia, Ostiarios, Servidores del Altar y Asociación Virgen de la Luz',cat:CAT.NORMAL},
    {fecha:'2026-09-03',titulo:'«Jueves de Palabra» 1',hora:'7:00 PM',desc:'Formación bíblica con el Párroco (7:00 p.m.). Ese día también hay novena y Eucaristía.',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-04',titulo:'Novena a la Natividad — Día 6°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta el Coro Juvenil.',resp:'Hermandad de Emaús (hombres y mujeres)',cat:CAT.NORMAL},
    {fecha:'2026-09-05',titulo:'Novena a la Natividad — Día 7°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta María Parra.',resp:'El Llamado de Samuel, Serafines y Pastoral Juvenil',cat:CAT.NORMAL},
    {fecha:'2026-09-06',titulo:'Novena a la Natividad — Día 8°',hora:'6:00 PM',desc:'Rezo de la novena y Eucaristía. Canta Gina Guadama.',resp:'Cáritas Parroquial',cat:CAT.NORMAL},
    {fecha:'2026-09-07',titulo:'Último día de la Novena — Día 9°',hora:'6:00 PM',desc:'Novena y Misa de primeras vísperas de la Solemnidad. Canta el Coro Camino de Luz.',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-08',titulo:'Solemnidad de la Natividad de la Virgen María',hora:'6:00 PM',desc:'Misa solemne (6:00 p.m.) y Procesión.',resp:'Servidores de Santa Lucía + Flores de Misericordia',cat:CAT.SOLEMNE},
    {fecha:'2026-09-10',titulo:'«Jueves de Palabra» 2',hora:'7:00 PM',desc:'Formación bíblica con el Párroco (7:00 p.m.).',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-11',titulo:'Nuestra Señora de Coromoto',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-15',titulo:'Nuestra Señora de los Dolores',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-16',titulo:'20° Aniversario Sacerdotal del Párroco',hora:'5:00 PM',desc:'Eucaristía de acción de gracias en la Basílica (5:00 p.m.), con sus compañeros de ordenación. Ese día no se anotan intenciones.',resp:'Párroco',cat:CAT.PATRONAL,imagen:'foto-aniversario-sacerdotal.webp'},
    {fecha:'2026-09-17',titulo:'Celebración parroquial del 20° Aniversario',hora:'',desc:'Después de la Hora Santa, compartir con toda la comunidad. Sustituye la formación ordinaria de ese jueves.',resp:'Todos los grupos',cat:CAT.PATRONAL},
    {fecha:'2026-09-18',titulo:'Tercer Retiro de jóvenes «El Llamado de Samuel»',hora:'',desc:'Del viernes 18 al domingo 20 de septiembre, en la sede de la Banda Rafael Urdaneta.',resp:'El Llamado de Samuel',cat:CAT.RETIRO},
    {fecha:'2026-09-24',titulo:'«Jueves de Palabra» 3',hora:'7:00 PM',desc:'Formación bíblica con el Párroco (7:00 p.m.).',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-29',titulo:'Santos Arcángeles',hora:'6:00 PM',desc:'Santa Misa (6:00 p.m.) y bendición de los rosarios de San Miguel.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    // OCTUBRE
    {fecha:'2026-10-01',titulo:'Santa Teresa del Niño Jesús',hora:'6:00 PM',desc:'Misa solemne (6:00 p.m.) y charla sobre su espiritualidad (7:00 p.m.).',resp:'Párroco',cat:CAT.SOLEMNE},
    {fecha:'2026-10-02',titulo:'Santos Ángeles Custodios',hora:'6:00 PM',desc:'Misa con devoción especial a los Ángeles Custodios.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-10-04',titulo:'San Francisco de Asís',hora:'',desc:'Eucaristías dominicales.',resp:'',cat:CAT.NORMAL},
    {fecha:'2026-10-07',titulo:'Nuestra Señora del Rosario',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-10-10',titulo:'Reparto de Alimentos',hora:'',desc:'Jornada de reparto para los más necesitados.',resp:'Cáritas Parroquial',cat:CAT.MISION},
    {fecha:'2026-10-15',titulo:'Santa Teresa de Jesús — Aniversario de Cursillos',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Cursillos de Cristiandad',cat:CAT.NORMAL},
    {fecha:'2026-10-17',titulo:'Aniversario de la Sociedad de la Divina Misericordia',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Sociedad de la Divina Misericordia',cat:CAT.NORMAL},
    {fecha:'2026-10-24',titulo:'Gran Misión Parroquial',hora:'Desde la mañana',desc:'Salida de todos los grupos a los sectores, desde la mañana, para evangelizar en todo el territorio parroquial.',resp:'Todos los grupos',cat:CAT.MISION,imagen:'foto-mision.webp'},
    {fecha:'2026-10-31',titulo:'Fiesta de Holywins',hora:'6:00 PM',desc:'Santa Misa (6:00 p.m.) y fiesta para los niños.',resp:'Ministerio de Catequesis + Legión de María',cat:CAT.NORMAL},
    // NOVIEMBRE
    {fecha:'2026-11-01',titulo:'Solemnidad de Todos los Santos',hora:'',desc:'Eucaristías dominicales.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-11-02',titulo:'Conmemoración de los Fieles Difuntos',hora:'6:00 PM',desc:'Una sola misa, por los difuntos.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-11-13',titulo:'Aniversario y Juramentación — Servidores y Soc. Santa Lucía',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Servidores de Santa Lucía + Sociedad de Santa Lucía',cat:CAT.PATRONAL},
    {fecha:'2026-11-18',titulo:'Solemnidad de Ntra. Sra. de Chiquinquirá (La Chinita)',hora:'8:00 AM',desc:'Misa parroquial (8:00 a.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE,imagen:'foto-chinita.webp'},
    {fecha:'2026-11-21',titulo:'Presentación de la Santísima Virgen María',hora:'',desc:'Misa de la Legión de María.',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-11-22',titulo:'CRISTO REY — Santa Cecilia',hora:'6:00 PM',desc:'Eucaristías dominicales. Encuentro con los coros parroquiales después de la Misa de 6:00 p.m.',resp:'Coros Parroquiales',cat:CAT.SOLEMNE},
    {fecha:'2026-11-28',titulo:'Encuentro de Santa Lucía y La Chinita',hora:'',desc:'Recorrido desde los lados de Santa Teresita, pasando frente a Papalvillo, hasta el cruce y la calle lateral detrás de Jesús Ríos. Las fiestas patronales quedan en suspenso hasta la próxima junta del Consejo.',resp:'Servidores de Santa Lucía + Flores de Misericordia',cat:CAT.PATRONAL,imagen:'foto-bajada-santa-lucia.webp'},
    {fecha:'2026-11-29',titulo:'I Domingo de Adviento — Bendición de Coronas',hora:'',desc:'Eucaristías dominicales y bendición de las coronas.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    // DICIEMBRE (propuesta sujeta a la aprobación del Consejo Pastoral)
    {fecha:'2026-12-04',titulo:'Inicio de la Novena a Santa Lucía',hora:'5:30 PM',desc:'Del 4 al 12 de diciembre: rezo de la novena (5:30 p.m.) y Eucaristía (6:00 p.m.), con un grupo responsable cada día.',resp:'Todos los grupos',cat:CAT.PATRONAL},
    {fecha:'2026-12-08',titulo:'Inmaculada Concepción — Cumpleaños del Párroco',hora:'5:30 PM',desc:'Novena (5:30 p.m.) y Eucaristía (6:00 p.m.).',resp:'Sociedades parroquiales + Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-12-12',titulo:'Último día de la Novena — Mañanitas a Santa Lucía',hora:'5:30 PM',desc:'Novena (5:30 p.m.), Eucaristía (6:00 p.m.) y mañanitas a nuestra Patrona (11:00 p.m.).',resp:'Servidores de Santa Lucía + Sociedad de Santa Lucía',cat:CAT.PATRONAL},
    {fecha:'2026-12-13',titulo:'SOLEMNIDAD DE SANTA LUCÍA',hora:'Todo el día',desc:'Eucaristías solemnes y procesión. Encuentro tradicional con La Chinita.',resp:'Todos los grupos',cat:CAT.PATRONAL,imagen:'foto-santa-lucia.webp'},
    {fecha:'2026-12-15',titulo:'Misas de Aguinaldo',hora:'6:00 AM',desc:'Del 15 al 23 de diciembre: Eucaristía (6:00 a.m.), con una intención y un grupo responsable cada día.',resp:'Varios Grupos',cat:CAT.NORMAL},
    {fecha:'2026-12-24',titulo:'Nochebuena — Misa de Gallo',hora:'7:00 PM',desc:'Misa solemne de Nochebuena (7:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE,imagen:'foto-nochebuena.webp'},
    {fecha:'2026-12-25',titulo:'Solemnidad de la Natividad del Señor',hora:'6:00 PM',desc:'¡Feliz Navidad! Eucaristía solemne (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-12-27',titulo:'Fiesta de la Sagrada Familia',hora:'',desc:'Eucaristías dominicales y bendición para las familias.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
];

// ─────────────────────────────────────────────────
//  DESTACADOS: uno por tramo del año
//  Visible entre `desde` (inclusive) y `hasta` (exclusive)
// ─────────────────────────────────────────────────
const DESTACADOS = [
    {
        desde:'2026-01-01', hasta:'2026-02-19',
        titulo:'Miércoles de Ceniza',
        kicker:'Próximamente · 18 de Febrero',
        hora:'8:00 AM y 6:00 PM',
        desc:'Iniciamos juntos el camino cuaresmal con la imposición de la Ceniza. «Conviértete y cree en el Evangelio.»',
        items:['8:00 AM — Primera Misa con imposición de Ceniza','6:00 PM — Segunda Misa con imposición de Ceniza'],
        imagen:'foto-ceniza.webp', btn:null
    },
    {
        desde:'2026-02-19', hasta:'2026-04-06',
        titulo:'Semana Santa 2026',
        kicker:'Marzo – Abril · 29 Mar – 5 Abr',
        hora:'Del 29 de Marzo al 5 de Abril',
        desc:'Viviremos los misterios centrales de nuestra fe: desde la entrada triunfal el Domingo de Ramos hasta la gloria de la Resurrección.',
        items:['Domingo de Ramos: 29 de Marzo, 8:00 AM','Jueves Santo: 2 de Abril, 7:00 PM','Viernes Santo: 3 de Abril, 5:00 PM','Solemne Vigilia Pascual: 4 de Abril, 8:00 PM','Domingo de Pascua: 5 de Abril'],
        imagen:'foto-semana-santa.webp',
        btn:{texto:'Descargar Programa Completo', href:'plan-pastoral-2026.pdf'}
    },
    {
        desde:'2026-04-06', hasta:'2026-05-25',
        titulo:'Pentecostés — Confirmaciones',
        kicker:'24 de Mayo',
        hora:'9:00 AM · 11:00 AM · 6:00 PM',
        desc:'¡Ven, Espíritu Santo! Celebramos la efusión del Espíritu con la Confirmación de nuestros jóvenes.',
        items:['9:00 AM — Misa solemne','11:00 AM — Misa con Confirmaciones','6:00 PM — Misa vespertina'],
        imagen:'foto-pentecostes.webp', btn:null
    },
    {
        desde:'2026-05-25', hasta:'2026-06-08',
        titulo:'Corpus Christi — Primeras Comuniones',
        kicker:'7 de Junio',
        hora:'6:00 PM — Procesión Eucarística',
        desc:'Nuestros niños reciben por primera vez al Señor Eucaristía. Tras la Misa, Procesión Eucarística por las calles de la parroquia.',
        items:['6:00 PM — Primeras Comuniones','7:00 PM — Procesión Eucarística parroquial'],
        imagen:'foto-corpus-christi.webp', btn:null
    },
    {
        desde:'2026-06-08', hasta:'2026-08-16',
        titulo:'Gran Misión Parroquial',
        kicker:'24 de Octubre · Iglesia en Salida',
        hora:'Salida a los sectores',
        desc:'¡Salimos a los sectores! Evangelización puerta a puerta en todos los barrios de nuestra parroquia.',
        items:['Todos los grupos participan','Visitas misioneras a hogares','Llevamos el Evangelio a las periferias'],
        imagen:'foto-mision.webp', btn:null
    },
    {
        desde:'2026-08-16', hasta:'2026-09-09',
        titulo:'Novena a la Natividad de la Virgen',
        kicker:'29 de Agosto – 8 de Septiembre',
        hora:'Novena y Eucaristía · 6:00 PM',
        desc:'Nos preparamos con María para la fiesta de su Natividad. Cada día un grupo de la parroquia anima la novena, y los coros y cantores se alternan durante los nueve días.',
        items:['29 Ago — Primer día de la novena, 6:00 PM','30 Ago — Jornada de Convivencia Inter-Grupos, 6:00 PM','31 Ago — Sin novena: descanso del Párroco','1 Sep — Se reanuda con la apertura del Mes de la Biblia','7 Sep — Último día: novena y Misa de primeras vísperas','8 Sep — Solemnidad de la Natividad: Misa (6:00 PM) y Procesión'],
        imagen:'maria.webp', btn:null
    },
    {
        desde:'2026-09-09', hasta:'2026-09-30',
        titulo:'Mes de la Biblia',
        kicker:'Septiembre · 20° Aniversario Sacerdotal del Párroco',
        hora:'«Jueves de Palabra» · 7:00 PM',
        desc:'Todo septiembre lo dedicamos a la Palabra de Dios, y damos gracias con nuestro Párroco por sus veinte años de sacerdocio.',
        items:['Jueves 10 y 24 — «Jueves de Palabra», 7:00 PM','16 Sep — Eucaristía de acción de gracias en la Basílica, 5:00 PM','17 Sep — Celebración parroquial del aniversario, tras la Hora Santa','18 – 20 Sep — Retiro de jóvenes «El Llamado de Samuel»'],
        imagen:'foto-aniversario-sacerdotal.webp', btn:null
    },
    {
        desde:'2026-09-30', hasta:'2026-10-25',
        titulo:'Gran Misión Parroquial',
        kicker:'24 de Octubre · Iglesia en Salida',
        hora:'Salida desde la mañana',
        desc:'¡Salimos a los sectores! Todos los grupos parten desde la mañana para evangelizar en todo el territorio de nuestra parroquia.',
        items:['Todos los grupos participan','Salida a los sectores desde la mañana','Llevamos el Evangelio a las periferias'],
        imagen:'foto-mision.webp', btn:null
    },
    {
        desde:'2026-10-25', hasta:'2026-11-29',
        titulo:'Encuentro de Santa Lucía y La Chinita',
        kicker:'28 de Noviembre · Mes de los Santos y de La Chinita',
        hora:'Recorrido por nuestras calles',
        desc:'Nuestra Patrona sale al encuentro de La Chinita en un recorrido que une a toda la comunidad. Las fiestas patronales quedan en suspenso hasta la próxima junta del Consejo.',
        items:['18 Nov — Solemnidad de La Chinita: Misa parroquial, 8:00 AM','22 Nov — Cristo Rey y Santa Cecilia: encuentro con los coros','28 Nov — Recorrido desde los lados de Santa Teresita, frente a Papalvillo, hasta el cruce y la calle detrás de Jesús Ríos'],
        imagen:'foto-bajada-santa-lucia.webp', btn:null
    },
    {
        desde:'2026-11-29', hasta:'2026-12-14',
        titulo:'Solemnidad de Santa Lucía, Virgen',
        kicker:'13 de Diciembre · Gran Fiesta Patronal',
        hora:'Todo el día · Eucaristías y Procesión',
        desc:'¡El día más grande de nuestra parroquia! Eucaristías solemnes, procesión y el encuentro tradicional con La Chinita. Programación de diciembre sujeta a la aprobación del Consejo Pastoral.',
        items:['4 – 12 Dic — Novena: rezo (5:30 PM) y Eucaristía (6:00 PM)','8 Dic — Inmaculada Concepción y cumpleaños del Párroco','12 Dic — Último día de novena y mañanitas, 11:00 PM','13 Dic — Eucaristías solemnes, procesión y encuentro con La Chinita'],
        imagen:'foto-santa-lucia.webp', btn:null
    },
    {
        desde:'2026-12-14', hasta:'2027-01-01',
        titulo:'Navidad: Solemnidad del Señor',
        kicker:'24 – 25 de Diciembre',
        hora:'24 Dic 7:00 PM · 25 Dic 6:00 PM',
        desc:'¡Gloria a Dios en el cielo y paz en la tierra a los hombres que Él ama! Celebremos el nacimiento de nuestro Salvador.',
        items:['15 – 23 Dic — Misas de Aguinaldo, 6:00 AM','24 Dic — Misa de Gallo, 7:00 PM','25 Dic — Misa de Navidad, 6:00 PM','27 Dic — Sagrada Familia: bendición para las familias'],
        imagen:'foto-nochebuena.webp', btn:null
    }
];
