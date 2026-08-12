# systeme/08 — 08-inscription-etapes

**Rôle.** Création de compte

**Forme.** Trois étapes, indicateur de progression, force du mot de passe, récapitulatif, conditions.

**Archétype.** `multi-etapes`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Validation par étape : impossible d'avancer sans corriger. Le titre de l'étape prend le focus pour que les lecteurs d'écran suivent.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/08-inscription-etapes <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
