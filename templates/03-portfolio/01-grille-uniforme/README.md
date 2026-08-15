# 03-portfolio / 01-grille-uniforme

## Intention, en trois lignes

La grille est uniforme, mais elle **ceinture** l'écran : quatre entrées en haut, quatre en
bas, deux de chaque côté. Le centre reste vide jusqu'à ce qu'on désigne une entrée — il n'y
reçoit alors qu'un numéro et un titre, projetés comme sur une console.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `marginal` | contenu en périphérie, centre libre (46 % de la surface du premier écran) |
| densité | `balanced` | 12 à 20 éléments par écran |
| navigation | `numeric-index` | les entrées sont désignées par leur numéro |
| média | `monochrome` | une seule teinte — le phosphore — déclinée en valeurs et en trames |
| interaction | `hover-preview` | **le focus clavier fait exactement ce que fait le survol**, et le centre est `aria-live` |

Typographie, géométrie, surface et mouvement viennent de l'habillage **console**
(`terminal-phosphore` + `phosphore-vert`).

## Contraintes créatives

- `no-cards` *(structurelle)* — une entrée est une vignette, un numéro et un mot ; aucune surface.
- `monochrome` — aucune couleur d'accent d'une autre teinte n'entre dans la page.
- `no-centered-text` *(structurelle)*, `no-rounded`.

## Le point délicat

`hover-preview` produit presque toujours une page inutilisable au clavier : l'aperçu ne vit
que dans `:hover`. Ici les quatre écouteurs vont par paires — `mouseenter`/`focus`,
`mouseleave`/`blur` — et le centre annonce le changement. Si la paire n'est pas complète,
l'axe est un mensonge.

Sous 48 rem, la ceinture redevient un empilement : sur 375 px, une périphérie n'a pas de
centre à laisser libre.

## Pages livrées

`index.html` (index) · `projet.html` · `contact.html`.
