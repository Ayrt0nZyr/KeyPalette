import styles from './Toolbar.module.css';

const LAYOUTS = [
  { key: '60', label: '60%' },
  { key: '65', label: '65%' },
  { key: '75', label: '75%' },
  { key: 'tkl', label: 'TKL' },
  { key: 'full', label: 'Full' },
];

export default function LayoutSelector({ current, onSelect }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Layout</h3>
      <div className={styles.buttonGroup}>
        {LAYOUTS.map(({ key, label }) => (
          <button
            key={key}
            className={`${styles.btn} ${current === key ? styles.btnActive : ''}`}
            onClick={() => onSelect(key)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
