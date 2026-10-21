import test from 'node:test';
import assert from 'node:assert/strict';
import { getPianoScore, noteFrequency } from '../src/audio/mananitas.js';
import { startPiano } from '../src/audio/piano.js';

test('el piano tiene una partitura finita, ordenada y una pausa antes de repetir', () => {
  const { events, duration } = getPianoScore();
  assert.equal(noteFrequency('A4'), 440);
  assert.ok(events.length > 80);
  assert.ok(duration > 30 && duration < 45);
  events.forEach((event, index) => {
    assert.ok(Number.isFinite(event.frequency) && event.frequency > 0);
    assert.ok(event.time >= 0 && event.duration > 0 && event.gain > 0);
    assert.ok(!index || events[index - 1].time <= event.time);
    assert.ok(event.time + event.duration < duration);
  });
  assert.throws(() => noteFrequency('nota inválida'));
});

test('pausar cancela el reloj y las voces; el programador solo anticipa una ventana breve', t => {
  let tick;
  let cleared;
  const voices = [];
  t.mock.method(globalThis, 'setInterval', callback => { tick = callback; return 123; });
  t.mock.method(globalThis, 'clearInterval', value => { cleared = value; });
  const parameter = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
  const context = {
    currentTime: 0, state: 'running', destination: {},
    createGain: () => ({ gain: parameter(), connect() {}, disconnect() {} }),
    createPeriodicWave: () => ({}),
    createOscillator: () => {
      const voice = { frequency: parameter(), setPeriodicWave() {}, connect() {}, disconnect() {}, start(time) { this.started = time; }, stop() { this.stops = (this.stops || 0) + 1; } };
      voices.push(voice); return voice;
    },
  };
  const stop = startPiano(context);
  assert.ok(voices.length > 0);
  assert.ok(voices.every(voice => voice.started <= .15));
  context.currentTime = .7;
  tick();
  assert.ok(voices.every(voice => voice.started <= .85));
  const active = [...voices];
  stop();
  assert.equal(cleared, 123);
  assert.ok(active.every(voice => voice.stops === 2));
});
