// PNG export with color legend (V2 §8).
//
// Captures the keyboard DOM node with html2canvas, builds the per-zone color
// legend as an off-screen DOM element captured separately, then composites
// both onto a single canvas via drawImage and triggers a download. The final
// canvas is painted with the current --ws-bg value (never transparent).

import html2canvas from 'html2canvas';
import { ZONES } from '../data/zones.js';
import layouts from '../data/layouts/index.js';
import { DEFAULT_KEY_COLOR } from '../hooks/useColorway.js';

// Render at 2x for crisp output on hi-dpi displays.
const SCALE = 2;
const PAD = 24;
const BOARD_LEGEND_GAP = 16;

export async function exportPng(boardEl, state) {
  if (!boardEl) throw new Error('Keyboard not available');

  // boardEl is the wrapper div; html2canvas captures inline SVG reliably when
  // it is a descendant rather than the root node. Measure off the inner <svg>.
  const svgEl = boardEl.tagName.toLowerCase() === 'svg' ? boardEl : boardEl.querySelector('svg');
  if (!svgEl) throw new Error('Keyboard SVG not available');

  const cs = getComputedStyle(svgEl);
  const bg = cs.getPropertyValue('--ws-bg').trim() || '#111111';
  const labelColor = cs.getPropertyValue('--ws-label').trim() || '#e8e8e8';
  const borderColor =
    cs.getPropertyValue('--ws-key-border').trim() || 'rgba(255,255,255,0.12)';

  // 1. Capture the keyboard. Transparent background — the final composite paints
  //    --ws-bg. Transient selection rings are skipped via the data marker.
  const boardCanvas = await html2canvas(boardEl, {
    backgroundColor: null,
    scale: SCALE,
    logging: false,
    ignoreElements: (el) =>
      typeof el.hasAttribute === 'function' && el.hasAttribute('data-selection-ring'),
  });

  // 2. Build the legend off-screen and capture it on its own.
  const boardWidthPx = parseFloat(svgEl.getAttribute('width'));
  const legendEl = buildLegendElement(state, { labelColor, borderColor, boardWidthPx });
  document.body.appendChild(legendEl);
  let legendCanvas;
  try {
    legendCanvas = await html2canvas(legendEl, {
      backgroundColor: null,
      scale: SCALE,
      logging: false,
    });
  } finally {
    legendEl.remove();
  }

  // 3. Composite board + legend onto one canvas over the workspace background.
  const pad = PAD * SCALE;
  const gap = BOARD_LEGEND_GAP * SCALE;
  const contentW = Math.max(boardCanvas.width, legendCanvas.width);

  const out = document.createElement('canvas');
  out.width = contentW + pad * 2;
  out.height = pad + boardCanvas.height + gap + legendCanvas.height + pad;

  const ctx = out.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(boardCanvas, pad, pad);
  ctx.drawImage(legendCanvas, pad, pad + boardCanvas.height + gap);

  const url = out.toDataURL('image/png');
  triggerDownload(url, `${slugify(state.colorwayName)}-${state.layout}.png`);
}

// ── Legend ───────────────────────────────────────────────────────────────

// One entry per zone present in the layout, each with the unique colors used in
// that zone in first-seen order, ordered by the ZONES declaration.
function collectZones(layout, keyColors) {
  const keys = layouts[layout] ?? [];
  const byZone = new Map();
  for (const k of keys) {
    const color = (keyColors[k.id] ?? DEFAULT_KEY_COLOR).toLowerCase();
    if (!byZone.has(k.zone)) byZone.set(k.zone, []);
    const colors = byZone.get(k.zone);
    if (!colors.includes(color)) colors.push(color);
  }
  const result = [];
  for (const zoneKey of Object.keys(ZONES)) {
    if (byZone.has(zoneKey)) {
      result.push({ label: ZONES[zoneKey].label, colors: byZone.get(zoneKey) });
    }
  }
  return result;
}

// Build the off-screen legend DOM. Constrained to the board width so swatch
// rows wrap to roughly the same footprint as the keyboard above them.
function buildLegendElement(state, { labelColor, borderColor, boardWidthPx }) {
  const zones = collectZones(state.layout, state.keyColors);

  const root = document.createElement('div');
  Object.assign(root.style, {
    position: 'absolute',
    left: '-9999px',
    top: '0',
    width: `${boardWidthPx}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'transparent',
  });

  for (const zone of zones) {
    const block = document.createElement('div');
    Object.assign(block.style, { display: 'flex', flexDirection: 'column', gap: '8px' });

    const label = document.createElement('div');
    label.textContent = zone.label;
    Object.assign(label.style, { color: labelColor, fontWeight: '600', fontSize: '14px' });
    block.appendChild(label);

    const row = document.createElement('div');
    Object.assign(row.style, { display: 'flex', flexWrap: 'wrap', gap: '14px' });

    for (const color of zone.colors) {
      const item = document.createElement('div');
      Object.assign(item.style, {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      });

      const swatch = document.createElement('div');
      Object.assign(swatch.style, {
        width: '20px',
        height: '20px',
        background: color,
        border: `1px solid ${borderColor}`,
        borderRadius: '4px',
        boxSizing: 'border-box',
      });

      const hex = document.createElement('div');
      hex.textContent = color.toUpperCase();
      Object.assign(hex.style, {
        fontSize: '11px',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        color: labelColor,
      });

      item.appendChild(swatch);
      item.appendChild(hex);
      row.appendChild(item);
    }

    block.appendChild(row);
    root.appendChild(block);
  }

  return root;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function slugify(name) {
  const slug = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'colorway';
}
