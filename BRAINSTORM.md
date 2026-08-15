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
| 16 | **Modèle du catalogue** | ✅ **Trois couches : structure × direction artistique × palette.** `architecture × thème` était insuffisant — voir § 5. |
| 17 | **Nature d'un thème** | ✅ **Un « thème » n'existe plus.** Il se décompose en une palette (couleurs seules) et une direction artistique (forme, matière, typographie). Un préréglage les associe pour la vente. |
| 18 | **Diversité** | ✅ **Vérifiable, pas déclarative.** ADN en neuf axes, contraintes testées, budget de réflexes, comparaison des pixels. Voir § 6. |
| 19 | **Interdire les réflexes LLM** | ✅ **Non — les facturer.** Budget de 6 points par variante. Voir § 7. |
| 20 | **Cascade CSS** | ✅ **Couches explicites** `reset → base → palette → direction → structure → overrides`. Voir § 8. |
| 21 | **Ordre de production** | ✅ **Le Diversity Benchmark passe avant le lot des trois familles.** Voir § 9. |

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

## 5. Le second virage — de la correction à la singularité

### Le déclencheur

Le lot 1 était « terminé » : seize pages système, trois thèmes, zéro contraste
sous le seuil, zéro débordement. Tous les contrôles au vert.

Une question simple a suffi à le défaire : *ces seize pages ont-elles l'air de
venir de designers différents ?* Non. Elles ont l'air de venir du même générateur —
et c'est mesurable.

### La preuve

La page de tarifs, rendue sous `modern-light` puis sous `neo-brutalism` — les deux
thèmes les plus opposés du dépôt, choisis exprès pour éprouver les tokens — donne
deux captures superposables. Même axe, même rythme, mêmes positions, même
hiérarchie, même badge au-dessus de la même carte du milieu. Seule la peinture
change.

C'est littéralement le critère d'échec du projet : *« c'est le même template avec
des couleurs différentes »*.

### Le diagnostic — ce n'était pas un défaut d'exécution

Dans `architecture × thème`, un thème ne redéfinit que des variables. La
**composition** vit dans le `layout.css` de l'architecture, hors de sa portée. Le
catalogue annonçait 48 285 combinaisons et ne contenait que **145 compositions**.

Et ces 145 compositions ont été écrites d'affilée par le même modèle, avec les
mêmes réflexes. Multiplier par 333 ne multiplie pas la diversité : cela multiplie
la **même** diversité.

### Le retournement le plus utile de l'audit

> Le contrat de tokens — la réussite technique du dépôt, ce qui rend l'échelle
> tenable — est aussi la **cause principale** de l'uniformité.

Un vocabulaire de variables partagé *est* un système de design. Un système de
design partagé fait ressembler cent quarante-cinq objets à un seul. C'est sa
fonction.

La conclusion n'est pas de le supprimer — il porte les garanties de contraste,
de focus et de mouvement réduit, et aucune diversité ne vaut une page illisible.
Elle est de **casser son monopole sur la forme** : garder le socle pour les
garanties, ajouter des tokens expressifs pour que deux directions produisent des
formes différentes, et attaquer la composition là où elle vit — dans la structure,
au moment de l'écriture.

### Le catalogue des thèmes contenait déjà la réponse

En reclassant les 333 thèmes, trois familles entières se sont révélées n'être pas
des thèmes du tout :

- **T11 « Partis pris de mise en page »** (24) — `bento-grid`, `split-screen`,
  `masonry`, `sidebar-fixed`, `broken-grid`, `asymmetric`, `magazine-columns`…
  C'est la liste des archétypes de composition, **déjà présente dans le
  catalogue A**. La même chose était comptée deux fois : une fois comme forme, une
  fois comme peau.
- **T10 « Partis pris typographiques »** (14) — c'est l'axe `typography`.
- **T12 « Partis pris techniques »** (15) — ce sont des drapeaux de build.

Ces dimensions ne s'étaient pas égarées par hasard : **elles cherchaient à
exister**. Le modèle n'avait pas de place pour elles, alors elles se sont
réfugiées dans la seule liste ouverte. C'est le meilleur argument pour le modèle à
trois couches — et la raison pour laquelle il ne s'agit pas d'une lubie
d'architecture, mais d'une régularisation.

Ajoutons T1 (46 entrées ne différant que par la teinte) : le compteur de 333
« thèmes » recouvrait ~150 vraies directions, ~120 palettes, ~38 valeurs d'axes
mal rangées et 15 capacités techniques.

---

## 6. Pourquoi la diversité doit être mesurée et non déclarée

Le mode d'échec principal d'un catalogue généré n'est pas l'absence de diversité
dans les métadonnées. C'est la diversité **uniquement** dans les métadonnées.

Il est très facile d'écrire deux `meta.json` opposés et de produire deux pages
identiques. Un README qui décrit trente-et-un archétypes donne l'impression d'un
catalogue varié ; l'index transversal du dépôt était en réalité un **tableau de
doublons** — onze écrans coupés en deux, dix grilles uniformes, neuf pleins écrans
— sans qu'aucune règle n'oblige ces variantes à se distinguer ailleurs.

D'où les deux canaux, qui doivent exister tous les deux :

| Canal | Outil | Ce qu'il dit |
|---|---|---|
| Intention | `dna-report.js` | ce qu'on a **voulu** faire |
| Résultat | `perceptual-diff.js` | ce qu'on a **fait** |

Le cas à traquer n'est pas qu'ils soient bas tous les deux — c'est qu'ils
**divergent** : ADN lointain, pixels proches. La variante ment.

**Validation croisée obtenue dès la première exécution :** `systeme/14` et
`systeme/15` ressortent premiers des deux classements — 0.129 en ADN, 0.112 en
perceptuel. Deux mesures indépendantes, l'une sur du JSON, l'autre sur des pixels,
désignent la même paire. C'est le meilleur indice que la métrique est juste.

### Une décision technique qui a failli tout invalider

La première version de `perceptual-diff.js` comparait les captures en luminance.
Elle jugeait donc qu'une page sombre et une page claire étaient très différentes —
alors que ce sont peut-être exactement la même mise en page repeinte. Elle
échouait précisément sur le cas qu'elle devait attraper.

Correctif : tout ce qui sert à comparer des structures est calculé sur une **carte
de marquage** — l'écart de chaque case au fond de la page — et non sur la luminance
brute. La comparaison devient **invariante à la palette** : seule la structure
survit. Deux normalisations ont dû être reprises dans la foulée (profils en
distribution plutôt qu'en maximum, hash sur la médiane plutôt que sur la moyenne),
sans quoi un seul grand titre suffisait à faire passer deux pages identiques pour
différentes.

C'est le genre de défaut qu'on ne voit pas en concevant la métrique dans
l'abstrait — le même schéma que la découverte de `--accent-text` au lot 0.

---

## 7. Facturer les réflexes plutôt que les interdire

Tentation initiale : une liste noire. `Inter` interdit, hero centré interdit,
bouton pilule interdit.

**Pourquoi c'est la mauvaise réponse.** Une interdiction produit de l'évitement
mécanique. On remplace `Inter` par une autre linéale moderne, le bleu par du vert,
le radius 12 par 16 — et le résultat reste le même design. C'est exactement la
confusion entre variation cosmétique et variation structurelle que le projet
cherche à éliminer ; une liste noire l'encourage.

**Réponse retenue : un budget.** Chaque réflexe a un coût, chaque variante a
6 points. Le dépassement exige une justification écrite nommant la direction que
le réflexe sert.

L'effet est un arbitrage forcé. Une variante qui dépense 4 points dans un hero
centré n'a plus de quoi payer les cartes arrondies *et* les ombres douces *et*
l'accent bleu. Elle devient différente par construction, sans qu'on ait eu à
prescrire à quoi elle doit ressembler — ce qui serait juste une autre façon
d'uniformiser.

Corollaire assumé : la direction `moderne-neutre` coûte 4 points à vide. Elle est
conservée comme **témoin** — le point de comparaison, et ce que certains clients
demandent littéralement. Le catalogue doit pouvoir le fournir sans mentir sur ce
que c'est.

### Deux faux positifs corrigés au premier passage

Le premier rapport annonçait « police de marque LLM » sur 63 % des variantes.
Faux : le motif `Inter` se déclenchait sur **`pointer`**. Corrigé par une ancre
sur une déclaration de police et des bornes de mot.

De même, « ressource externe » se déclenchait sur une URL de démonstration écrite
dans du texte. La vérification porte désormais sur les positions de **chargement**
(`src=`, `<link href=`, `url()`, `@import`), pas sur la présence d'une URL.

**Leçon de méthode :** un outil qui crie au loup est un outil qu'on cesse de lire.
Le coût d'un faux positif est plus élevé que celui d'un faux négatif, parce qu'il
détruit la confiance dans l'ensemble du rapport.

---

## 8. Les couches CSS

Pour qu'une direction artistique puisse reprendre la main sur une structure
(supprimer tous les arrondis, décentrer un texte), il faut un ordre de priorité
explicite. Sans lui, seule la spécificité arbitre — et on finit en `!important`.

```
reset → base → palette → direction → structure → overrides
```

**Piège rencontré.** Envelopper `tokens.css` dans `@layer base` sans envelopper
`reset.css` inverse leur priorité : les règles non layerisées gagnent sur toutes
les couches. `reset.css` aurait alors imposé `line-height: 1.5` au corps de page et
`font-weight: inherit` aux titres — tous les titres du dépôt auraient perdu leur
graisse, silencieusement. Les deux fichiers ont donc été layerisés ensemble, et la
non-régression vérifiée en comparant les captures **octet par octet** avant et
après.

**Migration.** Les variantes écrites avant les couches ne sont pas layerisées,
donc prioritaires sur tout : `@layer overrides` ne les atteint pas. C'est
acceptable et volontaire — `check-constraints.js` les liste. La migration consiste
à envelopper `layout.css` dans `@layer structure`.

Vérifié de bout en bout sur `12-systeme/10-tarifs-colonnes` : une fois migrée, la
direction `presse-imprimee` parvient à décentrer les textes que la structure
centrait. Ce qui subsiste — les boîtes centrées par `margin: auto` — reste hors de
portée, et c'est la bonne frontière : **une direction change la matière, pas le
plan.**

---

## 9. Pourquoi le benchmark passe avant la production

La feuille de route prévoyait le lot 2 (trois familles principales, quarante-cinq
templates). L'audit l'a repoussé.

Le raisonnement : on connaît maintenant un défaut systémique, chiffré. Produire
cent vingt-neuf architectures de plus avant de savoir si le nouveau système le
corrige revient à répliquer cent vingt-neuf fois un problème identifié. Le coût de
la découverte tardive est asymétrique — corriger douze pages est trivial, en
corriger cent quarante-cinq ne se fait jamais.

Le Diversity Benchmark répond à une seule question : *le système sait-il produire
des interfaces radicalement différentes ?* Douze références opposées, trois
critères mesurés, plus un test humain qui prime sur les trois.

**Ce que le benchmark autorise en cas d'échec :** modifier le vocabulaire d'ADN,
ajouter des tokens, revoir la séparation des couches. Ce qu'il n'autorise pas :
passer au lot suivant en espérant que le volume arrange les choses.

C'est la même logique que le lot 0, qui n'avait produit aucune page présentable
mais avait trouvé le défaut de `--accent` au moment où il coûtait le moins cher.

---

## 10. Le piège inverse : le chaos

Un risque symétrique existe, et il faut le nommer parce que la consigne
« sois différent » y mène directement : **faire bizarre pour être différent**.

Ce n'est pas l'objectif. L'objectif est que les designs diffèrent **parce qu'ils
obéissent à des logiques différentes** :

- un template minimaliste doit être minimaliste avec discipline ;
- un brutaliste, cohérent dans sa brutalité ;
- un éditorial doit fonctionner comme une publication ;
- un template de données doit fonctionner comme un outil ;
- un rétro doit respecter les conventions de son époque ;
- un expérimental doit avoir ses propres règles — et les tenir.

Deux dispositifs protègent contre le chaos :

1. **Le champ `consequence`** de chaque valeur d'axe. Une variante ne peut pas se
   déclarer `asymmetric-weighted` sans que la conséquence — grille à colonnes
   inégales, vide non centré — soit vérifiable. L'étiquette n'achète rien.
2. **La contrainte `controlled-chaos`** exige que la règle interne soit *écrite*
   dans le README de la variante, et qu'on puisse l'appliquer à un contenu
   nouveau. Une irrégularité non reproductible est du bruit, pas un parti pris.

La diversité doit être **sémantique et structurelle**, jamais décorative.

---

## 11. Ce que la reprise du lot 1 a appris

Le lot 2bis a repassé au nouveau système seize pages écrites **avant** que les
règles n'existent. C'est le seul test qui compte vraiment : concevoir douze
références neuves sous contrainte est facile ; corriger du code déjà écrit, non.

### Les axes ne sont pas portés par la même couche

C'est la découverte structurelle de ce lot, et elle manquait au modèle.

| Couche | Axes qu'elle possède |
|---|---|
| **Structure** (`layout.css` + DOM) | composition · densité · navigation · interaction · média |
| **Direction** (`_core/directions/`) | typographie · géométrie · surface · mouvement |

Une variante ne peut donc pas déclarer librement les neuf. `04-maintenance`
annonçait `surface: concrete` alors qu'elle était rendue sous `moderne-clair`,
dont la surface est `flat-paint` : la capture ne montrait aucun béton. **L'ADN
décrivait une page qui n'existait pas.**

Correctif : chaque variante déclare un `habillage_reference`, et les quatre axes
portés par la direction en sont repris. Effet de bord heureux — les seize pages
se répartissent désormais sur **treize habillages distincts** au lieu d'un seul,
ce qui est exactement ce que le modèle à trois couches promettait.

### La mémoire de diversité a servi, et pas là où on l'attendait

Deux collisions ne concernaient pas les seize pages entre elles, mais leur
rapport au **benchmark** : `systeme/05` avec `bench/05`, `systeme/02` avec
`bench/02`. Écrites à des semaines d'intervalle, ces paires avaient convergé vers
le même parti — narrow-measure/didone d'un côté, full-bleed/poster-heavy de
l'autre.

C'est la démonstration de l'utilité du dispositif : **personne n'aurait fait le
rapprochement de tête**, et l'œil ne l'aurait vu qu'une fois les vingt-huit
vignettes posées côte à côte, c'est-à-dire trop tard.

### Un bug d'outil masquait la totalité du progrès

Pendant une bonne partie du lot, les mesures ne bougeaient pas après chaque
refonte. `check-constraints.js` cherchait la capture par préfixe et prenait le
**premier dossier par ordre alphabétique** — souvent `systeme-04--dark-neon`,
resté d'un build antérieur. Le rapport décrivait fidèlement une page qui
n'existait plus.

Le correctif tient en trois lignes (lire l'habillage de référence déclaré), mais
la leçon est plus large : **un outil de mesure qui lit la mauvaise source est
pire qu'une absence d'outil**, parce qu'il inspire confiance. Le symptôme était
pourtant visible — la sonde disait `hero: false` pendant que le rapport
facturait `hero-centre(4)`. Il a fallu comparer les deux pour le voir.

### Trois règles se sont révélées trop généreuses

`empty` (≤ 6 éléments/écran) avait été attribuée à trois pages qui en comptent 8,
12,8 et 13,9. Elles sont minimales par leur **traitement**, pas par leur
**quantité**. La contrainte a été retirée et la densité déclarée ramenée à la
mesure. On ne desserre pas la règle pour faire passer la page.

---

## 12. Ce que le lot 3 a appris

Quinze architectures écrites d'affilée, chacune sur une composition différente.
C'est le premier lot produit **entièrement sous le système** — les seize pages
système avaient été écrites avant les règles, les douze références du benchmark
avaient été conçues pour les éprouver.

### La contrainte de lot a fonctionné, et pas comme prévu

« Quinze variantes, quinze compositions » devait garantir la diversité. Ce qu'elle
a surtout produit, c'est une **contrainte de conception** : quand la composition
est imposée d'avance, on ne peut plus retomber sur celle qui vient naturellement.
Un lookbook de boutique devient `stacked-planes` au lieu d'une grille ; un masonry
de portfolio devient `editorial-columns`, c'est-à-dire des colonnes de journal —
ce qu'était le masonry avant que le web ne l'invente à nouveau.

L'effet secondaire compte autant : trois axes sont passés à 100 % de couverture
(`composition`, `navigation`, `media`) parce qu'il fallait bien loger quelque part
les valeurs qui restaient — `top-bar`, `monochrome`, `duotone`, `halftone`,
`overlay-menu`. **Une valeur jamais employée n'est pas une valeur rare, c'est une
valeur qu'on n'a jamais eu de raison de choisir.**

### Le contrôle d'hygiène ne voyait qu'une partie du dépôt

`neon-nocturne` codait ses halos en cyan et magenta littéraux depuis sa création.
Aucun contrôle ne s'en était plaint, pour une raison inattendue : les variantes
antérieures référencent encore l'ancien thème monolithique, et `check-constraints.js`
ne lit la direction que lorsqu'elle est liée en `<link>`. **Le contrôle est bon ;
c'est son champ de vision qui était partiel.** La première variante à référencer
correctement une direction a fait tomber le défaut en une exécution.

Corollaire à retenir pour le lot 4 : les seize pages système et le benchmark
devraient migrer vers les liens `palette` + `direction`, sans quoi une partie du
catalogue reste hors de portée des contrôles d'hygiène.

### Déclarer ce qui est mesuré, encore

Sept densités sur quinze ont été déclarées à côté de la mesure. Aucune n'a été
« ajustée » en desserrant la règle : toutes ont été ramenées à ce que compte la
sonde, la visée initiale restant écrite dans `justifications`. Le cas le plus
instructif est `02-boutique/03`, qui visait `maximalist` : le mur est passé de 18 à
36 pièces, de six à huit colonnes, et la sonde s'arrête à 85 éléments par écran.
Au-delà, les vignettes deviennent illisibles. La valeur reste donc **inatteignable
au contenu de démonstration** — même conclusion que la valeur d'axe abandonnée au
lot 2, et même méthode : on l'écrit plutôt que de la contourner.

### Le défaut de mesure du lot : la trame de fond compte comme de l'encre

C'est la découverte la plus utile, et elle porte sur l'outil, pas sur les pages.

`perceptual-diff.js` calcule tout — symétrie, silhouette, profils — sur une **carte
de marquage** : l'écart de chaque case au fond de la page. Le correctif du lot 2
avait rendu la mesure invariante à la palette, ce qui était juste. Mais une trame de
fond pleine largeur — le textile de `luxe-silence`, le métal de `metal-brosse`, le
papier tramé de `collage-riso` — marque **toutes** les cases, et donc les deux
moitiés à l'identique.

Conséquences observées :

- une page manifestement asymétrique mesure 0.81 de symétrie ;
- une pose d'objets à coordonnées libres mesure 0.85 ;
- deux pages sous la même direction texturée se rapprochent quelle que soit leur
  composition.

Trois contraintes ont été **retirées plutôt que desserrées** (`asymmetry` sur
`01-vitrine/03`, `controlled-chaos` sur `02-boutique/03` et `05`), avec le défaut
écrit dans chaque `meta.json`. C'est le même arbitrage qu'au lot 2bis sur la
contrainte `empty` : on ne modifie pas le seuil pour faire passer la page.

**Correctif à faire avant le lot 4 :** soustraire de la carte de marquage ce qui est
uniformément réparti sur toute la surface, c'est-à-dire distinguer la matière du
contenu. Tant que ce n'est pas fait, la distance perceptuelle sous-estime la
diversité des variantes texturées — exactement le symptôme inverse de celui que le
lot 2 avait corrigé, et pour la même raison de fond : **la métrique doit regarder ce
qui est composé, pas ce qui est peint.**

### Un REJECT AND REDESIGN, réellement appliqué

`01-vitrine/03` — colonne latérale, composition déséquilibrée — mesurait 0.119 de
distance perceptuelle avec `bench-05`, très en dessous du seuil de clone, alors que
les deux ADN n'ont rien en commun. Le diagnostic tient en une phrase : **deux
compositions très aérées sous la même direction produisent la même image.** Quelques
mots dans un grand vide se ressemblent, quelle que soit la grille qui les place.

La variante a donc changé d'habillage — de `silence` à `revue` — et gagné des filets
de section. La distance est remontée, sans atteindre le seuil. La règle du dépôt
disait « pas un changement de couleur » : ici le changement d'habillage en est bien
un au sens du modèle à trois couches, puisqu'il emporte typographie, géométrie,
matière et mouvement. Mais il ne suffit pas — et c'est cohérent avec le défaut de
mesure ci-dessus.

---

## 13. Pistes non retenues, à reconsidérer plus tard

| Piste | Pourquoi écartée maintenant | Quand y revenir |
|---|---|---|
| **Kit de blocs recombinables** | Impose une discipline de tokens qui n'existe pas encore, et beaucoup de travail avant le premier livrable | Lot 5, une fois cinquante variantes produites et les motifs récurrents identifiés |
| **Jeu de pages complet par variante** | Multiplie le coût par trois pour des pages qui n'apportent rien structurellement | À la demande, variante par variante, au moment d'une livraison réelle |
| **Familles par archétype pur** | Perdrait les contraintes réelles d'une boutique (grille, filtres, fiche) ou d'une application | Jamais — l'index transversal remplit déjà ce rôle |
| **Astro pour mutualiser les composants** | Impose un framework et un build à un dépôt qui doit rester copiable | Si la duplication HTML entre variantes devient ingérable |
| **Contenu de démo crédible par secteur** | C'est exactement ce que le virage a supprimé | Jamais dans le dépôt. Uniquement au moment d'adapter pour un client réel |
| **Liste noire de polices et de motifs** | Produit de l'évitement mécanique : on change la police et le design reste le même | Jamais. Remplacée par le budget de réflexes (§ 7) |
| **Score de diversité agrégé en un nombre** | Une somme d'axes est arbitraire et se truque : on gagne des points sans changer d'apparence. Le vrai besoin est de détecter les **collisions**, pas de noter | Jamais sous forme de note globale. La couverture par axe et la distance par paire répondent mieux |
| **Polices auto-hébergées (WOFF2 dans le dépôt)** | Casserait « zéro ressource distante » seulement en apparence — mais alourdit chaque livrable et pose des questions de licence sur un dépôt destiné à des clients | Si les piles système se révèlent insuffisantes **après** le benchmark, et seulement pour des familles libres de droits |
| **Générateur automatique de variantes depuis l'ADN** | Produirait des pages cohérentes avec leurs métadonnées et vides de parti pris — l'ADN décrit une intention, il ne la remplace pas | Peut-être pour du *scaffolding* : pré-remplir un `layout.css` à partir des axes, à finir à la main |
| **Supprimer `moderne-neutre`** | C'est le témoin : sans lui, plus de point de comparaison pour mesurer si une direction s'éloigne vraiment. Et des clients le demandent | Jamais. Il reste étiqueté `role: temoin` |
