/* ==========================================================================
   12-systeme/14-faq-accordeons — main.js
   Recherche, filtres par catégorie, tout déplier. Aucune dépendance.

   Le repli/dépli est natif (<details>) : sans JavaScript, la page reste
   entièrement utilisable. Ce fichier n'ajoute que le tri.
   ========================================================================== */

(() => {
  'use strict';

  const search = document.querySelector('[data-search]');
  const clear = document.querySelector('[data-clear]');
  const pills = [...document.querySelectorAll('[data-filter]')];
  const cats = [...document.querySelectorAll('[data-cat]')];
  const items = [...document.querySelectorAll('.qa')];
  const empty = document.querySelector('[data-empty]');
  const count = document.querySelector('[data-count]');
  const expand = document.querySelector('[data-expand]');

  let filter = 'all';

  /* ------------------------------------------------------- surlignage */

  // On garde l'intitulé d'origine pour pouvoir le restaurer.
  items.forEach((qa) => {
    const s = qa.querySelector('summary');
    s.dataset.original = s.textContent;
  });

  const highlight = (summary, term) => {
    const original = summary.dataset.original;

    if (!term) {
      summary.textContent = original;
      return;
    }

    // Découpage par index plutôt que par innerHTML : aucune injection possible.
    const lower = original.toLowerCase();
    const at = lower.indexOf(term);
    if (at === -1) { summary.textContent = original; return; }

    summary.textContent = '';
    summary.append(document.createTextNode(original.slice(0, at)));
    const mark = document.createElement('mark');
    mark.textContent = original.slice(at, at + term.length);
    summary.append(mark, document.createTextNode(original.slice(at + term.length)));
  };

  /* ----------------------------------------------------------- filtrage */

  const apply = () => {
    const term = (search?.value || '').trim().toLowerCase();
    let shown = 0;

    items.forEach((qa) => {
      const cat = qa.closest('[data-cat]').dataset.cat;
      const text = (qa.querySelector('summary').dataset.original + ' '
        + qa.querySelector('.qa__body').textContent).toLowerCase();

      const matchCat = filter === 'all' || filter === cat;
      const matchTerm = !term || text.includes(term);
      const visible = matchCat && matchTerm;

      qa.hidden = !visible;
      if (visible) shown += 1;

      highlight(qa.querySelector('summary'), term);

      // Une recherche fructueuse ouvre les réponses : c'est ce qu'on cherche.
      if (term && visible) qa.open = true;
      if (!term) qa.open = false;
    });

    // Une catégorie sans question visible n'a pas à afficher son titre.
    cats.forEach((cat) => {
      cat.hidden = ![...cat.querySelectorAll('.qa')].some((qa) => !qa.hidden);
    });

    if (empty) empty.hidden = shown > 0;
    if (count) {
      count.textContent = shown === items.length
        ? `${items.length} questions`
        : `${shown} question${shown > 1 ? 's' : ''} sur ${items.length}`;
    }
    if (clear) clear.hidden = !term;
    syncExpandLabel();
  };

  /* ------------------------------------------------------- tout déplier */

  const syncExpandLabel = () => {
    if (!expand) return;
    const visible = items.filter((qa) => !qa.hidden);
    const allOpen = visible.length > 0 && visible.every((qa) => qa.open);
    expand.textContent = allOpen ? 'Tout replier' : 'Tout déplier';
  };

  expand?.addEventListener('click', () => {
    const visible = items.filter((qa) => !qa.hidden);
    const allOpen = visible.every((qa) => qa.open);
    visible.forEach((qa) => { qa.open = !allOpen; });
    syncExpandLabel();
  });

  items.forEach((qa) => qa.addEventListener('toggle', syncExpandLabel));

  /* ---------------------------------------------------------- écouteurs */

  search?.addEventListener('input', apply);

  clear?.addEventListener('click', () => {
    search.value = '';
    apply();
    search.focus();
  });

  // Échap efface la recherche, comme dans un champ de recherche natif.
  search?.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && search.value) {
      e.preventDefault();
      search.value = '';
      apply();
    }
  });

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filter = pill.dataset.filter;
      pills.forEach((p) => p.setAttribute('aria-pressed', String(p === pill)));
      apply();
    });
  });

  apply();

  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
