import useColorway from './hooks/useColorway.js';
import Keyboard from './components/Keyboard/Keyboard.jsx';
import Toolbar from './components/Toolbar/Toolbar.jsx';
import WorkspaceToggle from './components/WorkspaceToggle.jsx';
import styles from './App.module.css';

export default function App() {
  const { state, actions } = useColorway();

  return (
    <div className={`${styles.app} ${state.workspace === 'dark' ? styles.dark : styles.light}`}>
      <WorkspaceToggle workspace={state.workspace} onToggle={actions.setWorkspace} />
      <Toolbar state={state} actions={actions} />
      <main className={styles.main}>
        <Keyboard state={state} actions={actions} />
      </main>
    </div>
  );
}
