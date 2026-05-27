import LayoutSelector from './LayoutSelector.jsx';
import ZonePanel from './ZonePanel.jsx';
import ColorPanel from './ColorPanel.jsx';
import styles from './Toolbar.module.css';

const RESET_ALL_PROMPT =
  'Reset every key to the default color and the case to black?\n\n' +
  'Layout, workspace, and saved slots are kept.';

export default function Toolbar({ state, actions }) {
  const handleResetAll = () => {
    if (window.confirm(RESET_ALL_PROMPT)) {
      actions.resetAll();
    }
  };

  return (
    <aside className={styles.toolbar}>
      <LayoutSelector current={state.layout} onSelect={actions.setLayout} />
      <ZonePanel onSelectZone={actions.selectZone} />
      <ColorPanel
        activeColor={state.activeColor}
        onColorChange={actions.setActiveColor}
        onApply={actions.applyColorToSelected}
        onResetSelected={actions.resetSelectedKeys}
        hasSelection={state.selectedKeys.length > 0}
      />
      <div className={styles.dangerSection}>
        <button
          type="button"
          className={styles.resetAllBtn}
          onClick={handleResetAll}
        >
          Reset All
        </button>
      </div>
    </aside>
  );
}
