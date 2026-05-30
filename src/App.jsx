import { useRef, useState } from 'react';
import useColorway from './hooks/useColorway.js';
import Keyboard from './components/Keyboard/Keyboard.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import WorkspaceToggle from './components/WorkspaceToggle.jsx';
import ImagePaletteModal from './components/ImagePaletteModal/ImagePaletteModal.jsx';
import styles from './App.module.css';

export default function App() {
  const { state, actions } = useColorway();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const keyboardRef = useRef(null);

  return (
    <div className={styles.app} data-workspace={state.workspace}>
      <WorkspaceToggle workspace={state.workspace} onToggle={actions.setWorkspace} />
      <Toolbar
        state={state}
        actions={actions}
        keyboardRef={keyboardRef}
        onExtractFromImage={() => setImageModalOpen(true)}
      />
      <main className={styles.main}>
        <Keyboard state={state} actions={actions} svgRef={keyboardRef} />
      </main>
      {imageModalOpen && (
        <ImagePaletteModal
          onSelectColor={(hex) => {
            actions.setActiveColor(hex);
            setImageModalOpen(false);
          }}
          onApplyAll={(hexes) => {
            actions.addColorsToHistory(hexes);
            setImageModalOpen(false);
          }}
          onClose={() => setImageModalOpen(false)}
        />
      )}
    </div>
  );
}
