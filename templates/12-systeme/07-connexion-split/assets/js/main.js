/* ==========================================================================
   12-systeme/07-connexion-split — main.js
   Bascule d'affichage du mot de passe et validation locale. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  /* -------------------------------------------------- afficher/masquer */

  const pass = document.querySelector('[data-pass]');
  const reveal = document.querySelector('[data-reveal]');

  if (pass && reveal) {
    reveal.addEventListener('click', () => {
      const shown = pass.type === 'text';
      pass.type = shown ? 'password' : 'text';
      reveal.textContent = shown ? 'Afficher' : 'Masquer';
      reveal.setAttribute('aria-pressed', String(!shown));
      reveal.setAttribute(
        'aria-label',
        shown ? 'Afficher le mot de passe' : 'Masquer le mot de passe'
      );
      pass.focus();
    });
  }

  /* -------------------------------------------------------- validation */

  const form = document.querySelector('[data-login]');
  const error = document.querySelector('[data-error]');

  if (form && error) {
    const mail = form.querySelector('input[type="email"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Aucun back-end : la page est une maquette.

      const problems = [];
      const mailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(mail.value.trim());

      mail.setAttribute('aria-invalid', String(!mailOk));
      if (!mailOk) problems.push('une adresse électronique valide');

      const passOk = pass.value.length >= 8;
      pass.setAttribute('aria-invalid', String(!passOk));
      if (!passOk) problems.push('un mot de passe d’au moins 8 caractères');

      if (problems.length) {
        error.hidden = false;
        error.textContent = `Il manque ${problems.join(' et ')}.`;
        (mailOk ? pass : mail).focus();
      } else {
        error.hidden = true;
        mail.removeAttribute('aria-invalid');
        pass.removeAttribute('aria-invalid');
      }
    });
  }

  /* ------------------------------------------------------- liens morts */

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
