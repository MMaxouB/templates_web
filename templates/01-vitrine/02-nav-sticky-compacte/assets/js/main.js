/* ==========================================================================
   01-vitrine/02-nav-sticky-compacte — progression
   --------------------------------------------------------------------------
   `interaction: progressive-reveal`, avec repli sans JS : si ce fichier ne
   s'exécute pas, aucun attribut n'est posé et la page reste entièrement
   lisible. Le script ne fait qu'ajouter un repère, il ne révèle jamais du
   contenu qui serait autrement inaccessible.
   ========================================================================== */

(function () {
  'use strict';

  var blocs = Array.prototype.slice.call(document.querySelectorAll('[data-bloc]'));
  var rang = document.querySelector('[data-rang]');
  if (!blocs.length || !rang) return;

  blocs.forEach(function (b) { b.setAttribute('data-lu', 'non'); });

  if (!('IntersectionObserver' in window)) {
    blocs.forEach(function (b) { b.removeAttribute('data-lu'); });
    return;
  }

  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (!e.isIntersecting) return;
      var i = blocs.indexOf(e.target);
      rang.textContent = String(i + 1).padStart(2, '0');
      for (var k = 0; k <= i; k++) blocs[k].setAttribute('data-lu', 'oui');
    });
  }, { rootMargin: '-40% 0px -50% 0px' });

  blocs.forEach(function (b) { obs.observe(b); });
}());
