import styles from './Keyboard/Keyboard.module.css';

export default function WorkspaceToggle({ workspace, onToggle }) {
  const next = workspace === 'dark' ? 'light' : 'dark';
  return (
    <button
      className={styles.workspaceToggle}
      onClick={() => onToggle(next)}
      aria-label={`Switch to ${next} mode`}
    >
      {workspace === 'dark' ? '\u2600' : '\u263E'}
    </button>
  );
}
