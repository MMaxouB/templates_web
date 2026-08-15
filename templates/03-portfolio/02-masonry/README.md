# 03-portfolio / 02-masonry

## Intention, en trois lignes

Le masonry rendu à son ancêtre : la colonne de journal. Le contenu **coule** d'une colonne
à la suivante, les hauteurs inégales sont une conséquence du texte et non une mosaïque
calculée, et un index alphabétique persistant tient lieu de sommaire.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `editorial-columns` | `columns` réelles, filets de colonne, césures, veuves et orphelines |
| densité | `dense` | 32 à 55 éléments par écran |
| navigation | `alphabetic-index` | index A–Z persistant, saut à la lettre |
| média | `halftone` | trame d'impression simulée en `repeating-radial-gradient`, points visibles |
| interaction | `filter-sort` | le tri réordonne le DOM, donc l'ordre de lecture des colonnes |

Typographie, géométrie, surface et mouvement viennent de l'habillage **quotidien**
(`presse-imprimee` + `encre-journal`), partagé avec `01-vitrine/01`.

## Pourquoi ce partage d'habillage est légitime

Deux variantes du même lot sous le même habillage doivent se séparer sur les **cinq axes de
structure**, puisque les quatre autres sont portés par la direction. Elles le font sur la
composition (`full-bleed` contre `editorial-columns`), la navigation (`top-bar` contre
`alphabetic-index`), le média (`captioned-editorial` contre `halftone`) et l'interaction.
Distance ADN mesurée : bien au-dessus du seuil de risque.

## Contraintes créatives

- `editorial` — colonnes, `orphans`/`widows`, légendes numérotées, folios.
- `dense` *(structurelle)* — mesuré.
- `justified` — `text-align: justify` **et** `hyphens: auto` : justifier sans césure produit
  des lézardes, c'est pour cela que la contrainte exige les deux.
- `no-rounded`.

## Pages livrées

`index.html` (relevé) · `projet.html` (notice) · `contact.html`.
