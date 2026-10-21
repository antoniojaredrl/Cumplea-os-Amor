import { RotateCcw } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import { candleIds, finaleCopy } from '../data/finale.js';
import { useProgress } from '../state/useProgress.js';
import ActivityShell from '../components/ActivityShell.jsx';
import ActivityGuide from '../components/ActivityGuide.jsx';
import BirthdayCake from '../components/BirthdayCake.jsx';
import Confetti from '../components/Confetti.jsx';

export default function BirthdayScene({ station }) {
  const { progress, dispatch } = useProgress();
  const extinguished = progress.activities.birthday.extinguished;
  const finished = extinguished.length === candleIds.length;
  const copy = finaleCopy.birthday;
  return <ActivityShell station={station} instruction={copy.instruction}>
    <section className={`birthday-party ${finished ? 'is-celebrating' : ''}`} aria-label="Celebración de cumpleaños"><div className="party-garland" aria-hidden="true">{Array.from({ length: 9 }, (_, i) => <span key={i} />)}</div><div className="party-balloon balloon-left" aria-hidden="true">♡</div><div className="party-balloon balloon-right" aria-hidden="true">✧</div><span className="party-eyebrow">UN DESEO, MUCHÍSIMO CARIÑO</span><h2>{finished ? `¡Feliz cumpleaños, ${adventure.recipient}!` : 'Pide un deseo bonito.'}</h2><BirthdayCake extinguished={extinguished} onExtinguish={item => dispatch({ type: 'EXTINGUISH_CANDLE', item })} />{finished && <Confetti />}<p className="candle-counter" role="status">{extinguished.length} / {candleIds.length} · {copy.counterLabel}</p></section>
    {extinguished.length > 0 && <button className="text-button relight-button" onClick={() => dispatch({ type: 'RELIGHT_CANDLES' })}><RotateCcw size={14} />{copy.relightLabel}</button>}
    <ActivityGuide title={copy.guideTitle} message={finished ? copy.finishedMessage : copy.guideMessage} expression={finished ? 'celebrating' : 'happy'} />
  </ActivityShell>;
}
