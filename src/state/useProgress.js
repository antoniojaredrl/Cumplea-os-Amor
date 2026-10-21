import { useContext } from 'react';
import { ProgressContext } from './progress-context.js';

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress requiere ProgressProvider');
  return context;
}
