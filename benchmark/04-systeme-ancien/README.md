# 04 — Système ancien

## Intention

Un gestionnaire de fenêtres de 1995. Le respect des conventions d'époque prime
sur le goût contemporain : un template rétro qui « améliore » son modèle rate
exactement ce qu'il imite.

## Ce qui porte l'identité

**La profondeur est un biseau, pas une ombre.** Deux traits d'un pixel — clair
en haut à gauche, sombre en bas à droite — et le bloc paraît sorti de l'écran.
Inverser les deux traits le fait paraître enfoncé, ce qui donne l'état
« pressé » d'un bouton sans une seule transition. C'est tout le vocabulaire de
relief de l'époque, et il ne coûte aucun flou.

**Les zones de contenu sont en creux, les commandes en relief.** Le biseau n'est
pas décoratif : il dit ce qui est cliquable et ce qui ne l'est pas. Une
information portée par la forme, pas par la couleur.

**Tout est encadré.** Chaque section est un groupe à cadre et légende
chevauchante, comme un `fieldset`. Le cadre délimite une responsabilité — c'est
la géométrie `frames`.

**Les panneaux défilent séparément.** `block-size: 100svh` et deux zones à
`overflow: auto`. Le document ne défile jamais globalement : c'est la
différence structurelle entre une application et une page.

**Le menu masque tout.** `overlay-menu` au sens strict — un seul déclencheur,
et l'ouverture recouvre entièrement la fenêtre.

**Les traits de l'arborescence sont en CSS.** Pseudo-éléments pointillés, aucune
image.

## Le seul `ui-native` du benchmark

C'est la seule référence des douze qui emploie la pile système, marquée
« réflexe » dans le schéma. Elle est justifiée nommément dans `meta.json` :
ces interfaces employaient littéralement la police du système, et en choisir
une autre aurait été un contresens historique.

C'est précisément ce que le budget anti-réflexes doit permettre — non pas
interdire, mais obliger à écrire pourquoi.

## Où changer quoi

| Quoi | Où |
|---|---|
| Épaisseur et couleurs du biseau | `_core/directions/systeme-95.css` → `--bevel-*` |
| Largeur du panneau d'arborescence | `.client` → `grid-template-columns` |
| Palette d'époque | `_core/palettes/gris-systeme.css` |
| Comportement du menu et de la fiche | `assets/js/main.js` |

## Accessibilité

`<dialog>` fournit nativement le piège de focus. Échap ferme le menu comme la
fiche, et le focus revient toujours à son déclencheur. Le rectangle pointillé
de focus est celui de l'époque — et il reste visible partout, ce qui n'est pas
négociable dans ce dépôt.
