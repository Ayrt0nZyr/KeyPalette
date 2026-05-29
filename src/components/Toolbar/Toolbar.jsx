import LayoutSelector from './LayoutSelector.jsx';
import ZonePanel from './ZonePanel.jsx';
import ColorPanel from './ColorPanel.jsx';
import presets from '../../data/presets.js';
import { DEFAULT_KEY_COLOR } from '../../hooks/useColorway.js';
import styles from './Toolbar.module.css';

const RESET_ALL_PROMPT =
  'Reset every key to the default color and the case to black?\n\n' +
  'Layout, workspace, and saved slots are kept.';

const CASE_FINISHES = ['matte', 'gloss'];

export default function Toolbar({ state, actions, onExtractFromImage }) {
  const handleResetAll = () => {
    if (window.confirm(RESET_ALL_PROMPT)) {
      actions.resetAll();
    }
  };

  const handlePreset = (preset) => {
    const hasCustomColors = Object.values(state.keyColors).some(
      (c) => c !== DEFAULT_KEY_COLOR,
    );
    if (
      !hasCustomColors ||
      window.confirm(
        `Load the "${preset.name}" preset? This replaces your current key colors and case.`,
      )
    ) {
      actions.applyPreset(preset);
    }
  };

  return (
    <aside className={styles.toolbar}>
      <LayoutSelector current={state.layout} onSelect={actions.setLayout} />
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Presets</h3>
        <div className={styles.presetGroup}>
          {presets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              className={styles.presetPill}
              onClick={() => handlePreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      <ZonePanel onSelectZone={actions.selectZone} />
      <ColorPanel
        activeColor={state.activeColor}
        onColorChange={actions.setActiveColor}
        onApply={actions.applyColorToSelected}
        onResetSelected={actions.resetSelectedKeys}
        hasSelection={state.selectedKeys.length > 0}
        colorHistory={state.colorHistory}
        onClearHistory={actions.clearColorHistory}
      />
      <button
        type="button"
        className={styles.extractBtn}
        onClick={onExtractFromImage}
      >
        Extract from image
      </button>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Case</h3>
        <div className={styles.caseColorRow}>
          <input
            type="color"
            className={styles.caseSwatch}
            value={state.caseColor}
            onChange={(e) => actions.setCaseColor(e.target.value)}
            aria-label="Case color"
            title="Case color"
          />
          <span className={styles.caseHex}>{state.caseColor}</span>
        </div>
        <div className={styles.segmented} role="group" aria-label="Case finish">
          {CASE_FINISHES.map((finish) => (
            <button
              key={finish}
              type="button"
              className={`${styles.segmentBtn} ${state.caseFinish === finish ? styles.segmentBtnActive : ''}`}
              onClick={() => actions.setCaseFinish(finish)}
              aria-pressed={state.caseFinish === finish}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>
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
