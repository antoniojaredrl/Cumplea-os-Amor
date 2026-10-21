import { useEffect, useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Mochi from './Mochi.jsx';
import { adventure } from '../data/adventure.js';

function TypedMessage({ text, speaker, reducedMotion, controls }) {
  const characters = typeof Intl.Segmenter === 'function'
    ? Array.from(new Intl.Segmenter('es', { granularity: 'grapheme' }).segment(text), item => item.segment)
    : Array.from(text);
  const [visibleCount, setVisibleCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const complete = reducedMotion || revealed || visibleCount >= characters.length;
  useEffect(() => {
    if (reducedMotion || revealed) return;
    const timer = setInterval(() => setVisibleCount(count => {
      if (count + 1 >= characters.length) clearInterval(timer);
      return Math.min(count + 1, characters.length);
    }), 27);
    return () => clearInterval(timer);
  }, [text, characters.length, reducedMotion, revealed]);

  return <>
    {/* El lector de pantalla recibe la frase completa una vez, no cada carácter. */}
    <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{speaker}: {text}</p>
    <div className="dialogue-message" aria-hidden="true">
      <p className="dialogue-size-reference">{text}</p>
      <p className="dialogue-typed">{complete ? text : characters.slice(0, visibleCount).join('')}<span className={`typing-cursor ${complete ? 'is-hidden' : ''}`}>│</span></p>
    </div>
    {controls({ complete, reveal: () => setRevealed(true) })}
  </>;
}

// Usa una key de conversación para reiniciar este componente con otro relato.
export default function Dialogue({ messages = [], speaker = adventure.guide.name, onComplete, completionLabel = 'Continuar', showPortrait = true, autoFocus = false }) {
  const [index, setIndex] = useState(0);
  const finished = useRef(false);
  const actionRef = useRef(null);
  const restoreActionFocus = useRef(false);
  const reducedMotion = useReducedMotion();
  const headingId = useId();
  useEffect(() => { if (autoFocus) actionRef.current?.focus({ preventScroll: true }); }, [autoFocus]);
  useEffect(() => {
    if (restoreActionFocus.current) {
      actionRef.current?.focus();
      restoreActionFocus.current = false;
    }
  }, [index]);
  const message = messages[index];
  if (!message) return <p role="status">Mochi está preparando sus palabras. Vuelve a abrir la conversación en un momento.</p>;
  const last = index === messages.length - 1;
  function advance() {
    if (!last) { restoreActionFocus.current = true; setIndex(current => current + 1); }
    else if (!finished.current) { finished.current = true; onComplete?.(); }
  }
  return <section className="dialogue" aria-labelledby={headingId}>
    {showPortrait && <div className="dialogue-portrait"><Mochi className="dialogue-mochi" expression={message.expression} /><span className="dialogue-petals" aria-hidden="true">✧ · ♡ · ✧</span></div>}
    <motion.div className="dialogue-bubble" initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
      <div className="dialogue-heading"><h3 id={headingId}><Sparkles size={14} /> {speaker}</h3><span aria-label={`Mensaje ${index + 1} de ${messages.length}`}>{index + 1} / {messages.length}</span></div>
      <TypedMessage key={`${message.id ?? index}:${message.text}`} text={message.text} speaker={speaker} reducedMotion={reducedMotion} controls={({ complete, reveal }) => <div className="dialogue-controls">
        <button className="dialogue-back" disabled={index === 0} aria-label="Volver al mensaje anterior" onClick={() => { restoreActionFocus.current = true; setIndex(current => current - 1); }}><ArrowLeft size={15} /><span>Anterior</span></button>
        <button ref={actionRef} className="primary-button dialogue-next" onClick={complete ? advance : reveal}>{complete ? (last ? completionLabel : 'Continuar') : 'Mostrar todo'}<ArrowRight size={16} /></button>
      </div>} />
    </motion.div>
    <p className="dialogue-hint">Sin prisa. Puedes volver a leer cada mensaje.</p>
  </section>;
}
