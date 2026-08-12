# systeme/04 — 04-maintenance

**Rôle.** Indisponibilité planifiée

**Forme.** Compte à rebours dominant, raison de l'interruption, inscription pour être prévenu du retour.

**Archétype.** `plein-ecran`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Le rebours est le plus gros élément de la page. Fond en bandes d'avertissement, entièrement en CSS.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/04-maintenance <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
