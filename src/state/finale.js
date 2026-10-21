import { getWishes } from '../data/finale.js';

export function createFinale() {
  return { version: 1, constellationFormed: false, giftOpened: false, wishId: null };
}

export function normalizeFinale(value, completed, giftUnlocked) {
  const result = createFinale();
  if (!value || value.version !== 1) return result;
  result.constellationFormed = completed.length === 5 && value.constellationFormed === true;
  result.giftOpened = giftUnlocked && value.giftOpened === true;
  result.wishId = result.giftOpened && getWishes().some(item => item.id === value.wishId) ? value.wishId : null;
  return result;
}

export function finaleReducer(state, action) {
  if (action.type === 'FORM_CONSTELLATION' && state.scene === 'constellation' && state.completed.length === 5 && !state.finale.constellationFormed) return { ...state, finale: { ...state.finale, constellationFormed: true } };
  if (action.type === 'OPEN_GIFT' && state.scene === 'gift' && state.giftUnlocked && !state.finale.giftOpened) return { ...state, finale: { ...state.finale, giftOpened: true } };
  if (action.type === 'DRAW_WISH' && state.scene === 'gift' && state.giftUnlocked && state.finale.giftOpened) {
    const wishes = getWishes();
    const index = wishes.findIndex(item => item.id === state.finale.wishId);
    return { ...state, finale: { ...state.finale, wishId: wishes[(index + 1) % wishes.length].id } };
  }
  return state;
}
