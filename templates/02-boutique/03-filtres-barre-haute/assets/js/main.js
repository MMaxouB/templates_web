/* ==========================================================================
   02-boutique/03-filtres-barre-haute — menu plein écran et filtres
   --------------------------------------------------------------------------
   `navigation: overlay-menu` + `interaction: filter-sort`.
   Repli sans JavaScript : l'attribut `hidden` du menu est RETIRÉ au chargement
   par ce script, donc en son absence le menu reste affiché en tête de document
   et tous les filtres restent utilisables comme un formulaire ordinaire.
   ========================================================================== */

(function () {
  'use strict';

  var overlay = document.querySelector('[data-overlay]');
  var ouvrir = document.querySelector('[data-ouvrir]');
  var fermer = document.querySelector('[data-fermer]');
  var mur = document.querySelector('[data-mur]');

  /* --- menu ------------------------------------------------------------- */

  if (overlay && ouvrir) {
    overlay.hidden = true;

    var basculer = function (etat) {
      overlay.hidden = !etat;
      ouvrir.setAttribute('aria-expanded', etat ? 'true' : 'false');
      if (etat) {
        var premier = overlay.querySelector('input, button');
        if (premier) premier.focus();
      } else {
        ouvrir.focus();
      }
    };

    ouvrir.addEventListener('click', function () { basculer(overlay.hidden); });
    if (fermer) fermer.addEventListener('click', function () { basculer(false); });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !overlay.hidden) basculer(false);
    });
  }

  /* --- filtres ----------------------------------------------------------- */

  if (!mur) return;

  var pieces = Array.prototype.slice.call(mur.children);
  var cases = Array.prototype.slice.call(document.querySelectorAll('[data-filtre]'));
  var max = document.querySelector('[data-max]');
  var maxVal = document.querySelector('[data-max-val]');
  var compte = document.querySelector('[data-compte]');
  var tris = Array.prototype.slice.call(document.querySelectorAll('[data-tri]'));

  function appliquer() {
    var series = cases.filter(function (c) { return c.checked; }).map(function (c) { return c.value; });
    var plafond = max ? parseFloat(max.value) : Infinity;
    var visibles = 0;

    pieces.forEach(function (li) {
      var garde = (!cases.length || series.indexOf(li.getAttribute('data-serie')) !== -1)
        && parseFloat(li.getAttribute('data-prix')) <= plafond;
      li.hidden = !garde;
      if (garde) visibles += 1;
    });

    var parPrix = tris.some(function (r) { return r.checked && r.value === 'prix'; });
    var ordre = parPrix
      ? pieces.slice().sort(function (a, b) {
        return parseFloat(a.getAttribute('data-prix')) - parseFloat(b.getAttribute('data-prix'));
      })
      : pieces;
    ordre.forEach(function (li) { mur.appendChild(li); });

    if (maxVal && max) maxVal.textContent = max.value;
    if (compte) compte.textContent = String(visibles);
  }

  cases.forEach(function (c) { c.addEventListener('change', appliquer); });
  tris.forEach(function (r) { r.addEventListener('change', appliquer); });
  if (max) max.addEventListener('input', appliquer);
}());
