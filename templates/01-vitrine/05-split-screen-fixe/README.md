# 01-vitrine / 05-split-screen-fixe

## Intention, en trois lignes

Deux panneaux pleine hauteur qui défilent séparément : le document, lui, ne défile jamais.
À gauche l'appareil et son plan masqué, à droite le contenu. Le détail s'ouvre en couche
par-dessus les deux, sans faire perdre sa place à personne.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `panelled` | zones à défilement indépendant, hauteur pleine, séparateur franc, **`overflow: hidden` sur le document** |
| navigation | `inline-contextual` | aucun bloc de menu : les liens sont des mots du texte du panneau gauche |
| média | `masked` | le plan est révélé par un `clip-path`, jamais recadré ni encadré |
| interaction | `modal-layer` | `<dialog>` natif : piège de focus et retour à l'origine gratuits, donc corrects |
| densité | `balanced` | 12 à 20 éléments par écran |

Typographie, géométrie, surface et mouvement viennent de l'habillage **verre**
(`plans-verre` + `nuit-verre`).

## Contraintes créatives

- `no-cards` *(structurelle)* — les entrées sont séparées par un filet et du vide, jamais par une surface flottante.
- `no-centered-text` *(structurelle)*, `no-rounded`.

## Le point délicat

Deux zones de défilement indépendantes sur un téléphone de 375 px sont un piège tactile :
on croit faire défiler la page, on fait défiler un panneau. Sous 48 rem, la variante
redevient donc **un flux unique**, panneau gauche puis panneau droit. La composition
`panelled` n'est tenue qu'à partir du moment où elle est tenable.

Le flou d'arrière-plan de la direction `plans-verre` est gratuit au budget anti-réflexes
parce que `surface: glass` est déclarée : le verre est ici la matière, pas un vernis.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| changer le rapport des panneaux | `assets/css/layout.css` → `.split { grid-template-columns }` |
| changer la forme du masque | `assets/css/layout.css` → `.vue { clip-path }` |
| changer le contenu de la couche | `index.html` → `<dialog class="couche">` |
| changer les couleurs | `_core/palettes/nuit-verre.css` — jamais ici |

## Pages livrées

`index.html` · `page.html` · `contact.html`.
