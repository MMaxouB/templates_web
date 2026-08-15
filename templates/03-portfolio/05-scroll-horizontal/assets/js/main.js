/* ==========================================================================
   03-portfolio/05-scroll-horizontal — on tire la planche suivante
   --------------------------------------------------------------------------
   `interaction: drag-manipulate` : on saisit le carton et on le fait glisser.
   L'équivalent clavier est obligatoire — flèches gauche/droite sur le carton
   focalisable, et les numéros de l'index restent des ancres ordinaires.
   Sans JavaScript, le carton défile par ses barres natives et rien n'est
   perdu : le glisser est un confort, pas le seul accès.
   ========================================================================== */

(function () {
  'use strict';

  var carton = document.querySelector('[data-carton]');
  if (!carton) return;

  var planches = Array.prototype.slice.call(carton.children);
  var reperes = Array.prototype.slice.call(document.querySelectorAll('[data-aller]'));
  var etat = document.querySelector('[data-etat]');
  var i = 0;

  function poser(n) {
    i = Math.max(0, Math.min(planches.length - 1, n));
    planches[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    reperes.forEach(function (a, k) {
      if (k === i) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
    if (etat) {
      etat.textContent = 'Planche ' + String(i + 1).padStart(2, '0')
        + ' sur ' + String(planches.length).padStart(2, '0') + '.';
    }
  }

  reperes.forEach(function (a, k) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); poser(k); });
  });

  carton.addEventListener('keydown', function (ev) {
    if (ev.key === 'ArrowRight') { poser(i + 1); ev.preventDefault(); }
    if (ev.key === 'ArrowLeft') { poser(i - 1); ev.preventDefault(); }
  });

  /* --- glisser ----------------------------------------------------------- */

  var tire = false, departX = 0, departScroll = 0;

  carton.addEventListener('pointerdown', function (ev) {
    tire = true;
    departX = ev.clientX;
    departScroll = carton.scrollLeft;
    carton.setPointerCapture(ev.pointerId);
  });

  carton.addEventListener('pointermove', function (ev) {
    if (!tire) return;
    carton.scrollLeft = departScroll - (ev.clientX - departX);
  });

  ['pointerup', 'pointercancel'].forEach(function (t) {
    carton.addEventListener(t, function () { tire = false; });
  });
}());
