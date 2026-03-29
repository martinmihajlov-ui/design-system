/**
 * export-typography-tokens.js
 *
 * Fetches all typography variables from Figma and writes three DTCG-format token files:
 *   tokens/typography-primitives.json        — raw values + figma-variable
 *   tokens/typography-aliases-desktop.json   — DTCG references, Desktop mode
 *   tokens/typography-aliases-mobile.json    — DTCG references, Mobile mode
 *
 * Usage: node scripts/export-typography-tokens.js
 * Env:   FIGMA_TOKEN, FIGMA_FILE_KEY
 *
 * NOTE: Figma Variables REST API requires Enterprise plan.
 *       This script is kept for future use if the plan is upgraded.
 *       Current export workflow uses MCP Bridge + figma_execute.
 */

'use strict';

const https = require('https');
const fs    = require('fs');
const path  = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const FIGMA_TOKEN    = process.env.FIGMA_TOKEN;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY || 'oWyNqsZJKJYF8SpZsBPb9P';
const TOKEN_VERSION  = require('../package.json').version;

const PRIMITIVES_COLL = 'VariableCollectionId:435:2354';
const ALIAS_COLL      = 'VariableCollectionId:13:267';
const PRIMITIVES_MODE = '435:0';   // single "All" mode
// Alias modes — Desktop and Mobile IDs from CLAUDE.md
// Mode IDs are resolved at runtime from the collection data (order: Desktop first, Mobile second)

const OUTPUT_DIR = path.join(__dirname, '..', 'tokens');

// Maps variable name prefix → DTCG $type for group-level typing
const GROUP_TYPES = {
  'font-family':       'string',
  'font-size':         'dimension',
  'font-weight':       'number',
  'letter-spacing':    'dimension',
  'line-height':       'dimension',
  'paragraph-spacing': 'dimension',
};

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

// ─── Value formatters ─────────────────────────────────────────────────────────

// Convert a raw Figma float value to the correct DTCG string for a given variable.
// Handles: font-weight (unitless number), letter-spacing (float precision bug),
// all other dimensions (integer px).
function formatPrimitiveValue(varName, resolvedType, rawValue) {
  if (resolvedType === 'STRING') return rawValue;

  const group = varName.split('/')[0];

  if (group === 'font-weight') {
    // Font weight is a unitless number token
    return Math.round(rawValue);
  }

  if (group === 'letter-spacing') {
    // Figma stores 0.4 as 0.4000000059604645 — round to 1 decimal place
    const rounded = Math.round(rawValue * 10) / 10;
    return `${rounded}px`;
  }

  // font-size, line-height, paragraph-spacing — integer px
  return `${Math.round(rawValue)}px`;
}

// ─── Token tree helpers ───────────────────────────────────────────────────────

// "font-size/300" → nested { "font-size": { "300": value } }
function setNested(obj, namePath, value) {
  const parts = namePath.split('/');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur[parts[i]]) cur[parts[i]] = {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = value;
}

// "font-size/300" → "{font-size.300}"
function toRef(varName) {
  return `{${varName.replace(/\//g, '.')}}`;
}

// Inject $type at group level after building the token tree.
// e.g. root["font-size"]["$type"] = "dimension"
function injectGroupTypes(root) {
  for (const [groupName, dtcgType] of Object.entries(GROUP_TYPES)) {
    if (root[groupName]) {
      root[groupName].$type = dtcgType;
    }
  }
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
  };

  const modeId = PRIMITIVES_MODE;

  for (const v of vars) {
    if (v.resolvedType !== 'FLOAT' && v.resolvedType !== 'STRING') continue;

    const raw = v.valuesByMode[modeId];
    if (raw === undefined || raw === null) continue;
    if (typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') continue;

    const token = {
      $value:      formatPrimitiveValue(v.name, v.resolvedType, raw),
      $extensions: {
        caladan: {
          'figma-variable': v.name,
        },
      },
    };

    if (v.description) token.$description = v.description;

    setNested(root, v.name, token);
  }

  injectGroupTypes(root);
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
  };

  for (const v of vars) {
    if (v.resolvedType !== 'FLOAT' && v.resolvedType !== 'STRING') continue;

    const val = v.valuesByMode[modeId];
    if (val === undefined || val === null) continue;

    let ref;
    if (typeof val === 'object' && val.type === 'VARIABLE_ALIAS') {
      const target = allVars[val.id];
      if (!target) {
        console.warn(`  ⚠  Unresolved alias: ${v.name} → ${val.id}`);
        continue;
      }
      ref = toRef(target.name);
    } else {
      // Direct value (not an alias) — format as primitive value
      ref = formatPrimitiveValue(v.name, v.resolvedType, val);
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

  injectGroupTypes(root);
  return root;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!FIGMA_TOKEN) throw new Error('FIGMA_TOKEN environment variable is required');

  console.log('\nFetching typography variables from Figma...');
  const data = await get(
    `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables/local`
  );

  if (data.error) throw new Error(`Figma API error: ${JSON.stringify(data)}`);

  const variables   = data.meta.variables;
  const collections = data.meta.variableCollections;

  const primVars  = Object.values(variables).filter(v => v.variableCollectionId === PRIMITIVES_COLL);
  const aliasVars = Object.values(variables).filter(v => v.variableCollectionId === ALIAS_COLL);

  console.log(`  ${primVars.length} primitive variables`);
  console.log(`  ${aliasVars.length} alias variables`);

  // Alias collection has two modes — Desktop (first) and Mobile (second)
  const aliasColl = collections[ALIAS_COLL];
  if (!aliasColl) throw new Error(`Alias collection not found: ${ALIAS_COLL}`);

  const modes = aliasColl.modes;
  if (modes.length < 2) throw new Error(`Expected 2 modes in alias collection, got ${modes.length}`);

  const desktopModeId = modes[0].modeId;
  const mobileModeId  = modes[1].modeId;

  console.log(`  Desktop mode: ${modes[0].name} (${desktopModeId})`);
  console.log(`  Mobile mode:  ${modes[1].name} (${mobileModeId})\n`);

  const primitives = buildPrimitives(primVars, collections[PRIMITIVES_COLL]);
  const desktop    = buildAliases(aliasVars, variables, desktopModeId, aliasColl, modes[0].name);
  const mobile     = buildAliases(aliasVars, variables, mobileModeId,  aliasColl, modes[1].name);

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const files = [
    { name: 'typography-primitives.json',      content: primitives },
    { name: 'typography-aliases-desktop.json', content: desktop    },
    { name: 'typography-aliases-mobile.json',  content: mobile     },
  ];

  for (const { name, content } of files) {
    const filePath = path.join(OUTPUT_DIR, name);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`  ✓  ${filePath}`);
  }

  console.log('\n✓  Typography tokens exported successfully.\n');
}

main().catch(err => {
  console.error('\n✗  Export failed:', err.message);
  process.exit(1);
});
