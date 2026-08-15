/* ==========================================================================
   01-vitrine/03-sidebar-fixe — aperçu au survol
   --------------------------------------------------------------------------
   `interaction: hover-preview`. L'équivalent clavier n'est pas une option :
   `focus` déclenche exactement le même changement que `mouseenter`. Sans JS,
   la vignette reste sur son premier repère et la page fonctionne.
   ========================================================================== */

(function () {
  'use strict';

  var vue = document.querySelector('[data-vue]');
  var legende = document.querySelector('[data-legende]');
  var liens = document.querySelectorAll('[data-apercu]');
  if (!vue || !legende || !liens.length) return;

  function montrer(e) {
    var n = e.currentTarget.getAttribute('data-apercu');
    vue.setAttribute('data-vue', n);
    legende.textContent = 'Repère ' + n;
  }

  Array.prototype.forEach.call(liens, function (a) {
    a.addEventListener('mouseenter', montrer);
    a.addEventListener('focus', montrer);
  });
}());
