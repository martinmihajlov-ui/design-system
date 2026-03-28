/**
 * export-color-tokens.js
 *
 * Fetches all color variables from Figma and writes three DTCG-format token files:
 *   tokens/color-primitives.json    — raw OKLCH + hex + rgb + figma-variable
 *   tokens/color-aliases-light.json — DTCG references, light mode
 *   tokens/color-aliases-dark.json  — DTCG references, dark mode
 *
 * Usage: node scripts/export-color-tokens.js
 * Env:   FIGMA_TOKEN, FIGMA_FILE_KEY
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || 'oWyNqsZJKJYF8SpZsBPb9P';
const TOKEN_VERSION  = require('../package.json').version;

const PRIMITIVES_COLL = 'VariableCollectionId:35:367';
const ALIAS_COLL      = 'VariableCollectionId:364:1234';
const LIGHT_MODE      = '364:0';
const DARK_MODE       = '422:0';

const OUTPUT_DIR = path.join(__dirname, '..', 'tokens');

// ─── HTTP helper ──────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'X-Figma-Token': FIGMA_TOKEN } }, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
      res.on('error', reject);
    });
  });
}

// ─── Color math: sRGB → OKLCH ────────────────────────────────────────────────

function sRGBToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function sRGBToOKLCH(r, g, b) {
  const R = sRGBToLinear(r), G = sRGBToLinear(g), B = sRGBToLinear(b);
  const l = 0.4122214708*R + 0.5363325363*G + 0.0514459929*B;
  const m = 0.2119034982*R + 0.6806995451*G + 0.1073969566*B;
  const s = 0.0883024619*R + 0.2817188376*G + 0.6299787005*B;
  const lp = Math.cbrt(l), mp = Math.cbrt(m), sp = Math.cbrt(s);
  const L  =  0.2104542553*lp + 0.7936177850*mp - 0.0040720468*sp;
  const a  =  1.9779984951*lp - 2.4285922050*mp + 0.4505937099*sp;
  const bk =  0.0259040371*lp + 0.7827717662*mp - 0.8086757660*sp;
  const C  = Math.sqrt(a*a + bk*bk);
  const H  = Math.atan2(bk, a) * 180 / Math.PI;
  return {
    L: Math.round(L * 10000) / 10000,
    C: Math.round(C * 10000) / 10000,
    H: Math.round((H < 0 ? H + 360 : H) * 10) / 10,
  };
}

function toHex(r, g, b, a = 1) {
  const hex = [r, g, b]
    .map(c => Math.round(c * 255).toString(16).padStart(2, '0').toUpperCase())
    .join('');
  if (a < 1) {
    const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0').toUpperCase();
    return `#${hex}${alphaHex}`;
  }
  return `#${hex}`;
}

function toOklchString(L, C, H, a = 1) {
  if (a < 1) return `oklch(${L} ${C} ${H} / ${Math.round(a * 100)}%)`;
  return `oklch(${L} ${C} ${H})`;
}

// ─── Token tree helpers ───────────────────────────────────────────────────────

// "indigo/700" → nested { indigo: { "700": value } }
function setNested(obj, namePath, value) {
  const parts = namePath.split('/');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// "indigo/700" → "{indigo.700}"
function toRef(varName) {
  return `{${varName.replace(/\//g, '.')}}`;
}

// ─── Primitive token builder ──────────────────────────────────────────────────

function buildPrimitives(vars, collection) {
  const root = {
    $metadata: {
      version:      TOKEN_VERSION,
      generated_at: new Date().toISOString(),
      source:       `Figma · ${collection.name} · ${collection.id}`,
      figma_file:   FIGMA_FILE_KEY,
    },
    $type: 'color',
  };

  const modeId = collection.modes[0].modeId;

  for (const v of vars) {
    if (v.resolvedType !== 'COLOR') continue;

    const rgba = v.valuesByMode[modeId];
    if (!rgba || rgba.type === 'VARIABLE_ALIAS') continue;

    const { r, g, b, a = 1 } = rgba;
    const { L, C, H } = sRGBToOKLCH(r, g, b);

    const token = {
      $value:      toOklchString(L, C, H, a),
      $extensions: {
        caladan: {
          hex:               toHex(r, g, b, a),
          rgb:               { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) },
          'figma-variable':  v.name,
        },
      },
    };

    if (v.description) token.$description = v.description;

    setNested(root, v.name, token);
  }

  return root;
}

// ─── Alias token builder ──────────────────────────────────────────────────────

function buildAliases(vars, allVars, modeId, collection, modeName) {
  const root = {
    $metadata: {
      version:      TOKEN_VERSION,
      generated_at: new Date().toISOString(),
      source:       `Figma · ${collection.name} · ${collection.id} · ${modeName}`,
      figma_file:   FIGMA_FILE_KEY,
    },
    $type: 'color',
  };

  for (const v of vars) {
    if (v.resolvedType !== 'COLOR') continue;

    const val = v.valuesByMode[modeId];
    if (!val) continue;

    let ref;
    if (val.type === 'VARIABLE_ALIAS') {
      const target = allVars[val.id];
      if (!target) {
        console.warn(`  ⚠  Unresolved alias: ${v.name} → ${val.id}`);
        continue;
      }
      ref = toRef(target.name);
    } else {
      // Direct color — convert and store as OKLCH string
      const { r, g, b, a = 1 } = val;
      const { L, C, H } = sRGBToOKLCH(r, g, b);
      ref = toOklchString(L, C, H, a);
    }

    const token = {
      $value:      ref,
      $extensions: {
        caladan: {
          'figma-variable': v.name,
        },
      },
    };

    if (v.description) token.$description = v.description;

    setNested(root, v.name, token);
  }

  return root;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!FIGMA_TOKEN) throw new Error('FIGMA_TOKEN environment variable is required');

  console.log('\nFetching color variables from Figma...');
  const data = await get(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`
  );

  if (data.error) throw new Error(`Figma API error: ${JSON.stringify(data)}`);

  const variables   = data.meta.variables;
  const collections = data.meta.variableCollections;

  const primVars  = Object.values(variables).filter(v => v.variableCollectionId === PRIMITIVES_COLL);
  const aliasVars = Object.values(variables).filter(v => v.variableCollectionId === ALIAS_COLL);

  console.log(`  ${primVars.length} primitive variables`);
  console.log(`  ${aliasVars.length} alias variables\n`);

  const primitives = buildPrimitives(primVars, collections[PRIMITIVES_COLL]);
  const light      = buildAliases(aliasVars, variables, LIGHT_MODE, collections[ALIAS_COLL], 'Light');
  const dark       = buildAliases(aliasVars, variables, DARK_MODE,  collections[ALIAS_COLL], 'Dark');

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = [
    { name: 'color-primitives.json',    content: primitives },
    { name: 'color-aliases-light.json', content: light      },
    { name: 'color-aliases-dark.json',  content: dark       },
  ];

  for (const { name, content } of files) {
    const filePath = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`  ✓  ${filePath}`);
  }

  console.log('\n✓  Color tokens exported successfully.\n');
}

main().catch(err => {
  console.error('\n✗  Export failed:', err.message);
  process.exit(1);
});
