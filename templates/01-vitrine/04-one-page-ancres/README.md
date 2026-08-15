# 01-vitrine / 04-one-page-ancres

## Intention, en trois lignes

Un panneau de chantier déroulé. Chaque ancre est une bande pleine largeur qui change de
fond, de densité **et** d'alignement interne — une bande qui ne changerait que de couleur
serait une section repeinte. La progression remplace le menu.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `banded` | cinq bandes de nature différente : capitales pleine largeur, colonne décalée d'un tiers, matrice de cotes, schéma, sortie sur fond d'accent |
| densité | `balanced` | 12 à 20 éléments par écran ; la bande de cotes triple localement la densité |
| navigation | `progress-driven` | une jauge et deux pas — aucun menu, aucune barre |
| média | `svg-diagram` | un schéma de principe coté, pas une illustration |
| interaction | `expand-collapse` | `<details>` natifs, repliés par défaut ; la page fonctionne sans JavaScript |

Typographie, géométrie, surface et mouvement viennent de l'habillage **chantier**
(`beton-brut` + `beton-orange`).

## Contraintes créatives

- `no-viewport-sections` *(structurelle)* — **aucune bande ne fait un écran de haut.**
  C'est la contrainte la plus utile du lot : `one-page` + `scroll-snap` mène droit au
  diaporama de sections à `100vh`, et le rythme de la page devient celui de l'écran.
- `physical` — banchage de béton produit en `repeating-linear-gradient`, cohérent sur
  toute la page et pas seulement sur un bloc.
- `no-rounded`, `no-centered-text`.

## Budget anti-réflexes

0 / 6. Le `<details>` est gratuit puisque `interaction: expand-collapse` est déclarée.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| ajouter une bande | `index.html` → `<section class="bande …" data-bande>` + un décalage dans `layout.css` |
| changer les décalages d'alignement | `assets/css/layout.css` → paliers `@media` |
| changer la logique de progression | `assets/js/main.js` |
| changer les couleurs | `_core/palettes/beton-orange.css` — jamais ici |

## Pages livrées

`index.html` · `page.html` · `contact.html`.
