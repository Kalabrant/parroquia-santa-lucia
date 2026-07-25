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
    {fecha:'2026-08-07',titulo:'Retiro de Serafines',hora:'',desc:'Retiro los días 7, 8 y 9 de agosto.',resp:'Serafines',cat:CAT.RETIRO},
    {fecha:'2026-08-15',titulo:'Solemnidad de la Asunción de la Virgen',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-08-29',titulo:'Inicio de la Novena a la Natividad de la Virgen',hora:'',desc:'Novena preparatoria a la fiesta del 8 de septiembre.',resp:'Todos los grupos',cat:CAT.NORMAL},
    {fecha:'2026-08-30',titulo:'Jornada de Convivencia Inter-Grupos',hora:'',desc:'Compartir fraterno entre todos los grupos parroquiales.',resp:'Consejo Pastoral',cat:CAT.MISION},
    // SEPTIEMBRE
    {fecha:'2026-09-01',titulo:'Misa de Apertura — Entronización de la Palabra',hora:'6:00 PM',desc:'Inicio del Mes de la Biblia.',resp:'Cursillos',cat:CAT.SOLEMNE},
    {fecha:'2026-09-03',titulo:'Jueves de Palabra 1: "GPS Bíblico"',hora:'7:00 PM',desc:'¿Por dónde empiezo? Estructura AT/NT, cómo buscar una cita...',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-07',titulo:'105° Aniversario de la Legión de María en el Mundo',hora:'',desc:'Celebración del aniversario fundacional.',resp:'Legión de María',cat:CAT.NORMAL},
    {fecha:'2026-09-08',titulo:'Solemnidad de la Natividad de la Virgen María',hora:'5:30 PM',desc:'Rosario (5:30 p.m.), Misa (6:00 p.m.) y Procesión (7:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-10',titulo:'Jueves de Palabra 2: "El Antiguo Testamento"',hora:'7:00 PM',desc:'"Claves para no escandalizarse."',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-11',titulo:'Nuestra Señora de Coromoto',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-15',titulo:'Nuestra Señora de los Dolores',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-09-16',titulo:'20° Aniversario Sacerdotal del Padre Rafael',hora:'',desc:'Celebración especial con toda la comunidad parroquial.',resp:'Todos los grupos',cat:CAT.PATRONAL,imagen:'foto-aniversario-sacerdotal.webp'},
    {fecha:'2026-09-17',titulo:'Jueves de Palabra 3: "Los Evangelios"',hora:'7:00 PM',desc:'"Cuatro miradas, un mismo Jesús." Sesión práctica.',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-24',titulo:'Jueves de Palabra 4: "Taller de Lectio Divina"',hora:'7:00 PM',desc:'"Orar con la Palabra." Diferencias entre evangelistas.',resp:'Párroco',cat:CAT.FORMACION},
    {fecha:'2026-09-29',titulo:'Santos Arcángeles',hora:'6:00 PM',desc:'Santa Misa (6:00 p.m.) y bendición de rosarios de San Miguel.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    // OCTUBRE
    {fecha:'2026-10-01',titulo:'Santa Teresa del Niño Jesús',hora:'6:00 PM',desc:'Misa solemne (6:00 p.m.) y Charla (7:00 p.m.).',resp:'Párroco',cat:CAT.SOLEMNE},
    {fecha:'2026-10-02',titulo:'Santos Ángeles Custodios',hora:'6:00 PM',desc:'Misa con devoción especial (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-10-04',titulo:'800° Aniversario de la muerte de San Francisco',hora:'',desc:'Mención especial en la liturgia.',resp:'Servidores del Altar',cat:CAT.NORMAL},
    {fecha:'2026-10-07',titulo:'Virgen del Rosario',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-10-10',titulo:'Reparto de Alimentos para los Pobres',hora:'',desc:'Jornada de servicio y caridad.',resp:'Cáritas',cat:CAT.MISION},
    {fecha:'2026-10-15',titulo:'Santa Teresa de Jesús — Aniversario Cursillos',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Cursillos de Cristiandad',cat:CAT.NORMAL},
    {fecha:'2026-10-17',titulo:'Aniversario Sociedad de la Divina Misericordia',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Sociedad de la Divina Misericordia',cat:CAT.NORMAL},
    {fecha:'2026-10-24',titulo:'Gran Misión Parroquial — Iglesia en Salida',hora:'Salida',desc:'Evangelización puerta a puerta en los sectores de la parroquia.',resp:'Todos los grupos',cat:CAT.MISION,imagen:'foto-mision.webp'},
    {fecha:'2026-10-31',titulo:'Fiesta de Holywins',hora:'6:00 PM',desc:'Santa Misa (6:00 p.m.) y fiesta para los niños (7:00 p.m.).',resp:'Catequesis / Legión',cat:CAT.NORMAL},
    // NOVIEMBRE
    {fecha:'2026-11-01',titulo:'Solemnidad de Todos los Santos',hora:'9:00 AM',desc:'Eucaristías (9:00 a.m., 11:00 a.m. y 6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-11-02',titulo:'Conmemoración de los Fieles Difuntos',hora:'6:00 PM',desc:'Misas por los difuntos (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-11-13',titulo:'Aniversario y Juramentación — Servidores y Soc. Santa Lucía',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Sociedad de Santa Lucía',cat:CAT.PATRONAL},
    {fecha:'2026-11-18',titulo:'Solemnidad de Ntra. Sra. de Chiquinquirá (La Chinita)',hora:'8:00 AM',desc:'Misa Parroquial solemne (8:00 a.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE,imagen:'foto-chinita.webp'},
    {fecha:'2026-11-21',titulo:'Presentación de la Virgen María',hora:'5:30 PM',desc:'Rosario (5:30 p.m.) y Santa Misa (6:00 p.m.).',resp:'Legión de María',cat:CAT.SOLEMNE},
    {fecha:'2026-11-22',titulo:'CRISTO REY — Santa Cecilia',hora:'9:00 AM',desc:'Eucaristías (9:00, 11:00 y 6:00 p.m.). Cena con Coros Parroquiales (7:00 p.m.).',resp:'Coros Parroquiales',cat:CAT.SOLEMNE},
    {fecha:'2026-11-28',titulo:'Bajada de Santa Lucía — Inicio Fiestas Patronales',hora:'6:00 PM',desc:'Eucaristía (9:00 a.m.), Bajada de la imagen y Procesión (6:00 p.m.).',resp:'Servidores de Santa Lucía',cat:CAT.PATRONAL,imagen:'foto-bajada-santa-lucia.webp'},
    {fecha:'2026-11-29',titulo:'I Domingo de Adviento — Bendición de Coronas',hora:'',desc:'Eucaristías dominicales. Inicio del tiempo de Adviento.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    // DICIEMBRE
    {fecha:'2026-12-04',titulo:'Inicio Novena a Santa Lucía',hora:'5:30 PM',desc:'Del 4 al 12 de diciembre. Novena (5:30 p.m.) y Eucaristía (6:00 p.m.) cada día.',resp:'Varios Grupos',cat:CAT.PATRONAL},
    {fecha:'2026-12-13',titulo:'SOLEMNIDAD DE SANTA LUCÍA, VIRGEN',hora:'Todo el día',desc:'Eucaristías solemnes y Procesión solemne tras la Misa de 6:00 p.m.',resp:'Todos los grupos',cat:CAT.PATRONAL,imagen:'foto-santa-lucia.webp'},
    {fecha:'2026-12-15',titulo:'Misas de Aguinaldo',hora:'6:00 AM',desc:'Del 15 al 23 de diciembre. Eucaristía diaria (6:00 a.m.).',resp:'Varios Grupos',cat:CAT.NORMAL},
    {fecha:'2026-12-24',titulo:'Nochebuena — Misa de Gallo',hora:'7:00 PM',desc:'Misa solemne de Nochebuena (7:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE,imagen:'foto-nochebuena.webp'},
    {fecha:'2026-12-25',titulo:'Solemnidad de la Natividad del Señor',hora:'6:00 PM',desc:'¡Feliz Navidad! Eucaristía solemne (6:00 p.m.).',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
    {fecha:'2026-12-27',titulo:'Fiesta de la Sagrada Familia',hora:'',desc:'Eucaristías dominicales con bendición especial para las familias.',resp:'Servidores del Altar',cat:CAT.SOLEMNE},
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
        desde:'2026-06-08', hasta:'2026-10-25',
        titulo:'Gran Misión Parroquial',
        kicker:'24 de Octubre · Iglesia en Salida',
        hora:'Salida a los sectores',
        desc:'¡Salimos a los sectores! Evangelización puerta a puerta en todos los barrios de nuestra parroquia.',
        items:['Todos los grupos participan','Visitas misioneras a hogares','Llevamos el Evangelio a las periferias'],
        imagen:'foto-mision.webp', btn:null
    },
    {
        desde:'2026-10-25', hasta:'2026-11-29',
        titulo:'Bajada de Santa Lucía',
        kicker:'28 de Noviembre · Inicio Fiestas Patronales',
        hora:'9:00 AM Misa · 6:00 PM Procesión',
        desc:'Con la bajada de nuestra Santa Patrona iniciamos las fiestas más esperadas del año. Procesión solemne y gran celebración comunitaria.',
        items:['9:00 AM — Eucaristía','6:00 PM — Bajada de la imagen y Procesión'],
        imagen:'foto-bajada-santa-lucia.webp', btn:null
    },
    {
        desde:'2026-11-29', hasta:'2026-12-14',
        titulo:'Solemnidad de Santa Lucía, Virgen',
        kicker:'13 de Diciembre · Gran Fiesta Patronal',
        hora:'Todo el día · Procesión 6:00 PM',
        desc:'¡El día más grande de nuestra parroquia! Eucaristías solemnes y la gran Procesión Patronal que une a toda la comunidad.',
        items:['9:00 AM — Misa solemne','11:00 AM — Misa con Confirmaciones','6:00 PM — Misa vespertina','Novena: del 4 al 12 de diciembre'],
        imagen:'foto-santa-lucia.webp', btn:null
    },
    {
        desde:'2026-12-14', hasta:'2027-01-01',
        titulo:'Navidad: Solemnidad del Señor',
        kicker:'24 – 25 de Diciembre',
        hora:'24 Dic 7:00 PM · 25 Dic 6:00 PM',
        desc:'¡Gloria a Dios en el cielo y paz en la tierra a los hombres que Él ama! Celebremos el nacimiento de nuestro Salvador.',
        items:['15 – 23 Dic — Misas de Aguinaldo, 6:00 AM','24 Dic — Misa de Gallo, 7:00 PM','25 Dic — Misa de Navidad, 6:00 PM'],
        imagen:'foto-nochebuena.webp', btn:null
    }
];
