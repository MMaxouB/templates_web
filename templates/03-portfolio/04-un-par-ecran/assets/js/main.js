/* ==========================================================================
   03-portfolio/04-un-par-ecran — on tourne les plans
   --------------------------------------------------------------------------
   `interaction: page-turn` + `navigation: progress-driven`. Un plan à la fois,
   deux pas, une jauge. Les flèches ← → font la même chose que les boutons.
   Sans JavaScript, les six plans sont empilés et se lisent au défilement : le
   repli est la page entière, pas un message d'erreur.
   ========================================================================== */

(function () {
  'use strict';

  var pile = document.querySelector('[data-pile]');
  if (!pile) return;

  var plans = Array.prototype.slice.call(pile.querySelectorAll('[data-plan]'));
  var rang = document.querySelector('[data-rang]');
  var part = document.querySelector('[data-part]');
  var prec = document.querySelector('[data-prec]');
  var suiv = document.querySelector('[data-suiv]');
  if (plans.length < 2 || !rang || !part) return;

  var i = 0;

  function poser(n) {
    i = Math.max(0, Math.min(plans.length - 1, n));
    plans.forEach(function (p, k) { p.hidden = k !== i; });
    rang.textContent = String(i + 1).padStart(2, '0');
    part.style.inlineSize = ((i + 1) / plans.length * 100) + '%';
    if (prec) prec.disabled = i === 0;
    if (suiv) suiv.disabled = i === plans.length - 1;
  }

  poser(0);

  if (prec) prec.addEventListener('click', function () { poser(i - 1); });
  if (suiv) suiv.addEventListener('click', function () { poser(i + 1); });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowLeft') poser(i - 1);
    if (ev.key === 'ArrowRight') poser(i + 1);
  });
}());
