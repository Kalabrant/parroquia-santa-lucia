/* ============================================================
   lucia-nucleo.js — lo que la avatar de Santa Lucía sabe responder.

   Determinista y sin IA: todo sale de js/lucia-datos.js (que genera
   tools/sincronizar.py desde tools/lucia.json) y de los datos de la
   web. Misma página, mismo día y misma pregunta → misma respuesta.
   Los textos se cambian en tools/lucia.json, no aquí.

   No se carga en cada página: js/lucia.js (la figura) lo pide junto
   con los datos la primera vez que hace falta. tools/test_lucia.mjs
   lo prueba con fecha y hora fijas.
   ============================================================ */
(function (G) {
    'use strict';

    var D = null, reSin = null, mapSin = {};
    var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto',
                 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    var COD = { Su: 0, Mo: 1, Tu: 2, We: 3, Th: 4, Fr: 5, Sa: 6 };
    var MISTERIOS = ['gloriosos', 'gozosos', 'dolorosos', 'gloriosos', 'luminosos', 'dolorosos', 'gozosos'];
    var VACIAS = ' de la el los las un una unos en y o que es mi me para por con del al se lo le hay como quiero necesito busco saber puedo hacer donde cual ';
    var DIA = 864e5;
    var L = G.Lucia = G.Lucia || {};

    /* ── Tiempo: Caracas está en UTC−4 todo el año (sin horario de verano) ── */
    function ahora() { return new Date((L.ahora ? +L.ahora : Date.now()) - 4 * 36e5); }
    function iso(c) { return c.toISOString().slice(0, 10); }
    function aMin(hm) { var p = hm.split(':'); return p[0] * 60 + +p[1]; }
    function minDe(c) { return c.getUTCHours() * 60 + c.getUTCMinutes(); }
    function h12(m) {
        var h = Math.floor(m / 60), mm = m % 60;
        return (h % 12 || 12) + ':' + (mm < 10 ? '0' : '') + mm + (h < 12 ? ' AM' : ' PM');
    }
    function cuando(k, d) { return k === 0 ? 'hoy' : k === 1 ? 'mañana ' + DIAS[d] : 'el ' + DIAS[d]; }
    function lista(x) { return [].concat(x); }

    /* «Tu,We 14:00-17:00» → por día de la semana, [[inicio, fin?], …] */
    function semana(schemas) {
        var s = [[], [], [], [], [], [], []];
        schemas.forEach(function (x) {
            var p = x.split(' ');
            p[0].split(',').forEach(function (d) {
                p[1].split(',').forEach(function (h) { s[COD[d]].push(h.split('-').map(aMin)); });
            });
        });
        return s;
    }
    function proxima(sem, c, antes) {
        var hoy = c.getUTCDay(), m = minDe(c);
        for (var k = 0; k < 8; k++) {
            var l = sem[(hoy + k) % 7];
            for (var i = 0; i < l.length; i++) {
                var ini = l[i][0] - (antes || 0);
                if (k || ini > m) return { k: k, m: ini, d: (hoy + k) % 7, fin: l[i][1] };
            }
        }
    }

    /* Pascua por el algoritmo de Meeus/Jones/Butcher (calendario gregoriano) */
    function pascua(y) {
        var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
            f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
            h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4,
            l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
            n = h + l - 7 * m + 114;
        return Date.UTC(y, Math.floor(n / 31) - 1, n % 31 + 1);
    }
    function tiempos(c) {
        var y = c.getUTCFullYear(), t = Date.UTC(y, c.getUTCMonth(), c.getUTCDate()),
            p = (t - pascua(y)) / DIA, r = [],
            nav = Date.UTC(y, 11, 25), adv = nav - ((new Date(nav).getUTCDay() || 7) + 21) * DIA;
        if (p === -46) r.push('ceniza');
        if (p >= -46 && p < -7) r.push('cuaresma');
        if (p >= -7 && p <= 0) r.push('semana-santa');
        if (p > 0 && p <= 49) r.push('pascua');
        if (p === 49) r.push('pentecostes');
        if (t >= adv && t < nav) r.push('adviento');
        if (t >= nav || (c.getUTCMonth() === 0 && c.getUTCDate() <= 6)) r.push('navidad');
        return r;
    }
    L.pascua = function (y) { return new Date(pascua(y)).toISOString().slice(0, 10); };
    L.ceniza = function (y) { return new Date(pascua(y) - 46 * DIA).toISOString().slice(0, 10); };
    L.tiempos = function () { return tiempos(ahora()); };

    /* ── Agenda ── */
    function fechaTxt(f, c) {
        var k = Math.round((Date.parse(f) - Date.parse(iso(c))) / DIA), d = new Date(Date.parse(f));
        if (k < 2) return k ? 'mañana' : 'hoy';
        return 'el ' + DIAS[d.getUTCDay()] + ' ' + d.getUTCDate() + ' de ' + MESES[d.getUTCMonth()];
    }
    function proximas(dias) {
        var c = ahora(), hoy = iso(c), tope = iso(new Date(+c + dias * DIA));
        return D.agenda.filter(function (e) { return e[0] >= hoy && e[0] <= tope; });
    }
    function actividad(e, c) { return fechaTxt(e[0], c) + ': ' + e[2] + (e[1] ? ' (' + e[1] + ')' : ''); }

    /* ── Marcadores {…} con datos reales ── */
    var MARC = {
        proximaMisa: function (c) {
            var p = proxima(semana(D.cfg.misas), c);
            return 'La próxima Misa es ' + cuando(p.k, p.d) + ' a las ' + h12(p.m) + '.';
        },
        listaMisas: function () {
            return D.cfg.listaMisas.map(function (m) { return '• ' + m[0] + ': ' + m[1].join(' · '); }).join('\n');
        },
        notaHorarios: function () { return D.cfg.nota; },
        confesionHoy: function (c) {
            var antes = D.cfg.confesionAntes, m = minDe(c),
                hoy = semana(D.cfg.misas)[c.getUTCDay()].filter(function (x) { return x[0] > m; });
            if (hoy.length) {
                return hoy[0][0] - antes > m ? 'Hoy puedes confesarte desde las ' + h12(hoy[0][0] - antes) + '.'
                    : 'Ahora hay confesiones, hasta que empiece la Misa de las ' + h12(hoy[0][0]) + '.';
            }
            var p = proxima(semana(D.cfg.misas), c, antes);
            return 'Hoy ya no hay confesiones; la próxima ocasión es ' + cuando(p.k, p.d) + ' desde las ' + h12(p.m) + '.';
        },
        despacho: function (c) {
            var m = minDe(c), sem = semana([D.cfg.despacho]),
                ab = sem[c.getUTCDay()].filter(function (x) { return m >= x[0] && m < x[1]; })[0];
            if (ab) return 'El despacho está abierto ahora, hasta las ' + h12(ab[1]) + '.';
            var p = proxima(sem, c);
            return 'El despacho abre ' + cuando(p.k, p.d) + ' a las ' + h12(p.m) + '.';
        },
        horarioDespacho: function () { return D.cfg.horarioDespacho; },
        direccion: function () { return D.cfg.direccion; },
        mapsUrl: function () { return D.cfg.mapsUrl; },
        misterios: function (c) {
            return 'Hoy, ' + DIAS[c.getUTCDay()] + ', se rezan los misterios ' + MISTERIOS[c.getUTCDay()] + '.';
        },
        proximaActividad: function (c) {
            var e = proximas(400)[0];
            return e ? 'La próxima actividad es ' + actividad(e, c) + '.' : 'Por ahora no hay actividades anunciadas en la agenda.';
        },
        semana: function (c) {
            var l = proximas(6);
            return l.length ? 'Esta semana:\n' + l.map(function (e) { return '• ' + actividad(e, c); }).join('\n')
                : 'Esta semana no hay actividades especiales. ' + MARC.proximaActividad(c);
        },
        evangelio: function () { return L.evangelio || 'El Evangelio de cada día está en la sección de oración.'; }
    };
    function rellenar(t) {
        var c = ahora();
        return String(t || '').replace(/\{(\w+)\}/g, function (m, k) { return MARC[k] ? MARC[k](c) : m; });
    }
    L.rellenar = rellenar;

    /* ── Entender la pregunta ── */
    function norm(t) {
        return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function prep(t) {
        t = norm(t);
        for (var i = 0; i < 3; i++) {
            var n = t.replace(reSin, function (m) { return mapSin[m]; });
            if (n === t) break;
            t = n;
        }
        return ' ' + t + ' ';
    }
    /* frase exacta = 3 · palabra clave = 1 · mismo prefijo de 5 letras = 0,5 */
    function puntos(q, qw, claves) {
        var s = 0, usadas = {};
        claves.forEach(function (k) {
            if (q.indexOf(' ' + k + ' ') >= 0) {
                // las palabras de una frase ya puntuada no vuelven a sumar sueltas
                s += 3; k.split(' ').forEach(function (w) { usadas[w] = 1; }); return;
            }
            k.split(' ').forEach(function (w) {
                if (w.length < 3 || VACIAS.indexOf(' ' + w + ' ') >= 0 || usadas[w]) return;
                if (qw.indexOf(w) >= 0) { s += 1; usadas[w] = 1; }
                else if (w.length >= 5 && qw.some(function (x) { return x.length >= 5 && x.slice(0, 5) === w.slice(0, 5); })) {
                    s += 0.5; usadas[w] = 1;
                }
            });
        });
        return s;
    }
    function nodo(id) {
        var g = D.guias[id];
        if (g) return { tipo: 'guia', id: id, texto: g.texto || g.respuesta, pregunta: g.pregunta,
                        opciones: g.opciones, enlaces: g.enlaces, wa: g.wa };
        var it = D.intenciones.filter(function (x) { return x.id === id; })[0];
        if (!it) return null;
        if (it.guia) return nodo(it.guia);
        return { tipo: 'intencion', id: id, texto: it.respuesta, enlaces: it.enlaces, wa: it.wa, urgente: it.urgente };
    }
    function intencion(consulta) {
        var q = prep(consulta), qw = q.trim().split(' '), mejor = null, mp = 0;
        D.intenciones.forEach(function (it) {
            var s = puntos(q, qw, it._k);
            if (s > mp) { mp = s; mejor = it; }      // empate: gana la que va antes
        });
        return mp >= 1.5 ? nodo(mejor.id) : null;
    }
    /* Si la búsqueda completa no da nada, prueba sin palabras vacías y luego
       palabra a palabra, en el orden en que se escribieron. */
    function buscarIndice(consulta) {
        var B = G.BuscadorSitio;
        if (!B) return Promise.resolve([]);
        return B.cargar().then(function () {
            var ws = norm(consulta).split(' ').filter(function (w) { return w.length > 2 && VACIAS.indexOf(' ' + w + ' ') < 0; });
            var intentos = [consulta, ws.join(' ')].concat(ws);
            for (var i = 0; i < intentos.length; i++) {
                var r = intentos[i] ? B.buscar(intentos[i]) : [];
                if (r.length) return r;
            }
            return [];
        }).catch(function () { return []; });
    }
    function cargarEvangelio() {
        if (L.evangelio || typeof fetch === 'undefined') return Promise.resolve();
        return fetch((G.__raiz || '') + 'evangelio.json').then(function (r) { return r.json(); }).then(function (j) {
            var d = j.dias.filter(function (x) { return x.fecha === iso(ahora()); })[0];
            if (d) L.evangelio = 'Hoy, ' + d.diaLiturgico + ': ' + d.cita;
        }).catch(function () {});
    }
    L.resolver = function (consulta) {
        var r = intencion(consulta);
        if (r) return (/\{evangelio\}/.test(r.texto) ? cargarEvangelio() : Promise.resolve()).then(function () { return r; });
        return buscarIndice(consulta).then(function (res) {
            return res.length ? { tipo: 'busqueda', consulta: consulta, resultados: res.slice(0, 3) }
                : { tipo: 'nada', texto: 'No lo encuentro en la web. Escríbele a secretaría y te ayudan.', wa: 'general' };
        });
    };
    L.nodo = nodo;
    /* El Evangelio del día se descarga solo cuando alguien lo pide */
    L.listo = function (r) { return /\{evangelio\}/.test(r.texto || '') ? cargarEvangelio() : Promise.resolve(); };
    /* El primer consejo del día que no se haya visto en esta visita. Apunta su id
       en «vistos» (la lista de sessionStorage). Si ya se vieron todos, vuelve a
       empezar, salvo cuando sale solo (auto): entonces no dice nada. */
    L.siguiente = function (pag, vistos, auto) {
        var l = L.consejos(pag), c = l.filter(function (x) { return vistos.indexOf(x.id) < 0; })[0];
        if (!c && !auto) { vistos.length = 0; c = l[0]; }
        if (c) vistos.push(c.id);
        return c;
    };
    L.cumple = cumple;
    L.cargarEvangelio = cargarEvangelio;
    L.hoy = function () { return ahora(); };

    /* ── Consejos: condiciones fijas, orden según el día del año ── */
    function cumple(si, c, pag) {
        if (!si) return true;
        var m = minDe(c), md = iso(c).slice(5);
        return !((si.pagina && lista(si.pagina).indexOf(pag) < 0) ||
                 (si.dia && lista(si.dia).map(norm).indexOf(norm(DIAS[c.getUTCDay()])) < 0) ||
                 (si.antesDe && m >= aMin(si.antesDe)) ||
                 (si.desde && m < aMin(si.desde)) ||
                 (si.fecha && lista(si.fecha).indexOf(md) < 0) ||
                 (si.tiempo && tiempos(c).indexOf(si.tiempo) < 0) ||
                 (si.agenda && !proximas(si.agenda).length));
    }
    L.consejos = function (pag) {
        var c = ahora(), dia = Math.floor((+c - Date.UTC(c.getUTCFullYear(), 0, 1)) / DIA);
        var ok = D.consejos.filter(function (x) { return cumple(x.si, c, pag); });
        // Primero los de fecha fija (13 de diciembre…), luego los de la página o el
        // tiempo litúrgico y al final el resto. Cada grupo rota según el día del año.
        function grupo(x) { var s = x.si || {}; return s.fecha ? 0 : (s.pagina || s.tiempo) ? 1 : 2; }
        function rotar(l) { var k = l.length ? dia % l.length : 0; return l.slice(k).concat(l.slice(0, k)); }
        return [0, 1, 2].reduce(function (a, g) {
            return a.concat(rotar(ok.filter(function (x) { return grupo(x) === g; })));
        }, []);
    };

    /* ── HTML del bocadillo (js/lucia.js solo lo coloca) ── */
    function esc(t) {
        return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }
    function parrafos(t) { return rellenar(t).split('\n').map(function (p) { return '<p>' + esc(p) + '</p>'; }).join(''); }
    function enlace(e, raiz) {
        var u = rellenar(e[1]), ext = /^https?:/.test(u);
        return '<a class="lucia-enlace" href="' + esc(ext ? u : raiz + u) + '"' +
            (ext ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + esc(e[0]) + ' →</a>';
    }
    function waBoton(k, urgente) {
        var w = D.wa[k];
        return w ? '<a class="lucia-wa' + (urgente ? ' lucia-wa-urgente' : '') + '" href="' + esc(w[2]) +
            '" target="_blank" rel="noopener noreferrer">' + w[1] + ' ' + esc(w[0]) + '</a>' : '';
    }
    function opciones(l) {
        return '<div class="lucia-opciones">' + l.map(function (o) {
            return '<button type="button" data-ir="' + esc(o[1]) + '">' + esc(o[0]) + '</button>';
        }).join('') + '</div>';
    }
    L.htmlInicio = function (pag) {
        var c = ahora(), h = c.getUTCHours(),
            at = D.atajos.filter(function (a) { return cumple(a[2], c, pag); });
        // primero los atajos propios de la página, luego los generales
        at = at.filter(function (a) { return a[2]; }).concat(at.filter(function (a) { return !a[2]; })).slice(0, 7);
        return '<p class="lucia-titulo">' + (h < 12 ? '¡Buenos días!' : h < 19 ? '¡Buenas tardes!' : '¡Buenas noches!') +
            ' ¿En qué te ayudo?</p><form class="lucia-form" role="search">' +
            '<input type="search" placeholder="Escribe lo que buscas…" aria-label="Escribe lo que buscas" autocomplete="off">' +
            '<button type="submit" aria-label="Buscar">→</button></form>' +
            opciones(at.map(function (a) { return [a[0], a[1]]; }));
    };
    L.htmlVista = function (r, raiz) {
        var h = '', urg = r.urgente && r.wa, en = (r.enlaces || []).concat(r.enlace ? [r.enlace] : []);
        if (urg) h += waBoton(r.wa, true);        // urgencia: lo primero, el WhatsApp
        if (r.texto) h += parrafos(r.texto);
        if (r.pregunta) h += '<p class="lucia-pregunta">' + esc(r.pregunta) + '</p>';
        if (r.opciones) h += opciones(r.opciones);
        if (r.resultados) {
            h += '<p>Esto es lo que encuentro en la web:</p><ul class="lucia-resultados">' + r.resultados.map(function (x) {
                return '<li><a href="' + esc(x.url) + '"><strong>' + esc(x.titulo) + '</strong><span>' + esc(x.extracto) + '</span></a></li>';
            }).join('') + '</ul><button type="button" class="lucia-todos" data-todos>Ver todos los resultados</button>';
        }
        if (en.length) h += '<div class="lucia-enlaces">' + en.map(function (e) { return enlace(e, raiz || ''); }).join('') + '</div>';
        if (r.wa && !urg) h += waBoton(r.wa);
        if (!r.consejo) h += '<div class="lucia-nav"><button type="button" data-volver>← Volver</button><button type="button" data-inicio>Empezar de nuevo</button></div>';
        return { html: h, senala: !!(en.length || r.wa || r.resultados) };
    };

    L.datos = function (d) {
        D = d;
        var vs = [];
        Object.keys(d.sinonimos).forEach(function (k) {
            d.sinonimos[k].forEach(function (v) { v = norm(v); mapSin[v] = k; vs.push(v); });
        });
        vs.sort(function (a, b) { return b.length - a.length; });
        reSin = new RegExp('\\b(' + vs.join('|') + ')\\b', 'g');
        d.intenciones.forEach(function (it) { it._k = it.claves.map(function (k) { return prep(k).trim(); }); });
    };
    if (typeof LUCIA_DATOS !== 'undefined') L.datos(LUCIA_DATOS);
})(typeof window !== 'undefined' ? window : globalThis);
