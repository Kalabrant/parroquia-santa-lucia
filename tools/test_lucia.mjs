// Pruebas de la avatar de Santa Lucía: mismas entradas → mismas salidas.
//
//     node tools/test_lucia.mjs
//
// Carga en un contexto aislado lo mismo que el navegador (datos, índice del
// buscador, buscador.js y lucia-nucleo.js) y fija la fecha y la hora.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const raiz = fileURLToPath(new URL('..', import.meta.url));
const leer = (f) => readFileSync(raiz + f, 'utf8');

const ctx = { console };
ctx.window = ctx;
// Lo mínimo de document para que buscador.js cargue su índice
ctx.document = {
    addEventListener() {},
    createElement() { return {}; },
    head: { appendChild(s) { s.onload(); } },
};
vm.createContext(ctx);
for (const f of ['js/lucia-datos.js', 'js/indice-busqueda.js', 'js/buscador.js', 'js/lucia-nucleo.js']) {
    vm.runInContext(leer(f), ctx, { filename: f });
}
const L = ctx.Lucia;
const cfg = JSON.parse(leer('tools/config.json'));

let fallos = 0, total = 0;
function prueba(nombre, ok, detalle) {
    total++;
    if (ok) console.log('  ok   ' + nombre);
    else { fallos++; console.log('  FALLA ' + nombre + (detalle !== undefined ? '\n        → ' + JSON.stringify(detalle) : '')); }
}
const en = (iso) => { L.ahora = new Date(iso); };   // hora de Caracas con su desfase: -04:00

// Martes 20 de octubre de 2026, 15:00 en Caracas
en('2026-10-20T15:00:00-04:00');
let r = await L.resolver('¿A qué hora es la misa?');
let t = L.rellenar(r.texto);
prueba('«a qué hora es la misa» un martes a las 15:00 → hoy a las 6:00 PM',
    r.id === 'misas' && t.includes('La próxima Misa es hoy a las 6:00 PM'), t);
prueba('la respuesta de Misas trae la lista y la nota de horarios',
    t.includes('Domingos: 9:00 AM · 11:00 AM · 6:00 PM') && t.includes(cfg.horarios.nota), t);

r = await L.resolver('confesarme');
t = L.rellenar(r.texto);
prueba('«confesarme» → intención de confesión', r.id === 'confesion', r.id);
prueba('confesión un martes a las 15:00 → desde las 5:30 PM', t.includes('Hoy puedes confesarte desde las 5:30 PM'), t);

r = await L.resolver('quiero mi fe de bautismo');
const wa = ctx.LUCIA_DATOS.wa[r.wa];
const base = 'https://wa.me/' + cfg.contacto.whatsapp + '?text=';
prueba('«quiero mi fe de bautismo» → partida de bautismo', r.id === 'partida-bautismo', r.id);
prueba('…con el enlace de WhatsApp correcto',
    r.wa === 'partida-bautismo' && wa[2].startsWith(base) &&
    decodeURIComponent(wa[2].slice(base.length)) === cfg.whatsappPlantillas['partida-bautismo'].mensaje, wa);

r = await L.resolver('cofradía del santísimo');
prueba('«cofradía del santísimo» → resultado del índice',
    r.tipo === 'busqueda' && r.resultados.length > 0 && r.resultados[0].url.includes('cofradias.html'), r);

r = await L.resolver('asdfgh');
prueba('«asdfgh» → «no lo encuentro» con WhatsApp de secretaría',
    r.tipo === 'nada' && r.texto.startsWith('No lo encuentro en la web') && r.wa === 'general', r);

r = await L.resolver('mi abuela está muy grave, necesito un sacerdote urgente');
prueba('enfermo grave → WhatsApp de enfermos primero', r.id === 'enfermo' && r.urgente &&
    L.htmlVista(r, '').html.startsWith('<a class="lucia-wa lucia-wa-urgente"'), r.id);

r = await L.resolver('quiero bautizar a mi hijo');
prueba('«bautizar a mi hijo» → guía paso a paso', r.tipo === 'guia' && r.pregunta.includes('7 años'), r);

r = await L.resolver('despacho');
t = L.rellenar(r.texto);
prueba('despacho un martes a las 15:00 → abierto', t.includes('abierto ahora, hasta las 5:00 PM'), t);

// Lunes 19 de octubre de 2026, 10:00
en('2026-10-19T10:00:00-04:00');
r = await L.resolver('misa');
t = L.rellenar(r.texto);
prueba('«misa» un lunes → la del martes', r.id === 'misas' && t.includes('mañana martes a las 6:00 PM'), t);
t = L.rellenar('{despacho}');
prueba('despacho un lunes → abre mañana martes a las 2:00 PM', t === 'El despacho abre mañana martes a las 2:00 PM.', t);
const c1 = L.consejos('index.html').map((c) => c.id);
const c2 = L.consejos('index.html').map((c) => c.id);
prueba('el consejo del día se repite igual para la misma fecha y página', JSON.stringify(c1) === JSON.stringify(c2) && c1.length > 0, c1);
prueba('un lunes sale el consejo «no hay Misa»', c1.includes('lunes'), c1);
en('2026-10-19T18:30:00-04:00');
prueba('…y a otra hora del mismo día, el mismo primero', L.consejos('index.html')[0].id === c1[0]);

// Calendario litúrgico
prueba('Pascua de 2027 = 28 de marzo', L.pascua(2027) === '2027-03-28', L.pascua(2027));
prueba('Miércoles de Ceniza de 2027 = 10 de febrero', L.ceniza(2027) === '2027-02-10', L.ceniza(2027));
prueba('Pascua de 2026 = 5 de abril', L.pascua(2026) === '2026-04-05', L.pascua(2026));
en('2027-02-10T09:00:00-04:00');
prueba('el 10-feb-2027 es Ceniza y Cuaresma', L.tiempos().join() === 'ceniza,cuaresma', L.tiempos());
en('2026-12-13T09:00:00-04:00');
prueba('el 13 de diciembre es Adviento y el primer consejo es el de Santa Lucía',
    L.tiempos().includes('adviento') && L.consejos('index.html')[0].id === 'santa-lucia', L.consejos('index.html').map((c) => c.id));
en('2026-11-29T09:00:00-04:00');
prueba('el 29-nov-2026 empieza el Adviento', L.tiempos().includes('adviento'), L.tiempos());
en('2026-11-28T09:00:00-04:00');
prueba('el 28-nov-2026 todavía no', !L.tiempos().includes('adviento'), L.tiempos());

// Agenda y rosario
en('2026-10-20T15:00:00-04:00');
t = L.rellenar('{semana}');
prueba('«esta semana» incluye la Gran Misión del sábado 24', t.includes('el sábado 24 de octubre: Gran Misión Parroquial'), t);
prueba('los martes se rezan los misterios dolorosos', L.rellenar('{misterios}') === 'Hoy, martes, se rezan los misterios dolorosos.');

console.log('\n' + (total - fallos) + ' de ' + total + ' pruebas correctas');
process.exit(fallos ? 1 : 0);
