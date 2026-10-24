# LabelLearn

Casa en corte (estilo dollhouse) para aprender vocabulario en chino mandarín. Cada objeto lleva una etiqueta con hanzi, pinyin y traducción (ES/EN). Mobile first, sin dependencias ni build. Proyecto independiente de LinguaGloss.

- **Vista general:** la casa en corte con 9 habitaciones, el patio y 3 extras (estructura, objetos pequeños, posiciones). Tocá una para entrar.
- **Las 13 secciones son escenas isométricas 2.5D** estilo Los Sims (9 habitaciones, el patio y 3 extras: estructura de la casa, objetos pequeños y posiciones), con zoom y desplazamiento táctil.
- La vista lateral anterior (`renderRoom` en `app.js`) queda solo como respaldo para una sección que no tenga escena.

## Ejecutar

    python3 -m http.server 8000   # y abrir http://localhost:8000

## Editar el vocabulario

`data.js` es **generado**; no se edita a mano.

1. Palabras (hanzi / pinyin / español): `vocab/vocabulario_casa_chino_mandarin.md`
2. Emoji, inglés y ubicación en la escena: `tools/build_data.py` (`EMOJI` y `LAYOUT`)
3. Regenerar: `python3 tools/build_data.py` (falla si falta o sobra alguna palabra)

## Escenas isométricas

- `iso.js`: mini motor 2.5D en SVG (proyección, luz por cara, prismas y cilindros). 1 unidad = 10 cm.
- `scene-<habitación>.js` (13 archivos): una escena por sección, con medidas reales (1 unidad = 10 cm). Cada pieza declara su palabra, su orden de profundidad y, si es pequeña, un punto táctil.
- `iso-view.js`: cámara (arrastrar, pellizcar, rueda), selección con resalte, puntos táctiles y etiquetas.
- Para sumar una habitación: crear `scene-<id>.js` que registre `window.LABELLEARN_SCENES.<id>` e incluirlo en `index.html`. La vista se activa sola.
