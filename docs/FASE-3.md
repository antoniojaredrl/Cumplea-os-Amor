# Fase 3 · La invitación secreta

## Flujo implementado

1. Sobre cerrado y flotante con el nombre configurado. Mochi todavía no se muestra.
2. Tanto el sobre como «Descubrir mi invitación» activan la misma apertura. Se deshabilitan temporalmente para evitar entradas repetidas.
3. La solapa gira y la carta sale. Después aparece Mochi y se abre su bienvenida con el sistema de diálogos de la fase 2.
4. Cerrar la bienvenida conserva el sobre abierto y permite retomarla desde «Escuchar a Mochi».
5. La última frase ofrece «Comenzar nuestra aventura». Solo esa acción navega a `map` mediante el reducer central.
6. La invitación sale y la vista del jardín entra con una transición suave. El foco pasa al contenido principal y la pantalla vuelve al inicio.
7. Recargar recupera el jardín con localStorage. «Volver a leer mi invitación» navega a `invitation`, sin reiniciar estrellas ni acceso al regalo; el sobre vuelve cerrado.

La apertura y aparición usan `useAnimate` y esperan la finalización de cada animación. Se detienen al desmontar; no hay temporizadores fijos para avanzar de escena. Con movimiento reducido, la invitación pasa directamente al estado abierto y la bienvenida, sin flotación ni animación de entrada. La conversación sigue mostrando todo el texto de inmediato en ese modo.

## Alcance

`MapIntroScene` es el destino narrativo y una vista previa del mapa. Las cinco estaciones son elementos informativos, marcados «Próximamente». Todavía no se habilitan bloqueos, estaciones, recompensas o reinicio de aventura; corresponden a las fases siguientes.

No cambió el esquema de progreso. Durante la apertura y la conversación se conserva `scene: invitation`; solo al empezar se guarda `map`. Si se recarga a mitad de bienvenida, se vuelve al sobre cerrado y puede repetirse. No se guarda cada frase como progreso permanente.

Los textos nuevos se personalizan en `src/data/adventure.js` (`invitation` y `map`). `SceneTransition` es reutilizable para las siguientes escenas. `AdventureOverview` evita duplicar la lista del recorrido.

## Verificación realizada

- `npm run build`: compilación de producción correcta.
- `npm test`: las cuatro pruebas existentes del progreso siguen aprobadas.
- Navegador de escritorio: apertura desde el sobre y desde el botón principal, aparición de Mochi y apertura automática de bienvenida.
- Escape cerró la bienvenida y devolvió el foco al botón «Escuchar a Mochi»; reabrirla inició la conversación desde el mensaje 1.
- Se recorrieron los siete mensajes con teclado hasta «Comenzar nuestra aventura».
- El botón final llevó al jardín; el contenido principal recibió el foco y el contador permaneció en cero.
- Recargar mantuvo el jardín y sus cinco estaciones, sin repetir la bienvenida.
- Regresar a la invitación recuperó el sobre cerrado y trasladó el foco al contenido.
- Captura de la llegada al jardín: `fase-3-jardin.png`.

La primera revisión detectó un bloqueo al esperar callbacks de animación declarativos dentro de la transición de escenas. Se sustituyó por controles de animación explícitos y se repitió el flujo completo con éxito.

Pendiente de validación en teléfono físico, con lector de pantalla real y con la preferencia de movimiento reducido del sistema. El CSS incluye recorrido vertical en pantallas estrechas, pero en esta fase la revisión visual se realizó en escritorio. No se publicó el proyecto.
