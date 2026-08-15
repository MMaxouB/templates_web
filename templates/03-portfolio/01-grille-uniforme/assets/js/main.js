/* ==========================================================================
   03-portfolio/01-grille-uniforme — projection au centre
   --------------------------------------------------------------------------
   `interaction: hover-preview`, avec l'équivalent clavier obligatoire : le
   `focus` déclenche exactement la même projection que le survol, et le centre
   est en `aria-live="polite"` pour que le changement soit annoncé.
   Sans JavaScript, le centre affiche « Désigner une entrée » et les vignettes
   restent des liens ordinaires vers la page de projet.
   ========================================================================== */

(function () {
  'use strict';

  var num = document.querySelector('[data-cible-num]');
  var titre = document.querySelector('[data-cible-titre]');
  var liens = document.querySelectorAll('[data-titre]');
  if (!num || !titre || !liens.length) return;

  function montrer(ev) {
    var a = ev.currentTarget;
    num.textContent = a.getAttribute('data-num');
    titre.textContent = a.getAttribute('data-titre');
  }

  function vider() {
    num.textContent = '';
    titre.textContent = 'Désigner une entrée';
  }

  Array.prototype.forEach.call(liens, function (a) {
    a.addEventListener('mouseenter', montrer);
    a.addEventListener('focus', montrer);
    a.addEventListener('mouseleave', vider);
    a.addEventListener('blur', vider);
  });
}());
