# 01 — Editorial minimal

## Intention

Une revue trimestrielle. On lit longtemps, on ne consomme pas. La page doit
donner envie de s'asseoir.

## Ce qui porte l'identité

**Le texte coule en colonnes.** `column-count` fait ce qu'une grille ne fait
pas : le paragraphe passe d'une colonne à l'autre. C'est le comportement de
l'imprimé, et il change la manière de lire.

**La marge est habitée.** Les repères vivent dans une colonne étroite de gauche,
alignée au fer à droite pour toucher le texte. Ce n'est pas une barre latérale :
aucun fond, aucune bordure, aucune surface. C'est la marge d'une page.

**Deux familles, deux rôles exclusifs.** Georgia pour tout ce qui se lit,
Arial Narrow capitale pour tout ce qui se repère. Aucune ne déborde sur le rôle
de l'autre — c'est ce qui fait un système `family-contrast` plutôt qu'un simple
choix de polices.

**Rien n'est enfermé.** Pas une carte, pas une ombre, pas un arrondi. La
structure est faite de filets d'un pixel, de retraits et de blanc.

**L'action est un renvoi.** « Poursuivre » est un mot souligné en fin de texte,
suivi d'une flèche. Pas un bouton — un magazine n'a pas de bouton.

## Où changer quoi

| Quoi | Où |
|---|---|
| Largeur de la marge | `.revue` → `grid-template-columns` |
| Nombre de colonnes | `.flux` → `column-count` |
| La lettrine | `.section:first-child p:first-of-type::first-letter` |
| Le grain de papier | `_core/directions/revue-papier.css` → `--surface-texture-image` |
| Les couleurs | `_core/palettes/papier-chaux.css` |

## Distance aux voisines

La plus proche du benchmark est `12-spatial-experimental`, à **0.839**. Le seuil
de réussite est 0.60 : cette référence est très isolée dans l'espace de conception.

Les deux directions d'imprimé du dépôt sont volontairement opposées :
`revue-papier` est aérée et lente, `presse-imprimee` est dense et urgente. Même
médium, deux économies.
