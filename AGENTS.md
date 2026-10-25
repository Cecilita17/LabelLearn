# AGENTS.md — LabelLearn

App web móvil (sin build, sin dependencias) para aprender vocabulario de chino mandarín en una casa isométrica 2.5D. Cada objeto tiene hanzi, pinyin y traducción ES/EN, audio (voz del navegador zh-CN), búsqueda y flashcards con repaso espaciado. Lee `README.md` para el detalle de cada parte.

## Reglas del proyecto
- **Proyecto separado de LinguaGloss / LinguaFlow.** No subir nada de LabelLearn a esos repos ni modificarlos. Solo se pueden leer como referencia (el sistema de flashcards se portó de LinguaGloss).
- Repo: `github.com/Cecilita17/LabelLearn`. Despliegue en Vercel desde `main` (https://labellearn.vercel.app). La persona usuaria prefiere trabajar **directo en `main`**; no abrir PRs salvo que lo pida.
- Hablar y escribir la UI en español rioplatense (con opción EN). Commits en inglés, mensaje corto y descriptivo.
- Cambios mínimos, siguiendo el estilo del código vecino (JS clásico con `var`, IIFE, comentarios breves en español). Sin frameworks ni bundlers.
- Mobile-first y rendimiento en Android: las escenas pesan 120–200 KB y corren a 60 fps con la CPU limitada 4×; no empeorar eso.

## Probar
    python3 -m http.server 8000     # http://localhost:8000
Verificar siempre con un navegador de tamaño celular (390×800, `hasTouch`) y mirar capturas y consola. Playwright está disponible (`require('playwright')`). Para cada cambio visual, una captura antes de dar por terminado.

## Archivos generados (no editar a mano)
| Archivo | Se regenera con | Fuente |
|---|---|---|
| `data.js` | `python3 tools/build_data.py` | `vocab/vocabulario_casa_chino_mandarin.md` + `EMOJI` y `LAYOUT` en el script |
| `search-index.js` | `node tools/build_index.js` | las escenas `scene-*.js` (volver a correrlo al cambiar escenas) |
| `sentences.js` | `python3 tools/build_sentences.py` (requiere `pip install pypinyin`) | `tools/sentences/*.tsv` |
| `icon-*.png`, `apple-touch-icon.png` | `node tools/make_icons.js` | `icon.svg` |

## Mapa del código
- `index.html`: orden de scripts importa (datos → búsqueda → `iso.js` → escenas → `iso-view.js` → `app.js`).
- `app.js`: casa en corte, rutas por hash (`#/<id>`), preferencias, ficha del objeto, entrada a flashcards, botón "Guardar N" de la habitación.
- `iso.js`: motor SVG isométrico. Proyección `P(x,y,z)=[(x−y)·A,(x+y)·B−z·S]`, 1 unidad = 10 cm, prismas con luz por cara. `iso-view.js`: cámara táctil (arrastrar, pellizcar), selección, puntos táctiles, etiquetas, `find(palabra)`.
- `scene-<id>.js` ×13: cada una registra `window.LABELLEARN_SCENES.<id>` y arma piezas con `sc.add(palabra, k, svg, {a, small, dot})`.
- `search.js`: buscador global y por habitación (normaliza tonos y acentos).
- `flashcards.js`: repaso espaciado (misma escalera que LinguaGloss), pantalla de tarjetas, almacenamiento `localStorage` clave `labellearn_flashcards_v1` (`saved`, `states`, `prefs`).
- `sw.js`: service worker (red primero, caché de respaldo). **Subir `CACHE` (`labellearn-vN`) y actualizar `SHELL` cuando se agregue o quite un archivo.**

## Trampas conocidas del motor isométrico
- `box()` recibe colores **hex**; pasarle el `rgb(...)` de `shade()` deja la pieza negra.
- El orden de dibujo es "painter's algorithm" con la clave `k` explícita de cada pieza: si un objeto tapa mal a otro, se corrige con `k`, no moviendo geometría. La pared izquierda usa `{k: 1.14}` en sus cajas y `FXW = I.FX * 1.14` en sus calcomanías.
- Los puntos táctiles (`dot`) se escalan 1/k con el zoom y la selección elige el punto más cercano; separar los puntos de objetos vecinos para que no se pisen.
- Los objetos no deben flotar: el relleno (padding) de una pieza desplaza su base.
- Cuando se agregue o cambie una palabra de una escena, regenerar `search-index.js`.

## Estado actual
- 13 secciones isométricas completas con las 354 palabras únicas del vocabulario.
- Buscador global y por habitación, PWA instalable, flashcards con 354 oraciones de contexto (ES/EN).
- Las oraciones de ejemplo las escribió Claude; **faltan revisarlas con una persona que sepa chino** (tono, naturalidad, nivel). Se corrigen en `tools/sentences/*.tsv` y se recompilan.

## Ideas pendientes (no pedidas todavía; confirmar antes de hacerlas)
- Exportar/importar el progreso de las flashcards (hoy vive solo en el dispositivo).
- Audio mejor que la voz del navegador (o descargar voces para uso sin conexión).
- Mostrar en la casa qué objetos ya están guardados (⭐) o en repaso.
- Modo "quiz" dentro de la escena (tocá el objeto que se nombra).
