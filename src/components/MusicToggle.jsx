import { useContext } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { MusicContext } from '../audio/music-context.js';

export default function MusicToggle() {
  const { playing, busy, toggle } = useContext(MusicContext);
  const label = playing ? 'Pausar música' : 'Activar música';
  return <button className={`icon-button music-toggle ${playing ? 'is-playing' : ''}`} aria-label={label} title={label} aria-pressed={playing} disabled={busy} onClick={toggle}>{playing ? <Volume2 size={18} /> : <VolumeX size={18} />}</button>;
}
