# 02-boutique / 03-filtres-barre-haute

## Intention, en trois lignes

Une grille de six à huit colonnes existe, et trois familles d'éléments la violent selon une
règle écrite. Le bandeau de filtres n'ouvre pas un tiroir : il ouvre un menu **plein écran**,
qui masque entièrement le mur — on filtre, puis on revient regarder.

## La règle interne (contrainte `controlled-chaos`)

Elle est reproductible sur un contenu nouveau, c'est ce qui la distingue du bruit :

```
décalage vertical  : (index modulo 3) × 24 px
débordement gauche : index multiple de 4  →  la vue sort de 8 % à gauche
chevauchement      : index multiple de 5  →  la vue mord la gouttière suivante (z-index 2)
```

Tout le reste s'aligne strictement sur la grille — sans quoi il n'y aurait rien à briser.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `broken-grid` | une grille + au moins trois familles d'exceptions, logique répétable |
| densité | `information-heavy` | **mesurée** à 85 éléments par écran ; voir ci-dessous |
| navigation | `overlay-menu` | un seul déclencheur, l'ouverture masque toute la page, `Échap` referme |
| média | `mosaic` | vignettes jointives, aucune gouttière |
| interaction | `filter-sort` | séries, plafond de montant, tri : le DOM visible change et le compteur suit |

Typographie, géométrie, surface et mouvement viennent de l'habillage **riso**
(`collage-riso` + `riso-fluo`).

## Ce que la mesure a corrigé

La variante visait `maximalist` (> 100 éléments par écran). Le mur est passé de 18 à
36 pièces et de six à huit colonnes : la sonde s'arrête à **85**. Au-delà, les vignettes
deviennent illisibles avant que le compteur n'atteigne 100. La seconde porte de
`maximalist` — couverture d'encre supérieure à 45 % — n'est pas mesurée par la sonde
actuelle, donc pas opposable.

**Conclusion notée dans `meta.json` : `maximalist` reste inemployé dans le catalogue, et
c'est un résultat, pas un oubli.** C'est le même constat que le benchmark avait fait sur une
valeur d'axe inatteignable à contenu constant.

## Budget anti-réflexes

5 / 6, les deux dépassements justifiés par écrit : la trame riso est un dégradé répété
(la matière de la direction), et le mur de vignettes égales est la conséquence de
`media: mosaic`.

## Pages livrées

`index.html` (mur) · `listing.html` (série A) · `produit.html` (fiche).
