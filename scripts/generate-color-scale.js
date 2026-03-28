/**
 * generate-color-scale.js
 *
 * Generates an 11-step (50–950) perceptual color scale from a single brand hex.
 * Uses OKLCH throughout for perceptual uniformity.
 *
 * Usage: node scripts/generate-color-scale.js
 * Output: tokens/color-primitives.json
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── Config ───────────────────────────────────────────────────────────────────

const BRAND_HEX  = '#606FF4';
const COLOR_NAME = 'brand';
const STEPS      = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Zone-based L gaps (OKLCH L, 0–1 scale)
// Using midpoint of each specified range
const GAP = {
  lightTints: 0.050,  // 4–6%  → steps 50–200
  working:    0.080,  // 5–11% → steps 200–700
  dark:       0.100,  // 8–12% → steps 700–950
};

// Gaussian sigma: tuned so chroma at positions 0 and 10 ≈ 10% of peak
// sigma = sqrt( 0.5 * 5² / -ln(0.10) ) ≈ 2.33
const GAUSSIAN_SIGMA = Math.sqrt((0.5 * 25) / -Math.log(0.10));

// ─── sRGB ↔ Linear ────────────────────────────────────────────────────────────

function sRGBToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSRGB(c) {
  return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;
}

// ─── sRGB → OKLCH ─────────────────────────────────────────────────────────────

function sRGBToOKLCH(r, g, b) {
  const R = sRGBToLinear(r), G = sRGBToLinear(g), B = sRGBToLinear(b);
  // Linear sRGB → LMS
  const l = 0.4122214708*R + 0.5363325363*G + 0.0514459929*B;
  const m = 0.2119034982*R + 0.6806995451*G + 0.1073969566*B;
  const s = 0.0883024619*R + 0.2817188376*G + 0.6299787005*B;
  // Cube root
  const lp = Math.cbrt(l), mp = Math.cbrt(m), sp = Math.cbrt(s);
  // LMS' → OKLab
  const L  =  0.2104542553*lp + 0.7936177850*mp - 0.0040720468*sp;
  const a  =  1.9779984951*lp - 2.4285922050*mp + 0.4505937099*sp;
  const bk =  0.0259040371*lp + 0.7827717662*mp - 0.8086757660*sp;
  const C  = Math.sqrt(a*a + bk*bk);
  const H  = Math.atan2(bk, a) * 180 / Math.PI;
  return { L, C, H: H < 0 ? H + 360 : H };
}

// ─── OKLCH → Linear sRGB (raw, unclamped — used for gamut testing) ────────────

function oklchToLinearRGB(L, C, H) {
  const hr = H * Math.PI / 180;
  const a  = C * Math.cos(hr);
  const bk = C * Math.sin(hr);
  const lp = L + 0.3963377774*a + 0.2158037573*bk;
  const mp = L - 0.1055613458*a - 0.0638541728*bk;
  const sp = L - 0.0894841775*a - 1.2914855480*bk;
  const lv = lp*lp*lp, mv = mp*mp*mp, sv = sp*sp*sp;
  return {
    R:  4.0767416621*lv - 3.3077115913*mv + 0.2309699292*sv,
    G: -1.2684380046*lv + 2.6097574011*mv - 0.3413193965*sv,
    B: -0.0041960863*lv - 0.7034186147*mv + 1.7076147010*sv,
  };
}

// ─── OKLCH → sRGB hex (clamped — used for final output) ──────────────────────

function oklchToSRGB(L, C, H) {
  const { R, G, B } = oklchToLinearRGB(L, C, H);
  return {
    r: Math.min(1, Math.max(0, linearToSRGB(R))),
    g: Math.min(1, Math.max(0, linearToSRGB(G))),
    b: Math.min(1, Math.max(0, linearToSRGB(B))),
  };
}

function toHex(r, g, b) {
  return '#' + [r, g, b]
    .map(c => Math.round(Math.min(1, Math.max(0, c)) * 255).toString(16).padStart(2, '0').toUpperCase())
    .join('');
}

// ─── Gamut check ──────────────────────────────────────────────────────────────

const GAMUT_TOL = 0.001;

function isInGamut(L, C, H) {
  const { R, G, B } = oklchToLinearRGB(L, C, H);
  return R >= -GAMUT_TOL && R <= 1 + GAMUT_TOL
      && G >= -GAMUT_TOL && G <= 1 + GAMUT_TOL
      && B >= -GAMUT_TOL && B <= 1 + GAMUT_TOL;
}

// ─── Gamut clamp with optional H drift ───────────────────────────────────────

function clampToGamut(L, rawC, baseH) {
  if (isInGamut(L, rawC, baseH)) {
    return { C: rawC, H: baseH, hDrift: 0, cReductionPct: 0 };
  }

  // Reduce C in 0.001 steps, hold L and H
  let C = rawC;
  while (C > 0 && !isInGamut(L, C, baseH)) C -= 0.001;
  C = Math.max(0, C);

  const cReductionPct = rawC > 0 ? Math.round(((rawC - C) / rawC) * 1000) / 10 : 0;

  // If C dropped more than 20%, try H drift ±5° in 0.5° steps
  if (cReductionPct > 20 && rawC > 0) {
    let bestC = C;
    let bestH = baseH;

    for (let step = 0.5; step <= 5.0; step += 0.5) {
      for (const dir of [1, -1]) {
        const testH = (baseH + dir * step + 360) % 360;
        let testC = rawC;
        while (testC > 0 && !isInGamut(L, testC, testH)) testC -= 0.001;
        testC = Math.max(0, testC);
        if (testC > bestC) { bestC = testC; bestH = testH; }
      }
    }

    const hDrift = Math.round((bestH - baseH) * 10) / 10;
    return { C: bestC, H: bestH, hDrift, cReductionPct };
  }

  return { C, H: baseH, hDrift: 0, cReductionPct };
}

// ─── Snap brand L to nearest step ────────────────────────────────────────────
//
// Maps the 11 steps to positions 0–10 and distributes L linearly between
// L_MAX (pos 0, step 50) and L_MIN (pos 10, step 950). The brand color
// snaps to whichever position's reference L is closest to its actual L.

function snapToStep(L) {
  const L_MAX = 0.975, L_MIN = 0.189;
  const refL  = STEPS.map((_, i) => L_MAX - (i / (STEPS.length - 1)) * (L_MAX - L_MIN));
  let minDist = Infinity, snapIdx = 0;
  refL.forEach((ref, i) => {
    const d = Math.abs(L - ref);
    if (d < minDist) { minDist = d; snapIdx = i; }
  });
  return { step: STEPS[snapIdx], index: snapIdx };
}

// ─── Zone-based L distribution ───────────────────────────────────────────────
//
// Gap rule: a gap belongs to the zone of the DARKER (higher step-number) step.
//   • Gap between steps X and Y (Y > X):
//       Y > 700  → dark gap
//       Y > 200  → working gap   (includes the 200→300 zone boundary)
//       Y ≤ 200  → light gap
//
// This places the visible zone-boundary jump at 200→300.

function computeLValues(anchorIndex, anchorL) {
  const L = new Array(STEPS.length).fill(null);
  L[anchorIndex] = anchorL;

  // Lighter steps (going up in L)
  for (let i = anchorIndex - 1; i >= 0; i--) {
    const darkerStep = STEPS[i + 1];
    const gap = darkerStep > 700 ? GAP.dark
              : darkerStep > 200 ? GAP.working
              :                    GAP.lightTints;
    L[i] = Math.min(0.999, L[i + 1] + gap);
  }

  // Darker steps (going down in L)
  for (let i = anchorIndex + 1; i < STEPS.length; i++) {
    const thisStep = STEPS[i];
    const gap = thisStep > 700 ? GAP.dark : GAP.working;
    L[i] = Math.max(0.001, L[i - 1] - gap);
  }

  return L;
}

// ─── Gaussian C curve ─────────────────────────────────────────────────────────
//
// C(pos) = peakC × exp( −0.5 × ((pos − anchorPos) / sigma)² )
// Symmetric around the anchor position; tapers to ~10% of peak at pos 0 and 10.

function computeCValues(anchorIndex, peakC) {
  return STEPS.map((_, i) =>
    Math.max(0, peakC * Math.exp(-0.5 * Math.pow((i - anchorIndex) / GAUSSIAN_SIGMA, 2)))
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function generateColorScale(hex, colorName) {
  // 1. Parse input hex → sRGB → OKLCH
  const h    = hex.replace('#', '');
  const r0   = parseInt(h.slice(0, 2), 16) / 255;
  const g0   = parseInt(h.slice(2, 4), 16) / 255;
  const b0   = parseInt(h.slice(4, 6), 16) / 255;
  const brand = sRGBToOKLCH(r0, g0, b0);

  // 2. Snap to step
  const { step: anchorStep, index: anchorIndex } = snapToStep(brand.L);

  // 3. Compute L values (zone-based)
  const lValues = computeLValues(anchorIndex, brand.L);

  // 4. Compute C values (Gaussian, peak = brand C)
  const rawC = computeCValues(anchorIndex, brand.C);

  // 5. Build each step
  const scale = STEPS.map((step, i) => {
    const L    = lValues[i];
    const H    = brand.H;   // stable H as baseline

    const { C, H: finalH, hDrift, cReductionPct } = clampToGamut(L, rawC[i], H);
    const { r, g, b } = oklchToSRGB(L, C, finalH);

    return {
      figma_variable: `${colorName}/${step}`,
      oklch: {
        L: Math.round(L    * 10000) / 10000,
        C: Math.round(C    * 10000) / 10000,
        H: Math.round(finalH * 10)  / 10,
      },
      hex: toHex(r, g, b),
      rgb: {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
      },
      meta: {
        step,
        anchor:          step === anchorStep,
        gamut_clamped:   cReductionPct > 0,
        c_reduction_pct: cReductionPct,
        h_drift_deg:     hDrift,
      },
    };
  });

  return {
    meta: {
      color_name:    colorName,
      input_hex:     hex,
      input_oklch: {
        L: Math.round(brand.L * 10000) / 10000,
        C: Math.round(brand.C * 10000) / 10000,
        H: Math.round(brand.H * 10)    / 10,
      },
      anchor_step:   anchorStep,
      generated_at:  new Date().toISOString(),
      algorithm: {
        snap:             'linear_reference_scale',
        l_distribution:   'zone_based',
        zone_boundary:    '200→300',
        gaps: {
          light_tints_50_200:  GAP.lightTints,
          working_200_700:     GAP.working,
          dark_700_950:        GAP.dark,
        },
        c_model:          'gaussian',
        gaussian_sigma:   Math.round(GAUSSIAN_SIGMA * 10000) / 10000,
        gaussian_target:  'C at step 50 and 950 ≈ 10% of peak',
        h_strategy:       'stable, drift ≤ ±5° only if gamut clamping exceeds 20% C reduction',
      },
    },
    scale,
  };
}

// ─── Run & write ──────────────────────────────────────────────────────────────

const result    = generateColorScale(BRAND_HEX, COLOR_NAME);
const outputDir = path.join(__dirname, '..', 'tokens');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, 'color-primitives.json');
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

// ─── Console summary ──────────────────────────────────────────────────────────

const m = result.meta;
console.log(`\n✓  ${m.color_name} scale generated from ${m.input_hex}`);
console.log(`   OKLCH input : L=${m.input_oklch.L}  C=${m.input_oklch.C}  H=${m.input_oklch.H}°`);
console.log(`   Anchor step : ${m.anchor_step}`);
console.log(`   Gaussian σ  : ${m.algorithm.gaussian_sigma}\n`);
console.log('   Step │ Figma variable │ Hex      │    L       C       H°  │ Clamped   H-drift');
console.log('   ─────┼────────────────┼──────────┼────────────────────────┼──────────────────');

result.scale.forEach(s => {
  const tag     = s.meta.anchor ? ' ◀ anchor' : '';
  const clamped = s.meta.gamut_clamped ? `${s.meta.c_reduction_pct}%` : '—';
  const drift   = s.meta.h_drift_deg  ? `${s.meta.h_drift_deg}°`     : '—';
  console.log(
    `   ${String(s.meta.step).padStart(4)} │ ${s.figma_variable.padEnd(14)} │ ${s.hex} │ ` +
    `${String(s.oklch.L).padEnd(7)} ${String(s.oklch.C).padEnd(7)} ${String(s.oklch.H).padEnd(6)} │ ` +
    `${clamped.padEnd(8)}   ${drift}${tag}`
  );
});

console.log(`\n✓  Saved → ${outputPath}\n`);
