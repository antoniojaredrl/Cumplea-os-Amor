import { useCallback, useEffect, useRef, useState } from 'react';
import { adventure } from '../data/adventure.js';
import { MusicContext } from './music-context.js';
import { startPiano } from './piano.js';

export default function MusicProvider({ children }) {
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const session = useRef(0);
  const context = useRef(null);
  const audio = useRef(null);
  const stopPiano = useRef(null);
  const stop = useCallback(() => {
    session.current++;
    stopPiano.current?.();
    stopPiano.current = null;
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
        stopPiano.current = startPiano(ctx);
      }
      if (session.current === current) setPlaying(true);
    } catch {
      if (session.current === current) { stop(); setError('No se pudo iniciar la música. Puedes volver a intentarlo cuando quieras.'); }
    } finally { if (session.current === current) setBusy(false); }
  }
  return <MusicContext.Provider value={{ playing, busy, error, toggle }}>{children}</MusicContext.Provider>;
}
