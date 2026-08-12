# systeme/07 — 07-connexion-split

**Rôle.** Authentification

**Forme.** Écran coupé : visuel et citation figés d'un côté, formulaire de l'autre.

**Archétype.** `split-screen`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** La moitié gauche est sticky et ne défile jamais. Sous 60rem elle devient un bandeau, sans jamais voler la place au formulaire.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/07-connexion-split <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
