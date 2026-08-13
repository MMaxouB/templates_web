/* ==========================================================================
   benchmark/11-tactile
   Interaction : drag-manipulate
   --------------------------------------------------------------------------
   Cinq curseurs réels. `input[type=range]` a été choisi précisément parce
   qu'il apporte le clavier nativement : flèches, Origine, Fin, Page haut et
   Page bas fonctionnent sans une ligne de code. Un glisser-déposer maison
   aurait exigé de réimplémenter tout cela — et l'aurait probablement mal fait.

   Le script ne fait donc qu'une chose : tenir les valeurs affichées et le
   total à jour. Sans lui, les curseurs restent manipulables et les valeurs
   initiales restent justes.
   ========================================================================== */

(function () {
  'use strict';

  var curseurs = Array.prototype.slice.call(document.querySelectorAll('.cmd input[type=range]'));
  var total = document.getElementById('total');
  if (!curseurs.length || !total) return;

  function majTotal() {
    var somme = curseurs.reduce(function (s, c) { return s + Number(c.value); }, 0);
    total.textContent = String(somme);
  }

  curseurs.forEach(function (c) {
    var sortie = document.querySelector('output[for="' + c.id + '"]');
    c.addEventListener('input', function () {
      if (sortie) sortie.textContent = c.value;
      majTotal();
    });
  });

  majTotal();
})();
