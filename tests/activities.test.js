import test from 'node:test';
import assert from 'node:assert/strict';
import { activityCopy, getIngredients, getMemories, getReasons } from '../src/data/activities.js';
import { isActivityReady } from '../src/state/activities.js';
import { initialProgress, normalizeProgress, progressReducer } from '../src/state/progress.js';
import { completeStation, prepareActivity } from './helpers.js';

test('las estaciones jugables rechazan recompensas antes de cumplir su condición', () => {
  let state = progressReducer(initialProgress, { type: 'NAVIGATE', scene: 'memories' });
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'memories' }), state);
  state = completeStation(state, 'memories');
  state = progressReducer(state, { type: 'NAVIGATE', scene: 'laboratory' });
  for (const item of getIngredients()) state = progressReducer(state, { type: 'TOGGLE_INGREDIENT', item });
  assert.equal(isActivityReady('laboratory', state.activities), false);
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'laboratory' }), state);
  state = progressReducer(state, { type: 'MIX_FORMULA' });
  assert.equal(isActivityReady('laboratory', state.activities), true);
});

test('el álbum guarda mensajes únicos y la fotografía seleccionada entre recargas', () => {
  let state = progressReducer(initialProgress, { type: 'NAVIGATE', scene: 'memories' });
  const memories = getMemories();
  state = progressReducer(state, { type: 'REVEAL_MEMORY', item: memories[0].id });
  assert.equal(progressReducer(state, { type: 'REVEAL_MEMORY', item: memories[0].id }), state);
  assert.equal(progressReducer(state, { type: 'REVEAL_MEMORY', item: 'unknown' }), state);
  state = progressReducer(state, { type: 'SELECT_MEMORY', item: memories[1].id });
  const restored = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.activities.memories.revealed, [memories[0].id]);
  assert.equal(restored.activities.memories.currentId, memories[1].id);
  assert.equal(isActivityReady('memories', restored.activities), false);
});

test('no se altera una actividad desde otra escena y se filtra progreso bloqueado', () => {
  let state = progressReducer(initialProgress, { type: 'NAVIGATE', scene: 'map' });
  assert.equal(progressReducer(state, { type: 'REVEAL_MEMORY', item: getMemories()[0].id }), state);
  state = normalizeProgress({ ...state, activities: { version: 1, laboratory: { ingredients: getIngredients(), mixed: true }, garden: { discovered: getReasons() } } });
  assert.deepEqual(state.activities.laboratory.ingredients, []);
  assert.deepEqual(state.activities.garden.discovered, []);
});

test('el laboratorio permite retirar ingredientes y no reacciona con una mezcla incompleta', () => {
  let state = progressReducer(completeStation(initialProgress, 'memories'), { type: 'NAVIGATE', scene: 'laboratory' });
  const first = getIngredients()[0];
  state = progressReducer(state, { type: 'TOGGLE_INGREDIENT', item: first });
  assert.equal(progressReducer(state, { type: 'MIX_FORMULA' }), state);
  const restored = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored.activities.laboratory.ingredients, [first]);
  state = progressReducer(restored, { type: 'TOGGLE_INGREDIENT', item: first });
  assert.deepEqual(state.activities.laboratory.ingredients, []);
  state = prepareActivity(state, 'laboratory');
  assert.equal(state.activities.laboratory.mixed, true);
  assert.equal(progressReducer(state, { type: 'TOGGLE_INGREDIENT', item: first }), state);
  state = progressReducer(state, { type: 'RESET_LAB' });
  assert.equal(isActivityReady('laboratory', state.activities), false);
  assert.deepEqual(state.completed, ['memories']);
});

test('el jardín persiste cada flor y exige descubrirlas todas', () => {
  let state = completeStation(completeStation(initialProgress, 'memories'), 'laboratory');
  state = progressReducer(state, { type: 'NAVIGATE', scene: 'garden' });
  state = progressReducer(state, { type: 'DISCOVER_REASON', item: getReasons()[0] });
  assert.equal(progressReducer(state, { type: 'DISCOVER_REASON', item: getReasons()[0] }), state);
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'garden' }), state);
  state = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(state.activities.garden.discovered, [getReasons()[0]]);
  state = prepareActivity(state, 'garden');
  assert.equal(isActivityReady('garden', state.activities), true);
});

test('la estrella se guarda antes de cerrar su celebración y no se duplica en revisitas', () => {
  let state = prepareActivity(initialProgress, 'memories');
  state = progressReducer(state, { type: 'COMPLETE', id: 'memories', stay: true });
  assert.equal(state.scene, 'memories');
  assert.deepEqual(state.completed, ['memories']);
  state = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.equal(progressReducer(state, { type: 'COMPLETE', id: 'memories', stay: true }), state);
  assert.equal(state.completed.length, 1);
});

test('normaliza datos parciales inválidos, versiones antiguas y reinicio de actividades', () => {
  const previous = normalizeProgress({ version: 1, scene: 'map', completed: ['memories'] });
  assert.equal(previous.activities.version, 1);
  const malformed = normalizeProgress({ ...previous, activities: { version: 1, memories: { revealed: ['unknown', getMemories()[0].id, getMemories()[0].id], currentId: 'unknown' }, laboratory: { ingredients: [getIngredients()[0], 'unknown'], mixed: true } } });
  assert.deepEqual(malformed.activities.memories.revealed, [getMemories()[0].id]);
  assert.equal(malformed.activities.memories.currentId, null);
  assert.equal(malformed.activities.laboratory.mixed, false);
  const reset = progressReducer(malformed, { type: 'RESET' });
  assert.deepEqual(reset.activities, initialProgress.activities);
});

test('las configuraciones vacías o inválidas tienen una salida segura', () => {
  assert.ok(getMemories({ memories: [] }).every(item => item.illustrated));
  assert.ok(getMemories({ memories: [null, { id: 'bad' }] }).length > 0);
  assert.deepEqual(getIngredients({ ingredients: null }), []);
  assert.deepEqual(getReasons({ reasons: 'invalid' }), []);
  assert.ok(activityCopy.laboratory.palette.length >= 6);
});
