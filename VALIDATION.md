# Validación local de la ciudad — 2026-10-25

**Pruebas funcionales y visuales completadas. Sin push ni despliegue.**
Quedan limitaciones de rendimiento al hacer zoom con CPU 4× y de audio en este
entorno. El trabajo sigue sobre `main`, pendiente de revisión y autorización.

## Entorno y bloqueo resuelto

Chromium 154.0.8037.57, Debian 13, Playwright, servidor HTTP local. El navegador
se ejecutó con `chromiumSandbox: true`, sin `--no-sandbox` ni bypasses.

Antes del cambio de permisos autorizado del entorno:

    Error: listen EPERM: operation not permitted 127.0.0.1:8000
    ERROR:third_party/crashpad/crashpad/util/linux/socket.cc:45
    setsockopt: Operation not permitted (1)
    process did exit: exitCode=null, signal=SIGTRAP

No faltaban bibliotecas según `ldd`. Playwright también buscaba por defecto un
navegador descargado ausente; el script selecciona `/usr/bin/chromium` cuando
está disponible. Con los permisos actuales arrancaron tanto el servidor como el
navegador. No se modificó la aplicación para eludir restricciones del entorno.

## Pruebas funcionales y regresiones

`tools/test_city.js` pasó en 360×800, 390×800, 430×932 y 768×1024, con `hasTouch`.
Tras las correcciones se repitió la prueba de las 13 habitaciones a 390×800.
`tools/audit_city.js` amplía la comprobación de encuadre, selección y rendimiento.

| Verificación | Resultado |
| --- | --- |
| Abrir ciudad desde la navegación principal | Aprobado |
| Arrastre y pellizco táctiles, botones de zoom y restablecer | Aprobado |
| Seleccionar edificios y objetos | 55/55 instancias seleccionadas con toques reales de Playwright |
| Abrir/cerrar fichas, hanzi, pinyin y ES/EN | Aprobado |
| Ir de la ciudad a la casa y volver a la ciudad | Aprobado |
| 13 escenas originales: abrir, buscar objeto, abrir/cerrar ficha y volver | Aprobado |
| Consola y errores JavaScript | Sin errores en las pruebas |
| Flashcards, progreso, datos y escenas originales | Sin modificaciones |
| Pronunciación | API original invocada con hanzi correcto, zh-CN y velocidad 0,8; escucha no verificable |

Chromium devuelve `speechSynthesis.getVoices() = []` y eventos
`synthesis-failed`. No hay voz china instalada en este navegador. No se modificó
el audio ni se simuló una pronunciación exitosa. Las pruebas usan contextos de
navegador temporales y verifican que el almacenamiento de flashcards no cambie.

## Revisión visual

En las cuatro resoluciones:

- Sin desbordamiento horizontal. Los seis controles están dentro de pantalla y
  reciben el toque en su centro; mantienen sus 40×40 px originales.
- Proyección y escalas uniformes; proporciones conservadas.
- Fichas completas dentro de pantalla, incluyendo el marco de tablet.
- Etiquetas opcionales sin superposición entre sus cajas. En la zona ampliada
  cubren aproximadamente 12–15 % del área del visor.
- Puntos táctiles seleccionables, incluidos los detalles pequeños de la casa.
- Las cuatro esquinas forzadas con zoom 10× mantienen el centro sobre el terreno.
- Inspección de capturas completas y ampliadas: sin elementos flotantes o
  superposiciones incorrectas adicionales identificados en las zonas revisadas.

## Problemas comprobados y correcciones

1. **La ciudad podía perderse fuera de pantalla.** A zoom máximo y con un arrastre
   extremo, los límites rectangulares permitían entrar en las esquinas vacías
   del rombo. `city-scene.js` activa un límite al terreno; `iso-view.js` proyecta
   el centro de vuelta a sus límites. Las habitaciones no activan ese límite.
2. **Escrituras redundantes de etiquetas y puntos durante el arrastre.** La
   medición registró 56.160 mutaciones de etiquetas en una muestra de 90 eventos.
   El visor urbano ahora reutiliza medidas y escala, y cambia la visibilidad
   solo cuando corresponde. La misma muestra terminó con cero mutaciones de
   etiquetas y puntos durante el arrastre. Las escenas originales conservan
   el camino anterior de actualización.
3. **Configuración y evidencia de las pruebas.** El script mantiene el sandbox
   de Chromium, admite `VIEWPORT` y `TEST_PORT`, y registra errores tempranos.
   Se agregó la auditoría reproducible, sin dependencias de la aplicación.

`sw.js` utiliza `labellearn-v5` para servir los cambios del visor.
Una prueba adicional separando las capas de etiquetas mejoró el zoom, pero las
capturas ampliadas revelaron caracteres recortados en Chromium. Se retiró por
completo: no forma parte de la implementación final.

## Rendimiento observado

Chromium headless a 390×800, emulación táctil y CPU 4×. Muestras de 90 movimientos
por gesto, con observación de frames, tareas largas, DOM y métricas CDP. Son
mediciones del entorno de prueba, no de un dispositivo Android físico.

| Gesto | Etiquetas | Mediana final | p95 antes | p95 final |
| --- | --- | --- | --- | --- |
| Arrastre | Apagadas | 16,7 ms | 16,8 ms | 16,7 ms |
| Arrastre | Encendidas | 16,7 ms | 33,4 ms | 16,7 ms |
| Pellizco | Apagadas | 16,7 ms | 50,1 ms | 50,0 ms |
| Pellizco | Encendidas | 16,7 ms | 150,1 ms | 116,8 ms |

El arrastre mejora. **El zoom todavía tiene pausas y tareas largas con CPU 4×,
especialmente con etiquetas. No se considera acreditado el objetivo de 60 FPS
sostenidos durante el zoom.** Las métricas muestran un coste de layout SVG mayor
que el tiempo de JavaScript durante el pellizco; no se recalcula ni modifica la
geometría estática. No se cambió el motor más ampliamente para ocultar ese límite.

Tras 12 ciclos casa/ciudad y GC explícito: 71 listeners antes y después, 2
Documentos antes y después, nodos de 2.498 a 2.380. Heap de unos 3,65 a 3,71 MB.
No hay crecimiento de listeners/nodos en esa muestra; no equivale a una prueba
de fuga de memoria de larga duración.

Validación estática: 38 palabras, 55 IDs, 1.580 nodos de geometría y 206.722 bytes
SVG. Regeneración de datos e índice sin diferencias; las 354 oraciones,
`flashcards.js`, `iso.js` y las 13 escenas originales permanecen sin cambios.

## Capturas y evidencia

Capturas reales de la versión final, verificadas en
`/workspace/labellearn-validation/verified-audit/`:

- `city-full-<resolución>.png`: vista general.
- `city-detail-<resolución>.png`: zona ampliada.
- `city-card-<resolución>.png`: ficha.
- `city-labels-<resolución>.png`: etiquetas.
- `city-camera-limit-<resolución>.png`: límite de cámara.
- `audit.json`: resultados de las cuatro resoluciones, 55 selecciones y métricas.

`/workspace/labellearn-validation/performance-before.json` conserva la medición
anterior. Los renders SVG de la primera etapa no se presentan como capturas.
La captura `labels-final-390x800.png` comprueba el texto tras retirar la prueba
que producía recortes.

## Reproducir

    python3 -m http.server 8000 --bind 127.0.0.1
    node tools/audit_city.js /tmp/labellearn-audit

El servidor debe estar iniciado para la auditoría. La prueba funcional levanta
su propio servidor; usar otro puerto si el 8000 está ocupado:

    VIEWPORT=390x800 TEST_PORT=8001 node tools/test_city.js /tmp/labellearn-functional

Cambiar VIEWPORT por 360x800, 430x932 o 768x1024 para las otras resoluciones.
Queda pendiente escuchar la pronunciación en un navegador con voz zh-CN y
comprobar fluidez y gestos en Android físico. No se publicó ni desplegó nada.
