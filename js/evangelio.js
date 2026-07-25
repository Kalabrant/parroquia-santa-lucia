/* ============================================================
   evangelio.js — muestra el Evangelio del día.

   Lee evangelio.json, que actualiza cada madrugada la tarea
   .github/workflows/evangelio.yml. El archivo guarda una semana
   por delante, así que si un día falla la tarea (o el visitante
   está sin conexión), sigue habiendo Evangelio.
   ============================================================ */
(function () {
    'use strict';

    var destino = document.getElementById('evangelio-dia');
    if (!destino) return;

    function hoyISO() {
        var d = new Date();
        return d.getFullYear() + '-' +
               String(d.getMonth() + 1).padStart(2, '0') + '-' +
               String(d.getDate()).padStart(2, '0');
    }

    function escapa(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function parrafos(texto) {
        return texto.split('\n')
            .filter(function (l) { return l.trim(); })
            .map(function (l) { return '<p>' + escapa(l) + '</p>'; })
            .join('');
    }

    function pintar(entrada, desfasado) {
        var aviso = desfasado
            ? '<p class="ev-aviso">No hemos podido comprobar la lectura de hoy. ' +
              'Esta es la del ' + escapa(entrada.fecha.split('-').reverse().join('/')) + '.</p>'
            : '';

        destino.innerHTML =
            '<article class="evangelio-tarjeta">' +
                '<header class="ev-cabecera">' +
                    '<p class="ev-etiqueta">Evangelio del día</p>' +
                    (entrada.diaLiturgico ? '<p class="ev-dia">' + escapa(entrada.diaLiturgico) + '</p>' : '') +
                    '<h3 class="ev-cita">' + escapa(entrada.cita) + '</h3>' +
                '</header>' +
                aviso +
                '<div class="ev-texto">' + parrafos(entrada.texto) + '</div>' +
                '<footer class="ev-pie">' +
                    '<a href="meditacion-palabra.html" class="enlace-destacado">Meditarlo con la Lectio Divina &rarr;</a>' +
                    '<p class="ev-fuente">Lecturas de evangelizo.org</p>' +
                '</footer>' +
            '</article>';
        destino.hidden = false;
    }

    var url = 'evangelio.json' + (window.__vSitio ? '?v=' + window.__vSitio : '');

    fetch(url, { cache: 'no-cache' })
        .then(function (r) {
            if (!r.ok) throw new Error('sin evangelio');
            return r.json();
        })
        .then(function (datos) {
            if (!datos || !datos.dias || !datos.dias.length) throw new Error('vacío');

            var hoy = hoyISO();
            var deHoy = datos.dias.filter(function (d) { return d.fecha === hoy; })[0];

            if (deHoy) { pintar(deHoy, false); return; }

            // Ni hoy ni nada posterior: mostramos el más reciente disponible
            // avisando de que no es el de hoy, en vez de no mostrar nada.
            var previos = datos.dias.filter(function (d) { return d.fecha <= hoy; });
            var elegido = previos.length ? previos[previos.length - 1] : datos.dias[0];
            pintar(elegido, true);
        })
        .catch(function () {
            // Sin datos no ponemos una caja vacía: simplemente no aparece.
            destino.hidden = true;
        });
})();
