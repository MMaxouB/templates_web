/* ==========================================================================
   12-systeme/02-404-typographique — main.js
   Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
