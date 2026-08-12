# systeme/12 — 12-contact-carte

**Rôle.** Contact

**Forme.** Formulaire d'un côté, carte et coordonnées de l'autre, survol synchronisé entre adresses et repères.

**Archétype.** `carte-interactive`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** La carte est un SVG stylisé : aucune ressource distante, aucun traceur. La synchronisation marche aussi au clavier.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/12-contact-carte <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
