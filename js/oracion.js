/* ============================================================
   oracion.js — modo oración para las guías de rezo.

   Tres cosas que cambian mucho la experiencia de rezar con el móvil:
     1. Modo oración: fondo oscuro, texto grande, sin menús ni adornos.
     2. La pantalla no se apaga mientras se reza (Wake Lock).
     3. Recuerda por dónde ibas y ofrece continuar al volver.

   Se activa en las páginas marcadas con "oracion": true en
   tools/paginas.json.
   ============================================================ */
(function () {
    'use strict';

    var doc = document;
    var CLAVE_TAMANO = 'sl-tamano-texto';
    var CLAVE_POSICION = 'sl-posicion-' + location.pathname.split('/').pop();
    var MIN = 0, MAX = 3;

    var barra, tamano = 0, wakeLock = null;

    function leer(clave, porDefecto) {
        try { var v = localStorage.getItem(clave); return v === null ? porDefecto : v; }
        catch (e) { return porDefecto; }
    }
    function escribir(clave, valor) {
        try { localStorage.setItem(clave, valor); } catch (e) { /* modo privado */ }
    }

    /* ── Tamaño de letra ────────────────────────────────── */
    function aplicarTamano() {
        // El atributo va en <html> y NO en <body> a propósito: casi todo el
        // texto del sitio está declarado en rem, y rem se calcula sobre el
        // tamaño de fuente de la raíz. Poniéndolo en <body> (o escalando
        // <main>, como estaba antes) el valor cambiaba pero el texto no se
        // movía ni un píxel.
        doc.documentElement.setAttribute('data-tamano-texto', tamano);
        escribir(CLAVE_TAMANO, tamano);
        var menos = barra.querySelector('[data-accion="menos"]');
        var mas = barra.querySelector('[data-accion="mas"]');
        menos.disabled = tamano <= MIN;
        mas.disabled = tamano >= MAX;
    }

    /* ── Mantener la pantalla encendida ─────────────────── */
    function pedirWakeLock() {
        if (!('wakeLock' in navigator)) return;
        navigator.wakeLock.request('screen')
            .then(function (bloqueo) { wakeLock = bloqueo; })
            .catch(function () { /* el navegador puede negarlo, no pasa nada */ });
    }
    function soltarWakeLock() {
        if (wakeLock) { wakeLock.release().catch(function () {}); wakeLock = null; }
    }
    doc.addEventListener('visibilitychange', function () {
        if (doc.visibilityState === 'visible' && doc.body.classList.contains('modo-oracion')) {
            pedirWakeLock();
        }
    });

    /* ── Modo oración ───────────────────────────────────── */
    function alternarModo(activar) {
        var boton = barra.querySelector('[data-accion="modo"]');
        doc.body.classList.toggle('modo-oracion', activar);
        boton.setAttribute('aria-pressed', activar ? 'true' : 'false');
        boton.querySelector('.etiqueta').textContent = activar ? 'Salir' : 'Modo oración';
        if (activar) pedirWakeLock(); else soltarWakeLock();
    }

    /* ── Recordar por dónde iba ─────────────────────────── */
    function guardarPosicion() {
        var alto = doc.documentElement.scrollHeight - window.innerHeight;
        if (alto < 400) return;                       // página corta: no merece la pena
        var pct = window.scrollY / alto;
        if (pct < 0.05 || pct > 0.95) { escribir(CLAVE_POSICION, ''); return; }
        escribir(CLAVE_POSICION, String(Math.round(pct * 1000) / 1000));
    }

    function ofrecerContinuar() {
        var guardado = parseFloat(leer(CLAVE_POSICION, ''));
        if (!guardado || isNaN(guardado)) return;

        var pastilla = doc.createElement('div');
        pastilla.className = 'continuar-pastilla';
        pastilla.innerHTML =
            '<span>Lo dejaste por el ' + Math.round(guardado * 100) + '%</span>' +
            '<button type="button" class="continuar-si">Continuar</button>' +
            '<button type="button" class="continuar-no" aria-label="Empezar desde el principio">&times;</button>';
        doc.body.appendChild(pastilla);

        requestAnimationFrame(function () { pastilla.classList.add('visible'); });

        function quitar() { pastilla.classList.remove('visible');
                            setTimeout(function () { pastilla.remove(); }, 300); }

        pastilla.querySelector('.continuar-si').addEventListener('click', function () {
            var alto = doc.documentElement.scrollHeight - window.innerHeight;
            window.scrollTo({ top: alto * guardado, behavior: 'smooth' });
            quitar();
        });
        pastilla.querySelector('.continuar-no').addEventListener('click', function () {
            escribir(CLAVE_POSICION, ''); quitar();
        });

        setTimeout(function () { if (pastilla.isConnected) quitar(); }, 12000);
    }

    /* ── Barra de herramientas ──────────────────────────── */
    function crearBarra() {
        barra = doc.createElement('div');
        barra.className = 'barra-oracion';
        barra.innerHTML =
            '<button type="button" class="bo-btn" data-accion="modo" aria-pressed="false">' +
                '<span aria-hidden="true">🕯️</span> <span class="etiqueta">Modo oración</span></button>' +
            '<div class="bo-grupo" role="group" aria-label="Tamaño del texto">' +
                '<button type="button" class="bo-btn bo-icono" data-accion="menos" aria-label="Reducir el texto">A−</button>' +
                '<button type="button" class="bo-btn bo-icono" data-accion="mas" aria-label="Agrandar el texto">A+</button>' +
            '</div>';
        doc.body.appendChild(barra);

        barra.addEventListener('click', function (e) {
            var b = e.target.closest('[data-accion]');
            if (!b) return;
            var accion = b.getAttribute('data-accion');
            if (accion === 'modo') alternarModo(!doc.body.classList.contains('modo-oracion'));
            if (accion === 'mas' && tamano < MAX) { tamano++; aplicarTamano(); }
            if (accion === 'menos' && tamano > MIN) { tamano--; aplicarTamano(); }
        });
    }

    doc.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && doc.body.classList.contains('modo-oracion')) alternarModo(false);
    });

    /* ── Arranque ───────────────────────────────────────── */
    crearBarra();
    tamano = Math.min(MAX, Math.max(MIN, parseInt(leer(CLAVE_TAMANO, '0'), 10) || 0));
    aplicarTamano();
    ofrecerContinuar();

    var esperando;
    window.addEventListener('scroll', function () {
        clearTimeout(esperando);
        esperando = setTimeout(guardarPosicion, 400);
    }, { passive: true });

    window.addEventListener('pagehide', guardarPosicion);
})();
