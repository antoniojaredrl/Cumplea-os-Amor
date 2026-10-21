// Cada expresión define una pose y un nombre accesible en un único lugar.
export const mochiExpressions = {
  happy: { label: 'feliz', y: [0, -5, 0], rotate: [0, -1, 0], duration: 5 },
  excited: { label: 'emocionado', y: [0, -10, 0], rotate: [-2, 2, -2], duration: 1.6 },
  curious: { label: 'curioso', y: [0, -3, 0], rotate: [0, 6, 0], duration: 3.5 },
  love: { label: 'enamorado', y: [0, -4, 0], rotate: [-2, 2, -2], duration: 4 },
  surprised: { label: 'sorprendido', y: [0, -7, 0], rotate: [0, 0, 0], duration: 2.5 },
  thinking: { label: 'pensativo', y: [0, -2, 0], rotate: [0, -5, 0], duration: 5 },
  celebrating: { label: 'celebrando', y: [0, -12, 0], rotate: [-5, 5, -5], duration: 1.8 },
};

export function getMochiExpression(expression) {
  return mochiExpressions[expression] ?? mochiExpressions.happy;
}
