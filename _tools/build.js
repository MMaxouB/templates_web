#!/usr/bin/env node
/**
 * build.js — génère un dossier autonome livrable à partir d'une architecture
 * et d'un thème.
 *
 *   node _tools/build.js <famille>/<variante> <theme>
 *   node _tools/build.js 01-vitrine/03-sidebar-fixe dark-neon
 *   node _tools/build.js 12-systeme/16-style-guide --all-themes
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

const listThemes = () =>
  fs.readdirSync(path.join(CORE, 'themes'))
    .filter((f) => f.endsWith('.css'))
    .map((f) => f.replace(/\.css$/, ''))
    .sort();

/* ------------------------------------------------------------------ arguments */

const [target, themeArg] = process.argv.slice(2);

if (!target) {
  console.error('usage: node _tools/build.js <famille>/<variante> <theme|--all-themes>');
  console.error(`thèmes disponibles : ${listThemes().join(', ')}`);
  process.exit(1);
}

const [family, variant] = target.split('/');
if (!family || !variant) die(`cible attendue au format <famille>/<variante> — reçu « ${target} »`);

const srcDir = path.join(ROOT, 'templates', family, variant);
if (!fs.existsSync(srcDir)) die(`variante introuvable : templates/${family}/${variant}`);

const available = listThemes();
const themes = themeArg === '--all-themes' ? available : [themeArg];

if (!themeArg) die(`thème manquant. Disponibles : ${available.join(', ')}`);
for (const t of themes) {
  if (!available.includes(t)) die(`thème inconnu : ${t}. Disponibles : ${available.join(', ')}`);
}

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

/**
 * Réécrit les chemins des CSS partagés vers assets/css/ et retire les marqueurs
 * de développement. Volontairement littéral : on ne parse pas le HTML, on
 * remplace exactement les chaînes que la convention d'en-tête impose.
 */
const rewrite = (html) =>
  html
    .replace(/(?:\.\.\/)+_core\/reset\.css/g, 'assets/css/reset.css')
    .replace(/(?:\.\.\/)+_core\/tokens\.css/g, 'assets/css/tokens.css')
    .replace(/(?:\.\.\/)+_core\/themes\/[a-z0-9-]+\.css/g, 'assets/css/theme.css')
    .replace(/<html([^>]*?)\sclass="is-authoring"/g, '<html$1')
    .replace(/<html([^>]*?)\sclass="([^"]*?)\bis-authoring\b\s*([^"]*?)"/g,
             (_, a, b, c) => `<html${a} class="${(b + c).trim()}"`);

const built = [];

for (const theme of themes) {
  const outDir = path.join(DIST, `${label}-${num}--${theme}`);

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.cpSync(srcDir, outDir, { recursive: true });

  // Les fichiers de travail ne partent pas chez le client.
  for (const junk of ['meta.json', 'README.md', 'preview.png']) {
    fs.rmSync(path.join(outDir, junk), { force: true });
  }

  const cssDir = path.join(outDir, 'assets', 'css');
  fs.mkdirSync(cssDir, { recursive: true });
  fs.copyFileSync(path.join(CORE, 'reset.css'), path.join(cssDir, 'reset.css'));
  fs.copyFileSync(path.join(CORE, 'tokens.css'), path.join(cssDir, 'tokens.css'));
  fs.copyFileSync(path.join(CORE, 'themes', `${theme}.css`), path.join(cssDir, 'theme.css'));

  let pages = 0;
  let stubs = 0;
  for (const entry of fs.readdirSync(outDir)) {
    if (!entry.endsWith('.html')) continue;
    const file = path.join(outDir, entry);
    const html = fs.readFileSync(file, 'utf8');
    stubs += (html.match(/data-stub/g) || []).length;
    fs.writeFileSync(file, rewrite(html));
    pages += 1;
  }

  if (pages === 0) {
    console.warn(`  ⚠ aucune page HTML dans ${family}/${variant} — la variante est encore vide`);
  }

  built.push({ theme, outDir, pages, stubs });
}

/* -------------------------------------------------------------------- rapport */

console.log(`✓ ${family}/${variant} — ${built.length} thème(s)`);
for (const b of built) {
  const rel = path.relative(ROOT, b.outDir);
  console.log(`  ${b.theme.padEnd(16)} ${rel}  (${b.pages} page(s), ${b.stubs} lien(s) à créer)`);
}
console.log('\nOuvrir : double-clic sur index.html — aucune dépendance, aucun serveur requis.');
