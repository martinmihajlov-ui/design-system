# Caladan Design System

## Project overview

A design system built in Figma with a structured token pipeline to web, React, and React Native. Color is the primary focus at this stage. Typography and spacing will follow.

---

## Figma

**File key:** `oWyNqsZJKJYF8SpZsBPb9P`
**Plugin:** MCP Bridge (Cloud Mode). Always call `figma_pair_plugin` at the start of each session before making any Figma changes. The plugin disconnects between sessions.

### Variable collections

| Collection | ID | Modes |
|---|---|---|
| Colors - Primitives | `VariableCollectionId:35:367` | `35:0` (colors-All) |
| Colors - Alias | `VariableCollectionId:364:1234` | `364:0` (Light), `422:0` (Dark) |
| Spacing | `VariableCollectionId:12:558` | — |
| Typography | `VariableCollectionId:13:267` | — |

---

## Color system

### Color space
OKLCH throughout. L = lightness (0–1), C = chroma, H = hue angle (0–360°).

### Primitive scales
Full 11-step scales (50–950) for: **indigo** (primary), **amber** (secondary), **purple**, **teal**, **neutral**.
Partial 7-step scales (50, 100, 300, 500, 700, 900, 950) for: **danger**, **warning**, **success**, **info**.

Special neutrals: `neutral/0` (white), `neutral/dark-alpha80`, `neutral/white-alpha80`.

### Scale construction rules
- **Zone-based L gaps** (indigo, amber, purple, teal, neutral):
  - Light tints 50→200: ΔL = 0.050
  - Working range 200→700: ΔL = 0.080
  - Dark zone 700→950: ΔL = 0.100
  - Step 950 uses 75% of dark zone gap (ΔL ≈ 0.075)
- **Neutral**: even spacing ΔL = 0.0835 from neutral/50 (#FAFAFA, fixed) to neutral/950
- **Hue**: held stable per scale; drift ≤ ±5° only if gamut clamping exceeds 20% C reduction
- **Chroma**: Gaussian curve peaking at anchor step, tapering to ~10% at extremes

> ⚠️ `scripts/generate-color-scale.js` was written for the indigo/brand scale only. Do not apply its algorithm to other color checks — evaluate all other scales manually using OKLCH principles.

### Alias tokens (Colors - Alias)
85 tokens across: `surface/`, `text/`, `border/`, `icon/`, `interactive/`, `overlay/`.

Two modes: **Light** and **Dark**. All alias tokens are references to primitives (never raw values). Dark mode inverts the scale direction — light surfaces become dark, text flips, brand colors shift to lighter steps.

Key conventions:
- Hover state = one step darker than default (light mode) / one step lighter (dark mode)
- `text/on-warning` and `icon/on-warning` use `neutral/900` (not white — amber/warning is too light for white text contrast)
- `border/` and `interactive/focus-ring-*` for semantic colors use `/300` in light mode, `/500` in dark mode
- `surface/` semantic tokens use `/700` in light mode, `/500` in dark mode

---

## Token files

Located in `tokens/`. DTCG format (W3C Design Token Community Group).

| File | Contents |
|---|---|
| `color-primitives.json` | OKLCH `$value`, hex + rgb + figma-variable in `$extensions.caladan` |
| `color-aliases-light.json` | DTCG references (e.g. `{indigo.700}`), figma-variable in `$extensions.caladan` |
| `color-aliases-dark.json` | Same structure, dark mode references |

`$type: "color"` set at root level (inherited by all tokens). `$metadata` block at root with version, generated_at, source, figma_file.

Figma variable names use `/` separator (e.g. `indigo/700`) — the export maps these to nested dot notation in JSON (`indigo > "700"`). DTCG references use `{indigo.700}` format.

### Exporting tokens
The Figma Variables REST API requires Enterprise plan — not available on current plan. Export is done via MCP Bridge:

1. Pair the MCP Bridge plugin
2. Run the export script via `figma_execute` (see `scripts/export-color-tokens.js` for the logic)
3. Write the three output files locally
4. Commit and push

The `scripts/export-color-tokens.js` and `.github/workflows/sync-color-tokens.yml` are kept for future reference if the plan is upgraded.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run export-color-tokens` | Export color tokens (requires FIGMA_TOKEN env var + Enterprise) |
| `npm run optimize-icons` | Run SVGO on `icons/svg/` |
| `npm run build-react-icons` | Build React icon components |
| `npm run build-react-native-icons` | Build React Native icon components |

---

## GitHub Actions workflows

All workflows use `workflow_dispatch` (manual trigger). `FIGMA_TOKEN` secret is set in the repo.

| Workflow | Purpose |
|---|---|
| `sync-icons.yml` | Export SVG icons from Figma |
| `sync-react-icons.yml` | Export SVG + build React icon components |
| `sync-react-native-icons.yml` | Export SVG + build React Native icon components |
| `sync-color-tokens.yml` | Export color tokens (requires Enterprise Figma plan) |

---

## What's next

- Style Dictionary setup (separate workflow): transform token JSON → CSS custom properties, JS/TS, React Native
- Typography token export
- Spacing token export
