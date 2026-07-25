/* ============================================================
   sitio.js — comportamiento común a todas las páginas.
   Sustituye al script que estaba copiado en cada archivo HTML.
   ============================================================ */
(function () {
    'use strict';

    var doc = document;

    /* ── 1. Menú móvil ──────────────────────────────────── */
    function iniciarMenu() {
        var toggle = doc.getElementById('nav-toggle');
        var menu = doc.getElementById('nav-menu');
        if (!toggle || !menu) return;

        function abrir(si) {
            toggle.setAttribute('aria-expanded', si ? 'true' : 'false');
            menu.classList.toggle('abierto', si);
            doc.body.classList.toggle('menu-abierto', si);
            toggle.querySelector('.sr-only').textContent = si ? 'Cerrar menú' : 'Abrir menú';
        }

        toggle.addEventListener('click', function () {
            abrir(toggle.getAttribute('aria-expanded') !== 'true');
        });

        // Escape cierra el menú y devuelve el foco al botón
        doc.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            if (toggle.getAttribute('aria-expanded') === 'true') {
                abrir(false);
                toggle.focus();
            }
            cerrarSubmenus();
        });

        // Al pasar a escritorio, deshacer el estado móvil
        var mq = window.matchMedia('(min-width: 1250px)');
        var alCambiar = function (e) { if (e.matches) abrir(false); };
        if (mq.addEventListener) mq.addEventListener('change', alCambiar);
        else if (mq.addListener) mq.addListener(alCambiar);
    }

    /* ── 2. Submenús (clic en móvil, teclado en escritorio) ─ */
    function cerrarSubmenus(excepto) {
        var abiertos = doc.querySelectorAll('.submenu-toggle[aria-expanded="true"]');
        for (var i = 0; i < abiertos.length; i++) {
            if (abiertos[i] !== excepto) abiertos[i].setAttribute('aria-expanded', 'false');
        }
    }

    function iniciarSubmenus() {
        var botones = doc.querySelectorAll('.submenu-toggle');
        for (var i = 0; i < botones.length; i++) {
            botones[i].addEventListener('click', function (e) {
                e.preventDefault();
                var abierto = this.getAttribute('aria-expanded') === 'true';
                cerrarSubmenus(this);
                this.setAttribute('aria-expanded', abierto ? 'false' : 'true');
            });
        }
        // Un clic fuera cierra los desplegables
        doc.addEventListener('click', function (e) {
            if (!e.target.closest || !e.target.closest('.tiene-submenu')) cerrarSubmenus();
        });
    }

    /* ── 3. Caducidad de las etiquetas "¡Nuevo!" ─────────────
       Cada badge puede llevar su propia fecha:
           <span class="badge-nuevo" data-expira="2026-07-02">¡Nuevo!</span>
       Si no la lleva, se usa POR_DEFECTO.                      */
    var CADUCIDAD_POR_DEFECTO = '2026-05-22';

    function caducarBadges() {
        var ahora = new Date();
        var badges = doc.querySelectorAll('.badge-nuevo, .badge-hero, .badge-nuevo-hero, .badge-nuevo-lucha');
        for (var i = 0; i < badges.length; i++) {
            var fecha = badges[i].getAttribute('data-expira') || CADUCIDAD_POR_DEFECTO;
            if (ahora > new Date(fecha)) badges[i].style.display = 'none';
        }
    }

    /* ── 4. Imágenes rotas: se sustituyen por la del templo ─ */
    function blindarImagenes() {
        var imgs = doc.images;
        for (var i = 0; i < imgs.length; i++) {
            imgs[i].addEventListener('error', function () {
                if (this.dataset.falloYa) return;
                this.dataset.falloYa = '1';
                this.src = 'foto-templo.webp';
            });
        }
    }

    /* ── 5. Vídeo de portada solo cuando compensa ────────────
       El vídeo pesa 3 MB. En móvil, con datos limitados o con
       "ahorro de datos" activado, dejamos la foto fija: se ve
       prácticamente igual y no cuesta nada.                    */
    function cargarVideoPortada() {
        var video = doc.querySelector('video[data-video]');
        if (!video) return;

        var pantallaPequena = window.matchMedia('(max-width: 900px)').matches;
        var ahorroDatos = navigator.connection && navigator.connection.saveData;
        var redLenta = navigator.connection &&
                       /2g|slow-2g/.test(navigator.connection.effectiveType || '');
        var menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (pantallaPequena || ahorroDatos || redLenta || menosMovimiento) return;

        var fuente = doc.createElement('source');
        fuente.src = video.getAttribute('data-video');
        fuente.type = 'video/mp4';
        video.appendChild(fuente);
        video.load();
        video.play().then(function () {
            video.classList.add('video-listo');
        }).catch(function () { /* si el navegador lo bloquea, queda la foto */ });
    }

    /* ── 6. Registro del service worker (modo sin conexión) ─ */
    function registrarSW() {
        if (!('serviceWorker' in navigator)) return;
        if (location.protocol === 'file:') return;
        window.addEventListener('load', function () {
            navigator.serviceWorker.register('sw.js').catch(function () { /* sin conexión, sin drama */ });
        });
    }

    function iniciar() {
        iniciarMenu();
        iniciarSubmenus();
        caducarBadges();
        blindarImagenes();
        cargarVideoPortada();
        registrarSW();
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', iniciar);
    else iniciar();
})();
