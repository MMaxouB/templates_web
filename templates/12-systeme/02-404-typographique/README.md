# systeme/02 — 02-404-typographique

**Rôle.** Erreur 404

**Forme.** Un « 404 » géant occupe toute la largeur, aucun visuel, un seul lien de retour.

**Archétype.** `colonne-unique`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Le chiffre est en clamp(6rem, 33vw, 26rem) : c'est lui la mise en page. Le zéro central prend l'accent, seul écart de la page.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/02-404-typographique <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
