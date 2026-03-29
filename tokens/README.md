# Token Architecture

Caladan uses a three-layer token architecture: primitives hold raw values, semantic aliases assign meaning, and a Style Dictionary build step transforms both into CSS custom properties and a JavaScript module.

All token files follow the [W3C Design Token Community Group (DTCG)](https://tr.designtokens.org/) format.

---

## The three layers

**Primitives** are raw values with no semantic meaning. A color primitive is a specific OKLCH value at a scale step. A spacing primitive is a pixel value on the 4px grid. Primitives are referenced by aliases but never used directly in components.

**Aliases** assign semantic meaning to primitive values. `surface/page` in light mode references `neutral/0` (white). In dark mode, the same alias references `neutral/950` (near-black). The alias name stays the same across modes; only what it points to changes. This is what makes dark mode and responsive typography work without duplicating values.

**Built output** in `dist/` is what consuming projects actually use. Style Dictionary resolves all references and writes flat CSS custom properties. No `var()` references in the output — every property resolves to its final value.

```
color-primitives.json      →  --indigo-500: oklch(0.60 0.20 274);
color-aliases-light.json   →  --surface-primary: oklch(0.60 0.20 274);
color-aliases-dark.json    →  [data-theme="dark"] { --surface-primary: oklch(0.68 0.16 278); }
```

---

## Color

### Primitive scales

Five full 11-step scales (steps 50-950): indigo (primary), amber (secondary), purple, teal, neutral.
Four partial 7-step scales (steps 50, 100, 300, 500, 700, 900, 950): danger, warning, success, info.

Scale construction uses zone-based lightness gaps in OKLCH:
- Light tints 50-200: ΔL = 0.050
- Working range 200-700: ΔL = 0.080
- Dark zone 700-950: ΔL = 0.100

Chroma follows a Gaussian curve peaking at the anchor step and tapering toward both extremes. Hue is held stable across each scale.

### Why OKLCH

Figma stores and displays colors as sRGB. OKLCH is perceptually uniform: the same numerical step in lightness produces the same perceived change across the full scale, which sRGB does not guarantee. This makes it practical to construct scales algorithmically and verify contrast ratios by lightness value rather than running checks on each individual pair. The export script converts Figma's sRGB floats to OKLCH using a standard sRGB to OKLab to OKLCH conversion.

### Semantic aliases

85 alias tokens across six groups: `surface/`, `text/`, `border/`, `icon/`, `interactive/`, `overlay/`.

All aliases reference primitives. No raw color values appear in the alias files. Dark mode inverts the scale direction: light surfaces reference light primitive steps in light mode and dark steps in dark mode. Hover states step one level darker in light mode and one level lighter in dark mode.

---

## Spacing

A 4px base unit, Tailwind-compatible.

**Primitives:** 35 values named by their pixel value (`16` = `16px`). The full Tailwind spacing scale from 0 to 384px.

**Aliases:** 67 tokens across `border-width/`, `radius/`, `gap/`, `padding/`, `icon-size/`, `size/`, `screens/`. All reference primitives directly.

Spacing primitives are excluded from the CSS output. Their numeric names (`--16`, `--0`) are valid CSS custom properties but unconventional. Spacing aliases cover all practical usage in components. Primitives are included in the JavaScript output for programmatic access.

---

## Typography

Two typefaces: Poppins for headings, DM Sans for body and UI text.

**Scale:** Major Third (1.25 ratio) from 16px upward. 12px and 14px are pragmatic additions below the scale base for small labels and captions.

**Primitives:** 44 variables across font-family, font-size, font-weight, letter-spacing, line-height, and paragraph-spacing.

**Aliases:** 34 tokens per mode across font-size, line-height, font-weight, and letter-spacing. Two modes: Desktop and Mobile. Headings step down one scale level on mobile (heading-xxl goes from 49px to 39px, for example). Body and label sizes are unchanged between modes.

A known Figma float precision issue affects letter-spacing values. Figma stores `0.4` internally as `0.4000000059604645`. The export script rounds these to one decimal place at export time, and the JSON files store clean strings (`"-0.4px"`, `"0.4px"`).

---

## File reference

| File | Contents |
|---|---|
| `color-primitives.json` | OKLCH `$value` for all primitive color steps, with hex, RGB, and Figma variable name in `$extensions.caladan` |
| `color-aliases-light.json` | DTCG references to color primitives, light mode (e.g. `{indigo.700}`) |
| `color-aliases-dark.json` | DTCG references to color primitives, dark mode |
| `spacing-primitives.json` | px values for all spacing primitives (e.g. `"16px"`) |
| `spacing-aliases.json` | DTCG references to spacing primitives (e.g. `{16}`) |
| `typography-primitives.json` | Mixed types: px for dimensions, unitless numbers for weights, strings for font families |
| `typography-aliases-desktop.json` | DTCG references, Desktop mode |
| `typography-aliases-mobile.json` | DTCG references, Mobile mode (headings step down one scale level) |

---

## DTCG format

Each token follows this structure:

```json
"heading-xxl": {
  "$value": "{font-size.800}",
  "$description": "Heading XXL font size — 49px",
  "$extensions": {
    "caladan": {
      "figma-variable": "font-size/heading-xxl"
    }
  }
}
```

- `$value` is either a raw value (`"49px"`) or a DTCG reference (`"{font-size.800}"`)
- `$type` is set at the group level and inherited by all tokens in the group
- `$extensions.caladan.figma-variable` records the source variable name in Figma

---

## Export pipeline

### With Figma Enterprise

The Figma Variables REST API is available on Enterprise plans. With a `FIGMA_TOKEN` environment variable set, the export scripts fetch directly from the API and overwrite the token files:

```bash
npm run export-color-tokens
npm run export-spacing-tokens
npm run export-typography-tokens
```

Each script writes its files to `tokens/`. After export, `npm run build-tokens` rebuilds `dist/`. The corresponding GitHub Actions workflows handle both steps in sequence.

### Without Figma Enterprise (current approach)

The Figma Variables REST API is not available on the current plan. Instead, variables are accessed through the MCP Bridge plugin, which runs JavaScript inside Figma's plugin sandbox. The plugin sandbox has full access to the local Variables API — the restriction is only on the external REST API, not on in-app execution.

The token files in this repository were produced via the MCP Bridge approach. They are structurally identical to what the export scripts would produce, and the export scripts will work without modification when Enterprise is available.

---

## Naming conventions

Token names in Figma use `/` as a separator. The pipeline maps this consistently across every layer:

| Layer | Format | Example |
|---|---|---|
| Figma variable | `group/name` | `font-size/heading-xxl` |
| JSON key path | `group.name` | `font-size.heading-xxl` |
| DTCG reference | `{group.name}` | `{font-size.800}` |
| CSS custom property | `--group-name` | `--font-size-heading-xxl` |
| JavaScript key | `"--group-name"` | `"--font-size-heading-xxl"` |
