/* ============================================================
   fiestas-datos.js — Programa oficial de las Fiestas Patronales 2026.

   Lo comparten fiestas-patronales.html y la tarjeta de la portada.
   Para corregir una hora o un lugar, cámbialo AQUÍ (y sube "version"
   en tools/config.json + py tools/sincronizar.py).

   · Las horas van en formato 24 h ('18:00') y son hora de Venezuela.
   · "cierre" es el momento en que la página deja de mostrarse y la
     tarjeta de la portada desaparece.
   · PASADAS LAS FIESTAS: borrar fiestas-patronales.html, js/fiestas*.js,
     la carpeta fiestas-2026/, el bloque "fiestas-portada" de index.html
     y la ficha de tools/paginas.json; luego sincronizar.
   ============================================================ */
var FIESTAS = {
    cierre: '2026-12-15T12:00',   // después de la Subida de Santa Lucía
    solemnidad: '2026-12-13',
    bloques: [
        {
            id: 'bajada',
            titulo: 'Solemne Bajada de Santa Lucía',
            intro: 'La imagen de nuestra Patrona desciende de su camarín para estar cerca de su pueblo. Así comienzan las fiestas.',
            dias: [
                { fecha: '2026-11-14', titulo: 'Solemne Bajada de Santa Lucía', lugar: 'Templo parroquial',
                  enlace: { texto: 'Ver el recorrido', href: 'recorrido-bajada-2026.webp' },
                  actos: [
                      { h: '09:00', t: 'Eucaristía' },
                      { h: '18:00', t: 'Bajada de Santa Lucía', dur: 180 }
                  ] }
            ]
        },
        {
            id: 'peregrinacion',
            titulo: 'Peregrinación',
            intro: 'Santa Lucía sale a visitar a sus devotos: parroquias, capillas y pueblos del Zulia la reciben en su casa.',
            dias: [
                { fecha: '2026-11-22', titulo: 'Paraguaipoa y Guarero', actos: [{ h: '07:00', t: 'Traslado', dur: 600 }] },
                { fecha: '2026-11-25', titulo: 'Parroquia Sagrada Familia', lugar: 'San Miguel', actos: [{ h: '15:00', t: 'Traslado', dur: 240 }] },
                { fecha: '2026-11-27', titulo: 'Parroquia Cristo Rey', lugar: 'La Curva', actos: [{ h: '16:00', t: 'Traslado', dur: 240 }] },
                { fecha: '2026-11-28', titulo: 'Potreritos y Nuestra Señora del Carmen', lugar: 'La Cañada de Urdaneta', actos: [{ h: '07:00', t: 'Traslado', dur: 480 }] },
                { fecha: '2026-11-28', titulo: 'Encuentro: Lucía y Chiquinquirá', destacado: true,
                  lugar: 'Av. 7 con calle 89E, antes Soledad. Entre calle Plaza y Colón',
                  actos: [{ h: '19:00', t: 'Encuentro de Santa Lucía con La Chinita', dur: 180 }] },
                { fecha: '2026-11-29', titulo: 'Purísima Madre de Dios y San Benito', lugar: 'El Bajo', actos: [{ h: '07:00', t: 'Traslado', dur: 480 }] },
                { fecha: '2026-12-04', titulo: 'Parroquia Buen Pastor', actos: [{ h: '16:00', t: 'Traslado', dur: 240 }] },
                { fecha: '2026-12-05', titulo: 'Isla de Toas', actos: [{ h: '06:00', t: 'Traslado', dur: 600 }] },
                { fecha: '2026-12-06', titulo: 'San Rafael del Moján', actos: [{ h: '06:00', t: 'Traslado', dur: 600 }] },
                { fecha: '2026-12-10', titulo: 'Capilla de Santa Rosa', actos: [{ h: '17:00', t: 'Traslado', dur: 240 }] },
                { fecha: '2026-12-11', titulo: 'Nuestra Señora de Guadalupe', lugar: 'Sierra Maestra', actos: [{ h: '16:00', t: 'Traslado', dur: 240 }] }
            ]
        },
        {
            id: 'solemnidad',
            titulo: 'Solemnidad de Santa Lucía',
            intro: 'Nueve días de oración, las vísperas, las mañanitas y el gran día de nuestra Patrona.',
            dias: [
                { fecha: '2026-12-04', hasta: '2026-12-12', novena: true, titulo: 'Novena a Santa Lucía', lugar: 'Templo parroquial',
                  actos: [{ h: '17:30', t: 'Novena', dur: 30 }, { h: '18:00', t: 'Eucaristía', dur: 90 }] },
                { fecha: '2026-12-12', titulo: 'Vísperas', lugar: 'Templo parroquial',
                  actos: [
                      { h: '18:00', t: 'Eucaristía', dur: 90 },
                      { f: '2026-12-13', h: '00:00', t: 'Mañanitas a Santa Lucía', hora: '12:00 am', dur: 120 }
                  ] },
                { fecha: '2026-12-13', titulo: 'Solemnidad de Santa Lucía', destacado: true, lugar: 'Templo parroquial',
                  enlace: { texto: 'Ver el recorrido de la procesión', href: 'recorrido-procesion-2026.webp' },
                  actos: [
                      { h: '09:00', t: 'Eucaristía Solemne', dur: 100 },
                      { h: '11:00', t: 'Eucaristía Solemne', dur: 100 },
                      { h: '18:00', t: 'Eucaristía Solemne', dur: 90 },
                      { h: '19:30', t: 'Procesión Solemne', hora: 'Luego de la Eucaristía', dur: 240 }
                  ] },
                { fecha: '2026-12-14', titulo: 'Encuentro de San Benito con Santa Lucía', lugar: 'Templo parroquial',
                  actos: [{ h: '18:00', t: 'Eucaristía' }] },
                { fecha: '2026-12-15', titulo: 'Subida de Santa Lucía', lugar: 'Templo parroquial',
                  actos: [{ h: '06:00', t: 'Eucaristía' }] }
            ]
        }
    ]
};

/* ------------------------------------------------------------
   Utilidades compartidas: reloj en hora de Venezuela (UTC−4, sin
   cambio de hora), lista plana de actos y "próxima actividad".
   ------------------------------------------------------------ */
var FIESTAS_API = (function () {
    'use strict';
    var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
                 'septiembre', 'octubre', 'noviembre', 'diciembre'];

    // Instante real de una fecha/hora de Venezuela
    function instante(fecha, hora) {
        return new Date(fecha + 'T' + (hora || '00:00') + ':00-04:00').getTime();
    }

    // Para ensayar: fiestas-patronales.html?ahora=2026-11-28T18:30
    var desfase = 0;
    try {
        var m = /[?&]ahora=([0-9T:\-]+)/.exec(location.search);
        if (m) {
            var p = m[1].split('T');
            var t = instante(p[0], (p[1] || '00:00').slice(0, 5));
            if (!isNaN(t)) desfase = t - Date.now();
        }
    } catch (e) { /* sin simulación */ }

    function ahora() { return Date.now() + desfase; }

    // Partes de una fecha 'AAAA-MM-DD' (sin depender de la zona del dispositivo)
    function partes(fecha) {
        var p = fecha.split('-').map(Number);
        var d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));
        return { dia: p[2], mes: p[1] - 1, sem: d.getUTCDay(),
                 nomDia: DIAS[d.getUTCDay()], nomMes: MESES[p[1] - 1] };
    }

    function sumarDias(fecha, n) {
        var p = fecha.split('-').map(Number);
        return new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)).toISOString().slice(0, 10);
    }

    function hora12(h) {
        var p = h.split(':').map(Number);
        var suf = p[0] < 12 ? 'am' : 'pm';
        var hh = p[0] % 12 || 12;
        return hh + ':' + String(p[1]).padStart(2, '0') + ' ' + suf;
    }

    // Fecha de hoy en Venezuela, 'AAAA-MM-DD'
    function hoy() {
        return new Date(ahora() - 4 * 3600000).toISOString().slice(0, 10);
    }

    // Todos los actos, uno por uno, ordenados por inicio
    var plana = [];
    FIESTAS.bloques.forEach(function (b) {
        b.dias.forEach(function (d, iDia) {
            d.clave = b.id + '-' + iDia;
            var fechas = [d.fecha];
            if (d.hasta) { var f = d.fecha; while (f < d.hasta) { f = sumarDias(f, 1); fechas.push(f); } }
            fechas.forEach(function (fecha, iF) {
                d.actos.forEach(function (a, iA) {
                    var f = a.f || fecha;
                    var ini = instante(f, a.h);
                    plana.push({
                        clave: d.clave + '-' + iF + '-' + iA,
                        bloque: b, dia: d, acto: a, fecha: f,
                        numNovena: d.novena ? iF + 1 : 0,
                        inicio: ini, fin: ini + (a.dur || 120) * 60000,
                        horaTexto: a.hora || hora12(a.h)
                    });
                });
            });
        });
    });
    plana.sort(function (x, y) { return x.inicio - y.inicio; });

    function cerrado() {
        var c = FIESTAS.cierre.split('T');
        return ahora() >= instante(c[0], c[1]);
    }

    // Lo que está ocurriendo ahora o, si no hay nada, lo siguiente
    function proxima() {
        var t = ahora(), enCurso = null, sig = null;
        for (var i = 0; i < plana.length; i++) {
            var x = plana[i];
            if (x.fin <= t) continue;
            if (x.inicio <= t) { if (!enCurso) enCurso = x; }
            else { sig = x; break; }
        }
        return { enCurso: enCurso, siguiente: sig, actual: enCurso || sig };
    }

    function fechaLarga(fecha) {
        var p = partes(fecha);
        return p.nomDia + ' ' + p.dia + ' de ' + p.nomMes;
    }

    // "hoy", "mañana" o la fecha larga
    function fechaCercana(fecha) {
        var h = hoy();
        if (fecha === h) return 'hoy';
        if (fecha === sumarDias(h, 1)) return 'mañana';
        return fechaLarga(fecha);
    }

    function tituloActo(x) {
        if (x.dia.novena) return 'Novena a Santa Lucía · día ' + x.numNovena + (x.acto.t === 'Novena' ? '' : ': ' + x.acto.t);
        if (x.acto.t === 'Traslado') return 'Santa Lucía visita ' + x.dia.titulo;
        if (x.dia.actos.length === 1) return x.dia.titulo;
        if (/^Eucaristía/.test(x.acto.t)) return x.acto.t + ' · ' + x.dia.titulo.replace(/^Solemne /, '');
        return x.acto.t;
    }

    return { ahora: ahora, hoy: hoy, instante: instante, partes: partes, hora12: hora12,
             plana: plana, cerrado: cerrado, proxima: proxima, fechaLarga: fechaLarga,
             fechaCercana: fechaCercana, tituloActo: tituloActo, sumarDias: sumarDias };
})();
