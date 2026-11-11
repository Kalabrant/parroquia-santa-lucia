/* ============================================================
   fiestas.js — vida de fiestas-patronales.html.
   · Anuncia la próxima actividad con cuenta regresiva.
   · Pinta el programa desde js/fiestas-datos.js y va retirando
     lo que ya pasó, sin que nadie tenga que tocar la página.
   · Al llegar FIESTAS.cierre, la página se despide.
   ============================================================ */
(function () {
    'use strict';
    if (typeof FIESTAS === 'undefined' || typeof FIESTAS_API === 'undefined') return;

    var A = FIESTAS_API;
    var DIAS_CORTO = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    var MESES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    var quieto = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function $(id) { return document.getElementById(id); }
    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function mayus(t) { return t.charAt(0).toUpperCase() + t.slice(1); }

    /* ---------- Cierre ---------- */
    function cerrar() {
        document.body.classList.add('fp-cerrada');
        var vivo = $('fp-vivo'), fin = $('fp-cierre');
        if (vivo) vivo.hidden = true;
        if (fin) fin.hidden = false;
    }
    if (A.cerrado()) { cerrar(); return; }

    /* ---------- Luces flotantes del encabezado ---------- */
    (function luces() {
        var caja = $('fp-luces');
        if (!caja || quieto) return;
        var n = window.innerWidth < 700 ? 14 : 26, html = '';
        for (var i = 0; i < n; i++) {
            var t = 3 + Math.random() * 7;
            html += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' +
                (Math.random() * 100).toFixed(1) + '%;width:' + t.toFixed(1) + 'px;height:' + t.toFixed(1) +
                'px;animation-duration:' + (7 + Math.random() * 9).toFixed(1) + 's;animation-delay:-' +
                (Math.random() * 12).toFixed(1) + 's"></i>';
        }
        caja.innerHTML = html;
    })();

    /* ---------- Fotos que se relevan dentro del arco ---------- */
    (function pase() {
        var fotos = document.querySelectorAll('#fp-arco img');
        if (fotos.length < 2 || quieto) return;
        var i = 0, FUNDIDO = 2800, PAUSA = 6500;

        function mostrar(sig) {
            var vieja = fotos[i], nueva = fotos[sig];
            vieja.classList.remove('activa');
            vieja.classList.add('saliente');      // sigue visible, debajo
            nueva.classList.add('activa');        // se funde encima
            i = sig;
            setTimeout(function () { vieja.classList.remove('saliente'); }, FUNDIDO + 100);
        }

        setInterval(function () {
            if (document.hidden) return;
            var sig = (i + 1) % fotos.length, img = fotos[sig];
            // No se cambia hasta que la foto esté descargada y lista para pintarse
            if (!img.complete || !img.naturalWidth) return;
            if (img.decode) img.decode().then(function () { mostrar(sig); }, function () { mostrar(sig); });
            else mostrar(sig);
        }, PAUSA);
    })();

    /* ---------- Programa ---------- */
    var destino = $('fp-programa');
    var actosPorDia = {};
    A.plana.forEach(function (x) {
        (actosPorDia[x.dia.clave] = actosPorDia[x.dia.clave] || []).push(x);
    });

    function filasDe(dia, t) {
        var lista = actosPorDia[dia.clave] || [];
        if (dia.novena) {
            // La novena se repite cada día: se muestran sus dos horas fijas
            return dia.actos.map(function (a) {
                return '<li><span class="fp-hora">' + esc(A.hora12(a.h)) + '</span><span>' + esc(a.t) + '</span></li>';
            }).join('');
        }
        return lista.filter(function (x) { return x.fin > t; }).map(function (x) {
            var vivo = x.inicio <= t;
            return '<li' + (vivo ? ' class="fp-ahora"' : '') + '><span class="fp-hora">' + esc(x.horaTexto) +
                '</span><span>' + esc(x.acto.t) + (vivo ? ' <em>ahora</em>' : '') + '</span></li>';
        }).join('');
    }

    function puntosNovena(dia) {
        var hoy = A.hoy(), html = '', f = dia.fecha;
        for (var n = 1; n <= 9; n++) {
            var cls = f < hoy ? 'hecho' : (f === hoy ? 'hoy' : '');
            html += '<span class="' + cls + '" title="' + esc(mayus(A.fechaLarga(f))) + '">' + n + '</span>';
            f = A.sumarDias(f, 1);
        }
        return '<div class="fp-novena" aria-label="Días de la novena">' + html + '</div>';
    }

    function tarjetaDia(dia, t) {
        var p = A.partes(dia.fecha), fechaHtml;
        if (dia.hasta) {
            var q = A.partes(dia.hasta);
            fechaHtml = '<span class="fp-sem">Del</span><span class="fp-num">' + p.dia + '–' + q.dia +
                '</span><span class="fp-mes">' + MESES_CORTO[q.mes] + '</span>';
        } else {
            fechaHtml = '<span class="fp-sem">' + DIAS_CORTO[p.sem] + '</span><span class="fp-num">' + p.dia +
                '</span><span class="fp-mes">' + MESES_CORTO[p.mes] + '</span>';
        }
        return '<article class="fp-dia' + (dia.destacado ? ' fp-destacado' : '') + (dia.novena ? ' fp-es-novena' : '') +
            '" data-clave="' + dia.clave + '">' +
            '<div class="fp-fecha">' + fechaHtml + '</div>' +
            '<div class="fp-cuerpo">' +
                '<span class="fp-cinta" hidden></span>' +
                '<h3>' + esc(dia.titulo) + '</h3>' +
                (dia.lugar ? '<p class="fp-lugar">' + esc(dia.lugar) + '</p>' : '') +
                (dia.novena ? puntosNovena(dia) : '') +
                '<ul class="fp-actos">' + filasDe(dia, t) + '</ul>' +
                (dia.enlace ? '<a class="fp-enlace" href="' + esc(dia.enlace.href) + '" target="_blank" rel="noopener">' +
                    esc(dia.enlace.texto) + ' &rarr;</a>' : '') +
            '</div></article>';
    }

    function finDeDia(dia) {
        var lista = actosPorDia[dia.clave] || [], m = 0;
        lista.forEach(function (x) { if (x.fin > m) m = x.fin; });
        return m;
    }

    function pintarPrograma() {
        if (!destino) return;
        var t = A.ahora(), html = '';
        FIESTAS.bloques.forEach(function (b, i) {
            var dias = b.dias.filter(function (d) { return finDeDia(d) > t; });
            if (!dias.length) return;
            html += '<section class="fp-bloque fp-bloque-' + b.id + '" id="' + b.id + '">' +
                '<header class="fp-bloque-cab fp-revela">' +
                    '<span class="fp-cap">Capítulo ' + (i + 1) + '</span>' +
                    '<h2>' + esc(b.titulo) + '</h2>' +
                    '<p>' + esc(b.intro) + '</p>' +
                '</header>' +
                '<div class="fp-linea">' + dias.map(function (d) { return tarjetaDia(d, t); }).join('') + '</div>' +
            '</section>';
        });
        destino.innerHTML = html;
        // Atajos a los capítulos que siguen vivos
        var atajos = $('fp-atajos');
        if (atajos) {
            atajos.innerHTML = FIESTAS.bloques.filter(function (b) { return $(b.id); }).map(function (b) {
                return '<a href="#' + b.id + '">' + esc(b.titulo.replace(' de Santa Lucía', '')) + '</a>';
            }).join('');
        }
        revelar();
    }

    /* Quita, con una pequeña despedida, lo que acaba de terminar */
    function retirarPasados() {
        if (!destino) return;
        var t = A.ahora();
        FIESTAS.bloques.forEach(function (b) {
            b.dias.forEach(function (d) {
                var el = destino.querySelector('[data-clave="' + d.clave + '"]');
                if (!el || el.classList.contains('fp-sale')) return;
                if (finDeDia(d) <= t) {
                    el.style.maxHeight = el.offsetHeight + 'px';
                    void el.offsetHeight;
                    el.classList.add('fp-sale');
                    setTimeout(function () {
                        var bloque = el.closest('.fp-bloque');
                        el.remove();
                        if (bloque && !bloque.querySelector('.fp-dia')) pintarPrograma();
                    }, quieto ? 0 : 750);
                } else {
                    var ul = el.querySelector('.fp-actos');
                    var nuevo = filasDe(d, t);
                    if (ul && ul.innerHTML !== nuevo) ul.innerHTML = nuevo;
                    if (d.novena) {
                        var pn = el.querySelector('.fp-novena');
                        if (pn) pn.outerHTML = puntosNovena(d);
                    }
                }
            });
        });
    }

    function marcarProxima(x, enCurso) {
        if (!destino) return;
        var antes = destino.querySelectorAll('.fp-es-proxima');
        for (var i = 0; i < antes.length; i++) {
            antes[i].classList.remove('fp-es-proxima', 'fp-en-curso');
            antes[i].querySelector('.fp-cinta').hidden = true;
        }
        if (!x) return;
        var el = destino.querySelector('[data-clave="' + x.dia.clave + '"]');
        if (!el) return;
        el.classList.add('fp-es-proxima');
        el.classList.toggle('fp-en-curso', !!enCurso);
        var c = el.querySelector('.fp-cinta');
        c.textContent = enCurso ? 'En este momento' : 'Próxima actividad';
        c.hidden = false;
    }

    /* ---------- Aparición al hacer scroll ---------- */
    var observador = null;
    function revelar() {
        var els = document.querySelectorAll('.fp-revela:not(.fp-visto), .fp-dia:not(.fp-visto)');
        if (quieto || !('IntersectionObserver' in window)) {
            for (var i = 0; i < els.length; i++) els[i].classList.add('fp-visto');
            return;
        }
        if (!observador) {
            observador = new IntersectionObserver(function (entradas) {
                entradas.forEach(function (e) {
                    if (e.isIntersecting) { e.target.classList.add('fp-visto'); observador.unobserve(e.target); }
                });
            }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        }
        for (var j = 0; j < els.length; j++) {
            els[j].style.transitionDelay = (j % 4) * 70 + 'ms';
            observador.observe(els[j]);
        }
    }

    /* ---------- Próxima actividad + cuenta regresiva ---------- */
    var claveMostrada = null;
    var cd = { d: $('fp-cd-d'), h: $('fp-cd-h'), m: $('fp-cd-m'), s: $('fp-cd-s') };

    function pon(el, valor) {
        if (!el) return;
        var txt = String(valor).padStart(2, '0');
        if (el.textContent === txt) return;
        el.textContent = txt;
        if (!quieto) { el.classList.remove('fp-tic'); void el.offsetWidth; el.classList.add('fp-tic'); }
    }

    function pintarProxima() {
        var pr = A.proxima(), x = pr.actual, caja = $('fp-proxima');
        if (!caja) return;
        if (!x) { caja.hidden = true; return; }
        var enCurso = !!pr.enCurso;
        var clave = x.clave + (enCurso ? '*' : '');

        if (clave !== claveMostrada) {
            claveMostrada = clave;
            caja.classList.toggle('fp-vivo', enCurso);
            $('fp-px-estado').textContent = enCurso ? 'En este momento' : 'Próxima actividad';
            $('fp-px-capitulo').textContent = x.bloque.titulo;
            $('fp-px-titulo').textContent = A.tituloActo(x);
            $('fp-px-cuando').textContent = mayus(A.fechaCercana(x.fecha)) + ' · ' + x.horaTexto;
            var lugar = $('fp-px-lugar');
            lugar.textContent = x.dia.lugar || '';
            lugar.hidden = !x.dia.lugar;
            var luego = $('fp-px-luego');
            if (enCurso && pr.siguiente) {
                luego.textContent = 'Después: ' + A.tituloActo(pr.siguiente) + ' — ' +
                    A.fechaCercana(pr.siguiente.fecha) + ', ' + pr.siguiente.horaTexto;
                luego.hidden = false;
            } else { luego.hidden = true; }
            $('fp-cd').hidden = enCurso;
            if (!quieto) { caja.classList.remove('fp-cambia'); void caja.offsetWidth; caja.classList.add('fp-cambia'); }
            retirarPasados();
            marcarProxima(x, enCurso);
        }

        if (!enCurso) {
            var resto = Math.max(0, x.inicio - A.ahora());
            var seg = Math.floor(resto / 1000);
            pon(cd.d, Math.floor(seg / 86400));
            pon(cd.h, Math.floor(seg % 86400 / 3600));
            pon(cd.m, Math.floor(seg % 3600 / 60));
            pon(cd.s, seg % 60);
        }
    }

    /* ---------- Camino hacia el 13 de diciembre ---------- */
    function pintarCamino() {
        var barra = $('fp-camino-barra'), texto = $('fp-camino-texto');
        if (!barra || !texto) return;
        var ini = A.instante('2026-11-12'), fin = A.instante(FIESTAS.solemnidad), t = A.ahora();
        var pct = Math.max(0, Math.min(1, (t - ini) / (fin - ini)));
        barra.style.setProperty('--avance', (pct * 100).toFixed(1) + '%');
        var hoy = A.hoy(), dias = Math.round((A.instante(FIESTAS.solemnidad) - A.instante(hoy)) / 86400000);
        texto.textContent = dias > 1 ? 'Faltan ' + dias + ' días para la Solemnidad de Santa Lucía'
            : dias === 1 ? 'Mañana es la Solemnidad de Santa Lucía'
            : dias === 0 ? '¡Hoy es la Solemnidad de Santa Lucía!'
            : 'Seguimos de fiesta con nuestra Patrona';
    }

    /* ---------- Arranque ---------- */
    pintarPrograma();
    pintarProxima();
    pintarCamino();
    revelar();

    setInterval(function () {
        if (A.cerrado()) { cerrar(); return; }
        pintarProxima();
    }, 1000);
    setInterval(function () { retirarPasados(); pintarCamino(); }, 30000);
    document.addEventListener('visibilitychange', function () {
        if (!document.hidden) { retirarPasados(); pintarProxima(); pintarCamino(); }
    });
})();
