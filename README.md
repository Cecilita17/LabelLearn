# LabelLearn

Maqueta de un mundo virtual (una casa) donde cada objeto lleva una etiqueta con hanzi, pinyin y traducción (ES/EN). Mobile first, proyecto independiente de LinguaGloss: HTML/CSS/JS sin dependencias ni build.

## Ejecutar

    cd labellearn && python3 -m http.server 8000   # o cualquier servidor estático

## Estructura

- `data.js` – habitaciones y objetos (añadir un objeto = añadir una línea)
- `app.js` – render, carrusel de habitaciones, ficha del objeto y audio (Web Speech `zh-CN`)
- `styles.css` – estilos mobile first
