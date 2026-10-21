import { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Gift, LockKeyhole, Map, RotateCcw, Sparkles, Star } from 'lucide-react';
import { adventure, stations } from '../data/adventure.js';
import MapStation from '../components/MapStation.jsx';
import Mochi from '../components/Mochi.jsx';
import RestartDialog from '../components/RestartDialog.jsx';
import { useProgress } from '../state/useProgress.js';
import { getNextStationId, getStationStatus } from '../state/progress.js';

export default function MapScene() {
  const { progress, dispatch } = useProgress();
  const [resetOpen, setResetOpen] = useState(false);
  const count = progress.completed.length;
  const nextId = getNextStationId(progress);
  const nextStation = stations.find(station => station.id === nextId);
  function navigate(scene) { dispatch({ type: 'NAVIGATE', scene }); }
  return <main id="main" className="map-intro interactive-map" tabIndex={-1}>
    <div className="map-welcome">
      <span className="occasion-pill"><Map size={12} /> {adventure.map.eyebrow}</span>
      <h1>{adventure.map.title}</h1>
      <p>{adventure.map.description}</p>
    </div>
    <div className="map-progress"><div><Star size={16} /><strong>{count} de 5 estrellas</strong><span>{count === 5 ? adventure.map.allCollected : adventure.map.progressHint}</span></div><progress value={count} max="5" aria-label="Estrellas reunidas" /></div>
    <section className="garden-map-preview" aria-label="Mapa interactivo de las cinco estaciones">
      <div className="map-cloud map-cloud-left" /><div className="map-cloud map-cloud-right" />
      <svg className="map-route" viewBox="0 0 1000 340" preserveAspectRatio="none" aria-hidden="true"><path d="M100 190C200 190 195 75 300 75S400 240 500 240 600 75 700 75 800 190 900 190" /></svg>
      <ol className="map-stations">{stations.map((station, index) => <MapStation key={station.id} station={station} index={index} status={getStationStatus(progress, station.id)} previousStation={stations[index - 1]} onSelect={navigate} />)}</ol>
      <span className="map-blossom blossom-one" aria-hidden="true">✿</span><span className="map-blossom blossom-two" aria-hidden="true">✿</span>
      <Star className="map-decoration-star" size={20} aria-hidden="true" />
      <span className="map-garden-label"><Sparkles size={12} /> {adventure.map.gardenLabel}</span>
    </section>
    <div className="map-legend" aria-label="Estados de las estaciones"><span><Sparkles size={13} />{adventure.map.statusLabels.available}</span><span><LockKeyhole size={13} />{adventure.map.statusLabels.locked}</span><span><Check size={13} />{adventure.map.statusLabels.completed}</span></div>
    <div className="map-guide-note"><Mochi className="map-guide-mochi" expression={count === 5 ? 'celebrating' : 'curious'} /><div><h2>{adventure.map.greeting.replace('{name}', adventure.recipient)}</h2><p>{count === 5 ? adventure.map.allCollected : adventure.map.message}</p><button className="primary-button map-next" onClick={() => navigate(nextId ?? 'constellation')}>{nextStation ? `${adventure.map.exploreLabel} ${nextStation.short}` : adventure.map.constellationLabel}<ArrowRight size={15} /></button></div></div>
    <div className="map-actions"><button className="text-button" onClick={() => navigate('invitation')}><ArrowLeft size={16} /> {adventure.map.returnLabel}</button>{progress.giftUnlocked && <button className="text-button" onClick={() => navigate('gift')}><Gift size={15} />{adventure.map.giftLabel}</button>}<button className="text-button" onClick={() => setResetOpen(true)}><RotateCcw size={14} />{adventure.map.resetLabel}</button></div>
    {resetOpen && <RestartDialog onClose={() => setResetOpen(false)} />}
  </main>;
}
