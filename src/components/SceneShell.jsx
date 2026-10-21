import { useContext } from 'react';
import { Heart, PawPrint, Sparkles } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import ProgressStars from './ProgressStars.jsx';
import MusicToggle from './MusicToggle.jsx';
import { MusicContext } from '../audio/music-context.js';

export default function SceneShell({ children, onAbout }) {
  const { error } = useContext(MusicContext);
  return <div className="app-shell">
    <a className="skip-link" href="#main">Saltar al contenido</a>
    <header className="site-header">
      <a className="brand" href="#main" aria-label={`${adventure.title}, inicio`}><span className="brand-icon"><PawPrint size={23} /></span><span>{adventure.title}<span className="brand-subtitle">UN CUMPLEAÑOS HECHO CON AMOR</span></span></a>
      <nav aria-label="Tu aventura"><ProgressStars /><MusicToggle /><button className="icon-button help-button" aria-label="Acerca de esta aventura" onClick={onAbout}><Heart size={19} /></button></nav>
    </header>
    {error && <p className="music-feedback" role="status">{error}</p>}
    {children}
    <footer><span>Hecho con <Heart size={12} fill="currentColor" /> y un poquito de magia</span><span>Para {adventure.recipient}, con todo el corazón <Sparkles size={13} /></span></footer>
  </div>;
}
