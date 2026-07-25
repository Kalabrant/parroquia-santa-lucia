/* ============================================================
   buscador.js — búsqueda en todo el sitio, sin servidor.

   El índice (js/indice-busqueda.js) lo genera tools/sincronizar.py
   leyendo el contenido real de cada página. Aquí solo se puntúan
   los resultados y se pintan.

   Se abre con el botón de la lupa o pulsando "/".
   ============================================================ */
(function () {
    'use strict';

    var MAX_RESULTADOS = 8;
    var abierto = false;
    var caja, campo, lista, resumen, ultimoFoco;
    var indice = null, cargando = null;

    /* El índice pesa unas decenas de KB. No tiene sentido descargarlo
       en cada visita, así que se pide la primera vez que alguien busca. */
    function cargarIndice() {
        if (indice) return Promise.resolve(indice);
        if (cargando) return cargando;

        cargando = new Promise(function (resolver, rechazar) {
            var s = document.createElement('script');
            s.src = 'js/indice-busqueda.js' + (window.__vSitio ? '?v=' + window.__vSitio : '');
            s.onload = function () {
                indice = (typeof INDICE_BUSQUEDA !== 'undefined') ? INDICE_BUSQUEDA : [];
                resolver(indice);
            };
            s.onerror = function () { rechazar(new Error('no se pudo cargar el índice')); };
            document.head.appendChild(s);
        });
        return cargando;
    }

    function normaliza(t) {
        return String(t || '').toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    /* Puntuación: pesa más un acierto en el título que en el cuerpo,
       y premia que aparezcan todas las palabras buscadas. */
    function puntuar(reg, palabras) {
        var titulo = normaliza(reg.t);
        var desc = normaliza(reg.d);
        var enc = normaliza(reg.h.join(' '));
        var cuerpo = normaliza(reg.x);
        var total = 0;

        for (var i = 0; i < palabras.length; i++) {
            var p = palabras[i];
            var sub = 0;
            if (titulo === p) sub += 120;
            else if (titulo.indexOf(p) === 0) sub += 70;
            else if (titulo.indexOf(p) !== -1) sub += 50;
            if (desc.indexOf(p) !== -1) sub += 16;
            if (enc.indexOf(p) !== -1) sub += 12;
            if (cuerpo.indexOf(p) !== -1) sub += 5;
            if (!sub) return 0;          // si falta una palabra, se descarta
            total += sub;
        }
        return total;
    }

    function extracto(reg, palabras) {
        var cuerpo = reg.x || reg.d || '';
        var plano = normaliza(cuerpo);
        var pos = -1;
        for (var i = 0; i < palabras.length && pos === -1; i++) {
            pos = plano.indexOf(palabras[i]);
        }
        if (pos === -1) return reg.d;
        var desde = Math.max(0, pos - 60);
        var trozo = cuerpo.slice(desde, desde + 170).trim();
        return (desde > 0 ? '…' : '') + trozo + '…';
    }

    function resaltar(texto, palabras) {
        var salida = escapa(texto);
        palabras.forEach(function (p) {
            if (p.length < 2) return;
            var re = new RegExp('(' + p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            // Se busca sobre el texto sin tildes, pero se marca sobre el original:
            // por sencillez marcamos solo las coincidencias literales.
            salida = salida.replace(re, '<mark>$1</mark>');
        });
        return salida;
    }

    function escapa(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function buscar(consulta) {
        var palabras = normaliza(consulta).split(/\s+/).filter(function (p) { return p.length > 1; });
        if (!palabras.length || !indice) return [];

        return indice
            .map(function (reg) { return { reg: reg, pts: puntuar(reg, palabras) }; })
            .filter(function (r) { return r.pts > 0; })
            .sort(function (a, b) { return b.pts - a.pts; })
            .slice(0, MAX_RESULTADOS)
            .map(function (r) {
                return {
                    url: r.reg.u,
                    titulo: r.reg.t,
                    extracto: extracto(r.reg, palabras),
                    palabras: palabras
                };
            });
    }

    function pintar(consulta) {
        var res = buscar(consulta);

        if (!consulta.trim()) {
            lista.innerHTML = '';
            resumen.textContent = 'Escribe para buscar en toda la web: horarios, sacramentos, grupos, oraciones…';
            return;
        }
        if (!res.length) {
            lista.innerHTML = '';
            resumen.textContent = 'No encontramos nada para «' + consulta + '».';
            return;
        }

        resumen.textContent = res.length === 1 ? '1 resultado' : res.length + ' resultados';
        lista.innerHTML = res.map(function (r, i) {
            return '<li><a href="' + escapa(r.url) + '"' + (i === 0 ? ' data-primero' : '') + '>' +
                       '<span class="res-titulo">' + resaltar(r.titulo, r.palabras) + '</span>' +
                       '<span class="res-extracto">' + resaltar(r.extracto, r.palabras) + '</span>' +
                   '</a></li>';
        }).join('');
    }

    /* ── Construcción del panel ─────────────────────────── */
    function crearPanel() {
        caja = document.createElement('div');
        caja.className = 'buscador-fondo';
        caja.setAttribute('role', 'dialog');
        caja.setAttribute('aria-modal', 'true');
        caja.setAttribute('aria-label', 'Buscar en el sitio');
        caja.innerHTML =
            '<div class="buscador-panel">' +
                '<div class="buscador-cabecera">' +
                    '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">' +
                        '<circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>' +
                    '<input type="search" id="buscador-campo" placeholder="Buscar horarios, sacramentos, grupos…" ' +
                           'autocomplete="off" spellcheck="false" aria-label="Buscar en el sitio">' +
                    '<button type="button" class="buscador-cerrar" aria-label="Cerrar la búsqueda">&times;</button>' +
                '</div>' +
                '<p class="buscador-resumen" role="status" aria-live="polite"></p>' +
                '<ul class="buscador-lista"></ul>' +
                '<p class="buscador-pista">Consejo: pulsa <kbd>/</kbd> para buscar desde cualquier página.</p>' +
            '</div>';
        document.body.appendChild(caja);

        campo = caja.querySelector('#buscador-campo');
        lista = caja.querySelector('.buscador-lista');
        resumen = caja.querySelector('.buscador-resumen');

        var temporizador;
        campo.addEventListener('input', function () {
            clearTimeout(temporizador);
            var v = this.value;
            temporizador = setTimeout(function () { pintar(v); }, 120);
        });

        // Enter va al primer resultado
        campo.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var primero = lista.querySelector('a[data-primero]');
                if (primero) { e.preventDefault(); window.location.href = primero.getAttribute('href'); }
            }
            if (e.key === 'ArrowDown') {
                var a = lista.querySelector('a');
                if (a) { e.preventDefault(); a.focus(); }
            }
        });

        lista.addEventListener('keydown', function (e) {
            var enlaces = [...lista.querySelectorAll('a')];
            var i = enlaces.indexOf(document.activeElement);
            if (e.key === 'ArrowDown' && i < enlaces.length - 1) { e.preventDefault(); enlaces[i + 1].focus(); }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (i > 0) enlaces[i - 1].focus(); else campo.focus();
            }
        });

        caja.querySelector('.buscador-cerrar').addEventListener('click', cerrar);
        caja.addEventListener('click', function (e) { if (e.target === caja) cerrar(); });
    }

    function abrir() {
        if (!caja) crearPanel();
        ultimoFoco = document.activeElement;
        abierto = true;
        caja.classList.add('visible');
        document.body.classList.add('buscador-abierto');
        campo.value = '';
        campo.focus();

        resumen.textContent = 'Preparando la búsqueda…';
        cargarIndice().then(function () {
            pintar(campo.value);
        }).catch(function () {
            resumen.textContent = 'No se pudo cargar el buscador. Prueba a recargar la página.';
        });
    }

    function cerrar() {
        if (!abierto) return;
        abierto = false;
        caja.classList.remove('visible');
        document.body.classList.remove('buscador-abierto');
        if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    /* ── Disparadores ───────────────────────────────────── */
    document.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-abrir-buscador]') : null;
        if (b) { e.preventDefault(); abrir(); }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && abierto) { e.preventDefault(); cerrar(); return; }

        // "/" abre el buscador, salvo si ya se está escribiendo en algún campo
        if (e.key === '/' && !abierto) {
            var t = e.target;
            var escribiendo = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
            if (escribiendo) return;
            e.preventDefault();
            abrir();
        }
    });
})();
