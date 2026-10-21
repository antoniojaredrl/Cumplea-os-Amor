import { RotateCcw } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import { useProgress } from '../state/useProgress.js';
import Modal from './Modal.jsx';

export default function RestartDialog({ onClose }) {
  const { progress, dispatch } = useProgress();
  return <Modal title={adventure.reset.title} onClose={onClose}><p>{adventure.reset.message}</p>{progress.giftUnlocked && <p className="phase-note">{adventure.reset.giftNotice}</p>}<div className="confirm-actions"><button className="secondary-button" onClick={onClose}>{adventure.reset.cancelLabel}</button><button className="primary-button" onClick={() => { onClose(); dispatch({ type: 'RESET' }); }}>{adventure.reset.confirmLabel}<RotateCcw size={15} /></button></div></Modal>;
}
