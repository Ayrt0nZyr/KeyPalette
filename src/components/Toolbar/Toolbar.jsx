import LayoutSelector from './LayoutSelector.jsx';
import ZonePanel from './ZonePanel.jsx';
import ColorPanel from './ColorPanel.jsx';
import styles from './Toolbar.module.css';

export default function Toolbar({ state, actions }) {
  return (
    <aside className={styles.toolbar}>
      <LayoutSelector current={state.layout} onSelect={actions.setLayout} />
      <ZonePanel onSelectZone={actions.selectZone} />
      <ColorPanel
        activeColor={state.activeColor}
        onColorChange={actions.setActiveColor}
        onApply={actions.applyColorToSelected}
        hasSelection={state.selectedKeys.length > 0}
      />
    </aside>
  );
}
