import { candleIds } from '../data/finale.js';

export default function BirthdayCake({ extinguished, onExtinguish }) {
  return <div className="birthday-cake" role="group" aria-label="Pastel de cumpleaños con cinco velitas">
    <div className="cake-candles">{candleIds.map((id, index) => {
      const out = extinguished.includes(id);
      return <button key={id} className={`candle-button candle-${index + 1} ${out ? 'is-out' : ''}`} aria-label={`${out ? 'Vela apagada' : 'Apagar vela'} ${index + 1}`} aria-disabled={out} onClick={() => { if (!out) onExtinguish(id); }}><span className="candle-flame" /><span className="candle-wick" /><span className="candle-stick" />{out && <span className="candle-smoke" />}</button>;
    })}</div>
    <div className="cake-top"><span className="cake-cherry">♡</span></div><div className="cake-body"><div className="cake-frosting" /><div className="cake-layer" /><span className="cake-decoration">♡ · ♡ · ♡</span></div><div className="cake-plate" />
  </div>;
}
