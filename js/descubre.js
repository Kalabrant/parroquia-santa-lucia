/* ============================================================
   descubre.js — la tarjeta "¿Has visto…?" de la portada.

   En cada visita muestra una página distinta del sitio, elegida
   al azar. Sirve para que el contenido que vive en rincones
   profundos (un ministerio, una guía de oración, una sociedad)
   tenga ocasión de aparecer en la portada.

   Los datos los genera tools/sincronizar.py en js/descubre-datos.js
   a partir de tools/paginas.json.
   ============================================================ */
(function () {
    'use strict';

    var CLAVE_ULTIMAS = 'sl-descubre-vistas';
    var RECORDAR = 5;   // no repetir ninguna de las últimas N

    var destino = document.getElementById('has-visto');
    if (!destino || typeof DESCUBRE === 'undefined' || !DESCUBRE.length) return;

    function escapa(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    /* Se recuerdan las últimas mostradas para que no salga dos veces
       seguidas la misma al recargar. */
    function leerUltimas() {
        try { return JSON.parse(sessionStorage.getItem(CLAVE_ULTIMAS) || '[]'); }
        catch (e) { return []; }
    }
    function guardarUltima(url) {
        try {
            var v = leerUltimas();
            v.push(url);
            while (v.length > RECORDAR) v.shift();
            sessionStorage.setItem(CLAVE_ULTIMAS, JSON.stringify(v));
        } catch (e) { /* modo privado */ }
    }

    function elegir() {
        var vistas = leerUltimas();
        var frescas = DESCUBRE.filter(function (f) { return vistas.indexOf(f.u) === -1; });
        var bolsa = frescas.length ? frescas : DESCUBRE;
        return bolsa[Math.floor(Math.random() * bolsa.length)];
    }

    var ficha = elegir();

    destino.innerHTML =
        '<a class="has-visto-tarjeta" href="' + escapa(ficha.u) + '">' +
            '<div class="hv-img">' +
                '<img src="' + escapa(ficha.i) + '" alt="" loading="lazy" decoding="async">' +
            '</div>' +
            '<div class="hv-cuerpo">' +
                '<p class="hv-kicker">¿Has visto…?</p>' +
                '<h3>' + escapa(ficha.t) + '</h3>' +
                '<p class="hv-desc">' + escapa(ficha.d) + '</p>' +
                '<span class="hv-cta">Verlo &rarr;</span>' +
            '</div>' +
        '</a>' +
        '<button type="button" class="hv-otra" id="hv-otra">' +
            '<span aria-hidden="true">🔀</span> Enséñame otra' +
        '</button>';

    guardarUltima(ficha.u);
    destino.hidden = false;

    /* Botón para seguir descubriendo sin tener que recargar */
    document.getElementById('hv-otra').addEventListener('click', function () {
        var nueva = elegir();
        guardarUltima(nueva.u);
        var tarjeta = destino.querySelector('.has-visto-tarjeta');
        tarjeta.setAttribute('href', nueva.u);
        tarjeta.querySelector('.hv-img img').src = nueva.i;
        tarjeta.querySelector('h3').textContent = nueva.t;
        tarjeta.querySelector('.hv-desc').textContent = nueva.d;
        tarjeta.classList.remove('hv-entra');
        void tarjeta.offsetWidth;              // reinicia la animación
        tarjeta.classList.add('hv-entra');
    });
})();
