/* ==========================================================================
   12-systeme/15-remerciement — main.js
   Copie dans le presse-papiers et confirmation. Aucune dépendance.
   ========================================================================== */

(() => {
  'use strict';

  const toast = document.querySelector('[data-toast]');
  let timer;

  const say = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(timer);
    timer = setTimeout(() => { toast.hidden = true; }, 2600);
  };

  /* --------------------------------------------------------------- copie */

  // navigator.clipboard n'existe pas hors contexte sécurisé (http:// distant) :
  // on retombe alors sur une sélection dans un champ hors écran.
  const copy = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const tmp = document.createElement('textarea');
      tmp.value = text;
      tmp.setAttribute('readonly', '');
      tmp.style.cssText = 'position:fixed;left:-9999px;top:0;';
      document.body.append(tmp);
      tmp.select();
      const ok = document.execCommand('copy');
      tmp.remove();
      return ok;
    } catch {
      return false;
    }
  };

  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const ok = await copy(btn.dataset.copy);
      say(ok ? 'Copié dans le presse-papiers.' : 'La copie a échoué — sélectionnez le texte à la main.');
    });
  });

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub], button[data-stub]').forEach((el) => {
    el.addEventListener('click', (e) => e.preventDefault());
  });
})();
