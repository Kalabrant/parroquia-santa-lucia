/* ============================================================
   portada.js — el bloque "Lo que viene" de la página de inicio.
   Se alimenta de js/agenda-datos.js, así que se actualiza solo:
   cuando pasa una fecha, la portada ya muestra la siguiente.
   ============================================================ */
(function () {
    'use strict';

    var CUANTOS = 3;

    var seccion = document.getElementById('seccion-proximos-portada');
    var destino = document.getElementById('proximos-portada');
    if (!seccion || !destino || typeof EVENTOS === 'undefined') return;

    function parseFecha(s) {
        var p = s.split('-').map(Number);
        return new Date(p[0], p[1] - 1, p[2]);
    }

    function escapa(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    var hoy = new Date(); hoy.setHours(0, 0, 0, 0);

    var proximos = EVENTOS.filter(function (ev) {
        var f = parseFecha(ev.fecha); f.setHours(23, 59, 59);
        return f >= hoy;
    }).slice(0, CUANTOS);

    // Si ya no queda nada en la agenda, la sección no se muestra
    // en lugar de quedarse vacía.
    if (!proximos.length) return;

    destino.innerHTML = proximos.map(function (ev) {
        var d = parseFecha(ev.fecha);
        return '<div class="mini-evento">' +
                   '<div class="mini-fecha">' +
                       '<span class="d">' + String(d.getDate()).padStart(2, '0') + '</span>' +
                       '<span class="m">' + MESES_CORTO[d.getMonth()] + '</span>' +
                   '</div>' +
                   '<div>' +
                       '<h4>' + escapa(ev.titulo) + '</h4>' +
                       '<p>' + escapa(ev.hora || 'Consulta la agenda') + '</p>' +
                   '</div>' +
               '</div>';
    }).join('');

    seccion.hidden = false;
})();
