/* ==========================================================================
   12-systeme/08-inscription-etapes — main.js
   Navigation entre étapes, validation par étape, force du mot de passe.
   Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const form = document.querySelector('[data-form]');
  if (!form) return;

  const panels = [...form.querySelectorAll('[data-panel]')];
  const navItems = [...document.querySelectorAll('[data-step-nav]')];
  const fill = document.querySelector('[data-fill]');
  const count = document.querySelector('[data-count]');
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const recap = document.querySelector('[data-recap]');
  const done = document.querySelector('[data-done]');

  const TOTAL = panels.length;
  let current = 1;

  /* ------------------------------------------------------------ validation */

  const RULES = {
    mail: (v) => (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim())
      ? '' : 'Le format attendu est une adresse électronique.'),
    pass: (v) => (v.length >= 8 ? '' : 'Huit caractères minimum.'),
    text: (v) => (v.trim().length >= 2 ? '' : 'Deux caractères minimum.'),
    check: (v, el) => (el.checked ? '' : 'Cette case doit être cochée.'),
  };

  const validateField = (el) => {
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

  const validatePanel = (n) => {
    const fields = panels[n - 1].querySelectorAll('[data-req]');
    let ok = true;
    let first = null;
    fields.forEach((el) => {
      if (!validateField(el)) { ok = false; first = first || el; }
    });
    first?.focus();
    return ok;
  };

  /* ------------------------------------------------------ force mot de passe */

  const pass = form.querySelector('[data-pass]');
  const strength = document.querySelector('[data-strength]');
  const strengthLabel = document.querySelector('[data-strength-label]');
  const WORDS = ['', 'Très faible', 'Faible', 'Correct', 'Solide'];

  if (pass && strength) {
    pass.addEventListener('input', () => {
      const v = pass.value;
      strength.hidden = v.length === 0;
      if (!v) return;

      // Longueur, casse, chiffres, caractères spéciaux.
      let score = 0;
      if (v.length >= 8) score += 1;
      if (v.length >= 12) score += 1;
      if (/[a-z]/.test(v) && /[A-Z]/.test(v)) score += 1;
      if (/\d/.test(v) && /[^\w\s]/.test(v)) score += 1;
      score = Math.max(1, Math.min(4, score));

      strength.dataset.level = String(score);
      strengthLabel.textContent = `Robustesse : ${WORDS[score].toLowerCase()}.`;
    });
  }

  /* ---------------------------------------------------------- récapitulatif */

  const buildRecap = () => {
    if (!recap) return;
    const data = new FormData(form);
    const typeLabel = { a: 'Consectetur', b: 'Incididunt' };
    const rows = [
      ['Adresse', data.get('mail') || '—'],
      ['Nom', `${data.get('prenom') || ''} ${data.get('nom') || ''}`.trim() || '—'],
      ['Intitulé', data.get('role') || '—'],
      ['Lorem ipsum', typeLabel[data.get('type')] || '—'],
    ];
    recap.innerHTML = '';
    rows.forEach(([k, v]) => {
      const wrap = document.createElement('div');
      const dt = document.createElement('dt');
      const dd = document.createElement('dd');
      dt.textContent = k;
      dd.textContent = v; // textContent : jamais d'injection depuis un champ
      wrap.append(dt, dd);
      recap.append(wrap);
    });
  };

  /* ------------------------------------------------------------- affichage */

  const show = (n) => {
    current = n;

    panels.forEach((p, i) => { p.hidden = i !== n - 1; });

    navItems.forEach((item, i) => {
      const step = i + 1;
      item.toggleAttribute('data-done', step < n);
      if (step === n) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });

    fill.style.inlineSize = `${(n / TOTAL) * 100}%`;
    count.textContent = `Étape ${n} sur ${TOTAL}`;
    prev.hidden = n === 1;
    next.textContent = n === TOTAL ? 'Créer le compte' : 'Continuer';

    if (n === TOTAL) buildRecap();

    // Le titre de l'étape prend le focus : le lecteur d'écran suit le parcours.
    panels[n - 1].querySelector('.panel__title')
      ?.setAttribute('tabindex', '-1');
    panels[n - 1].querySelector('.panel__title')?.focus?.();
  };

  /* ------------------------------------------------------------ écouteurs */

  next.addEventListener('click', () => {
    if (!validatePanel(current)) return;

    if (current < TOTAL) {
      show(current + 1);
    } else {
      done.hidden = false;
      next.disabled = true;
      done.scrollIntoView({ block: 'nearest' });
    }
  });

  prev.addEventListener('click', () => {
    if (current > 1) show(current - 1);
  });

  // Revalidation à la volée, une fois que le champ a déjà été signalé.
  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.req && el.getAttribute('aria-invalid') === 'true') validateField(el);
  });

  form.addEventListener('change', (e) => {
    const el = e.target;
    if (el.dataset.req && el.type === 'checkbox') validateField(el);
  });

  // Entrée ne doit pas envoyer le formulaire : elle passe à l'étape suivante.
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    next.click();
  });

  show(1);

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
