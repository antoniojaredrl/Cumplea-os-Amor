import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Heart } from 'lucide-react';
import { activityCopy, getMemories } from '../data/activities.js';
import { useProgress } from '../state/useProgress.js';
import ActivityShell, { CelebrationBits } from '../components/ActivityShell.jsx';
import ActivityGuide from '../components/ActivityGuide.jsx';
import MemoryArtwork from '../components/MemoryArtwork.jsx';
import Modal from '../components/Modal.jsx';

function displayDate(memory) {
  if (memory.illustrated) return activityCopy.memories.illustrationLabel;
  if (typeof memory.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(memory.date)) {
    const date = new Date(`${memory.date}T12:00:00Z`);
    if (!Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === memory.date) return new Intl.DateTimeFormat('es-MX', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
  }
  return activityCopy.memories.dateFallback;
}

export default function MemoriesScene({ station }) {
  const { progress, dispatch } = useProgress();
  const memories = getMemories();
  const saved = progress.activities.memories;
  const index = Math.max(0, memories.findIndex(item => item.id === saved.currentId));
  const memory = memories[index];
  const [messageOpen, setMessageOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const copy = activityCopy.memories;
  const revealed = saved.revealed.includes(memory.id);
  function select(nextIndex) { dispatch({ type: 'SELECT_MEMORY', item: memories[nextIndex].id }); }
  function reveal() { dispatch({ type: 'REVEAL_MEMORY', item: memory.id }); setMessageOpen(true); }
  return <ActivityShell station={station} instruction={copy.instruction}>
    <div className="memory-layout"><div className="album-page">
      <AnimatePresence mode="wait" initial={false}><motion.div key={memory.id} initial={{ opacity: 0, x: reducedMotion ? 0 : 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: reducedMotion ? 0 : -15 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
        <button className="polaroid" onClick={reveal} aria-label={`${revealed ? copy.rereadLabel : copy.revealLabel}: ${memory.title}`}><span className="polaroid-tape" aria-hidden="true" /><MemoryArtwork key={`${memory.id}:${memory.photo}`} memory={memory} /><span className="polaroid-date">{displayDate(memory)}</span><span className="polaroid-title">{memory.title}</span><span className="polaroid-caption">{memory.description}</span><span className="memory-reveal-hint"><Heart size={13} />{revealed ? copy.rereadLabel : copy.revealLabel}</span></button>
      </motion.div></AnimatePresence>
      <div className="album-navigation"><button className="icon-button" aria-disabled={index === 0} aria-label="Ver recuerdo anterior" onClick={() => { if (index > 0) select(index - 1); }}><ArrowLeft size={18} /></button><span aria-live="polite">{index + 1} / {memories.length}</span><button className="icon-button" aria-disabled={index === memories.length - 1} aria-label="Ver recuerdo siguiente" onClick={() => { if (index < memories.length - 1) select(index + 1); }}><ArrowRight size={18} /></button></div>
    </div><div className="album-companion"><ActivityGuide title={copy.guideTitle} message={copy.guideMessage} expression="love" /><div className="activity-counter"><Heart size={16} /><strong>{saved.revealed.length} / {memories.length}</strong><span>{copy.discoveredLabel}</span></div><ol className="album-index">{memories.map((item, i) => <li key={item.id}><button className={i === index ? 'is-current' : ''} aria-current={i === index ? 'true' : undefined} onClick={() => select(i)} aria-label={`Ver recuerdo ${i + 1}: ${item.title}`}><span>{saved.revealed.includes(item.id) ? <Check size={14} /> : String(i+1).padStart(2,'0')}</span>{item.title}</button></li>)}</ol></div></div>
    {messageOpen && <Modal title={memory.title} onClose={() => setMessageOpen(false)}><div className="memory-secret"><CelebrationBits /><Heart size={30} /><p>{memory.message}</p></div></Modal>}
  </ActivityShell>;
}
