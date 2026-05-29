# KeyPalette — Project Proposal

## Vision

A lightweight, browser-based tool that lets keyboard enthusiasts design and visualize custom keycap colorways before buying. No accounts, no friction — just open it and start painting your board.

---

## Problem Statement

Mechanical keyboard enthusiasts often want to plan a custom colorway before committing to a purchase, but existing tools are either:
- Too complex (full 3D configurators tied to specific vendors)
- Too limited (static color swatches, no layout flexibility)
- Non-existent for the "I saw this palette on Reddit, how do I apply it to my board?" use case

There's no simple, aesthetic, layout-agnostic colorway planner that works for any keyboard.

---

## Target User

- Mechanical keyboard hobbyists planning a custom keycap set
- Designers and enthusiasts exploring colorway ideas
- Buyers who want to visualize a color scheme before ordering from vendors like KBDfans, Novelkeys, or Drop

---

## Core Concept

An **interactive keyboard canvas** where:

1. The user selects their keyboard **layout** (60%, 65%, 75%, TKL, Full-size)
2. A **generic case silhouette** renders with a default neutral color
3. Every keycap is individually clickable and colorable
4. Colors can be picked manually, sampled from an uploaded image via an **eyedropper modal**, or applied to a whole **zone** at once (alphas, modifiers, numpad, arrows, etc.)
5. The colorway is saved to **localStorage** and can be exported as PNG or JSON

---

## Key Differentiators

- **Image eyedropper** — upload any photo and sample colors directly from it; the photo is a color source, not a layout detector
- **Zone-aware selection** — click a zone label to select all keys in that group at once
- **Case colorization** — pick a case color to match or contrast the keycap scheme
- **Shareable JSON** — export your colorway as a `.json` file; anyone can import it instantly
- **No account required** — localStorage-first, zero backend

---

## Aesthetic Direction

Minimalist. The keyboard is the hero — everything else steps back.

- Off-white or deep charcoal workspace (toggleable)
- Thin, borderless floating tool panels (Figma-inspired)
- Sparse typography — small, quiet labels
- No gradients in the UI chrome; let the keycap colors provide all the visual richness
- Subtle micro-interactions: soft key-press feedback on click, smooth color transitions

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | React + Vite | Component-per-key model, fast HMR, great ecosystem |
| Color Picker | `react-colorful` | Lightweight, accessible, headless-friendly |
| SVG Rendering | Inline SVG via React | Full programmatic control over per-key fill |
| Export (PNG) | `html2canvas` | No server needed |
| Persistence | `localStorage` | Zero backend, sufficient for scope |
| Styling | CSS Modules or Tailwind | TBD during scaffold |

---

## Out of Scope (for now)

- User accounts or cloud sync
- 3D rendering or keycap profile shading (V3 stretch)
- Vendor stock integration
- Auto-mapping a photo to a keyboard layout (intentionally avoided — image is a color source only)
- Mobile-first layout (desktop primary, responsive secondary)
