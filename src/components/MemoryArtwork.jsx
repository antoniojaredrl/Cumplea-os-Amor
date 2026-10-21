import { useState } from 'react';
import { activityCopy } from '../data/activities.js';

export function MemoryIllustration({ theme = 'tea' }) {
  const isNight = theme === 'stars';
  return <svg className="memory-illustration" viewBox="0 0 440 330" role="img" aria-label={isNight ? 'Ilustración de un gatito bajo las estrellas' : theme === 'flowers' ? 'Ilustración de un jardín de flores' : 'Ilustración de una taza y un gatito'}>
    <rect width="440" height="330" fill={isNight ? '#dfd7ed' : theme === 'flowers' ? '#dfe8da' : '#f5e0db'} />
    <circle cx="345" cy="80" r="40" fill="#fff3d6" /><path d="M0 260Q120 180 240 250T440 230V330H0Z" fill={isNight ? '#c1b7d8' : '#c4d5b8'} />
    {isNight && <g fill="#fff5d2"><path d="m80 55 5 13 14 2-11 9 3 14-11-7-12 7 3-14-11-9 14-2ZM279 126l4 10 11 1-8 7 2 11-9-5-9 5 2-11-8-7 11-1Z" /><circle cx="181" cy="70" r="3" /><circle cx="380" cy="167" r="3" /></g>}
    {theme === 'flowers' && <g stroke="#8bab8d" strokeWidth="5"><path d="M82 262v-87m265 106V160m-55 121v-54" />{[[82, 165], [347, 150], [292, 220]].map(([x,y],i) => <g key={i} stroke="none" fill={i % 2 ? '#ccbadf' : '#e3adc1'}>{[0,60,120,180,240,300].map(angle => <ellipse key={angle} cx={x} cy={y-14} rx="12" ry="20" transform={`rotate(${angle} ${x} ${y})`} />)}<circle cx={x} cy={y} r="13" fill="#f2d999" /></g>)}</g>}
    <g transform={theme === 'flowers' ? 'translate(15 5)' : 'translate(0 0)'}><path d="M145 192 148 124 178 148Q207 138 233 148l33-24 4 68q17 66-63 66t-62-66Z" fill="#fff6e9" stroke="#967768" strokeWidth="3" strokeLinejoin="round" /><path d="m158 147 1-9 10 9m77 0 10-9 1 9" stroke="#e5afbd" strokeWidth="8" /><path d="M172 190q8-10 16 0m40 0q8-10 16 0m-41 16 5 5 5-5m-5 5q-6 12-12 2m12-2q6 12 12 2" fill="none" stroke="#967768" strokeWidth="3" strokeLinecap="round" /><ellipse cx="165" cy="205" rx="11" ry="6" fill="#efb8bf" /><ellipse cx="249" cy="205" rx="11" ry="6" fill="#efb8bf" /></g>
    {theme === 'tea' && <g><path d="M250 244h63v37q-30 22-63 0Z" fill="#d4b9d6" stroke="#a68da6" strokeWidth="2" /><path d="M313 251q28-6 18 18l-18 3" fill="none" stroke="#a68da6" strokeWidth="5" /><path d="M267 229q-14-17 0-27m23 25q-14-17 0-27" fill="none" stroke="#fff8f1" strokeWidth="5" strokeLinecap="round" /><ellipse cx="281" cy="292" rx="48" ry="5" fill="#b6bea6" /></g>}
    <path d="M104 109c-14-20-30 1 0 20 30-19 14-40 0-20" fill="#d69bb5" />
  </svg>;
}

export default function MemoryArtwork({ memory }) {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(Boolean(memory.photo));
  if (!memory.photo || failed) return <><MemoryIllustration theme={memory.illustration} />{failed && <span className="photo-fallback-note" role="status">{activityCopy.memories.missingPhoto}</span>}</>;
  return <span className={`memory-photo-wrap ${loading ? 'is-loading' : ''}`}><img src={memory.photo} alt={memory.title} onLoad={() => setLoading(false)} onError={() => { setFailed(true); setLoading(false); }} /></span>;
}
