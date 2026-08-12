/* ==========================================================================
   12-systeme/04-maintenance — main.js
   Compte à rebours et inscription au retour. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  /* ---------------------------------------------------------- rebours */

  const h = document.querySelector('[data-h]');
  const m = document.querySelector('[data-m]');
  const s = document.querySelector('[data-s]');
  const note = document.querySelector('[data-countdown-note]');

  if (h && m && s) {
    // Démo : deux heures à partir du chargement. En production, remplacer par
    // une date fixe — new Date('2026-01-01T09:00:00Z').getTime().
    const target = Date.now() + 2 * 60 * 60 * 1000;
    const pad = (n) => String(n).padStart(2, '0');

    const tick = () => {
      const left = target - Date.now();

      if (left <= 0) {
        h.textContent = m.textContent = s.textContent = '00';
        note.textContent = 'Le service est de retour. Rechargez la page.';
        clearInterval(timer);
        return;
      }

      const total = Math.floor(left / 1000);
      h.textContent = pad(Math.floor(total / 3600));
      m.textContent = pad(Math.floor((total % 3600) / 60));
      s.textContent = pad(total % 60);
    };

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------- inscription */

  const form = document.querySelector('[data-notify]');
  const msg = document.querySelector('[data-notify-msg]');

  if (form && msg) {
    const field = form.querySelector('input[type="email"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Aucun back-end : la page est une maquette.

      const value = field.value.trim();
      const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);

      msg.hidden = false;
      field.setAttribute('aria-invalid', String(!valid));

      if (valid) {
        msg.removeAttribute('data-state');
        msg.textContent = 'Lorem ipsum : vous serez prévenu à cette adresse.';
        field.value = '';
        field.removeAttribute('aria-invalid');
      } else {
        msg.dataset.state = 'error';
        msg.textContent = 'Le format attendu est une adresse électronique.';
        field.focus();
      }
    });
  }

  /* ------------------------------------------------------- liens morts */

  document.querySelectorAll('a[data-stub], form[data-stub]').forEach((el) => {
    if (el.tagName === 'A') el.addEventListener('click', (e) => e.preventDefault());
  });
})();
