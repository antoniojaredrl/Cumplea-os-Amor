# Fase 4 · El mapa de las sorpresas

## Implementación

- `MapIntroScene` se convierte en `MapScene`, un jardín interactivo con estaciones disponibles, bloqueadas y completadas. Los estados usan texto e iconos además del color.
- `MapStation` es reutilizable. Los botones disponibles y completados tienen microinteracciones; los bloqueados están deshabilitados y explican el requisito anterior. Son botones nativos, accesibles por teclado cuando corresponde.
- El contador y la barra nativa de progreso usan el mismo `completed.length` que la cabecera. No se mantiene otro contador.
- La tarjeta de Mochi ofrece la siguiente estación pendiente. Tras las cinco estrellas, ofrece la constelación.
- `StationScene` presenta el objetivo y la historia de cada estación. Se puede volver al mapa o releer la invitación.
- La navegación está conectada al reducer: recargar dentro de una estación recupera esa escena. Releer la invitación conserva la última escena; «Continuar mi aventura» vuelve a ella sin repetir la conversación.
- «Reiniciar aventura» abre una confirmación con cancelar, cerrar, Escape y confirmar. Solo confirmar despacha `RESET`. El regalo sigue desbloqueado cuando ya se había conseguido.
- El mapa muestra un acceso al regalo cuando `giftUnlocked` es verdadero. La carta y la constelación reales siguen pendientes de la fase 6; sus destinos provisionales explican que están en preparación.
- Los textos de mapa, estaciones, reinicio y final provisional se editan en `data/adventure.js`. Los estilos de esta fase están en `styles/map.css`.

## Persistencia y compatibilidad

Se mantiene la clave `michiaventura.progress.v1` y el esquema versión 1 con dos campos opcionales nuevos:

```js
{
  version: 1,
  scene: 'memories',
  completed: [],
  giftUnlocked: false,
  started: true,
  resumeScene: 'memories'
}
```

`normalizeProgress` infiere los campos ausentes de partidas anteriores y valida que el destino de reanudación esté permitido. Los destinos bloqueados o desconocidos no se restauran. Una invitación antigua sin estrellas ni marca de inicio se conserva como invitación nueva: no se puede inferir si ya se había leído en una versión anterior.

`NAVIGATE` conserva el estado cuando se solicita una escena bloqueada. `RESUME` selecciona el destino guardado. `COMPLETE` sigue aceptando únicamente la próxima estación pendiente y una sola recompensa. `RESET` vuelve al sobre cerrado, elimina la marca de inicio y la reanudación, y conserva `giftUnlocked` incluso después de recargar.

## Alcance de la recompensa

Una visita no completa una estación. Los minijuegos de las fases 5 y 6 llamarán `COMPLETE` cuando se cumpla su condición real. La fase 4 no contiene botones de prueba para sumar estrellas, desbloqueos falsos ni fotografías inventadas. En una partida nueva se puede explorar la entrada de Recuerdos; las otras cuatro estaciones quedan bloqueadas.

Para conectar una actividad en la siguiente fase, sustituir la entrada correspondiente en App y usar el mismo contexto de progreso al completar. Las revisitas no deben volver a entregar la recompensa. El estado parcial de las actividades se añadirá y validará con ellas.

## Validación realizada

- `npm run build`: compilación de producción correcta.
- `npm test`: ocho pruebas aprobadas. Cubren datos inválidos, recompensas únicas y en orden, los cinco niveles del mapa, destinos bloqueados, reanudación, migración y reinicio con regalo persistente.
- Navegador de escritorio: entrada desde la invitación al mapa; Recuerdos disponible y las otras cuatro estaciones deshabilitadas con su requisito.
- Seleccionar Recuerdos abrió su presentación y mantuvo el contador en cero.
- Recargar dentro de Recuerdos recuperó esa estación.
- Volver a la invitación desde la estación, recargar y pulsar «Continuar mi aventura» recuperó Recuerdos sin repetir la bienvenida.
- Volver al mapa, abrir la confirmación de reinicio y cancelar conservó la partida y devolvió el foco al botón Reiniciar aventura.
- No se confirmó un reinicio en la partida del navegador. Su efecto y la conservación del regalo se verificaron en las pruebas del reducer.
- Los estados completados y el desbloqueo progresivo se verificaron mediante partidas de prueba en el reducer; no se fabricaron estrellas en la partida del navegador.
- Captura del estado real del mapa: `fase-4-mapa.png`.

La revisión visual se realizó en escritorio. El recorrido vertical y las áreas táctiles están implementados para móvil, pendientes de validación en teléfono físico. Tampoco se ha probado con lector de pantalla real ni se ha publicado el proyecto.
