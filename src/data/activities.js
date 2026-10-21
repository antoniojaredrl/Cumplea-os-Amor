import { adventure } from './adventure.js';

// Tarjetas simbólicas: no representan fotografías ni acontecimientos reales.
export const illustratedMemories = [
  { id: 'little-moments', title: 'Los pequeños momentos', description: 'La magia también cabe en lo cotidiano.', message: 'A veces, el mejor plan es una pausa, una sonrisa y un poquito de tiempo juntos.', illustration: 'tea', illustrated: true },
  { id: 'little-universe', title: 'Un universo de cariño', description: 'Lo bonito no siempre necesita palabras.', message: 'Ojalá estas pequeñas estrellas te recuerden cuánto cariño puede guardar un corazón.', illustration: 'stars', illustrated: true },
  { id: 'growing-together', title: 'Todo lo que florece', description: 'Hay historias que crecen con cada detalle.', message: 'Que nunca nos falten las ganas de cuidarnos, de reír y de seguir descubriendo cosas bonitas.', illustration: 'flowers', illustrated: true },
];

export function getMemories(config = adventure) {
  const seen = new Set();
  const memories = (Array.isArray(config.memories) ? config.memories : []).filter(item => {
    if (!item || typeof item.id !== 'string' || !item.id || seen.has(item.id) || typeof item.title !== 'string' || typeof item.message !== 'string' || !item.message.trim()) return false;
    seen.add(item.id);
    return true;
  });
  return memories.length ? memories : illustratedMemories;
}

export function getIngredients(config = adventure) {
  const items = (Array.isArray(config.ingredients) ? config.ingredients : []).filter(item => typeof item === 'string' && item.trim());
  return [...new Set(items)];
}

export function getReasons(config = adventure) {
  const items = (Array.isArray(config.reasons) ? config.reasons : []).filter(item => typeof item === 'string' && item.trim());
  return [...new Set(items)];
}

export const activityCopy = {
  memories: {
    instruction: 'Cada tarjeta guarda un mensaje. Tócala para descubrirlo y reúne los pequeños tesoros de este álbum.',
    guideTitle: 'Lo bonito se guarda aquí.',
    guideMessage: 'Sin prisa, una tarjeta a la vez. Yo cuidaré que no se nos escape ningún corazoncito.',
    illustrationLabel: 'Recuerdo ilustrado',
    dateFallback: 'Un momento especial',
    revealLabel: 'Descubrir su mensaje',
    rereadLabel: 'Volver a leer su mensaje',
    missingPhoto: 'La fotografía no está disponible. Mochi ha dejado una ilustración en su lugar.',
    discoveredLabel: 'Mensajes descubiertos',
    rewardMessage: '¡Abriste todos los pequeños tesoros! Esta estrella guarda un poquito de cada mensaje.',
  },
  laboratory: {
    instruction: 'Añade los seis ingredientes a tu matraz y mézclalos para descubrir una fórmula muy especial.',
    guideTitle: 'La química de lo bonito.',
    guideMessage: 'Toca los ingredientes para añadirlos. Si cambias de idea, puedes retirarlos con otro toque. ¡Aquí investigamos con el corazón!',
    readyMessage: '¡La mezcla está lista! Solo falta darle un toquecito de magia.',
    mixedMessage: '¡Reacción positiva! Se ha detectado una cantidad extraordinaria de cariño.',
    mixLabel: 'Mezclar nuestra fórmula',
    resetLabel: 'Volver a experimentar',
    formulaTitle: 'Nuestra fórmula especial',
    formulaResult: 'nosotros ♡',
    discovery: 'Una fórmula que se cuida cada día.',
    rewardMessage: '¡Experimento completado! Esta estrella es el resultado de una mezcla hecha con mucho amor.',
    palette: ['#bba7d9', '#edb5cb', '#ead18b', '#b8d8c5', '#a8cbd9', '#d69db9'],
  },
  garden: {
    instruction: 'Toca cada flor para abrir sus pétalos. Todas tienen una razón bonita que contarte.',
    guideTitle: 'Hay cariño en cada pétalo.',
    guideMessage: 'Este jardín florece contigo. Las flores que ya abriste seguirán aquí para que vuelvas a leer sus mensajes.',
    discoveredLabel: 'Flores descubiertas',
    messageTitle: 'Una razón más para quererte',
    rewardMessage: '¡El jardín ha florecido entero! Cada razón se convirtió en un pétalo de esta estrella.',
    emptyMessage: 'Este jardín está esperando sus primeras razones de amor.',
  },
  shared: {
    returnLabel: 'Volver al mapa',
    claimLabel: 'Reunir mi estrella',
    completedLabel: 'Estrella reunida',
    rewardTitle: '¡Una estrella para ti!',
    rewardContinue: 'Guardar este momento y seguir',
    readyLabel: '¡Lo conseguiste! Tu estrella está lista.',
    pendingLabel: 'Completa los descubrimientos para reunir tu estrella.',
  },
};
