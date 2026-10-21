import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import SceneShell from './components/SceneShell.jsx';
import Modal from './components/Modal.jsx';
import SceneTransition from './components/SceneTransition.jsx';
import AdventureOverview from './components/AdventureOverview.jsx';
import InvitationScene from './scenes/InvitationScene.jsx';
import MapScene from './scenes/MapScene.jsx';
import { adventure, stations } from './data/adventure.js';
import { useProgress } from './state/useProgress.js';

const BirthdayScene = lazy(() => import('./scenes/BirthdayScene.jsx'));
const StarsScene = lazy(() => import('./scenes/StarsScene.jsx'));
const ConstellationScene = lazy(() => import('./scenes/ConstellationScene.jsx'));
const GiftScene = lazy(() => import('./scenes/GiftScene.jsx'));
const MemoriesScene = lazy(() => import('./scenes/MemoriesScene.jsx'));
const LaboratoryScene = lazy(() => import('./scenes/LaboratoryScene.jsx'));
const GardenScene = lazy(() => import('./scenes/GardenScene.jsx'));

export default function App() {
  const [modal, setModal] = useState(null);
  const { progress, dispatch, storageError } = useProgress();
  const scene = progress.scene;
  const station = stations.find(item => item.id === scene);
  return <SceneShell onAbout={() => setModal('about')}>
    {storageError && <p className="storage-notice" role="status">Este navegador no permite guardar el progreso. Podrás disfrutar la aventura durante esta sesión.</p>}
    <AnimatePresence mode="wait" initial={false}>
      <SceneTransition key={scene}>
        <Suspense fallback={<main id="main" tabIndex={-1} className="scene-loading" role="status">Mochi está preparando la siguiente sorpresa…</main>}>
        {scene === 'invitation'
          ? <InvitationScene canResume={progress.started} onResume={() => dispatch({ type: 'RESUME' })} giftUnlocked={progress.giftUnlocked} onGift={() => dispatch({ type: 'NAVIGATE', scene: 'gift' })} onContinue={() => dispatch({ type: 'NAVIGATE', scene: 'map' })} onRoadmap={() => setModal('roadmap')} />
          : scene === 'map' ? <MapScene />
          : scene === 'memories' ? <MemoriesScene station={station} />
          : scene === 'laboratory' ? <LaboratoryScene station={station} />
          : scene === 'garden' ? <GardenScene station={station} />
          : scene === 'birthday' ? <BirthdayScene station={station} />
          : scene === 'stars' ? <StarsScene station={station} />
          : scene === 'constellation' ? <ConstellationScene />
          : <GiftScene />}
        </Suspense>
      </SceneTransition>
    </AnimatePresence>
    {modal && <Modal key={modal} title={modal === 'roadmap' ? 'Un caminito lleno de sorpresas' : adventure.subtitle} onClose={() => setModal(null)}>
      {modal === 'roadmap' && <><p>Cinco estaciones, cinco estrellas y un regalo al final del camino.</p><AdventureOverview /><div className="phase-note">Cada estación completada abre un nuevo camino. Al reunir las cinco estrellas, podrás descubrir tu regalo.</div></>}
      {modal === 'about' && <><p>Una aventura de cumpleaños para {adventure.recipient}, con Mochi como guía y cinco estrellas por reunir.</p><p>Descubre mensajes, crea una fórmula, abre las flores, pide un deseo e ilumina las estrellas. Tu avance se guarda en este navegador.</p><p>La música es opcional: actívala con el altavoz y páusala cuando quieras. La carta seguirá disponible después de completar la historia, incluso si vuelves a empezar.</p></>}
    </Modal>}
  </SceneShell>;
}
