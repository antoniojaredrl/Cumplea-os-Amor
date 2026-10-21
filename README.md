# Michiaventura · Un cumpleaños hecho con amor

Regalo interactivo para Ingrid. React + Vite, JSX, Tailwind CSS, Motion for React y Lucide. Sin backend. **Versión 1.0**: invitación, mapa, cinco actividades, corazón de estrellas, música opcional y regalo con carta persistente. Las escenas se cargan según se necesitan y los recursos esenciales se sirven localmente.

## Ejecutar

Requiere Node.js 22.12+ (o 24 LTS) y npm.

```sh
npm install
npm run dev
npm test
npm run build
```

Abre la URL que indica Vite. Para revisar la distribución: `npm run preview`.

## Qué puedes probar en esta fase

- Tocar el sobre dirigido a Ingrid o «Descubrir mi invitación»: el sobre se abre y Mochi aparece antes de iniciar su bienvenida.
- Cerrar la bienvenida y volver a escuchar a Mochi sin repetir la apertura.
- Recorrer sus siete expresiones: feliz, emocionado, curioso, enamorado, sorprendido, pensativo y celebrando.
- Pulsar «Mostrar todo» para revelar inmediatamente una frase, «Continuar» para avanzar y «Anterior» para volver a leer.
- Pulsar «Comenzar nuestra aventura» al final de la bienvenida para entrar al jardín con una transición animada.
- Recargar estando en el jardín: la escena se recupera automáticamente.
- Abrir los tres mensajes del álbum y reunir su estrella para desbloquear el laboratorio.
- En el laboratorio, seleccionar los seis ingredientes y pulsar «Mezclar nuestra fórmula». Descubrir su resultado y reunir la segunda estrella.
- Abrir las cuatro flores del jardín, leer sus razones y reunir la tercera estrella, que desbloquea el cumpleaños.
- Apagar las cinco velitas del pastel y reunir la cuarta estrella.
- Seguir las pistas de la misión en orden: Recuerdos → Confianza → Flores → Deseo → Amor. Reunir la quinta estrella.
- Unir las cinco estrellas en un corazón, escuchar a Mochi y abrir la caja del regalo.
- Leer la carta, desplegar «Hay una sorpresa más…» y sacar deseos del frasquito.
- Activar y pausar la melodía con el altavoz de la cabecera. No hay reproducción automática.
- Recargar a mitad de cualquiera de las actividades: se conservan mensajes, tarjeta actual, ingredientes, reacción, flores, velas y luces descubiertas.
- Revisitar las estaciones completadas o repetir el experimento sin duplicar estrellas.
- Recargar dentro de una estación y continuar en ella.
- Volver a la invitación desde el mapa, recargar y usar «Continuar mi aventura» sin repetir la bienvenida.
- Abrir «Reiniciar aventura» y cancelar con «Conservar mi aventura» o Escape. Solo la confirmación explícita borra el avance; el acceso al regalo se conserva si ya estaba desbloqueado.
- Pulsar «Volver a leer mi invitación» para repetirla desde el sobre cerrado, sin reiniciar las estrellas ni el acceso futuro al regalo.
- Tras completar la historia, usar «Volver a mi regalo» desde la invitación o el mapa para releer la carta. El acceso se mantiene incluso al reiniciar la aventura.
- Consultar las cinco estaciones desde «Un vistazo a la aventura».
- Cerrar las ventanas con su botón, Escape o tocando el fondo; navegar con Tab.
- Ver el diseño en un teléfono o con movimiento reducido.

En una partida nueva solo Recuerdos está disponible. Las cinco actividades exigen cumplir su condición antes de entregar su estrella; el reducer también lo verifica. La recompensa se guarda antes de cerrar la celebración. El mapa deriva sus estados del progreso real. Con movimiento reducido, los diálogos muestran el texto completo y se reducen las animaciones.

## Estructura

```text
src/
  audio/        # Música opcional y contexto independiente
  components/   # Guía, diálogos, mapa, pastel, caja, recompensas y modales
  data/         # adventure.js, activities.js, finale.js, dialogues.js y mochi.js
  scenes/       # Invitación, mapa, cinco estaciones, constelación y regalo
  state/        # reducers de progreso/actividades/final + contexto persistente
  styles/       # tokens, composición y responsive
public/
  media/        # fotos y audio personalizados
tests/          # reglas del progreso
docs/           # arquitectura y plan incremental
```

Personaliza `src/data/adventure.js`: nombre, fotos, recuerdos, razones, ingredientes, fecha, carta, música y sorpresa. La carta incluye un texto inicial editable para Ingrid, sin recuerdos ni fechas inventados. La música predeterminada es una melodía suave generada localmente y la sorpresa es un frasquito de deseos digitales. Coloca recursos personales en `public/media` y usa rutas `/media/archivo.jpg`. Las fuentes y dibujos se sirven localmente; no hay llamadas externas para las funciones esenciales.

Mientras `memories` esté vacío, el álbum funciona con tres tarjetas ilustradas simbólicas, identificadas como «Recuerdo ilustrado». Para usar fotos y recuerdos reales, añade objetos con `id`, `title`, `description`, `message`, `photo` y `date`. Consulta el ejemplo y el comportamiento ante fotos ausentes en `docs/FASE-5.md`. Los mensajes de las flores y los ingredientes siguen en `adventure.reasons` y `adventure.ingredients`.

Los mensajes y expresiones de cada conversación viven en `src/data/dialogues.js`; el nombre de la destinataria se toma de la configuración. Consulta `docs/FASE-2.md` para reutilizar el componente de diálogos en las próximas escenas.

Los textos del sobre, mapa y confirmación están en `src/data/adventure.js`; las instrucciones, reacciones y tarjetas ilustradas en `src/data/activities.js`; las velas, pistas y textos del final en `src/data/finale.js`. Consulta `docs/FASE-6.md` para la implementación, la personalización del regalo y la validación realizada. El progreso anterior se migra automáticamente; no hace falta borrar localStorage.

## Vercel

Importa la carpeta `michiaventura` como proyecto Vite. `vercel.json` configura instalación con `npm ci`, build con `npm run build`, salida `dist`, caché de recursos con nombre versionado y cabeceras básicas. No requiere variables de entorno, servidor ni reglas de rutas: la navegación usa estado interno. No hay una cuenta de Vercel conectada en este entorno, por lo que no se ha desplegado allí.

La publicación en Sites utiliza `.openai/hosting.json`. El acceso empieza privado; una URL privada no permite por sí sola que Ingrid entre desde otra cuenta. Consulta `docs/FASE-7.md` para la verificación final y el estado de publicación.

El progreso es local al dispositivo, navegador y dominio; no se sincroniza entre teléfonos ni se copia del servidor local a la publicación. Para revisar diseños estrechos durante desarrollo, abre `/qa/responsive.html`: el inspector queda fuera de `dist`. Consulta `docs/ARQUITECTURA.md` para mantener o ampliar las escenas.
