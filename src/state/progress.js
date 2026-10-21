import { activityReducer, createActivities, isActivityReady, normalizeActivities, PLAYABLE_STATIONS } from './activities.js';
import { createFinale, finaleReducer, normalizeFinale } from './finale.js';

export const STORAGE_KEY = 'michiaventura.progress.v1';
export const STATION_IDS = ['memories', 'laboratory', 'garden', 'birthday', 'stars'];
export const initialProgress = { version: 1, scene: 'invitation', completed: [], giftUnlocked: false, started: false, resumeScene: 'map', activities: createActivities(), finale: createFinale() };
export const validScenes = ['invitation', 'map', ...STATION_IDS, 'constellation', 'gift'];

export function getStationStatus(progress, id) {
  const index = STATION_IDS.indexOf(id);
  if (index < 0) return 'locked';
  if (progress.completed.includes(id)) return 'completed';
  return index === progress.completed.length ? 'available' : 'locked';
}

export function getNextStationId(progress) {
  return STATION_IDS[progress.completed.length] ?? null;
}

export function canNavigate(progress, scene) {
  if (scene === 'invitation' || scene === 'map') return true;
  if (STATION_IDS.includes(scene)) return getStationStatus(progress, scene) !== 'locked';
  if (scene === 'constellation') return progress.completed.length === STATION_IDS.length;
  return scene === 'gift' && progress.giftUnlocked;
}

export function getResumeScene(progress) {
  return progress.resumeScene !== 'invitation' && canNavigate(progress, progress.resumeScene) ? progress.resumeScene : 'map';
}

export function normalizeProgress(value) {
  if (!value || value.version !== 1) return { ...initialProgress, completed: [], activities: createActivities(), finale: createFinale() };
  // Solo se recuperan estaciones completadas consecutivamente y sin duplicados.
  const completed = [];
  for (const id of STATION_IDS) {
    if (!Array.isArray(value.completed) || !value.completed.includes(id)) break;
    completed.push(id);
  }
  const giftUnlocked = value.giftUnlocked === true || completed.length === 5;
  const validated = { completed, giftUnlocked };
  const scene = canNavigate(validated, value.scene) ? value.scene : 'invitation';
  const started = value.started === true || completed.length > 0 || scene !== 'invitation';
  const resumeScene = value.resumeScene && value.resumeScene !== 'invitation' && canNavigate(validated, value.resumeScene)
    ? value.resumeScene : scene !== 'invitation' ? scene : 'map';
  const activities = normalizeActivities(value.activities, STATION_IDS.slice(0, Math.min(completed.length + 1, 5)));
  const finale = normalizeFinale(value.finale, completed, giftUnlocked);
  return { version: 1, scene, completed, giftUnlocked, started, resumeScene, activities, finale };
}

export function progressReducer(state, action) {
  if (action.type === 'RESET') return { ...initialProgress, completed: [], activities: createActivities(), giftUnlocked: state.giftUnlocked, finale: normalizeFinale(state.finale, [], state.giftUnlocked) };
  if (action.type === 'NAVIGATE') {
    if (!canNavigate(state, action.scene)) return state;
    return normalizeProgress({ ...state, scene: action.scene, started: state.started || action.scene !== 'invitation', resumeScene: action.scene === 'invitation' ? getResumeScene(state) : action.scene });
  }
  if (action.type === 'RESUME') return progressReducer(state, { type: 'NAVIGATE', scene: getResumeScene(state) });
  if (action.type === 'COMPLETE') {
    if (STATION_IDS[state.completed.length] !== action.id) return state;
    if (PLAYABLE_STATIONS.includes(action.id) && !isActivityReady(action.id, state.activities)) return state;
    const completed = [...state.completed, action.id];
    const scene = action.stay === true ? action.id : completed.length === 5 ? 'constellation' : 'map';
    return { ...state, completed, scene, resumeScene: scene, started: true, giftUnlocked: completed.length === 5 || state.giftUnlocked };
  }
  if (PLAYABLE_STATIONS.includes(state.scene) && canNavigate(state, state.scene)) {
    const activities = activityReducer(state.activities, action, state.scene);
    if (activities !== state.activities) return { ...state, activities };
  }
  return finaleReducer(state, action);
}

