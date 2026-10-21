import { motion, useReducedMotion } from 'motion/react';

export default function SceneTransition({ children }) {
  const reducedMotion = useReducedMotion();
  return <motion.div
    className="scene-transition"
    initial="hidden" animate="visible" exit="leaving"
    variants={{ hidden: { opacity: 0, y: reducedMotion ? 0 : 14 }, visible: { opacity: 1, y: 0 }, leaving: { opacity: 0, y: reducedMotion ? 0 : -10 } }}
    transition={{ duration: reducedMotion ? 0 : .3, ease: 'easeInOut' }}
    onAnimationComplete={variant => {
      if (variant !== 'visible' || document.querySelector('dialog[open]')) return;
      document.getElementById('main')?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }}
  >{children}</motion.div>;
}
