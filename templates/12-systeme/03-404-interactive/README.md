# systeme/03 — 03-404-interactive

**Rôle.** Erreur 404

**Forme.** Un mini-jeu en canvas occupe la page pendant que le visiteur décide où aller. Score, chrono, record local.

**Archétype.** `canvas-libre`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Le canvas lit ses couleurs dans les tokens : le jeu suit le thème. Rien ne bouge avant un clic, et prefers-reduced-motion retire les effets décoratifs.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/03-404-interactive <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
