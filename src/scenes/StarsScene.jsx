import { useState } from 'react';
import { Camera, CakeSlice, Check, FlaskConical, Flower2, Heart, RotateCcw, Star } from 'lucide-react';
import { starLights, finaleCopy } from '../data/finale.js';
import { useProgress } from '../state/useProgress.js';
import ActivityShell from '../components/ActivityShell.jsx';
import ActivityGuide from '../components/ActivityGuide.jsx';

const icons = { camera: Camera, flask: FlaskConical, flower: Flower2, cake: CakeSlice, heart: Heart };
export default function StarsScene({ station }) {
  const { progress, dispatch } = useProgress();
  const found = progress.activities.stars.found;
  const [feedback, setFeedback] = useState('');
  const copy = finaleCopy.stars;
  const finished = found.length === starLights.length;
  function touch(id) {
    const correct = starLights[found.length]?.id === id;
    dispatch({ type: 'TOUCH_STAR', item: id });
    setFeedback(correct ? copy.correctMessage : copy.wrongMessage);
  }
  return <ActivityShell station={station} instruction={copy.instruction}>
    <div className="star-mission"><div className="mission-heading"><Star size={24} /><span>{found.length} / {starLights.length} luces despiertas</span></div><p className="mission-clue" role="status">{finished ? copy.finishedMessage : starLights[found.length].clue}</p><div className="mission-lights">{starLights.map(light => { const Icon = icons[light.icon]; const lit = found.includes(light.id); return <button key={light.id} className={`mission-light ${lit ? 'is-lit' : ''}`} style={{ '--light-color': light.color }} aria-label={`${lit ? 'Luz encendida' : 'Iluminar'}: ${light.label}`} aria-disabled={lit} onClick={() => { if (!lit) touch(light.id); }}><span className="mission-star"><Star size={80} strokeWidth={.8} fill="currentColor" /><Icon className="mission-symbol" size={20} /></span><span>{light.label}</span>{lit && <Check size={13} />}</button>; })}</div><p className="mission-feedback" role="status">{feedback}</p></div>
    {found.length > 0 && <button className="text-button relight-button" onClick={() => { dispatch({ type: 'RESET_STARS' }); setFeedback(''); }}><RotateCcw size={14} />{copy.retryLabel}</button>}
    <ActivityGuide title={copy.guideTitle} message={finished ? copy.finishedMessage : 'No tenemos prisa. Si una luz no es la que buscamos, la pista seguirá aquí para ayudarte.'} expression={finished ? 'excited' : 'curious'} />
  </ActivityShell>;
}
