# 02-boutique / 01-grille-classique

## Intention, en trois lignes

Un inventaire, pas une vitrine. La grille est dessinée : les filets du module se voient
même là où il n'y a pas d'article, et chaque référence s'y aligne sans exception.
Le catalogue se lit comme une nomenclature — référence, montant, état.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `modular-grid` | grille visible, alignement au module, aucune exception |
| densité | `information-heavy` | **mesurée** à 75 éléments par écran ; voir la justification dans `meta.json` |
| navigation | `alphabetic-index` | index A–Z persistant, saut par tranche de lettres |
| média | `duotone` | fond de module + un aplat d'accent en `mix-blend-mode`, découpé au `clip-path` |
| interaction | `filter-sort` | les filtres masquent réellement des articles, le tri réordonne le DOM, le compteur suit |

Typographie, géométrie, surface et mouvement viennent de l'habillage **donnees**
(`console-donnees` + `ardoise-signal`).

## Contraintes créatives

- `visible-grid` — la grille n'est pas seulement respectée, elle est **tracée**.
- `no-cards` *(structurelle)* — un article n'a pas de surface propre : il occupe un module.
  C'est la distinction qui compte ici, parce qu'une grille d'articles devient une grille de
  cartes au premier moment d'inattention.
- `data-first` *(structurelle)* — `tabular-nums`, tableaux réels, tri qui modifie le DOM.
- `no-rounded`.

## Le point délicat

Une grille uniforme d'articles est **le** réflexe du catalogue généré, et le lot l'assume
plutôt que de le contourner : c'est l'archétype vendu sous ce numéro. Ce qui change, c'est
que rien n'est déguisé — aucune ombre, aucun arrondi, aucun « effet de carte ». Si le client
veut la grille classique, il l'obtient sans le vernis.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| changer le nombre de colonnes | `assets/css/layout.css` → `.grille { grid-template-columns }` |
| ajouter un filtre | `index.html` → `<select data-filtre="…">` + un attribut `data-…` sur chaque `.article` |
| changer les formes bichromes | `assets/css/layout.css` → `.article__vue--N::before { clip-path }` |
| changer les couleurs | `_core/palettes/ardoise-signal.css` — jamais ici |

## Pages livrées

`index.html` · `listing.html` (nomenclature complète) · `produit.html` (fiche).
