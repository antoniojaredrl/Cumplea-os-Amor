import { activityCopy } from '../data/activities.js';

export default function LoveFlask({ count, total, mixed }) {
  const color = mixed ? '#d49bbd' : activityCopy.laboratory.palette[Math.max(0, count - 1) % activityCopy.laboratory.palette.length];
  return <div className={`love-flask ${mixed ? 'is-mixed' : ''}`} aria-label={`Matraz con ${count} de ${total} ingredientes${mixed ? ', fórmula mezclada' : ''}`} role="img">
    <div className="flask-neck" /><div className="flask-body"><div className="flask-liquid" style={{ height: `${count ? 15 + count / Math.max(total,1) * 55 : 0}%`, '--liquid-color': color }}>{Array.from({ length: 7 }, (_, i) => <span key={i} className="flask-bubble" style={{ '--i': i }} />)}</div><div className="flask-shine" /><div className="flask-markings"><i /><i /><i /></div><span className="flask-heart">♡</span></div><div className="flask-shadow" />
  </div>;
}
