#!/usr/bin/env node
/**
 * build.js — génère un dossier autonome livrable à partir d'une architecture
 * et d'un habillage.
 *
 *   node _tools/build.js <famille>/<variante> <habillage>
 *
 * Un habillage peut prendre trois formes :
 *
 *   --preset quotidien              un préréglage de _core/presets.json
 *   --direction X --palette Y       la combinaison directement
 *   modern-light                    un ancien thème monolithique (déprécié)
 *
 * Et trois raccourcis :
 *
 *   --all-presets                   tous les préréglages
 *   --all-themes                    tous les anciens thèmes
 *   --all                           les deux
 *
 * Exemples :
 *   node _tools/build.js 12-systeme/16-style-guide --preset console
 *   node _tools/build.js 01-vitrine/03-sidebar-fixe --direction presse-imprimee --palette encre-journal
 *   node _tools/build.js 12-systeme/16-style-guide --all-presets
 *
 * Le dépôt garde le HTML d'une architecture en un seul exemplaire. Ce script
 * produit la copie autonome : les CSS partagés sont recopiés dans assets/css/
 * et les <link> réécrits en conséquence. Le résultat n'a aucune dépendance et
 * s'ouvre en double-cliquant sur index.html.
 *
 * Aucune dépendance npm. Node 16.7+ (fs.cpSync).
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CORE = path.join(ROOT, '_core');
const DIST = path.join(ROOT, 'dist');

const die = (msg) => {
  console.error(`✗ ${msg}`);
  process.exit(1);
};

const listCss = (dir) => {
  const full = path.join(CORE, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter((f) => f.endsWith('.css'))
    .map((f) => f.replace(/\.css$/, ''))
    .sort();
};

const listThemes = () => listCss('themes');
const listDirections = () => listCss('directions');
const listPalettes = () => listCss('palettes');

const readPresets = () => {
  const file = path.join(CORE, 'presets.json');
  if (!fs.existsSync(file)) return {};
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8')).presets || {};
  } catch {
    die('_core/presets.json illisible');
  }
};

/* ------------------------------------------------------------------ arguments */

const argv = process.argv.slice(2);
const target = argv[0];

const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? null : argv[i + 1];
};
const has = (name) => argv.includes(`--${name}`);

const presets = readPresets();

const usage = () => {
  console.error('usage: node _tools/build.js <famille>/<variante> <habillage>');
  console.error('');
  console.error('  --preset <nom>                  ' + Object.keys(presets).join(', '));
  console.error('  --direction <x> --palette <y>');
  console.error('  --all-presets | --all-themes | --all');
  console.error('');
  console.error(`  directions : ${listDirections().join(', ') || '—'}`);
  console.error(`  palettes   : ${listPalettes().join(', ') || '—'}`);
  console.error(`  thèmes     : ${listThemes().join(', ') || '—'}  (déprécié)`);
  process.exit(1);
};

if (!target || target.startsWith('--')) usage();

const [family, variant] = target.split('/');
if (!family || !variant) die(`cible attendue au format <famille>/<variante> — reçu « ${target} »`);

const srcDir = path.join(ROOT, 'templates', family, variant);
if (!fs.existsSync(srcDir)) die(`variante introuvable : templates/${family}/${variant}`);

/**
 * Un habillage résolu :
 *   { slug, direction?, palette?, theme? }
 * `slug` sert à nommer le dossier de sortie.
 */
const habillages = [];

const addPreset = (name) => {
  const p = presets[name];
  if (!p) die(`préréglage inconnu : ${name}. Disponibles : ${Object.keys(presets).join(', ')}`);
  if (!listDirections().includes(p.direction)) die(`direction manquante pour « ${name} » : ${p.direction}`);
  if (!listPalettes().includes(p.palette)) die(`palette manquante pour « ${name} » : ${p.palette}`);
  habillages.push({ slug: name, direction: p.direction, palette: p.palette });
};

if (has('all') || has('all-presets')) {
  Object.keys(presets).forEach(addPreset);
}
if (has('all') || has('all-themes')) {
  for (const t of listThemes()) habillages.push({ slug: t, theme: t });
}

if (flag('preset')) addPreset(flag('preset'));

if (flag('direction') || flag('palette')) {
  const d = flag('direction');
  const p = flag('palette');
  if (!d || !p) die('--direction et --palette vont ensemble');
  if (!listDirections().includes(d)) die(`direction inconnue : ${d}. Disponibles : ${listDirections().join(', ')}`);
  if (!listPalettes().includes(p)) die(`palette inconnue : ${p}. Disponibles : ${listPalettes().join(', ')}`);
  habillages.push({ slug: `${d}+${p}`, direction: d, palette: p });
}

// Forme historique : un thème nommé en second argument.
const bare = argv[1];
if (bare && !bare.startsWith('--') && argv[0] !== bare) {
  if (!listThemes().includes(bare)) {
    die(`thème inconnu : ${bare}.\n  Thèmes : ${listThemes().join(', ')}\n  Préréglages : ${Object.keys(presets).join(', ')} (via --preset)`);
  }
  habillages.push({ slug: bare, theme: bare });
}

if (habillages.length === 0) usage();

/* ---------------------------------------------------------------- métadonnées */

const metaPath = path.join(srcDir, 'meta.json');
let meta = {};
if (fs.existsSync(metaPath)) {
  const raw = fs.readFileSync(metaPath, 'utf8').trim();
  if (raw) {
    try {
      meta = JSON.parse(raw);
    } catch {
      die(`meta.json illisible dans ${family}/${variant}`);
    }
  }
}

const label = family.replace(/^\d+-/, '');
const num = meta.numero || variant.split('-')[0];

/* ----------------------------------------------------------------- génération */

const LINK_PALETTE = '<link rel="stylesheet" href="assets/css/palette.css" data-palette-link>';
const LINK_DIRECTION = '<link rel="stylesheet" href="assets/css/direction.css" data-direction-link>';

/**
 * Réécrit les chemins des CSS partagés vers assets/css/ et retire les marqueurs
 * de développement. Volontairement littéral : on ne parse pas le HTML, on
 * remplace exactement les chaînes que la convention d'en-tête impose.
 */
const rewrite = (html, hab) => {
  let out = html
    .replace(/(?:\.\.\/)+_core\/reset\.css/g, 'assets/css/reset.css')
    .replace(/(?:\.\.\/)+_core\/tokens\.css/g, 'assets/css/tokens.css');

  if (hab.theme) {
    // Habillage monolithique : un seul fichier.
    out = out.replace(/(?:\.\.\/)+_core\/themes\/[a-z0-9-]+\.css/g, 'assets/css/theme.css');
  } else {
    // Habillage en deux couches. Une variante encore écrite avec un <link>
    // de thème unique voit ce lien remplacé par les deux nouveaux.
    out = out.replace(
      /<link\b[^>]*?(?:\.\.\/)+_core\/themes\/[a-z0-9-]+\.css[^>]*>/g,
      `${LINK_PALETTE}\n  ${LINK_DIRECTION}`
    );
    out = out
      .replace(/(?:\.\.\/)+_core\/palettes\/[a-z0-9-]+\.css/g, 'assets/css/palette.css')
      .replace(/(?:\.\.\/)+_core\/directions\/[a-z0-9-]+\.css/g, 'assets/css/direction.css');
  }

  return out
    .replace(/<html([^>]*?)\sclass="is-authoring"/g, '<html$1')
    .replace(/<html([^>]*?)\sclass="([^"]*?)\bis-authoring\b\s*([^"]*?)"/g,
             (_, a, b, c) => `<html${a} class="${(b + c).trim()}"`);
};

const built = [];

for (const hab of habillages) {
  const outDir = path.join(DIST, `${label}-${num}--${hab.slug}`);

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(srcDir, outDir, { recursive: true });

  // Les fichiers de travail ne partent pas chez le client.
  for (const junk of ['meta.json', 'README.md', 'preview.png', 'previews']) {
    fs.rmSync(path.join(outDir, junk), { recursive: true, force: true });
  }

  const cssDir = path.join(outDir, 'assets', 'css');
  fs.mkdirSync(cssDir, { recursive: true });
  fs.copyFileSync(path.join(CORE, 'reset.css'), path.join(cssDir, 'reset.css'));
  fs.copyFileSync(path.join(CORE, 'tokens.css'), path.join(cssDir, 'tokens.css'));

  if (hab.theme) {
    fs.copyFileSync(path.join(CORE, 'themes', `${hab.theme}.css`), path.join(cssDir, 'theme.css'));
  } else {
    fs.copyFileSync(path.join(CORE, 'palettes', `${hab.palette}.css`), path.join(cssDir, 'palette.css'));
    fs.copyFileSync(path.join(CORE, 'directions', `${hab.direction}.css`), path.join(cssDir, 'direction.css'));
  }

  let pages = 0;
  let stubs = 0;
  for (const entry of fs.readdirSync(outDir)) {
    if (!entry.endsWith('.html')) continue;
    const file = path.join(outDir, entry);
    const html = fs.readFileSync(file, 'utf8');
    stubs += (html.match(/data-stub/g) || []).length;
    fs.writeFileSync(file, rewrite(html, hab));
    pages += 1;
  }

  if (pages === 0) {
    console.warn(`  ⚠ aucune page HTML dans ${family}/${variant} — la variante est encore vide`);
  }

  built.push({ hab, outDir, pages, stubs });
}

/* -------------------------------------------------------------------- rapport */

console.log(`✓ ${family}/${variant} — ${built.length} habillage(s)`);
for (const b of built) {
  const rel = path.relative(ROOT, b.outDir);
  const kind = b.hab.theme ? 'thème (déprécié)' : `${b.hab.direction} × ${b.hab.palette}`;
  console.log(`  ${b.hab.slug.padEnd(22)} ${rel}`);
  console.log(`  ${''.padEnd(22)} ${kind} — ${b.pages} page(s), ${b.stubs} lien(s) à créer`);
}
console.log('\nOuvrir : double-clic sur index.html — aucune dépendance, aucun serveur requis.');
