#!/usr/bin/env node
/**
 * sync-brand-to-tokens.cjs
 *
 * Syncs brand-guidelines.md colors → design-tokens.json → design-tokens.css
 *
 * Usage:
 *   node sync-brand-to-tokens.cjs
 *   node sync-brand-to-tokens.cjs --dry-run
 */

const fs = require('fs');
const path = require('path');

// Paths
const BRAND_GUIDELINES = 'docs/brand-guidelines.md';
const DESIGN_TOKENS_JSON = 'assets/design-tokens.json';
const DESIGN_TOKENS_CSS = 'assets/design-tokens.css';

/**
 * Extract color info from brand guidelines markdown
 */
function extractColorsFromMarkdown(content) {
  const colors = {
    primary: { name: 'primary', shades: {} },
    secondary: { name: 'secondary', shades: {} },
    accent: { name: 'accent', shades: {} }
  };

  // Match a "| Label | #hex |" markdown table row. Bold around the label
  // (**Label**) is optional, so this handles both the bundled starter template
  // ("| Primary Blue | #2563EB |") and bolded variants.
  const rowRe = /\|\s*\*{0,2}([^*|]+?)\*{0,2}\s*\|\s*#([A-Fa-f0-9]{6})\b/g;

  // 1) Quick Reference table — hex only, no parenthesized name required.
  const quickRef = {
    primary: /Primary Color\s*\|\s*#([A-Fa-f0-9]{6})/i,
    secondary: /Secondary Color\s*\|\s*#([A-Fa-f0-9]{6})/i,
    accent: /Accent Color\s*\|\s*#([A-Fa-f0-9]{6})/i
  };
  for (const key of Object.keys(quickRef)) {
    const m = content.match(quickRef[key]);
    if (m) colors[key].base = `#${m[1]}`;
  }

  // 2) Dedicated "### <Role> Colors" tables — assign base/dark/light by the
  //    row label keyword.
  const assignFromSection = (heading, target) => {
    const section = content.match(new RegExp(`### ${heading}[\\s\\S]*?(?=\\n###|$)`, 'i'));
    if (!section) return;
    for (const m of section[0].matchAll(rowRe)) {
      const label = m[1].trim().toLowerCase();
      const hex = `#${m[2]}`;
      if (label.includes('dark')) target.dark = hex;
      else if (label.includes('light')) target.light = hex;
      else if (!target.base) target.base = hex;
    }
  };
  assignFromSection('Primary Colors', colors.primary);
  assignFromSection('Secondary Colors', colors.secondary);
  assignFromSection('Accent Colors', colors.accent);

  // 3) Fallback: an accent swatch may live in another table (the starter
  //    lists "Accent Green" under Secondary Colors).
  if (!colors.accent.base) {
    for (const m of content.matchAll(rowRe)) {
      if (m[1].trim().toLowerCase().includes('accent')) {
        colors.accent.base = `#${m[2]}`;
        break;
      }
    }
  }

  return colors;
}

/**
 * Generate color scale from base color (simple approach)
 */
function generateColorScale(baseHex, darkHex, lightHex) {
  // Use provided shades or generate approximations
  return {
    "50": { "$value": lightHex || adjustBrightness(baseHex, 0.9), "$type": "color" },
    "100": { "$value": lightHex || adjustBrightness(baseHex, 0.8), "$type": "color" },
    "200": { "$value": adjustBrightness(baseHex, 0.6), "$type": "color" },
    "300": { "$value": adjustBrightness(baseHex, 0.4), "$type": "color" },
    "400": { "$value": adjustBrightness(baseHex, 0.2), "$type": "color" },
    "500": { "$value": baseHex, "$type": "color" },
    "600": { "$value": darkHex || adjustBrightness(baseHex, -0.15), "$type": "color" },
    "700": { "$value": adjustBrightness(baseHex, -0.3), "$type": "color" },
    "800": { "$value": adjustBrightness(baseHex, -0.45), "$type": "color" },
    "900": { "$value": adjustBrightness(baseHex, -0.6), "$type": "color" }
  };
}

/**
 * Adjust hex color brightness
 */
function adjustBrightness(hex, percent) {
  if (typeof hex !== 'string') return '#000000';
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + Math.round(255 * percent)));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + Math.round(255 * percent)));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + Math.round(255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0').toUpperCase()}`;
}

/**
 * Update design tokens JSON
 */
function updateDesignTokens(tokens, colors) {
  tokens.primitive = tokens.primitive || {};
  tokens.primitive.color = tokens.primitive.color || {};
  tokens.semantic = tokens.semantic || {};
  tokens.semantic.color = tokens.semantic.color || {};
  for (const role of ['primary', 'secondary', 'accent']) {
    const color = colors[role];
    if (!color.base) continue;
    tokens.primitive.color[role] = generateColorScale(color.base, color.dark, color.light);
    tokens.semantic.color[role] = { "$value": `{primitive.color.${role}.500}`, "$type": "color" };
  }
  // Do not rename the user's brand, delete unrelated colors, or remap status tokens.
  return tokens;
}

function renderCss(tokens) {
  const lines = [];
  function visit(value, keys) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return;
    if (Object.hasOwn(value, '$value')) {
      if (!keys.every(key => /^[a-zA-Z0-9_-]+$/.test(key))) {
        throw new Error('Unsupported token key; no output written');
      }
      const raw = value.$value;
      if (typeof raw !== 'string' && typeof raw !== 'number') return;
      const converted = String(raw).replace(/\{([a-zA-Z0-9_.-]+)\}/g,
        (_, reference) => `var(--${reference.split('.').join('-')})`);
      if (/[;{}<>\r\n]/.test(converted) || /url\s*\(|@import|expression\s*\(/i.test(converted)) {
        throw new Error('Unsupported CSS token value; no output written');
      }
      lines.push(`  --${keys.join('-')}: ${converted};`);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (!key.startsWith('$')) visit(child, [...keys, key]);
    }
  }
  visit(tokens, []);
  return `:root {\n${lines.join('\n')}\n}\n`;
}

/**
 * Main
 */
function main() {
  const dryRun = process.argv.includes('--dry-run');

  console.log('🔄 Syncing brand guidelines → design tokens\n');

  // Read brand guidelines
  const guidelinesPath = path.resolve(process.cwd(), BRAND_GUIDELINES);
  if (!fs.existsSync(guidelinesPath)) {
    console.error(`❌ Brand guidelines not found: ${guidelinesPath}`);
    process.exit(1);
  }
  const guidelinesContent = fs.readFileSync(guidelinesPath, 'utf-8');

  // Extract colors
  const colors = extractColorsFromMarkdown(guidelinesContent);
  console.log('📊 Extracted colors:');
  console.log(`   Primary: ${colors.primary.name} (${colors.primary.base})`);
  console.log(`   Secondary: ${colors.secondary.name} (${colors.secondary.base})`);
  console.log(`   Accent: ${colors.accent.name} (${colors.accent.base})\n`);

  // Read existing tokens
  const tokensPath = path.resolve(process.cwd(), DESIGN_TOKENS_JSON);
  let tokens = {};
  if (fs.existsSync(tokensPath)) {
    tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  }

  // Update tokens
  tokens = updateDesignTokens(tokens, colors);

  const css = renderCss(tokens);

  if (dryRun) {
    console.log('📋 Would update design-tokens.json:');
    console.log(JSON.stringify(tokens.primitive.color, null, 2).slice(0, 500) + '...');
    console.log('\n⏭️  Dry run - no files changed');
    return;
  }

  const cssPath = path.resolve(process.cwd(), DESIGN_TOKENS_CSS);
  for (const output of [tokensPath, cssPath]) {
    if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) {
      throw new Error('Refusing symlink output: ' + output);
    }
  }
  fs.mkdirSync(path.dirname(tokensPath), { recursive: true });
  fs.writeFileSync(tokensPath, JSON.stringify(tokens, null, 2) + '\n');
  fs.writeFileSync(cssPath, css);
  console.log(`Updated: ${DESIGN_TOKENS_JSON} and ${DESIGN_TOKENS_CSS}`);

  console.log('\n✨ Brand sync complete!');
}

main();
