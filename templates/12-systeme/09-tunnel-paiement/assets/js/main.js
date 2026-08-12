/* ==========================================================================
   12-systeme/09-tunnel-paiement — main.js
   Étapes, totaux en direct, formatage des champs de carte. Aucune dépendance.

   Rappel : c'est une maquette. Aucun champ n'est transmis, aucun paiement
   n'est possible, et il ne faut évidemment jamais traiter de vraies données
   bancaires côté client.
   ========================================================================== */

(() => {
  'use strict';

  const form = document.querySelector('[data-form]');
  if (!form) return;

  const panels = [...form.querySelectorAll('[data-panel]')];
  const navItems = [...document.querySelectorAll('[data-step-nav]')];
  const prev = document.querySelector('[data-prev]');
  const next = document.querySelector('[data-next]');
  const recap = document.querySelector('[data-recap]');
  const done = document.querySelector('[data-done]');

  const subOut = document.querySelector('[data-sub]');
  const shipOut = document.querySelector('[data-ship-total]');
  const totalOut = document.querySelector('[data-total]');

  const TOTAL = panels.length;
  let current = 1;

  const euro = (n) =>
    n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  /* ---------------------------------------------------------------- totaux */

  const shipCost = () =>
    Number(form.querySelector('[data-ship]:checked')?.value || 0);

  const compute = () => {
    let sub = 0;

    form.querySelectorAll('[data-line]').forEach((line) => {
      const unit = Number(line.dataset.price);
      const qty = Number(line.querySelector('[data-qty]').value);
      const total = unit * qty;
      sub += total;
      line.querySelector('[data-line-total]').textContent = euro(total);
    });

    const ship = shipCost();
    subOut.textContent = euro(sub);
    shipOut.textContent = ship === 0 ? 'Offerte' : euro(ship);
    totalOut.textContent = euro(sub + ship);
    return { sub, ship, total: sub + ship };
  };

  form.addEventListener('change', (e) => {
    if (e.target.matches('[data-qty], [data-ship]')) compute();
  });

  /* ------------------------------------------------------------ validation */

  const RULES = {
    text: (v) => (v.trim().length >= 2 ? '' : 'Deux caractères minimum.'),
    cp: (v) => (/^\d{4,6}$/.test(v.trim()) ? '' : 'Code postal attendu.'),
    card: (v) => (v.replace(/\s/g, '').length >= 13 ? '' : 'Numéro incomplet.'),
    exp: (v) => (/^\d{2}\/\d{2}$/.test(v.trim()) ? '' : 'Format attendu : MM/AA.'),
    cvc: (v) => (/^\d{3,4}$/.test(v.trim()) ? '' : 'Trois ou quatre chiffres.'),
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
    let ok = true;
    let first = null;
    panels[n - 1].querySelectorAll('[data-req]').forEach((el) => {
      if (!validateField(el)) { ok = false; first = first || el; }
    });
    first?.focus();
    return ok;
  };

  /* --------------------------------------------------------- mise en forme */

  const card = form.querySelector('[data-card]');
  if (card) {
    card.addEventListener('input', () => {
      const digits = card.value.replace(/\D/g, '').slice(0, 16);
      card.value = digits.replace(/(.{4})/g, '$1 ').trim();
    });
  }

  const exp = form.querySelector('[data-exp]');
  if (exp) {
    exp.addEventListener('input', () => {
      const d = exp.value.replace(/\D/g, '').slice(0, 4);
      exp.value = d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    });
  }

  /* ---------------------------------------------------------- récapitulatif */

  const buildRecap = () => {
    const data = new FormData(form);
    const { total } = compute();
    const card4 = String(data.get('carte') || '').replace(/\D/g, '').slice(-4);

    const rows = [
      ['Livré à', `${data.get('prenom') || ''} ${data.get('nom') || ''}`.trim() || '—'],
      ['Adresse', [data.get('adresse'), data.get('cp'), data.get('ville')]
        .filter(Boolean).join(', ') || '—'],
      ['Livraison', shipCost() === 0 ? 'Standard — offerte' : 'Express — 6,90 €'],
      ['Carte', card4 ? `•••• •••• •••• ${card4}` : '—'],
      ['Total', euro(total)],
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

    prev.hidden = n === 1;
    next.textContent = n === TOTAL ? 'Valider la commande' : 'Continuer';

    if (n === TOTAL) buildRecap();

    const title = panels[n - 1].querySelector('.panel__title');
    title?.setAttribute('tabindex', '-1');
    title?.focus?.();
  };

  /* ------------------------------------------------------------ écouteurs */

  next.addEventListener('click', () => {
    if (!validatePanel(current)) return;
    if (current < TOTAL) {
      show(current + 1);
    } else {
      done.hidden = false;
      next.disabled = true;
    }
  });

  prev.addEventListener('click', () => { if (current > 1) show(current - 1); });

  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.req && el.getAttribute('aria-invalid') === 'true') validateField(el);
  });

  form.addEventListener('submit', (e) => { e.preventDefault(); next.click(); });

  compute();
  show(1);

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
