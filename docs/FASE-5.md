# Fase 5 · Tres estaciones para descubrir

## Álbum de recuerdos

`MemoriesScene` presenta una tarjeta Polaroid a la vez, con imagen, fecha opcional, descripción y mensaje oculto. El álbum tiene controles anterior/siguiente y un índice directo. Tocar la tarjeta abre su mensaje en un diálogo accesible y lo marca como descubierto. El contador exige todos los mensajes antes de habilitar la estrella.

La selección y las tarjetas abiertas se guardan. Las transiciones respetan movimiento reducido y la navegación conserva el foco al llegar a los extremos del álbum. Se pueden releer los mensajes en cualquier momento.

Todavía no se han proporcionado fotos ni recuerdos personales. El álbum usa tres tarjetas locales simbólicas, identificadas como «Recuerdo ilustrado», sin inventar fechas o acontecimientos. Para sustituirlas, configura `adventure.memories` en `src/data/adventure.js`:

```js
memories: [
  {
    id: 'un-id-estable',
    title: 'Tu título',
    description: 'Una pequeña descripción del recuerdo.',
    message: 'El mensaje que aparecerá al tocar la fotografía.',
    photo: '/media/tu-foto.jpg',
    date: null, // O una fecha real en formato YYYY-MM-DD.
  },
],
```

Coloca el archivo en `public/media`. Cada `id` debe ser único y estable. `title` y un `message` no vacío son necesarios. Los registros inválidos o duplicados se filtran; si no queda ninguno válido, se usan las tarjetas ilustradas. Una foto ausente usa una ilustración; una foto que falla al cargar también añade un aviso. La imagen mantiene su espacio durante la carga. Las fechas inválidas muestran un texto genérico.

## Laboratorio del amor

Los seis ingredientes configurados se añaden o retiran con un toque. El matraz cambia su nivel y color, muestra burbujas y refleja la cantidad seleccionada. No se permite mezclar hasta añadir todos los ingredientes.

«Mezclar nuestra fórmula» produce partículas, brillo y una reacción de Mochi con bata y gafas. Revela la fórmula creada a partir de los ingredientes y el resultado configurable `activityCopy.laboratory.formulaResult`. Solo entonces se habilita la estrella. El foco pasa al título de la fórmula al terminar la reacción.

«Volver a experimentar» vacía el matraz para repetir la actividad. Si la estrella ya se había ganado, se conserva y no se vuelve a entregar. Selecciones y reacción completada sobreviven a la recarga.

Los ingredientes se editan en `adventure.ingredients`. La paleta, instrucciones, reacciones y resultado están en `src/data/activities.js`. Si cambias la cantidad de ingredientes, adapta también la instrucción personalizada que menciona «seis».

## Jardín de las razones

Cada razón configurada tiene una flor ilustrada. Al tocarla se abren sus pétalos y aparece un diálogo con el mensaje y partículas de pétalos. Cada flor descubierta conserva su estado visual y se puede volver a leer. El contador exige todas las razones para la estrella.

Los mensajes viven en `adventure.reasons`. Los textos vacíos o duplicados se filtran; un jardín vacío muestra un aviso y no concede una recompensa automática. Las razones descubiertas se guardan por su texto, de modo que un mensaje nuevo o editado vuelve a estar pendiente de descubrir.

## Recompensas y guardado

`ActivityShell` comparte progreso de finalización, botón de recompensa y celebración. El botón solo se habilita cuando la actividad cumple su condición. El reducer vuelve a verificarla antes de aceptar `COMPLETE`.

La estrella se guarda **antes** de mostrar la celebración, con `stay: true` para permanecer temporalmente en la actividad. Recargar o cerrar el diálogo no pierde esa estrella. Cerrar, Escape o «Guardar este momento y seguir» vuelve al mapa. Las revisitas permiten repetir la interacción sin duplicar estrellas.

Se mantiene el esquema principal versión 1 y se añade un estado de actividades opcional con versión propia:

```js
activities: {
  version: 1,
  memories: { currentId: null, revealed: [] },
  laboratory: { ingredients: [], mixed: false },
  garden: { discovered: [] },
}
```

Las partidas anteriores reciben un estado parcial vacío sin perder sus estrellas o acceso al regalo. La normalización elimina identificadores desconocidos y duplicados, ignora actividades bloqueadas y rechaza `mixed: true` sin todos sus ingredientes. Un reinicio voluntario limpia también estos datos. La clave de localStorage permanece igual.

El proveedor React, el contexto y `useProgress` están separados en módulos distintos para que la recarga automática de desarrollo no invalide la identidad del contexto al actualizar las reglas del progreso.

## Verificación realizada

- `npm run build`: compilación de producción correcta.
- `npm test`: 16 pruebas aprobadas sobre progreso, condiciones de recompensa, guardado parcial, duplicados, escenas bloqueadas, migración y reinicio.
- En navegador de escritorio se jugó el recorrido real: álbum → laboratorio → jardín, reuniendo sus tres estrellas y desbloqueando el cumpleaños.
- Álbum: los tres mensajes se abrieron desde las tarjetas. Recargar después del primero conservó el descubrimiento. La recompensa no se habilitó hasta el tercero.
- Se recargó durante la primera celebración: la estrella seguía guardada y el álbum no ofreció volver a cobrarla.
- Laboratorio: se añadieron dos ingredientes y se recargó; ambos se recuperaron. Se retiró uno, se repuso y se añadieron los restantes. Tener los seis ingredientes habilitó mezclar, pero todavía no la estrella. Mezclar reveló la fórmula y habilitó la recompensa.
- Jardín: se abrió una flor y se recargó; quedó descubierta. Se leyeron las cuatro razones y solo entonces se habilitó su estrella.
- Se revisitó el laboratorio completado y se repitió el experimento. El contador permaneció en tres estrellas y no se ofreció una recompensa adicional.
- Se comprobó que al mezclar el foco pasa a la fórmula y que el botón de navegación del álbum conserva el foco al llegar a la última tarjeta.
- Se dejó la partida de la vista previa en el mapa con tres estrellas obtenidas mediante las actividades, sin modificar artificialmente el almacenamiento.
- Tras separar proveedor, contexto y hook, se recargó la aplicación y se provocó una actualización del módulo del proveedor: el mapa conservó sus tres estrellas y la recarga automática terminó sin el error de contexto detectado durante la revisión.

Capturas: `fase-5-album.png`, `fase-5-laboratorio.png`, `fase-5-jardin.png` y `fase-5-mapa-completado.png`.

## Límites de esta revisión

La revisión visual se realizó en escritorio. Los controles táctiles, tamaños responsive y movimiento reducido están implementados, pendientes de prueba en teléfono físico y con las preferencias del sistema. No se hizo una sesión con lector de pantalla real ni se comprobó en navegador una foto personal rota; el fallback de carga está implementado. Las fotos personales, carta, música y sorpresa definitivas siguen pendientes de personalización.

Cumpleaños y misión de estrellas conservan su entrada narrativa hasta la fase 6. La constelación y el regalo real tampoco se adelantan en esta entrega. El proyecto sigue local y preparado para Vercel; no se publicó.
