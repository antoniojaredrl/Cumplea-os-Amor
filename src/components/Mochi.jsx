import { motion, useReducedMotion } from 'motion/react';
import { getMochiExpression } from '../data/mochi.js';
import { adventure } from '../data/adventure.js';

function Eyes({ expression }) {
  if (expression === 'love') return <g fill="#d5839f"><path d="M105 125c-10-14-21 1 0 15 21-14 10-29 0-15M190 125c-10-14-21 1 0 15 21-14 10-29 0-15" /></g>;
  if (expression === 'surprised' || expression === 'curious') return <g fill="#775850"><ellipse cx="111" cy="128" rx="6" ry={expression === 'surprised' ? 10 : 7} /><ellipse cx="190" cy="128" rx="6" ry={expression === 'surprised' ? 10 : 9} /><g fill="#fffdf8"><circle cx="113" cy="125" r="2" /><circle cx="192" cy="125" r="2" /></g></g>;
  if (expression === 'excited') return <g fill="#d4a951"><path d="m111 116 3 8 8 4-8 3-3 8-3-8-8-3 8-4ZM190 116l3 8 8 4-8 3-3 8-3-8-8-3 8-4Z" /></g>;
  if (expression === 'thinking') return <g fill="none" stroke="#775850" strokeWidth="4" strokeLinecap="round"><path d="m102 128 17 2m63 0 17-5m-98-10 13-4m70 1 12 4" /></g>;
  return <g fill="none" stroke="#775850" strokeWidth="4.5" strokeLinecap="round"><path d="M102 132q9-14 18 0M181 132q9-14 18 0" /></g>;
}

// Ilustración vectorial local: reemplazable por un recurso en public/media.
export default function Mochi({ expression = 'happy', className = '', costume }) {
  const pose = getMochiExpression(expression);
  const reducedMotion = useReducedMotion();
  return <motion.svg className={className} viewBox="0 0 300 300" role="img" aria-label={`${adventure.guide.name}, tu gatito guía, ${pose.label}${costume === 'scientist' ? ', con bata y gafas de científico' : ''}`} animate={reducedMotion ? { y: 0, rotate: 0 } : { y: pose.y, rotate: pose.rotate }} transition={reducedMotion ? { duration: 0 } : { duration: pose.duration, repeat: Infinity }}>
    <ellipse cx="153" cy="271" rx="90" ry="12" fill="#b6a29c" opacity=".12" />
    <path d="M217 234q62-14 46-50-13-14-19 3 10 20-32 20" fill="#ffedd9" stroke="#775850" strokeWidth="3.5" />
    <path d="M100 181q-22 36-13 75 13 19 31 2 27 18 61 0 18 17 32-1 10-39-14-76" fill="#fff5e8" stroke="#775850" strokeWidth="3.5" />
    <ellipse cx="151" cy="223" rx="32" ry="30" fill="#fffdf8" />
    <path d="m71 105 2-66q3-12 13-4l43 32q23-5 42 0l44-32q10-8 13 4l2 66c30 66-6 104-79 104S41 170 71 105Z" fill="#fff5e8" stroke="#775850" strokeWidth="3.5" strokeLinejoin="round" />
    <path d="m83 82 1-32 29 25M187 75l29-25 1 32" fill="#efb4bc" />
    <path d="M130 67q5 18 12 16M151 65q-1 17 6 18M170 68q-4 15 3 16" stroke="#e8d2b7" strokeWidth="7" strokeLinecap="round" />
    <ellipse cx="94" cy="145" rx="16" ry="9" fill="#f7b8bc" opacity=".75"/><ellipse cx="207" cy="145" rx="16" ry="9" fill="#f7b8bc" opacity=".75"/>
    <Eyes expression={expression} />
    <path d="m143 143 8 7 8-7q-8-7-16 0" fill="#c78a8e"/>
    {expression === 'surprised' ? <ellipse cx="151" cy="165" rx="6" ry="9" fill="#93656a" /> : expression === 'excited' || expression === 'celebrating' ? <><path d="M136 154q15 7 30 0-2 28-15 25-13 0-15-25" fill="#93656a" /><path d="M142 172q9-9 18 0-8 10-18 0" fill="#efb4bc" /></> : expression === 'thinking' ? <path d="M145 162q8-5 15 0" fill="none" stroke="#775850" strokeWidth="3" strokeLinecap="round" /> : <path d="M151 150v5q-8 13-16 0m16 0q8 13 16 0" fill="none" stroke="#775850" strokeWidth="3" strokeLinecap="round"/>}
    <path d="m70 141 15 4m-17 6 16 1m136-11 15-4m-14 15 16-1" stroke="#b89786" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="m145 192-24-13q-12 18 0 25l24-6m12-6 23-13q12 18 0 25l-23-6" fill="#d890ad" stroke="#b87593" strokeWidth="2"/><circle cx="151" cy="195" r="8" fill="#e9a7be"/>
    <path d="M96 218q21 14 33-1m44 0q13 15 33 0" fill="none" stroke="#775850" strokeWidth="3" strokeLinecap="round"/>
    <path d="m149 210 5 10 12 2-9 8 2 12-10-6-11 6 2-12-9-8 12-2Z" fill="#f4d485" stroke="#cda75f" strokeWidth="2"/>
    <path d="M46 73c-16-21-32 1 0 23 32-22 16-44 0-23" fill="#edb5cc"/><path d="m252 89 3 9 9 3-9 3-3 9-3-9-9-3 9-3Z" fill="#d6b7e5"/>
    {expression === 'curious' && <text x="246" y="151" fill="#b78faa" fontSize="35" fontFamily="Fredoka">?</text>}
    {expression === 'thinking' && <g fill="#d7c6e5"><circle cx="241" cy="139" r="4" /><circle cx="254" cy="123" r="6" /><circle cx="265" cy="102" r="9" /></g>}
    {expression === 'celebrating' && <g><path d="m122 57 29-48 29 48Z" fill="#e8d9ff" stroke="#b78faa" strokeWidth="2" /><path d="m136 34 29 10m-22-22 15 5" stroke="#d69eb6" strokeWidth="5" /><circle cx="151" cy="10" r="7" fill="#f1cc78" /><path d="m42 135 7 10m210 18-9 7M58 202l-8 7m193-7 8 9" stroke="#d69eb6" strokeWidth="4" strokeLinecap="round" /></g>}
    {costume === 'scientist' && <g><path d="m112 202-18 47q18 13 56 8 34 5 55-8l-18-47-24 13-12-11-13 11Z" fill="#fffdfb" stroke="#a7b7b5" strokeWidth="2" /><path d="m136 208 15 25 15-25m-15 25v23m23-29h18v12h-18Z" fill="none" stroke="#a7b7b5" strokeWidth="2" /><path d="m181 220 1 8" stroke="#b78faa" strokeWidth="4" /><rect x="92" y="111" width="42" height="32" rx="11" fill="#e6f7f222" stroke="#a3b5b4" strokeWidth="3" /><rect x="169" y="111" width="42" height="32" rx="11" fill="#e6f7f222" stroke="#a3b5b4" strokeWidth="3" /><path d="M134 123q17-9 35 0m-77-1-17-4m136 4 16-4" fill="none" stroke="#a3b5b4" strokeWidth="3" /></g>}
  </motion.svg>;
}
