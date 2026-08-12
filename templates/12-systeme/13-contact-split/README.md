# systeme/13 — 13-contact-split

**Rôle.** Contact

**Forme.** Panneau d'informations figé d'un côté, formulaire long et détaillé de l'autre.

**Archétype.** `split-screen`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Formulaire groupé en sections avec pastilles de sujet. Le panneau reste sticky sur grand écran, devient un bandeau en dessous de 64rem.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/13-contact-split <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
