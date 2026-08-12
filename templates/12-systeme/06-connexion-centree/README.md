# systeme/06 — 06-connexion-centree

**Rôle.** Authentification

**Forme.** Carte centrée sur fond neutre : connexion externe d'abord, puis formulaire, mot de passe oublié.

**Archétype.** `colonne-unique`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** La connexion externe est placée avant le formulaire parce que c'est le chemin le plus court. Bascule d'affichage du mot de passe incluse.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/06-connexion-centree <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
