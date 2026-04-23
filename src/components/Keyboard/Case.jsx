const PADDING = 8;

export default function Case({ width, height, caseColor, caseFinish, filterId }) {
  const caseW = width + PADDING * 2;
  const caseH = height + PADDING * 2;
  const isGloss = caseFinish === 'gloss';

  return (
    <g>
      <rect
        x={-PADDING}
        y={-PADDING}
        width={caseW}
        height={caseH}
        rx={10}
        ry={10}
        fill={caseColor}
        filter={`url(#${filterId})`}
      />
      {isGloss && (
        <rect
          x={-PADDING + 2}
          y={-PADDING}
          width={caseW - 4}
          height={4}
          rx={3}
          ry={3}
          fill="rgba(255,255,255,0.12)"
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
