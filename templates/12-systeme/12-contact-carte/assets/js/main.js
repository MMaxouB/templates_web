/* ==========================================================================
   12-systeme/12-contact-carte — main.js
   Synchronisation adresses ↔ repères, compteur, validation. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  /* ------------------------------------------------- adresses et repères */

  const places = [...document.querySelectorAll('[data-place]')];
  const pins = [...document.querySelectorAll('[data-pin]')];

  const setActive = (key) => {
    places.forEach((p) => p.toggleAttribute('data-active', p.dataset.place === key));
    pins.forEach((p) => p.toggleAttribute('data-active', p.dataset.pin === key));
  };

  places.forEach((p) => {
    p.addEventListener('pointerenter', () => setActive(p.dataset.place));
    p.addEventListener('pointerleave', () => setActive(null));
    // Le clavier doit produire le même repérage que la souris.
    p.tabIndex = 0;
    p.addEventListener('focus', () => setActive(p.dataset.place));
    p.addEventListener('blur', () => setActive(null));
  });

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
  }

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
