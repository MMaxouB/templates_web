/* ==========================================================================
   benchmark/03-interface-donnees
   Interaction : filter-sort — l'utilisateur réduit et réordonne un ensemble.
   --------------------------------------------------------------------------
   Le filtre et le tri modifient réellement le DOM visible et mettent à jour un
   compteur. Une interface de données qui simulerait ces gestes ne serait pas
   une interface de données.

   Tout reste utilisable sans JavaScript : le tableau est déjà complet et trié
   dans le HTML, et les onglets affichent la première vue par défaut.
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------- onglets */

  var onglets = document.querySelectorAll('.onglet');
  var vues = { serie: document.getElementById('vue-serie'), notes: document.getElementById('vue-notes') };

  onglets.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cible = btn.dataset.vue;
      onglets.forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); });
      Object.keys(vues).forEach(function (k) {
        if (vues[k]) vues[k].hidden = k !== cible;
      });
    });
  });

  /* -------------------------------------------------------------- filtre */

  var saisie = document.getElementById('filtre');
  var corps = document.getElementById('corps');
  var compteur = document.getElementById('compteur');
  if (!saisie || !corps || !compteur) return;

  var lignes = Array.prototype.slice.call(corps.rows);

  function filtrer() {
    var q = saisie.value.trim().toLowerCase();
    var visibles = 0;
    lignes.forEach(function (tr) {
      var ok = !q || tr.cells[0].textContent.toLowerCase().indexOf(q) !== -1;
      tr.classList.toggle('ligne-masquee', !ok);
      if (ok) visibles += 1;
    });
    compteur.textContent = visibles + ' / ' + lignes.length;
  }

  saisie.addEventListener('input', filtrer);

  /* ---------------------------------------------------------------- tri */

  var boutons = document.querySelectorAll('.tri');

  boutons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var col = Number(btn.dataset.col);
      var num = btn.dataset.type === 'num';
      var sens = btn.dataset.sens === 'asc' ? 'desc' : 'asc';

      boutons.forEach(function (b) { if (b !== btn) delete b.dataset.sens; });
      btn.dataset.sens = sens;

      var signe = sens === 'asc' ? 1 : -1;
      lignes.sort(function (a, b) {
        var ca = a.cells[col], cb = b.cells[col];
        if (num) {
          return signe * (Number(ca.dataset.n || 0) - Number(cb.dataset.n || 0));
        }
        return signe * ca.textContent.localeCompare(cb.textContent, 'fr');
      });

      lignes.forEach(function (tr) { corps.appendChild(tr); });
    });
  });
})();
