import { useEffect, useRef, useState } from 'react';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { ArrowRight, Check, Gift, Heart, LockKeyhole, Mail, Sparkles, Star } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import Mochi from '../components/Mochi.jsx';
import Modal from '../components/Modal.jsx';
import Dialogue from '../components/Dialogue.jsx';
import { getWelcomeDialogue } from '../data/dialogues.js';

const welcomeDialogue = getWelcomeDialogue();

function Flower({ className }) {
  return <svg className={className} viewBox="0 0 80 110" aria-hidden="true"><path d="M41 50v60m0-31q-31 0-27-20 23 0 27 20m0 14q29 0 27-20-24 0-27 20" fill="#b9d6ba" stroke="#90b597" strokeWidth="2"/><g fill="#eabacb" stroke="#dca9bb" strokeWidth="1"><ellipse cx="40" cy="25" rx="12" ry="19"/><ellipse cx="57" cy="36" rx="12" ry="19" transform="rotate(65 57 36)"/><ellipse cx="50" cy="54" rx="12" ry="19" transform="rotate(145 50 54)"/><ellipse cx="29" cy="54" rx="12" ry="19" transform="rotate(215 29 54)"/><ellipse cx="23" cy="35" rx="12" ry="19" transform="rotate(290 23 35)"/></g><circle cx="40" cy="39" r="12" fill="#f5d78e"/></svg>;
}

export default function InvitationScene({ onContinue, onRoadmap, canResume, onResume, giftUnlocked, onGift }) {
  const [stage, setStage] = useState('sealed');
  const [talking, setTalking] = useState(false);
  const invitationActionRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [scope, animate] = useAnimate();
  const opened = stage !== 'sealed';
  const busy = stage === 'opening' || stage === 'revealing';
  useEffect(() => {
    if (!busy) return;
    let cancelled = false;
    const animation = stage === 'opening'
      ? animate('.envelope-flap', { rotateX: [0, 180] }, { duration: reducedMotion ? 0 : .65 })
      : animate('.hero-mochi-reveal', { opacity: [0, 1], y: reducedMotion ? [0, 0] : [32, 0], scale: reducedMotion ? [1, 1] : [.9, 1] }, { duration: reducedMotion ? 0 : .55 });
    animation.then(() => {
      if (cancelled) return;
      if (stage === 'opening') setStage('revealing');
      else { setStage('opened'); setTalking(true); }
    });
    return () => { cancelled = true; animation.stop(); };
  }, [stage, busy, reducedMotion, animate]);
  function openInvitation() {
    if (stage === 'sealed') {
      if (reducedMotion) { setStage('opened'); setTalking(true); }
      else setStage('opening');
    }
    else if (stage === 'opened') setTalking(true);
  }
  function startAdventure() {
    setTalking(false);
    onContinue();
  }
  return <main id="main" tabIndex={-1}>
    <section className="invitation-layout" aria-labelledby="invitation-heading">
      <div className="invitation-copy">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <div className="occasion-pill"><span /> UNA AVENTURA CREADA SOLO PARA TI</div>
          <p className="hello">Hola, {adventure.recipient} <span className="little-heart">♡</span></p>
          <h1 id="invitation-heading">Hoy, la magia<br />lleva <span>tu nombre.<svg viewBox="0 0 300 15" aria-hidden="true"><path d="M3 9Q150-3 295 7M30 13Q160 3 270 12" /></svg></span></h1>
          <p className="intro">{adventure.invitation.description}</p>
          <button ref={invitationActionRef} className="primary-button" disabled={busy} onClick={openInvitation}>{busy ? adventure.invitation.openingLabel : opened ? adventure.invitation.talkLabel : adventure.invitation.openLabel} <ArrowRight size={18} /></button>
          <span className="sr-only" role="status">{busy ? adventure.invitation.openingLabel : ''}</span>
          <div className="private-note"><LockKeyhole size={13} /><span>Un rinconcito del universo, solo nuestro.</span></div>
          {canResume && <button className="text-button invitation-resume" onClick={onResume}>{adventure.invitation.resumeLabel}<ArrowRight size={15} /></button>}
          {giftUnlocked && <button className="text-button invitation-gift" onClick={onGift}><Gift size={15} />{adventure.map.giftLabel}</button>}
        </motion.div>
        <div className="chapter-note"><span className="chapter-number">01</span><span>Todo lo bonito empieza<br /><strong>con una pequeña sorpresa.</strong></span><span className="dotted-trail" aria-hidden="true">····· ♡</span></div>
      </div>
      <div ref={scope} className={`storybook invitation-storybook ${opened ? 'invitation-opened' : ''}`} aria-label="Un jardín mágico y una invitación secreta">
        <div className="paper-texture" />
        <span className="illustration-label"><Sparkles size={13} /> EL JARDÍN DE LAS SORPRESAS</span>
        <div className="cloud cloud-one" /><div className="cloud cloud-two" />
        <Star className="sky-star star-one" size={27} /><Star className="sky-star star-two" size={16} /><span className="sky-dot dot-one" /><span className="sky-dot dot-two" />
        <span className="floating-heart heart-one">♡</span><span className="floating-heart heart-two">♡</span>
        <div className="hill hill-back" /><div className="hill hill-front" /><div className="garden-path" />
        {(stage === 'revealing' || stage === 'opened') && <div className="hero-mochi-reveal" style={{ opacity: stage === 'revealing' ? 0 : 1 }}>
          <div className="mochi-speech">{adventure.invitation.arrivalGreeting} <Heart size={11} fill="currentColor" /></div>
          <Mochi className="hero-mochi" expression="excited" />
        </div>}
        <motion.button className={`envelope ${opened ? 'is-open' : ''}`} aria-label={opened ? `Escuchar a ${adventure.guide.name}` : `Abrir la carta para ${adventure.recipient}`} aria-expanded={opened} disabled={busy} onClick={openInvitation} animate={reducedMotion || opened ? { y: 0 } : { y: [0, -7, 0] }} transition={{ duration: reducedMotion || opened ? 0 : 3.2, repeat: reducedMotion || opened ? 0 : Infinity }} whileHover={reducedMotion ? undefined : { rotate: -5 }} whileTap={reducedMotion ? undefined : { scale: .97 }}>
          <span className="envelope-letter">{opened ? adventure.invitation.revealedLetter : adventure.invitation.envelopeName.replace('{name}', adventure.recipient)}<small>{opened ? adventure.invitation.revealedSignature : adventure.invitation.envelopeSignature}</small></span>
          <span className="envelope-flap" /><span className="envelope-front" /><span className="wax-seal"><Heart size={16} fill="currentColor" /></span><span className="envelope-addressee" aria-hidden="true">{adventure.invitation.envelopeName.replace('{name}', adventure.recipient)}</span>
        </motion.button>
        <Flower className="flower flower-left" /><Flower className="flower flower-right" />
        <div className="garden-grass grass-one"/><div className="garden-grass grass-two"/>
        <div className="letter-hint"><Mail size={13} /> {opened ? adventure.invitation.openedHint : adventure.invitation.sealedHint}</div>
        <span className="corner-sparkle">✧</span>
      </div>
    </section>
    <section className="adventure-preview" aria-labelledby="preview-heading">
      <div className="preview-heading"><span className="small-flower">✿</span><div><h2 id="preview-heading">Cinco estrellitas. Un montón de amor.</h2><p>Cada paso esconde algo especial.</p></div><button className="text-button" onClick={onRoadmap}>Un vistazo a la aventura <ArrowRight size={15} /></button></div>
      <div className="preview-items"><span><Heart size={18} /> Recuerdos que abrazan</span><span><Sparkles size={18} /> Un poquito de magia</span><span><Star size={18} /> Sorpresas por descubrir</span><span><Check size={17} /> A tu ritmo, sin prisa</span></div>
    </section>
    <p className="mochi-footnote"><PawMark /> {adventure.invitation.note}</p>
    {talking && <Modal title={adventure.invitation.welcomeTitle} returnFocusRef={invitationActionRef} onClose={() => setTalking(false)}><Dialogue messages={welcomeDialogue} completionLabel={adventure.invitation.startLabel} onComplete={startAdventure} /></Modal>}
  </main>;
}
function PawMark() { return <span aria-hidden="true">ฅ</span>; }
