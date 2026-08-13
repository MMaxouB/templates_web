#!/usr/bin/env node
/**
 * check-constraints.js — rend les contraintes créatives opposables.
 *
 *   node _tools/check-constraints.js                     toutes les variantes
 *   node _tools/check-constraints.js 12-systeme/10-...    une seule
 *   node _tools/check-constraints.js --budget            budget anti-LLM seul
 *
 * POURQUOI
 * Une contrainte écrite dans un README est une intention. Elle survit trois
 * variantes puis se dissout : on garde la carte en enlevant l'ombre, on garde
 * le hero en le décentrant de 4 %. Ici, une contrainte est un test — elle
 * passe ou elle échoue.
 *
 * CE QU'IL VÉRIFIE
 *   1. règle d'attribution     ≥ 2 contraintes, dont ≥ 1 structurelle
 *   2. contraintes déclarées   motifs interdits/exigés dans le CSS et le HTML
 *   3. budget anti-LLM         somme des réflexes détectés ≤ budget
 *   4. hygiène                 couches CSS, couleurs en dur, ressources externes
 *
 * Les vérifications de type `metrique` ont besoin des mesures de
 * _tools/screenshot.js (previews/<dossier>/probe.json). Elles sont ignorées
 * avec un avertissement si les captures n'ont pas été produites.
 *
 * Aucune dépendance npm.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const BENCHMARK = path.join(ROOT, 'benchmark');
const PREVIEWS = path.join(ROOT, 'previews');
const DNA = path.join(ROOT, '_core', 'dna');

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };
const lire = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

for (const f of ['constraints.json', 'anti-llm.json']) {
  if (!fs.existsSync(path.join(DNA, f))) die(`_core/dna/${f} introuvable`);
}
const CONTRAINTES = lire(path.join(DNA, 'constraints.json'));
const ANTILLM = lire(path.join(DNA, 'anti-llm.json'));

/* ------------------------------------------------------------------ collecte */

const argv = process.argv.slice(2);
const cibles = argv.filter((a) => !a.startsWith('--'));
const budgetSeul = argv.includes('--budget');

/**
 * Deux arborescences à balayer :
 *   templates/<famille>/<variante>/   — le catalogue, sur deux niveaux
 *   benchmark/<reference>/            — le Diversity Benchmark, à plat
 * Les références du benchmark passent exactement les mêmes contrôles que les
 * variantes : c'est tout l'intérêt d'un banc d'essai construit avec le système
 * réel plutôt qu'à côté de lui.
 */
const collecter = () => {
  const out = [];

  const ajouter = (dir, famille, variante) => {
    const metaPath = path.join(dir, 'meta.json');
    if (!fs.existsSync(metaPath)) return;
    let meta;
    try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf8').trim() || '{}'); } catch { return; }
    if (meta.statut !== 'fini') return;
    const rel = famille ? `${famille}/${variante}` : `benchmark/${variante}`;
    if (cibles.length && !cibles.some((c) => rel.includes(c))) return;
    out.push({ rel, dir, famille: famille || 'benchmark', variante, meta });
  };

  if (fs.existsSync(TEMPLATES)) {
    for (const famille of fs.readdirSync(TEMPLATES).sort()) {
      const df = path.join(TEMPLATES, famille);
      if (!fs.statSync(df).isDirectory()) continue;
      for (const variante of fs.readdirSync(df).sort()) {
        const dir = path.join(df, variante);
        if (fs.statSync(dir).isDirectory()) ajouter(dir, famille, variante);
      }
    }
  }

  if (fs.existsSync(BENCHMARK)) {
    for (const ref of fs.readdirSync(BENCHMARK).sort()) {
      const dir = path.join(BENCHMARK, ref);
      if (fs.statSync(dir).isDirectory()) ajouter(dir, null, ref);
    }
  }

  return out;
};

const variantes = collecter();

if (!variantes.length) die('aucune variante finie ne correspond');

/* ------------------------------------------------------------------ lecture */

/**
 * Le CSS d'une variante, c'est sa structure ET l'habillage qu'elle référence.
 *
 * Une contrainte comme `physical`, `no-shadow` ou `editorial` porte sur ce que
 * la page REND, pas sur le fichier où la déclaration se trouve. Or la matière,
 * les ombres et les règles de composition d'imprimé vivent dans la direction
 * artistique, par construction. Ne lire que `layout.css` faisait échouer des
 * contraintes pourtant tenues — le motif était bien là, dans l'autre fichier.
 */
const lireCss = (dir, { avecPalette = true } = {}) => {
  const morceaux = [];

  const cssDir = path.join(dir, 'assets', 'css');
  if (fs.existsSync(cssDir)) {
    for (const f of fs.readdirSync(cssDir).filter((x) => x.endsWith('.css'))) {
      morceaux.push(fs.readFileSync(path.join(cssDir, f), 'utf8'));
    }
  }

  // Palette et direction, résolues depuis les <link> des pages de la variante.
  const vus = new Set();
  for (const page of fs.readdirSync(dir).filter((f) => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(dir, page), 'utf8');
    for (const m of html.matchAll(/(?:\.\.\/)+_core\/(palettes|directions)\/([a-z0-9-]+)\.css/g)) {
      if (m[1] === 'palettes' && !avecPalette) continue;
      const rel = `_core/${m[1]}/${m[2]}.css`;
      if (vus.has(rel)) continue;
      vus.add(rel);
      const abs = path.join(ROOT, rel);
      if (fs.existsSync(abs)) morceaux.push(fs.readFileSync(abs, 'utf8'));
    }
  }

  return morceaux.join('\n');
};

const lireHtml = (dir) =>
  fs.readdirSync(dir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
    .join('\n');

/** Retire les commentaires CSS : un motif cité en commentaire n'est pas du style. */
const sansCommentaires = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/**
 * Remplace les `var(--x)` par leur valeur, quand elle est déclarée dans le même
 * CSS. Deux passes suffisent : les tokens du dépôt ne s'imbriquent pas plus.
 *
 * Sans cela, un contrôle textuel juge `box-shadow: var(--shadow-md)` sans jamais
 * voir ce que vaut --shadow-md. Une direction dont les ombres sont des biseaux
 * internes était donc accusée de poser des cartes — le motif cherchait le mot
 * `inset` dans un nom de variable. Le contrôle doit porter sur ce qui est
 * RENDU, pas sur la façon dont c'est écrit.
 */
const resoudreVars = (css) => {
  const defs = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi)) {
    if (!defs.has(m[1])) defs.set(m[1], m[2].trim());
  }
  let out = css;
  for (let passe = 0; passe < 2; passe++) {
    out = out.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^)]*)?\)/gi,
      (tout, nom) => (defs.has(nom) ? defs.get(nom) : tout));
  }
  return out;
};

const probePour = (v) => {
  if (!fs.existsSync(PREVIEWS)) return null;
  const num = v.variante.split('-')[0];
  // build.js nomme les dossiers du benchmark `bench-NN--…`, pas `benchmark-NN--`.
  const label = v.famille === 'benchmark' ? 'bench' : v.famille.replace(/^\d+-/, '');
  const prefixe = `${label}-${num}--`;
  const d = fs.readdirSync(PREVIEWS).find((x) => x.startsWith(prefixe));
  if (!d) return null;
  const p = path.join(PREVIEWS, d, 'probe.json');
  return fs.existsSync(p) ? lire(p) : null;
};

/* --------------------------------------------------------------- vérifications */

const verifierContrainte = (slug, ctx) => {
  const def = CONTRAINTES.contraintes[slug];
  if (!def) return [{ niveau: 'erreur', texte: `contrainte inconnue : ${slug}` }];

  const anomalies = [];
  for (const v of def.verification) {
    if (v.type === 'css_absent') {
      const re = new RegExp(v.motif, 'gi');
      const trouve = ctx.css.match(re);
      if (trouve) anomalies.push({ niveau: 'echec', texte: `${slug} — motif interdit dans le CSS : ${trouve.slice(0, 3).join(', ')}` });
    } else if (v.type === 'css_present') {
      if (!new RegExp(v.motif, 'i').test(ctx.css)) {
        anomalies.push({ niveau: 'echec', texte: `${slug} — motif attendu absent du CSS : /${v.motif}/` });
      }
    } else if (v.type === 'html_absent') {
      const re = new RegExp(v.motif, 'gi');
      if (re.test(ctx.html)) anomalies.push({ niveau: 'echec', texte: `${slug} — motif interdit dans le HTML : /${v.motif}/` });
    } else if (v.type === 'metrique') {
      if (!ctx.probe) { anomalies.push({ niveau: 'info', texte: `${slug} — métrique « ${v.cle} » non vérifiée (aucune capture)` }); continue; }
      const val = ctx.probe[v.cle];
      if (val === undefined) { anomalies.push({ niveau: 'info', texte: `${slug} — métrique « ${v.cle} » absente de la sonde` }); continue; }
      if (v.min !== undefined && val < v.min) anomalies.push({ niveau: 'echec', texte: `${slug} — ${v.cle} = ${val}, attendu ≥ ${v.min}` });
      if (v.max !== undefined && val > v.max) anomalies.push({ niveau: 'echec', texte: `${slug} — ${v.cle} = ${val}, attendu ≤ ${v.max}` });
    } else if (v.type === 'revue') {
      const notes = ctx.meta.justifications || {};
      if (!notes[slug]) anomalies.push({ niveau: 'revue', texte: `${slug} — à vérifier en revue : ${v.detail}` });
    }
  }
  return anomalies;
};

const calculerBudget = (ctx) => {
  const detectes = [];
  const dna = ctx.meta.dna || {};

  const exempte = (def) => (def.gratuit_si || []).some((cond) => {
    const m = cond.match(/^([a-z]+):([a-z-]+)/);
    if (!m) return false;
    const [, axe, val] = m;
    const actuel = axe === 'typography' ? (dna.typography || {}).system : dna[axe];
    return actuel === val;
  });

  for (const [slug, def] of Object.entries(ANTILLM.reflexes)) {
    const d = def.detection || {};
    let touche = false;

    if (d.type === 'css') touche = new RegExp(d.motif, 'i').test(ctx.css);
    else if (d.type === 'html') touche = new RegExp(d.motif, 'iu').test(ctx.html);
    else if (d.type === 'metrique') touche = ctx.probe ? !!ctx.probe[d.cle] : false;
    else if (d.type === 'palette') touche = false;   // évalué par palette, pas par variante
    else if (d.type === 'revue') touche = false;     // hors automatisation

    if (d.type === 'metrique' && d.seuil !== undefined && ctx.probe) {
      touche = (ctx.probe[d.cle] || 0) >= d.seuil;
    }

    if (touche && !exempte(def)) detectes.push({ slug, cout: def.cout, detail: def.detail });
  }

  const total = detectes.reduce((s, r) => s + r.cout, 0);
  return { detectes, total, budget: ANTILLM.budget.par_variante };
};

/* ------------------------------------------------------------------- rapport */

console.log(`Contraintes créatives — ${variantes.length} variante(s)\n`);

let echecs = 0;
let sansCapture = 0;
const resume = [];

for (const v of variantes) {
  const cssBrut = lireCss(v.dir);
  const ctx = {
    css: resoudreVars(sansCommentaires(cssBrut)),
    cssBrut,
    cssHorsPalette: sansCommentaires(lireCss(v.dir, { avecPalette: false })),
    html: lireHtml(v.dir),
    meta: v.meta,
    probe: probePour(v),
  };
  if (!ctx.probe) sansCapture += 1;

  const lignes = [];

  /* 1 — règle d'attribution */
  const declarees = v.meta.creativeConstraints || v.meta.contraintes || [];
  if (!budgetSeul) {
    const regle = CONTRAINTES.regle_d_attribution;
    if (declarees.length < regle.minimum) {
      lignes.push({ niveau: 'echec', texte: `${declarees.length} contrainte(s) déclarée(s), ${regle.minimum} minimum` });
    }
    const structurelles = declarees.filter((s) => (CONTRAINTES.contraintes[s] || {}).groupe === 'structurelle');
    if (structurelles.length < regle.minimum_structurelles) {
      lignes.push({ niveau: 'echec', texte: `aucune contrainte structurelle — au moins ${regle.minimum_structurelles} exigée` });
    }

    /* 2 — contraintes déclarées */
    for (const slug of declarees) lignes.push(...verifierContrainte(slug, ctx));
  }

  /* 3 — budget anti-LLM */
  const b = calculerBudget(ctx);
  const justifies = v.meta.justifications || {};
  const nonJustifies = b.detectes.filter((r) => !justifies[r.slug]);
  const coutNonJustifie = nonJustifies.reduce((s, r) => s + r.cout, 0);

  if (coutNonJustifie > b.budget) {
    lignes.push({
      niveau: 'echec',
      texte: `budget anti-LLM dépassé : ${coutNonJustifie}/${b.budget} — ${nonJustifies.map((r) => `${r.slug}(${r.cout})`).join(' ')}`,
    });
  }

  /* 4 — hygiène */
  if (!budgetSeul) {
    /* Règle d'or : aucune couleur en dur HORS de _core/palettes/. On exclut
       donc la palette de la portée — elle ne contient que des couleurs, c'est
       sa raison d'être. Structure et direction doivent tout tirer des tokens.
       --------------------------------------------------------------------
       Ce qui est traqué, c'est une TEINTE codée en dur : elle survit au
       changement de palette et casse la promesse du dépôt. Les valeurs
       ACHROMATIQUES (noir, blanc, gris, avec ou sans alpha) ne sont pas des
       couleurs au sens du contrat : ce sont des modificateurs de luminance —
       une ombre, un éclat d'arête, un grain de papier. Elles fonctionnent
       sous n'importe quelle palette, et une texture SVG en data-uri ne peut
       de toute façon pas lire une variable CSS. */
    const achromatique = (s) => {
      const hex = s.match(/^#([0-9a-f]{3,8})$/i);
      if (hex) {
        let h = hex[1];
        if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
        const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
        return r === g && g === b;
      }
      const nums = s.match(/\d+(?:\.\d+)?/g);
      if (!nums || nums.length < 3) return false;
      const [r, g, b] = nums.slice(0, 3).map(Number);
      return r === g && g === b;
    };

    const couleursDures = (
      ctx.cssHorsPalette.match(/(?<!-)#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi) || []
    ).filter((s) => !achromatique(s.trim()));
    if (couleursDures.length) {
      lignes.push({ niveau: 'echec', texte: `${couleursDures.length} couleur(s) en dur hors thème : ${[...new Set(couleursDures)].slice(0, 4).join(', ')}` });
    }
    /* On ne cherche pas « une URL absolue » mais « une ressource CHARGÉE
       depuis l'extérieur » : src=, <link href=, url(), @import. Une URL de
       démonstration dans du texte ou dans un href de contenu n'est pas une
       dépendance réseau — la confondre avec une dépendance rendait le
       rapport bruyant, donc ignoré. */
    const chargements = [
      /\bsrc\s*=\s*["']https?:\/\//i,
      /<link\b[^>]*href\s*=\s*["']https?:\/\//i,
      /url\(\s*["']?https?:\/\//i,
      /@import\s+(?:url\()?["']?https?:\/\//i,
    ];
    if (chargements.some((re) => re.test(ctx.html) || re.test(ctx.css))) {
      lignes.push({ niveau: 'echec', texte: 'ressource distante chargée (src / link / url() / @import)' });
    }
    if (cssBrut && !/@layer\s+structure/.test(cssBrut)) {
      lignes.push({ niveau: 'info', texte: 'layout.css hors `@layer structure` — une direction ne peut pas le surcharger' });
    }
  }

  const dur = lignes.filter((l) => l.niveau === 'echec').length;
  if (dur) echecs += 1;

  const etat = dur ? '✗' : lignes.length ? '·' : '✓';
  console.log(`  ${etat} ${v.rel.padEnd(40)} budget ${String(coutNonJustifie).padStart(2)}/${b.budget}`
    + (declarees.length ? `  [${declarees.join(' ')}]` : '  [aucune contrainte]'));

  for (const l of lignes) {
    const marque = l.niveau === 'echec' ? '✗' : l.niveau === 'revue' ? '?' : 'i';
    console.log(`      ${marque} ${l.texte}`);
  }

  resume.push({ rel: v.rel, budget: coutNonJustifie, reflexes: b.detectes.map((r) => r.slug), echecs: dur });
}

/* ------------------------------------------------------------------- synthèse */

console.log('\n  ' + '─'.repeat(70));

const reflexesFrequents = {};
for (const r of resume) for (const s of r.reflexes) reflexesFrequents[s] = (reflexesFrequents[s] || 0) + 1;
const classe = Object.entries(reflexesFrequents).sort((a, b) => b[1] - a[1]);

if (classe.length) {
  console.log('\n  RÉFLEXES LES PLUS FRÉQUENTS DANS LE CATALOGUE');
  for (const [slug, n] of classe.slice(0, 10)) {
    const part = (n / variantes.length * 100).toFixed(0);
    const alerte = part > 50 ? '  ⚑ signature de catalogue' : '';
    console.log(`    ${String(n).padStart(3)}/${variantes.length}  ${String(part + ' %').padStart(5)}  ${slug}${alerte}`);
  }
}

const budgetMoyen = resume.reduce((s, r) => s + r.budget, 0) / resume.length;
console.log(`\n  Budget anti-LLM moyen : ${budgetMoyen.toFixed(1)} / ${ANTILLM.budget.par_variante}`);
if (sansCapture) {
  console.log(`  ⚠ ${sansCapture} variante(s) sans capture — métriques ignorées.`);
  console.log('    Lancer : node _tools/build.js … puis node _tools/screenshot.js');
}
console.log(`\n  ${variantes.length - echecs}/${variantes.length} variante(s) conformes.`);

process.exit(echecs ? 1 : 0);
