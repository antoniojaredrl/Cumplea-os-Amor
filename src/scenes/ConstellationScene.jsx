import { ArrowLeft, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { finaleCopy, personalize } from '../data/finale.js';
import { useProgress } from '../state/useProgress.js';
import Dialogue from '../components/Dialogue.jsx';
import Mochi from '../components/Mochi.jsx';

const scattered = [[28, 45], [290, 55], [296, 258], [155, 300], [25, 245]];
const heart = [[102, 86], [218, 86], [264, 156], [160, 257], [56, 156]];
const messages = finaleCopy.constellation.messages.map(message => ({ ...message, text: personalize(message.text) }));

export default function ConstellationScene() {
  const { progress, dispatch } = useProgress();
  const formed = progress.finale.constellationFormed;
  const reducedMotion = useReducedMotion();
  const copy = finaleCopy.constellation;
  return <main id="main" className="constellation-scene" tabIndex={-1}><button className="text-button finale-back" onClick={() => dispatch({ type: 'NAVIGATE', scene: 'map' })}><ArrowLeft size={15} />{finaleCopy.gift.backLabel}</button><div className="finale-heading"><span className="occasion-pill">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.instruction}</p></div>
    <div className={`constellation-stage ${formed ? 'is-formed' : ''}`}><div className="constellation-glow" /><svg className="constellation-sky" viewBox="0 0 320 330" role="img" aria-label={formed ? copy.joinedLabel : 'Cinco estrellas esperan para reunirse'}><motion.path d="M160 257C140 233 55 180 55 128 55 66 126 55 160 99 194 55 265 66 265 128 265 180 180 233 160 257Z" fill={formed ? '#e7bbcf33' : 'none'} stroke="#c693b4" strokeWidth="2" initial={false} animate={{ pathLength: formed ? 1 : 0, opacity: formed ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : 1.7 }} />{scattered.map(([x,y], index) => <motion.g key={index} initial={false} animate={{ x: formed ? heart[index][0] : x, y: formed ? heart[index][1] : y }} transition={{ duration: reducedMotion ? 0 : 1.4, ease: 'easeInOut' }}><path d="m0-16 5 10 12 2-9 9 2 12-10-6-10 6 2-12-9-9 12-2Z" fill="#f0d792" stroke="#c6a365" strokeWidth="1.5" /></motion.g>)}</svg><Mochi className="constellation-mochi" expression={formed ? 'love' : 'curious'} /></div>
    {!formed ? <button className="primary-button constellation-join" onClick={() => dispatch({ type: 'FORM_CONSTELLATION' })}><Star size={16} />{copy.joinLabel}</button> : <div className="constellation-dialogue"><Dialogue autoFocus showPortrait={false} messages={messages} completionLabel={copy.giftLabel} onComplete={() => dispatch({ type: 'NAVIGATE', scene: 'gift' })} /></div>}
  </main>;
}
