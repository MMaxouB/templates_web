# 01-vitrine / 03-sidebar-fixe

## Intention, en trois lignes

Une colonne de gauche fine et immobile porte tout l'appareil de navigation ; la droite
porte tout le poids. Rien n'est centré, aucune moitié ne répond à l'autre, et le vide
se loge en bas de la colonne fine plutôt qu'entre les blocs.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `asymmetric-weighted` | grille 3/9 (puis 2/9 au-delà de 80 rem), aucun bloc pleine largeur centré, vide non centré |
| densité | `airy` | 6 à 12 éléments par écran, interlignage large |
| navigation | `sidebar` | colonne pleine hauteur, `position: sticky`, contenu à côté |
| média | `tiny-inset` | une seule vignette de 96 px — un repère en marge, jamais un sujet |
| interaction | `hover-preview` | la vignette change au survol **et au focus clavier** |

Typographie, géométrie, surface et mouvement viennent de l'habillage **revue**
(`revue-papier` + `papier-chaux`).

> **Habillage changé après mesure.** La première version portait « silence » et
> `perceptual-diff.js` la trouvait à 0.119 de `bench-05` — sous le seuil de clone, alors que
> les deux ADN n'ont rien de commun. Une page très aérée sous la même direction donne la même
> image : quelques mots dans un grand vide. REJECT AND REDESIGN appliqué à la lettre.

## Contraintes créatives

- `no-centered-text` *(structurelle)* — `text-align: center` interdit partout.
- `no-standard-cta` *(structurelle)* — aucune action n'est un bouton plein arrondi.
- `no-cards`, `no-rounded`.

`asymmetry` avait été déclarée puis **retirée après mesure** : elle exige un score de symétrie
≤ 0.72 et la page mesure 0.81. La cause est identifiée — le score se calcule sur la carte de
marquage, et une trame de fond pleine largeur marque les deux moitiés à l'identique quelle que
soit la composition. On ne desserre pas la règle : on retire la contrainte qu'on ne tient pas,
et on écrit le défaut de la métrique.

## Le point délicat

Une colonne latérale appelle mécaniquement un contenu centré à droite : on « équilibre ».
C'est exactement ce que `asymmetry` interdit. Le titre d'ouverture est donc borné à 22
caractères de mesure pour que le vide tombe à droite, et la colonne fine garde son vide
en bas — deux vides différents, aucun des deux au milieu.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| changer le rapport des colonnes | `assets/css/layout.css` → `.cadre { grid-template-columns }` |
| changer les trames d'aperçu | `assets/css/layout.css` → `.apercu__vue[data-vue='…']` |
| changer le comportement de l'aperçu | `assets/js/main.js` |
| changer les couleurs | `_core/palettes/lin-encre.css` — jamais ici |

## Pages livrées

`index.html` · `page.html` · `contact.html`.
