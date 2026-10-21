import { motion, useReducedMotion } from 'motion/react';

export default function ReasonFlower({ opened, color }) {
  const reducedMotion = useReducedMotion();
  return <svg viewBox="0 0 140 190" className="reason-flower" aria-hidden="true"><ellipse cx="70" cy="181" rx="35" ry="5" fill="#aac59c44" /><path d="M70 79v97m0-42q-35 3-32-26 26 2 32 26m0 20q33-1 32-25-26 2-32 25" fill="#a9c69e" stroke="#86aa85" strokeWidth="2" /><motion.g style={{ transformOrigin: '70px 65px' }} initial={false} animate={{ scale: opened ? 1 : .52, rotate: opened ? 0 : -15 }} transition={{ duration: reducedMotion ? 0 : .5, type: 'tween' }} fill={color} stroke="#b992ab55" strokeWidth="1">{[0,60,120,180,240,300].map(angle => <ellipse key={angle} cx="70" cy="41" rx="19" ry="29" transform={`rotate(${angle} 70 65)`} />)}<circle cx="70" cy="65" r="20" fill="#f5dfa1" stroke="#d4ba7e" /><path d="M62 65q3-5 6 0m7 0q3-5 6 0m-13 8q4 4 8 0" stroke="#a7895e" fill="none" strokeWidth="2" strokeLinecap="round" /></motion.g>{opened && <path d="M113 85c-9-13-20 1 0 14 20-13 9-27 0-14" fill="#d89bb6" />}</svg>;
}
