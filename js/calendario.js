/* ============================================================
   calendario.js — dibuja la agenda pastoral y la hace filtrable.

   Los datos vienen de js/agenda-datos.js (EVENTOS, DESTACADOS,
   CAT, MESES_*). Este archivo solo se ocupa de pintarlos y de
   las acciones: filtrar, añadir al calendario y compartir.
   ============================================================ */
(function () {
    'use strict';

    if (typeof EVENTOS === 'undefined') return;   // la página no es la agenda

    var WHATSAPP = '584143676212';
    var URL_SITIO = 'https://parroquiasantalucia.org/eventos.html';

    /* ── Utilidades ─────────────────────────────────────── */
    function hoy() { var d = new Date(); d.setHours(0, 0, 0, 0); return d; }

    function parseFecha(str) {
        var p = str.split('-').map(Number);
        return new Date(p[0], p[1] - 1, p[2]);
    }

    function esFuturo(ev) {
        var f = parseFecha(ev.fecha); f.setHours(23, 59, 59);
        return f >= hoy();
    }

    function escapa(t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;')
            .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function sinTildes(t) {
        return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    }

    function fechaLarga(ev) {
        var d = parseFecha(ev.fecha);
        return d.getDate() + ' de ' + MESES_LARGO[d.getMonth()];
    }

    /* ── Acciones de cada evento ────────────────────────── */
    function botonesEvento(ev) {
        return '<div class="evento-acciones">' +
            '<button type="button" class="accion-mini" data-accion="cal" data-fecha="' + escapa(ev.fecha) + '" title="Añadir a mi calendario">' +
                '<span aria-hidden="true">📅</span> Recordármelo</button>' +
            '<button type="button" class="accion-mini" data-accion="wa" data-fecha="' + escapa(ev.fecha) + '" title="Compartir por WhatsApp">' +
                '<span aria-hidden="true">💬</span> Compartir</button>' +
        '</div>';
    }

    function buscarPorFecha(fecha, titulo) {
        return EVENTOS.filter(function (e) { return e.fecha === fecha; })
            .filter(function (e) { return !titulo || e.titulo === titulo; })[0];
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('[data-accion]') : null;
        if (!btn) return;

        var tarjeta = btn.closest('[data-titulo]');
        var ev = buscarPorFecha(btn.getAttribute('data-fecha'),
                                tarjeta && tarjeta.getAttribute('data-titulo'));
        if (!ev) return;

        if (btn.getAttribute('data-accion') === 'cal' && window.ICS) {
            window.ICS.descargar([{
                fecha: ev.fecha, hora: ev.hora, titulo: ev.titulo,
                desc: (ev.desc || '') + (ev.resp ? '\nOrganiza: ' + ev.resp : '')
            }], 'evento-' + ev.fecha);
        }

        if (btn.getAttribute('data-accion') === 'wa') {
            var txt = '*' + ev.titulo + '*\n' +
                      '📅 ' + fechaLarga(ev) + (ev.hora ? ' · ' + ev.hora : '') + '\n' +
                      (ev.desc ? ev.desc + '\n' : '') +
                      '\nParroquia Santa Lucía — ' + URL_SITIO;
            window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank', 'noopener');
        }
    });

    /* ── 1. Evento destacado del momento ────────────────── */
    (function () {
        var zona = document.getElementById('zona-destacada');
        if (!zona) return;

        var ahora = hoy();
        var dest = DESTACADOS.filter(function (d) {
            return ahora >= parseFecha(d.desde) && ahora < parseFecha(d.hasta);
        })[0];

        if (!dest) { zona.style.display = 'none'; return; }

        var items = dest.items.map(function (i) { return '<li>' + escapa(i) + '</li>'; }).join('');
        var btn = dest.btn
            ? '<a href="' + escapa(dest.btn.href) + '" target="_blank" rel="noopener noreferrer" class="btn-principal">' +
              '<i class="fas fa-file-pdf" style="margin-right:8px;"></i>' + escapa(dest.btn.texto) + '</a>'
            : '';

        zona.innerHTML =
            '<div class="evento-destacado">' +
                '<div class="destacado-img">' +
                    '<img src="' + escapa(dest.imagen) + '" alt="' + escapa(dest.titulo) + '" ' +
                    'loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;">' +
                '</div>' +
                '<div class="destacado-info">' +
                    '<span class="etiqueta-alerta">' + escapa(dest.kicker) + '</span>' +
                    '<h2>' + escapa(dest.titulo) + '</h2>' +
                    '<p class="fecha-grande"><i class="far fa-clock"></i> ' + escapa(dest.hora) + '</p>' +
                    '<p class="desc-destacado">' + escapa(dest.desc) + '</p>' +
                    '<ul class="lista-destacado">' + items + '</ul>' +
                    btn +
                '</div>' +
            '</div>';
    })();

    /* ── 2. Próximas seis actividades ───────────────────── */
    (function () {
        var grid = document.getElementById('grid-proximos');
        if (!grid) return;

        var futuros = EVENTOS.filter(esFuturo).slice(0, 6);

        if (!futuros.length) {
            grid.innerHTML = '<p style="text-align:center;width:100%;color:#aaa;">' +
                'No hay eventos próximos. Descarga el plan pastoral completo.</p>';
            return;
        }

        futuros.forEach(function (ev, i) {
            var d = parseFecha(ev.fecha);
            var card = document.createElement('div');
            card.className = 'tarjeta-evento ' + ev.cat;
            card.style.animationDelay = (i * 0.07) + 's';
            card.setAttribute('data-titulo', ev.titulo);
            card.innerHTML =
                '<div class="fecha-badge">' +
                    '<span class="dia">' + String(d.getDate()).padStart(2, '0') + '</span>' +
                    '<span class="mes">' + MESES_CORTO[d.getMonth()] + '</span>' +
                '</div>' +
                '<div class="evento-detalle">' +
                    '<h3>' + escapa(ev.titulo) + '</h3>' +
                    (ev.hora ? '<p class="hora"><i class="far fa-clock"></i> ' + escapa(ev.hora) + '</p>' : '') +
                    '<p class="desc-breve">' + escapa(ev.desc) + '</p>' +
                    (ev.resp ? '<span class="resp-pill">' + escapa(ev.resp) + '</span>' : '') +
                    botonesEvento(ev) +
                '</div>';
            grid.appendChild(card);
        });

        var msg = document.getElementById('msg-proximos');
        if (msg) msg.textContent = 'Mostrando las próximas ' + futuros.length +
            ' actividades de nuestra agenda pastoral.';
    })();

    /* ── 3. Calendario completo, con filtros ────────────── */
    (function () {
        var contenedor = document.getElementById('contenedor-meses');
        if (!contenedor) return;

        var futuros = EVENTOS.filter(esFuturo);
        var resumen = document.getElementById('filtro-resumen');
        var inputTexto = document.getElementById('filtro-texto');
        var selectGrupo = document.getElementById('filtro-grupo');
        var chips = document.getElementById('filtro-categorias');

        var estado = { texto: '', grupo: '', cat: '' };

        /* El desplegable de grupos se rellena solo con los que
           realmente organizan algo este año. */
        if (selectGrupo) {
            // Un evento puede tener varios responsables: "Cáritas + Legión",
            // "Catequesis / Legión". Los separamos para que cada grupo
            // aparezca una sola vez en la lista.
            var GENERICOS = ['todos los grupos', 'varios grupos', 'todos', ''];
            var grupos = {};
            futuros.forEach(function (ev) {
                (ev.resp || '').split(/\s*[+/]\s*/).forEach(function (g) {
                    g = g.trim();
                    if (g && GENERICOS.indexOf(g.toLowerCase()) === -1) grupos[g] = true;
                });
            });
            Object.keys(grupos).sort(function (a, b) { return a.localeCompare(b, 'es'); })
                .forEach(function (g) {
                    var o = document.createElement('option');
                    o.value = g; o.textContent = g;
                    selectGrupo.appendChild(o);
                });
        }

        function pasa(ev) {
            if (estado.cat && ev.cat !== estado.cat) return false;
            if (estado.grupo && sinTildes(ev.resp).indexOf(sinTildes(estado.grupo)) === -1) return false;
            if (estado.texto) {
                var heno = sinTildes(ev.titulo + ' ' + ev.desc + ' ' + (ev.resp || ''));
                if (heno.indexOf(estado.texto) === -1) return false;
            }
            return true;
        }

        function pintar() {
            var visibles = futuros.filter(pasa);
            contenedor.innerHTML = '';

            if (!visibles.length) {
                contenedor.innerHTML =
                    '<p class="sin-resultados">No hay actividades que coincidan con la búsqueda. ' +
                    '<button type="button" class="enlace-boton" id="limpiar-filtros">Ver toda la agenda</button></p>';
                if (resumen) resumen.textContent = 'Ninguna actividad coincide.';
                return;
            }

            var porMes = {};
            visibles.forEach(function (ev) {
                var m = parseFecha(ev.fecha).getMonth();
                (porMes[m] = porMes[m] || []).push(ev);
            });

            Object.keys(porMes).map(Number).sort(function (a, b) { return a - b; })
                .forEach(function (m) {
                    var tema = MESES_TEMATICO[m] ? ' · ' + MESES_TEMATICO[m] : '';
                    var bloque = document.createElement('div');
                    bloque.className = 'mes-bloque';
                    bloque.innerHTML =
                        '<div class="mes-header">' +
                            '<span class="mes-nombre">' + MESES_LARGO[m] + '</span>' +
                            '<span class="mes-subtitulo">' + escapa(tema) + '</span>' +
                        '</div><div class="mes-grid"></div>';
                    var grid = bloque.querySelector('.mes-grid');

                    porMes[m].forEach(function (ev) {
                        var d = parseFecha(ev.fecha);
                        var item = document.createElement('div');
                        item.className = 'item-mes ' + ev.cat;
                        item.setAttribute('data-titulo', ev.titulo);
                        item.innerHTML =
                            '<div class="item-dia">' +
                                '<span class="n-dia">' + String(d.getDate()).padStart(2, '0') + '</span>' +
                                '<span class="n-mes">' + MESES_CORTO[d.getMonth()] + '</span>' +
                            '</div>' +
                            '<div class="item-info">' +
                                '<h4>' + escapa(ev.titulo) + '</h4>' +
                                (ev.hora ? '<span class="item-hora"><i class="far fa-clock" style="margin-right:3px;"></i>' + escapa(ev.hora) + '</span>' : '') +
                                (ev.desc ? '<p class="item-desc">' + escapa(ev.desc) + '</p>' : '') +
                                (ev.resp ? '<span class="item-resp">' + escapa(ev.resp) + '</span>' : '') +
                                botonesEvento(ev) +
                            '</div>';
                        grid.appendChild(item);
                    });

                    contenedor.appendChild(bloque);
                });

            if (resumen) {
                var filtrando = estado.cat || estado.grupo || estado.texto;
                resumen.textContent = filtrando
                    ? visibles.length + ' de ' + futuros.length + ' actividades coinciden.'
                    : visibles.length + ' actividades por venir este año.';
            }
        }

        /* ── Conexiones de los controles ── */
        if (inputTexto) {
            var temporizador;
            inputTexto.addEventListener('input', function () {
                clearTimeout(temporizador);
                var v = this.value;
                temporizador = setTimeout(function () {
                    estado.texto = sinTildes(v.trim());
                    pintar();
                }, 180);
            });
        }

        if (selectGrupo) {
            selectGrupo.addEventListener('change', function () {
                estado.grupo = this.value; pintar();
            });
        }

        if (chips) {
            chips.addEventListener('click', function (e) {
                var chip = e.target.closest('.chip');
                if (!chip) return;
                chips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('activo'); });
                chip.classList.add('activo');
                estado.cat = chip.getAttribute('data-cat');
                pintar();
            });
        }

        contenedor.addEventListener('click', function (e) {
            if (e.target.id !== 'limpiar-filtros') return;
            estado = { texto: '', grupo: '', cat: '' };
            if (inputTexto) inputTexto.value = '';
            if (selectGrupo) selectGrupo.value = '';
            if (chips) {
                chips.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('activo'); });
                chips.querySelector('.chip').classList.add('activo');
            }
            pintar();
        });

        pintar();
    })();
})();
