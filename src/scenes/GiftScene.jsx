import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, Heart, RotateCcw, Sparkles } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import { finaleCopy, getBirthdayLabel, getFinalLetter, getSurpriseUrl, getWishes, personalize } from '../data/finale.js';
import { useProgress } from '../state/useProgress.js';
import GiftBox from '../components/GiftBox.jsx';
import RestartDialog from '../components/RestartDialog.jsx';
import MemoryArtwork from '../components/MemoryArtwork.jsx';
import { CelebrationBits } from '../components/ActivityShell.jsx';

export default function GiftScene() {
  const { progress, dispatch } = useProgress();
  const [restartOpen, setRestartOpen] = useState(false);
  const [opening, setOpening] = useState(false);
  const [giftScope, animate] = useAnimate();
  const reducedMotion = useReducedMotion();
  const opened = progress.finale.giftOpened;
  const letter = getFinalLetter();
  const birthdayLabel = getBirthdayLabel();
  const wishes = getWishes();
  const wish = wishes.find(item => item.id === progress.finale.wishId);
  const surpriseUrl = getSurpriseUrl(adventure.surprise?.url);
  const copy = finaleCopy.gift;
  useEffect(() => {
    if (!opening) return;
    let cancelled = false;
    const animation = animate('.gift-box-top', { y: [0, -90], rotate: [0, -12], opacity: [1, 0] }, { duration: reducedMotion ? 0 : .7 });
    animation.then(() => { if (!cancelled) dispatch({ type: 'OPEN_GIFT' }); });
    return () => { cancelled = true; animation.stop(); };
  }, [opening, reducedMotion, animate, dispatch]);
  return <main id="main" className={`gift-scene ${opened ? 'gift-is-open' : ''}`} tabIndex={-1}><button className="text-button finale-back" onClick={() => dispatch({ type: 'NAVIGATE', scene: 'map' })}><ArrowLeft size={15} />{copy.backLabel}</button>
    <div className="finale-heading"><span className="occasion-pill">{copy.eyebrow}</span><h1>{copy.title}</h1><p>{opened ? `¡Feliz cumpleaños, ${adventure.recipient}!` : copy.instruction}</p></div>
    <AnimatePresence mode="wait" initial={false}>{!opened ? <motion.div ref={giftScope} key="box" className="gift-box-scene" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -30, scale: 1.06 }} transition={{ duration: reducedMotion ? 0 : .5 }}><GiftBox opening={opening} onOpen={() => { if (reducedMotion) dispatch({ type: 'OPEN_GIFT' }); else setOpening(true); }} /><p className="gift-whisper">Psst… esta cajita sabe guardar cosas bonitas.</p></motion.div> : <motion.div key="letter" initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .65 }} onAnimationComplete={() => document.getElementById('letter-heading')?.focus({ preventScroll: true })}>
      <article className="birthday-letter" aria-labelledby="letter-heading"><CelebrationBits /><div className="letter-seal" aria-hidden="true">{adventure.recipient.slice(0,1)}</div><span className="letter-eyebrow">{copy.letterEyebrow}</span><h2 id="letter-heading" tabIndex={-1}>{letter.title}</h2><span className="letter-recipient">Para {adventure.recipient}, con todo el corazón.{birthdayLabel && <time dateTime={adventure.birthday}> · {birthdayLabel}</time>}</span>{letter.photo && <div className="letter-photo"><MemoryArtwork key={letter.photo} memory={{ photo: letter.photo, title: `Una fotografía para ${adventure.recipient}` }} /></div>}<div className="letter-paragraphs">{letter.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="letter-signature"><span>{letter.signature}</span><Heart size={20} /></div></article>
      <details className="final-surprise"><summary><Sparkles size={18} />{copy.surpriseLabel}<span>+</span></summary><div className="surprise-content"><div className="wish-jar" aria-hidden="true"><span>♡</span><i>✧</i></div><h2>{personalize(adventure.surprise?.title || 'Un frasquito de deseos para ti')}</h2><p>{personalize(adventure.surprise?.message || 'Un poquito de cariño para acompañarte este año.')}</p>{wish && <p className="drawn-wish" role="status">{personalize(wish.text)}</p>}<button className="primary-button" onClick={() => dispatch({ type: 'DRAW_WISH' })}>{wish ? copy.anotherWishLabel : copy.drawWishLabel}<Sparkles size={15} /></button>{surpriseUrl && <a className="surprise-link" href={surpriseUrl} target="_blank" rel="noopener noreferrer">{copy.linkLabel}<ArrowRight size={15} /></a>}</div></details>
      <div className="gift-actions"><button className="text-button" onClick={() => dispatch({ type: 'NAVIGATE', scene: 'map' })}><ArrowLeft size={15} />{copy.backLabel}</button><button className="text-button" onClick={() => setRestartOpen(true)}><RotateCcw size={14} />{copy.replayLabel}</button></div>
    </motion.div>}</AnimatePresence>
    {restartOpen && <RestartDialog onClose={() => setRestartOpen(false)} />}
  </main>;
}
