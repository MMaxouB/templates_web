# systeme/16 — style-guide

**Forme.** Page unique, sections empilées, barre d'outils collante en haut.
Ce n'est pas une architecture destinée aux clients : c'est l'outil de validation du dépôt.

**Archétype.** `trois-colonnes`

**Pages livrées.** `index.html`

**À quoi ça sert.** Vérifier qu'un thème tient la route avant de l'appliquer aux 145
architectures. La page affiche toutes les variables déclarées dans `_core/tokens.css` :
couleurs avec leur rapport de contraste réel, échelle typographique, échelle d'espacement,
rayons, ombres, et tous les composants dans leurs différents états.

**Valider un nouveau thème.**

1. Écrire `_core/themes/<slug>.css`
2. Ajouter une `<option>` dans le sélecteur de `index.html`
3. Ouvrir la page, sélectionner le thème
4. Vérifier que **tous les rapports de contraste sont au vert** (AA minimum)
5. Naviguer au clavier : l'anneau de focus doit rester visible partout
6. Vérifier qu'aucun composant ne devient illisible

Si ces six points passent, le thème est bon pour les autres architectures.

**Changer les couleurs.** Rien à modifier ici — c'est le sélecteur de thème qui pilote.

**Changer le contenu.** Sans objet : le contenu de cette page, ce sont les tokens eux-mêmes.
