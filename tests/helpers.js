import { getIngredients, getMemories, getReasons } from '../src/data/activities.js';
import { progressReducer } from '../src/state/progress.js';
import { candleIds, starLights } from '../src/data/finale.js';

export function prepareActivity(state, id) {
  let next = progressReducer(state, { type: 'NAVIGATE', scene: id });
  if (id === 'memories') for (const memory of getMemories()) next = progressReducer(next, { type: 'REVEAL_MEMORY', item: memory.id });
  if (id === 'laboratory') {
    for (const ingredient of getIngredients()) next = progressReducer(next, { type: 'TOGGLE_INGREDIENT', item: ingredient });
    next = progressReducer(next, { type: 'MIX_FORMULA' });
  }
  if (id === 'garden') for (const reason of getReasons()) next = progressReducer(next, { type: 'DISCOVER_REASON', item: reason });
  if (id === 'birthday') for (const item of candleIds) next = progressReducer(next, { type: 'EXTINGUISH_CANDLE', item });
  if (id === 'stars') for (const light of starLights) next = progressReducer(next, { type: 'TOUCH_STAR', item: light.id });
  return next;
}

export function completeStation(state, id) {
  return progressReducer(prepareActivity(state, id), { type: 'COMPLETE', id });
}
