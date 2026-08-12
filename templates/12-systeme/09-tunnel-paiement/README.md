# systeme/09 — 09-tunnel-paiement

**Rôle.** Commande

**Forme.** Panier, livraison, paiement, récapitulatif — avec un résumé de commande visible en permanence.

**Archétype.** `multi-etapes`

**Pages livrées.** `index.html` — page autonome.
Les liens vers des pages non livrées pointent vers `#` et portent `data-stub`.

**Ce qui la distingue.** Les totaux se recalculent en direct. Sur écran étroit le résumé passe au-dessus du formulaire. Aucun champ n'est transmis : c'est une maquette.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête,
ou générer avec `node _tools/build.js 12-systeme/09-tunnel-paiement <theme>`.

**Changer le contenu.** Tout le texte est dans `index.html`. Le contenu est en lorem ipsum
et en libellés neutres : aucun mot orienté secteur, à remplacer lors de l'adaptation client.

**Thèmes validés.** `modern-light`, `dark-neon`, `neo-brutalism`
