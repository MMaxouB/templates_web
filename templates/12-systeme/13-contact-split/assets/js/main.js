/* ==========================================================================
   12-systeme/13-contact-split — main.js
   Compteur de caractères et validation locale. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  /* -------------------------------------------------------- compteur */

  const area = document.querySelector('[data-textarea]');
  const count = document.querySelector('[data-count]');

  if (area && count) {
    const sync = () => { count.textContent = String(area.value.length); };
    area.addEventListener('input', sync);
    sync();
  }

  /* ------------------------------------------------------- validation */

  const form = document.querySelector('[data-form]');
  const done = document.querySelector('[data-done]');

  if (form) {
    const RULES = {
      text: (v) => (v.trim().length >= 2 ? '' : 'Deux caractères minimum.'),
      mail: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())
        ? '' : 'Le format attendu est une adresse électronique.'),
      long: (v) => (v.trim().length >= 10 ? '' : 'Dix caractères minimum.'),
      check: (v, el) => (el.checked ? '' : 'Cette case doit être cochée.'),
    };

    const validate = (el) => {
      const rule = RULES[el.dataset.kind];
      if (!rule) return true;

      const error = rule(el.value, el);
      const holder = el.closest('.field, .check');
      const msg = holder?.querySelector('[data-msg]')
        || holder?.parentElement.querySelector('[data-msg]');

      if (msg) msg.textContent = error;
      el.setAttribute('aria-invalid', String(Boolean(error)));
      return !error;
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Aucun back-end : la page est une maquette.

      let ok = true;
      let first = null;
      form.querySelectorAll('[data-req]').forEach((el) => {
        if (!validate(el)) { ok = false; first = first || el; }
      });

      if (ok) {
        done.hidden = false;
        form.querySelector('button[type="submit"]').disabled = true;
      } else {
        first?.focus();
      }
    });

    form.addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset.req && el.getAttribute('aria-invalid') === 'true') validate(el);
    });

    form.addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset.req && el.type === 'checkbox') validate(el);
    });

    // Réinitialiser doit aussi effacer les messages d'erreur et le compteur.
    form.addEventListener('reset', () => {
      form.querySelectorAll('[data-msg]').forEach((m) => { m.textContent = ''; });
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      done.hidden = true;
      form.querySelector('button[type="submit"]').disabled = false;
      setTimeout(() => { if (count) count.textContent = String(area.value.length); }, 0);
    });
  }

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
