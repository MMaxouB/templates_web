# 03-portfolio / 03-liste-hover

## Intention, en trois lignes

Une seule liste de titres énormes, tous pendus au même axe gauche, drapeau à droite.
Aucun visuel n'est visible au repos : l'aperçu bichrome apparaît au survol — ou au focus —
et disparaît. La page est une table des matières qui se suffit.

## Forme

| Axe | Valeur | Ce qu'elle engage ici |
|---|---|---|
| composition | `flush-left-ragged` | un seul retrait partagé par tous les niveaux, aucun centrage, aucune justification |
| densité | `compact` | 20 à 32 éléments par écran, interlignage resserré |
| navigation | `vertical-index` | la liste **est** la navigation : pas de menu à côté |
| média | `duotone` | deux aplats en `mix-blend-mode`, aucune nuance intermédiaire, aucun `<img>` |
| interaction | `hover-preview` | au survol l'aperçu suit le pointeur ; **au focus il se pose à une place fixe** |

Typographie, géométrie, surface et mouvement viennent de l'habillage **neo-brutal**
(`neo-brutaliste` + `jaune-corail`).

## Contraintes créatives

- `typography-first` — aucun `<img>`, rapport de tailles > 8:1 entre le titre de tête
  (jusqu'à 9 rem) et les métadonnées (11 px). Le décor, c'est le texte.
- `no-cards` *(structurelle)* — les lignes sont séparées par des filets de 2 px, rien d'autre.
- `no-centered-text` *(structurelle)*.

## Le point délicat

Un aperçu qui suit le pointeur n'a, par construction, aucun équivalent au clavier : il n'y a
pas de pointeur. La réponse retenue n'est pas de supprimer l'effet mais de lui donner **deux
régimes** — suivi du pointeur à la souris, position fixe au focus. C'est la seule façon de
déclarer `hover-preview` sans mentir.

## Pages livrées

`index.html` (liste) · `projet.html` · `contact.html`.
