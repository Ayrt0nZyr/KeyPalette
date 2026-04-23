import styles from './Keyboard.module.css';

const GAP = 4;

export default function KeyCap({ keyData, unit, color, selected, onClick }) {
  const x = keyData.x * unit + GAP / 2;
  const y = keyData.y * unit + GAP / 2;
  const w = keyData.w * unit - GAP;
  const h = keyData.h * unit - GAP;

  const handleClick = (e) => {
    onClick(keyData.id, e.shiftKey);
  };

  return (
    <g className={styles.keycap} onClick={handleClick}>
      {selected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={w + 6}
          height={h + 6}
          rx={8}
          ry={8}
          className={styles.selectionRing}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={6}
        ry={6}
        fill={color}
        filter={selected ? 'url(#key-lift)' : 'url(#key-depth)'}
        className={styles.keyRect}
      />
      <text
        x={x + 6}
        y={y + h - 8}
        className={styles.keyLabel}
        fontSize={w < 40 ? 9 : 11}
      >
        {keyData.label}
      </text>
    </g>
  );
}
