/* ============================================================
   sw.js — service worker de la Parroquia Santa Lucía.

   Para qué sirve: que se puedan consultar los horarios, la agenda
   y las oraciones aunque no haya datos o la conexión falle, que
   es algo muy real aquí. También hace que la web se pueda
   instalar como app en el móvil.

   La línea VERSION la actualiza tools/sincronizar.py a partir de
   "version" en tools/config.json. Al cambiar, se descarta la caché
   antigua y se descarga todo de nuevo.
   ============================================================ */

const VERSION = 'v18';
const CACHE = 'santa-lucia-' + VERSION;

/* Lo imprescindible para que la web arranque sin conexión */
const ESENCIALES = [
    './',
    './index.html',
    './horarios.html',
    './oracion.html',
    './eventos.html',
    './sacramentos.html',
    './contacto.html',
    './style.css',
    './js/sitio.js',
    './js/buscador.js',
    './js/agenda-datos.js',
    './favicon.svg',
    './icon-192.png',
    './foto-templo.webp',
    './manifest.webmanifest'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE)
            // addAll falla entero si un archivo falla; los pedimos de uno
            // en uno para que un fallo suelto no rompa la instalación.
            .then(cache => Promise.all(
                ESENCIALES.map(url => cache.add(url).catch(() => null))
            ))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(nombres => Promise.all(
                nombres.filter(n => n.startsWith('santa-lucia-') && n !== CACHE)
                       .map(n => caches.delete(n))
            ))
            .then(() => self.clients.claim())
    );
});

function esHTML(request) {
    return request.mode === 'navigate' ||
           (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', event => {
    const req = event.request;

    if (req.method !== 'GET') return;

    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;   // fuentes, CDN: al navegador

    /* Las páginas: primero la red, para que se vean los cambios enseguida.
       Si no hay conexión, servimos la copia guardada. */
    if (esHTML(req)) {
        event.respondWith(
            fetch(req)
                .then(resp => {
                    const copia = resp.clone();
                    caches.open(CACHE).then(c => c.put(req, copia));
                    return resp;
                })
                .catch(() => caches.match(req)
                    .then(guardada => guardada || caches.match('./index.html')))
        );
        return;
    }

    /* Imágenes, CSS y scripts: primero la caché, que casi nunca cambian
       (y cuando cambian, llevan ?v=N y cuentan como una URL nueva). */
    event.respondWith(
        caches.match(req).then(guardada => {
            if (guardada) return guardada;
            return fetch(req).then(resp => {
                if (resp && resp.status === 200 && resp.type === 'basic') {
                    const copia = resp.clone();
                    caches.open(CACHE).then(c => c.put(req, copia));
                }
                return resp;
            }).catch(() => guardada);
        })
    );
});
