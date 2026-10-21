// Melodía tradicional de Las mañanitas, en La mayor y compás de 3/4.
// Referencia de notación: https://en.wikipedia.org/wiki/Las_Ma%C3%B1anitas
// Acompañamiento sencillo propio. No contiene grabaciones ni muestras externas.
export const pianoTempo = 82;
const bars = [
  [['A4', 1.5], ['A4', .5], ['G#4', .5], ['A4', .5]],
  [['B4', 1.5], ['G#4', .5], ['A4', .5], ['B4', .5]],
  [['C#5', 1.5], ['A4', .5], ['B4', .5], ['C#5', .5]],
  [['D5', 2], ['D5', .5], ['D5', .5]],
  [['C#5', 1.5], ['B4', .5], ['A4', .5], ['G#4', .5]],
  [['B4', 1], ['A4', .5], ['G#4', .5], ['A4', .5], ['B4', .5]],
  [['C#5', 1], ['D5', 1], ['B4', 1]],
  [['A4', 2], ['C#5', 1]],
  [['B4', 1], ['G#4', .5], ['G#4', .5], ['A4', .5], ['B4', .5]],
  [['C#5', 1], ['A4', 1], ['C#5', 1]],
  [['B4', 1], ['G#4', .5], ['G#4', .5], ['A4', .5], ['B4', .5]],
  [['C#5', 2], ['A4', .5], ['A4', .5]],
  [['D5', 1.5], ['D5', .5], ['E5', .5], ['D5', .5]],
  [['C#5', 1], ['A4', .5], ['G#4', .5], ['A4', .5], ['B4', .5]],
  [['C#5', 1], ['D5', 1], ['B4', 1]],
  [['A4', 2]],
];

const chords = {
  A: ['A2', 'C#3', 'E3'], D: ['D3', 'F#3', 'A3'], E: ['E3', 'G#3', 'B3'],
};
const harmony = ['A', 'E', 'A', 'D', 'A', 'E', 'E', 'A', 'E', 'A', 'E', 'A', 'D', 'A', 'E', 'A'];
const semitones = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };

export function noteFrequency(note) {
  const [, pitch, octave] = /^([A-G]#?)(\d)$/.exec(note) || [];
  if (pitch === undefined || semitones[pitch] === undefined) throw new Error(`Nota inválida: ${note}`);
  return 440 * 2 ** ((12 * (Number(octave) + 1) + semitones[pitch] - 69) / 12);
}

export function getPianoScore() {
  const beat = 60 / pianoTempo;
  const events = [];
  function add(note, time, duration, gain) {
    events.push({ frequency: noteFrequency(note), time: time * beat, duration: duration * beat, gain });
  }
  add('E4', 0, .5, .12);
  add('E4', .5, .5, .11);
  bars.forEach((bar, index) => {
    const start = 1 + index * 3;
    let cursor = start;
    bar.forEach(([note, duration]) => { add(note, cursor, duration, .12); cursor += duration; });
    const chord = chords[harmony[index]];
    if (index === bars.length - 1) {
      chord.forEach(note => add(note, start, 2.5, .035));
    } else {
      chord.forEach((note, beatIndex) => add(note, start + beatIndex, 1.15, .035));
    }
  });
  // Dos segundos largos para dejar caer la última nota antes de volver al inicio.
  return { events: events.sort((a, b) => a.time - b.time), duration: 51 * beat };
}
