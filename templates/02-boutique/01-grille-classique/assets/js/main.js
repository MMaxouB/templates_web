/* ==========================================================================
   02-boutique/01-grille-classique — filtres et tri
   --------------------------------------------------------------------------
   `interaction: filter-sort` engage trois choses, et pas seulement des
   contrôles : le DOM visible change réellement, le compteur suit, et l'état
   est annoncé. Sans JavaScript, aucun article n'est masqué — « aucun filtre »
   est un état valide du catalogue, pas une panne.
   ========================================================================== */

(function () {
  'use strict';

  var grille = document.querySelector('[data-grille]');
  var compte = document.querySelector('[data-compte]');
  var etat = document.querySelector('[data-etat]');
  if (!grille) return;

  var articles = Array.prototype.slice.call(grille.children);
  var filtres = Array.prototype.slice.call(document.querySelectorAll('[data-filtre]'));
  var tri = document.querySelector('[data-tri]');

  function appliquer() {
    var actifs = [];
    var visibles = 0;

    articles.forEach(function (li) {
      var garde = filtres.every(function (sel) {
        var v = sel.value;
        return !v || li.getAttribute('data-' + sel.getAttribute('data-filtre')) === v;
      });
      li.hidden = !garde;
      if (garde) visibles += 1;
    });

    filtres.forEach(function (sel) {
      if (sel.value) {
        actifs.push(sel.previousElementSibling.textContent + ' : ' +
          sel.options[sel.selectedIndex].textContent);
      }
    });

    if (tri && tri.value !== 'ref') {
      var sens = tri.value === 'prix-desc' ? -1 : 1;
      articles.slice().sort(function (a, b) {
        return sens * (parseFloat(a.getAttribute('data-prix')) - parseFloat(b.getAttribute('data-prix')));
      }).forEach(function (li) { grille.appendChild(li); });
    } else {
      articles.forEach(function (li) { grille.appendChild(li); });
    }

    if (compte) compte.textContent = String(visibles);
    if (etat) {
      etat.textContent = actifs.length
        ? visibles + ' sur ' + articles.length + ' — ' + actifs.join(' · ')
        : 'Aucun filtre appliqué.';
    }
  }

  filtres.forEach(function (sel) { sel.addEventListener('change', appliquer); });
  if (tri) tri.addEventListener('change', appliquer);
}());
