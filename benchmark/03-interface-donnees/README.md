# 03 — Interface de données

## Intention

Un outil professionnel, pas un site. Ce qui compte est le nombre de lignes
visibles sans défiler, et la capacité à comparer deux nombres sans les lire.

## Ce qui porte l'identité

**La page ne défile pas.** `block-size: 100svh` sur une grille à quatre rangées :
barre, filtres, zone, état. Seule la zone centrale défile. C'est la différence
structurelle entre une interface et un document — et elle ne s'obtient pas en
changeant des couleurs.

**Aucun titre n'est plus gros que le corps.** `h1` à `h6` sont ramenés à
`var(--text-base)`. La hiérarchie vient des filets, des fonds de ligne alternés
et des en-têtes collants : c'est le système `rule-driven`. Un outil dont les
titres font 32 px gaspille de l'écran.

**Chiffres tabulaires partout.** `font-variant-numeric: tabular-nums
slashed-zero`. Deux nombres l'un sous l'autre sont comparables à l'œil.
C'est le détail qui sépare une vraie interface de données de son imitation.

**Densité assumée.** Corps à 13 px, `--density: 0.5`, interlignage 1.35. La
sonde relève une densité `information-heavy` réelle, pas déclarée.

**Aucune transition.** `--duration-fast: 0s`. Un outil doit répondre : 200 ms de
fondu à chaque tri, ce sont 200 ms perdues à chaque interaction.

**Le tri et le filtre sont réels.** Ils modifient le DOM et mettent à jour un
compteur. Simuler ces gestes aurait produit une capture correcte et un mensonge.

## Le même contenu, un autre traitement

Les cinq entrées chiffrées sont ici un tableau triable avec jauge en cellule et
ligne de total. Dans la référence 01 elles sont une liste de lecture à points de
conduite ; dans la 02, cinq aplats dont la largeur est la donnée. Même matériau,
trois structures.

## Où changer quoi

| Quoi | Où |
|---|---|
| Densité globale | `_core/directions/console-donnees.css` → `--density`, `--text-base` |
| Hauteur des rangées | `.grille` → `th, td` padding dans la direction |
| Échelle des jauges | `.jauge` → `inline-size` |
| Couleurs sémantiques | `_core/palettes/ardoise-signal.css` |

## Note sur la palette

L'accent est ambre et non bleu. Deux raisons : le bleu 210°–290° est facturé
2 points par `anti-llm.json`, et sur un outil il désigne mal l'urgence. Les
quatre couleurs sémantiques doivent en outre se distinguer **entre elles**, pas
seulement du fond — contrainte propre à la visualisation, que le contrat de
contraste standard ne couvre pas.
