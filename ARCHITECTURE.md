# Keycap Colorizer — Architecture

## File Structure

```
keycap-colorizer/
├── index.html
├── vite.config.js
├── package.json
│
├── public/
│   └── favicon.svg
│
└── src/
    ├── main.jsx                  # React entry point
    ├── App.jsx                   # Root layout, global state
    ├── App.module.css
    │
    ├── components/
    │   ├── Keyboard/
    │   │   ├── Keyboard.jsx      # Renders SVG keyboard from layout data
    │   │   ├── KeyCap.jsx        # Single key: fill color, click handler, zone label
    │   │   ├── Case.jsx          # Case silhouette behind the keyboard SVG
    │   │   └── Keyboard.module.css
    │   │
    │   ├── Toolbar/
    │   │   ├── Toolbar.jsx       # Left/right panel: layout selector, color picker, zones
    │   │   ├── LayoutSelector.jsx
    │   │   ├── ZonePanel.jsx     # Zone quick-select buttons
    │   │   ├── ColorPanel.jsx    # react-colorful + hex/RGB/HSL inputs
    │   │   └── Toolbar.module.css
    │   │
    │   ├── EyedropperModal/      # V2
    │   │   ├── EyedropperModal.jsx
    │   │   └── EyedropperModal.module.css
    │   │
    │   ├── ExportPanel/          # V2
    │   │   ├── ExportPanel.jsx
    │   │   └── ExportPanel.module.css
    │   │
    │   └── WorkspaceToggle.jsx   # Light / dark workspace button
    │
    ├── data/
    │   ├── layouts/
    │   │   ├── index.js          # Exports all layouts
    │   │   ├── layout-60.js
    │   │   ├── layout-65.js
    │   │   ├── layout-75.js
    │   │   ├── layout-tkl.js
    │   │   └── layout-full.js
    │   │
    │   ├── zones.js              # Zone definitions: which key IDs belong to which zone
    │   └── presets.js            # V2: built-in colorway presets
    │
    ├── hooks/
    │   ├── useColorway.js        # Core state: per-key colors, case color, active selection
    │   ├── useLocalStorage.js    # Generic localStorage read/write hook
    │   └── useHistory.js         # V2: undo/redo stack
    │
    └── utils/
        ├── exportPng.js          # V2: html2canvas wrapper
        ├── exportJson.js         # V2: serialize/deserialize colorway state
        └── colorUtils.js         # Hex ↔ RGB ↔ HSL conversions, contrast checker
```

---

## State Shape

The core application state, managed in `useColorway.js`:

```js
{
  layout: "tkl",                  // "60" | "65" | "75" | "tkl" | "full"

  caseColor: "#1a1a1a",           // hex string
  caseFinish: "matte",            // "matte" | "gloss"

  keyColors: {                    // keycap fill colors, keyed by key ID
    "KeyA": "#ffffff",
    "KeyB": "#ff5f57",
    // ...one entry per key in the layout
  },

  selectedKeys: ["KeyA", "KeyB"], // currently selected key IDs (multi-select)
  activeColor: "#ffffff",         // color in the picker, applied on confirm

  colorwayName: "My Colorway",    // name for localStorage slot
  workspace: "dark",              // "light" | "dark"
}
```

---

## Layout Data Format

Each layout file exports an array of key objects:

```js
// layout-tkl.js
export default [
  { id: "Escape",     label: "Esc",   x: 0,    y: 0,    w: 1,   h: 1,   zone: "function" },
  { id: "F1",         label: "F1",    x: 2,    y: 0,    w: 1,   h: 1,   zone: "function" },
  // ...
  { id: "KeyA",       label: "A",     x: 1.75, y: 3,    w: 1,   h: 1,   zone: "alpha"    },
  { id: "ShiftLeft",  label: "Shift", x: 0,    y: 4,    w: 2.25,h: 1,   zone: "modifier" },
  // ...
]
```

- `x`, `y` are in **keyboard units** (1u = one standard keycap width)
- `w`, `h` are width/height in units (e.g. spacebar is `w: 6.25`)
- `zone` maps to entries in `zones.js` for group selection

---

## Zone Definitions

```js
// zones.js
export const ZONES = {
  alpha:      { label: "Alphas",      color: "#aaa" },
  number:     { label: "Numbers",     color: "#aaa" },
  modifier:   { label: "Modifiers",   color: "#aaa" },
  function:   { label: "Fn Row",      color: "#aaa" },
  arrow:      { label: "Arrows",      color: "#aaa" },
  navigation: { label: "Nav Cluster", color: "#aaa" },
  numpad:     { label: "Numpad",      color: "#aaa" },
}
```

Clicking a zone button in `ZonePanel` → adds all matching key IDs to `selectedKeys`.

---

## Key Interactions

| Action | Behavior |
|--------|----------|
| Click a key | Selects it (replaces selection) |
| Shift + click a key | Adds/removes from selection |
| Click a zone button | Selects all keys in that zone |
| Pick a color | Applies to all keys in `selectedKeys` |
| Click case swatch | Opens case color picker |
| Cmd/Ctrl + Z | Undo (V2) |

---

## localStorage Schema

```js
// Key: "keycap-colorizer-slots"
{
  slots: [
    {
      name: "My Dark Build",
      layout: "tkl",
      caseColor: "#1a1a1a",
      caseFinish: "matte",
      keyColors: { ... },
      savedAt: "2025-04-01T12:00:00Z"
    },
    // up to 5 slots
  ],
  activeSlot: 0
}
```

---

## Dependencies

```json
{
  "dependencies": {
    "react": "^18",
    "react-dom": "^18",
    "react-colorful": "^5.6.1"
  },
  "devDependencies": {
    "vite": "^5",
    "@vitejs/plugin-react": "^4",
    "html2canvas": "^1.4.1"
  }
}
```

---

## Deployment

Static site — no backend required.

- **Dev:** `vite dev`
- **Build:** `vite build` → outputs to `/dist`
- **Deploy:** Drop `/dist` on Vercel, Netlify, or GitHub Pages
