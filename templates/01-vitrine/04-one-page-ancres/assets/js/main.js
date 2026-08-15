/* ==========================================================================
   01-vitrine/04-one-page-ancres — progression
   --------------------------------------------------------------------------
   `navigation: progress-driven` : la jauge et les deux pas SONT la navigation.
   Sans JavaScript, les liens « précédent » et « suivant » restent des ancres
   valides (#b1 / #b2) et la page reste parcourable — le script ne fait que
   les recâbler sur la bande courante.
   ========================================================================== */

(function () {
  'use strict';

  var bandes = Array.prototype.slice.call(document.querySelectorAll('[data-bande]'));
  var rang = document.querySelector('[data-rang]');
  var titre = document.querySelector('[data-titre]');
  var part = document.querySelector('[data-part]');
  var prec = document.querySelector('[data-prec]');
  var suiv = document.querySelector('[data-suiv]');
  if (!bandes.length || !rang || !part || !prec || !suiv) return;

  var courant = 0;

  function poser(i) {
    courant = Math.max(0, Math.min(bandes.length - 1, i));
    var n = courant + 1;
    rang.textContent = String(n).padStart(2, '0');
    part.style.inlineSize = (n / bandes.length * 100) + '%';
    if (titre) {
      var h = bandes[courant].querySelector('h1, h2');
      titre.textContent = h ? h.textContent.replace(/\s+/g, ' ').trim() : '';
    }
    prec.setAttribute('href', '#' + bandes[Math.max(0, courant - 1)].id);
    suiv.setAttribute('href', '#' + bandes[Math.min(bandes.length - 1, courant + 1)].id);
    prec.setAttribute('aria-disabled', courant === 0 ? 'true' : 'false');
    suiv.setAttribute('aria-disabled', courant === bandes.length - 1 ? 'true' : 'false');
  }

  poser(0);

  if (!('IntersectionObserver' in window)) return;

  var obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) poser(bandes.indexOf(e.target));
    });
  }, { rootMargin: '-45% 0px -45% 0px' });

  bandes.forEach(function (b) { obs.observe(b); });
}());
