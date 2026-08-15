# 02-boutique / 02-filtres-sidebar

## Intention, en trois lignes

Le catalogue est une matrice, pas une galerie : lignes de références, colonnes de
propriétés comparables, en-têtes qui restent en place. La colonne de filtres est un
panneau de réglages de logiciel — tout est visible, rien ne se déplie.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `tabular` | structure ligne × colonne comme mise en page **principale**, en-têtes persistants, chiffres alignés |
| densité | `information-heavy` | mesurée à 97 éléments par écran, corps ≤ 13 px |
| navigation | `sidebar` | panneau permanent, `position: sticky`, jamais un tiroir |
| média | `tiny-inset` | une puce de 24 px par ligne — un repère, pas un sujet |
| interaction | `filter-sort` | cases, plage de montant, compteur : les lignes disparaissent réellement |

Typographie, géométrie, surface et mouvement viennent de l'habillage **systeme-ancien**
(`systeme-95` + `gris-systeme`).

## Contraintes créatives

- `data-first` *(structurelle)* — `tabular-nums`, tableaux réels, filtres qui modifient le DOM.
- `dense` *(structurelle)* — ≥ 32 éléments par écran, mesuré.
- `no-rounded`, `no-centered-text`.

## Le point délicat

Une matrice de huit colonnes ne tient pas dans 375 px. La réponse **n'est pas** de supprimer
des colonnes en mobile — ce serait supprimer la comparaison, c'est-à-dire la fonction de la
page. Le débordement est donc contenu dans `.table__cadre` et défile horizontalement, le
document restant stable.

La densité déclarée a été ramenée à la mesure : la première version comptait 139 éléments
au premier écran, ce qui est `maximalist` et non `information-heavy`. Six lignes retirées
plutôt qu'une étiquette desserrée.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| ajouter une colonne | `index.html` → `<thead>` + une cellule par ligne |
| ajouter un filtre | `index.html` → `<input data-filtre="…">` + `data-…` sur les `<tr>` |
| changer la logique de filtrage | `assets/js/main.js` |
| changer les couleurs | `_core/palettes/gris-systeme.css` — jamais ici |

## Pages livrées

`index.html` (matrice) · `listing.html` (sélection) · `produit.html` (fiche).
