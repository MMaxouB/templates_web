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

## Statut

🔲 **Non commencé.** C'est la prochaine étape du projet, avant le lot des trois
familles principales.

Ligne de base à battre, mesurée sur le lot 1 (49 rendus) :

| Indicateur | Lot 1 | Cible du benchmark |
|---|---:|---:|
| Composition sur axe central | 82 % | ≤ 25 % |
| Distance perceptuelle médiane inter-architectures | 0.374 | ≥ 0.45 |
| Distance ADN minimale | 0.032 | ≥ 0.60 |
| Valeurs de `surface` employées | 1 / 11 | ≥ 7 |
