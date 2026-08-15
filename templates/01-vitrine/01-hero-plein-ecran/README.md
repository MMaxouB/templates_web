# 01-vitrine / 01-hero-plein-ecran

## Intention, en trois lignes

Une une de quotidien : rien n'est enfermé dans un conteneur, tout touche les quatre bords.
L'ouverture n'est pas un bandeau d'accueil mais un chapeau d'article suivi immédiatement
de matière — six colonnes de texte et une figure légendée partagent le premier écran.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `full-bleed` | aucun `max-width`, aucun `margin-inline: auto` sur un bloc principal ; les marges sont internes |
| densité | `dense` | 32 à 55 éléments au premier écran — manchette, chapô, six paragraphes en colonnes, figure, sommaire |
| navigation | `top-bar` | **déclarée et assumée** : c'est l'archétype vendu. Traitée en manchette de journal, pas en barre d'application |
| média | `captioned-editorial` | chaque visuel est une `<figure>` numérotée, légendée et créditée |
| interaction | `static-all-visible` | rien n'est replié, rien n'attend un clic |

Typographie, géométrie, surface et mouvement viennent de l'habillage **quotidien**
(`presse-imprimee` + `encre-journal`) : ces quatre axes sont portés par la direction.

## Contraintes créatives

- `dense` *(structurelle)* — au moins 32 éléments par écran, mesuré.
- `editorial` — colonnes, `orphans`/`widows`, césures, folios, légendes numérotées.
- `no-rounded`, `no-shadow` — la hiérarchie passe par le filet et la casse, jamais par l'élévation.

## Budget anti-réflexes

La barre horizontale est le seul réflexe présent, et elle est gratuite : `navigation: top-bar`
est déclarée dans l'ADN et justifiée dans `meta.json`. Aucun hero centré, aucune section
pleine hauteur, aucune grille de cartes, aucun dégradé.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| changer la largeur des colonnes | `assets/css/layout.css` → `.une__corps { columns }` |
| ajouter une rubrique à la manchette | `index.html` → `.manchette__nav` (les trois pages) |
| changer les couleurs | `_core/palettes/encre-journal.css` — jamais ici |
| changer la matière ou la typographie | `_core/directions/presse-imprimee.css` |

## Pages livrées

`index.html` · `page.html` · `contact.html`.
Les liens marqués `data-stub` pointent vers des pages non développées.
