/* ==========================================================================
   02-boutique/05-masonry — échelle et déplacement
   --------------------------------------------------------------------------
   `interaction: spatial-zoom` : on zoome et on se déplace dans un plan plus
   grand que l'écran, avec des repères. Le clavier fait tout ce que la souris
   fait — flèches pour se déplacer, + et − pour l'échelle — et le plan reste
   focalisable. Sans JavaScript, l'échelle vaut 1 et le plan se parcourt par
   ses barres de défilement natives : rien n'est inaccessible.
   ========================================================================== */

(function () {
  'use strict';

  var plan = document.querySelector('[data-plan]');
  var objets = document.querySelector('[data-objets]');
  var etat = document.querySelector('[data-etat]');
  if (!plan || !objets) return;

  var echelle = 1;
  var PAS = 0.15;

  function poser(delta) {
    echelle = Math.min(1.9, Math.max(0.55, echelle + delta * PAS));
    objets.style.setProperty('--echelle', echelle.toFixed(2));
    if (etat) etat.textContent = 'Échelle ' + Math.round(echelle * 100) + ' %';
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-zoom]'), function (b) {
    b.addEventListener('click', function () { poser(parseInt(b.getAttribute('data-zoom'), 10)); });
  });

  plan.addEventListener('keydown', function (ev) {
    var d = 80;
    if (ev.key === 'ArrowRight') { plan.scrollLeft += d; ev.preventDefault(); }
    else if (ev.key === 'ArrowLeft') { plan.scrollLeft -= d; ev.preventDefault(); }
    else if (ev.key === 'ArrowDown') { plan.scrollTop += d; ev.preventDefault(); }
    else if (ev.key === 'ArrowUp') { plan.scrollTop -= d; ev.preventDefault(); }
    else if (ev.key === '+' || ev.key === '=') { poser(1); ev.preventDefault(); }
    else if (ev.key === '-') { poser(-1); ev.preventDefault(); }
  });
}());
