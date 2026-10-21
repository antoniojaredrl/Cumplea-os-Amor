import test from 'node:test';
import assert from 'node:assert/strict';
import { canNavigate, getNextStationId, getResumeScene, getStationStatus, initialProgress, normalizeProgress, progressReducer, STATION_IDS } from '../src/state/progress.js';
import { completeStation } from './helpers.js';

test('rechaza datos inválidos y rutas bloqueadas al recuperar progreso', () => {
  assert.deepEqual(normalizeProgress(null), initialProgress);
  assert.deepEqual(normalizeProgress({ version: 99 }), initialProgress);
  assert.equal(normalizeProgress({ version: 1, scene: 'gift', completed: [] }).scene, 'invitation');
  assert.deepEqual(normalizeProgress({ version: 1, completed: ['birthday', 'memories'] }).completed, ['memories']);
});
test('las recompensas requieren orden y no pueden duplicarse', () => {
  assert.equal(progressReducer(initialProgress, { type: 'COMPLETE', id: 'stars' }), initialProgress);
  const next = completeStation(initialProgress, 'memories');
  assert.deepEqual(next.completed, ['memories']);
  assert.equal(progressReducer(next, { type: 'COMPLETE', id: 'memories' }), next);
});
test('la quinta estación desbloquea el regalo y reiniciar conserva su acceso', () => {
  let state = initialProgress;
  for (const id of STATION_IDS) state = completeStation(state, id);
  assert.equal(state.scene, 'constellation');
  assert.equal(state.giftUnlocked, true);
  const reset = progressReducer(state, { type: 'RESET' });
  assert.deepEqual(reset.completed, []);
  assert.equal(reset.giftUnlocked, true);
  assert.equal(progressReducer(reset, { type: 'NAVIGATE', scene: 'gift' }).scene, 'gift');
});
test('recupera un progreso parcial válido y restringe saltos de escena', () => {
  const state = normalizeProgress({ version: 1, scene: 'laboratory', completed: ['memories', 'memories'], giftUnlocked: false });
  assert.deepEqual(state.completed, ['memories']);
  assert.equal(state.scene, 'laboratory');
  assert.equal(progressReducer(state, { type: 'NAVIGATE', scene: 'stars' }), state);
});

test('el mapa desbloquea una sola estación cada vez y conserva las completadas', () => {
  let state = progressReducer(initialProgress, { type: 'NAVIGATE', scene: 'map' });
  for (let count = 0; count <= 5; count++) {
    const statuses = STATION_IDS.map(id => getStationStatus(state, id));
    assert.equal(statuses.filter(status => status === 'completed').length, count);
    assert.equal(statuses.filter(status => status === 'available').length, count === 5 ? 0 : 1);
    assert.equal(getNextStationId(state), STATION_IDS[count] ?? null);
    for (let index = count + 1; index < 5; index++) {
      assert.equal(canNavigate(state, STATION_IDS[index]), false);
      assert.equal(progressReducer(state, { type: 'NAVIGATE', scene: STATION_IDS[index] }), state);
    }
    assert.equal(canNavigate(state, 'constellation'), count === 5);
    if (count < 5) state = completeStation(state, STATION_IDS[count]);
  }
});

test('volver a la invitación permite reanudar la última escena sin perder estrellas', () => {
  let state = completeStation(initialProgress, 'memories');
  state = progressReducer(state, { type: 'NAVIGATE', scene: 'laboratory' });
  state = progressReducer(state, { type: 'NAVIGATE', scene: 'invitation' });
  assert.equal(state.started, true);
  assert.equal(getResumeScene(state), 'laboratory');
  const restored = normalizeProgress(JSON.parse(JSON.stringify(state)));
  assert.deepEqual(restored, state);
  const resumed = progressReducer(restored, { type: 'RESUME' });
  assert.equal(resumed.scene, 'laboratory');
  assert.deepEqual(resumed.completed, ['memories']);
});

test('las partidas de fases anteriores se migran y no restauran destinos bloqueados', () => {
  const legacy = normalizeProgress({ version: 1, scene: 'memories', completed: [], giftUnlocked: false });
  assert.equal(legacy.started, true);
  assert.equal(legacy.resumeScene, 'memories');
  const invalidResume = normalizeProgress({ version: 1, scene: 'map', completed: [], resumeScene: 'stars' });
  assert.equal(invalidResume.resumeScene, 'map');
  assert.equal(getStationStatus(invalidResume, 'unknown'), 'locked');
  assert.equal(canNavigate(invalidResume, 'gift'), false);
});

test('reiniciar borra la reanudación pero conserva el regalo incluso tras recargar', () => {
  let state = initialProgress;
  for (const id of STATION_IDS) state = completeStation(state, id);
  const reset = normalizeProgress(progressReducer(state, { type: 'RESET' }));
  assert.equal(reset.started, false);
  assert.equal(reset.resumeScene, 'map');
  assert.equal(reset.scene, 'invitation');
  assert.deepEqual(reset.completed, []);
  assert.equal(reset.giftUnlocked, true);
  assert.equal(getStationStatus(reset, 'memories'), 'available');
  assert.equal(progressReducer(reset, { type: 'NAVIGATE', scene: 'gift' }).scene, 'gift');
});
