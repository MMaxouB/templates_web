# Palettes

Une palette ne contient **que des couleurs**. Rien d'autre. Elle fait une vingtaine
de lignes, se relit d'un coup d'œil, et doit passer `node _tools/check-contrast.js`.

C'est délibérément l'axe le moins puissant du catalogue — et c'est pour cela qu'il
doit rester séparé. Dans la version précédente du dépôt, quarante-six « thèmes »
de la famille T1 ne différaient que par leur teinte : `bold-red`, `bold-orange`,
`wheat-golden`, `fresh-mint`… Ils gonflaient le compteur de thèmes en ne produisant
qu'un seul design. Les appeler des palettes rend le catalogue honnête : on a une
direction artistique, déclinable en quarante-six couleurs.

```css
@layer palette {
  :root {
    --palette-name: 'Bleu Corporate';
    --palette-slug: 'bleu-corporate';
    /* … les seize rôles de couleur, et rien de plus … */
  }
}
```

**Ce qu'une palette n'a pas le droit de contenir :** police, rayon, ombre, épaisseur
de bordure, espacement, durée, texture, forme de contrôle. Si vous avez besoin de
l'un d'eux, ce que vous écrivez est une direction artistique, pas une palette.

**Contrat de contraste :** seize paires à 4.5:1 minimum, décrites en tête de
`_core/tokens.css`. Une palette qui ne le respecte pas n'entre pas dans le dépôt.

Voir aussi [`../directions/README.md`](../directions/README.md).
