# 03-portfolio / 05-scroll-horizontal

## Intention, en trois lignes

Un carton à planches qu'on fait glisser. Chaque planche est composée sur son axe central —
cadre, figure, cote, légende numérotée — exactement comme une figure d'ouvrage savant,
et le déplacement se fait à la main : on tire la planche suivante.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `centered-axial` | **la seule du lot**, et délibérément : voir ci-dessous |
| densité | `airy` | une à deux planches par écran |
| navigation | `numeric-index` | les numéros de figure sont la navigation |
| média | `uncropped-object` | quatre ratios d'origine conservés, marge blanche autour |
| interaction | `drag-manipulate` | glisser au pointeur **et** flèches clavier sur le carton focalisable |

Typographie, géométrie, surface et mouvement viennent de l'habillage **planche**
(`planche-savante` + `herbier-sepia`).

## Pourquoi `centered-axial` ici, et une seule fois

L'axe central est le réflexe le plus facturé du catalogue — mais la règle du lot 3 ne le
ferme que si la valeur dépasse 40 % des variantes, et le catalogue en est à 4 %. Une planche
d'ouvrage **est** symétrique : cartouche centré, figure centrée, cote sous la figure. Ici
l'axe n'est pas le conteneur centré par défaut, c'est la convention de l'objet imité — et
c'est la différence entre citer une forme et y retomber.

## Contraintes créatives

- `no-hero` *(structurelle)* — le titre est un cartouche d'une ligne ; la figure 01 est
  visible dès le premier écran. C'est la contrainte qui empêche l'axe central de redevenir
  un bandeau d'accueil.
- `physical` — le papier est une trame CSS, pas une image.
- `no-shadow`, `no-rounded`.

## Pages livrées

`index.html` (carton) · `projet.html` (notice) · `contact.html`.
