# Supermercado — primera maqueta interior

Implementación local sobre `main`, sin push ni despliegue. Se entra desde la
ficha del supermercado existente en la ciudad, con un enlace a `#/supermarket`.
El botón Ciudad vuelve al mapa. El resto de la ciudad conserva su geometría.

## Planta y recorrido

18 × 16 m, en las unidades de 10 cm del motor original. Suelo continuo con
corredores transversales, seis góndolas paralelas y pasillos de 1,4 m entre ellas.
La cámara mantiene su centro dentro del terreno. La fachada en corte tiene dos
hojas de vidrio desplazadas, sensor, riel, felpudo y cartel de entrada.

- Entrada: puertas automáticas, carritos anidados, canastos, promoción y atención.
- Cerca de la entrada: isla abastecida de frutas y verduras.
- Fondo: panadería, carnicería, pescadería y fiambrería con mostradores de vidrio.
- Lateral: refrigeradores de lácteos, huevos y congelados.
- Centro: almacén/desayuno; snacks/bebidas; condimentos/importados;
  limpieza/higiene; bebés/mascotas; artículos del hogar.
- Frente: filas, dos cajas tradicionales, cuatro terminales de autopago,
  embolsado y salida señalizada. Las secciones tienen carteles superiores.

Los demás sectores tienen mobiliario y productos representativos; no se
implementa un catálogo completo. No hay emojis sustituyendo muebles o productos.
Las personas son modelos SVG estáticos, sin sistema de personajes o tráfico.

## Cajas

Cada una de las dos cajas tiene cinta, registradora, pantalla, escáner, terminal
de pago, cajón de dinero, ticket, separador, productos, mesa de embolsado, bolsa,
cajero/a, cliente y carrito con identificadores independientes. La fila tiene
personas y postes/separadores físicos.

Cada uno de los cuatro autopagos tiene pedestal, pantalla táctil, escáner,
balanza, lector de tarjeta, superficie de productos, bolsas, luz y botón de
asistencia. Hay tres clientes utilizando terminales y un empleado supervisor.
Las partes tienen apoyos; los modelos se ordenan explícitamente para evitar que
la base o la cinta oculten los componentes apoyados sobre ellas.

No hay simulación de compra: pantallas, pago, escaneo y ayuda son educativos.

## Navegación y vocabulario

Tres niveles: plano completo, sección y objeto. Se accede a las zonas tocando
sus muebles o eligiéndolas en el selector. Cajas y autoservicio tienen botones
directos. «Plano» y ⤢ restablecen el encuadre; se puede arrastrar, pellizcar y
usar +/−. El nombre de la sección con ⓘ abre su ficha y pronunciación.

La lupa ofrece secciones y objetos por hanzi, pinyin (con/sin tonos y espacios)
y traducción ES/EN. Los objetos repetidos se identifican por caja o terminal.
Los puntos táctiles se limitan a la sección activa. Las etiquetas son opcionales,
se filtran por zona y no repiten el mismo término por cada instancia.

`supermarket-vocab.js` es la fuente manual independiente de **81 términos**:

- 25 secciones de la planta.
- 45 sustantivos: puerta automática, carrito, canasto, cartel, manzana,
  zanahoria, pan, carne, pescado, jamón, leche, caja de huevos, helado, arroz,
  cereal, papas de paquete, agua, salsa de soja, pasta, detergente para ropa,
  champú, pañales, alimento de mascotas, rollo de cocina; cajero, cliente, fila,
  separador, cinta, registradora, pantalla, escáner, terminal de pago, cajón de
  dinero, ticket, bolsa, productos, terminal de autopago, pantalla táctil,
  balanza, superficie de productos, área de bolsas, indicador, asistencia y personal.
- 11 acciones/expresiones: 购物 hacer compras; 排队 hacer fila; 结账 pasar por caja;
  扫码 escanear; 称重 pesar; 付款 pagar; 刷卡 pagar con tarjeta; 装袋 embolsar;
  找零 dar vuelto; 我需要帮助 necesito ayuda; 退货 devolver un producto.

Las acciones no se presentan como muebles o puntos del mapa. Tienen lista y
fichas propias con hanzi, pinyin, ES/EN y la pronunciación original de la app.
No se agregan oraciones ni tarjetas al mazo. Las fichas del supermercado ocultan
Guardar, incluso cuando un término coincide con una palabra de la casa.

## Código y reutilización

- `supermarket-layout.js`: planta, medidas, secciones e instancias de cajas.
- `supermarket-vocab.js`: términos con ID estable, tipo y traducciones.
- `supermarket-geometry.js`: muebles y modelos compartidos en defs/use.
- `supermarket-scene.js`: composición, profundidad, anclajes y zonas interactivas.
- `supermarket-view.js`: navegación, búsqueda, acciones y alcance de etiquetas.
- `supermarket.css`: estilos propios, sin cambiar los de otras escenas.

Se reutilizan `ISO.P`, prismas, luz por cara, esferas, superficies y `ISO.Scene`.
`IsoView` conserva su cámara y selección: solo suma enfoque/reset públicos y
zoom de búsqueda opcional para este interior. Las habitaciones y la ciudad
mantienen sus valores por defecto. Se reutilizan ficha, preferencias y audio.
`app.js` solo conecta la nueva ruta, el enlace de entrada y el botón de regreso.
La caché es `labellearn-v6`; index y SHELL incluyen los seis archivos nuevos.
No se reconstruye la geometría durante el desplazamiento ni se agregan listeners
individuales a los objetos.

## Verificación

- `node tools/check_supermarket.js`: 25 secciones, 95 objetos físicos, 120 IDs
  de selección, geometría determinista y finita, modelos sin defs duplicadas,
  muebles sin superposición y separación mínima entre góndolas.
- Presupuesto final: aproximadamente **174 KB de geometría SVG y 1.727 nodos**,
  incluyendo las definiciones compartidas (no las filas DOM del buscador).
- `tools/test_supermarket.js`: aprobado con Chromium y sandbox activado en
  390×800, 360×800, 430×932 y 768×1024, hasTouch.
- 25 fichas de sección, 95 objetos en la lista y sus puntos cuando existen,
  11 acciones, ES/EN, apertura/cierre, navegación ciudad/interior/casa y regreso.
- Arrastre y pellizco reales vía CDP con CPU 4× y restablecimiento de cámara.
  Esto es una comprobación funcional, no una acreditación de 60 FPS en Android.
- Sin errores JavaScript ni desbordamiento horizontal. Controles y fichas dentro
  de pantalla. Las etiquetas en el enfoque de autopago cubren aproximadamente
  6–9 % del visor en las cuatro resoluciones revisadas.
- `tools/test_city.js`: ciudad y 13 habitaciones originales aprobadas.
- Datos generados, 354 oraciones, flashcards y escenas originales sin cambios.
  Contextos de prueba aislados; almacenamiento de flashcards sin modificaciones.

Capturas reales: `/workspace/supermarket-review/captures/`, con vistas `all`,
`checkout` y `selfcheckout` por resolución, además de ficha de sección y acciones.
Resultados completos: `/workspace/supermarket-review/final/result.json`.

## Pendiente

Más variedad de productos, detalle propio de los mostradores de frescos y
refrigerados, precios y señalética comercial adicional. Las otras secciones
son representativas; cajas y autopago concentran el detalle de esta entrega.
No se implementaron inventario, compra, pago real, simulación ni nuevos interiores.

La pronunciación usa el motor existente; este Chromium no tiene voces instaladas,
por lo que no se acreditó la escucha real. Queda también la comprobación de
rendimiento y gestos en un dispositivo Android físico. No se publicará esta
maqueta hasta la revisión y autorización del usuario.
