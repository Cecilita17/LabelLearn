# Frescos y refrigerados

Segunda etapa del interior. Publicación por push a main, sin PR ni Preview.

## Catálogo

75 tipos seleccionables: 30 frutas/verduras, 11 productos de panadería,
8 de carnicería, 7 de pescadería, 5 de fiambrería, 7 lácteos, huevos y
6 congelados. Son 66 incorporaciones respecto de las nueve referencias previas.
Se mantienen los nueve IDs anteriores; pan, carne y pescado se precisan como
pan blanco, carne vacuna y pescado entero.

El supermercado reúne 174 términos únicos por hanzi: 25 secciones, 127
sustantivos de productos/mobiliario, 11 acciones y 11 términos de envases/medidas.
La lista «Envases y medidas» tiene 12 entradas porque reutiliza 冷冻食品, que
ya identifica la sección de congelados. Queso en bloque y queso de la heladera
usan la misma palabra 奶酪. No se duplican vocablos por cada unidad dibujada.

## Distribución y mobiliario

Se conservan las ocho zonas y los corredores existentes. Se añaden:

- Frutas/verduras: treinta cajones con alturas escalonadas, precios por kilo,
  formas y colores propios, balanza, bolsas, oferta y carrito de reposición.
- Panadería: estante de panes y vitrina con bandejas abastecidas de dos piezas
  por tipo, pinzas, bolsas de papel y mostrador.
- Carnicería: cortes y preparaciones distintos, mostrador frío, bandejas,
  balanza, tabla, envolvedora y precios por kilo.
- Pescadería: peces enteros, filetes, salmón, atún, camarones, calamares y
  mariscos de concha, sobre hielo, con balanza y precios.
- Fiambrería: fetas, salame, jamón, queso y fiambres, con cortadora, balanza,
  papel y vitrina refrigerada.
- Lácteos/huevos: heladeras verticales con puertas, estantes y envases,
  incluidos cartones con huevos visibles.
- Congelados: heladera vertical y freezer horizontal con tapas deslizadas,
  productos sobre estantes y superficies de apoyo.

La fruta se representa por grupos pequeños de la misma especie; cada tipo tiene
su propio modelo, ID, ficha y zona táctil. No se sustituye una sección por un
bloque único. Los precios son ilustrativos. La medialuna se representa como
croissant (可颂), las facturas como pastelería (糕点), y la tarta como tarta de
frutas (水果派), evitando inventar equivalencias culturales exactas.

## Interacción

Ciudad → supermercado → sección → producto. El enfoque del producto se acerca
más que el de la sección. Las fichas, ES/EN, pinyin, voz zh-CN y preferencias son
las existentes. Las etiquetas se limitan a la zona activa y se filtran para evitar
solapamientos. Los envases/cantidades tienen lista propia y no se añaden a las
flashcards. Las once acciones anteriores permanecen disponibles.

## Código y rendimiento

- `supermarket-products.js`: catálogo y vocabulario adicional; fuente manual.
- `supermarket-fresh-geometry.js`: modelos compartidos y precios vectoriales.
- `supermarket-fresh-scene.js`: exhibidores, soportes, productos y vidrio separado.
- `supermarket-view.js`: pestaña de envases/medidas y enfoque por producto.
- `iso-view.js`: opciones del supermercado para omitir grupos fuera de pantalla,
  reutilizar límites estáticos y no actualizar puntos ocultos. No se regenera
  geometría durante los gestos. Las otras escenas no activan estas opciones.

Presupuesto: aproximadamente 240 KB de geometría SVG y 2.611 nodos de modelos,
con referencias compartidas para rellenar bandejas. No hay frameworks ni nuevas
dependencias de la aplicación. La caché es labellearn-v7.

## Verificación

- `node tools/check_supermarket.js`: integridad, geometría determinista, apoyos
  y circulación principal.
- `node tools/check_fresh.js`: 75 productos, 174 términos sin hanzi duplicados,
  referencias válidas e integridad de 103 elementos protegidos contra fd9cfd5.
- `node tools/test_fresh.js /tmp/fresh`: cada producto, sus fichas ES/EN y pinyin,
  puntos táctiles, envases/medidas, voz solicitada, cuatro resoluciones y capturas.
- `node tools/test_supermarket.js /tmp/market`: regresión del supermercado completo.
- `node tools/test_city.js /tmp/city`: ciudad y 13 habitaciones.

Las pruebas usan Chromium con sandbox y contextos aislados. Verifican que no se
altere el almacenamiento de flashcards. Este navegador no tiene voces instaladas:
se comprueba la solicitud zh-CN, sin afirmar una escucha real. La emulación de
CPU 4× no sustituye una comprobación en Android físico.

Se mantienen sin cambios las 354 oraciones, flashcards, las 13 escenas de la
casa, el diseño de la ciudad y la geometría de cajas/autopagos. Limpieza, higiene
y almacén no se ampliaron. Las capturas y métricas de esta sesión se guardan en
`/workspace/fresh-review/`.

### Comparación de rendimiento

En Chromium headless a 390×800 y CPU 4×, muestras iguales de 60 movimientos:

| Gesto | p95 versión fd9cfd5 | p95 ampliación |
| --- | --- | --- |
| Arrastre | 16.8 ms | 16.7 ms |
| Pellizco | 83.4 ms | 83.4 ms |

La mediana fue 16,7 ms en ambos gestos y versiones. El zoom conserva las pausas
que ya tenía la versión anterior: no se afirma que mantenga 60 FPS sostenidos.
Los cambios de visibilidad no reconstruyen los modelos. La comparación se hizo
contra una copia local del commit anterior, sin crear un despliegue Preview.
