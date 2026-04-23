import { ZONES } from '../../data/zones.js';
import styles from './Toolbar.module.css';

const zoneEntries = Object.entries(ZONES);

export default function ZonePanel({ onSelectZone }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Select Zone</h3>
      <div className={styles.buttonGroup}>
        {zoneEntries.map(([key, { label }]) => (
          <button
            key={key}
            className={styles.btn}
            onClick={() => onSelectZone(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
