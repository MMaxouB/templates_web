# 02-boutique / 05-masonry

## Intention, en trois lignes

Un établi vu de dessus. Les pièces ne sont pas empilées dans des colonnes : elles sont
**posées** à des coordonnées, jamais recadrées, sur un plan de métal brossé plus grand que
l'écran. On zoome et on se déplace ; le vide autour d'un objet est le plan de travail.

## La règle interne (contrainte `controlled-chaos`)

```
x        : (index × 29) modulo 52, + 3     → trame de pourcentage, bornée à gauche
y        : (index × 47) modulo 68, + 4
rotation : ((index × 37) modulo 9) − 4 degrés
taille   : cycle de cinq valeurs — 10 / 14 / 18 / 12 / 16 rem
z-index  : 20 − taille                     → les grosses pièces passent DERRIÈRE
```

Aucune valeur n'est tirée au hasard. Appliquée à douze pièces nouvelles, la règle redonne
la même famille de dispositions — c'est ce qui distingue un parti pris d'un bruit.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `scattered` | positionnement par coordonnées, aucun flux vertical régulier |
| navigation | `inline-contextual` | aucun bloc de menu : les liens sont des mots de l'introduction |
| média | `uncropped-object` | quatre ratios d'origine conservés, aucun recadrage |
| interaction | `spatial-zoom` | échelle 55 % → 190 %, déplacement au clavier comme à la souris |
| densité | `balanced` | 12 à 20 éléments par écran |

Typographie, géométrie, surface et mouvement viennent de l'habillage **atelier**
(`metal-brosse` + `acier-cuivre`).

## Contraintes créatives

- `controlled-chaos` *(structurelle)* — la règle ci-dessus, écrite et reproductible.
- `physical` — métal brossé produit en trames CSS, aucune image.
- `no-centered-text` *(structurelle)*.

## Ce que la mesure a corrigé

Première règle : `x = (index × 29) modulo 76`. Les pièces se répartissaient alors sur toute
la largeur et `perceptual-diff.js` mesurait un score de symétrie de **0.83** — au-dessus des
0.60 qu'exige `controlled-chaos`. Une dispersion uniforme n'est pas une dispersion : c'est
une grille floue. Le modulo ramené à 52 donne à l'établi un bord de travail à gauche et un
vide à droite, ce qui est aussi plus juste pour un plan de travail.

## Le point délicat

Un plan zoomable est un piège d'accessibilité classique : tout passe par la molette et le
glisser, donc rien ne passe au clavier. Ici le plan est focalisable, les flèches le
déplacent, `+` et `−` changent l'échelle, et l'état de l'échelle est annoncé en `role="status"`.
Sans JavaScript, l'échelle vaut 1 et le plan se parcourt par ses barres natives.

## Pages livrées

`index.html` (établi) · `listing.html` (séries) · `produit.html` (fiche).
