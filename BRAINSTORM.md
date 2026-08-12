# Document de travail

Historique de la réflexion et annexes. Le catalogue officiel du dépôt est dans
[`README.md`](README.md) — c'est lui qui fait foi.

---

## 1. Le virage

**Première approche (abandonnée).** Un catalogue de 445 **types de sites par métier** :
plombier, dentiste, pizzeria, salon de tatouage, apiculteur… Chaque type avec ses sections
propres et son contenu spécifique.

**Pourquoi c'était le mauvais produit.** Un dépôt organisé par métier se présente mal à un
client. Il arrive, cherche son activité, trouve **une seule entrée** — et se retrouve devant
un choix unique à prendre ou à laisser. Le catalogue travaille contre lui : il réduit les
possibilités au lieu de les ouvrir.

**Approche retenue.** Le catalogue est organisé par **architecture**. On montre au client
des **formes** — type de navigation, organisation de la page, comportement au défilement —
et il choisit celle qui lui plaît, quelle que soit son activité. L'adaptation au métier
se fait après, à la livraison, sur la variante retenue.

Conséquences directes :

- Le contenu de démo passe en **lorem ipsum** et en libellés neutres. Aucun mot de secteur.
- Les visuels deviennent des **blocs SVG neutres**. Aucune photo qui oriente vers un métier.
- L'axe de variation devient la **structure HTML**, plus la finalité commerciale.
- Deux entrées dans le catalogue : par **finalité** (vitrine, boutique, portfolio…)
  et par **archétype de mise en page** (sidebar, split-screen, plein écran…).

**Ce qui a survécu au virage.** Le catalogue des 333 thèmes : il portait déjà l'axe
graphique, indépendant du métier. Il est repris tel quel dans le README.

**Ce qui a été supprimé.** Le catalogue des 445 métiers. Il ne décrivait plus rien du dépôt,
et le garder entretenait la confusion avec les douze familles de finalité. Les sections
attendues par secteur se retrouvent au moment de l'adaptation, au cas par cas, avec le client
en face — c'est plus juste qu'une liste écrite à l'avance.

---

## 2. Décisions actées

| # | Question | Décision |
|---|---|---|
| 1 | **Axe du catalogue** | ✅ **Architecture**, pas métier. 145 variantes structurelles en 12 familles de finalité. |
| 2 | **Entrées de navigation** | ✅ **Deux axes croisés** : par famille de finalité, et par archétype de mise en page. |
| 3 | **Granularité** | ✅ **Variantes de page complète** d'abord. Extraction des blocs réutilisables au lot 5, une fois cinquante variantes produites et les motifs récurrents identifiés. |
| 4 | **Périmètre d'une variante** | ✅ Page principale **+ deux ou trois pages structurellement intéressantes**. Les pages annexes (à propos, mentions légales) apparaissent dans la navigation mais ne sont pas développées. |
| 5 | **Liens morts** | ✅ `href="#"` + attribut `data-stub`. Option d'une page `stub.html` partagée à trancher avant la première démo client. |
| 6 | **Nommage** | ✅ **Numéro + descriptif** : `03-sidebar-fixe`. Le numéro sert à citer une variante au client, le descriptif à s'y retrouver dans l'explorateur. |
| 7 | **Stack** | ✅ **HTML/CSS/JS pur**, zéro build, zéro dépendance. Réévaluer Astro seulement si la duplication devient douloureuse. |
| 8 | **Stockage des combos** | ✅ **CSS partagé, dossiers livrables générés.** Le HTML d'une architecture existe une seule fois. |
| 9 | **Portée d'un thème** | ✅ Couleurs **+ typo + rayons + ombres + motion**. Sinon `neo-brutalism` ou `glassmorphism` n'ont aucun sens. |
| 10 | **Contenu** | ✅ **Lorem ipsum + libellés neutres.** Aucun mot orienté secteur. |
| 11 | **Visuels** | ✅ **SVG neutres + dégradés CSS.** Poids nul, aucun droit à gérer, aucun lien mort. |
| 12 | **Premier lot** | ✅ **Fondations** : tokens, reset, trois thèmes de référence, style-guide. |
| 13 | **Surface vs texte** | ✅ **`--accent` et `--accent-text` sont deux tokens distincts.** Découvert en produisant le lot 0 — voir ci-dessous. |
| 14 | **Démo en ligne** | 🔲 **À décider.** Dépôt privé → GitHub Pages demande un plan payant. Netlify ou Vercel privé sont les alternatives. |
| 15 | **Licence / usage** | 🔲 **À décider.** Usage personnel, livraison client ou revente ? Change ce qu'on écrit dans les `README` de variante. |

---

## 3. Ce que le lot 0 a corrigé

Le style-guide a été écrit pour valider les tokens. Il a servi dès le premier jour.

**Onze paires de couleurs sous le seuil AA.** Pour la plupart des ajustements mineurs —
`--fg-subtle` trop clair, `--success` et `--warning` à 4.2-4.4 au lieu de 4.5. Corrigés
en resserrant les valeurs.

**Une vraie erreur de conception.** `--accent` servait à la fois de fond de bouton et de
couleur de lien. Ça marche tant que le thème est sage. Sur `neo-brutalism` — corail vif
sur fond jaune — le fond de bouton est excellent (7:1 avec du texte noir dessus) et le
même corail en texte tombe à 2.25:1, illisible.

Le réflexe aurait été de changer le corail. C'est la mauvaise réponse : ça sacrifie
l'identité du thème pour un problème qui n'existe que dans un seul usage. La bonne réponse
est de séparer les deux rôles :

- `--accent` — une **surface**. Ne doit contraster qu'avec `--accent-fg`.
- `--accent-text` — l'accent **comme texte**. Doit rester lisible sur `--bg`.

Ils valent la même chose dans la plupart des thèmes, et diffèrent quand le thème est
audacieux. C'est exactement le genre de défaut qu'on ne voit pas en concevant des tokens
dans l'abstrait, et qui aurait coûté une reprise des 145 architectures s'il avait été
trouvé au lot 3.

**Un outil en plus.** `_tools/check-contrast.js` : le contrat de contraste devient
vérifiable en une commande, et sort en code 1 — donc branchable en CI. Le style-guide reste
utile en complément, parce qu'il mesure les couleurs *réellement rendues* et pas seulement
les déclarations CSS.

**Une leçon de méthode.** Le sondage du sélecteur de thème utilisait `requestAnimationFrame`,
qui ne se déclenche pas dans un onglet en arrière-plan : les mesures restaient figées sur le
premier thème sans qu'aucune erreur n'apparaisse. Remplacé par `setTimeout`. À retenir pour
tout ce qui devra sonder une valeur calculée.

---

## 4. Pistes non retenues, à reconsidérer plus tard

| Piste | Pourquoi écartée maintenant | Quand y revenir |
|---|---|---|
| **Kit de blocs recombinables** | Impose une discipline de tokens qui n'existe pas encore, et beaucoup de travail avant le premier livrable | Lot 5, une fois cinquante variantes produites et les motifs récurrents identifiés |
| **Jeu de pages complet par variante** | Multiplie le coût par trois pour des pages qui n'apportent rien structurellement | À la demande, variante par variante, au moment d'une livraison réelle |
| **Familles par archétype pur** | Perdrait les contraintes réelles d'une boutique (grille, filtres, fiche) ou d'une application | Jamais — l'index transversal remplit déjà ce rôle |
| **Astro pour mutualiser les composants** | Impose un framework et un build à un dépôt qui doit rester copiable | Si la duplication HTML entre variantes devient ingérable |
| **Contenu de démo crédible par secteur** | C'est exactement ce que le virage a supprimé | Jamais dans le dépôt. Uniquement au moment d'adapter pour un client réel |
