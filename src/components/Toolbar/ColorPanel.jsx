import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, isValidHex } from '../../utils/colorUtils.js';
import styles from './Toolbar.module.css';

export default function ColorPanel({
  activeColor,
  onColorChange,
  onApply,
  onResetSelected,
  hasSelection,
  colorHistory = [],
  onClearHistory,
}) {
  // Mixed selection (V2 §10): activeColor is null when the selected keys hold
  // differing colors. The picker/inputs fall back to a neutral color so they
  // don't parse null; picking anything calls onColorChange, which clears the
  // mixed state, after which Apply sets every selected key uniformly.
  const isMixed = activeColor === null;
  const displayColor = activeColor ?? '#e0e0e0';
  const [hexInput, setHexInput] = useState(displayColor);
  const rgb = hexToRgb(displayColor);
  const hsl = rgbToHsl(rgb);

  useEffect(() => {
    setHexInput(displayColor);
  }, [displayColor]);

  const handleHexInput = (value) => {
    setHexInput(value);
    if (isValidHex(value)) {
      onColorChange(value.toLowerCase());
    }
  };

  const handleRgbChange = (channel, raw) => {
    const v = Math.max(0, Math.min(255, parseInt(raw, 10) || 0));
    onColorChange(rgbToHex({ ...rgb, [channel]: v }));
  };

  const handleHslChange = (channel, raw) => {
    const max = channel === 'h' ? 360 : 100;
    const v = Math.max(0, Math.min(max, parseInt(raw, 10) || 0));
    const newHsl = { ...hsl, [channel]: v };
    onColorChange(rgbToHex(hslToRgb(newHsl)));
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Color</h3>
      {isMixed ? (
        <>
          <div className={styles.mixedSwatch} aria-hidden="true" />
          <p className={styles.mixedNote}>Multiple colors — pick to override all</p>
        </>
      ) : (
        <div className={styles.currentSwatch} style={{ background: displayColor }} />
      )}
      <HexColorPicker color={displayColor} onChange={onColorChange} />

      {colorHistory.length > 0 && (
        <div className={styles.history}>
          <div className={styles.historyHeader}>
            <span className={styles.historyLabel}>Recent</span>
            <button
              type="button"
              className={styles.historyClear}
              onClick={onClearHistory}
            >
              Clear
            </button>
          </div>
          <div className={styles.historyStrip}>
            {colorHistory.map((hex) => (
              <button
                key={hex}
                type="button"
                className={styles.historySwatch}
                style={{ background: hex }}
                title={hex}
                aria-label={`Use color ${hex}`}
                onClick={() => onColorChange(hex)}
              />
            ))}
          </div>
        </div>
      )}

      <div className={styles.colorInputs}>
        <label className={styles.colorField}>
          <span>Hex</span>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => handleHexInput(e.target.value)}
            maxLength={7}
            className={styles.input}
          />
        </label>

        <div className={styles.colorRow}>
          {['r', 'g', 'b'].map((ch) => (
            <label key={ch} className={styles.colorField}>
              <span>{ch.toUpperCase()}</span>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb[ch]}
                onChange={(e) => handleRgbChange(ch, e.target.value)}
                className={styles.input}
              />
            </label>
          ))}
        </div>

        <div className={styles.colorRow}>
          {[
            { ch: 'h', max: 360 },
            { ch: 's', max: 100 },
            { ch: 'l', max: 100 },
          ].map(({ ch, max }) => (
            <label key={ch} className={styles.colorField}>
              <span>{ch.toUpperCase()}</span>
              <input
                type="number"
                min={0}
                max={max}
                value={hsl[ch]}
                onChange={(e) => handleHslChange(ch, e.target.value)}
                className={styles.input}
              />
            </label>
          ))}
        </div>
      </div>

      <div className={styles.actionRow}>
        <button
          className={`${styles.btn} ${styles.applyBtn}`}
          onClick={onApply}
          disabled={!hasSelection}
        >
          Apply to Selected
        </button>
        <button
          className={styles.resetSelectedBtn}
          onClick={onResetSelected}
          disabled={!hasSelection}
          title="Reset selected keys to default color"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
