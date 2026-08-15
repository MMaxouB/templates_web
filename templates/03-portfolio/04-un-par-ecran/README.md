# 03-portfolio / 04-un-par-ecran

## Intention, en trois lignes

L'axe dominant n'est ni horizontal ni vertical : une coupe à 12 degrés traverse chaque plan,
le titre suit la pente, la vue est masquée par le même angle. On avance d'un plan à l'autre
comme on tourne une page, avec une jauge pour seul repère.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `diagonal` | `clip-path` structurant sur chaque plan, rotation du titre, aucun bloc orthogonal |
| densité | `airy` | un travail par plan |
| navigation | `progress-driven` | jauge + précédent / suivant, aucun menu |
| média | `masked` | `clip-path` révélant une partie seulement, au même angle que la coupe |
| interaction | `page-turn` | un plan à la fois ; **sans JS, les six plans s'empilent et se lisent au défilement** |

Typographie, géométrie, surface et mouvement viennent de l'habillage **neon-nuit**
(`neon-nocturne` + `neon-cyan-magenta`).

## Contraintes créatives

- `no-gradient` — c'est **la** contrainte utile ici : un habillage néon appelle le dégradé
  d'ambiance comme un réflexe. Interdit, la lueur doit venir d'un filet et d'une ombre
  colorée. Seules les trames répétées (`repeating-linear-gradient`) restent permises.
- `no-cards` *(structurelle)*, `no-centered-text` *(structurelle)*.

## Pages livrées

`index.html` (plans) · `projet.html` · `contact.html`.
