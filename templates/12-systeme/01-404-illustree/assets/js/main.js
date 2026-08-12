/* ==========================================================================
   12-systeme/01-404-illustree — main.js
   Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
