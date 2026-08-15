/* ==========================================================================
   02-boutique/02-filtres-sidebar — filtres de matrice
   --------------------------------------------------------------------------
   `interaction: filter-sort` : les lignes sont réellement retirées du DOM
   visible, le compteur et la ligne d'état suivent. Sans JavaScript, toutes les
   cases sont cochées et la matrice est complète — l'état par défaut est un
   état correct, pas une panne.
   ========================================================================== */

(function () {
  'use strict';

  var matrice = document.querySelector('[data-matrice]');
  if (!matrice) return;

  var lignes = Array.prototype.slice.call(matrice.tBodies[0].rows);
  var cases = Array.prototype.slice.call(document.querySelectorAll('[data-filtre]'));
  var max = document.querySelector('[data-max]');
  var maxVal = document.querySelector('[data-max-val]');
  var etat = document.querySelector('[data-etat]');
  var reinit = document.querySelector('[data-reinit]');

  function valeursActives(nom) {
    return cases.filter(function (c) {
      return c.getAttribute('data-filtre') === nom && c.checked;
    }).map(function (c) { return c.value; });
  }

  function appliquer() {
    var series = valeursActives('serie');
    var etats = valeursActives('etat');
    var plafond = max ? parseFloat(max.value) : Infinity;
    var visibles = 0;

    lignes.forEach(function (tr) {
      var montant = parseFloat(tr.cells[4].textContent.replace(',', '.'));
      var garde = series.indexOf(tr.getAttribute('data-serie')) !== -1
        && etats.indexOf(tr.getAttribute('data-etat')) !== -1
        && montant <= plafond;
      tr.hidden = !garde;
      if (garde) visibles += 1;
    });

    if (maxVal && max) maxVal.textContent = max.value;
    if (etat) etat.textContent = visibles + ' ligne(s) sur ' + lignes.length + '.';
  }

  cases.forEach(function (c) { c.addEventListener('change', appliquer); });
  if (max) max.addEventListener('input', appliquer);
  if (reinit) reinit.addEventListener('click', function () { window.setTimeout(appliquer, 0); });

  appliquer();
}());
