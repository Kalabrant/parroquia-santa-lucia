/* ============================================================
   ics.js — genera archivos de calendario (.ics) en el navegador.

   Sirve para que el feligrés se lleve una celebración a su móvil
   en vez de tener que recordarla. No necesita servidor: el archivo
   se construye aquí mismo y se descarga.
   ============================================================ */
(function (global) {
    'use strict';

    var TZ = 'America/Caracas';

    /* Convierte '6:00 PM', '5:30 p.m.', '8:00 AM / 6:00 PM' -> {h, m}
       Se queda con la PRIMERA hora que encuentre. Devuelve null si
       el texto no contiene ninguna (p. ej. 'Todo el día' o vacío).   */
    function parseHora(texto) {
        if (!texto) return null;
        var m = String(texto).match(/(\d{1,2})[:.](\d{2})\s*([ap])\.?\s*\.?m/i);
        if (!m) {
            m = String(texto).match(/(\d{1,2})\s*([ap])\.?\s*\.?m/i);
            if (!m) return null;
            return normaliza(parseInt(m[1], 10), 0, m[2]);
        }
        return normaliza(parseInt(m[1], 10), parseInt(m[2], 10), m[3]);
    }

    function normaliza(h, min, sufijo) {
        var pm = /p/i.test(sufijo);
        if (pm && h < 12) h += 12;
        if (!pm && h === 12) h = 0;
        return { h: h, m: min };
    }

    function dos(n) { return String(n).padStart(2, '0'); }

    function fechaLocal(fechaISO, hora) {
        var p = fechaISO.split('-');
        var base = p[0] + dos(p[1]) + dos(p[2]);
        if (!hora) return base;                       // evento de día completo
        return base + 'T' + dos(hora.h) + dos(hora.m) + '00';
    }

    function masUnaHora(hora) {
        if (!hora) return null;
        var t = hora.h * 60 + hora.m + 60;
        return { h: Math.floor(t / 60) % 24, m: t % 60 };
    }

    /* El formato .ics parte las líneas a 75 octetos y escapa , ; \ */
    function escapar(t) {
        return String(t || '')
            .replace(/\\/g, '\\\\')
            .replace(/;/g, '\\;')
            .replace(/,/g, '\\,')
            .replace(/\r?\n/g, '\\n');
    }

    function plegar(linea) {
        if (linea.length <= 75) return linea;
        var out = linea.slice(0, 75);
        var resto = linea.slice(75);
        while (resto.length > 74) {
            out += '\r\n ' + resto.slice(0, 74);
            resto = resto.slice(74);
        }
        return out + '\r\n ' + resto;
    }

    function uid(sufijo) {
        return 'sl-' + sufijo.replace(/[^a-z0-9]/gi, '') + '@parroquiasantalucia.org';
    }

    /* ev = {fecha:'2026-12-13', hora:'6:00 PM', titulo, desc, lugar, rrule} */
    function vevent(ev) {
        var hora = parseHora(ev.hora);
        var ini = fechaLocal(ev.fecha, hora);
        var lineas = ['BEGIN:VEVENT', 'UID:' + uid(ev.fecha + ev.titulo)];

        if (hora) {
            lineas.push('DTSTART;TZID=' + TZ + ':' + ini);
            lineas.push('DTEND;TZID=' + TZ + ':' + fechaLocal(ev.fecha, masUnaHora(hora)));
        } else {
            // Día completo: DTEND es exclusivo, así que va el día siguiente
            var d = new Date(ev.fecha + 'T12:00:00');
            d.setDate(d.getDate() + 1);
            lineas.push('DTSTART;VALUE=DATE:' + ini);
            lineas.push('DTEND;VALUE=DATE:' +
                d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate()));
        }

        if (ev.rrule) lineas.push('RRULE:' + ev.rrule);
        lineas.push('SUMMARY:' + escapar(ev.titulo));
        if (ev.desc) lineas.push('DESCRIPTION:' + escapar(ev.desc));
        lineas.push('LOCATION:' + escapar(ev.lugar || 'Parroquia Santa Lucía, Maracaibo'));
        lineas.push('BEGIN:VALARM', 'TRIGGER:-PT2H', 'ACTION:DISPLAY',
                    'DESCRIPTION:' + escapar(ev.titulo), 'END:VALARM');
        lineas.push('END:VEVENT');
        return lineas;
    }

    function construir(eventos) {
        var out = ['BEGIN:VCALENDAR', 'VERSION:2.0',
                   'PRODID:-//Parroquia Santa Lucia//Agenda//ES',
                   'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
        eventos.forEach(function (ev) { out = out.concat(vevent(ev)); });
        out.push('END:VCALENDAR');
        return out.map(plegar).join('\r\n');
    }

    function descargar(eventos, nombreArchivo) {
        var texto = construir(eventos);
        var blob = new Blob([texto], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = (nombreArchivo || 'parroquia-santa-lucia') + '.ics';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }

    /* Enlace para quien prefiera Google Calendar en el navegador */
    function urlGoogle(ev) {
        var hora = parseHora(ev.hora);
        var ini, fin;
        if (hora) {
            ini = fechaLocal(ev.fecha, hora);
            fin = fechaLocal(ev.fecha, masUnaHora(hora));
        } else {
            ini = fechaLocal(ev.fecha, null);
            var d = new Date(ev.fecha + 'T12:00:00');
            d.setDate(d.getDate() + 1);
            fin = d.getFullYear() + dos(d.getMonth() + 1) + dos(d.getDate());
        }
        var p = new URLSearchParams({
            action: 'TEMPLATE',
            text: ev.titulo,
            dates: ini + '/' + fin,
            details: ev.desc || '',
            location: ev.lugar || 'Parroquia Santa Lucía, Maracaibo',
            ctz: TZ
        });
        return 'https://calendar.google.com/calendar/render?' + p.toString();
    }

    /* ── Botón de la página de horarios ──────────────────────
       Las Misas ordinarias, como eventos que se repiten cada semana. */
    var MISAS = [
        { fecha: '2026-01-06', hora: '6:00 PM', titulo: 'Santa Misa — Parroquia Santa Lucía',
          desc: 'Misa de martes a sábado.', rrule: 'FREQ=WEEKLY;BYDAY=TU,WE,TH,FR,SA' },
        { fecha: '2026-01-04', hora: '9:00 AM', titulo: 'Santa Misa (9:00 AM) — Parroquia Santa Lucía',
          desc: 'Misa dominical.', rrule: 'FREQ=WEEKLY;BYDAY=SU' },
        { fecha: '2026-01-04', hora: '11:00 AM', titulo: 'Santa Misa (11:00 AM) — Parroquia Santa Lucía',
          desc: 'Misa dominical.', rrule: 'FREQ=WEEKLY;BYDAY=SU' },
        { fecha: '2026-01-04', hora: '6:00 PM', titulo: 'Santa Misa (6:00 PM) — Parroquia Santa Lucía',
          desc: 'Misa dominical vespertina.', rrule: 'FREQ=WEEKLY;BYDAY=SU' }
    ];

    document.addEventListener('click', function (e) {
        var boton = e.target.closest ? e.target.closest('[data-ics]') : null;
        if (!boton) return;
        e.preventDefault();
        if (boton.getAttribute('data-ics') === 'misas') {
            descargar(MISAS, 'misas-santa-lucia');
        }
    });

    global.ICS = { descargar: descargar, construir: construir, urlGoogle: urlGoogle, parseHora: parseHora };
})(window);
