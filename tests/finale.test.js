import test from 'node:test';
import assert from 'node:assert/strict';
import { adventure } from '../src/data/adventure.js';
import { candleIds, getBirthdayLabel, getFinalLetter, getSurpriseUrl, getWishes, starLights } from '../src/data/finale.js';
import { initialProgress, normalizeProgress, progressReducer, STATION_IDS } from '../src/state/progress.js';
import { isActivityReady } from '../src/state/activities.js';
import { completeStation, prepareActivity } from './helpers.js';

function completeThrough(count) {
  let state = initialProgress;
  for (const id of STATION_IDS.slice(0,count)) state = completeStation(state, id);
  return state;
}

test('el cumpleaños exige todas las velas y guarda apagados únicos', () => {
  let state = progressReducer(completeThrough(3), { type: 'NAVIGATE', scene: 'birthday' });
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'birthday' }), state);
  state = progressReducer(state, { type: 'EXTINGUISH_CANDLE', item: candleIds[0] });
  assert.equal(progressReducer(state, { type: 'EXTINGUISH_CANDLE', item: candleIds[0] }), state);
  assert.equal(progressReducer(state, { type: 'EXTINGUISH_CANDLE', item: 'unknown' }), state);
  state = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(state.activities.birthday.extinguished, [candleIds[0]]);
  assert.equal(isActivityReady('birthday', state.activities), false);
  state = prepareActivity(state, 'birthday');
  state = progressReducer(state, { type: 'COMPLETE', id: 'birthday', stay: true });
  assert.equal(state.completed.length, 4);
  state = progressReducer(state, { type: 'RELIGHT_CANDLES' });
  assert.deepEqual(state.activities.birthday.extinguished, []);
  assert.equal(state.completed.length, 4);
});

test('la quinta misión exige el orden de pistas y permite reanudar a mitad', () => {
  let state = progressReducer(completeThrough(4), { type: 'NAVIGATE', scene: 'stars' });
  assert.equal(progressReducer(state, { type: 'TOUCH_STAR', item: starLights[2].id }), state);
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'stars' }), state);
  state = progressReducer(state, { type: 'TOUCH_STAR', item: starLights[0].id });
  assert.equal(progressReducer(state, { type: 'TOUCH_STAR', item: starLights[0].id }), state);
  state = progressReducer(state, { type: 'TOUCH_STAR', item: starLights[1].id });
  state = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(state.activities.stars.found, starLights.slice(0,2).map(light => light.id));
  for (const light of starLights.slice(2)) state = progressReducer(state, { type: 'TOUCH_STAR', item: light.id });
  assert.equal(isActivityReady('stars', state.activities), true);
  state = progressReducer(state, { type: 'COMPLETE', id: 'stars' });
  assert.equal(state.scene, 'constellation');
  assert.equal(state.giftUnlocked, true);
});

test('los datos de velas y luces inválidos no fabrican una actividad completada', () => {
  const state = normalizeProgress({ ...completeThrough(4), activities: { version: 1, birthday: { extinguished: ['candle-1', 'candle-1', 'fake'] }, stars: { found: [starLights[0].id, starLights[3].id, starLights[1].id] } } });
  assert.deepEqual(state.activities.birthday.extinguished, ['candle-1']);
  assert.deepEqual(state.activities.stars.found, [starLights[0].id]);
  assert.equal(isActivityReady('stars', state.activities), false);
});

test('corazón, caja y deseos respetan sus escenas y el acceso al regalo', () => {
  assert.equal(progressReducer(initialProgress, { type: 'FORM_CONSTELLATION' }), initialProgress);
  assert.equal(progressReducer(initialProgress, { type: 'OPEN_GIFT' }), initialProgress);
  let state = completeThrough(5);
  assert.equal(progressReducer(state, { type: 'OPEN_GIFT' }), state);
  state = progressReducer(state, { type: 'FORM_CONSTELLATION' });
  assert.equal(state.finale.constellationFormed, true);
  state = progressReducer(state, { type: 'NAVIGATE', scene: 'gift' });
  assert.equal(progressReducer(state, { type: 'DRAW_WISH' }), state);
  state = progressReducer(state, { type: 'OPEN_GIFT' });
  assert.equal(state.finale.giftOpened, true);
  const wishes = getWishes();
  for (const wish of wishes) {
    state = progressReducer(state, { type: 'DRAW_WISH' });
    assert.equal(state.finale.wishId, wish.id);
  }
  state = progressReducer(state, { type: 'DRAW_WISH' });
  assert.equal(state.finale.wishId, wishes[0].id);
});

test('reiniciar y recargar conservan la carta abierta y permiten acceso directo', () => {
  let state = progressReducer(completeThrough(5), { type: 'NAVIGATE', scene: 'gift' });
  state = progressReducer(state, { type: 'OPEN_GIFT' });
  state = progressReducer(state, { type: 'DRAW_WISH' });
  const reset = normalizeProgress(JSON.parse(JSON.stringify(progressReducer(state, { type: 'RESET' }))));
  assert.deepEqual(reset.completed, []);
  assert.equal(reset.started, false);
  assert.equal(reset.giftUnlocked, true);
  assert.equal(reset.finale.giftOpened, true);
  assert.equal(reset.finale.wishId, getWishes()[0].id);
  assert.equal(reset.finale.constellationFormed, false);
  assert.equal(progressReducer(reset, { type: 'NAVIGATE', scene: 'gift' }).scene, 'gift');
});

test('las partidas antiguas y los finales incoherentes se normalizan sin perder estrellas', () => {
  const old = normalizeProgress({ version: 1, scene: 'birthday', completed: STATION_IDS.slice(0,3) });
  assert.equal(old.completed.length, 3);
  assert.deepEqual(old.activities.birthday.extinguished, []);
  assert.equal(old.finale.giftOpened, false);
  const invalid = normalizeProgress({ ...initialProgress, finale: { version: 1, constellationFormed: true, giftOpened: true, wishId: getWishes()[0].id } });
  assert.equal(invalid.finale.giftOpened, false);
  assert.equal(invalid.finale.constellationFormed, false);
  assert.equal(invalid.finale.wishId, null);
});

test('la carta personaliza el nombre y no queda vacía con datos ausentes', () => {
  const letter = getFinalLetter({ ...adventure, recipient: 'Ana', finalLetter: { paragraphs: [] } });
  assert.ok(letter.paragraphs[0].includes('Ana'));
  assert.ok(letter.paragraphs.length > 0);
  assert.ok(getWishes({ surprise: { wishes: [null, { id: 'bad' }] } }).length > 0);
  assert.equal(getBirthdayLabel({ birthday: '2026-02-30' }), null);
  assert.equal(getBirthdayLabel({ birthday: null }), null);
  assert.ok(getBirthdayLabel({ birthday: '2026-03-15' }).includes('marzo'));
});

test('el enlace opcional de la sorpresa solo permite destinos web o locales válidos', () => {
  assert.equal(getSurpriseUrl('javascript:alert(1)'), null);
  assert.equal(getSurpriseUrl('data:text/html,test'), null);
  assert.equal(getSurpriseUrl('//example.com'), null);
  assert.equal(getSurpriseUrl('/\\example.com'), null);
  assert.equal(getSurpriseUrl(null), null);
  assert.equal(getSurpriseUrl('/media/sorpresa.pdf'), '/media/sorpresa.pdf');
  assert.equal(getSurpriseUrl('https://example.com/sorpresa'), 'https://example.com/sorpresa');
});
