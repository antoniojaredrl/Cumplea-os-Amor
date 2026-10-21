import { Camera, CakeSlice, FlaskConical, Flower2, Star } from 'lucide-react';
import { stations } from '../data/adventure.js';

export const stationIcons = { camera: Camera, cake: CakeSlice, flask: FlaskConical, flower: Flower2, star: Star };

export default function AdventureOverview() {
  return <ol className="station-list">{stations.map((station, index) => {
    const Icon = stationIcons[station.icon];
    return <li key={station.id}>
      <span className={`station-icon ${station.color}`}><Icon size={21} /></span>
      <div><h3>{station.title}</h3><p>{station.description}</p></div>
      <span className="station-number">0{index + 1}</span>
    </li>;
  })}</ol>;
}
