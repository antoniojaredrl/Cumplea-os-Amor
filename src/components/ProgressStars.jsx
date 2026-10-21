import { Star } from 'lucide-react';
import { useProgress } from '../state/useProgress.js';

export default function ProgressStars() {
  const { progress } = useProgress();
  return <div className="progress-stars" aria-label={`${progress.completed.length} de 5 estrellas reunidas`}>
    <span className="star-slots" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} className={i < progress.completed.length ? 'collected' : ''} />)}</span>
    <span>{progress.completed.length}<span className="progress-total"> / 5</span></span>
  </div>;
}
