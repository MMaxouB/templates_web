/* ==========================================================================
   benchmark/07-terminal
   Navigation : command-line · Interaction : command-input
   --------------------------------------------------------------------------
   On navigue en tapant. `help` donne la liste, les commandes font défiler
   jusqu'à la section, `clear` remet le journal à zéro, les flèches haut et bas
   parcourent l'historique.

   Repli sans JavaScript : la page entière est déjà lisible, toutes les
   sections sont dans le document, et un <noscript> fournit des liens.
   ========================================================================== */

(function () {
  'use strict';

  var form = document.getElementById('cli');
  var champ = document.getElementById('cmd');
  var journal = document.getElementById('journal');
  if (!form || !champ || !journal) return;

  var CIBLES = {
    '01': 's1', 'sed': 's1',
    '02': 's2', 'ut': 's2',
    '03': 's3', 'duis': 's3',
    '04': 's4', 'excepteur': 's4',
    'serie': 'serie'
  };

  var AIDE = [
    'COMMANDES DISPONIBLES',
    '  ls              liste les sections',
    '  cat <n>         affiche une section (01 a 04)',
    '  stat            affiche la serie chiffree',
    '  top             retour en haut',
    '  clear           efface ce journal',
    '  help            cette liste'
  ].join('\n');

  var historique = [];
  var curseurHist = -1;

  function ecrire(txt) {
    journal.textContent = txt;
  }

  function aller(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  function executer(brut) {
    var ligne = brut.trim().toLowerCase();
    if (!ligne) return;

    historique.push(ligne);
    curseurHist = historique.length;

    var mots = ligne.split(/\s+/);
    var cmd = mots[0];
    var arg = mots[1] || '';

    if (cmd === 'help' || cmd === '?') { ecrire(AIDE); return; }
    if (cmd === 'clear') { ecrire(''); return; }
    if (cmd === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); ecrire('$ top'); return; }

    if (cmd === 'ls') {
      ecrire('01_sed_do_eiusmod.txt\n02_ut_enim_ad_minim.txt\n03_duis_aute_irure.txt\n04_excepteur_sint.txt');
      return;
    }

    if (cmd === 'stat') {
      if (aller('serie')) ecrire('$ stat --serie');
      return;
    }

    if (cmd === 'cat') {
      var cible = CIBLES[arg];
      if (cible && aller(cible)) { ecrire('$ cat ' + arg); return; }
      ecrire('cat: ' + (arg || '(rien)') + ': fichier introuvable\nTapez « ls » pour la liste.');
      return;
    }

    // Raccourci : taper directement un numéro de section.
    if (CIBLES[cmd] && aller(CIBLES[cmd])) { ecrire('$ ' + cmd); return; }

    ecrire(cmd + ': commande inconnue\nTapez « help » pour la liste.');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    executer(champ.value);
    champ.value = '';
  });

  // Historique aux flèches, comme dans un vrai terminal.
  champ.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    if (!historique.length) return;
    e.preventDefault();

    if (e.key === 'ArrowUp') curseurHist = Math.max(0, curseurHist - 1);
    else curseurHist = Math.min(historique.length, curseurHist + 1);

    champ.value = historique[curseurHist] || '';
  });
})();
