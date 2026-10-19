/* ============================================================
   lucia.js — la avatar de Santa Lucía: dibujo, animación,
   arrastre, botonera y bocadillo. Guía de la web, sin IA.

   Lo que sabe responder vive en js/lucia-nucleo.js y los textos en
   js/lucia-datos.js (generado desde tools/lucia.json). Los dos se
   descargan la primera vez que hacen falta, no en cada página.
   ============================================================ */
(function (W, doc) {
    'use strict';
    if (!doc.addEventListener || W.Lucia && W.Lucia.figura) return;

    var L = W.Lucia = W.Lucia || {};
    L.figura = true;
    var raiz = W.__raiz || '', v = W.__vSitio ? '?v=' + W.__vSitio : '';
    var pag = raiz ? 'la-voz-del-pastor.html' : (location.pathname.split('/').pop() || 'index.html');
    var mq = function (q) { return W.matchMedia && W.matchMedia(q).matches; };
    var quieto = mq('(prefers-reduced-motion: reduce)');
    var est = leer() || {}, pos = { r: est.r || 16, b: est.b || 16 };
    var silencio = !!est.silencio, plegada = mq('(max-width: 640px)') || !!est.plegada;
    var D = null, n = 1, abierto = false, hover = false, saluda = 0, senala = false, orando = false, parpadeo = false;
    var pila = [], ultimoMov = Date.now(), ultimoClic = 0, latidos = 0, cargando = null, retener = false, tCons;
    // Caracas está en UTC−4 todo el año
    var fiesta = new Date(Date.now() - 144e5).toISOString().slice(5, 10) === '12-13';

    function leer() { try { return JSON.parse(localStorage.getItem('lucia')); } catch (e) { return null; } }
    function guardar() {
        try { localStorage.setItem('lucia', JSON.stringify({ r: pos.r, b: pos.b, plegada: plegada, silencio: silencio })); } catch (e) {}
    }
    function sesion(k, val) {
        try {
            if (val === undefined) return JSON.parse(sessionStorage.getItem(k));
            sessionStorage.setItem(k, JSON.stringify(val));
        } catch (e) { return null; }
    }

    var dock = doc.createElement('div');
    dock.className = 'lucia-dock' + (fiesta ? ' lucia-fiesta' : '');
    dock.innerHTML =
        '<div class="lucia-bocadillo" role="dialog" aria-label="Santa Lucía, guía de la web" hidden>' +
            '<button type="button" class="lucia-x" aria-label="Cerrar">&times;</button><div class="lucia-cuerpo" aria-live="polite"></div></div>' +
        '<div class="lucia-fig" role="button" tabindex="0" aria-expanded="false" aria-label="Santa Lucía, guía de la web: ¿en qué te ayudo?">' +
            '<div class="lucia-flip"><div class="lucia-face"><div class="lucia-mood"><span class="lucia-luz"></span><span class="lucia-img"></span></div></div></div></div>' +
        '<div class="lucia-botones">' +
            '<button type="button" data-b="buscar" aria-label="Buscar" title="Buscar">🔍</button>' +
            '<button type="button" data-b="consejo" aria-label="Un consejo" title="Consejo">💡</button>' +
            '<button type="button" data-b="silencio" title="Silencio"></button>' +
            '<button type="button" data-b="plegar" aria-label="Plegar" title="Plegar">▾</button></div>' +
        '<button type="button" class="lucia-mini" aria-label="Mostrar a Santa Lucía, guía de la web"><span></span></button>';
    doc.body.appendChild(dock);

    var $ = function (s) { return dock.querySelector(s); };
    var fig = $('.lucia-fig'), flip = $('.lucia-flip'), face = $('.lucia-face'),
        boc = $('.lucia-bocadillo'), cuerpo = $('.lucia-cuerpo'), bSil = $('[data-b="silencio"]');

    /* Fotogramas: ancho de la imagen ÷ 64 (1, 2 o 4) */
    var img = new Image();
    img.onload = function () { n = Math.max(1, Math.floor(img.naturalWidth / 64)); dock.style.setProperty('--n', n); pintar(); };
    img.src = raiz + 'lucia-sprite.png' + v;
    dock.style.setProperty('--sprite', 'url("' + img.src + '")');

    /* 0 quieta · 1 ojos cerrados · 2 saluda · 3 señala */
    function pintar() {
        var sal = hover || saluda > Date.now(), f = orando ? 1 : senala ? 3 : sal ? 2 : parpadeo ? 1 : 0;
        dock.style.setProperty('--f', f < n ? f : 0);
        dock.classList.toggle('lucia-orando', orando);
        dock.classList.toggle('lucia-saluda', sal);
    }
    function saludar() { saluda = Date.now() + 1200; pintar(); setTimeout(pintar, 1250); }
    function salto() {
        if (quieto) return;
        fig.classList.remove('lucia-salta'); void fig.offsetWidth; fig.classList.add('lucia-salta');
    }
    function chispa() {
        if (quieto || plegada) return;
        var s = doc.createElement('span');
        s.className = 'lucia-chispa'; s.textContent = '✦'; s.setAttribute('aria-hidden', 'true');
        s.style.left = (30 + (latidos * 37) % 40) + '%';
        dock.appendChild(s);
        setTimeout(function () { s.remove(); }, 2200);
    }

    /* ── Posición: distancia al borde derecho e inferior, sin salirse ── */
    function ancho() { return doc.documentElement.clientWidth || innerWidth; }   // sin la barra de desplazamiento
    function alto() { return doc.documentElement.clientHeight || innerHeight; }
    function aplicarPos() {
        // Cada píxel del dibujo ocupa un número entero de píxeles de pantalla (×2, móvil ×1,5): si no, borroso
        var r = W.devicePixelRatio || 1;
        dock.style.setProperty('--lado', Math.max(1, Math.round((mq('(max-width: 640px)') ? 1.5 : 2) * r)) * 64 / r + 'px');
        var w = dock.offsetWidth || 130, h = dock.offsetHeight || 170;
        pos.r = Math.max(4, Math.min(ancho() - w - 4, pos.r));
        pos.b = Math.max(4, Math.min(alto() - h - 4, pos.b));
        dock.style.right = pos.r + 'px'; dock.style.bottom = pos.b + 'px';
        colocar();
    }
    /* Bocadillo debajo si la figura está arriba; siempre dentro de la pantalla */
    function colocar() {
        if (boc.hidden) return;
        var vw = ancho(), vh = alto(), f = fig.getBoundingClientRect(), d = dock.getBoundingClientRect(),
            bw = Math.min(340, vw - 16), x = f.left + f.width / 2 < vw / 2 ? f.left : f.right - bw;
        x = Math.max(8, Math.min(vw - 8 - bw, x));
        boc.style.width = bw + 'px';
        boc.style.left = (x - d.left) + 'px';
        if (f.top + f.height / 2 < vh / 2) {
            boc.style.top = (d.height + 6) + 'px'; boc.style.bottom = 'auto';
            boc.style.maxHeight = (vh - d.bottom - 14) + 'px';
        } else {
            boc.style.bottom = (d.bottom - f.top + 6) + 'px'; boc.style.top = 'auto';
            boc.style.maxHeight = (f.top - 14) + 'px';
        }
    }

    function script(src) {
        return new Promise(function (ok, mal) {
            var s = doc.createElement('script');
            s.src = raiz + src + v; s.onload = ok; s.onerror = mal;
            doc.head.appendChild(s);
        });
    }
    function cargarDatos() {
        if (D) return Promise.resolve();
        return cargando || (cargando = script('js/lucia-datos.js').then(function () { return script('js/lucia-nucleo.js'); })
            .then(function () { D = W.LUCIA_DATOS; L.datos(D); })
            .catch(function (e) { cargando = null; throw e; }));
    }

    /* ── Bocadillo (el HTML lo construye lucia-nucleo.js) ── */
    function vistaInicio() {
        pila = []; senala = false;
        cuerpo.innerHTML = L.htmlInicio(pag);
        pintar();
    }
    function vista(r) {
        var v = L.htmlVista(r, raiz);
        cuerpo.innerHTML = v.html;
        senala = v.senala;
        pintar(); colocar();
    }
    function ir(r) {
        if (!r) return;
        pila.push(r);
        L.listo(r).then(function () { vista(r); });
    }
    function mostrar() {
        if (abierto) return;
        abierto = true; boc.hidden = false; fig.setAttribute('aria-expanded', 'true');
        saludar();
    }
    function abrir(conTeclado) {
        return cargarDatos().then(function () {
            clearTimeout(tCons); retener = true;
            mostrar(); vistaInicio(); colocar();
            if (conTeclado) cuerpo.querySelector('input').focus();
        });
    }
    function cerrar() {
        if (!abierto) return;
        abierto = false; boc.hidden = true; senala = false; clearTimeout(tCons);
        fig.setAttribute('aria-expanded', 'false'); pintar();
    }

    function consejo(auto) {
        return cargarDatos().then(function () {
            var vistos = sesion('lucia-vistos') || [], c = L.siguiente(pag, vistos, auto);
            if (!c) return;
            sesion('lucia-vistos', vistos);
            pila = []; mostrar(); salto();
            vista({ consejo: 1, texto: c.texto, opciones: c.opciones, enlace: c.enlace, wa: c.wa });
            retener = !auto;
            clearTimeout(tCons);
            tCons = setTimeout(function () { if (!retener) cerrar(); }, 9000);
        });
    }

    boc.addEventListener('pointerenter', function () { retener = true; });
    boc.addEventListener('focusin', function () { retener = true; });
    boc.addEventListener('click', function (e) {
        var t = e.target.closest('button');
        if (!t) return;
        if (t.classList.contains('lucia-x')) { cerrar(); fig.focus(); }
        else if (t.hasAttribute('data-ir')) ir(L.nodo(t.getAttribute('data-ir')));
        else if (t.hasAttribute('data-inicio')) vistaInicio();
        else if (t.hasAttribute('data-volver')) { pila.pop(); if (pila.length) vista(pila[pila.length - 1]); else vistaInicio(); }
        else if (t.hasAttribute('data-todos') && W.BuscadorSitio) {
            var q = pila[pila.length - 1].consulta;
            cerrar(); W.BuscadorSitio.abrir(q);
        }
        colocar();
    });
    boc.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = e.target.querySelector('input').value.trim();
        if (!q) return;
        cuerpo.innerHTML = '<p>Buscando…</p>';
        L.resolver(q).then(ir);
    });

    /* ── Botonera ── */
    $('.lucia-botones').addEventListener('click', function (e) {
        var b = e.target.closest('button'), q = b && b.getAttribute('data-b');
        if (q === 'buscar') abrir(true);
        else if (q === 'consejo') consejo(false);
        else if (q === 'silencio') { silencio = !silencio; guardar(); botonSilencio(); }
        else if (q === 'plegar') plegar(true);
    });
    function botonSilencio() {
        bSil.textContent = silencio ? '🔇' : '🔊';
        bSil.setAttribute('aria-pressed', silencio ? 'true' : 'false');
        bSil.setAttribute('aria-label', silencio ? 'Silencio: no da consejos por su cuenta' : 'Silenciar los consejos');
    }
    function plegar(si, sinFoco) {
        plegada = si; cerrar();
        dock.classList.toggle('lucia-plegada', si);
        guardar(); aplicarPos();
        if (!sinFoco) (si ? $('.lucia-mini') : fig).focus();
    }
    $('.lucia-mini').addEventListener('click', function () { plegar(false); });

    /* Mira al ratón: volteo instantáneo, inclinación suave si está cerca */
    var mx = 0, my = 0, raf = 0, mira = 1;
    function mirar() {
        raf = 0;
        if (plegada) return;
        var f = fig.getBoundingClientRect(), dx = mx - (f.left + f.width / 2), dy = my - (f.top + f.height / 2),
            dist = Math.sqrt(dx * dx + dy * dy);
        if (dx < -24) mira = -1; else if (dx > 24) mira = 1;
        flip.style.transform = mira < 0 ? 'scaleX(-1)' : '';
        var a = quieto || dist > 420 ? 0 : 7 * (1 - dist / 420) * Math.min(1, Math.abs(dx) / 100);
        // dentro de la capa volteada el giro se invierte: se compensa con «mira»
        // sin giro, sin transform: así la figura queda nítida (el giro remuestrea los píxeles)
        face.style.transform = a < 1 ? '' : 'rotate(' + (a * (dx < 0 ? -mira : mira)).toFixed(1) + 'deg)';
    }
    doc.addEventListener('pointermove', function (e) {
        mx = e.clientX; my = e.clientY; ultimoMov = Date.now();
        if (orando) { orando = false; pintar(); }
        if (!raf) raf = requestAnimationFrame(mirar);
    }, { passive: true });
    doc.addEventListener('keydown', function (e) {
        ultimoMov = Date.now();
        if (e.key === 'Escape' && abierto && !e.defaultPrevented) { cerrar(); fig.focus(); }
    });

    fig.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { hover = true; salto(); pintar(); } });
    fig.addEventListener('pointerleave', function () { hover = false; pintar(); });
    fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (abierto) cerrar(); else abrir(true); }
    });
    fig.addEventListener('focus', function () { cargarDatos().catch(function () {}); });

    /* ── Arrastre: más de 6 px es arrastre, no clic ── */
    var arr = null;
    fig.addEventListener('pointerdown', function (e) {
        if (e.button) return;
        arr = { x: e.clientX, y: e.clientY, r: pos.r, b: pos.b, mov: false };
        fig.setPointerCapture(e.pointerId);
    });
    fig.addEventListener('pointermove', function (e) {
        if (!arr) return;
        var dx = e.clientX - arr.x, dy = e.clientY - arr.y;
        if (!arr.mov && dx * dx + dy * dy > 36) { arr.mov = true; dock.classList.add('lucia-arrastra'); }
        if (arr.mov) { pos.r = arr.r - dx; pos.b = arr.b - dy; aplicarPos(); }
    });
    fig.addEventListener('pointerup', function () {
        if (!arr) return;
        var a = arr, t = Date.now();
        arr = null;
        dock.classList.remove('lucia-arrastra');
        if (a.mov) { guardar(); return; }   // «pos» es la referencia: ya guarda la posición final recortada
        if (t - ultimoClic < 450) { ultimoClic = t; chispa(); return; }   // muchos clics seguidos: solo una luz
        ultimoClic = t;
        salto();
        if (abierto) cerrar(); else abrir(false);
    });
    fig.addEventListener('pointercancel', function () { arr = null; dock.classList.remove('lucia-arrastra'); });
    W.addEventListener('resize', aplicarPos);

    /* Oración tras 60 s quieto; parpadeo con ritmo fijo, sin azar */
    setInterval(function () {
        latidos++;
        if (!orando && !abierto && Date.now() - ultimoMov > 60000) { orando = true; pintar(); }
        if ((orando && latidos % 4 === 0) || (fiesta && latidos % 6 === 0)) chispa();
    }, 1000);
    var RITMO = [3200, 4700, 3900, 5600, 3400, 4300, 5100], ip = 0;
    (function parpadear() {
        setTimeout(function () {
            parpadeo = true; pintar();
            setTimeout(function () { parpadeo = false; pintar(); parpadear(); }, 150);
        }, RITMO[ip++ % RITMO.length]);
    })();

    /* Un consejo por su cuenta, una vez por visita y página, a los 20 s */
    setTimeout(function () {
        if (silencio || plegada || abierto || sesion('lucia-auto:' + pag)) return;
        sesion('lucia-auto:' + pag, 1);
        consejo(true).catch(function () {});
    }, 20000);

    botonSilencio();
    plegar(plegada, true);
    pintar();
})(window, document);
