import { adventure } from './adventure.js';

// Función para que nombres y textos personalizables provengan de adventure.js.
export function getWelcomeDialogue(config = adventure) {
  return [
    { id: 'hello', expression: 'happy', text: `¡${config.recipient}! ¡Por fin llegaste! Soy ${config.guide.name}, ${config.guide.signature.toLowerCase()}.` },
    { id: 'mission', expression: 'excited', text: config.guide.message },
    { id: 'curiosity', expression: 'curious', text: '¿Sabes dónde se esconde la magia? A veces, en una foto. Otras, en una risa que no puedes olvidar.' },
    { id: 'affection', expression: 'love', text: config.invitation.letter },
    { id: 'secret', expression: 'surprised', text: '¡Uy! Casi te cuento la sorpresa del final. Mis bigotitos tendrán que guardar el secreto un poquito más.' },
    { id: 'plan', expression: 'thinking', text: 'Veamos… recuerdos, una fórmula de amor, flores y un deseo. Sí, ya sé por dónde empezar.' },
    { id: 'celebration', expression: 'celebrating', text: '¡El plan está listo! Cinco estrellitas nos esperan. Cuando quieras, ven conmigo: te enseñaré el jardín donde empieza nuestra aventura.' },
  ];
}
