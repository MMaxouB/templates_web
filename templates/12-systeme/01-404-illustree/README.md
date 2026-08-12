# systeme/01 — 01-404-illustree

**Rôle.** Erreur 404

**Forme.** Illustration SVG centrale, message court, champ de recherche et liens de secours. Tout tient dans un écran, centré.

**Archétype.** `plein-ecran`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** L'illustration est un SVG inline dont chaque partie est colorée par un token : elle change avec le thème.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/01-404-illustree <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
