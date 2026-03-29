'use strict';

/**
 * Caladan Design System — Style Dictionary build
 *
 * Outputs:
 *   dist/css/tokens.css        — :root custom properties (light mode, desktop)
 *   dist/css/tokens-dark.css   — [data-theme="dark"] overrides
 *   dist/css/tokens-mobile.css — @media (max-width: 768px) :root overrides
 *   dist/js/tokens.js          — CommonJS flat map (CSS var name → value)
 *
 * Run: npm run build-tokens
 *
 * SD v4 notes:
 *   - DTCG tokens store raw/resolved value in token.$value (not token.value)
 *   - Transforms read token.$value and return a new value → stored in token.value
 *   - Formats should use: token.value ?? token.$value  (value if transformed, else $value)
 *   - file.filter applies before format — dictionary.allTokens only contains passing tokens
 *   - include tokens have isSource: false; filter them to keep output clean
 */

const StyleDictionary = require('style-dictionary').default;
const path = require('path');

const TOKENS = path.resolve(__dirname, '../tokens');
const DIST = path.resolve(__dirname, '../dist');

// Helper: resolved value regardless of whether a transform has run
const resolvedValue = (token) => token.value !== undefined ? token.value : token.$value;

// ─── Custom transforms ────────────────────────────────────────────────────────

// Wrap multi-word font-family values in CSS quotes: DM Sans → "DM Sans"
StyleDictionary.registerTransform({
  name: 'caladan/font-family/css',
  type: 'value',
  filter: (token) => token.path && token.path[0] === 'font-family',
  transform: (token) => {
    const val = token.$value; // SD v4: read from $value (the DTCG source)
    return typeof val === 'string' && val.includes(' ') ? `"${val}"` : val;
  },
});

// ─── Custom transform group ───────────────────────────────────────────────────

StyleDictionary.registerTransformGroup({
  name: 'caladan/css',
  // Intentionally omits:
  //   color/css    — OKLCH not supported by tinycolor2
  //   size/rem     — keep px values as-is
  transforms: ['name/kebab', 'caladan/font-family/css'],
});

// ─── Custom formats ───────────────────────────────────────────────────────────

// Dark mode: [data-theme="dark"] { --token: value; }
StyleDictionary.registerFormat({
  name: 'caladan/css/dark-mode',
  format: ({ dictionary }) => {
    // dictionary.allTokens is pre-filtered by file.filter before reaching here
    const vars = dictionary.allTokens
      .map((t) => `  --${t.name}: ${resolvedValue(t)};`)
      .join('\n');
    return (
      '/**\n' +
      ' * Caladan Design System — dark mode overrides\n' +
      ' * Do not edit directly.\n' +
      ' */\n\n' +
      `[data-theme="dark"] {\n${vars}\n}\n`
    );
  },
});

// Mobile: @media (max-width: 768px) { :root { --token: value; } }
StyleDictionary.registerFormat({
  name: 'caladan/css/mobile',
  format: ({ dictionary }) => {
    const vars = dictionary.allTokens
      .map((t) => `    --${t.name}: ${resolvedValue(t)};`)
      .join('\n');
    return (
      '/**\n' +
      ' * Caladan Design System — mobile typography overrides\n' +
      ' * Do not edit directly.\n' +
      ' */\n\n' +
      `@media (max-width: 768px) {\n  :root {\n${vars}\n  }\n}\n`
    );
  },
});

// JS: CommonJS flat map keyed by CSS custom property name (--prefix included)
StyleDictionary.registerFormat({
  name: 'caladan/js/tokens',
  format: ({ dictionary }) => {
    const obj = {};
    dictionary.allTokens.forEach((t) => {
      obj[`--${t.name}`] = resolvedValue(t);
    });
    const body = JSON.stringify(obj, null, 2);
    return (
      '/**\n' +
      ' * Caladan Design System tokens\n' +
      ' * Do not edit directly.\n' +
      ' */\n\n' +
      `module.exports = ${body};\n`
    );
  },
});

// ─── Shared file filter ───────────────────────────────────────────────────────

// Exclude tokens that came from `include` files (isSource: false).
// This keeps spacing-primitives and other reference-only files out of CSS output.
const sourceOnly = (token) => token.isSource === true;

// ─── Build ────────────────────────────────────────────────────────────────────

async function build() {
  console.log('Building tokens…\n');

  // 1. CSS main — light mode + desktop typography
  //    spacing-primitives in `include`: available for reference resolution,
  //    filtered out of CSS output by sourceOnly (numeric names like --16 not needed)
  // log.warnings: 'disabled' suppresses expected $metadata and $type collisions
  // that occur when multiple DTCG files are merged — all are benign.
  const sdMain = new StyleDictionary({
    log: { warnings: 'disabled' },
    include: [`${TOKENS}/spacing-primitives.json`],
    source: [
      `${TOKENS}/color-primitives.json`,
      `${TOKENS}/color-aliases-light.json`,
      `${TOKENS}/spacing-aliases.json`,
      `${TOKENS}/typography-primitives.json`,
      `${TOKENS}/typography-aliases-desktop.json`,
    ],
    platforms: {
      css: {
        transformGroup: 'caladan/css',
        buildPath: `${DIST}/css/`,
        files: [
          {
            destination: 'tokens.css',
            format: 'css/variables',
            filter: sourceOnly,
            options: { outputReferences: false },
          },
        ],
      },
    },
  });
  await sdMain.buildAllPlatforms();

  // 2. CSS dark mode — color alias overrides only
  const sdDark = new StyleDictionary({
    log: { warnings: 'disabled' },
    include: [`${TOKENS}/color-primitives.json`],
    source: [`${TOKENS}/color-aliases-dark.json`],
    platforms: {
      css: {
        transformGroup: 'caladan/css',
        buildPath: `${DIST}/css/`,
        files: [
          {
            destination: 'tokens-dark.css',
            format: 'caladan/css/dark-mode',
            filter: sourceOnly,
            options: { outputReferences: false },
          },
        ],
      },
    },
  });
  await sdDark.buildAllPlatforms();

  // 3. CSS mobile — typography alias overrides only
  const sdMobile = new StyleDictionary({
    log: { warnings: 'disabled' },
    include: [`${TOKENS}/typography-primitives.json`],
    source: [`${TOKENS}/typography-aliases-mobile.json`],
    platforms: {
      css: {
        transformGroup: 'caladan/css',
        buildPath: `${DIST}/css/`,
        files: [
          {
            destination: 'tokens-mobile.css',
            format: 'caladan/css/mobile',
            filter: sourceOnly,
            options: { outputReferences: false },
          },
        ],
      },
    },
  });
  await sdMobile.buildAllPlatforms();

  // 4. JS — all light-mode tokens as a flat map
  //    spacing-primitives included here (valid as JS object keys: '--16')
  const sdJS = new StyleDictionary({
    log: { warnings: 'disabled' },
    source: [
      `${TOKENS}/color-primitives.json`,
      `${TOKENS}/color-aliases-light.json`,
      `${TOKENS}/spacing-primitives.json`,
      `${TOKENS}/spacing-aliases.json`,
      `${TOKENS}/typography-primitives.json`,
      `${TOKENS}/typography-aliases-desktop.json`,
    ],
    platforms: {
      js: {
        transformGroup: 'caladan/css',
        buildPath: `${DIST}/js/`,
        files: [
          {
            destination: 'tokens.js',
            format: 'caladan/js/tokens',
            options: { outputReferences: false },
          },
        ],
      },
    },
  });
  await sdJS.buildAllPlatforms();

  console.log('\nDone. Output written to dist/css/ and dist/js/');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
