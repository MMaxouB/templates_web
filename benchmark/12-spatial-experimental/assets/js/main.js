/* ==========================================================================
   benchmark/12-spatial-experimental
   Motion : scroll-driven · Interaction : progressive-reveal
   --------------------------------------------------------------------------
   Le script AJOUTE la classe `js-reveler` avant de masquer quoi que ce soit.
   L'ordre compte : si le JavaScript ne s'exécute pas, la classe n'existe pas,
   la règle CSS de masquage ne s'applique pas, et toute la page reste lisible.
   Poser l'état masqué en CSS aurait rendu la page vide sans JS — c'est
   l'erreur classique du « révéler au défilement ».

   `prefers-reduced-motion` est traité en CSS (les éléments restent visibles)
   ET ici : on n'observe rien du tout, pour ne pas dépenser de calcul.
   ========================================================================== */

(function () {
  'use strict';

  var cibles = document.querySelectorAll('[data-reveler]');
  if (!cibles.length) return;

  var reduit = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sans IntersectionObserver ou en mouvement réduit : on ne masque jamais.
  if (reduit || !('IntersectionObserver' in window)) return;

  document.documentElement.classList.add('js-reveler');

  var observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('est-visible');
      observateur.unobserve(e.target);   // une seule fois : ce n'est pas un yoyo
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

  cibles.forEach(function (c) { observateur.observe(c); });
})();
