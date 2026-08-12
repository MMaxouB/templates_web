#!/usr/bin/env node
/**
 * perceptual-diff.js — compare ce que les variantes RENDENT, pas ce qu'elles
 * déclarent.
 *
 *   node _tools/perceptual-diff.js                 toutes les captures
 *   node _tools/perceptual-diff.js --viewport 1280
 *   node _tools/perceptual-diff.js --seuil 0.18
 *   node _tools/perceptual-diff.js --json rapport.json
 *
 * Prérequis : node _tools/screenshot.js
 *
 * POURQUOI
 * Un meta.json peut mentir. Deux variantes peuvent déclarer des ADN opposés,
 * cocher des contraintes différentes, et produire deux images superposables.
 * C'est le mode d'échec principal d'un catalogue généré : la diversité existe
 * dans les métadonnées et pas à l'écran. Cet outil regarde les pixels.
 *
 * CE QU'IL MESURE
 *   empreinte      hash perceptuel 16×16 — la silhouette générale
 *   symetrie       ressemblance de la moitié gauche au miroir de la droite
 *                  → mesure directement le réflexe de centrage systématique
 *   encre          part de la surface occupée → mesure la densité réelle
 *   profil vertical    rythme des bandes horizontales → « même rythme vertical »
 *   profil horizontal  structure en colonnes → « mêmes proportions »
 *   teintes        nombre de teintes distinctes et teinte dominante
 *
 * DEUX CANAUX
 * La distance ADN (node _tools/dna-report.js) dit ce qu'on a VOULU faire.
 * La distance perceptuelle dit ce qu'on a FAIT. Le cas intéressant n'est pas
 * qu'elles soient basses toutes les deux — c'est qu'elles divergent : ADN
 * lointain + pixels proches = la variante ment.
 *
 * Aucune dépendance npm.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(__dirname, '..');
const PREVIEWS = path.join(ROOT, 'previews');

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

/* ==========================================================================
   Décodage PNG

   Chromium écrit du PNG 8 bits non entrelacé, filtre 0. On n'implémente que
   ce cas : en-tête, concaténation des IDAT, inflate, puis défiltrage ligne à
   ligne. C'est une soixantaine de lignes et cela évite une dépendance npm à
   un dépôt qui n'en a aucune.
   ========================================================================== */

const CANAUX = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

function lirePng(fichier) {
  const buf = fs.readFileSync(fichier);
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('signature PNG absente');

  let pos = 8, ihdr = null;
  const idat = [];

  while (pos < buf.length) {
    const taille = buf.readUInt32BE(pos);
    const type = buf.toString('ascii', pos + 4, pos + 8);
    const data = buf.subarray(pos + 8, pos + 8 + taille);

    if (type === 'IHDR') {
      ihdr = {
        w: data.readUInt32BE(0),
        h: data.readUInt32BE(4),
        profondeur: data[8],
        couleur: data[9],
        entrelace: data[12],
      };
    } else if (type === 'IDAT') {
      idat.push(data);
    } else if (type === 'IEND') break;

    pos += 12 + taille;
  }

  if (!ihdr) throw new Error('IHDR absent');
  if (ihdr.profondeur !== 8) throw new Error(`profondeur ${ihdr.profondeur} non gérée`);
  if (ihdr.entrelace !== 0) throw new Error('PNG entrelacé non géré');

  const canaux = CANAUX[ihdr.couleur];
  if (!canaux) throw new Error(`type de couleur ${ihdr.couleur} non géré`);

  const brut = zlib.inflateSync(Buffer.concat(idat));
  const { w, h } = ihdr;
  const parLigne = w * canaux;
  const px = Buffer.alloc(parLigne * h);

  let src = 0;
  for (let y = 0; y < h; y++) {
    const filtre = brut[src++];
    const ligne = brut.subarray(src, src + parLigne);
    src += parLigne;

    const dst = y * parLigne;
    const precedent = dst - parLigne;

    for (let i = 0; i < parLigne; i++) {
      const a = i >= canaux ? px[dst + i - canaux] : 0;  // gauche
      const b = y > 0 ? px[precedent + i] : 0;           // haut
      const c = (i >= canaux && y > 0) ? px[precedent + i - canaux] : 0; // haut-gauche
      const x = ligne[i];
      let v;
      switch (filtre) {
        case 0: v = x; break;
        case 1: v = x + a; break;
        case 2: v = x + b; break;
        case 3: v = x + ((a + b) >> 1); break;
        case 4: {
          const p = a + b - c;
          const pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
          v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
          break;
        }
        default: throw new Error(`filtre ${filtre} inconnu`);
      }
      px[dst + i] = v & 0xff;
    }
  }

  return { w, h, canaux, px };
}

/* ==========================================================================
   Signatures
   ========================================================================== */

/** Réduit l'image à une grille de gris moyennés (box filter). */
function grille(img, gw, gh) {
  const { w, h, canaux, px } = img;
  const somme = new Float64Array(gw * gh);
  const compte = new Uint32Array(gw * gh);

  for (let y = 0; y < h; y++) {
    const gy = Math.min(gh - 1, (y * gh / h) | 0);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * canaux;
      const gris = canaux === 1 || canaux === 2
        ? px[i]
        : 0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2];
      const g = gy * gw + Math.min(gw - 1, (x * gw / w) | 0);
      somme[g] += gris;
      compte[g] += 1;
    }
  }
  for (let i = 0; i < somme.length; i++) somme[i] /= compte[i] || 1;
  return somme;
}

/**
 * Carte de MARQUAGE : pour chaque case, son écart au fond de la page,
 * normalisé.
 *
 * C'est la pièce centrale de l'outil. Un hash calculé sur la luminance brute
 * juge qu'une page sombre et une page claire sont très différentes — alors
 * que ce sont peut-être exactement la même mise en page, repeinte. C'est
 * précisément le cas qu'on veut attraper : « deux templates peuvent avoir des
 * couleurs différentes et rester similaires à 90 % ».
 *
 * En mesurant « à quel point cette case est marquée par rapport au fond »,
 * on obtient une empreinte invariante à l'inversion clair/sombre et aux
 * changements de palette. Ne survit que la STRUCTURE.
 */
function carteMarquage(g, fondLum) {
  const m = g.map((v) => Math.abs(v - fondLum));
  const max = Math.max(...m) || 1;
  return m.map((v) => (v / max) * 255);
}

/**
 * Hash perceptuel : chaque case comparée à la MÉDIANE, pas à la moyenne.
 *
 * La moyenne est tirée par les valeurs extrêmes : sur une page très vide avec
 * un seul titre énorme, elle reste basse et presque toutes les cases passent
 * au-dessus — le hash ne porte alors presque aucune information. La médiane
 * garantit la moitié des bits à 1 quelle que soit la page, donc une empreinte
 * toujours discriminante.
 */
function empreinte(g) {
  const trie = [...g].sort((a, b) => a - b);
  const mediane = trie[trie.length >> 1];
  const bits = [];
  for (let i = 0; i < g.length; i += 8) {
    let octet = 0;
    for (let b = 0; b < 8; b++) if (g[i + b] > mediane) octet |= 1 << b;
    bits.push(octet.toString(16).padStart(2, '0'));
  }
  return bits.join('');
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i += 2) {
    let x = parseInt(a.substr(i, 2), 16) ^ parseInt(b.substr(i, 2), 16);
    while (x) { d += x & 1; x >>= 1; }
  }
  return d;
}

/** Couleur de fond = couleur modale, à la louche (quantifiée par 16). */
function fondModal(img) {
  const { w, h, canaux, px } = img;
  const compte = new Map();
  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const i = (y * w + x) * canaux;
      const cle = ((px[i] >> 4) << 8) | ((px[i + (canaux > 2 ? 1 : 0)] >> 4) << 4) | (px[i + (canaux > 2 ? 2 : 0)] >> 4);
      compte.set(cle, (compte.get(cle) || 0) + 1);
    }
  }
  let meilleur = 0, max = -1;
  for (const [k, v] of compte) if (v > max) { max = v; meilleur = k; }
  return [((meilleur >> 8) & 15) * 17, ((meilleur >> 4) & 15) * 17, (meilleur & 15) * 17];
}

/** Part de la surface qui n'est pas le fond. C'est la densité, mesurée. */
function couvertureEncre(img, fond) {
  const { w, h, canaux, px } = img;
  let encre = 0, total = 0;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const i = (y * w + x) * canaux;
      const d = Math.abs(px[i] - fond[0])
        + Math.abs(px[i + (canaux > 2 ? 1 : 0)] - fond[1])
        + Math.abs(px[i + (canaux > 2 ? 2 : 0)] - fond[2]);
      if (d > 60) encre++;
      total++;
    }
  }
  return +(encre / total).toFixed(4);
}

/**
 * Ressemblance de la moitié gauche au miroir de la moitié droite.
 * 1 = parfaitement symétrique. C'est la mesure directe du réflexe de
 * centrage : une page composée sur un axe central monte au-dessus de 0.85.
 */
function scoreSymetrie(g, gw, gh) {
  let diff = 0, n = 0;
  const demi = gw >> 1;
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < demi; x++) {
      const gauche = g[y * gw + x];
      const droite = g[y * gw + (gw - 1 - x)];
      diff += Math.abs(gauche - droite);
      n++;
    }
  }
  return +(1 - (diff / n) / 255).toFixed(4);
}

/**
 * Profil : quantité de marquage par bande. Révèle le rythme.
 * Attend la carte de marquage, où une valeur haute signifie « marqué ».
 */
function profil(g, gw, gh, axe) {
  const n = axe === 'vertical' ? gh : gw;
  const out = new Array(n).fill(0);
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      out[axe === 'vertical' ? y : x] += g[y * gw + x];
    }
  }
  // Normalisé en DISTRIBUTION (somme = 1), pas par le maximum. Diviser par le
  // maximum écrase tout le profil dès qu'une bande domine — un grand titre
  // suffisait à faire passer le reste de la page pour du vide, et deux mises
  // en page identiques paraissaient alors très différentes.
  const somme = out.reduce((s, v) => s + v, 0) || 1;
  return out.map((v) => +(v / somme).toFixed(4));
}

/**
 * Distance de variation totale entre deux distributions : 0 = mêmes
 * proportions, 1 = disjointes. C'est la bonne mesure pour comparer deux
 * rythmes indépendamment de la quantité d'encre.
 */
function distanceProfil(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) d += Math.abs(a[i] - b[i]);
  return +(d / 2).toFixed(4);
}

/** Teintes distinctes présentes de façon significative. */
function teintes(img) {
  const { w, h, canaux, px } = img;
  if (canaux < 3) return { distinctes: 0, dominante: null };
  const seaux = new Array(12).fill(0);
  let colores = 0, total = 0;

  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const i = (y * w + x) * canaux;
      const r = px[i] / 255, v = px[i + 1] / 255, b = px[i + 2] / 255;
      const max = Math.max(r, v, b), min = Math.min(r, v, b);
      const delta = max - min;
      total++;
      if (delta < 0.12 || max < 0.12) continue;  // gris ou trop sombre
      colores++;
      let t;
      if (max === r) t = ((v - b) / delta) % 6;
      else if (max === v) t = (b - r) / delta + 2;
      else t = (r - v) / delta + 4;
      t = ((t * 60) + 360) % 360;
      seaux[(t / 30) | 0]++;
    }
  }

  const seuil = colores * 0.06;
  const presents = seaux.filter((v) => v > seuil).length;
  let dom = -1, max = 0;
  seaux.forEach((v, i) => { if (v > max) { max = v; dom = i; } });
  return {
    distinctes: presents,
    dominante: colores > total * 0.01 ? dom * 30 + 15 : null,
    part_coloree: +(colores / total).toFixed(3),
  };
}

/* ==========================================================================
   Programme
   ========================================================================== */

const argv = process.argv.slice(2);
const opt = (n, d) => { const i = argv.indexOf(`--${n}`); return i === -1 ? d : argv[i + 1]; };
const VIEWPORT = opt('viewport', '1280');
const SEUIL = parseFloat(opt('seuil', '0.20'));
/* Seuil calibré sur le lot 1 : entre architectures distinctes la distance
   médiane est de 0.37 ; en dessous de 0.20 les paires observées sont des
   ressemblances réelles, vérifiées à l'œil sur les captures. */
const SORTIE_JSON = opt('json', null);

const GW = 16, GH = 16;

if (!fs.existsSync(PREVIEWS)) die('previews/ absent — lancer d\'abord node _tools/screenshot.js');

const dossiers = fs.readdirSync(PREVIEWS)
  .filter((d) => fs.existsSync(path.join(PREVIEWS, d, `${VIEWPORT}.png`)))
  .sort();

if (dossiers.length < 1) die(`aucune capture en ${VIEWPORT}px dans previews/`);

console.log(`Analyse perceptuelle — ${dossiers.length} capture(s) en ${VIEWPORT}px\n`);

const fiches = [];
for (const d of dossiers) {
  const fichier = path.join(PREVIEWS, d, `${VIEWPORT}.png`);
  let img;
  try {
    img = lirePng(fichier);
  } catch (e) {
    console.log(`  ⚠ ${d} — PNG illisible : ${e.message}`);
    continue;
  }
  const g = grille(img, GW, GH);
  const fond = fondModal(img);
  const t = teintes(img);

  // Tout ce qui sert à comparer des STRUCTURES est calculé sur la carte de
  // marquage, donc indépendamment de la palette. Seuls `teintes` et
  // `teinte_dominante` regardent la couleur, et ils ne pèsent pas dans la
  // distance : changer de couleur ne doit jamais suffire à passer le test.
  const fondLum = 0.2126 * fond[0] + 0.7152 * fond[1] + 0.0722 * fond[2];
  const marque = carteMarquage(g, fondLum);

  fiches.push({
    nom: d,
    empreinte: empreinte(marque),
    symetrie: scoreSymetrie(marque, GW, GH),
    encre: couvertureEncre(img, fond),
    profil_vertical: profil(marque, GW, GH, 'vertical'),
    profil_horizontal: profil(marque, GW, GH, 'horizontal'),
    teintes: t.distinctes,
    teinte_dominante: t.dominante,
  });
}

/* ------------------------------------------------------- fiches individuelles */

console.log('  ' + 'variante'.padEnd(38) + 'symétrie  encre   teintes');
console.log('  ' + '─'.repeat(66));
for (const f of fiches) {
  const alerte = f.symetrie > 0.88 ? ' ⚑ axe central' : '';
  console.log(
    '  ' + f.nom.padEnd(38)
    + String(f.symetrie.toFixed(2)).padStart(6)
    + String((f.encre * 100).toFixed(1) + '%').padStart(9)
    + String(f.teintes).padStart(8)
    + alerte
  );
}

/* ------------------------------------------------------------ comparaisons */

const paires = [];
for (let i = 0; i < fiches.length; i++) {
  for (let j = i + 1; j < fiches.length; j++) {
    const a = fiches[i], b = fiches[j];
    const dHash = hamming(a.empreinte, b.empreinte) / (GW * GH);
    const dVert = distanceProfil(a.profil_vertical, b.profil_vertical);
    const dHoriz = distanceProfil(a.profil_horizontal, b.profil_horizontal);
    const dEncre = Math.abs(a.encre - b.encre);

    // Silhouette et rythme dominent : c'est ce que l'œil retient d'un coup
    // d'œil sur une planche-contact.
    const distance = +(dHash * 0.4 + dVert * 0.25 + dHoriz * 0.25 + dEncre * 0.1).toFixed(4);
    paires.push({ a: a.nom, b: b.nom, distance, dHash: +dHash.toFixed(3), dVert, dHoriz });
  }
}

paires.sort((x, y) => x.distance - y.distance);

/* Deux populations, deux significations.

   · MÊME architecture, habillages différents — on ATTEND qu'elles soient
     proches : c'est le principe même du catalogue. Leur distance mesure autre
     chose : l'amplitude réelle de la couche d'habillage. Si elle est faible,
     changer de direction artistique ne change presque rien, et le catalogue
     vend 333 fois la même page.

   · Architectures DIFFÉRENTES — celles-là ne doivent pas se ressembler. Une
     distance faible ici est une vraie collision : deux formes annoncées comme
     distinctes qui rendent la même image. */

const clefArchi = (nom) => nom.split('--')[0];
const memeArchi = paires.filter((p) => clefArchi(p.a) === clefArchi(p.b));
const archiDiff = paires.filter((p) => clefArchi(p.a) !== clefArchi(p.b));
const collisions = archiDiff.filter((p) => p.distance < SEUIL);

const stats = (xs) => {
  if (!xs.length) return null;
  const v = xs.map((p) => p.distance).sort((a, b) => a - b);
  return { n: v.length, min: v[0], med: v[v.length >> 1], max: v[v.length - 1] };
};

console.log(`\n  Paires analysées : ${paires.length} · seuil de collision : ${SEUIL}`);

const sMeme = stats(memeArchi);
if (sMeme) {
  console.log(`\n  Amplitude de l'habillage — même architecture, ${sMeme.n} paires`);
  console.log(`    min ${sMeme.min.toFixed(3)} · médiane ${sMeme.med.toFixed(3)} · max ${sMeme.max.toFixed(3)}`);
  if (sMeme.med < 0.15) {
    console.log('    ⚑ médiane faible : changer d\'habillage ne déplace presque rien.');
    console.log('      La diversité doit alors venir de la structure, pas de la direction.');
  }
}

const sDiff = stats(archiDiff);
if (sDiff) {
  console.log(`\n  Distance entre architectures — ${sDiff.n} paires`);
  console.log(`    min ${sDiff.min.toFixed(3)} · médiane ${sDiff.med.toFixed(3)} · max ${sDiff.max.toFixed(3)}`);
}

if (collisions.length === 0) {
  console.log('\n  ✓ aucune collision entre architectures distinctes');
} else {
  console.log(`\n  ⚑ ${collisions.length} paire(s) d'architectures distinctes trop proches :\n`);
  for (const p of collisions.slice(0, 25)) {
    console.log(`    ${p.distance.toFixed(3)}  ${p.a}`);
    console.log(`           ${p.b}`);
    console.log(`           silhouette ${p.dHash} · rythme vertical ${p.dVert} · colonnes ${p.dHoriz}`);
  }
  if (collisions.length > 25) console.log(`    … et ${collisions.length - 25} autres`);
  console.log('\n    → Ces variantes se ressemblent à l\'écran quoi qu\'en disent leurs meta.json.');
  console.log('      Traitement : REJECT AND REDESIGN, pas un changement de couleur.');
}

/* -------------------------------------------------------- réflexes collectifs */

const centres = fiches.filter((f) => f.symetrie > 0.88).length;
const partCentre = fiches.length ? centres / fiches.length : 0;
console.log(`\n  Composition sur axe central : ${centres}/${fiches.length} (${(partCentre * 100).toFixed(0)} %)`);
if (partCentre > 0.35) {
  console.log('    ⚑ au-delà de 35 %, le catalogue a un réflexe de centrage.');
}

const encreMoy = fiches.reduce((s, f) => s + f.encre, 0) / (fiches.length || 1);
const encreEcart = Math.sqrt(fiches.reduce((s, f) => s + (f.encre - encreMoy) ** 2, 0) / (fiches.length || 1));
console.log(`  Densité : moyenne ${(encreMoy * 100).toFixed(1)} % · écart-type ${(encreEcart * 100).toFixed(1)} points`);
if (encreEcart < 0.05 && fiches.length > 3) {
  console.log('    ⚑ écart-type faible : toutes les variantes ont la même densité.');
}

if (SORTIE_JSON) {
  fs.writeFileSync(SORTIE_JSON, JSON.stringify({ viewport: VIEWPORT, seuil: SEUIL, fiches, paires }, null, 2));
  console.log(`\n  → ${SORTIE_JSON}`);
}

process.exit(collisions.length > 0 ? 1 : 0);
