# Caladan Design System

## Project overview

A design system built in Figma with a structured token pipeline to web, React, and React Native. Color, typography, and spacing token systems are complete.

---

## Figma

**File key:** `oWyNqsZJKJYF8SpZsBPb9P`
**Plugin:** MCP Bridge (Cloud Mode). Always call `figma_pair_plugin` at the start of each session before making any Figma changes. The plugin disconnects between sessions.

### Variable collections

| Collection | ID | Modes |
|---|---|---|
| Colors - Primitives | `VariableCollectionId:35:367` | `35:0` (colors-All) |
| Colors - Alias | `VariableCollectionId:364:1234` | `364:0` (Light), `422:0` (Dark) |
| Spacing - Primitives | `VariableCollectionId:12:558` | `12:1` (All) |
| Spacing - Alias | `VariableCollectionId:426:2159` | `426:1` (All) |
| Typography - Primitives | `VariableCollectionId:435:2354` | single mode (All) |
| Typography - Alias | `VariableCollectionId:13:267` | Desktop, Mobile |

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

## Spacing system

4px base unit. Tailwind-compatible.

### Primitives (Spacing - Primitives)
35 variables named by pixel value (e.g. `16` not `s16`). Complete Tailwind scale:
`0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 288, 320, 384`

### Aliases (Spacing - Alias)
67 variables across: `border-width/`, `radius/`, `gap/`, `padding/`, `icon-size/`, `size/`, `screens/`.

Key conventions:
- `border-width/`: none=0, small=1px, medium=2px, large=4px, x-large=8px
- `radius/`: none through full (0/2/4/8/12/16/24/32/384px)
- `icon-size/`: x-small=16px, small=20px, default=24px, large=32px, x-large=40px
- `size/`: 2x-small=16px, x-small=24px, small=32px, medium=40px, large=48px, x-large=64px, 2x-large=80px
- `screens/`: mobile-small=360px, mobile-medium=400px, mobile-large=640px, mobile-max=768px, desktop-small=1024px, desktop-medium=1280px, desktop-large=1440px
- `gap/` and `padding/` reference primitives directly (e.g. `{16}`)

---

## Typography system

Two font families: **Poppins** (headings) · **DM Sans** (body and UI).
Type scale: Major Third (×1.25) from 16px upward. 12px and 14px are pragmatic additions below the scale.

### Primitives (Typography - Primitives)
44 variables across 6 groups:

| Group | Type | Values |
|---|---|---|
| `font-family` | string | body (DM Sans), heading (Poppins) |
| `font-size` | dimension | 50=10px, 100=12px, 200=14px, 300=16px, 400=20px, 500=25px, 600=31px, 700=39px, 800=49px, 900=61px |
| `font-weight` | number | thin=100, extralight=200, light=300, normal=400, medium=500, semibold=600, bold=700, extrabold=800, black=900 |
| `letter-spacing` | dimension | tighter=-0.8px, tight=-0.4px, normal=0px, wide=0.4px, wider=0.8px |
| `line-height` | dimension | 100=16px, 150=18px, 200=20px, 250=22px, 300=24px, 350=26px, 400=28px, 450=30px, 500=32px, 600=36px, 700=44px, 800=56px, 900=72px |
| `paragraph-spacing` | dimension | x-small=8px, small=12px, base=16px, large=20px, x-large=24px |

### Aliases (Typography - Alias)
34 aliases per mode across: `font-size/`, `line-height/`, `font-weight/`, `letter-spacing/`.

**Two modes: Desktop and Mobile.** Headings step down one scale level on mobile; body and labels are unchanged.

#### Font size aliases

| Token | Desktop | Mobile |
|---|---|---|
| `font-size/heading-xxl` | 49px (800) | 39px (700) |
| `font-size/heading-xl` | 39px (700) | 31px (600) |
| `font-size/heading-l` | 31px (600) | 25px (500) |
| `font-size/heading-m` | 25px (500) | 20px (400) |
| `font-size/heading-s` | 20px (400) | 16px (300) |
| `font-size/heading-xs` | 16px (300) | 16px (300) |
| `font-size/body-l` | 20px (400) | 20px (400) |
| `font-size/body-base` | 16px (300) | 16px (300) |
| `font-size/body-s` | 14px (200) | 14px (200) |
| `font-size/body-xs` | 12px (100) | 12px (100) |
| `font-size/label-l` | 20px (400) | 20px (400) |
| `font-size/label-base` | 16px (300) | 16px (300) |
| `font-size/label-s` | 14px (200) | 14px (200) |
| `font-size/label-xs` | 12px (100) | 12px (100) |

#### Line-height ratios

| Token | Desktop lh | Desktop ratio | Mobile lh | Mobile ratio |
|---|---|---|---|---|
| `heading-xxl` | 56px | 1.14 | 44px | 1.13 |
| `heading-xl` | 44px | 1.13 | 36px | 1.16 |
| `heading-l` | 36px | 1.16 | 30px | 1.20 |
| `heading-m` | 30px | 1.20 | 26px | 1.30 |
| `heading-s` | 26px | 1.30 | 22px | 1.38 |
| `heading-xs` | 22px | 1.38 | 22px | 1.38 |
| `body-l` | 32px | 1.60 | 32px | 1.60 |
| `body-base` | 24px | 1.50 | 24px | 1.50 |
| `body-s` | 20px | 1.43 | 20px | 1.43 |
| `body-xs` | 16px | 1.33 | 16px | 1.33 |
| `label-l` | 24px | 1.20 | 24px | 1.20 |
| `label-base` | 20px | 1.25 | 20px | 1.25 |
| `label-s` | 18px | 1.29 | 18px | 1.29 |
| `label-xs` | 16px | 1.33 | 16px | 1.33 |

#### Semantic weight and letter-spacing aliases (same for both modes)

| Token | Value |
|---|---|
| `font-weight/heading-large` | bold (700) — XXL through M |
| `font-weight/heading-small` | semibold (600) — S and XS |
| `font-weight/body` | normal (400) |
| `font-weight/label` | medium (500) |
| `letter-spacing/heading` | tight (-0.4px) |
| `letter-spacing/none` | normal (0px) |
| `letter-spacing/label` | wide (0.4px) |

Key conventions:
- Labels share body font sizes but use Medium (500) weight to differentiate
- `heading-xs` matches `body-base` in size (16px) — differentiated by Poppins weight
- Headings tighten as size grows (ratios 1.13–1.38); body comfortable (1.33–1.60); labels compact (1.20–1.33)

---

## Token files

Located in `tokens/`. DTCG format (W3C Design Token Community Group).

| File | `$type` | Contents |
|---|---|---|
| `color-primitives.json` | color | OKLCH `$value`, hex + rgb + figma-variable in `$extensions.caladan` |
| `color-aliases-light.json` | color | DTCG references (e.g. `{indigo.700}`), figma-variable in `$extensions.caladan` |
| `color-aliases-dark.json` | color | Same structure, dark mode references |
| `spacing-primitives.json` | dimension | px `$value` (e.g. `"16px"`), figma-variable in `$extensions.caladan` |
| `spacing-aliases.json` | dimension | DTCG references (e.g. `{16}`), figma-variable in `$extensions.caladan` |
| `typography-primitives.json` | mixed | `$type` per group (string/dimension/number); px values, figma-variable in `$extensions.caladan` |
| `typography-aliases-desktop.json` | mixed | DTCG references (e.g. `{font-size.800}`), Desktop mode values |
| `typography-aliases-mobile.json` | mixed | DTCG references, Mobile mode values (headings step down one scale level) |

`$type` set at group level for mixed-type files. `$metadata` block at root with version, generated_at, source, figma_file.

Figma variable names use `/` separator (e.g. `font-size/heading-xxl`) — the export maps these to nested dot notation in JSON. DTCG references use `{font-size.800}` format.

> ⚠️ **Figma float precision bug**: Letter-spacing values (e.g. 0.4) are stored internally as floats like `0.4000000059604645`. Export scripts must round these values. Token JSON files write clean strings ("-0.4px", "0.4px") directly.

### Exporting tokens
The Figma Variables REST API requires Enterprise plan — not available on current plan. Export is done via MCP Bridge:

1. Pair the MCP Bridge plugin
2. Run the export script via `figma_execute` (see `scripts/export-color-tokens.js` for the logic)
3. Write the output files locally
4. Commit and push

The `scripts/export-color-tokens.js` and `.github/workflows/sync-color-tokens.yml` are kept for future reference if the plan is upgraded.

---

## Scripts

| Script | Purpose |
|---|---|
| `npm run export-color-tokens` | Export color tokens (requires FIGMA_TOKEN env var + Enterprise) |
| `npm run export-spacing-tokens` | Export spacing tokens (requires FIGMA_TOKEN env var + Enterprise) |
| `npm run optimize-icons` | Run SVGO on `icons/svg/` |
| `npm run build-react-icons` | Build React icon components |
| `npm run build-react-native-icons` | Build React Native icon components |
| `npm run export-typography-tokens` | Export typography tokens (requires FIGMA_TOKEN env var + Enterprise) |
| `npm run build-tokens` | Transform token JSON → CSS + JS via Style Dictionary |

---

## GitHub Actions workflows

All workflows use `workflow_dispatch` (manual trigger). `FIGMA_TOKEN` secret is set in the repo.

| Workflow | Purpose |
|---|---|
| `sync-icons.yml` | Export SVG icons from Figma |
| `sync-react-icons.yml` | Export SVG + build React icon components |
| `sync-react-native-icons.yml` | Export SVG + build React Native icon components |
| `sync-color-tokens.yml` | Export color tokens (requires Enterprise Figma plan) |
| `sync-spacing-tokens.yml` | Export spacing tokens (requires Enterprise Figma plan) |
| `sync-typography-tokens.yml` | Export typography tokens (requires Enterprise Figma plan) |
| `build-tokens.yml` | Auto-build CSS + JS when token JSON files change on main |

---

## Style Dictionary

`scripts/build-tokens.js` — SD v4. Run `npm run build-tokens`.

### Output files

| File | Format | Contents |
|---|---|---|
| `dist/css/tokens.css` | `:root { --name: value; }` | All light-mode tokens (color + spacing aliases + typography desktop) |
| `dist/css/tokens-dark.css` | `[data-theme="dark"] { }` | Color alias overrides for dark mode |
| `dist/css/tokens-mobile.css` | `@media (max-width: 768px) { :root { } }` | Typography alias overrides for mobile |
| `dist/js/tokens.js` | `module.exports = { "--name": "value" }` | Flat map, all light-mode tokens including spacing primitives |

### SD v4 notes
- DTCG tokens: `token.$value` holds the resolved value (not `token.value`)
- Transforms read `token.$value`, return new value → stored in `token.value`; formats use `token.value ?? token.$value`
- `include` files are available for reference resolution but excluded from output via `filter: token => token.isSource`
- `color/css` transform intentionally omitted — OKLCH incompatible with tinycolor2
- `size/rem` transform intentionally omitted — keep px values as-is
- Custom transform `caladan/font-family/css`: wraps multi-word font family strings in CSS quotes

### Token naming in CSS
- `--indigo-500`, `--surface-default`, `--border-width-small`, `--font-size-heading-xxl`
- Spacing primitives excluded from CSS output (numeric `--16` etc. not needed; spacing aliases cover usage)
- Spacing primitives included in JS output as `"--16": "16px"` etc.

---

## What's next

- Build components (starting with Button — connects icons, typography, spacing, color tokens)
