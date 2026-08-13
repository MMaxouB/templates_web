#!/usr/bin/env node
/**
 * dna-report.js — la mémoire de diversité du catalogue.
 *
 *   node _tools/dna-report.js              rapport complet
 *   node _tools/dna-report.js --couverture quels axes sont sous-employés
 *   node _tools/dna-report.js --collisions les variantes trop proches
 *   node _tools/dna-report.js --suggere    que construire ensuite
 *   node _tools/dna-report.js --json x.json
 *
 * POURQUOI
 * Une variante ne doit jamais être conçue isolément. Avant d'en écrire une
 * nouvelle, il faut savoir ce que le catalogue contient DÉJÀ, et quels
 * réflexes y sont surreprésentés. Sans cet outil, 145 variantes sont 145
 * générations indépendantes — et 145 générations indépendantes du même modèle
 * convergent vers le même design.
 *
 * CE QU'IL CALCULE
 *   couverture   pour chaque axe, quelles valeurs sont employées, combien de
 *                fois, et lesquelles ne l'ont jamais été
 *   distance     distance ADN pondérée entre deux variantes, 0 → 1
 *   collisions   les paires sous le seuil, et les paires de même archétype
 *                qui ne s'en éloignent pas assez
 *   suggestion   les valeurs d'axe les plus délaissées, à employer ensuite
 *
 * La distance ADN dit ce qu'on a VOULU faire. `perceptual-diff.js` dit ce
 * qu'on a FAIT. Les deux sont nécessaires : le meta.json peut mentir.
 *
 * Aucune dépendance npm.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TEMPLATES = path.join(ROOT, 'templates');
const BENCHMARK = path.join(ROOT, 'benchmark');
const SCHEMA = path.join(ROOT, '_core', 'dna', 'schema.json');

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

if (!fs.existsSync(SCHEMA)) die('_core/dna/schema.json introuvable');
const schema = JSON.parse(fs.readFileSync(SCHEMA, 'utf8'));
const AXES = Object.keys(schema.axes);
const SEUILS = schema.seuils;

/** Valeurs autorisées pour un axe. `typography` a deux sous-axes.
    Les clés `$commentaire` du schéma sont de la documentation, pas des valeurs. */
const clefs = (o) => Object.keys(o).filter((k) => !k.startsWith('$'));

const valeursDe = (axe) => {
  const a = schema.axes[axe];
  if (axe === 'typography') return { system: clefs(a.system), voice: clefs(a.voice) };
  return clefs(a.valeurs);
};

/* ---------------------------------------------------------------- collecte */

const variantes = [];
const sansAdn = [];

/**
 * Balaie `templates/` (deux niveaux) et `benchmark/` (à plat). Le benchmark est
 * mesuré avec le même outil et les mêmes seuils que le catalogue : un banc
 * d'essai jugé par une règle spéciale ne prouverait rien.
 */
const ajouter = (dir, famille, variante) => {
  const metaPath = path.join(dir, 'meta.json');
  if (!fs.existsSync(metaPath)) return;

  let meta;
  try {
    const raw = fs.readFileSync(metaPath, 'utf8').trim();
    if (!raw) return;
    meta = JSON.parse(raw);
  } catch {
    console.error(`  ⚠ meta.json illisible : ${famille}/${variante}`);
    return;
  }

  const id = famille === 'benchmark'
    ? `bench/${variante.split('-')[0]}`
    : `${famille.replace(/^\d+-/, '')}/${variante.split('-')[0]}`;

  if (!meta.dna) {
    // Seules les variantes réellement écrites sont un manque : un dossier
    // encore vide n'a pas à porter d'ADN.
    if (meta.statut === 'fini') sansAdn.push(id);
    return;
  }
  variantes.push({
    id, famille, variante,
    archetype: meta.archetype,
    dna: meta.dna,
    meta,
    benchmark: famille === 'benchmark',
  });
};

for (const famille of fs.readdirSync(TEMPLATES).sort()) {
  const dirFamille = path.join(TEMPLATES, famille);
  if (!fs.statSync(dirFamille).isDirectory()) continue;
  for (const variante of fs.readdirSync(dirFamille).sort()) {
    const dir = path.join(dirFamille, variante);
    if (fs.statSync(dir).isDirectory()) ajouter(dir, famille, variante);
  }
}

if (fs.existsSync(BENCHMARK)) {
  for (const ref of fs.readdirSync(BENCHMARK).sort()) {
    const dir = path.join(BENCHMARK, ref);
    if (fs.statSync(dir).isDirectory()) ajouter(dir, 'benchmark', ref);
  }
}

if (!variantes.length) {
  console.log('Aucune variante ne porte encore d\'ADN.');
  if (sansAdn.length) console.log(`${sansAdn.length} variante(s) finies sans bloc dna : ${sansAdn.join(', ')}`);
  process.exit(0);
}

/* --------------------------------------------------------------- validation */

const erreurs = [];
for (const v of variantes) {
  for (const axe of AXES) {
    const attendu = valeursDe(axe);
    const val = v.dna[axe];

    if (val === undefined) { erreurs.push(`${v.id} — axe manquant : ${axe}`); continue; }

    if (axe === 'typography') {
      if (typeof val !== 'object') { erreurs.push(`${v.id} — typography doit être {system, voice}`); continue; }
      if (!attendu.system.includes(val.system)) erreurs.push(`${v.id} — typography.system inconnu : ${val.system}`);
      if (!attendu.voice.includes(val.voice)) erreurs.push(`${v.id} — typography.voice inconnu : ${val.voice}`);
    } else if (!attendu.includes(val)) {
      erreurs.push(`${v.id} — ${axe} : valeur inconnue « ${val} »`);
    }
  }
}

/* ---------------------------------------------------------------- distance */

/** Valeur comparable d'un axe (typography compte pour deux demi-axes). */
const compare = (axe, a, b) => {
  if (axe === 'typography') {
    let s = 0;
    if (a.system !== b.system) s += 0.5;
    if (a.voice !== b.voice) s += 0.5;
    return s;
  }
  return a === b ? 0 : 1;
};

const poidsTotal = AXES.reduce((s, a) => s + schema.axes[a].poids, 0);

const distance = (x, y) => {
  let d = 0;
  for (const axe of AXES) {
    d += schema.axes[axe].poids * compare(axe, x.dna[axe], y.dna[axe]);
  }
  return +(d / poidsTotal).toFixed(4);
};

const paires = [];
for (let i = 0; i < variantes.length; i++) {
  for (let j = i + 1; j < variantes.length; j++) {
    const d = distance(variantes[i], variantes[j]);
    const memeArchetype = variantes[i].archetype && variantes[i].archetype === variantes[j].archetype;
    paires.push({ a: variantes[i].id, b: variantes[j].id, d, memeArchetype });
  }
}
paires.sort((p, q) => p.d - q.d);

/* -------------------------------------------------------------- couverture */

const couverture = {};
for (const axe of AXES) {
  const attendu = valeursDe(axe);
  if (axe === 'typography') {
    couverture.typography = { system: {}, voice: {} };
    for (const k of attendu.system) couverture.typography.system[k] = 0;
    for (const k of attendu.voice) couverture.typography.voice[k] = 0;
    for (const v of variantes) {
      couverture.typography.system[v.dna.typography.system] += 1;
      couverture.typography.voice[v.dna.typography.voice] += 1;
    }
  } else {
    couverture[axe] = {};
    for (const k of attendu) couverture[axe][k] = 0;
    for (const v of variantes) if (couverture[axe][v.dna[axe]] !== undefined) couverture[axe][v.dna[axe]] += 1;
  }
}

/* ------------------------------------------------------------------ sortie */

const argv = process.argv.slice(2);
const veut = (n) => argv.includes(`--${n}`);
const tout = !veut('couverture') && !veut('collisions') && !veut('suggere');

console.log(`ADN du catalogue — ${variantes.length} variante(s) décrite(s)\n`);

if (erreurs.length) {
  console.log(`  ✗ ${erreurs.length} erreur(s) de vocabulaire :`);
  for (const e of erreurs.slice(0, 20)) console.log(`    ${e}`);
  if (erreurs.length > 20) console.log(`    … et ${erreurs.length - 20} autres`);
  console.log('');
}

if (sansAdn.length) {
  console.log(`  ⚠ ${sansAdn.length} variante(s) finie(s) sans bloc dna : ${sansAdn.join(', ')}\n`);
}

if (tout || veut('couverture')) {
  console.log('  COUVERTURE DES AXES');
  console.log('  ' + '─'.repeat(72));

  const ligne = (axe, table) => {
    const total = Object.values(table).reduce((s, v) => s + v, 0) || 1;
    const employes = Object.entries(table).filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
    const jamais = Object.entries(table).filter(([, n]) => n === 0).map(([k]) => k);
    const dominant = employes[0];
    const part = dominant ? (dominant[1] / total * 100).toFixed(0) : 0;

    console.log(`  ${axe}`);
    console.log(`    employées ${employes.length}/${Object.keys(table).length}`
      + (dominant ? ` · dominante « ${dominant[0]} » ${part} %` : ''));
    if (dominant && part > 40) {
      console.log(`    ⚑ « ${dominant[0]} » représente ${part} % du catalogue — c'est un réflexe.`);
    }
    if (jamais.length) {
      console.log(`    jamais employées : ${jamais.slice(0, 9).join(', ')}${jamais.length > 9 ? ` … (+${jamais.length - 9})` : ''}`);
    }
  };

  for (const axe of AXES) {
    if (axe === 'typography') {
      ligne('typography.system', couverture.typography.system);
      ligne('typography.voice', couverture.typography.voice);
    } else {
      ligne(axe, couverture[axe]);
    }
  }
  console.log('');
}

if (tout || veut('collisions')) {
  console.log('  COLLISIONS ADN');
  console.log('  ' + '─'.repeat(72));

  const dures = paires.filter((p) => p.d < SEUILS.collision);
  const risque = paires.filter((p) => p.d >= SEUILS.collision && p.d < SEUILS.risque);
  const archetype = paires.filter((p) => p.memeArchetype && p.d < SEUILS.meme_archetype_minimum);

  console.log(`  seuils — collision < ${SEUILS.collision} · risque < ${SEUILS.risque} · sain ≥ ${SEUILS.sain}`);
  console.log(`  ${paires.length} paires · ${dures.length} collision(s) · ${risque.length} à risque\n`);

  for (const p of dures.slice(0, 20)) {
    console.log(`    ✗ ${p.d.toFixed(3)}  ${p.a}  ≈  ${p.b}`);
  }
  if (dures.length > 20) console.log(`    … et ${dures.length - 20} autres`);

  if (archetype.length) {
    console.log(`\n  Même archétype et distance < ${SEUILS.meme_archetype_minimum} — ${archetype.length} paire(s) :`);
    console.log('  Deux variantes qui partagent une mise en page doivent se distinguer');
    console.log('  ailleurs, sur au moins quatre axes.\n');
    for (const p of archetype.slice(0, 15)) {
      console.log(`    ⚑ ${p.d.toFixed(3)}  ${p.a}  ≈  ${p.b}`);
    }
  }

  const moy = paires.reduce((s, p) => s + p.d, 0) / paires.length;
  const plusProche = {};
  for (const v of variantes) plusProche[v.id] = 1;
  for (const p of paires) {
    plusProche[p.a] = Math.min(plusProche[p.a], p.d);
    plusProche[p.b] = Math.min(plusProche[p.b], p.d);
  }
  const isoles = Object.entries(plusProche).sort((a, b) => b[1] - a[1]).slice(0, 5);
  console.log(`\n  Distance moyenne : ${moy.toFixed(3)}`);
  console.log(`  Variantes les plus singulières : ${isoles.map(([k, v]) => `${k} (${v.toFixed(2)})`).join(' · ')}`);
  console.log('');
}

if (tout || veut('suggere')) {
  console.log('  QUE CONSTRUIRE ENSUITE');
  console.log('  ' + '─'.repeat(72));
  console.log('  Les valeurs ci-dessous ne sont employées par aucune variante. Les');
  console.log('  choisir garantit mécaniquement de s\'éloigner de l\'existant.\n');

  const propositions = {};
  for (const axe of AXES) {
    const table = axe === 'typography' ? couverture.typography.system : couverture[axe];
    const libres = Object.entries(table)
      .filter(([, n]) => n === 0)
      .map(([k]) => k);
    if (libres.length) propositions[axe === 'typography' ? 'typography.system' : axe] = libres;
  }

  for (const [axe, libres] of Object.entries(propositions)) {
    console.log(`    ${axe.padEnd(22)} ${libres.slice(0, 6).join(' · ')}`);
  }

  const tirer = (a) => a[Math.floor(Math.random() * a.length)];
  const clefs = Object.keys(propositions);
  if (clefs.length >= 3) {
    console.log('\n  Exemple de combinaison inédite :');
    for (const axe of clefs.slice(0, 9)) {
      console.log(`    ${axe.padEnd(22)} ${tirer(propositions[axe])}`);
    }
  }
  console.log('');
}

const jsonIdx = argv.indexOf('--json');
if (jsonIdx !== -1 && argv[jsonIdx + 1]) {
  fs.writeFileSync(argv[jsonIdx + 1], JSON.stringify({
    variantes: variantes.map((v) => ({ id: v.id, archetype: v.archetype, dna: v.dna })),
    couverture, paires, erreurs,
  }, null, 2));
  console.log(`  → ${argv[jsonIdx + 1]}`);
}

process.exit(erreurs.length || paires.some((p) => p.d < SEUILS.collision) ? 1 : 0);
