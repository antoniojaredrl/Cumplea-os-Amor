import { getPianoScore } from './mananitas.js';

// Piano sintetizado: ataque breve, armónicos suaves y caída por nota.
// Solo programa los próximos 150 ms; pausar no deja una canción entera en cola.
export function startPiano(context) {
  const { events, duration } = getPianoScore();
  const master = context.createGain();
  master.gain.value = .55;
  master.connect(context.destination);
  const wave = context.createPeriodicWave(
    new Float32Array(9), new Float32Array([0, 1, .38, .17, .08, .045, .025, .012, .006]),
  );
  const voices = new Set();
  let cursor = 0;
  let cycleStart = context.currentTime + .06;

  function strike(event, when) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.setPeriodicWave(wave);
    oscillator.frequency.value = event.frequency;
    const tail = Math.max(.8, event.duration + .65);
    envelope.gain.setValueAtTime(.0001, when);
    envelope.gain.exponentialRampToValueAtTime(event.gain, when + .008);
    envelope.gain.exponentialRampToValueAtTime(event.gain * .35, when + .16);
    envelope.gain.exponentialRampToValueAtTime(.0001, when + tail);
    oscillator.connect(envelope);
    envelope.connect(master);
    voices.add(oscillator);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); voices.delete(oscillator); };
    oscillator.start(when);
    oscillator.stop(when + tail + .02);
  }

  function schedule() {
    if (context.state !== 'running') return;
    const now = context.currentTime;
    while (cycleStart + events[cursor].time <= now + .15) {
      const when = cycleStart + events[cursor].time;
      if (when >= now) strike(events[cursor], when);
      cursor++;
      if (cursor === events.length) { cursor = 0; cycleStart += duration; }
    }
  }
  schedule();
  const timer = setInterval(schedule, 50);
  return () => {
    clearInterval(timer);
    master.disconnect();
    voices.forEach(voice => { try { voice.stop(); } catch { /* Ya terminada. */ } });
    voices.clear();
  };
}
