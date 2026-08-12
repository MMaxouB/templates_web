#!/usr/bin/env bash
#
# new-variant.sh — crée le squelette d'une nouvelle architecture.
#
#   ./_tools/new-variant.sh <famille> <NN-descriptif> [archetype]
#
# Exemple :
#   ./_tools/new-variant.sh 01-vitrine 16-nav-verticale-droite sidebar
#
# Le script ne devine rien : la famille doit exister, la variante ne doit pas.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

FAMILY="${1:-}"
VARIANT="${2:-}"
ARCHETYPE="${3:-a-definir}"

if [[ -z "$FAMILY" || -z "$VARIANT" ]]; then
  echo "usage: $0 <famille> <NN-descriptif> [archetype]" >&2
  echo "familles disponibles :" >&2
  ls "$ROOT/templates" | sed 's/^/  /' >&2
  exit 1
fi

FAMILY_DIR="$ROOT/templates/$FAMILY"
TARGET="$FAMILY_DIR/$VARIANT"

[[ -d "$FAMILY_DIR" ]] || { echo "famille inconnue : $FAMILY" >&2; exit 1; }
[[ -e "$TARGET" ]] && { echo "la variante existe déjà : $TARGET" >&2; exit 1; }

if [[ ! "$VARIANT" =~ ^[0-9]{2}-[a-z0-9-]+$ ]]; then
  echo "nom attendu : NN-descriptif en kebab-case (ex. 07-grille-bento)" >&2
  exit 1
fi

# Pages livrées par famille — voir README.md, section « Ce que contient une variante ».
case "$FAMILY" in
  01-vitrine)   PAGES=(index.html page.html contact.html) ;;
  02-boutique)  PAGES=(index.html listing.html produit.html) ;;
  03-portfolio) PAGES=(index.html projet.html contact.html) ;;
  04-blog)      PAGES=(index.html article.html categorie.html) ;;
  05-landing)   PAGES=(index.html merci.html) ;;
  06-app)       PAGES=(index.html detail.html reglages.html) ;;
  07-doc)       PAGES=(index.html article.html recherche.html) ;;
  08-evenement) PAGES=(index.html programme.html inscription.html) ;;
  09-annuaire)  PAGES=(index.html fiche.html carte.html) ;;
  10-profil)    PAGES=(index.html page.html) ;;
  11-media)     PAGES=(index.html lecture.html) ;;
  12-systeme)   PAGES=(index.html) ;;
  *)            PAGES=(index.html) ;;
esac

NUM="${VARIANT%%-*}"
LABEL="${FAMILY#*-}"

mkdir -p "$TARGET/assets/css" "$TARGET/assets/js" "$TARGET/assets/img"
touch "$TARGET/assets/img/.gitkeep"

for PAGE in "${PAGES[@]}"; do
  TITLE="${PAGE%.html}"
  cat > "$TARGET/$PAGE" <<HTML
<!doctype html>
<html lang="fr" class="is-authoring">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lorem ipsum — $TITLE</title>
  <meta name="description" content="Lorem ipsum dolor sit amet.">

  <!-- Ordre imposé : reset → tokens → thème → layout.
       _tools/build.js réécrit les trois premiers en assets/css/. -->
  <link rel="stylesheet" href="../../../_core/reset.css">
  <link rel="stylesheet" href="../../../_core/tokens.css">
  <link rel="stylesheet" href="../../../_core/themes/modern-light.css" data-theme-link>
  <link rel="stylesheet" href="assets/css/layout.css">
</head>
<body>

<a class="skip" href="#contenu">Aller au contenu</a>

<!-- TODO : $VARIANT — archétype $ARCHETYPE.
     Rappel : lorem ipsum et libellés neutres uniquement, aucune couleur en dur,
     et href="#" data-stub pour les pages non livrées. -->

<main id="contenu">
  <h1>Lorem ipsum</h1>
</main>

<script src="assets/js/main.js"></script>
</body>
</html>
HTML
done

cat > "$TARGET/assets/css/layout.css" <<CSS
/* ==========================================================================
   $FAMILY/$VARIANT — layout
   Archétype : $ARCHETYPE
   Aucune couleur en dur. Uniquement des var(--…) déclarées dans _core/tokens.css.
   ========================================================================== */
CSS

cat > "$TARGET/assets/js/main.js" <<'JS'
(() => {
  'use strict';

  // Les liens vers une page non livrée ne doivent pas faire sauter la page.
  document.querySelectorAll('a[data-stub]').forEach((a) => {
    a.addEventListener('click', (e) => e.preventDefault());
  });
})();
JS

PAGES_JSON=$(printf '"%s", ' "${PAGES[@]}"); PAGES_JSON="[${PAGES_JSON%, }]"

cat > "$TARGET/meta.json" <<JSON
{
  "famille": "$FAMILY",
  "numero": "$NUM",
  "variante": "$VARIANT",
  "archetype": "$ARCHETYPE",
  "pages": $PAGES_JSON,
  "themes_valides": [],
  "statut": "en-cours"
}
JSON

cat > "$TARGET/README.md" <<MD
# $LABEL/$NUM — $VARIANT

**Forme.** À décrire : type de navigation, organisation de la page, comportement au défilement.

**Archétype.** \`$ARCHETYPE\`

**Pages livrées.** ${PAGES[*]}
Les autres liens de navigation pointent vers \`#\` et portent \`data-stub\`.

**Changer les couleurs.** Rien à modifier ici — remplacer le fichier de thème dans l'en-tête.

**Changer le contenu.** Tout le texte est dans les fichiers \`.html\`. Aucun contenu en JS.
MD

echo "✓ $TARGET"
printf '  %s\n' "${PAGES[@]}" assets/css/layout.css assets/js/main.js meta.json README.md
echo
echo "Prévisualiser :  python3 -m http.server 8000"
echo "Générer :        node _tools/build.js $FAMILY/$VARIANT modern-light"
