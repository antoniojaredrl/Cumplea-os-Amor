import { useCallback, useEffect, useRef, useState } from 'react';
import { adventure } from '../data/adventure.js';
import { MusicContext } from './music-context.js';

// Pequeña melodía original sintetizada localmente: no requiere archivos externos.
const notes = [261.63, 329.63, 392, 523.25, 440, 392, 329.63, 293.66, 261.63, 349.23, 440, 523.25, 392, 329.63, 293.66, 261.63];

export default function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const session = useRef(0);
  const context = useRef(null);
  const audio = useRef(null);
  const timer = useRef(null);
  const stop = useCallback(() => {
    session.current++;
    clearInterval(timer.current);
    timer.current = null;
    if (audio.current) { audio.current.pause(); audio.current.removeAttribute('src'); audio.current.load(); audio.current = null; }
    if (context.current) { context.current.close().catch(() => {}); context.current = null; }
    setPlaying(false);
    setBusy(false);
  }, []);

  useEffect(() => {
    function onVisibility() { if (document.hidden) stop(); }
    document.addEventListener('visibilitychange', onVisibility);
    return () => { document.removeEventListener('visibilitychange', onVisibility); stop(); };
  }, [stop]);

  async function toggle() {
    if (busy) return;
    if (playing) { stop(); return; }
    setError('');
    setBusy(true);
    const current = ++session.current;
    try {
      if (typeof adventure.music === 'string' && adventure.music.trim()) {
        const player = new Audio(adventure.music);
        audio.current = player;
        player.loop = true;
        player.volume = .22;
        player.onerror = () => { if (session.current === current) { stop(); setError('No se pudo cargar la música. Revisa el archivo o inténtalo de nuevo.'); } };
        await player.play();
      } else {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error('Audio no disponible');
        const ctx = new AudioContext();
        context.current = ctx;
        await ctx.resume();
        if (session.current !== current) return;
        function schedule() {
          if (ctx.state === 'closed') return;
          const start = ctx.currentTime + .06;
          notes.forEach((frequency, index) => {
            const oscillator = ctx.createOscillator();
            const envelope = ctx.createGain();
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            envelope.gain.setValueAtTime(.0001, start + index * .5);
            envelope.gain.exponentialRampToValueAtTime(.045, start + index * .5 + .025);
            envelope.gain.exponentialRampToValueAtTime(.0001, start + index * .5 + .8);
            oscillator.connect(envelope);
            envelope.connect(ctx.destination);
            oscillator.start(start + index * .5);
            oscillator.stop(start + index * .5 + .85);
          });
        }
        schedule();
        timer.current = setInterval(schedule, notes.length * 500);
      }
      if (session.current === current) setPlaying(true);
    } catch {
      if (session.current === current) { stop(); setError('No se pudo iniciar la música. Puedes volver a intentarlo cuando quieras.'); }
    } finally { if (session.current === current) setBusy(false); }
  }
  return <MusicContext.Provider value={{ playing, busy, error, toggle }}>{children}</MusicContext.Provider>;
}
