/* ==========================================================================
   12-systeme/05-coming-soon — main.js
   Validation locale du formulaire d'inscription. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const form = document.querySelector('[data-signup]');
  const msg = document.querySelector('[data-signup-msg]');

  if (form && msg) {
    const field = form.querySelector('input[type="email"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Aucun back-end : la page est une maquette.

      const value = field.value.trim();
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

      msg.hidden = false;

      if (valid) {
        msg.removeAttribute('data-state');
        msg.textContent = 'Lorem ipsum : votre adresse est enregistrée.';
        field.value = '';
        field.removeAttribute('aria-invalid');
      } else {
        msg.dataset.state = 'error';
        msg.textContent = 'Le format attendu est une adresse électronique.';
        field.setAttribute('aria-invalid', 'true');
        field.focus();
      }
    });
  }

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
