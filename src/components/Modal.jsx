import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ title, children, onClose, returnFocusRef }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    const previous = document.activeElement;
    dialog.showModal();
    return () => { dialog.close(); (returnFocusRef?.current ?? previous)?.focus(); };
  }, []);
  return <dialog ref={ref} className="story-modal" aria-labelledby="modal-title" onCancel={onClose} onClick={event => { if (event.target === ref.current) onClose(); }}>
    <button className="icon-button close-modal" onClick={onClose} aria-label="Cerrar"><X size={20} /></button>
    <span className="eyebrow">EL COMIENZO DE ALGO BONITO</span><h2 id="modal-title">{title}</h2>{children}
  </dialog>;
}
