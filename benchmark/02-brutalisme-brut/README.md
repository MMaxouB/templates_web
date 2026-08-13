# 02 — Brutalisme brut

## Intention

Le béton banché. Le brutalisme architectural ne décore pas : il montre le
matériau et le procédé. Ici on montre la matière du Web — le bloc, le bord, le
texte trop grand — sans chercher à l'adoucir.

## Ce qui porte l'identité

**Bord à bord.** Aucun `max-inline-size`, aucun `margin: auto`. Les blocs
touchent les bords de l'écran comme le béton touche le coffrage. C'est la
composition `full-bleed`, et c'est l'opposé exact du conteneur centré par défaut.

**Deux tailles, rien entre les deux.** Le titre monte à `17vw`, le corps reste à
`0.8rem`. Un rapport supérieur à 20:1 rend toute hiérarchie intermédiaire
inutile — c'est ce que veut dire `display-dominant`.

**La navigation est dans la phrase.** Il n'y a aucun bloc de navigation, aucune
barre, aucun menu. Les liens sont des mots de l'accroche. `inline-contextual`
au sens strict.

**La donnée est une largeur.** La série chiffrée devient cinq aplats pleins dont
la longueur signifie. Pas de tableau, pas d'axe, pas de légende.

**Le média est écrasé.** `preserveAspectRatio="none"` sur un ratio 5:1 déforme
délibérément le dessin. Le sujet est coupé, et c'est le sujet.

**Les joints de banche.** La texture du fond superpose un grain minéral et des
lignes horizontales tous les 120 px — la trace des panneaux de coffrage. Le
procédé rendu visible, en une déclaration CSS.

## Distinction avec `neo-brutaliste`

Le dépôt contient deux directions qui portent le mot. Elles ne visent pas la
même chose :

| | `neo-brutaliste` | `beton-brut` |
|---|---|---|
| Référence | le style Web de 2020 | le matériau |
| Couleurs | jaune criard, corail | béton, orange de sécurité |
| Bordures | 3 px noires partout | filets de 6 px, joints de banche |
| Profondeur | ombre pleine décalée | aucune |
| Nature | une citation | une construction |

## Où changer quoi

| Quoi | Où |
|---|---|
| Taille du titre | `.enorme` → `clamp()` |
| Échelle des barres | `.barre` → `inline-size` |
| Écartement des joints | `_core/directions/beton-brut.css` → `--surface-texture-image` |
| Agressivité du recadrage | `.coupe__img` → `block-size` |
