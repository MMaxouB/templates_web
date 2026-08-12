# Directions artistiques

Une direction artistique décide de **tout ce qui n'est ni la structure du document,
ni la couleur** : le système typographique, la géométrie, la matière, le traitement
des médias, la forme des contrôles, le style du focus, les filets, la densité,
la philosophie de mouvement.

C'est la couche qui manquait au dépôt. Avant elle, un « thème » ne pouvait que
repeindre : `neo-brutalism` et `modern-light` appliqués à la même architecture
produisaient deux captures superposables au pixel près, avec des couleurs
différentes. C'est exactement le reproche adressé aux interfaces générées.

```
palette      →  les couleurs                          ~25 lignes
direction    →  la forme, la matière, la typographie   100–250 lignes
structure    →  le DOM et sa mise en page              le layout.css d'une variante
```

## Ce qu'une direction a le droit de faire

Dans `@layer direction` : redéfinir n'importe quel token **hors couleur**, et poser
des règles sur les éléments natifs (`h1`, `figure`, `table`, `hr`, `input`).

Dans `@layer overrides` : imposer à la structure le peu qui n'est pas négociable —
typiquement supprimer tous les arrondis, toutes les ombres, ou tous les centrages.
Cette couche est puissante ; elle doit rester courte. Si une direction a besoin de
vingt règles d'`overrides`, c'est qu'elle décrit une structure, pas une direction.

> ⚠ `@layer overrides` ne porte que sur les variantes dont le `layout.css` est déjà
> dans `@layer structure`. Les variantes antérieures aux couches sont non
> layerisées, donc prioritaires sur tout. `node _tools/check-constraints.js` les
> liste.

## Ce qu'une direction n'a pas le droit de faire

- Écrire une couleur en dur. Aucune exception : c'est la règle d'or du dépôt.
- Charger une police distante, un CDN, une image bitmap.
- Supprimer l'indicateur de focus. Elle peut en changer la forme, jamais l'existence.
- Ignorer `prefers-reduced-motion`.

## Nommer

Le nom décrit **la logique interne**, pas l'humeur. `presse-imprimee` dit ce que la
direction fait ; `elegant-moderne` ne dit rien et deux personnes le comprendraient
différemment.

## Un préréglage, pour la vente

Un client ne veut pas choisir une direction *et* une palette. Un **préréglage**
(`_core/presets.json`) associe les deux sous un nom unique et c'est ce qu'on montre
en rendez-vous. Le découpage reste interne.
