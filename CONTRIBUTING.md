# Ajouter au catalogue

Trois choses peuvent être ajoutées : une **architecture** (une structure), une
**direction artistique** (une forme, une matière), une **palette** (des couleurs).
Ce ne sont pas les mêmes gestes et le coût n'a rien à voir.

| | Coût | Ce que ça change | Où |
|---|---|---|---|
| Palette | 25 lignes | les couleurs, rien d'autre | `_core/palettes/` |
| Direction | 100–250 lignes | la forme, la matière, la typographie | `_core/directions/` |
| Architecture | 1 à 3 pages | la composition — le plus lourd, et le plus utile | `templates/` |

---

## Ajouter une architecture

**Ne commence pas par écrire du HTML.** Le code vient après la direction
artistique. Une variante écrite « au fil de l'eau » retombe sur les réflexes du
moment : hero centré, barre horizontale, trois cartes, ombres douces.

### Étape A — écrire l'intention, en trois lignes

Dans le `README.md` de la variante, avant tout code. Si l'intention tient en
« une page de présentation moderne et épurée », elle n'existe pas : c'est la
description du réflexe par défaut.

### Étape B — lire ce que le catalogue contient déjà

```bash
node _tools/dna-report.js --couverture --suggere
```

C'est l'étape qu'on saute et qu'il ne faut jamais sauter. Cent quarante-cinq
variantes conçues isolément convergent vers le même design ; le catalogue doit se
comporter comme un écosystème.

Le rapport signale toute valeur employée par plus de 40 % du catalogue. Ces
valeurs-là sont fermées, sauf raison écrite.

### Étape C — choisir les neuf axes

```bash
./_tools/new-variant.sh 01-vitrine 16-nav-verticale-droite
```

Puis remplir le bloc `dna` du `meta.json`. Le vocabulaire est dans
[`_core/dna/schema.json`](_core/dna/schema.json) — et chaque valeur y porte une
`consequence` qui est un **engagement**, pas une étiquette. Déclarer
`density: "dense"` oblige à 46–80 éléments dans le premier écran, mesurés.

### Étape D — attribuer les contraintes créatives

Au moins deux, dont au moins une du groupe `structurelle`. Voir
[`_core/dna/constraints.json`](_core/dna/constraints.json).

Ce n'est pas une formalité : c'est le dispositif qui empêche de retomber sur la
solution la plus probable. Choisis-les **avant** de coder, pas après pour décrire
ce qui est sorti.

### Étape E — construire

Dans cet ordre : composition → typographie → densité → navigation → géométrie →
surface → média → interaction → mouvement → HTML → CSS → JS.

Le `layout.css` doit être enveloppé :

```css
@layer structure {
  /* … */
}
```

Sans cela, aucune direction artistique ne pourra reprendre la main dessus.

### Étape F — vérifier

```bash
node _tools/check-constraints.js 01-vitrine/16-nav-verticale-droite
node _tools/build.js 01-vitrine/16-nav-verticale-droite --all-presets
node _tools/screenshot.js vitrine-16
node _tools/perceptual-diff.js
```

Puis la [checklist qualité](README.md#checklist-qualité) — les deux sections,
correction **et** singularité.

### Étape G — si c'est trop proche

**REJECT AND REDESIGN.** Pas un changement de couleur, pas un ajustement de
padding. Retourner à l'étape B et choisir d'autres axes.

C'est la règle la plus difficile à tenir et la seule qui compte vraiment.

---

## Ajouter une direction artistique

Une direction décide de **tout ce qui n'est ni la structure ni la couleur**.

### Ce qu'elle doit faire

Avoir une **logique interne nommable**, écrite en tête de fichier. Pas une
humeur — un fonctionnement. `presse-imprimee` dit : *la hiérarchie vient des
filets et de la casse, le texte coule en colonnes courtes, il n'y a pas de
surfaces, le papier n'est jamais blanc*. On peut en déduire chaque décision.

Chaque choix doit avoir des conséquences sur au moins quatre de ces registres :
composition, typographie, espacement, formes, composants, interactions,
animations, médias, détails graphiques. Une direction qui ne touche qu'aux
couleurs et aux rayons est une palette qui s'ignore.

### Structure du fichier

```css
@layer direction {
  :root {
    --direction-name: '…';
    --direction-slug: '…';
    /* tous les tokens hors couleur */
  }
  /* règles sur les éléments natifs : h1, figure, table, hr, input */
}

@layer overrides {
  /* le strict nécessaire imposé à la structure */
}
```

`@layer overrides` est puissant et doit rester court. **Une direction qui a besoin
de vingt règles d'overrides décrit une structure, pas une direction.**

### Interdits

- écrire une couleur en dur — c'est la règle d'or du dépôt ;
- charger une police distante, un CDN, une image bitmap ;
- supprimer l'indicateur de focus (en changer la forme : oui ; le supprimer : non) ;
- ignorer `prefers-reduced-motion`.

### Validation

L'appliquer sur `12-systeme/16-style-guide`, puis vérifier qu'elle **déplace
réellement** le rendu :

```bash
node _tools/build.js 12-systeme/16-style-guide --all-presets
node _tools/screenshot.js && node _tools/perceptual-diff.js
```

Lire la section « Amplitude de l'habillage ». Une direction dont la distance aux
autres reste sous 0.15 sur la même architecture n'est **pas une direction** : c'est
une palette avec des prétentions.

---

## Ajouter une palette

Vingt-cinq lignes, seize rôles de couleur, rien d'autre.

```css
@layer palette {
  :root {
    --palette-name: 'Nom lisible';
    --palette-slug: 'nom-slug';
    /* … les seize rôles … */
  }
}
```

Puis :

```bash
node _tools/check-contrast.js nom-slug
```

Seize paires à 4.5:1 minimum. Une palette qui ne passe pas n'entre pas.

**Si tu as besoin d'une police, d'un rayon, d'une ombre ou d'une durée**, ce que tu
écris est une direction artistique. Va voir la section au-dessus.

---

## Nommer

En français pour les directions et les palettes, en anglais technique pour les
dossiers de variantes (`NN-descriptif`, kebab-case, sans accent).

Le nom décrit la **logique**, pas l'humeur. `presse-imprimee` dit ce que la
direction fait ; `elegant-moderne` ne dit rien et deux personnes le comprendraient
différemment.

---

## Ce qu'on ne fait pas

- **Du contenu orienté métier.** Lorem ipsum et libellés neutres. Aucun « nos
  chantiers », aucun « prendre rendez-vous ».
- **De la ressource distante.** Aucune. Ni police, ni CDN, ni image.
- **Du framework.** Le dépôt doit rester copiable et ouvrable en double-cliquant.
- **De la variation cosmétique présentée comme une variante.** Changer le bleu en
  vert, 16px en 20px, radius 12 en 16 ne constitue pas une nouvelle direction. Si
  la distance perceptuelle ne bouge pas, rien n'a bougé.
