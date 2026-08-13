/* ==========================================================================
   benchmark/04-systeme-ancien
   Navigation : overlay-menu · Interaction : modal-layer
   --------------------------------------------------------------------------
   Deux couches, deux mécaniques d'époque :

     · le menu Fichier masque entièrement la fenêtre à l'ouverture ;
     · la fiche « propriétés » s'ouvre en <dialog>, qui fournit nativement le
       piège de focus et le retour au déclencheur.

   Échap ferme les deux, et le focus revient toujours d'où il venait — c'est la
   convention de l'époque et c'est aussi ce qu'exige l'accessibilité.
   ========================================================================== */

(function () {
  'use strict';

  var dernierFocus = null;

  /* ------------------------------------------------------- menu plein écran */

  var declencheur = document.getElementById('ouvrir-menu');
  var menu = document.getElementById('menu-plein');

  function ouvrirMenu() {
    dernierFocus = document.activeElement;
    menu.hidden = false;
    declencheur.setAttribute('aria-expanded', 'true');
    var premier = menu.querySelector('a, button');
    if (premier) premier.focus();
  }

  function fermerMenu() {
    menu.hidden = true;
    declencheur.setAttribute('aria-expanded', 'false');
    declencheur.focus();
  }

  if (declencheur && menu) {
    declencheur.addEventListener('click', ouvrirMenu);

    // Un clic sur un lien de section ferme le menu : on a navigué.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a') || e.target.closest('[data-fermer]')) fermerMenu();
    });
  }

  /* ------------------------------------------------------------- la fiche */

  var boite = document.getElementById('fiche-serie');

  document.addEventListener('click', function (e) {
    var ouvre = e.target.closest('[data-fiche]');
    if (ouvre && boite) {
      dernierFocus = ouvre;
      if (typeof boite.showModal === 'function') boite.showModal();
      else boite.setAttribute('open', '');
      return;
    }

    if (e.target.closest('[data-fermer]') && boite && boite.open) {
      if (typeof boite.close === 'function') boite.close();
      else boite.removeAttribute('open');
    }
  });

  if (boite) {
    boite.addEventListener('close', function () {
      if (dernierFocus && dernierFocus.focus) dernierFocus.focus();
    });
  }

  /* ---------------------------------------------------------------- Échap */

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (menu && !menu.hidden) { fermerMenu(); return; }
  });
})();
