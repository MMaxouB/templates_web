# 02-boutique / 04-lookbook-plein-ecran

## Intention, en trois lignes

Un cahier d'affiches qu'on feuillette. Les plans se recouvrent — le titre passe sur la vue,
la légende repasse dessous — et la profondeur vient uniquement du recouvrement.
On tourne les pages : il n'y a pas de défilement continu.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `stacked-planes` | trois plans par planche, `z-index` signifiant, recouvrement ≥ 8 % |
| densité | `airy` | une planche par écran, une idée par plan |
| navigation | `numeric-index` | les numéros de planche **sont** la navigation |
| média | `aggressive-crop` | ratios 5:1, 4:1, 1:1.2 — le sujet est coupé, le cadrage est désinvolte |
| interaction | `page-turn` | boutons précédent / suivant + flèches clavier ; **sans JS, tout le cahier est lisible** |

Typographie, géométrie, surface et mouvement viennent de l'habillage **affiche**
(`affiche-diagonale` + `ocre-encre`).

## Contraintes créatives

- `no-shadow` — c'est la contrainte qui rend `stacked-planes` opposable : sans ombre,
  la profondeur ne peut venir que d'un vrai recouvrement.
- `no-standard-cta` *(structurelle)* — l'action n'est pas un bouton plein arrondi centré.
- `no-centered-text` *(structurelle)*, `no-rounded`.

## Une contradiction relevée à l'écriture

La première rédaction déclarait `navigation: scroll-only` avec `interaction: page-turn`.
« Le seul contrôle est la molette » et « pas de défilement continu » ne peuvent pas être
vrais en même temps : l'ADN décrivait une page impossible. C'est exactement le défaut que
le lot 2bis avait trouvé sur `04-maintenance` — une valeur d'axe qui ne correspond à rien
de rendu. Corrigé en `numeric-index`, qui est ce que la page fait réellement.

## Pages livrées

`index.html` (cahier) · `listing.html` (série A) · `produit.html` (fiche).
