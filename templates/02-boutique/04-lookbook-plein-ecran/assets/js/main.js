/* ==========================================================================
   02-boutique/04-lookbook-plein-ecran — on tourne les pages
   --------------------------------------------------------------------------
   `interaction: page-turn` : navigation discrète par unité, jamais de
   défilement continu. Sans JavaScript, aucune planche n'est masquée et le
   cahier se lit d'une traite — c'est le repli, et il est complet.
   Les flèches ← → font la même chose que les deux boutons.
   ========================================================================== */

(function () {
  'use strict';

  var cahier = document.querySelector('[data-cahier]');
  if (!cahier) return;

  var planches = Array.prototype.slice.call(cahier.querySelectorAll('[data-planche]'));
  var prec = document.querySelector('[data-prec]');
  var suiv = document.querySelector('[data-suiv]');
  var reperes = Array.prototype.slice.call(document.querySelectorAll('[data-aller]'));
  if (planches.length < 2) return;

  var i = 0;

  function poser(n) {
    i = (n + planches.length) % planches.length;
    planches.forEach(function (p, k) { p.hidden = k !== i; });
    reperes.forEach(function (a, k) {
      if (k === i) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  }

  poser(0);

  if (prec) prec.addEventListener('click', function () { poser(i - 1); });
  if (suiv) suiv.addEventListener('click', function () { poser(i + 1); });

  reperes.forEach(function (a, k) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); poser(k); });
  });

  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowLeft') poser(i - 1);
    if (ev.key === 'ArrowRight') poser(i + 1);
  });
}());
