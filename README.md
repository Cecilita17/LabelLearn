# LabelLearn

Casa en corte (estilo dollhouse) para aprender vocabulario en chino mandarín. Cada objeto lleva una etiqueta con hanzi, pinyin y traducción (ES/EN). Mobile first, sin dependencias ni build. Proyecto independiente de LinguaGloss.

- **Vista general:** la casa en corte con 9 habitaciones, el patio y 3 extras (estructura, objetos pequeños, posiciones). Tocá una para entrar.
- **Las 13 secciones son escenas isométricas 2.5D** estilo Los Sims (9 habitaciones, el patio y 3 extras: estructura de la casa, objetos pequeños y posiciones), con zoom y desplazamiento táctil.
- La vista lateral anterior (`renderRoom` en `app.js`) queda solo como respaldo para una sección que no tenga escena.

- **Buscador:** la lupa de la pantalla de la casa busca por hanzi, pinyin (con o sin tonos) o traducción (ES/EN), y también por nombre de habitación. Una palabra que está en una sola habitación lleva directo a ella y la resalta; si está en varias, deja elegir.
- **Búsqueda dentro de cada habitación:** el botón de lupa junto al zoom abre un buscador limitado a las palabras de esa escena (vacío lista todas); al elegir una, la cámara se acerca al objeto y lo resalta.
- **Instalable (PWA):** `manifest.webmanifest`, íconos (`icon.svg`, PNG) y `sw.js` (abre sin conexión).

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

## Búsqueda e íconos

- `search-index.js` es **generado** (`node tools/build_index.js`): para cada palabra, las habitaciones donde aparece en una escena. Volver a correrlo al cambiar escenas.
- `search.js`: el buscador. `app.js` solo lo monta en la pantalla de la casa.
- Íconos: `icon.svg` es la fuente; `node tools/make_icons.js` regenera los PNG.

## Flashcards

Mismo sistema de repaso espaciado que LinguaGloss (escalera 1 min → 10 min → 1/3/7/14/30/60/120 días, calificaciones *Otra vez / Bien / Fácil*, hasta 10 tarjetas nuevas por sesión, nivel 2 = completar el hueco tras dos aciertos seguidos), pero con la **traducción de la oración entera** en lugar de glosas.

- El mazo son **solo las palabras guardadas con ⭐** (ficha del objeto, o «Guardar N» en la barra de cada habitación para guardarlas todas).
- `sentences.js` (generado) trae una oración fácil por palabra (354), con pinyin por palabra y traducción ES/EN; se muestra la del idioma elegido. Las oraciones se escribieron una sola vez en `tools/sentences/*.tsv` (palabra, oración segmentada con espacios, ES, EN) y se compilan con `python3 tools/build_sentences.py` (requiere `pypinyin`; valida que cada palabra del vocabulario tenga oración y aparezca como token).
- `flashcards.js`: lógica de repaso + pantalla. El progreso se guarda en el dispositivo (`localStorage`, clave `labellearn_flashcards_v1`).
- «📍 Ver en la casa» abre la habitación y acerca la cámara al objeto.

## Ciudad (maqueta local)

La entrada **Ciudad** de la pantalla principal abre `#/city`. Son nueve manzanas
con dos calles en cada dirección y un anillo perimetral: hospital, escuela y
residencias al norte; comercios al oeste; plaza central con juegos y fuente;
biblioteca, banco y comisaría al este; viviendas, cafetería, restaurante y
estacionamiento al sur. La casa con techo terracota y cartel **LabelLearn** abre
la ficha con un enlace a las 13 secciones existentes, sin duplicar sus escenas.

- `city-map.js`: medidas, calles, edificios y posiciones de objetos con ID estable.
- `city-vocab.js`: fuente manual independiente con 38 palabras, pinyin y ES/EN.
- `city-geometry.js`: fachadas, techos, ventanas y mobiliario; reutiliza `ISO`.
- `city-scene.js`: montaje estático, profundidad, zonas interactivas y vocabulario.
- `city-view.js`: búsqueda urbana y conexión con cámara, fichas y preferencias.

Se puede arrastrar, pellizcar, usar +/−, restablecer la vista, mostrar etiquetas
y tocar edificios u objetos. La lupa urbana lista también los objetos pequeños
y permite enfocarlos. La cámara del mapa admite hasta 10× y límites basados en
su viewBox, incluido el origen negativo. Las habitaciones conservan sus límites
anteriores. Los árboles comparten un símbolo SVG y la selección usa delegación.
No hay geometría nueva durante el desplazamiento ni tráfico animado.
Las fichas y la pronunciación son las originales. El vocabulario urbano no agrega
oraciones ni entra en el mazo de flashcards.

Validación de datos y presupuesto de geometría: `node tools/check_city.js`.
Al tocar archivos urbanos, actualizar `SHELL` y `CACHE` en `sw.js`. El índice de
la casa se sigue generando con `node tools/build_index.js`; la búsqueda urbana
se construye desde su propia fuente, sin editar índices generados.

Prueba de integración con navegador: `node tools/test_city.js /tmp/labellearn-city-test`.
Levanta un servidor local en `127.0.0.1:8000`, usa 390×800 con `hasTouch`, prueba
arrastre y pellizco táctiles con CPU 4×, selección, fichas, preferencias y las
13 secciones originales. Guarda dos capturas y un resultado JSON. Requiere
Playwright y Chromium ya instalados en el entorno de desarrollo; no son
dependencias de la aplicación. Se puede indicar `CHROMIUM_PATH`.

Estado y diagnóstico de las pruebas de navegador: [VALIDATION.md](VALIDATION.md).
El script mantiene activado el sandbox de Chromium. Se puede elegir resolución
con `VIEWPORT=360x800` (por defecto, `390x800`). Si el entorno rechaza sockets,
guarda el error y la fase en `result.json`; eso no cuenta como prueba aprobada.

Auditoría visual y de rendimiento (servidor local ya iniciado):
`node tools/audit_city.js /tmp/labellearn-audit`. Revisa las cuatro resoluciones,
las 55 zonas seleccionables, límites de cámara, encuadre y cobertura de etiquetas;
guarda capturas, tiempos de cuadro con CPU 4× y recuentos de memoria en
`audit.json`. Observa la API original de pronunciación sin reemplazar la síntesis.
La emulación no sustituye la escucha con voz zh-CN ni una prueba en Android real.

## Supermercado

En la ciudad, seleccioná **Supermercado** y tocá **Entrar al supermercado**.
La ruta es `#/supermarket`; **Ciudad** vuelve al mapa. No duplica escenas de la casa.

La planta de 18 × 16 m tiene entrada automática y atención al cliente,
25 secciones, seis góndolas paralelas separadas por pasillos de 1,4 m, frescos
al fondo, refrigerados en el lateral y cajas en el frente. Incluye dos cajas
tradicionales y cuatro terminales de autoservicio con componentes individuales.
El resto de los productos es representativo, no un catálogo exhaustivo.

- **Plano → sección → objeto:** seleccionar un mueble o usar el selector de zonas;
  los accesos rápidos llevan a cajas y autoservicio. Arrastrar, pellizcar y usar
  +/− funciona con el visor original. «Plano» y ⤢ restablecen el encuadre.
- El nombre de la sección con ⓘ abre su ficha y pronunciación. La lupa busca
  secciones u objetos por hanzi, pinyin o ES/EN. Las instancias de cada caja se
  distinguen en la lista. Los puntos y etiquetas se limitan a la sección activa.
- **Acciones** reúne 11 verbos/expresiones sin inventar objetos visuales para ellos.
  Las fichas y el audio son los originales; no se agregan flashcards ni oraciones.

Código separado: `supermarket-layout.js` (planta), `supermarket-vocab.js`
(base de vocabulario, ampliada por el catálogo de productos), `supermarket-geometry.js`
(modelos), `supermarket-scene.js` (montaje y selección), `supermarket-view.js`
(interacciones) y `supermarket.css` (estilos propios). Los modelos repetidos se
comparten en `<defs>/<use>` y no se reconstruyen durante los gestos.

Comprobar datos y geometría: `node tools/check_supermarket.js`.
Con el servidor local de Python activo:
`node tools/test_supermarket.js /tmp/labellearn-supermarket`.
El test usa Chromium con sandbox, revisa cuatro resoluciones y genera capturas.
Detalle de la entrega y límites: [SUPERMARKET.md](SUPERMARKET.md).

### Frescos y refrigerados

La segunda etapa incorpora **66 tipos adicionales**: hay 75 tipos de producto
individualizados en frutas/verduras, panadería, carnicería, pescadería, fiambrería,
lácteos, huevos y congelados. Cada tipo tiene su ficha, pronunciación y punto de
selección. Las presentaciones de queso comparten el mismo término. El vocabulario
del supermercado suma **174 términos**, sin modificar los datos de la casa.

La pestaña **Envases y medidas** incluye botella, caja, lata, bolsa, paquete,
bandeja, kilo, medio kilo, litro, precio por kilo, fresco y congelado. No agrega
flashcards. Precios y carteles son ilustrativos.

- `supermarket-products.js`: catálogo, vocabulario nuevo y referencias estables.
- `supermarket-fresh-geometry.js`: modelos y precios vectoriales compartidos.
- `supermarket-fresh-scene.js`: exhibidores, heladeras, freezers y accesorios.

El visor omite grupos fuera de pantalla y evita actualizar puntos ocultos; los
límites se calculan una vez, sin reconstruir los modelos durante los gestos.
Estas opciones solo se activan en el supermercado. Los puntos táctiles y las
formas visibles seleccionan los productos sin círculos invisibles superpuestos
sobre las bandejas vecinas.

Validación adicional: `node tools/check_fresh.js`. Prueba completa del catálogo:
`node tools/test_fresh.js /tmp/labellearn-fresh` con el servidor local iniciado.
`tools/fixtures/supermarket-protected.json` conserva huellas de los 103 elementos
no ampliados de la versión fd9cfd5, para comprobar que no cambien las cajas, los
autopagos, los pasillos ni la entrada.
