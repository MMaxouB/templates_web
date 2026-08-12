#!/usr/bin/env node
/**
 * screenshot.js — capture les variantes et mesure ce qu'on ne peut pas juger
 * à la lecture du code.
 *
 *   node _tools/screenshot.js                          tout ce qui est dans dist/
 *   node _tools/screenshot.js systeme-10--quotidien    un dossier livrable
 *   node _tools/screenshot.js --viewports 1280,375     largeurs choisies
 *   node _tools/screenshot.js --no-probe               captures seules
 *
 * Produit, dans `previews/` à la racine :
 *   previews/<dossier>/<largeur>.png    les captures
 *   previews/<dossier>/probe.json       les mesures de structure
 *
 * POURQUOI CET OUTIL EXISTE
 * La capture est une source de vérité plus fiable que le meta.json. Deux
 * variantes peuvent déclarer des ADN opposés et rendre la même image ; c'est
 * précisément le défaut qu'on cherche. Les métadonnées disent l'intention,
 * les pixels disent le résultat.
 *
 * LA SONDE
 * Chromium en mode headless ne sait pas nous rendre le résultat d'un script.
 * On contourne : on dépose à côté de la page une copie qui embarque la sonde,
 * on demande `--dump-dom` (qui exécute bien le JS), et on relit le JSON que la
 * sonde a écrit dans le DOM. Aucune dépendance, aucun protocole à parler.
 *
 * Aucune dépendance npm. Nécessite un binaire Chromium ou Chrome.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const OUT = path.join(ROOT, 'previews');

const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

/* ------------------------------------------------------------------ chromium */

const CANDIDATS = [
  process.env.CHROME_BIN,
  'chromium', 'chromium-browser', 'google-chrome', 'google-chrome-stable',
  '/usr/bin/chromium', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
].filter(Boolean);

const trouverChromium = () => {
  for (const c of CANDIDATS) {
    try {
      execFileSync(c, ['--version'], { stdio: 'ignore', timeout: 10000 });
      return c;
    } catch { /* suivant */ }
  }
  return null;
};

const CHROME = trouverChromium();
if (!CHROME) {
  die('aucun binaire Chromium trouvé.\n' +
      '  Installer chromium, ou renseigner CHROME_BIN=/chemin/vers/chrome');
}

const BASE_FLAGS = [
  '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
  '--disable-lcd-text', '--force-device-scale-factor=1',
  '--virtual-time-budget=4000',
];

/* -------------------------------------------------------------------- la sonde
   Tourne DANS la page. Ne mesure que ce qui demande une mise en page réelle :
   tout ce qui se voit dans le CSS est mesuré par check-constraints.js. */

const SONDE = `
(function () {
  var vw = innerWidth, vh = innerHeight;
  var visibles = [];
  var tailles = {}, familles = {};

  function texteUtile(el) {
    var t = '';
    for (var i = 0; i < el.childNodes.length; i++) {
      if (el.childNodes[i].nodeType === 3) t += el.childNodes[i].nodeValue;
    }
    return t.trim();
  }

  var tous = document.body.querySelectorAll('*');
  for (var i = 0; i < tous.length; i++) {
    var el = tous[i];
    var r = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || !r.width || !r.height) continue;

    var ts = Math.round(parseFloat(cs.fontSize));
    if (texteUtile(el)) {
      tailles[ts] = (tailles[ts] || 0) + 1;
      familles[cs.fontFamily.split(',')[0].replace(/["']/g, '').trim()] = 1;
    }

    // « Élément de contenu » : porte du texte propre, ou est un média.
    var estContenu = !!texteUtile(el) || /^(IMG|SVG|VIDEO|CANVAS|INPUT|SELECT|TEXTAREA|BUTTON|HR)$/.test(el.tagName);
    if (estContenu && r.top < vh && r.bottom > 0) {
      visibles.push({ tag: el.tagName, top: r.top, left: r.left, w: r.width, h: r.height, ts: ts });
    }
  }

  var listeTailles = Object.keys(tailles).map(Number).sort(function (a, b) { return a - b; });

  // --- hero centré : un h1 haut de page, centré, suivi d'un paragraphe et de liens d'action
  var h1 = document.querySelector('h1');
  var heroCentre = false, badgeAvantH1 = false, sousTitreGris = false, doubleCta = false;
  var h1Haut = 0;
  if (h1) {
    var rh = h1.getBoundingClientRect();
    var ch = getComputedStyle(h1);
    h1Haut = rh.height / vh;
    var centreH1 = Math.abs((rh.left + rh.right) / 2 - vw / 2) < vw * 0.06;
    var texteCentre = ch.textAlign === 'center';
    heroCentre = rh.top < vh * 0.6 && centreH1 && (texteCentre || rh.width < vw * 0.9);

    var prec = h1.previousElementSibling;
    if (prec) {
      var rp = prec.getBoundingClientRect();
      badgeAvantH1 = rp.height < 48 && rp.width < vw * 0.5 && !!prec.textContent.trim();
    }
    var suiv = h1.nextElementSibling;
    if (suiv && /^(P|DIV)$/.test(suiv.tagName)) {
      var csx = getComputedStyle(suiv);
      var m = csx.color.match(/\\d+/g);
      if (m) {
        var lum = (+m[0] * 0.2126 + +m[1] * 0.7152 + +m[2] * 0.0722);
        sousTitreGris = lum > 80 && lum < 190 && Math.abs(+m[0] - +m[1]) < 26 && Math.abs(+m[1] - +m[2]) < 26;
      }
    }
  }

  // --- deux actions côte à côte
  var actions = [].slice.call(document.querySelectorAll('a[class*=btn],a[class*=cta],button[class*=btn],.btn,.cta'));
  for (var a = 0; a < actions.length - 1; a++) {
    var r1 = actions[a].getBoundingClientRect(), r2 = actions[a + 1].getBoundingClientRect();
    if (Math.abs(r1.top - r2.top) < 8 && r1.top < vh) { doubleCta = true; break; }
  }

  // --- grille de cartes égales : >= 3 frères de même largeur et même hauteur, alignés
  var grilleCartes = false;
  var parents = document.querySelectorAll('ul,ol,div,section');
  for (var p = 0; p < parents.length && !grilleCartes; p++) {
    var enfants = parents[p].children, boites = [];
    for (var c = 0; c < enfants.length; c++) {
      var rc = enfants[c].getBoundingClientRect();
      if (rc.width > 80 && rc.height > 80) boites.push(rc);
    }
    if (boites.length < 3) continue;
    var w0 = boites[0].width, h0 = boites[0].height, t0 = boites[0].top, ok = 0;
    for (var b = 0; b < boites.length; b++) {
      if (Math.abs(boites[b].width - w0) < 4 && Math.abs(boites[b].height - h0) < 24 && Math.abs(boites[b].top - t0) < 24) ok++;
    }
    if (ok >= 3) grilleCartes = true;
  }

  // --- barre horizontale standard : header en haut, marque à gauche, liens à droite
  var navbarStandard = false;
  var entete = document.querySelector('header,[role=banner]');
  if (entete) {
    var re = entete.getBoundingClientRect();
    if (re.top < 24 && re.height < 140 && re.width > vw * 0.85) {
      var liens = entete.querySelectorAll('a');
      var gauche = 0, droite = 0;
      for (var l = 0; l < liens.length; l++) {
        var rl = liens[l].getBoundingClientRect();
        if (rl.left + rl.width / 2 < vw / 2) gauche++; else droite++;
      }
      navbarStandard = gauche >= 1 && droite >= 2;
    }
  }

  // --- pied de page multi-colonnes
  var colonnesPied = 0;
  var pied = document.querySelector('footer,[role=contentinfo]');
  if (pied) {
    var dessus = {};
    var lp = pied.querySelectorAll('ul,nav,div');
    for (var q = 0; q < lp.length; q++) {
      var rq = lp[q].getBoundingClientRect();
      if (rq.height > 40 && rq.width > 60 && rq.width < vw * 0.4) dessus[Math.round(rq.top / 10)] = (dessus[Math.round(rq.top / 10)] || 0) + 1;
    }
    for (var k in dessus) colonnesPied = Math.max(colonnesPied, dessus[k]);
  }

  var res = {
    viewport: { w: vw, h: vh },
    premier_ecran_elements: visibles.length,
    elements_total: tous.length,
    premier_h1_hauteur_relative: +h1Haut.toFixed(3),
    tailles_distinctes: listeTailles.length,
    taille_min: listeTailles[0] || 0,
    taille_max: listeTailles[listeTailles.length - 1] || 0,
    ratio_taille_type: listeTailles.length ? +(listeTailles[listeTailles.length - 1] / listeTailles[0]).toFixed(2) : 1,
    familles_distinctes: Object.keys(familles).length,
    familles: Object.keys(familles),
    hero_centre_detecte: heroCentre,
    badge_avant_h1: badgeAvantH1,
    sous_titre_gris: sousTitreGris,
    double_cta: doubleCta,
    grille_cartes_egales: grilleCartes,
    navbar_standard: navbarStandard,
    footer_colonnes: colonnesPied,
    hauteur_document: document.documentElement.scrollHeight
  };

  var s = document.createElement('script');
  s.type = 'application/json';
  s.id = '__sonde__';
  s.textContent = JSON.stringify(res);
  document.body.appendChild(s);
})();
`;

/* ------------------------------------------------------------------ utilitaires */

const capturer = (url, largeur, hauteur, sortie) => {
  execFileSync(CHROME, [
    ...BASE_FLAGS,
    `--window-size=${largeur},${hauteur}`,
    `--screenshot=${sortie}`,
    url,
  ], { stdio: 'ignore', timeout: 60000 });
};

const sonder = (dossier, page, largeur, hauteur) => {
  const source = path.join(dossier, page);
  const temporaire = path.join(dossier, '__sonde.html');
  let html = fs.readFileSync(source, 'utf8');
  html = html.replace(/<\/body>/i, `<script>${SONDE}</script></body>`);
  fs.writeFileSync(temporaire, html);

  try {
    const dom = execFileSync(CHROME, [
      ...BASE_FLAGS,
      `--window-size=${largeur},${hauteur}`,
      '--dump-dom',
      `file://${temporaire}`,
    ], {
      encoding: 'utf8',
      timeout: 60000,
      maxBuffer: 64 * 1024 * 1024,
      // Chromium bavarde sur stderr (GPU, mailbox) même en headless : on l'ignore.
      stdio: ['ignore', 'pipe', 'ignore'],
    });

    const m = dom.match(/<script type="application\/json" id="__sonde__">([\s\S]*?)<\/script>/);
    return m ? JSON.parse(m[1]) : null;
  } catch (e) {
    return { erreur: String(e.message || e).slice(0, 200) };
  } finally {
    fs.rmSync(temporaire, { force: true });
  }
};

/* ------------------------------------------------------------------- arguments */

const argv = process.argv.slice(2);
const opt = (n, d) => {
  const i = argv.indexOf(`--${n}`);
  return i === -1 ? d : argv[i + 1];
};
const avecSonde = !argv.includes('--no-probe');
const largeurs = opt('viewports', '1280,768,375').split(',').map((s) => parseInt(s.trim(), 10));
const cibles = argv.filter((a) => !a.startsWith('--') && !largeurs.includes(parseInt(a, 10)) && a !== opt('viewports', null));

if (!fs.existsSync(DIST)) die('dist/ est vide — lancer d\'abord node _tools/build.js');

let dossiers = fs.readdirSync(DIST).filter((d) => fs.statSync(path.join(DIST, d)).isDirectory());
if (cibles.length) dossiers = dossiers.filter((d) => cibles.some((c) => d.includes(c)));
if (!dossiers.length) die('aucun dossier de dist/ ne correspond');

console.log(`Chromium : ${CHROME}`);
console.log(`${dossiers.length} dossier(s) · largeurs ${largeurs.join(', ')}\n`);

fs.mkdirSync(OUT, { recursive: true });

let n = 0;
for (const d of dossiers) {
  const src = path.join(DIST, d);
  const page = fs.readdirSync(src).find((f) => f === 'index.html')
    || fs.readdirSync(src).find((f) => f.endsWith('.html'));
  if (!page) { console.log(`  ⚠ ${d} — aucune page`); continue; }

  const dest = path.join(OUT, d);
  fs.mkdirSync(dest, { recursive: true });
  const url = `file://${path.join(src, page)}`;

  for (const w of largeurs) {
    const h = w >= 1280 ? 900 : w >= 768 ? 1024 : 812;
    capturer(url, w, h, path.join(dest, `${w}.png`));
  }

  let resume = '';
  if (avecSonde) {
    const probe = sonder(src, page, 1280, 900);
    if (probe) {
      fs.writeFileSync(path.join(dest, 'probe.json'), JSON.stringify(probe, null, 2));
      const drapeaux = [
        probe.hero_centre_detecte && 'hero-centré',
        probe.navbar_standard && 'navbar-standard',
        probe.grille_cartes_egales && 'cartes-égales',
        probe.badge_avant_h1 && 'badge',
        probe.double_cta && '2-cta',
      ].filter(Boolean);
      resume = `${probe.premier_ecran_elements} él.`
        + (drapeaux.length ? `  ⚑ ${drapeaux.join(' ')}` : '');
    }
  }

  n += 1;
  console.log(`  ✓ ${d.padEnd(38)} ${resume}`);
}

console.log(`\n${n} variante(s) capturée(s) → previews/`);
console.log('Suite : node _tools/perceptual-diff.js');
