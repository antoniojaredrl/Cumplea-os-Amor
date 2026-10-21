import { useState } from 'react';
import { Check, Flower2 } from 'lucide-react';
import { activityCopy, getReasons } from '../data/activities.js';
import { useProgress } from '../state/useProgress.js';
import ActivityShell, { CelebrationBits } from '../components/ActivityShell.jsx';
import ActivityGuide from '../components/ActivityGuide.jsx';
import Modal from '../components/Modal.jsx';
import ReasonFlower from '../components/ReasonFlower.jsx';

export default function GardenScene({ station }) {
  const { progress, dispatch } = useProgress();
  const reasons = getReasons();
  const discovered = progress.activities.garden.discovered;
  const [active, setActive] = useState(null);
  const copy = activityCopy.garden;
  function reveal(reason) { dispatch({ type: 'DISCOVER_REASON', item: reason }); setActive(reason); }
  return <ActivityShell station={station} instruction={copy.instruction}>
    <div className="activity-counter garden-counter"><Flower2 size={17} /><strong>{discovered.length} / {reasons.length}</strong><span>{copy.discoveredLabel}</span></div>
    <section className="reasons-garden" aria-label="Flores con mensajes de amor"><div className="garden-sky" aria-hidden="true">✧ <span>♡</span> ✧</div><div className="reason-flowers">{reasons.map((reason, index) => { const opened = discovered.includes(reason); return <button key={reason} className={`flower-button ${opened ? 'is-discovered' : ''}`} aria-label={`${opened ? 'Volver a leer' : 'Descubrir'} razón ${index + 1}`} onClick={() => reveal(reason)}><ReasonFlower opened={opened} color={activityCopy.laboratory.palette[index % activityCopy.laboratory.palette.length]} /><span className="flower-number">{opened && <Check size={12} />}Flor {index + 1}</span></button>; })}</div>{!reasons.length && <p>{copy.emptyMessage}</p>}<div className="garden-earth" /></section>
    <ActivityGuide title={copy.guideTitle} message={copy.guideMessage} expression={discovered.length === reasons.length ? 'love' : 'happy'} />
    {active !== null && <Modal title={copy.messageTitle} onClose={() => setActive(null)}><div className="reason-message"><CelebrationBits variant="petals" /><Flower2 size={30} /><p>{active}</p></div></Modal>}
  </ActivityShell>;
}
