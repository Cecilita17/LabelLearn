# LabelLearn

Casa en corte (estilo dollhouse) para aprender vocabulario en chino mandarín. Cada objeto lleva una etiqueta con hanzi, pinyin y traducción (ES/EN). Mobile first, sin dependencias ni build. Proyecto independiente de LinguaGloss.

- **Vista general:** la casa en corte con 9 habitaciones, el patio y 3 extras (estructura, objetos pequeños, posiciones). Tocá una para entrar.
- **Escena:** cada habitación se recorre de lado; los objetos están ubicados por altura (suelo → mueble → pared → techo). Tocá un objeto para ver la ficha y escucharlo.

## Ejecutar

    python3 -m http.server 8000   # y abrir http://localhost:8000

## Editar el vocabulario

`data.js` es **generado**; no se edita a mano.

1. Palabras (hanzi / pinyin / español): `vocab/vocabulario_casa_chino_mandarin.md`
2. Emoji, inglés y ubicación en la escena: `tools/build_data.py` (`EMOJI` y `LAYOUT`)
3. Regenerar: `python3 tools/build_data.py` (falla si falta o sobra alguna palabra)
