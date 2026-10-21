# Arquitectura y flujo narrativo

## Alcance implementado: fases 1 a 6

Proyecto ejecutable y compilable, identidad visual, fuentes locales, Mochi con siete expresiones, diálogos, invitación y mapa. Las cinco actividades son jugables, con condiciones reales, recompensas únicas, celebraciones y progreso parcial persistente. La historia termina con el corazón de estrellas, caja animada, carta persistente y frasquito de deseos. Incluye música opcional sin reproducción automática. Queda la validación final y publicación de la fase 7.

## Historia y estaciones

Invitación → mapa → recuerdos → laboratorio → jardín → cumpleaños → misión de las estrellas → constelación → regalo.

El prompt describe cinco estaciones pero sitúa la misión después de obtener cinco estrellas. Para evitar un bloqueo circular, **la misión es el quinto minijuego y otorga la quinta estrella**. Después se muestra una escena independiente de constelación que une las estrellas en un corazón y abre el regalo. La duración objetivo sigue siendo 5–10 minutos, pendiente de medir con la experiencia completa y el contenido personal definitivo en la fase 7.

## Estado único

`ProgressProvider` recupera y guarda `michiaventura.progress.v1` en localStorage. El formato contiene `version`, `scene`, `completed`, `giftUnlocked`, `started`, `resumeScene`, `activities` y `finale`. Los campos añadidos son opcionales al recuperar partidas antiguas y se normalizan automáticamente. El número de estrellas se deriva de `completed.length`. `activities` y `finale` tienen su propia versión 1 y conservan el avance de las cinco actividades y del regalo.

- `NAVIGATE`: solo acepta escenas alcanzables; un destino bloqueado conserva el estado actual, sin redirigir a la portada. Entrar a una escena guarda su destino para reanudar; volver a la invitación conserva ese destino.
- `RESUME`: recupera el último destino válido fuera de la invitación, o el mapa si no hay otro.
- `COMPLETE`: solo admite la próxima estación, una única vez, y exige `isActivityReady` en las cinco actividades. Por defecto vuelve al mapa o pasa a constelación tras la quinta. `stay: true` conserva la escena para mostrar la celebración con la recompensa ya guardada.
- `SELECT_MEMORY` / `REVEAL_MEMORY`: selección y mensajes únicos del álbum.
- `TOGGLE_INGREDIENT` / `MIX_FORMULA` / `RESET_LAB`: ingredientes y reacción validada. Repetir un experimento no borra la estrella ya ganada.
- `DISCOVER_REASON`: razones descubiertas sin duplicados.
- `EXTINGUISH_CANDLE` / `RELIGHT_CANDLES`: apagado único de cada vela y repetición de la celebración sin perder estrellas.
- `TOUCH_STAR` / `RESET_STARS`: secuencia ordenada de luces y repetición de la misión.
- `FORM_CONSTELLATION`: reúne el corazón si están completadas las cinco estaciones.
- `OPEN_GIFT` / `DRAW_WISH`: apertura persistente y deseos; solo se aceptan en el regalo desbloqueado.
- `RESET`: elimina estrellas, escena, reanudación y actividades parciales. Conserva `giftUnlocked`, la carta abierta y el último deseo cuando el regalo ya estaba disponible; reinicia la animación del corazón. El mapa y el regalo lo conectan a una confirmación voluntaria.
- `normalizeProgress`: valida formato y secuencia al recargar. JSON corrupto inicia una partida nueva; errores de almacenamiento muestran un aviso y permiten continuar en memoria.

`getStationStatus` y `getNextStationId` derivan los estados y el siguiente destino de la misma lista de completadas. Las estaciones completadas se pueden revisitar; solo la siguiente pendiente está disponible y el resto permanece bloqueado. `canNavigate` protege también la navegación desde el reducer.

Las acciones parciales solo se aceptan dentro de su escena. `normalizeActivities` filtra identificadores ausentes de la configuración actual, duplicados, reacciones incompletas y progreso de actividades todavía bloqueadas. Las partidas antiguas conservan sus estrellas legítimas aunque no tengan aún los campos parciales.

No es una barrera de seguridad: el usuario puede editar su propio localStorage. App renderiza cada escena por su identificador y los estados normalizados solo permiten destinos alcanzables. El regalo ya desbloqueado puede abrirse directamente desde la invitación o el mapa, incluso tras reiniciar; las cinco estrellas no vuelven a exigirse para releer la carta.

## Componentes y responsabilidades

- `SceneShell`: marca, navegación accesible, contador y pie compartidos.
- `Mochi`: dibujo local con siete expresiones y poses definidas en `data/mochi.js`. Suprime el movimiento con la preferencia de movimiento reducido.
- `Dialogue`: secuencias de mensajes, escritura saltable, navegación atrás/adelante, foco y finalización. Cada frase se anuncia completa para lectores de pantalla. `data/dialogues.js` contiene los textos narrativos.
- `Modal`: diálogo nativo con foco contenido, Escape y retorno al control inicial; `returnFocusRef` permite volver al control de invitación tras una apertura automática.
- `InvitationScene`: secuencia local `sealed → opening → revealing → opened`, sobre flotante, aparición de Mochi y bienvenida. El botón final navega al mapa.
- `MapScene`: jardín de cinco estaciones, indicador de estrellas, leyenda, próxima estación, acceso persistente al regalo cuando corresponde y confirmación de reinicio.
- `MapStation`: botón animado con estado, nombre accesible y requisito de desbloqueo. Los bloqueados están deshabilitados.
- `ActivityShell`: cabecera, regreso al mapa, condición de finalización, recompensa y celebración compartidos.
- `ActivityGuide`: Mochi y reacción contextual reutilizables; permite su atuendo científico.
- `MemoriesScene`: álbum Polaroid con navegación, mensajes ocultos, selección y descubrimientos persistentes.
- `MemoryArtwork`: foto personal con carga y fallback ilustrado local; `MemoryIllustration` dibuja tarjetas simbólicas.
- `LaboratoryScene` y `LoveFlask`: ingredientes táctiles, matraz, líquidos, burbujas y fórmula romántica.
- `GardenScene` y `ReasonFlower`: flores que se abren, mensajes, pétalos y contador persistente.
- `BirthdayScene`, `BirthdayCake` y `Confetti`: cinco velas táctiles, humo, globos y celebración. Las velas no representan la edad de Ingrid.
- `StarsScene`: cinco pistas y luces que se activan en orden; errores sin penalización ni avance indebido.
- `ConstellationScene`: estrellas que forman un corazón y diálogo emotivo compacto de Mochi.
- `GiftScene` y `GiftBox`: tapa animada, carta editable, foto opcional, frasquito de deseos y enlace de sorpresa configurable.
- `RestartDialog`: confirmación compartida entre mapa y regalo.
- `MusicProvider` y `MusicToggle`: sonido independiente del progreso; usa una pista configurada o una melodía original sintetizada. Se detiene al ocultar la pestaña o al desmontar.
- `SceneTransition`: salida/entrada coordinadas por `AnimatePresence`, foco en el contenido y retorno al inicio de la pantalla.
- `AdventureOverview`: resumen reutilizable de estaciones, con iconos compartidos con el mapa.
- `adventure.js`: identidad y contenido personal. `activities.js` contiene textos de las primeras tres actividades y tarjetas simbólicas. `finale.js` contiene velas, pistas, textos del final y acceso validado a la carta/deseos. No se presentan recuerdos inventados como reales.

Tailwind v4 se integra mediante su plugin Vite; las utilidades se usan donde ayudan y el estilo ilustrado vive en CSS con tokens compartidos. Motion respeta `prefers-reduced-motion` mediante `MotionConfig`; CSS también reduce transiciones.

## Fases siguientes

1. **Base (completada):** estructura, estilo, datos, progreso y pruebas del dominio.
2. **Guía y diálogos (completada):** siete expresiones, bocadillos reutilizables, escritura saltable y continuación accesible.
3. **Invitación narrativa (completada):** apertura completa con Mochi, diálogo y transición al mapa.
4. **Mapa (completada):** jardín de cinco estaciones, bloqueo progresivo, reanudación y reinicio voluntario.
5. **Estaciones (completada):** álbum con imágenes y fallback, laboratorio táctil, flores revelables. Estado parcial por estación, con esquema versionado y validación al recargar.
6. **Celebración y final (completada):** velas, música opcional tras interacción, quinta misión, corazón de estrellas, caja y carta persistente.
7. **Validación y publicación:** recorrido completo móvil/escritorio, teclado, almacenamiento restringido, imágenes ausentes, rendimiento y build Vercel.

En cada fase: revisar componentes existentes, implementar alcance acotado, comprobar interacción y build, registrar validación real. No añadir librerías, backend ni estado duplicado sin necesidad.
# Entrega 1.0

Las escenas de actividades y del final se importan con `React.lazy`; la invitación y el mapa quedan en la entrada. `Suspense` presenta el estado de carga y `AdventureErrorBoundary` ofrece una recarga recuperable si falla un componente o una descarga. Los reducers y su formato de persistencia permanecen compatibles con las fases anteriores.

`src/styles/fonts.css` sirve cinco archivos WOFF2 locales. `accessibility.css` completa los estilos con contraste y tamaño de controles. `qa/responsive.html` solo se sirve en desarrollo y no entra en `dist`. `vercel.json` configura el despliegue estático de Vite; `.openai/hosting.json` identifica la publicación de Sites.

