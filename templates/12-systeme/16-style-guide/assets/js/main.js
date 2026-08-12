/* ==========================================================================
   12-systeme/16-style-guide — main.js
   Trois choses : changer de thème, calculer les contrastes réels, basculer
   le repérage des liens morts. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const themeLink = document.querySelector('[data-theme-link]');
  const themeSelect = document.querySelector('[data-theme-select]');
  const labels = document.querySelectorAll('[data-theme-label]');
  const authoringToggle = document.querySelector('[data-authoring]');
  const shadowStyleOut = document.querySelector('[data-shadow-style]');

  /* ------------------------------------------------------------- contraste */

  // Composante linéarisée, formule WCAG 2.
  const channel = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const luminance = ([r, g, b]) =>
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

  // getComputedStyle renvoie toujours rgb() ou rgba() — on n'a pas à gérer le hex.
  const parse = (value) => {
    const nums = value.match(/[\d.]+/g);
    return nums ? nums.slice(0, 3).map(Number) : null;
  };

  const ratio = (fg, bg) => {
    const a = luminance(fg);
    const b = luminance(bg);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  const level = (r) => (r >= 7 ? 'aaa' : r >= 4.5 ? 'aa' : 'fail');

  const updateContrast = () => {
    document.querySelectorAll('[data-ratio]').forEach((out) => {
      const box = out.closest('.swatch');
      if (!box) return;

      const styles = getComputedStyle(box);
      const fg = parse(styles.color);
      let bgValue = styles.backgroundColor;

      // Un fond transparent hérite de l'ancêtre : on remonte jusqu'à en trouver un.
      let node = box;
      while (bgValue === 'rgba(0, 0, 0, 0)' && node.parentElement) {
        node = node.parentElement;
        bgValue = getComputedStyle(node).backgroundColor;
      }
      const bg = parse(bgValue);
      if (!fg || !bg) return;

      const r = ratio(fg, bg);
      const lvl = level(r);
      out.textContent = `${r.toFixed(2)}:1 · ${lvl === 'fail' ? 'insuffisant' : lvl.toUpperCase()}`;
      out.dataset.level = lvl;
    });

    if (shadowStyleOut) {
      shadowStyleOut.textContent =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--shadow-style')
          .trim() || '—';
    }
  };

  /* ---------------------------------------------------------------- thème */

  // Le chemin des thèmes est déduit de l'en-tête plutôt qu'écrit en dur.
  // Dans un dossier généré par build.js, le thème est figé dans
  // assets/css/theme.css : le sélecteur n'a plus lieu d'être.
  const themeBase = themeLink
    ? (themeLink.getAttribute('href').match(/^(.*_core\/themes\/)/) || [])[1]
    : null;

  const applyTheme = (slug) => {
    if (!themeLink || !themeBase) return;
    themeLink.href = `${themeBase}${slug}.css`;
    labels.forEach((el) => { el.textContent = slug; });
    try {
      localStorage.setItem('styleguide-theme', slug);
    } catch { /* mode privé : on ignore */ }

    // Le fichier est chargé de façon asynchrone : on attend qu'il s'applique.
    // setTimeout et non requestAnimationFrame : rAF ne se déclenche pas dans un
    // onglet en arrière-plan, et le sondage resterait bloqué indéfiniment.
    const waitAndMeasure = (tries = 0) => {
      const current = getComputedStyle(document.documentElement)
        .getPropertyValue('--theme-slug').trim().replace(/['"]/g, '');
      if (current === slug || tries > 60) {
        updateContrast();
      } else {
        setTimeout(() => waitAndMeasure(tries + 1), 16);
      }
    };
    waitAndMeasure();
  };

  if (themeSelect && themeBase) {
    let saved = null;
    try {
      saved = localStorage.getItem('styleguide-theme');
    } catch { /* mode privé */ }

    if (saved && [...themeSelect.options].some((o) => o.value === saved)) {
      themeSelect.value = saved;
    }
    applyTheme(themeSelect.value);
    themeSelect.addEventListener('change', () => applyTheme(themeSelect.value));
  } else {
    // Thème figé : on retire le sélecteur et on lit le nom réellement appliqué.
    themeSelect?.closest('.field')?.remove();
    const slug = getComputedStyle(document.documentElement)
      .getPropertyValue('--theme-slug').trim().replace(/['"]/g, '');
    if (slug) labels.forEach((el) => { el.textContent = slug; });
    updateContrast();
  }

  /* -------------------------------------------------------- liens morts */

  if (authoringToggle) {
    // La case suit l'état du document, jamais l'inverse au chargement.
    // build.js retire `is-authoring` du <html> : dans un dossier livrable, le
    // repérage doit donc démarrer désactivé, sinon les pointillés passeraient
    // pour un défaut d'affichage.
    authoringToggle.checked = document.documentElement.classList.contains('is-authoring');
    authoringToggle.addEventListener('change', () => {
      document.documentElement.classList.toggle('is-authoring', authoringToggle.checked);
    });
  }

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });

  window.addEventListener('resize', updateContrast, { passive: true });
})();
