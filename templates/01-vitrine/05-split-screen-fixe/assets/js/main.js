/* ==========================================================================
   01-vitrine/05-split-screen-fixe — couche de détail
   --------------------------------------------------------------------------
   `interaction: modal-layer`. On s'appuie sur <dialog>.showModal() : le piège
   de focus et le retour à l'élément d'origine sont natifs, donc corrects.
   Sans JavaScript — ou sans <dialog> — le lien reste un lien vers la page
   détaillée : le contenu n'est jamais enfermé dans la couche.
   ========================================================================== */

(function () {
  'use strict';

  var couche = document.getElementById('couche');
  if (!couche || typeof couche.showModal !== 'function') return;

  var num = couche.querySelector('[data-num]');
  var fermer = couche.querySelector('[data-fermer]');

  Array.prototype.forEach.call(document.querySelectorAll('[data-detail]'), function (a) {
    a.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (num) num.textContent = '0' + a.getAttribute('data-detail');
      couche.showModal();
    });
  });

  if (fermer) fermer.addEventListener('click', function () { couche.close(); });

  /* Clic sur le fond : on ferme, comme le ferait Échap. */
  couche.addEventListener('click', function (ev) {
    if (ev.target === couche) couche.close();
  });
}());
