# Fase 2 · Mochi y sus diálogos

## Implementación

- Siete expresiones en el SVG local con gestos y poses propios. `data/mochi.js` centraliza nombres accesibles y movimientos. Una expresión desconocida conserva la presentación feliz.
- `components/Dialogue.jsx` recibe `messages`, `speaker`, `completionLabel` y `onComplete`. No conoce estaciones ni concede estrellas.
- Cada mensaje contiene `{ id, expression, text }`. Los textos de bienvenida viven en `data/dialogues.js`, que toma los nombres y mensajes personalizados de `adventure.js`.
- Escritura cada 27 ms, segmentada en grafemas cuando el navegador soporta `Intl.Segmenter`; el botón «Mostrar todo» revela la frase sin avanzar. El siguiente toque continúa.
- «Anterior» vuelve a la frase previa y reinicia su escritura. El botón principal conserva el foco al cambiar de mensaje. La última acción llama una sola vez a `onComplete`.
- Los intervalos se limpian al revelar texto, cambiar de frase o desmontar. Reabrir la conversación empieza en el mensaje 1.
- El texto completo reserva su espacio para evitar que el bocadillo cambie de altura durante la escritura. Los estilos están separados en `styles/dialogue.css`.
- `useReducedMotion` deja quieto a Mochi y revela la frase completa. El lector de pantalla recibe el mensaje completo mediante una región de estado; la escritura visual queda oculta al árbol accesible.
- Los modales se montan por vista, de forma que terminar la conversación deja el foco en Cerrar al mostrar el recorrido y Escape devuelve el foco al botón de la portada.

## Reutilizar en otra escena

```jsx
<Dialogue
  key="bienvenida-laboratorio"
  messages={laboratoryDialogue}
  speaker={adventure.guide.name}
  completionLabel="Entrar al laboratorio"
  onComplete={openLaboratory}
/>
```

Usar un `id` estable por mensaje y una `key` distinta si se sustituye una conversación montada por otra. Para comenzar, `messages` debe contener al menos un elemento; si está vacío se muestra un aviso sin controles de avance. No cambiar la lista durante una conversación activa.

## Comprobación realizada

- Compilación de producción correcta con `npm run build`.
- `npm test`: las cuatro pruebas existentes del progreso siguen aprobadas.
- En navegador de escritorio: los siete mensajes mostraron sus expresiones correspondientes; se revisaron visualmente el bocadillo y los gestos.
- Enter avanzó una frase y un segundo Enter inmediato reveló el texto completo, sin saltar al mensaje siguiente.
- Anterior regresó al mensaje 2 desde el 3 y el foco pasó al botón principal.
- La última frase abrió el recorrido con foco en Cerrar. Escape cerró y devolvió el foco al botón inicial.
- Reabrir la invitación reinició la conversación en 1/7.
- Captura: `fase-2-dialogo.png`.

No se ha comprobado en teléfono físico, con lector de pantalla real ni cambiando la preferencia del sistema para movimiento reducido. Esos comportamientos están implementados, pendientes de esa verificación. La invitación narrativa completa y sus transiciones siguen correspondiendo a la fase 3.
