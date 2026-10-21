import { Check, LockKeyhole } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { stationIcons } from './AdventureOverview.jsx';
import { adventure } from '../data/adventure.js';

export default function MapStation({ station, index, status, previousStation, onSelect }) {
  const reducedMotion = useReducedMotion();
  const Icon = stationIcons[station.icon];
  const locked = status === 'locked';
  const label = adventure.map.statusLabels[status];
  const lockReason = previousStation ? `${adventure.map.unlockPrefix} ${previousStation.short}` : label;
  return <li className={`map-station map-station-${index + 1} station-is-${status}`}>
    <motion.button className="map-station-control" disabled={locked} aria-label={`${station.title}. ${locked ? lockReason : label}`} onClick={() => onSelect(station.id)} whileHover={locked || reducedMotion ? undefined : { y: -5 }} whileTap={locked || reducedMotion ? undefined : { scale: .96 }}>
      <span className={`map-station-picture ${station.color}`}><Icon size={30} strokeWidth={1.4} aria-hidden="true" /><span className="map-station-count" aria-hidden="true">{locked ? <LockKeyhole size={11} /> : status === 'completed' ? <Check size={13} /> : index + 1}</span></span>
      <span className="map-station-title">{station.short}</span>
      <span className="map-station-status">{label}</span>
      {locked && <span className="station-lock-reason">{lockReason}</span>}
    </motion.button>
  </li>;
}
