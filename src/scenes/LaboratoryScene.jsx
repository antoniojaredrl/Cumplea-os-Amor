import { useEffect, useRef } from 'react';
import { Check, FlaskConical, RotateCcw } from 'lucide-react';
import { getIngredients, activityCopy } from '../data/activities.js';
import { useProgress } from '../state/useProgress.js';
import ActivityShell, { CelebrationBits } from '../components/ActivityShell.jsx';
import ActivityGuide from '../components/ActivityGuide.jsx';
import LoveFlask from '../components/LoveFlask.jsx';

export default function LaboratoryScene({ station }) {
  const { progress, dispatch } = useProgress();
  const saved = progress.activities.laboratory;
  const resultRef = useRef(null);
  const wasMixed = useRef(saved.mixed);
  useEffect(() => {
    if (saved.mixed && !wasMixed.current) resultRef.current?.focus({ preventScroll: true });
    wasMixed.current = saved.mixed;
  }, [saved.mixed]);
  const ingredients = getIngredients();
  const full = ingredients.length > 0 && ingredients.length === saved.ingredients.length;
  const copy = activityCopy.laboratory;
  return <ActivityShell station={station} instruction={copy.instruction}>
    <div className="laboratory-layout"><div className="lab-workbench"><div className="lab-shelf" aria-hidden="true">{copy.palette.slice(0,4).map((color, i) => <span key={color} style={{ '--tube-color': color, '--i': i }} />)}</div><span className="lab-notebook-label">EXPERIMENTO N.º 01 · NOSOTROS</span><LoveFlask count={saved.ingredients.length} total={ingredients.length} mixed={saved.mixed} />{saved.mixed && <CelebrationBits />}<div className="lab-table" /><div className="lab-amount" role="status">{saved.ingredients.length} / {ingredients.length} ingredientes{saved.mixed ? ' · Reacción completada' : ''}</div></div>
      <div className="lab-controls"><h2>Una pizca de…</h2><div className="ingredient-grid">{ingredients.map((ingredient, index) => { const selected = saved.ingredients.includes(ingredient); return <button key={ingredient} className={`ingredient-button ${selected ? 'is-selected' : ''}`} aria-pressed={selected} disabled={saved.mixed} onClick={() => dispatch({ type: 'TOGGLE_INGREDIENT', item: ingredient })}><span className="ingredient-vial" style={{ '--vial-color': copy.palette[index % copy.palette.length] }} aria-hidden="true" /><span>{ingredient}</span>{selected && <Check size={14} />}</button>; })}</div><button className="primary-button mix-button" disabled={!full || saved.mixed} onClick={() => dispatch({ type: 'MIX_FORMULA' })}><FlaskConical size={17} />{copy.mixLabel}</button>{saved.ingredients.length > 0 && <button className="text-button lab-reset" onClick={() => dispatch({ type: 'RESET_LAB' })}><RotateCcw size={14} />{copy.resetLabel}</button>}</div></div>
    <ActivityGuide scientist title={copy.guideTitle} message={saved.mixed ? copy.mixedMessage : full ? copy.readyMessage : copy.guideMessage} expression={saved.mixed ? 'excited' : 'curious'} />
    {saved.mixed && <section className="formula-result" aria-label={copy.formulaTitle}><span>✧</span><h2 ref={resultRef} tabIndex={-1}>{copy.formulaTitle}</h2><p>{ingredients.join(' + ')} = {copy.formulaResult}</p><small>{copy.discovery}</small></section>}
  </ActivityShell>;
}
