# Cómo mantener la web

Todo lo repetido del sitio (el menú, el pie, las etiquetas para Google y
WhatsApp, los horarios, los mensajes de WhatsApp) se escribe **una sola vez**
en esta carpeta y un script lo reparte por las 35 páginas.

Regla de oro: **no edites el menú ni el pie dentro de un archivo `.html`**.
Se sobrescriben en cuanto vuelvas a ejecutar el script.

---

## El comando que hay que recordar

```bash
py tools/sincronizar.py
```

Eso actualiza todas las páginas. Si quieres ver antes qué va a cambiar sin
tocar nada:

```bash
py tools/sincronizar.py --revisar
```

---

## Qué hay en cada archivo

| Archivo | Para qué sirve |
|---|---|
| `config.json` | Datos de la parroquia: dirección, WhatsApp, horarios de Misa y los mensajes preescritos de los trámites. |
| `paginas.json` | Una ficha por página: título, descripción para Google, imagen al compartir y a qué sección pertenece. |
| `partials/nav.html` | El menú de navegación. |
| `partials/footer.html` | El pie de página. |
| `sincronizar.py` | El script que lo reparte todo. |
| `optimizar_imagenes.py` | Reduce el peso de las fotos nuevas. |
| `actualizar_evangelio.py` | Descarga el Evangelio del día (lo ejecuta GitHub solo). |

---

## Tareas habituales

### Cambiar un horario de Misa
En `config.json`, dentro de `horarios.misas`. Después `py tools/sincronizar.py`.
Se actualiza el pie de todas las páginas.

> El horario también aparece escrito a mano en `horarios.html` (la rejilla de
> la semana) y en `index.html` (la franja azul). Revísalos también.

### Cambiar el teléfono o la dirección
En `config.json`, dentro de `contacto`. Después sincroniza.

### Añadir o quitar un enlace del menú
En `partials/nav.html`. Después sincroniza.

### Crear una página nueva
1. Crea el `.html` con esta estructura mínima:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<!--#nav--><nav></nav><!--/#nav-->

  ... tu contenido ...

<!--#footer--><footer></footer><!--/#footer-->
</body>
</html>
```

2. Añade su ficha en `paginas.json`.
3. `py tools/sincronizar.py`. El menú, el pie, las etiquetas, las migas de pan
   y el sitemap se generan solos.

### Añadir actividades a la agenda
En `js/agenda-datos.js`. Copia una línea de `EVENTOS` y cambia los datos.
La portada, la agenda y el buscador se actualizan solos.

### Cambiar un mensaje de WhatsApp
En `config.json`, dentro de `whatsappPlantillas`. Después sincroniza.
Cualquier enlace con `data-wa="clave"` recibe la URL correcta.

### Subir fotos nuevas
Déjalas en la raíz como `.webp` y ejecuta:

```bash
py tools/optimizar_imagenes.py
```

Los originales quedan guardados en `imagenes_originales/` por si acaso.

---

## ⚠️ Muy importante al cambiar diseño o JavaScript

Si tocas `style.css` o cualquier archivo de `js/`, **sube el número `version`
en `config.json`** antes de sincronizar.

Ese número se añade a los archivos (`style.css?v=10`) y actualiza también el
service worker. Sin él, quien ya haya visitado la web seguirá viendo la
versión antigua guardada en su navegador, o una mezcla rota de ambas.

---

## Lo que se genera solo (no editar a mano)

- `sitemap.xml`
- `robots.txt`
- `js/indice-busqueda.js`
- `evangelio.json`
- La línea `VERSION` de `sw.js`
