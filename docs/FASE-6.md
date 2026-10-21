# Fase 6 · Celebración, estrellas y regalo

## Experiencia implementada

**Cumpleaños mágico.** Un pastel ilustrado tiene cinco velitas con llamas animadas. Cada botón apaga una sola vela y deja un pequeño efecto de humo. Las velas apagadas se guardan. Al terminar se muestra «¡Feliz cumpleaños, Ingrid!», confeti y la cuarta estrella. Los globos flotan y se puede repetir la celebración sin volver a ganar la estrella. Las cinco velas son parte del cuento, no una edad inventada.

**Misión de las estrellas.** Cinco luces se despiertan siguiendo las pistas de Mochi: Recuerdos → Confianza → Flores → Deseo → Amor. Una respuesta equivocada muestra ayuda, conserva el avance y no enciende una luz incorrecta. Se guarda el prefijo correcto de la secuencia. Al terminar se gana la quinta estrella y la celebración conduce a la constelación.

**Corazón de estrellas.** Las cinco estrellas se desplazan desde sus posiciones iniciales hasta un corazón luminoso. Mochi acompaña el momento con dos mensajes y el botón «Descubrir mi regalo». El diálogo puede mostrar su texto completo y respeta movimiento reducido. El corazón formado queda guardado.

**Regalo final.** La caja tiene lazo, etiqueta y apertura animada de la tapa. Después aparece una carta con un texto romántico editable, dirigido a Ingrid. No contiene recuerdos, edad, fechas o planes físicos inventados. La carta puede incluir una fotografía y la fecha de cumpleaños si se configuran. El foco pasa al título al revelarse.

**Una sorpresa más.** Un panel desplegable contiene un frasquito de deseos digitales. Cada toque ofrece el siguiente mensaje de una colección configurable; después del último, vuelve al primero. Se conserva el último deseo. También admite un enlace opcional a otra sorpresa, que solo se muestra cuando se configura un destino válido.

## Música opcional

El altavoz de la cabecera permite activar y pausar la música; permanece disponible en las distintas escenas. No empieza sola y vuelve apagada al recargar.

- `adventure.music = null`: reproduce una pequeña melodía suave original, sintetizada en el navegador mediante Web Audio. No descarga audio ni requiere servicios externos.
- `adventure.music = '/media/nuestra-cancion.mp3'`: reproduce ese archivo local en bucle a volumen moderado.
- Si una pista no se puede cargar o el navegador rechaza el audio, se muestra un aviso y el cuento sigue funcionando.
- Al ocultar la pestaña o desmontar la aplicación, se detienen audio, osciladores y temporizador. Volver a la pestaña no reanuda sonido automáticamente.

Coloca los archivos personales en `public/media`. El estado de audio es independiente del progreso; activarlo no altera estrellas o escenas.

## Personalización

En `src/data/adventure.js`:

```js
birthday: null, // O una fecha real YYYY-MM-DD; se muestra día y mes.
music: null,    // O /media/tu-pista.mp3.
finalLetter: {
  title: 'Para mi persona favorita',
  paragraphs: [
    'Feliz cumpleaños, {name}. Aquí va tu carta personalizada.',
    'Otro párrafo escrito por ti.',
  ],
  signature: 'Con todo mi amor',
  photo: null, // O /media/una-foto.jpg.
},
surprise: {
  title: 'Un frasquito de deseos para ti',
  message: 'Tu presentación de la sorpresa.',
  wishes: [
    { id: 'un-id-estable', text: 'Tu deseo para {name}.' },
  ],
  url: null, // Opcional: /media/sorpresa.pdf o https://tu-destino.example.
},
```

`{name}` se sustituye por el nombre configurado. El proyecto incluye una carta inicial completa y deseos predeterminados; ambos se pueden sustituir. Si la carta queda vacía o los deseos son inválidos, se conserva una salida con texto de respaldo. La fecha se omite si no existe o es inválida. La fotografía tiene el mismo fallback local del álbum.

Las pistas, nombres de luces, textos de la celebración y mensajes de Mochi están en `src/data/finale.js`. El enlace opcional acepta http, https y rutas locales; esquemas ejecutables o incoherentes se omiten.

## Progreso y repetición

Las cinco estaciones ya verifican sus condiciones en el reducer antes de aceptar `COMPLETE`. Se añaden dos grupos a `activities` versión 1:

```js
birthday: { extinguished: [] },
stars: { found: [] },
```

El nuevo bloque opcional `finale` tiene versión propia:

```js
finale: {
  version: 1,
  constellationFormed: false,
  giftOpened: false,
  wishId: null,
},
```

Las partidas anteriores reciben estos campos sin perder estrellas. Los estados del final solo se recuperan si corresponden a un regalo desbloqueado; el corazón requiere cinco estaciones completadas.

«Volver a vivir la aventura» abre la misma confirmación que el mapa. Confirmar elimina el recorrido y las actividades, pero conserva el regalo, la carta abierta y el último deseo. Un acceso «Volver a mi regalo» aparece en la invitación incluso después del reinicio, además del acceso del mapa. La constelación se puede volver a formar al completar otra aventura. La música no se guarda como parte del progreso.

## Verificación realizada

- `npm run build`: compilación de producción correcta.
- `npm test`: 24 pruebas aprobadas. Incluyen velas únicas, secuencia ordenada, guardado parcial, validación del final, deseos, migración y conservación de la carta tras reiniciar y recargar.
- En navegador de escritorio se retomó la partida con tres estrellas y se jugó hasta abrir la carta.
- Se verificó el apagado individual de las cinco velas y una recarga con dos apagadas; se recuperaron las dos sin perder el avance.
- La misión rechazó una luz fuera de orden. Tras dos luces correctas, recargar conservó la secuencia. Completar las cinco habilitó la quinta estrella.
- Las estrellas formaron el corazón. Se revisaron la imagen y el diálogo, incluido el foco en el control de continuación.
- La caja abrió su tapa y reveló la carta; el foco pasó a su título.
- El frasquito mostró dos deseos distintos. Recargar conservó la carta abierta y el último deseo.
- Se volvió del regalo al mapa y a la invitación; «Volver a mi regalo» recuperó la carta sin repetir juegos ni apertura.
- La confirmación de reinicio mostró que el regalo se conservaría. Se canceló sin alterar la partida. No se confirmó un reinicio en la partida del navegador: ese efecto quedó comprobado en las pruebas del reducer.
- El control de audio pasó de desactivado a activo y después a pausado mediante interacción. No se hizo una evaluación auditiva del sonido ni una prueba con un archivo musical personal.
- Se dejó la partida de prueba con las cinco estrellas ganadas y la carta disponible. No se modificó artificialmente localStorage.

Capturas: `fase-6-cumpleanos.png`, `fase-6-corazon.png`, `fase-6-regalo.png`, `fase-6-carta.png` y `fase-6-deseos.png`.

## Pendiente para la fase 7

Validación en teléfono físico y diferentes tamaños, movimiento reducido con la preferencia del sistema, lector de pantalla, errores de recursos personales, audio en segundo plano y rendimiento. Medir la duración del recorrido completo con el contenido definitivo. Revisar los datos personales de la carta, fotos, fecha y pista elegida antes de compartir el regalo. El proyecto todavía no se ha publicado.
