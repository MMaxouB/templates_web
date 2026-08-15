/* ==========================================================================
   03-portfolio/03-liste-hover — aperçu au survol
   --------------------------------------------------------------------------
   `interaction: hover-preview`, avec équivalent clavier : au `focus`, l'aperçu
   s'affiche à une position fixe (62 % / 30 %) au lieu de suivre le pointeur.
   Sans JavaScript, aucun aperçu n'apparaît et la liste reste une liste de
   liens — ce qui est exactement ce que la page prétend être.
   ========================================================================== */

(function () {
  'use strict';

  var apercu = document.querySelector('[data-apercu]');
  var liste = document.querySelector('[data-liste]');
  if (!apercu || !liste) return;

  var liens = liste.querySelectorAll('[data-vue]');

  function montrer(a) {
    apercu.setAttribute('data-vue', a.getAttribute('data-vue'));
    apercu.setAttribute('data-visible', 'oui');
  }

  function cacher() {
    apercu.removeAttribute('data-visible');
  }

  Array.prototype.forEach.call(liens, function (a) {
    a.addEventListener('mouseenter', function () { montrer(a); });
    a.addEventListener('mouseleave', cacher);
    a.addEventListener('focus', function () {
      apercu.style.removeProperty('--x');
      apercu.style.removeProperty('--y');
      montrer(a);
    });
    a.addEventListener('blur', cacher);
  });

  liste.addEventListener('mousemove', function (ev) {
    apercu.style.setProperty('--x', (ev.clientX + 24) + 'px');
    apercu.style.setProperty('--y', Math.max(16, ev.clientY - 160) + 'px');
  });
}());
