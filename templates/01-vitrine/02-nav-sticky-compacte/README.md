# 01-vitrine / 02-nav-sticky-compacte

## Intention, en trois lignes

Une colonne de 42 caractères posée dans un très grand vide, et rien d'autre.
La navigation n'est pas une barre : c'est une pastille compacte qui flotte, détachée
des quatre bords, et qui n'affiche au repos que le rang de la section lue.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `narrow-measure` | mesure ≤ 42 ch, plus de 40 % de la largeur laissée vide au-delà de 80 rem |
| densité | `airy` | 6 à 12 éléments par écran, interlignage large, une idée par bloc |
| navigation | `floating` | `position: fixed` décollée des bords ; sous 480 px elle descend, elle ne devient jamais une barre pleine largeur |
| média | `none` | zéro `<img>`, zéro SVG décoratif — contrainte `no-images` |
| interaction | `progressive-reveal` | le rang se met à jour au défilement ; **sans JS, tout reste visible** |

Typographie, géométrie, surface et mouvement viennent de l'habillage **rien**
(`presque-rien` + `blanc-graphite`).

## Contraintes créatives

- `no-cards` *(structurelle)* — aucun bloc n'a de fond, de cadre ni d'ombre ; c'est le vide qui sépare.
- `no-viewport-sections` *(structurelle)* — aucun bloc ne fait un écran de haut : le rythme vertical
  vient de l'espacement, jamais du viewport.
- `no-images`, `no-shadow`.

## Le point délicat

`narrow-measure` et `progressive-reveal` se contredisent facilement : une révélation au défilement
finit presque toujours en `opacity: 0` + `translateY`, c'est-à-dire le réflexe *fade-up*, facturé 3
points. Ici la progression ne masque rien — elle **compte**. Le repli sans JavaScript n'est donc pas
une politesse d'accessibilité : c'est la même page.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| élargir la colonne | `assets/css/layout.css` → `.colonne { inline-size }` |
| déplacer la pastille | `assets/css/layout.css` → `.pastille` |
| changer le comportement du compteur | `assets/js/main.js` |
| changer les couleurs | `_core/palettes/blanc-graphite.css` — jamais ici |

## Pages livrées

`index.html` · `page.html` · `contact.html`.
