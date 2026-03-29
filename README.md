# Caladan Design System

This repo was built over a weekend as part of a job application to XBOW. The idea had been brewing for a while: a token pipeline where Figma is a genuine source of truth rather than a handoff tool, with automated export, platform-agnostic output, and a practical workaround for the Figma Enterprise API limitation that most product designers quietly hit and work around manually.

Caladan is a design token pipeline built in Figma with structured export to web, React, and React Native. Covers color (OKLCH), spacing (4px grid), and typography (Major Third scale), each with a primitive and semantic alias layer that produces production-ready CSS and JavaScript output.

---

## How it works

Figma variables are the source of truth. Export scripts pull from the Figma Variables API and write DTCG-format JSON files to `tokens/`. Style Dictionary reads those files and transforms them into CSS custom properties, a dark mode override sheet, a mobile typography override, and a JavaScript module. A GitHub Action rebuilds the output automatically whenever token files change on main.

```
Figma variables  →  DTCG JSON (tokens/)  →  Style Dictionary  →  CSS + JS (dist/)
```

---

## Token systems

| System | Primitives | Aliases | Modes |
|---|---|---|---|
| Color | 11-step OKLCH scales for 5 full palettes, 7-step scales for 4 semantic palettes | 85 tokens across surface, text, border, icon, interactive, overlay | Light, Dark |
| Spacing | 35 values on a 4px grid, Tailwind-compatible | 67 tokens across border-width, radius, gap, padding, icon-size, size, screens | Single |
| Typography | Font family, size, weight, line-height, letter-spacing, paragraph-spacing | 34 aliases per mode across font-size, line-height, font-weight, letter-spacing | Desktop, Mobile |

---

## Key decisions

**OKLCH color space**
Figma stores colors as sRGB. I chose to export and store them as OKLCH because the color space is perceptually uniform: equal numerical steps in lightness look equal to the eye, which makes building accessible, predictable color scales significantly more reliable than working in sRGB. The export script converts sRGB floats from the Figma API to OKLCH values at export time.

**Three-layer token architecture**
Each system has a primitive layer (raw values) and a semantic alias layer (meaningful names). Dark mode is a separate alias file where tokens point to different primitive steps. `surface/page` in light mode references `neutral/0`; in dark mode the same token references `neutral/950`. The primitives are unchanged across modes, so updating the color system means changing aliases without rebuilding scales.

**DTCG token format**
Token files follow the W3C Design Token Community Group format (`$value`, `$type`, `$description`, `$extensions`) rather than a custom JSON structure. This keeps files compatible with any DTCG-compliant tooling and aligns with where Style Dictionary v4 and the broader ecosystem are heading.

**Building without Figma Enterprise**
The Figma Variables REST API requires an Enterprise plan. Rather than hardcode tokens manually and lose Figma as the source of truth, I used the MCP Bridge plugin, which runs JavaScript inside Figma's plugin sandbox and has full access to the local Variables API. The export scripts in `scripts/` are written for the REST API and work directly when Enterprise is available. The MCP Bridge approach covers the gap without changing the pipeline or the output format.

**Style Dictionary v4**
Values stay in px. No rem conversion is applied because that decision belongs to the consuming project. OKLCH strings pass through without transformation because Style Dictionary's built-in color transform uses tinycolor2, which does not support OKLCH. Dark mode and mobile typography are separate output files designed to layer on top of the main stylesheet.

---

## Icon system

SVG icons are exported from Figma, optimized with SVGO, and built into React and React Native components via SVGR. A GitHub Action handles the full sync: export from Figma, optimize, build components, commit. Workflows are triggered manually.

---

## Build and automation

```bash
npm run build-tokens               # Build CSS + JS from token JSON files
npm run export-color-tokens        # Sync color tokens from Figma (requires Enterprise)
npm run export-spacing-tokens      # Sync spacing tokens from Figma (requires Enterprise)
npm run export-typography-tokens   # Sync typography tokens from Figma (requires Enterprise)
npm run build-react-icons          # Build React icon components
npm run build-react-native-icons   # Build React Native icon components
```

| Workflow | Trigger |
|---|---|
| `build-tokens.yml` | Auto on push to main when token JSON files change |
| `sync-color-tokens.yml` | Manual |
| `sync-spacing-tokens.yml` | Manual |
| `sync-typography-tokens.yml` | Manual |
| `sync-react-icons.yml` | Manual |
| `sync-react-native-icons.yml` | Manual |

---

## Using the tokens

Import the CSS files in your project entry point:

```css
@import 'path/to/dist/css/tokens.css';         /* light mode base + desktop typography */
@import 'path/to/dist/css/tokens-dark.css';    /* dark mode overrides                  */
@import 'path/to/dist/css/tokens-mobile.css';  /* mobile typography overrides          */
```

Dark mode activates by setting `data-theme="dark"` on the root element. Mobile overrides apply automatically via `@media (max-width: 768px)`.

Use semantic alias tokens in components, not primitives:

```css
.button-primary {
  background:    var(--surface-primary);
  color:         var(--text-on-primary);
  font-size:     var(--font-size-label-base);
  border-radius: var(--radius-medium);
  padding:       var(--padding-12) var(--padding-24);
}
```

For JavaScript:

```js
const tokens = require('./dist/js/tokens');
// { '--surface-primary': 'oklch(0.60 0.20 274)', '--font-size-label-base': '16px', ... }
```

---

## Repository structure

```
design-system/
├── tokens/          DTCG token files — source of truth for all values
├── scripts/         Export scripts (Figma → JSON) and Style Dictionary build
├── icons/           SVG source, React, and React Native icon components
├── dist/            Built output — CSS custom properties and JS token map
└── .github/
    └── workflows/   Figma sync and automated token build workflows
```

See [tokens/README.md](tokens/README.md) for a detailed breakdown of the token architecture, file formats, and the export pipeline.
