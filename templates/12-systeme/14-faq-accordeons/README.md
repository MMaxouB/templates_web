# systeme/14 — 14-faq-accordeons

**Rôle.** Questions fréquentes

**Forme.** Recherche, filtres par catégorie, questions repliées, contact en dernier recours.

**Archétype.** `accordeons`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Le repli est natif (<details>) : sans JavaScript la page reste entièrement utilisable. Le JS n'ajoute que la recherche et les filtres.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/14-faq-accordeons <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
