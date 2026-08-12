#!/usr/bin/env node
/**
 * check-contrast.js — vérifie le contrat de contraste de tous les thèmes.
 *
 *   node _tools/check-contrast.js            # tous les thèmes
 *   node _tools/check-contrast.js dark-neon  # un seul
 *
 * Le contrat est décrit en tête de _core/tokens.css. Ce script le rend
 * exécutable : il lit les fichiers CSS, résout les var(), calcule les rapports
 * WCAG 2 et sort en code 1 si une paire descend sous 4.5:1.
 *
 * Le style-guide fait la même chose dans le navigateur, sur les couleurs
 * réellement rendues. Celui-ci sert avant de commiter, et en CI.
 *
 * Aucune dépendance npm.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CORE = path.join(ROOT, '_core');

/* --------------------------------------------------------------- couleurs */

const toRgb = (s) => {
  let h = s.replace('#', '').trim();
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};

const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

const ratio = (a, b) => {
  const x = luminance(toRgb(a));
  const y = luminance(toRgb(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/* ------------------------------------------------------------- extraction */

// On ne lit que les déclarations de premier niveau : hex direct ou var(--x).
const parse = (file) => {
  const text = fs.readFileSync(file, 'utf8');
  const out = {};
  for (const m of text.matchAll(/^\s*(--[a-z-]+):\s*(#[0-9a-fA-F]{3,8}|var\(\s*--[a-z-]+\s*\))\s*;/gm)) {
    out[m[1]] = m[2].trim();
  }
  return out;
};

// Résout les chaînes de var() — cinq niveaux suffisent largement.
const resolve = (tokens, name, depth = 0) => {
  const v = tokens[name];
  if (!v || depth > 5) return null;
  const ref = v.match(/^var\(\s*(--[a-z-]+)\s*\)$/);
  return ref ? resolve(tokens, ref[1], depth + 1) : v;
};

/* ---------------------------------------------------------------- contrat */

const PAIRS = [
  ['--fg', '--bg'],
  ['--fg', '--bg-elevated'],
  ['--fg', '--bg-sunken'],
  ['--fg-muted', '--bg'],
  ['--fg-muted', '--bg-elevated'],
  ['--fg-muted', '--bg-sunken'],
  ['--fg-subtle', '--bg'],
  ['--fg-subtle', '--bg-elevated'],
  ['--fg-subtle', '--bg-sunken'],
  ['--accent-text', '--bg'],
  ['--accent-text', '--bg-elevated'],
  ['--accent-fg', '--accent'],
  ['--success', '--bg'],
  ['--warning', '--bg'],
  ['--danger', '--bg'],
  ['--info', '--bg'],
];

const AA = 4.5;

/* ------------------------------------------------------------------- run */

const base = parse(path.join(CORE, 'tokens.css'));
const only = process.argv[2];

let themes = fs.readdirSync(path.join(CORE, 'themes'))
  .filter((f) => f.endsWith('.css'))
  .map((f) => f.replace(/\.css$/, ''))
  .sort();

if (only) {
  if (!themes.includes(only)) {
    console.error(`✗ thème inconnu : ${only}. Disponibles : ${themes.join(', ')}`);
    process.exit(1);
  }
  themes = [only];
}

let failures = 0;
let unresolved = 0;

for (const theme of themes) {
  const tokens = { ...base, ...parse(path.join(CORE, 'themes', `${theme}.css`)) };
  const bad = [];

  for (const [fgName, bgName] of PAIRS) {
    const fg = resolve(tokens, fgName);
    const bg = resolve(tokens, bgName);

    if (!fg || !bg) {
      console.log(`  ?  ${fgName} sur ${bgName} — non résolu`);
      unresolved += 1;
      continue;
    }

    const r = ratio(fg, bg);
    if (r < AA) bad.push({ fgName, bgName, fg, bg, r });
  }

  if (bad.length === 0) {
    console.log(`✓ ${theme} — ${PAIRS.length} paires conformes AA`);
  } else {
    console.log(`✗ ${theme} — ${bad.length} paire(s) sous ${AA}:1`);
    for (const b of bad) {
      console.log(
        `    ${b.r.toFixed(2).padStart(5)}:1  ${b.fgName} sur ${b.bgName}` +
        `   ${b.fg} / ${b.bg}`
      );
    }
    failures += bad.length;
  }
}

if (unresolved) console.log(`\n${unresolved} token(s) non résolu(s) — vérifier _core/tokens.css`);

if (failures || unresolved) {
  console.log('\nRappel : --accent est une SURFACE, seul --accent-text doit être lisible sur --bg.');
  process.exit(1);
}

console.log(`\n${themes.length} thème(s) conformes.`);
