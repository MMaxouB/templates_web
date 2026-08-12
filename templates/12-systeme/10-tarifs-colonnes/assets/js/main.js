/* ==========================================================================
   12-systeme/10-tarifs-colonnes — main.js
   Bascule mensuel / annuel. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const toggle = document.querySelector('[data-toggle]');
  const prices = [...document.querySelectorAll('[data-price]')];
  const pers = [...document.querySelectorAll('[data-per]')];

  if (toggle && prices.length) {
    const euro = (n) => `${n.toLocaleString('fr-FR')} €`;

    const apply = (annual) => {
      toggle.setAttribute('aria-checked', String(annual));
      prices.forEach((el) => {
        el.textContent = euro(Number(annual ? el.dataset.a : el.dataset.m));
      });
      pers.forEach((el) => {
        el.textContent = annual ? 'par mois, facturé annuellement' : 'par mois';
      });
    };

    toggle.addEventListener('click', () => {
      apply(toggle.getAttribute('aria-checked') !== 'true');
    });

    // Un role="switch" doit répondre à Espace comme à Entrée.
    toggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        toggle.click();
      }
    });

    apply(false);
  }

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
