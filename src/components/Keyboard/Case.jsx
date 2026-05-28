const PADDING = 8;

export default function Case({ width, height, caseColor, caseFinish, filterId }) {
  const x = -PADDING;
  const y = -PADDING;
  const caseW = width + PADDING * 2;
  const caseH = height + PADDING * 2;
  const isGloss = caseFinish === 'gloss';

  return (
    <g>
      <defs>
        {/* Gloss reflection: white 8% at top fading out by ~40% down */}
        <linearGradient id="case-gloss-overlay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="40%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* Matte depth: transparent until the lower edge, then a soft shadow */}
        <linearGradient id="case-matte-shadow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="72%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      <rect
        x={x}
        y={y}
        width={caseW}
        height={caseH}
        rx={10}
        ry={10}
        fill={caseColor}
        filter={`url(#${filterId})`}
      />

      {isGloss ? (
        <>
          <rect
            x={x}
            y={y}
            width={caseW}
            height={caseH}
            rx={10}
            ry={10}
            fill="url(#case-gloss-overlay)"
            pointerEvents="none"
          />
          <line
            x1={x + 10}
            y1={y + 1}
            x2={x + caseW - 10}
            y2={y + 1}
            stroke="rgba(255,255,255,0.18)"
            strokeWidth={1}
            pointerEvents="none"
          />
        </>
      ) : (
        <rect
          x={x}
          y={y}
          width={caseW}
          height={caseH}
          rx={10}
          ry={10}
          fill="url(#case-matte-shadow)"
          pointerEvents="none"
        />
      )}
    </g>
  );
}

export function CaseFilter({ id, caseFinish }) {
  const isGloss = caseFinish === 'gloss';
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="140%">
      <feDropShadow
        dx={0}
        dy={isGloss ? 6 : 4}
        stdDeviation={isGloss ? 16 : 12}
        floodColor="#000"
        floodOpacity={isGloss ? 0.6 : 0.4}
      />
    </filter>
  );
}
