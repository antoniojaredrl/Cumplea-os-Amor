# Fase 7 · Revisión y entrega

La versión 1.0 termina la implementación, optimización y pruebas de Michiaventura. La publicación de esta fase sigue pendiente.

## Cambios

- Carga diferida de las siete escenas de actividades y final, con mensaje accesible mientras se descargan.
- Fuentes locales exclusivamente WOFF2: cinco archivos, sin duplicados WOFF.
- Pantalla de recuperación ante errores de renderizado o descarga. Permite recargar sin borrar el progreso guardado.
- Más contraste en botones principales y textos de lectura. Controles de texto con altura mínima de 44 px; cabecera ajustada para pantallas estrechas.
- Eliminada la etiqueta de fase de desarrollo del diálogo de ayuda.
- `vercel.json` declara Vite, instalación, build, salida y cabeceras de caché. `.openai/hosting.json` conserva la identidad de Sites.
- Inspector local `/qa/responsive.html`, fuera del build, con marcos de 320, 375 y 768 px y medición del desbordamiento horizontal. Un scrollbar vertical reduce en 15 px su ancho útil en este navegador.

## Verificación

`npm test`: 24 pruebas aprobadas. Comprueban condiciones de las cinco actividades, orden de desbloqueo, recompensas únicas, restauración, datos inválidos, migración, reinicio y conservación de la carta.

`npm run build`: compilación final aprobada, con distribución estática y escenas separadas. Entrada JS: 263.16 kB, más un módulo compartido precargado de 148.82 kB (134.31 kB gzip entre ambos); las escenas añaden sus módulos cuando se abren. CSS: 61.99 kB (15.32 kB gzip). Fuentes: 81.67 kB en cinco WOFF2. Estas cifras son tamaños de build, no una medición de velocidad en un teléfono.

La revisión de navegador se hace en el puerto 5180 con una partida nueva, separada del progreso del puerto usado durante la fase 6. Los marcos permiten probar media queries reales, botones, diálogo y scroll. No sustituyen un teléfono físico ni prueban Safari iOS.

Recorrido verificado en navegador a 320 px: apertura del sobre, siete mensajes, mapa, tres recuerdos, seis ingredientes y mezcla, cuatro flores, cinco velas, cinco luces en orden, cinco recompensas, corazón, diálogo final, caja, carta y frasquito de deseos. Se usaron los controles reales sin inyectar progreso. Escape cerró los mensajes y Enter avanzó el diálogo final. Tras recargar, los tres marcos restauraron la carta abierta y las cinco estrellas; portada y carta no mostraron desbordamiento horizontal en ninguno. El resto de las escenas se recorrió en el marco más estrecho, también sin desbordamiento. La consulta final de errores de consola devolvió una lista vacía.

Contraste calculado para los nuevos colores: botón principal 4.82:1; texto de lectura sobre crema 5.65:1 y sobre rosa claro 5.05:1. Es una comprobación concreta de esos pares, no una auditoría completa de accesibilidad. Captura: `fase-7-responsive.png`.

Límites: no se ha ejecutado un lector de pantalla real, cambiado la preferencia del sistema de movimiento reducido, medido una sesión de lectura de 5–10 minutos ni probado audio con hardware móvil. No se han proporcionado fotos o música personales para revisar sus archivos concretos. Los recursos de ejemplo y la carta editable funcionan sin ellos.

## Publicación

Sites tiene asignado el origen https://michiaventura-ingrid.racing-hinny-7870.chatgpt.site. Solo el resultado `succeeded` del despliegue confirma que está publicado. El acceso inicial es privado para la cuenta propietaria; compartir la URL por sí solo no concede acceso a Ingrid.

Estado de esta entrega: el sitio fue registrado, pero la autorización para continuar el proceso de subida fue rechazada. Se canceló el proceso antes de enviar la entrada al helper; no se subió código ni se guardó una versión o desplegó el sitio. Se conserva el mismo `project_id` para continuar sin crear otro sitio. `dist` contiene el build local definitivo.

Vercel queda configurado, pero no está conectado en este entorno. Para desplegar allí, importa este directorio desde un repositorio o usa Vercel CLI con tu cuenta y conserva los comandos de `vercel.json`.

El progreso pertenece al dominio y navegador donde se juega. Una visita al dominio publicado comienza una aventura nueva, aunque el servidor local tenga cinco estrellas.

Antes de regalarla puedes editar `src/data/adventure.js` para añadir recuerdos y fotos reales, fecha, firma, carta y música. La publicación actual utiliza ilustraciones simbólicas, una carta inicial para Ingrid y la melodía sintetizada opcional.
