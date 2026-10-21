import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Star } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { activityCopy } from '../data/activities.js';
import { finaleCopy } from '../data/finale.js';
import { useProgress } from '../state/useProgress.js';
import { isActivityReady } from '../state/activities.js';
import Mochi from './Mochi.jsx';
import Modal from './Modal.jsx';

export function CelebrationBits({ variant = 'hearts' }) {
  return <div className={`celebration-bits ${variant}`} aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i} style={{ '--i': i, '--drift': `${(i % 2 ? 1 : -1) * (25 + i * 13)}px` }}>{variant === 'petals' ? '❀' : i % 3 === 0 ? '✧' : '♡'}</span>)}</div>;
}

export default function ActivityShell({ station, children, instruction }) {
  const { progress, dispatch } = useProgress();
  const [rewardOpen, setRewardOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const completed = progress.completed.includes(station.id);
  const ready = isActivityReady(station.id, progress.activities);
  const copy = activityCopy.shared;
  const stationCopy = activityCopy[station.id] ?? finaleCopy[station.id];
  function backToMap() { setRewardOpen(false); dispatch({ type: 'NAVIGATE', scene: 'map' }); }
  function continueFromReward() { setRewardOpen(false); dispatch({ type: 'NAVIGATE', scene: station.id === 'stars' ? 'constellation' : 'map' }); }
  function collect() {
    if (!ready || completed) return;
    dispatch({ type: 'COMPLETE', id: station.id, stay: true });
    setRewardOpen(true);
  }
  return <main id="main" className={`activity-scene activity-${station.id}`} tabIndex={-1}>
    <div className="activity-topline"><button className="text-button" onClick={backToMap}><ArrowLeft size={15} />{copy.returnLabel}</button><span className={`activity-reward-label ${completed ? 'is-collected' : ''}`}>{completed ? <Check size={14} /> : <Star size={14} />}{completed ? copy.completedLabel : '1 estrella por descubrir'}</span></div>
    <header className="activity-heading"><h1>{station.title}</h1><p>{instruction}</p></header>
    {children}
    <div className="activity-finish"><p role="status">{completed ? copy.completedLabel : ready ? copy.readyLabel : copy.pendingLabel}</p>{completed ? <button className="primary-button" onClick={backToMap}>{copy.returnLabel}<ArrowRight size={16} /></button> : <button className="primary-button" disabled={!ready} onClick={collect}><Star size={16} />{copy.claimLabel}</button>}</div>
    {rewardOpen && <Modal title={copy.rewardTitle} onClose={continueFromReward}><div className="star-reward"><CelebrationBits /><motion.div className="reward-star" initial={reducedMotion ? false : { scale: .6, rotate: -20 }} animate={{ scale: 1, rotate: 0 }}><Star size={72} fill="currentColor" strokeWidth={1} /></motion.div><Mochi className="reward-mochi" expression="celebrating" /><p>{stationCopy.rewardMessage}</p><button className="primary-button" onClick={continueFromReward}>{station.id === 'stars' ? 'Ver nuestras cinco estrellas' : copy.rewardContinue}<ArrowRight size={16} /></button></div></Modal>}
  </main>;
}
