import { getIngredients, getMemories, getReasons } from '../data/activities.js';
import { candleIds, starLights } from '../data/finale.js';

export const PLAYABLE_STATIONS = ['memories', 'laboratory', 'garden', 'birthday', 'stars'];
export function createActivities() {
  return { version: 1, memories: { revealed: [], currentId: null }, laboratory: { ingredients: [], mixed: false }, garden: { discovered: [] }, birthday: { extinguished: [] }, stars: { found: [] } };
}

function validSubset(value, allowed) {
  return Array.isArray(value) ? [...new Set(value.filter(item => allowed.includes(item)))] : [];
}

export function normalizeActivities(value, accessibleIds) {
  const result = createActivities();
  if (!value || value.version !== 1) return result;
  if (accessibleIds.includes('memories')) {
    const ids = getMemories().map(item => item.id);
    result.memories.revealed = validSubset(value.memories?.revealed, ids);
    result.memories.currentId = ids.includes(value.memories?.currentId) ? value.memories.currentId : null;
  }
  if (accessibleIds.includes('laboratory')) {
    const ingredients = getIngredients();
    result.laboratory.ingredients = validSubset(value.laboratory?.ingredients, ingredients);
    result.laboratory.mixed = value.laboratory?.mixed === true && ingredients.length > 0 && result.laboratory.ingredients.length === ingredients.length;
  }
  if (accessibleIds.includes('garden')) result.garden.discovered = validSubset(value.garden?.discovered, getReasons());
  if (accessibleIds.includes('birthday')) result.birthday.extinguished = validSubset(value.birthday?.extinguished, candleIds);
  if (accessibleIds.includes('stars')) {
    const found = Array.isArray(value.stars?.found) ? value.stars.found : [];
    for (const light of starLights) {
      if (found[result.stars.found.length] !== light.id) break;
      result.stars.found.push(light.id);
    }
  }
  return result;
}

export function isActivityReady(id, activities) {
  if (!activities) return false;
  if (id === 'memories') return getMemories().every(item => activities.memories.revealed.includes(item.id));
  if (id === 'laboratory') return getIngredients().length > 0 && activities.laboratory.mixed && getIngredients().every(item => activities.laboratory.ingredients.includes(item));
  if (id === 'garden') return getReasons().length > 0 && getReasons().every(item => activities.garden.discovered.includes(item));
  if (id === 'birthday') return candleIds.every(item => activities.birthday.extinguished.includes(item));
  if (id === 'stars') return starLights.every((item, index) => activities.stars.found[index] === item.id);
  return false;
}

// No hay acceso a DOM ni almacenamiento: estas reglas se prueban por separado.
export function activityReducer(activities, action, scene) {
  const next = { ...activities };
  if (scene === 'memories') {
    const ids = getMemories().map(item => item.id);
    if (!ids.includes(action.item)) return activities;
    if (action.type === 'SELECT_MEMORY') return { ...next, memories: { ...activities.memories, currentId: action.item } };
    if (action.type === 'REVEAL_MEMORY' && !activities.memories.revealed.includes(action.item)) return { ...next, memories: { currentId: action.item, revealed: [...activities.memories.revealed, action.item] } };
  }
  if (scene === 'laboratory') {
    if (action.type === 'RESET_LAB') return { ...next, laboratory: { ingredients: [], mixed: false } };
    if (action.type === 'TOGGLE_INGREDIENT' && !activities.laboratory.mixed && getIngredients().includes(action.item)) {
      const selected = activities.laboratory.ingredients;
      return { ...next, laboratory: { mixed: false, ingredients: selected.includes(action.item) ? selected.filter(item => item !== action.item) : [...selected, action.item] } };
    }
    if (action.type === 'MIX_FORMULA' && !activities.laboratory.mixed && getIngredients().length > 0 && getIngredients().every(item => activities.laboratory.ingredients.includes(item))) return { ...next, laboratory: { ...activities.laboratory, mixed: true } };
  }
  if (scene === 'garden' && action.type === 'DISCOVER_REASON' && getReasons().includes(action.item) && !activities.garden.discovered.includes(action.item)) return { ...next, garden: { discovered: [...activities.garden.discovered, action.item] } };
  if (scene === 'birthday') {
    if (action.type === 'EXTINGUISH_CANDLE' && candleIds.includes(action.item) && !activities.birthday.extinguished.includes(action.item)) return { ...next, birthday: { extinguished: [...activities.birthday.extinguished, action.item] } };
    if (action.type === 'RELIGHT_CANDLES') return { ...next, birthday: { extinguished: [] } };
  }
  if (scene === 'stars') {
    if (action.type === 'TOUCH_STAR' && starLights[activities.stars.found.length]?.id === action.item) return { ...next, stars: { found: [...activities.stars.found, action.item] } };
    if (action.type === 'RESET_STARS') return { ...next, stars: { found: [] } };
  }
  return activities;
}
