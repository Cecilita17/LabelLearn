# LabelLearn

Casa en corte (estilo dollhouse) para aprender vocabulario en chino mandarín. Cada objeto lleva una etiqueta con hanzi, pinyin y traducción (ES/EN). Mobile first, sin dependencias ni build. Proyecto independiente de LinguaGloss.

- **Vista general:** la casa en corte con 9 habitaciones, el patio y 3 extras (estructura, objetos pequeños, posiciones). Tocá una para entrar.
- **Baño, habitación infantil y cocina (isométrico 2.5D):** escenas espaciales completas estilo Los Sims, con zoom y desplazamiento táctil. Las demás habitaciones siguen con la vista lateral anterior hasta migrarlas.
- **Escena (resto):** cada habitación se recorre de lado; los objetos están ubicados por altura (suelo → mueble → pared → techo). Tocá un objeto para ver la ficha y escucharlo.

## Ejecutar

    python3 -m http.server 8000   # y abrir http://localhost:8000

## Editar el vocabulario

`data.js` es **generado**; no se edita a mano.

1. Palabras (hanzi / pinyin / español): `vocab/vocabulario_casa_chino_mandarin.md`
2. Emoji, inglés y ubicación en la escena: `tools/build_data.py` (`EMOJI` y `LAYOUT`)
3. Regenerar: `python3 tools/build_data.py` (falla si falta o sobra alguna palabra)

## Escenas isométricas

- `iso.js`: mini motor 2.5D en SVG (proyección, luz por cara, prismas y cilindros). 1 unidad = 10 cm.
- `scene-bathroom.js`, `scene-kids.js`, `scene-kitchen.js`: baño, habitación infantil y cocina, con medidas reales. Cada pieza declara su palabra, su orden de profundidad y, si es pequeña, un punto táctil.
- `iso-view.js`: cámara (arrastrar, pellizcar, rueda), selección con resalte, puntos táctiles y etiquetas.
- Para sumar una habitación: crear `scene-<id>.js` que registre `window.LABELLEARN_SCENES.<id>` e incluirlo en `index.html`. La vista se activa sola.
