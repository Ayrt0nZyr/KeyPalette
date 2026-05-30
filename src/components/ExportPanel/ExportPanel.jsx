import { useState } from 'react';
import { exportPng } from '../../utils/exportPng.js';
import styles from './ExportPanel.module.css';

export default function ExportPanel({ state, keyboardRef }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleExportPng = async () => {
    setError('');
    setBusy(true);
    try {
      await exportPng(keyboardRef.current, state);
    } catch (e) {
      console.error('PNG export failed:', e);
      setError(`PNG export failed: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Export</h3>
      <button
        type="button"
        className={styles.exportBtn}
        onClick={handleExportPng}
        disabled={busy}
      >
        {busy ? 'Exporting…' : 'Export PNG'}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
