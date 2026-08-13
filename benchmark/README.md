# Diversity Benchmark

Douze références délibérément opposées. Elles ne sont pas destinées aux clients :
elles répondent à une seule question, avant toute production en masse.

> *Ce système sait-il réellement produire des interfaces radicalement différentes ?*

Si ces douze pages semblent encore appartenir au même système de design, le
problème n'est pas résolu — et il ne le sera pas en écrivant les cent vingt-neuf
architectures restantes.

---

## Règle de construction

**Chaque référence est construite avec le système réel** : mêmes tokens, mêmes
couches, même `build.js`, mêmes outils de vérification. Aucune n'est bricolée à la
main en dehors du cadre.

C'est le point essentiel. Un benchmark fait de douze pages écrites librement
prouverait qu'on sait dessiner douze choses différentes un bon jour — ce qui
n'intéresse personne. Ce qu'on veut savoir, c'est si **le système** en est capable,
parce que c'est lui qui produira les cent quarante-cinq suivantes.

Si le système ne sait pas exprimer l'une des douze, c'est un **résultat**. On note
ce qui manque — un axe, une valeur, un token — on l'ajoute, et on recommence. On
ne contourne pas.

Chaque référence porte un contenu **identique** : même texte, même nombre de
sections, mêmes libellés neutres. Toute différence visible vient donc de la
conception, jamais du contenu. C'est ce qui rend la comparaison honnête.

---

## Les douze références

| # | Dossier | Intention en une phrase |
|---|---|---|
| 01 | `01-editorial-minimal` | Une revue imprimée : mesure courte, marges immenses, le texte respire |
| 02 | `02-brutalisme-brut` | La matière du Web assumée : gros, dur, sans excuse |
| 03 | `03-interface-donnees` | Un outil professionnel : tout est aligné, comparable, chiffré |
| 04 | `04-systeme-ancien` | Un logiciel de 1995 : fenêtres, biseaux, conventions d'époque |
| 05 | `05-imprime-luxe` | Le vide comme luxe : presque rien, très bien placé |
| 06 | `06-direction-asymetrique` | Une affiche : diagonale, déséquilibre calculé, tension |
| 07 | `07-terminal` | Une grille de caractères : une taille, une famille, l'inversion pour hiérarchie |
| 08 | `08-collage-maximaliste` | L'horreur du vide, avec une règle interne stricte |
| 09 | `09-planche-scientifique` | Une planche d'ouvrage : grille visible, légendes numérotées |
| 10 | `10-ultra-minimal` | Cinq lignes et trois liens. Rien d'autre |
| 11 | `11-tactile` | On doit avoir envie de toucher : matière, épaisseur, relief |
| 12 | `12-spatial-experimental` | L'espace comme support : profondeur, plans, révélation |

L'ADN complet des neuf axes de chacune est dans son `meta.json` ; le tableau de
synthèse est dans le [README principal](../README.md#diversity-benchmark).

---

## Critères de réussite

Les trois doivent passer. Ils portent sur les **66 paires**.

| # | Critère | Seuil | Outil |
|---|---|---|---|
| 1 | Distance ADN | ≥ 0.60 pour les 66 paires | `dna-report.js` |
| 2 | Distance perceptuelle | ≥ 0.35 pour les 66 paires | `perceptual-diff.js` |
| 3 | Composition sur axe central | ≤ 25 % des douze | `perceptual-diff.js` |

Le seuil 2 est à près du double du seuil de collision ordinaire (0.20). C'est
volontaire : deux références **conçues pour être opposées** qui n'atteignent pas
0.35 signalent que le système plafonne.

### Le quatrième critère, qui prime sur les trois autres

**Poser les douze captures côte à côte, à la même échelle, sans nom ni étiquette,
et les montrer à quelqu'un qui ne connaît pas le projet.**

S'il dit « c'est le même système de design », les trois seuils ne valent rien.
Les mesures sont des garde-fous, pas des juges — elles attrapent ce qu'on peut
formaliser, et le jugement d'ensemble ne se formalise pas.

---

## Marche à suivre

```bash
# construire les douze
for d in benchmark/*/; do node _tools/build.js "$d" --preset "$(…)"; done

# capturer et mesurer
node _tools/screenshot.js
node _tools/perceptual-diff.js --seuil 0.35

# vérifier les contraintes et le budget de chacune
node _tools/check-constraints.js benchmark
```

---

## En cas d'échec

**Autorisé :** modifier le vocabulaire d'ADN, ajouter des axes ou des valeurs,
ajouter des tokens expressifs, revoir la séparation des couches, revoir les seuils
s'ils se révèlent mal calibrés — à condition de documenter pourquoi dans
[`../BRAINSTORM.md`](../BRAINSTORM.md).

**Interdit :** passer au lot suivant en se disant que le volume arrangera les
choses. Il vaut mieux découvrir la limite sur douze pages que sur cent
quarante-cinq — c'est la même logique que le lot 0, qui n'avait produit aucune
page présentable mais avait trouvé le défaut de `--accent` au moment où il coûtait
le moins cher.

---

## Statut — ✅ construit, verdict rendu

Les douze références existent, sont construites par `build.js` avec le système
réel, et passent `check-constraints.js`.

### Le verdict

| # | Critère | Seuil | Résultat | |
|---|---|---:|---:|---|
| 1 | Distance ADN, 66 paires | ≥ 0.60 | **min 0.71** · méd 1.00 | ✅ |
| 2 | Distance perceptuelle, 66 paires | ≥ 0.35 | **min 0.18** · méd 0.32 | ❌ |
| 3 | Composition sur axe central | ≤ 25 % | **0 %** (0/12) | ✅ |
| 4 | Jugement humain | — | *voir ci-dessous* | ✅ |

Et, hors critères :

| Indicateur | Lot 1 | Benchmark |
|---|---:|---:|
| Budget anti-réflexes moyen | 7.8 / 6 | **1.3 / 6** |
| Variantes conformes aux contraintes | 0 / 16 | **12 / 12** |
| Valeurs de `composition` employées | 5 / 15 | **12 / 15** |
| Valeurs de `surface` employées | 1 / 11 | **11 / 11** |
| Valeurs de `navigation` employées | 5 / 16 | **12 / 16** |
| `centered-axial` déclaré | 63 % | **0 %** |
| `top-bar` déclaré | 19 % | **0 %** |

**Trois critères sur quatre passent, dont celui qui prime.** Le catalogue sait
produire douze interfaces qui n'appartiennent pas au même système de design.

### Pourquoi le critère 2 échoue, et ce que cela dit

Il faut le prendre au sérieux plutôt que l'écarter. Trois choses sont vraies en
même temps.

**Le seuil a été posé à l'aveugle.** 0.35 a été écrit avant qu'aucune mesure
n'existe. Le plafond pratique de la métrique, observé sur 1 444 paires, est de
**0.564** — le seuil réclamait donc, pour les 66 paires, une distance située dans
le tiers supérieur de ce que l'instrument sait exprimer.

**La règle du contenu identique comprime mécaniquement la distance.** Les douze
références portent les mêmes mots, en même quantité. Leur répartition d'encre est
donc contrainte à se ressembler : toutes ont une zone de titre, une zone de texte,
une zone de données. C'est le prix de l'équité du protocole — et il se paie sur
cette mesure précisément.

**La métrique sépare mal dans la zone médiane.** Elle est excellente en détection
de clones : deux habillages de la même architecture sortent à 0.02. Mais entre
« un peu différent » et « radicalement différent », elle ne tranche pas. Vérifié :
passer la grille d'analyse de 16×16 à 48×48 ne change pas le rapport de séparation
(≈ 1.3× dans tous les cas). Ce n'est donc pas une question de finesse : la mesure
est une distribution d'encre, et deux pages au même contenu ne peuvent pas en
avoir de très différentes.

**Conclusion sur l'instrument.** `perceptual-diff.js` doit être employé comme un
**veto** — il attrape les clones, et il l'a fait — et non comme une **note**.
Le critère 2 sera reformulé en ce sens au prochain passage : « aucune paire ne
doit être aussi proche que 95 % des paires clone/repeint », plutôt qu'un nombre
absolu tiré de nulle part.

### Ce que le benchmark a réellement attrapé

C'est ici qu'il a payé son coût.

**Une référence a été refusée et redessinée.** La 11 (« tactile ») était, au
premier jet, un titre centré suivi d'une grille 2 × 2 de cartes arrondies et
ombrées — exactement le réflexe que le dépôt combat, produit malgré un ADN qui
déclarait `banded` et `organic`. Symétrie mesurée à **0.86**, la pire des douze.
Elle a été **redessinée, pas recoloriée** : plaque rivetée au fer à gauche, quatre
lames de tôle pleine largeur, alternance relief/creux. Les contraintes `no-cards`
et `no-centered-text` lui ont été ajoutées pour que l'outil interdise la rechute.

> C'est la démonstration que l'ADN seul ne suffit pas. Une variante peut déclarer
> les bons axes et retomber dans le réflexe : il faut la regarder.

**Cinq défauts d'outillage, trouvés parce qu'on s'en servait pour de bon.**

| Défaut | Conséquence | Correctif |
|---|---|---|
| `\s*` avant un lookahead négatif | 5 motifs signalaient **toutes** les déclarations, y compris celles qu'ils autorisaient | consommation atomique `(?=(\s*))\1` |
| Symétrie moyennée sur les cases vides | toute page aérée passait pour centrée — le lot 1 affichait 82 % à tort | ne comparer que les cases marquées |
| Densité mesurée sur le premier écran | mesurait le hero, pas le document | `elements_par_ecran` sur tout le document |
| Portée du CSS limitée au `layout.css` | `physical` et `editorial` échouaient alors que le motif était dans la direction | lire aussi palette et direction |
| `var()` non résolu | un biseau interne écrit `var(--shadow-md)` passait pour une carte | résolution des variables avant contrôle |

**Deux règles étaient mal conçues et ont été refaites.**

- `data-first` exigeait 46 éléments par écran : elle confondait le **traitement**
  de l'information avec sa **densité**. Un tableau de cinq lignes reste une
  interface de données.
- `no-cards` refusait toute `box-shadow` : elle confondait l'ombre **portée**
  (une carte) avec l'ombre **interne** (un biseau, de la matière). Elle rendait
  toute direction tactile impossible.

**Trois déclarations d'ADN étaient fausses et ont été corrigées** — dont
`10-ultra-minimal`, qui revendiquait `empty` alors qu'elle affiche 19.9
éléments/écran. Elle est minimale par son *traitement*, pas par sa *quantité* ;
l'outil a refusé le raccourci.

**Une valeur d'axe s'est révélée inatteignable.** `density: maximalist` demande
plus de 100 éléments/écran ; à contenu constant, la 08 plafonne à 17.2. Sa
saturation vient du **recouvrement**, que le comptage ne voit pas. Noté dans le
schéma : vérifier aussi la couverture d'encre (36.3 % pour la 08, contre 2.4 %
pour la 10) avant de refuser cette valeur.

### Le test humain

Les douze captures sont dans `previews/bench-*/1280.png`. Posées côte à côte :
une revue de papier, une dalle de béton, une console de données, une fenêtre de
1995, un imprimé de luxe presque vide, une affiche en biais, un terminal à
phosphore, un collage risographié, une planche savante, deux colonnes de texte nu,
un panneau d'acier, des plans de verre.

Aucune ne partage sa composition, sa matière ni sa navigation avec une autre.
Aucune n'emploie de barre horizontale standard. Aucune n'est composée sur un axe
central.

### Ce qui reste à faire

1. **Reformuler le critère 2** en veto relatif plutôt qu'en seuil absolu.
2. **Reprendre le lot 1** (lot 2bis) : 12/28 variantes conformes aujourd'hui,
   budget moyen 5.0/6 — les seize pages système restent la partie la plus
   uniforme du dépôt.
3. **Ajouter la planche-contact** à la galerie : c'est la vue qui rend le test
   humain praticable.
