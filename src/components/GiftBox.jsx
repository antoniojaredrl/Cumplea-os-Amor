import { Heart } from 'lucide-react';
import { adventure } from '../data/adventure.js';
import { finaleCopy } from '../data/finale.js';

export default function GiftBox({ onOpen, opening }) {
  return <button className={`gift-box-button ${opening ? 'is-opening' : ''}`} disabled={opening} onClick={onOpen} aria-label={`${finaleCopy.gift.openLabel}, para ${adventure.recipient}`}><span className="gift-box-illustration" aria-hidden="true"><span className="gift-box-top"><span className="gift-box-bow bow-left" /><span className="gift-box-bow bow-right" /><span className="gift-box-lid" /></span><span className="gift-box-base" /><span className="gift-box-ribbon" /><span className="gift-box-tag"><Heart size={17} fill="currentColor" /></span><span className="gift-box-shadow" /></span><span className="gift-box-label">{opening ? 'Abriendo tu regalo…' : finaleCopy.gift.openLabel} <Heart size={14} /></span></button>;
}
