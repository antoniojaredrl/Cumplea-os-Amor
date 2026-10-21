import { useEffect, useReducer, useState } from 'react';
import { STORAGE_KEY, normalizeProgress, progressReducer } from './progress.js';
import { ProgressContext } from './progress-context.js';

function readProgress() {
  try { return normalizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY))); }
  catch { return normalizeProgress(null); }
}
export function ProgressProvider({ children }) {
  const [progress, dispatch] = useReducer(progressReducer, null, readProgress);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); setStorageError(false); }
    catch { setStorageError(true); }
  }, [progress]);
  return <ProgressContext.Provider value={{ progress, dispatch, storageError }}>{children}</ProgressContext.Provider>;
}
