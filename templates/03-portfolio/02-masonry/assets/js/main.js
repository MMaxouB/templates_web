/* ==========================================================================
   03-portfolio/02-masonry — ordre du relevé
   --------------------------------------------------------------------------
   `interaction: filter-sort` réduit ici à ce que la page fait réellement :
   réordonner. Le tri modifie l'ordre du DOM — donc l'ordre de lecture des
   colonnes — et l'état est annoncé. Sans JavaScript, l'ordre alphabétique du
   document est déjà le bon.
   ========================================================================== */

(function () {
  'use strict';

  var zone = document.querySelector('[data-colonnes]');
  var tri = document.querySelector('[data-tri]');
  var etat = document.querySelector('[data-etat]');
  if (!zone || !tri) return;

  var notices = Array.prototype.slice.call(zone.children);

  tri.addEventListener('change', function () {
    var inverse = tri.value === 'inverse';
    notices.slice().sort(function (a, b) {
      var x = a.querySelector('.notice__titre').textContent.trim();
      var y = b.querySelector('.notice__titre').textContent.trim();
      return (inverse ? -1 : 1) * x.localeCompare(y, 'fr');
    }).forEach(function (n) { zone.appendChild(n); });

    if (etat) etat.textContent = inverse ? 'Ordre alphabétique inverse.' : 'Ordre alphabétique.';
  });
}());
