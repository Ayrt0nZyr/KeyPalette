# Keycap Colorizer

A lightweight, browser-based tool for designing and visualizing custom keycap colorways — before you buy.

No accounts. No installs. Just open it and start painting your board.

---

## What It Does

Pick a keyboard layout, click your keys, and assign colors however you like — individually, by zone, or sampled directly from an inspiration photo. The keyboard is the canvas.

- **Interactive SVG keyboard** — every key is clickable and colorable
- **Zone-based selection** — color all alphas, modifiers, or arrows at once
- **Image eyedropper** — upload any photo and sample colors straight from it
- **Case colorization** — match or contrast your case to the keycap scheme
- **Saved locally** — your colorways persist in the browser, no account needed
- **Export-ready** — download as PNG or share as a `.json` file

---

## Layouts Supported

| Layout | Keys |
|--------|------|
| 60% | ~61 keys |
| 65% | ~68 keys |
| 75% | ~84 keys |
| TKL | ~87 keys |
| Full-size | ~104 keys |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Then open `http://localhost:5173` in your browser.

---

## How to Use

1. **Choose a layout** from the selector (60%, 65%, 75%, TKL, Full-size)
2. **Click a key** to select it — shift-click to select multiple
3. **Or click a zone label** (Alphas, Mods, Fn Row, etc.) to select a whole group
4. **Pick a color** using the color panel — hex, RGB, or HSL input
5. **Or sample from a photo** — click "Sample from image", upload any image, eyedrop a color
6. **Colorize the case** by clicking the case swatch and picking a color
7. **Save your colorway** — named slots, up to 5, persisted in localStorage
8. **Export** as PNG to share, or JSON to import on another device

---

## Project Structure

```
keycap-colorizer/
├── src/
│   ├── components/       # Keyboard, KeyCap, Case, Toolbar, ColorPanel, etc.
│   ├── data/             # Layout maps (JSON), zone definitions, presets
│   ├── hooks/            # useColorway, useLocalStorage, useHistory
│   └── utils/            # Color conversions, PNG/JSON export helpers
├── PROPOSAL.md           # Vision and product decisions
├── ROADMAP.md            # V1 → V2 → V3 feature tiers
└── ARCHITECTURE.md       # File structure, state shape, data formats
```

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for the full breakdown.

---

## Roadmap

- **V1 (MVP)** — Layout selector, per-key coloring, zone selection, case color, localStorage save/restore
- **V2** — Image eyedropper modal, colorway presets, PNG export, JSON import/export, undo/redo
- **V3** — Keycap profile shading, comparison mode, URL sharing, community gallery

See [`ROADMAP.md`](./ROADMAP.md) for full details and build order.

---

## Tech Stack

| | |
|---|---|
| Framework | React + Vite |
| Color Picker | `react-colorful` |
| SVG Rendering | Inline SVG via React |
| PNG Export | `html2canvas` |
| Persistence | `localStorage` |

---

## Contributing

This is a vibe-coded, enthusiast-first project. PRs welcome — especially for new layouts, preset colorways, or keycap profile shading.

---

## License

MIT
