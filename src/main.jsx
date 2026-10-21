import React from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'motion/react';
import './styles/fonts.css';
import AdventureErrorBoundary from './components/AdventureErrorBoundary.jsx';
import App from './App.jsx';
import { ProgressProvider } from './state/ProgressProvider.jsx';
import MusicProvider from './audio/MusicProvider.jsx';
import './styles/index.css';
import './styles/dialogue.css';
import './styles/invitation.css';
import './styles/map.css';
import './styles/activities.css';
import './styles/finale.css';
import './styles/accessibility.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><AdventureErrorBoundary><MotionConfig reducedMotion="user"><MusicProvider><ProgressProvider><App /></ProgressProvider></MusicProvider></MotionConfig></AdventureErrorBoundary></React.StrictMode>,
);
