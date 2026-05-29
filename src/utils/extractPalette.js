import { rgbToHex } from './colorUtils.js';

// Pure, dependency-free dominant-color extraction.
//
// Approach (see V2.md section 7): draw the image into a small 100x100 canvas,
// bin every pixel into an 8-levels-per-channel grid (512 possible bins), rank
// the bins by how many pixels landed in them, average each bin to a
// representative color, then greedily drop near-duplicates so the returned
// swatches read as visually distinct.

const SAMPLE_SIZE = 100;
const LEVELS = 8; // bins per channel → 8 * 8 * 8 = 512 possible bins
const STEP = 256 / LEVELS; // 32
const MIN_COLORS = 6;
const MAX_COLORS = 8;
const ALPHA_CUTOFF = 125; // ignore mostly-transparent pixels
// Squared Euclidean distance in RGB space below which two colors are treated
// as duplicates (≈48 per-channel). Relaxed automatically if it leaves too few.
const MIN_DISTANCE_SQ = 48 * 48;

export async function extractPalette(imageFile) {
  const img = await loadImage(imageFile);

  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  const { data } = ctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  // bin key → accumulated pixel count and channel sums (for averaging)
  const bins = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < ALPHA_CUTOFF) continue;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const key =
      (Math.floor(r / STEP) << 6) | (Math.floor(g / STEP) << 3) | Math.floor(b / STEP);
    const bin = bins.get(key);
    if (bin) {
      bin.count++;
      bin.r += r;
      bin.g += g;
      bin.b += b;
    } else {
      bins.set(key, { count: 1, r, g, b });
    }
  }

  const ranked = [...bins.values()]
    .sort((a, b) => b.count - a.count)
    .map((bin) => ({
      r: Math.round(bin.r / bin.count),
      g: Math.round(bin.g / bin.count),
      b: Math.round(bin.b / bin.count),
    }));

  // Greedily keep the most popular colors that are far enough apart. If the
  // image is nearly flat and that leaves fewer than MIN_COLORS, relax the
  // threshold until we run out of distinct bins.
  let threshold = MIN_DISTANCE_SQ;
  let chosen = dedupe(ranked, threshold);
  while (chosen.length < MIN_COLORS && threshold > 0) {
    threshold = Math.floor(threshold / 2);
    chosen = dedupe(ranked, threshold);
  }

  return chosen.slice(0, MAX_COLORS).map(rgbToHex);
}

function dedupe(colors, thresholdSq) {
  const out = [];
  for (const c of colors) {
    if (out.every((k) => colorDistanceSq(c, k) >= thresholdSq)) {
      out.push(c);
    }
    if (out.length >= MAX_COLORS) break;
  }
  return out;
}

function colorDistanceSq(a, b) {
  const dr = a.r - b.r;
  const dg = a.g - b.g;
  const db = a.b - b.b;
  return dr * dr + dg * dg + db * db;
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not load image'));
    };
    img.src = url;
  });
}
