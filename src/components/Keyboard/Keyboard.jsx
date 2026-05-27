import layouts from '../../data/layouts/index.js';
import KeyCap from './KeyCap.jsx';
import Case, { CaseFilter } from './Case.jsx';
import styles from './Keyboard.module.css';

const UNIT = 54;
const CASE_PADDING = 8;

export default function Keyboard({ state, actions }) {
  const keys = layouts[state.layout] ?? [];

  const maxX = Math.max(...keys.map((k) => k.x + k.w));
  const maxY = Math.max(...keys.map((k) => k.y + k.h));
  const boardW = maxX * UNIT;
  const boardH = maxY * UNIT;

  const svgW = boardW + CASE_PADDING * 2;
  const svgH = boardH + CASE_PADDING * 2;
  const filterId = 'case-shadow';

  return (
    <svg
      className={styles.keyboard}
      width={svgW}
      height={svgH}
      viewBox={`${-CASE_PADDING} ${-CASE_PADDING} ${svgW} ${svgH}`}
    >
      <defs>
        <CaseFilter id={filterId} caseFinish={state.caseFinish} />
        {/* Subtle inner shadow for keycap depth */}
        <filter id="key-depth" x="-5%" y="-5%" width="110%" height="115%">
          <feComponentTransfer in="SourceAlpha" result="shadow-alpha">
            <feFuncA type="linear" slope="0.15" />
          </feComponentTransfer>
          <feOffset dx={0} dy={1.5} in="shadow-alpha" result="offset" />
          <feGaussianBlur in="offset" stdDeviation={1} result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="in" result="inner" />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="inner" />
          </feMerge>
        </filter>
        {/* Lifted shadow for selected keys */}
        <filter id="key-lift" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx={0} dy={3} stdDeviation={4} floodColor="#000" floodOpacity={0.3} />
        </filter>
      </defs>
      <Case
        width={boardW}
        height={boardH}
        caseColor={state.caseColor}
        caseFinish={state.caseFinish}
        filterId={filterId}
      />
      {keys.map((k) => (
        <KeyCap
          key={k.id}
          keyData={k}
          unit={UNIT}
          color={state.keyColors[k.id] ?? '#e0e0e0'}
          selected={state.selectedKeys.includes(k.id)}
          onClick={actions.toggleKeySelected}
        />
      ))}
    </svg>
  );
}
