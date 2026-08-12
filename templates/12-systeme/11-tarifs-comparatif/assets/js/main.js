/* ==========================================================================
   12-systeme/11-tarifs-comparatif — main.js
   Infobulles au survol et au clavier. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const bubble = document.querySelector('[data-bubble]');
  const tips = [...document.querySelectorAll('[data-tip]')];

  if (bubble && tips.length) {
    let currentId = 0;

    const place = (el) => {
      bubble.textContent = el.dataset.tip;
      bubble.hidden = false;

      // Positionnement après affichage, sinon les dimensions valent zéro.
      const t = el.getBoundingClientRect();
      const b = bubble.getBoundingClientRect();
      const margin = 8;

      let left = window.scrollX + t.left + t.width / 2 - b.width / 2;
      left = Math.max(margin, Math.min(left, window.scrollX + document.documentElement.clientWidth - b.width - margin));

      // Au-dessus si la place manque en dessous.
      const below = t.bottom + b.height + margin < window.innerHeight;
      const top = window.scrollY + (below ? t.bottom + margin : t.top - b.height - margin);

      bubble.style.insetInlineStart = `${left}px`;
      bubble.style.insetBlockStart = `${top}px`;

      // Lien programmatique pour les lecteurs d'écran.
      currentId += 1;
      bubble.id = `bulle-${currentId}`;
      el.setAttribute('aria-describedby', bubble.id);
    };

    const hide = (el) => {
      bubble.hidden = true;
      el?.removeAttribute('aria-describedby');
    };

    tips.forEach((el) => {
      el.addEventListener('pointerenter', () => place(el));
      el.addEventListener('focus', () => place(el));
      el.addEventListener('pointerleave', () => hide(el));
      el.addEventListener('blur', () => hide(el));
      el.addEventListener('click', (e) => e.preventDefault());
    });

    // Échap referme, comme pour toute surcouche.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !bubble.hidden) hide(document.activeElement);
    });

    // Une infobulle placée en absolu ne suit pas le défilement : on la referme.
    window.addEventListener('scroll', () => { if (!bubble.hidden) hide(); }, { passive: true });
  }

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
