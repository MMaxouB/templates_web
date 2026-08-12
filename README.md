# Templates Web

Catalogue de formes et d'habillages pour sites web, en HTML/CSS/JS pur,
sans build ni dépendance.

Ce dépôt n'est **pas** un annuaire de métiers. On n'y trouve pas « un site de plombier »
ou « un site de restaurant ». On y trouve des **formes** : des façons d'organiser une page,
de placer une navigation, de faire défiler du contenu — et des **habillages** qui s'appliquent
par-dessus.

Le principe d'usage est simple : on montre le catalogue à un client, il choisit
**une architecture** et **un habillage**. L'adaptation à son activité vient après, à la livraison.

Mais le problème central du dépôt n'est pas de produire beaucoup de combinaisons.
C'est d'éviter qu'elles se ressemblent toutes.

---

## Le problème que ce catalogue traite

Un catalogue de cent quarante-cinq architectures ne vaut que si un observateur
qui en regarde vingt côte à côte ne peut pas dire « ils sortent tous du même
moule ». C'est le seul critère de réussite qui compte, et c'est un critère
visuel, pas documentaire.

Les interfaces produites par un modèle de langage partagent des réflexes très
reconnaissables : pile de polices système, hero centré, barre horizontale,
arrondis généreux, ombres douces, accent bleu ou violet, boutons pilule,
trois cartes de fonctionnalités, séquence *hero → features → preuve → CTA*.
Aucun de ces choix n'est mauvais. Tous ensemble, répétés cent fois, ils
constituent une signature.

**Ce dépôt en a été atteint.** Le lot 1 — seize pages système, trois thèmes
délibérément opposés, quarante-huit livrables — a été mesuré :

| Mesure | Résultat |
|---|---|
| Composition sur axe central | **82 %** des rendus |
| `typography.voice` = pile système | **100 %** des variantes |
| `surface` = aplat numérique | **100 %** |
| `typography.system` = hiérarchie par la taille | **94 %** |
| `geometry` = arrondi doux | **88 %** |
| Sous-titre gris sous le titre | **94 %** |
| Hero centré | **75 %** |
| Budget anti-réflexes moyen | **7,8** pour un plafond de 6 |
| Paires d'ADN en collision | **34** sur 120 |

Ces chiffres sortent de `node _tools/dna-report.js`, `node _tools/check-constraints.js`
et `node _tools/perceptual-diff.js`. Ils sont reproductibles.

**La démonstration la plus nette.** La page de tarifs, rendue sous `modern-light`
puis sous `neo-brutalism` — deux thèmes choisis pour être aussi opposés que
possible — donne deux images superposables : même axe, même rythme, mêmes
positions, même hiérarchie. Seule la peinture a changé. C'est exactement le
reproche qu'on cherche à éviter, produit par le dépôt lui-même.

**Le diagnostic.** Ce n'était pas un défaut d'exécution mais un défaut de
modèle. Dans `architecture × thème`, un thème ne peut redéfinir que des
variables : couleurs, polices, rayons, ombres, durées. La **composition**, elle,
vit dans le `layout.css` de l'architecture, hors de sa portée. Le catalogue
annonçait 145 × 333 combinaisons et ne contenait que **145 compositions** —
elles-mêmes écrites d'affilée par le même modèle, avec les mêmes réflexes.

Pire : le contrat de tokens, qui est la réussite technique du dépôt, était aussi
la cause principale de l'uniformité. Un vocabulaire de variables partagé est un
*système de design*, et un système de design partagé fait justement ressembler
cent quarante-cinq objets à un seul.

---

## Le principe

**Trois couches indépendantes**, et non plus deux.

| Couche | Décide | Poids | Fichier |
|---|---|---|---|
| **Structure** | composition, densité, navigation, interaction — le DOM et sa mise en page | l'essentiel | `templates/<famille>/<variante>/` |
| **Direction artistique** | système typographique, géométrie, matière, traitement des médias, forme des contrôles, focus, filets, mouvement | fort | `_core/directions/<slug>.css` |
| **Palette** | les seize rôles de couleur, et rien d'autre | faible | `_core/palettes/<slug>.css` |

```
STRUCTURE (forme)          ×  DIRECTION (matière)   ×  PALETTE (couleur)
vitrine/03-sidebar-fixe    ×  presse-imprimee       ×  encre-journal
vitrine/03-sidebar-fixe    ×  terminal-phosphore    ×  phosphore-vert
boutique/05-masonry        ×  presse-imprimee       ×  jaune-corail
```

Un **préréglage** (`_core/presets.json`) associe une direction et une palette sous
un nom unique : c'est ce qu'on montre en rendez-vous. Le client choisit « une
architecture et un habillage » ; le découpage interne ne le concerne pas.

**Pourquoi cette couche du milieu.** Une palette ne peut que repeindre. Une
direction artistique peut changer la forme : supprimer tous les arrondis,
remplacer l'ombre par un décalage plein, faire porter la hiérarchie par des
filets plutôt que par la taille, poser un grain de papier sur les 145
architectures d'un coup. C'est la couche qui manquait.

**Ce qu'elle ne peut toujours pas faire, et c'est important.** Une direction ne
déplace pas les blocs. Un hero centré reste centré ; trois colonnes égales
restent trois colonnes égales. La diversité de **composition** ne peut venir que
de la structure — donc du moment où on écrit la variante. D'où tout ce qui suit :
un vocabulaire pour décrire les choix (l'ADN), des contraintes qui interdisent
les réflexes, une mémoire de ce que le catalogue contient déjà, et une
vérification sur les pixels plutôt que sur les intentions.

Le HTML d'une architecture existe toujours **une seule fois**. Ajouter une
palette reste un fichier de vingt-cinq lignes disponible partout.

Le catalogue s'explore par **deux entrées** :

- **par finalité** — « c'est une vitrine », « c'est une boutique » → [catalogue A](#catalogue-a--les-architectures)
- **par forme** — « je veux une colonne à gauche », « je veux du plein écran »
  → [index transversal](#index-transversal--par-archétype)

---

## Sommaire

**Le système de diversité**

- [Le problème que ce catalogue traite](#le-problème-que-ce-catalogue-traite)
- [Le principe](#le-principe) — les trois couches
- [Design DNA](#design-dna) — les neuf axes
- [Contraintes créatives](#contraintes-créatives)
- [Règles anti-LLM](#règles-anti-llm) — un budget, pas une interdiction
- [Typographie sans ressource externe](#typographie-sans-ressource-externe)
- [Philosophies de mouvement](#philosophies-de-mouvement)
- [Mémoire de diversité et détection de collision](#mémoire-de-diversité-et-détection-de-collision)
- [Le test visuel](#le-test-visuel)
- [Processus de création d'une variante](#processus-de-création-dune-variante)

**Le dépôt**

- [Ce que contient une variante](#ce-que-contient-une-variante)
- [Décisions techniques](#décisions-techniques)
- [Arborescence](#arborescence)
- [Design tokens](#design-tokens)
- [Utilisation](#utilisation)

**Les catalogues**

- [Catalogue A — les architectures](#catalogue-a--les-architectures) — 145 variantes en 12 familles
- [Index transversal — par archétype](#index-transversal--par-archétype) — 31 archétypes
- [Catalogue B — directions, palettes et capacités](#catalogue-b--directions-palettes-et-capacités)

**La production**

- [Diversity Benchmark](#diversity-benchmark)
- [Feuille de route](#feuille-de-route)
- [Checklist qualité](#checklist-qualité)
- [État d'avancement](#état-davancement)

---

## Design DNA

Chaque variante déclare son identité visuelle sur **neuf axes indépendants**, dans
son `meta.json`. Le vocabulaire complet — valeurs autorisées, conséquence exigée
de chacune — est dans [`_core/dna/schema.json`](_core/dna/schema.json).

C'est ce vocabulaire qui rend la ressemblance **calculable**. Sans lui, « ces deux
variantes se ressemblent » est une opinion ; avec lui, c'est une distance.

| Axe | Poids | Ce qu'il décide | Valeurs |
|---|---:|---|---:|
| `composition` | 3 | où les choses sont posées, comment la page se divise | 15 |
| `density` | 2.5 | quantité d'information par écran | 7 |
| `typography` | 2.5 | ce qui porte la hiérarchie (`system`) + le caractère des familles (`voice`) | 8 × 18 |
| `geometry` | 2 | ce qui délimite, découpe, ou n'a pas de bord | 11 |
| `surface` | 1.5 | de quoi les choses ont l'air d'être faites | 11 |
| `navigation` | 1.5 | comment on se déplace | 16 |
| `media` | 1.5 | traitement des visuels | 15 |
| `motion` | 0.5 | philosophie du mouvement | 15 |
| `interaction` | 0.5 | comment le contenu se révèle | 12 |

Le **poids** est perceptuel : il pondère la distance entre deux variantes. Deux axes
invisibles sur une capture — `motion`, `interaction` — pèsent peu, parce que le
premier jugement d'un client se fait sur une planche-contact.

```json
{
  "dna": {
    "composition": "asymmetric-weighted",
    "density": "dense",
    "typography": { "system": "rule-driven", "voice": "transitional-serif" },
    "geometry": "linear-rules",
    "surface": "newsprint",
    "navigation": "marginal-notes",
    "media": "halftone",
    "motion": "none",
    "interaction": "static-all-visible"
  },
  "habillage_reference": "quotidien",
  "creativeConstraints": ["no-cards", "no-shadow", "editorial", "dense"],
  "justifications": {}
}
```

**Trois règles de rédaction.**

1. **Une valeur n'est pas une étiquette, c'est un engagement.** Le schéma associe à
   chaque valeur une `consequence` — ce qui doit réellement changer dans le code.
   `density: "dense"` n'est pas « du padding plus petit », c'est 46 à 80 éléments
   dans le premier écran, mesuré. En revue, on vérifie la conséquence, pas le mot.

2. **L'ADN décrit la variante rendue avec son `habillage_reference`.** Quatre axes
   — typographie, géométrie, surface, mouvement — sont partagés avec la direction
   artistique. Hors habillage, ils ne veulent rien dire.

3. **Les valeurs marquées `reflexe: true` sont les défauts des interfaces générées**
   (`centered-axial`, `soft-rounded`, `top-bar`, `ui-native`, `flat-paint`,
   `size-driven`, `balanced`, `full-bleed`, `fade-up`). Elles ne sont pas
   interdites : elles sont facturées. Voir [Règles anti-LLM](#règles-anti-llm).

---

## Contraintes créatives

Un modèle de langage produit du design générique parce qu'il optimise vers
l'interface contemporaine la plus probable. La seule façon fiable de l'en sortir
est de lui retirer des options.

Chaque variante porte **au moins deux contraintes**, dont **au moins une
structurelle**. Elles sont déclarées dans `meta.json` et **vérifiées par un
outil** — ce ne sont pas des intentions.

```bash
node _tools/check-constraints.js
```

Le catalogue complet est dans [`_core/dna/constraints.json`](_core/dna/constraints.json).

| Contrainte | Groupe | Règle | Vérification |
|---|---|---|---|
| `no-cards` | structurelle | Aucun contenu enfermé dans une surface arrondie et ombrée | CSS + revue |
| `no-hero` | structurelle | La page commence par du contenu réel | ≥ 6 éléments au premier écran |
| `asymmetry` | structurelle | Aucun axe de symétrie | score de symétrie ≤ 0.72 |
| `dense` | structurelle | Densité forte sans perte de lisibilité | ≥ 46 éléments, encre ≥ 22 % |
| `empty` | structurelle | Le vide est structurel, pas de la marge | encre ≤ 8 %, ≤ 5 éléments |
| `data-first` | structurelle | L'information est traitée comme une donnée | `tabular-nums` + densité |
| `controlled-chaos` | structurelle | Irrégularité obéissant à une règle interne **écrite** | symétrie ≤ 0.6 + revue |
| `no-standard-cta` | structurelle | L'action principale n'est pas un bouton plein arrondi | CSS + revue |
| `no-centered-text` | structurelle | `text-align: center` interdit | CSS |
| `no-viewport-sections` | structurelle | Aucun bloc à `100vh` | CSS |
| `typography-first` | expressive | La typographie est le visuel | aucune image, ratio ≥ 8:1 |
| `single-type-size` | expressive | Une seule taille de texte | ≤ 2 tailles distinctes |
| `editorial` | expressive | Penser publication imprimée | `column-*`/`orphans`/`widows` + revue |
| `raw-web` | expressive | Assumer les conventions du Web historique | revue |
| `visible-grid` | expressive | La grille est dessinée, pas seulement respectée | revue |
| `justified` | expressive | Justification et césures, comme un livre | `text-align: justify` + `hyphens` |
| `no-sans-serif` | expressive | Ni linéale ni pile système | CSS |
| `no-gradient` | matérielle | Aucun dégradé décoratif (les trames restent permises) | CSS |
| `no-shadow` | matérielle | Ni `box-shadow`, ni `drop-shadow` | CSS |
| `no-rounded` | matérielle | `border-radius: 0`, sauf cercle véritable | CSS |
| `monochrome` | matérielle | Une seule teinte, déclinée en valeurs | ≤ 1 teinte mesurée |
| `physical` | matérielle | Faire sentir une matière, en CSS/SVG seuls | trame CSS + revue |
| `no-images` | matérielle | Aucun média décoratif | HTML |
| `no-animation` | matérielle | Zéro transition, zéro animation | CSS |
| `no-js` | technique | Menus, onglets, accordéons en HTML/CSS | revue |

> **Le piège à éviter.** Retirer l'ombre en gardant le fond et l'arrondi produit une
> carte pâle, pas une absence de carte. Une contrainte se satisfait par une
> décision de conception, jamais par un contournement cosmétique. C'est pour ça
> que la moitié des vérifications portent sur des **mesures de la page rendue**
> et non sur le CSS.

---

## Règles anti-LLM

Les réflexes ci-dessous **ne sont pas interdits**. Ils sont **facturés**.

Chaque variante dispose d'un budget de **6 points**. Le dépassement exige une
justification écrite dans `meta.json.justifications`, nommant la direction
artistique que le réflexe sert.

**Pourquoi un budget et non une interdiction.** Une interdiction produit de
l'évitement mécanique : on remplace le bleu par du vert, le radius 12 par 16, et
le problème reste entier. Un budget force un arbitrage. Si une variante dépense
4 points dans un hero centré, il ne lui reste plus de quoi payer les cartes
arrondies *et* les ombres douces *et* l'accent bleu. Elle devient différente par
construction.

Table complète : [`_core/dna/anti-llm.json`](_core/dna/anti-llm.json).

| Coût | Réflexe |
|---:|---|
| 5 | `Inter` · `Manrope` · `Geist` · `DM Sans` · `Space Grotesk` · `Poppins` · `Satoshi` · `Outfit`… |
| 4 | Hero centré : grand titre + accroche + un ou deux boutons |
| 4 | Séquence *hero → fonctionnalités → preuve sociale → tarifs → FAQ → CTA → pied de page* |
| 3 | `opacity: 0` + `translateY` révélé au défilement, section par section |
| 3 | `backdrop-filter: blur()` sans que le verre soit la direction |
| 3 | Trois ou quatre cartes de fonctionnalités identiques |
| 3 | Trois colonnes de tarifs avec celle du milieu mise en avant |
| 2 | Accent principal entre 210° et 290° (bleu/violet) |
| 2 | `border-radius` ≥ 8px sur des éléments non circulaires |
| 2 | Boutons pilule |
| 2 | Ombre diffuse à flou large et faible opacité |
| 2 | Dégradé décoratif |
| 2 | Badge posé au-dessus du titre |
| 2 | Barre horizontale logo-à-gauche / liens-à-droite |
| 2 | Témoignages en cartes avec portrait rond |
| 2 | Pied de page à quatre colonnes ou plus |
| 2 | Grille bento employée parce qu'elle est à la mode |
| 2 | Première section à `min-height: 100vh` |
| 2 | Grille parfaitement régulière, aucune exception |
| 1 | Sous-titre gris sous le titre · FAQ en accordéon · emoji en guise d'icônes · logos clients · deux CTA côte à côte |

Certains réflexes sont **gratuits quand ils servent la direction déclarée** : le
`backdrop-filter` ne coûte rien si `surface: glass`, le dégradé rien si
`surface: metal`, l'arrondi rien si `geometry: soft-rounded`. C'est le champ
`gratuit_si` du fichier.

**Le témoin.** La direction `moderne-neutre` (ex-`modern-light`) coûte 4 points à
vide. Elle est conservée volontairement : c'est le point de comparaison, et
certains clients la demandent littéralement. Une variante montée dessus n'a
presque plus de budget — c'est le comportement voulu.

---

## Typographie sans ressource externe

La typographie est la signature visuelle la plus reconnaissable, et le dépôt
s'interdit toute ressource distante. La contrainte tient : **on ne cherche pas
une police différente partout, on cherche des systèmes typographiques
différents.**

**Ce qui fait un système, dans l'ordre d'importance :**

1. **Ce qui porte la hiérarchie** — la taille ? la graisse ? la casse ?
   l'interlettrage ? un filet ? le contraste de familles ? rien du tout ?
2. **Le nombre de niveaux réellement employés** — deux tailles ou neuf.
3. **L'amplitude de l'échelle** — un rapport de 1.06 entre le plus petit et le
   plus grand corps donne un terminal ; un rapport de 34, une affiche.
4. **L'alignement** — au fer à gauche, justifié, centré, mélangé.
5. **La mesure** — 34 caractères de presse, 65 de lecture, 80 de terminal.
6. **La politique de casse et d'interlettrage.**
7. **La famille** — en dernier.

Deux pages composées dans la même Georgia appartiennent à deux univers si l'une
emploie neuf corps au fer à gauche sur 65 caractères et l'autre deux corps
justifiés sur trois colonnes de 34.

**Les piles disponibles.** Chacune doit dégrader vers un caractère **voisin**,
jamais vers `system-ui` — un repli neutre annule le travail. Les piles complètes
sont dans `_core/dna/schema.json` → `typography.voice`.

| Voix | Pile | Repli |
|---|---|---|
| `transitional-serif` | Georgia, Liberation Serif, Times New Roman | serif |
| `oldstyle-serif` | Palatino, URW Palladio, Book Antiqua | Georgia |
| `didone` | Didot, Bodoni MT | Times |
| `slab` | Rockwell, Bookman Old Style, URW Bookman | Courier |
| `humanist-sans` | Trebuchet MS, Lucida Grande, Verdana | DejaVu Sans |
| `neo-grotesque` | Helvetica, Arial, Liberation Sans | sans-serif |
| `geometric-sans` | Futura, Century Gothic, URW Gothic | Avant Garde |
| `condensed` | Arial Narrow, Liberation Sans Narrow | Impact |
| `poster-heavy` | Impact, Haettenschweiler, Arial Black | Franklin Gothic Heavy |
| `typewriter-mono` | Courier New, Nimbus Mono | monospace |
| `system-mono` | ui-monospace, Menlo, Consolas | DejaVu Sans Mono |
| `rounded` | **`ui-rounded`**, Varela Round | Trebuchet MS |
| `engraved` | Copperplate, Optima | Palatino |
| `casual` | Comic Sans MS, Chalkboard SE, Segoe Print | cursive |
| `ui-native` | system-ui, Segoe UI, Roboto | *— le réflexe, facturé* |

**Les leviers sous-employés**, qui coûtent zéro octet et changent tout :
`font-stretch` · `font-variation-settings` sur les polices variables présentes ·
`font-variant-numeric` (`tabular-nums`, `oldstyle-nums`) · `font-variant-caps`
(`small-caps`) · `letter-spacing` de −0.05em à 0.5em · `word-spacing` ·
`text-transform` · `initial-letter` pour les lettrines · `hanging-punctuation` ·
`text-wrap: balance | pretty` · `hyphens` + `orphans` + `widows` ·
`text-underline-offset` · `writing-mode: vertical-rl`.

Les rôles typographiques sont au nombre de quatre — `--font-title`, `--font-lead`,
`--font-meta`, `--font-ui` — et non plus trois. Le trio display/body/mono ne
savait pas décrire un système à familles opposées.

---

## Philosophies de mouvement

Même problème que la typographie : sans consigne, tout tombe dans
`opacity: 0` + `translateY(20px)` puis `transition: all .6s ease`.

Une variante déclare `motion` dans son ADN et la direction pose
`--motion-model`. Quinze philosophies, dont `none` — **une direction sans
mouvement vaut souvent mieux qu'une direction avec.**

| Philosophie | Ce que ça implique |
|---|---|
| `none` | Zéro transition, zéro animation. Choix positif, pas un oubli. |
| `instant` | Les états basculent net, `0s` explicite. |
| `discreet` | ≤ 120 ms, uniquement sur les états interactifs. |
| `mechanical` | `steps()`, aucune inertie, rythme d'horloge. |
| `elastic` | Courbes à dépassement, déformation. |
| `physical` | Masse et inertie : les objets lourds bougent lentement. |
| `brutal-cut` | Des coupes, jamais des fondus. |
| `sequential` | Décalage calculé par index, ordre lisible. |
| `continuous-loop` | Quelque chose bouge en permanence, sans déclencheur. |
| `scroll-driven` | `animation-timeline: scroll()`. Rien ne bouge sans défilement. |
| `cursor-driven` | Le pointeur pilote un paramètre continu. |
| `hover-only` | Aucune animation au chargement ni au défilement. |
| `directional` | Entrées et sorties cohérentes avec la navigation. |
| `kinetic-type` | C'est le texte qui bouge, pas des conteneurs. |
| `fade-up` | *Le réflexe. Facturé 3 points.* |

`prefers-reduced-motion` est traité **globalement** dans `_core/tokens.css` et
s'applique à toutes les philosophies, y compris celles pilotées par le
défilement. Ce n'est pas à la charge des variantes.

---

## Mémoire de diversité et détection de collision

**Une variante ne se conçoit jamais isolément.** Cent quarante-cinq générations
indépendantes du même modèle convergent vers le même design. Le catalogue doit
se comporter comme un écosystème : chaque nouvelle variante connaît les
précédentes et va délibérément ailleurs.

```bash
node _tools/dna-report.js               # rapport complet
node _tools/dna-report.js --couverture  # quels axes sont sous-employés
node _tools/dna-report.js --collisions  # les variantes trop proches
node _tools/dna-report.js --suggere     # quoi construire ensuite
```

### La distance ADN

Distance de Hamming pondérée par les poids perceptuels, normalisée entre 0 et 1.

| Distance | Lecture |
|---|---|
| < 0.30 | **collision** — les deux variantes disent presque la même chose |
| 0.30 – 0.45 | à risque |
| ≥ 0.60 | sain |
| ≥ 0.45 | **minimum entre deux variantes de même archétype** |

Cette dernière règle est la plus utile. L'index transversal contient onze
écrans coupés en deux, dix grilles uniformes, neuf pleins écrans. Ils ne
deviennent pas onze photocopies **si et seulement si** ils se distinguent
ailleurs : sur au moins quatre autres axes, dont un lourd.

### Le rapport de couverture

Pour chaque axe : quelles valeurs sont employées, combien de fois, lesquelles ne
l'ont jamais été. Toute valeur qui dépasse **40 %** du catalogue est signalée
comme un réflexe. `--suggere` propose des combinaisons faites uniquement de
valeurs jamais employées — s'en éloigner devient mécanique.

### Les deux canaux

Un `meta.json` peut mentir. Deux variantes peuvent déclarer des ADN opposés et
rendre deux images superposables — c'est le mode d'échec principal d'un
catalogue généré : *la diversité existe dans les métadonnées et pas à l'écran.*

- **`dna-report.js`** dit ce qu'on a **voulu** faire.
- **`perceptual-diff.js`** dit ce qu'on a **fait**.

Le cas intéressant n'est pas qu'elles soient basses toutes les deux, c'est
qu'elles **divergent** : ADN lointain et pixels proches, la variante ment.

> Cross-validation sur le lot 1 : `systeme/14` et `systeme/15` ressortent à
> 0.129 en distance ADN et **0.112 en distance perceptuelle — la paire la plus
> proche des deux classements**. Les deux canaux tombent d'accord sans se
> connaître, ce qui est le meilleur signe que la mesure est juste.

---

## Le test visuel

**La capture est une source de vérité plus fiable que le README.**

```bash
node _tools/screenshot.js               # captures + mesures de structure
node _tools/perceptual-diff.js          # comparaison des rendus
```

`screenshot.js` pilote Chromium en mode *headless* — aucune dépendance npm, aucun
navigateur à installer via un gestionnaire de paquets — et produit pour chaque
livrable des captures en 1280 / 768 / 375 px plus un `probe.json` : nombre
d'éléments au premier écran, tailles de texte distinctes, amplitude de l'échelle,
et la détection des réflexes structurels (hero centré, barre standard, cartes
égales, badge, double CTA, colonnes de pied de page).

`perceptual-diff.js` embarque un décodeur PNG (~60 lignes, `zlib` de Node) et
calcule six signatures :

| Signature | Ce qu'elle attrape |
|---|---|
| **empreinte** 16×16 | la silhouette générale |
| **symétrie** | ressemblance de la moitié gauche au miroir de la droite → *le centrage systématique* |
| **encre** | part de surface marquée → *la densité réelle* |
| **profil vertical** | rythme des bandes → *« même rythme vertical »* |
| **profil horizontal** | structure en colonnes → *« mêmes proportions »* |
| **teintes** | nombre de teintes distinctes et dominante |

**Le point décisif : toutes les comparaisons de structure sont calculées sur une
carte de marquage** — l'écart de chaque case au fond de la page — et non sur la
luminance brute. Un hash de luminance juge qu'une page sombre et une page claire
sont très différentes, alors que c'est peut-être exactement la même mise en page
repeinte. C'est précisément ce cas qu'il faut attraper : *deux templates peuvent
avoir des couleurs différentes et rester similaires à 90 %.* En mesurant le
marquage, la comparaison devient **invariante à la palette** : seule la structure
survit.

L'outil sépare deux populations, qui ne veulent pas dire la même chose :

- **Même architecture, habillages différents** — on *attend* qu'elles soient
  proches. Leur distance mesure l'**amplitude de la couche d'habillage**. Si la
  médiane est faible, changer de direction ne change presque rien.
- **Architectures différentes** — une distance faible est une **vraie collision**.
  Seuil : **0.20**, calibré sur le lot 1 où la médiane inter-architectures est de
  0.374 et où toutes les paires sous 0.20 se sont révélées être, à l'œil, de
  véritables ressemblances.

Verdict d'une collision : **REJECT AND REDESIGN**, pas un changement de couleur.

---

## Processus de création d'une variante

**Le code vient après la direction artistique.** On n'écrit pas le HTML en premier.

```
INTENTION VISUELLE          en trois lignes, dans le README de la variante
        ↓
CONSULTATION DU CATALOGUE   node _tools/dna-report.js --couverture --suggere
        ↓
CHOIX DES NEUF AXES         en évitant délibérément les valeurs surreprésentées
        ↓
CONTRAINTES CRÉATIVES       ≥ 2, dont ≥ 1 structurelle
        ↓
COMPOSITION → TYPOGRAPHIE → DENSITÉ → NAVIGATION → GÉOMÉTRIE
→ SURFACE → MÉDIA → INTERACTION → MOUVEMENT
        ↓
HTML  →  CSS  →  JS
        ↓
VÉRIFICATION                contraintes · responsive · accessibilité
        ↓
CAPTURE ET COMPARAISON      screenshot.js puis perceptual-diff.js
        ↓
si trop proche  →  REJECT AND REDESIGN
```

En dix étapes opposables :

| | Étape | Outil |
|---|---|---|
| A | Écrire l'intention visuelle en trois lignes | — |
| B | Lire ce que le catalogue contient déjà | `dna-report.js --couverture` |
| C | Identifier les valeurs surreprésentées | `dna-report.js --collisions` |
| D | Choisir des axes délibérément sous-employés | `dna-report.js --suggere` |
| E | Attribuer les contraintes créatives | `_core/dna/constraints.json` |
| F | Construire — direction artistique d'abord, code ensuite | — |
| G | Vérifier contraintes, budget et hygiène | `check-constraints.js` |
| H | Vérifier responsive 320/768/1280/1920 et accessibilité | `screenshot.js` |
| I | Comparer aux variantes existantes | `perceptual-diff.js` |
| J | Si trop similaire : **redessiner**, pas recolorier | — |

**Quand on hésite** entre « ce design est familier et probablement correct » et
« ce design est inhabituel mais possède une logique claire », choisir le second.
Le catalogue n'a pas besoin de 145 variantes raisonnables. Il a besoin de 145
réponses différentes au problème de concevoir une interface.

**Mais pas de bizarrerie gratuite.** L'objectif n'est pas « faire étrange pour
être différent », c'est « obéir à des logiques différentes ». Un template
minimaliste doit être minimaliste avec discipline ; un brutaliste, cohérent ; un
éditorial doit fonctionner comme une publication ; un template de données doit
fonctionner comme un outil ; un rétro doit respecter les conventions de son
époque. La diversité doit être **sémantique et structurelle**, jamais décorative.
C'est à cela que sert le champ `consequence` du schéma : il empêche une variante
d'être excentrique sans être cohérente.

---

## Ce que contient une variante

Chaque architecture est livrée avec **la page principale et deux ou trois pages qui comptent
vraiment** — celles où la structure change réellement. Une boutique a une page de listing
et une fiche ; un blog a un article ; une documentation a une page d'article et une recherche.

Les pages sans intérêt structurel — à propos, mentions légales, conditions générales —
**apparaissent bien dans la navigation et dans les liens**, pour que l'architecture se lise
en entier, mais **ne sont pas développées**. Elles seront créées à la demande, au cas par cas.

**Convention :** un lien vers une page non livrée pointe vers `#` et porte l'attribut
`data-stub`. Un seul sélecteur CSS permet de les repérer d'un coup lors de l'adaptation :

```css
/* aide au développement — à retirer avant livraison */
[data-stub] { outline: 1px dashed currentColor; outline-offset: 2px; }
```

> Si tu présentes le catalogue en direct à un client, un lien mort peut passer pour un bug.
> Une page `_core/stub.html` partagée et thémée — « cette page sera créée sur mesure » —
> règle le problème et se branche en changeant `#` par son chemin. À voir au moment
> de la première démo client.

---

## Décisions techniques

| Sujet | Décision |
|---|---|
| **Stack** | HTML / CSS / JS natif. Zéro build, zéro `node_modules`, zéro framework. Un template s'ouvre en double-cliquant sur `index.html`. |
| **Habillage** | 100 % en CSS custom properties, en **deux couches** : une palette (`_core/palettes/`) et une direction artistique (`_core/directions/`). Un préréglage associe les deux. |
| **Portée d'une palette** | Les seize rôles de couleur, **et rien d'autre**. |
| **Portée d'une direction** | Système typographique, géométrie, matière, médias, contrôles, focus, filets, densité, mouvement. Peut reprendre la main sur la structure via `@layer overrides`. |
| **Cascade** | Couches explicites : `reset → base → palette → direction → structure → overrides`, déclarées dans `_core/tokens.css`. |
| **Diversité** | Vérifiable, pas déclarative : ADN en neuf axes, contraintes créatives testées, budget anti-réflexes, comparaison des rendus. |
| **Contenu** | Lorem ipsum et libellés neutres. Aucune mention de secteur, de métier ou d'activité. |
| **Visuels** | Blocs SVG neutres et dégradés CSS. Aucune image bitmap, aucune ressource distante, aucun CDN. |
| **Livraison** | Le HTML d'une architecture est unique ; `_tools/build.js` génère les dossiers autonomes dans `dist/`. |
| **Nommage** | `NN-descriptif` en anglais technique, `kebab-case`, sans accent. Le numéro sert à citer une variante au client (« la 03 »). |
| **Responsive** | Mobile-first obligatoire, testé à 320 / 768 / 1280 / 1920 px. |
| **Accessibilité** | Contraste AA minimum, navigation clavier complète, `prefers-reduced-motion` respecté. |

**Règle d'or :** aucune valeur de couleur en dur en dehors de `_core/palettes/`.
Si le fichier de palette disparaît, la page doit rester lisible en noir et blanc sans casser.

**Deuxième règle :** aucun mot orienté métier dans le contenu de démo. Pas de « nos chantiers »,
pas de « prendre rendez-vous », pas de « nos plats ». Des libellés neutres — « Section »,
« Rubrique », « Action principale » — et du lorem ipsum.

---

## Arborescence

```
templates_web/
├── README.md               # ce fichier
├── BRAINSTORM.md           # document de travail : décisions et pistes écartées
├── CONTRIBUTING.md         # comment ajouter une architecture ou un thème
├── _core/
│   ├── reset.css           # normalisation — @layer reset
│   ├── tokens.css          # contrat de tokens + ordre des couches — @layer base
│   ├── presets.json        # direction + palette sous un nom vendable
│   ├── dna/
│   │   ├── schema.json     # les 9 axes, leurs valeurs, leurs conséquences
│   │   ├── constraints.json# les contraintes créatives et leur vérification
│   │   └── anti-llm.json   # la table des réflexes et leur coût
│   ├── palettes/           # couleurs seules — ~25 lignes par fichier
│   ├── directions/         # forme, matière, typographie
│   ├── themes/             # ⚠ ancien format monolithique — déprécié
│   ├── blocks/             # blocs réutilisables — extraits au fil de la production
│   └── stub.html           # page « à créer sur mesure » (optionnelle)
├── _tools/
│   ├── new-variant.sh      # scaffolding d'une nouvelle architecture      ✅
│   ├── build.js            # génère les dossiers autonomes dans dist/     ✅
│   ├── check-contrast.js   # vérifie le contrat de contraste              ✅
│   ├── dna-report.js       # couverture, collisions, quoi construire      ✅
│   ├── check-constraints.js# contraintes créatives + budget anti-LLM      ✅
│   ├── screenshot.js       # captures multi-viewport + sonde de structure ✅
│   ├── perceptual-diff.js  # comparaison des rendus, invariante palette   ✅
│   ├── new-theme.sh        # scaffolding d'une direction / palette
│   └── build-gallery.js    # génère la galerie
├── benchmark/              # les 12 références opposées — voir Diversity Benchmark
├── previews/               # captures + probe.json (non versionnés)
├── templates/
│   ├── 01-vitrine/
│   │   ├── 01-hero-plein-ecran/
│   │   ├── 02-nav-sticky-compacte/
│   │   ├── 03-sidebar-fixe/
│   │   └── …
│   ├── 02-boutique/
│   ├── 03-portfolio/
│   ├── 04-blog/
│   ├── 05-landing/
│   ├── 06-app/
│   ├── 07-doc/
│   ├── 08-evenement/
│   ├── 09-annuaire/
│   ├── 10-profil/
│   ├── 11-media/
│   └── 12-systeme/
├── gallery/                # galerie filtrable, à deux entrées
└── dist/                   # dossiers autonomes générés (non versionnés)
```

Une variante complète :

```
templates/01-vitrine/03-sidebar-fixe/
├── index.html
├── page.html               # page de contenu type
├── contact.html
├── assets/
│   ├── css/layout.css      # structure — @layer structure, aucune couleur en dur
│   ├── js/main.js
│   └── img/                # SVG neutres uniquement
├── meta.json               # ADN, contraintes, archétype, pages livrées
└── README.md               # intention visuelle, forme, où changer quoi
```

Le `layout.css` d'une variante doit être enveloppé dans `@layer structure` :

```css
@layer structure {
  /* … toute la mise en page … */
}
```

Sans cela, ses règles ne sont pas layerisées, donc prioritaires sur **toutes** les
couches — et aucune direction artistique ne peut plus reprendre la main.
`check-constraints.js` liste les variantes encore non migrées.

---

## Design tokens

C'est le contrat qui permet à n'importe quel habillage de s'appliquer à n'importe
quelle architecture. Toutes les variantes parlent le même vocabulaire de variables.

> **Le contrat de tokens est aussi un risque.** Un vocabulaire de variables partagé
> est un système de design ; et un système de design partagé fait ressembler cent
> quarante-cinq objets à un seul. Les tokens ci-dessous décrivent un système web
> contemporain générique — c'est-à-dire, exactement, le réflexe à combattre. Ils
> restent le socle, parce qu'ils portent les garanties (contraste, focus,
> mouvement réduit) et qu'aucune diversité ne vaut une page illisible. Mais ils ne
> peuvent plus être le **seul** vocabulaire disponible : d'où les tokens expressifs
> ajoutés plus bas.

### Le socle

```css
:root {
  /* Couleurs — des rôles, jamais des noms de couleur */
  --bg;            --bg-elevated;    --bg-sunken;
  --fg;            --fg-muted;       --fg-subtle;
  --accent;        --accent-fg;      --accent-hover;  --accent-text;
  --border;        --border-strong;
  --success;       --warning;        --danger;        --info;

  /* Typographie */
  --font-display;  --font-body;      --font-mono;
  --scale-ratio;                     /* 1.2 discret · 1.333 standard · 1.618 spectaculaire */
  --leading-tight; --leading-normal; --leading-loose;
  --tracking-tight; --tracking-wide;

  /* Formes */
  --radius-sm;     --radius-md;      --radius-lg;     --radius-pill;
  --border-width;

  /* Profondeur */
  --shadow-sm;     --shadow-md;      --shadow-lg;
  --shadow-style;                    /* soft · hard-offset · inner · none */

  /* Espacement */
  --space-unit;                      /* toute l'échelle en dérive */
  --container-max;

  /* Mouvement */
  --ease;          --duration-fast;  --duration-slow;
}
```

### Les tokens expressifs

Ceux-ci existent pour que deux directions produisent des **formes** différentes, et
pas seulement des couleurs différentes. Chacun a un défaut neutre — rien ne casse —
et chacun est censé être redéfini par une direction. Les tokens déclaratifs
(`--*-model`, `--*-style`) servent deux publics : le CSS, qui s'en sert, et les
outils, qui les lisent pour savoir ce que la direction a choisi.

```css
:root {
  /* Densité — agit sur TOUTE l'échelle d'espacement, l'interlignage et la
     mesure. C'est ce qui sépare une vraie densité d'un padding réduit. */
  --density;  --density-leading;  --density-measure;

  /* Rythme — comment les écarts verticaux se succèdent */
  --rhythm;                 /* regular · syncopated · compressed · expanding · interrupted */

  /* Surface — de quoi les choses ont l'air d'être faites.
     Appliqué au <body> : une direction pose un grain de papier ou des lignes
     de balayage sur les 145 architectures en une déclaration. */
  --surface-model;  --surface-texture-image;  --surface-texture-size;
  --surface-texture-blend;

  /* Profondeur — elle n'est pas forcément une ombre */
  --depth-model;            /* flat · shadow · offset · inset · outline · overlap */
  --depth-offset;  --depth-outline;

  /* Filets — souvent le seul élément graphique d'une direction éditoriale */
  --rule-style;   /* déclaratif */   --rule-line;  /* la valeur CSS */
  --rule-width;   --rule-color;      --rule-ornament;

  /* Contrôles — sépare la FORME du bouton de son ARRONDI */
  --control-shape;          /* rect · soft · pill · cut · asymmetric · none */
  --control-fill;           /* solid · outline · underline · ghost · none */
  --control-radius;  --control-cut;  --control-pad-x;  --control-pad-y;
  --control-case;    --control-tracking;

  /* Focus — TOUJOURS visible, mais sa forme appartient à la direction */
  --focus-style;            /* ring · block · invert · underline · bracket */
  --focus-ring;  --focus-offset;  --focus-extra;  --focus-decoration;

  /* Médias */
  --media-model;  --media-filter;  --media-frame;  --media-radius;  --media-ratio;

  /* Décoration */
  --decor-level;            /* 0 aucun → 3 surchargé */   --decor-color;

  /* Système typographique — quatre rôles, pas trois.
     --type-system déclare CE QUI PORTE LA HIÉRARCHIE ; les piles ne sont que
     sa mise en œuvre. */
  --type-system;
  --font-title;  --font-lead;  --font-meta;  --font-ui;
  --case-title;  --case-meta;  --tracking-title;  --tracking-meta;  --weight-title;

  /* Mouvement — la philosophie, pas seulement les durées */
  --motion-model;
}
```

**Ce qu'un habillage a le droit de faire.** Une palette : les couleurs, rien
d'autre. Une direction : tous les tokens hors couleur, des règles sur les
éléments natifs dans `@layer direction`, et le strict nécessaire dans
`@layer overrides`. Une direction qui a besoin de vingt règles d'`overrides`
décrit une structure, pas une direction.

**Ce qu'aucun habillage n'a le droit de faire.** Écrire une couleur en dur,
charger une ressource distante, supprimer l'indicateur de focus (il peut en
changer la forme, jamais l'existence), ignorer `prefers-reduced-motion`.

### Surface ou texte : pourquoi `--accent` et `--accent-text` sont séparés

`--accent` est une **surface** — un fond de bouton, un élément plein. Sa seule obligation
est de contraster avec `--accent-fg`, ce qui se pose dessus.

`--accent-text` est l'accent employé **comme texte** sur le fond de page : liens, libellés,
icônes. Lui doit rester lisible sur `--bg`.

Les deux sont souvent identiques, mais pas toujours. Sur `neo-brutalism`, le corail vif
`#ff5f5f` est parfait en fond de bouton (7:1 avec du noir dessus) et illisible comme texte
sur le jaune (2.25:1). Séparer les deux évite d'avoir à choisir entre l'identité visuelle
et la lisibilité. Ce défaut a été trouvé par le style-guide en produisant le lot 0 — c'est
exactement ce à quoi il sert.

### Contrat de contraste

Un thème doit garantir **4.5:1 minimum** sur seize paires : les trois niveaux de texte sur
les trois fonds, `--accent-text` sur `--bg` et `--bg-elevated`, `--accent-fg` sur `--accent`,
et les quatre couleurs sémantiques sur `--bg`.

Deux façons de le vérifier :

```bash
node _tools/check-contrast.js
```

…et le style-guide, qui mesure les couleurs **réellement rendues** dans le navigateur et
affiche chaque rapport en vert ou en rouge.

**Validation d'une nouvelle palette :** l'appliquer sur `systeme/16-style-guide`.
Tous les rapports au vert, l'indicateur de focus visible partout, aucun composant
illisible.

---

## Utilisation

Créer une nouvelle architecture :

```bash
./_tools/new-variant.sh 01-vitrine 16-nav-verticale-droite
```

Avant d'écrire quoi que ce soit — savoir ce que le catalogue contient déjà :

```bash
node _tools/dna-report.js --couverture --suggere
```

Générer un dossier autonome livrable :

```bash
node _tools/build.js 01-vitrine/03-sidebar-fixe --preset quotidien
```

Ou en composant l'habillage directement :

```bash
node _tools/build.js 01-vitrine/03-sidebar-fixe --direction terminal-phosphore --palette phosphore-vert
```

Générer une architecture dans tous les préréglages d'un coup :

```bash
node _tools/build.js 12-systeme/16-style-guide --all-presets
```

Vérifier le contrat de contraste :

```bash
node _tools/check-contrast.js
```

Vérifier les contraintes créatives et le budget anti-réflexes :

```bash
node _tools/check-constraints.js
```

Capturer les livrables et comparer les rendus :

```bash
node _tools/screenshot.js && node _tools/perceptual-diff.js
```

Prévisualiser en local :

```bash
python3 -m http.server 8000
```

---

# CATALOGUE A — LES ARCHITECTURES

**145 architectures**, réparties en **12 familles**.

Une famille correspond à une **finalité** (présenter, vendre, montrer, publier, convertir…),
jamais à un métier. À l'intérieur, chaque variante est une **structure HTML différente** :
autre barre de navigation, autre organisation de la page, autre comportement au défilement.

Le contenu est en lorem ipsum et les visuels sont des blocs SVG neutres. Rien n'oriente
vers une activité. C'est volontaire : le client choisit une **forme**, pas un secteur.

Chaque ligne porte un **archétype** — le motif de mise en page dominant. Il sert à naviguer
le catalogue par la forme plutôt que par la finalité, via
l'[index transversal](#index-transversal--par-archétype) plus bas.

> **Lecture des tableaux :** `#` = le numéro qu'on cite au client (« la 03 »),
> `Variante` = le nom du dossier, `Archétype` = l'entrée dans l'index transversal.

> ### ⚠ Ces tableaux décrivent une navigation, pas une diversité
>
> Les colonnes « Navigation » et « Organisation » ne décrivent que **deux** des neuf
> axes d'ADN. Deux variantes peuvent y être décrites de façon très différente et
> rendre la même image : c'est ce qui s'est produit au lot 1. La liste ci-dessous
> reste valable comme **plan de production** ; elle n'est pas une preuve de
> variété.
>
> La preuve, ce sont l'ADN déclaré dans chaque `meta.json` et la distance mesurée
> entre les rendus. **Une ligne de ce tableau ne sera considérée comme faite que
> lorsque sa variante passera `check-constraints.js` et ne collisionnera avec
> aucune autre dans `perceptual-diff.js`.**

---

## Famille 01 — Vitrine

Présenter une structure, une offre, une équipe. La famille la plus polyvalente :
c'est elle qui sera adaptée le plus souvent.

**Pages livrées :** `index.html` · `page.html` (page de contenu type) · `contact.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-hero-plein-ecran` | Barre horizontale en haut, logo à gauche, liens à droite | Hero plein écran avec appel à l'action, puis sections empilées pleine largeur | `nav-horizontale` |
| 02 | `02-nav-sticky-compacte` | Barre qui se réduit et se densifie au défilement | Hero court, enchaînement rapide de sections serrées, peu de respiration | `nav-sticky` |
| 03 | `03-sidebar-fixe` | Colonne verticale fixe à gauche, toujours visible | Le contenu défile à droite, les sections occupent toute la hauteur | `sidebar` |
| 04 | `04-one-page-ancres` | Liens à ancres, défilement doux, indicateur de section active | Tout sur une seule page, sections successives, retour en haut permanent | `one-page` |
| 05 | `05-split-screen-fixe` | Intégrée à la moitié fixe | Écran coupé en deux : gauche figée (visuel + navigation), droite qui défile | `split-screen` |
| 06 | `06-nav-overlay` | Bouton seul ; le menu couvre tout l'écran à l'ouverture | Page d'accueil très épurée, presque vide, tout passe par le menu | `nav-overlay` |
| 07 | `07-grille-bento` | Barre horizontale minimale | Mosaïque de cartes de tailles inégales, chaque carte est une entrée du site | `bento` |
| 08 | `08-sections-snap` | Points de navigation verticaux sur le côté | Chaque section fait exactement un écran, le défilement s'aimante | `scroll-snap` |
| 09 | `09-hero-media-alterne` | Barre horizontale transparente sur le hero | Hero média, puis sections texte/visuel alternées gauche-droite | `plein-ecran` |
| 10 | `10-magazine-colonnes` | Barre horizontale avec sous-menu | Page d'accueil en colonnes, dense en information, façon page de journal | `multi-colonnes` |
| 11 | `11-scroll-horizontal` | Barre fixe, progression horizontale | La page défile latéralement, les sections sont côte à côte | `scroll-horizontal` |
| 12 | `12-sticky-stack` | Barre horizontale classique | Les sections se superposent en se collant en haut au fur et à mesure | `sticky-stack` |
| 13 | `13-nav-flottante` | Pilule flottante centrée en bas de l'écran | Page épurée, visuels plein cadre, interface réduite au minimum | `nav-flottante` |
| 14 | `14-mega-menu` | Méga-menu déroulant multi-colonnes | Pensée pour une arborescence riche : beaucoup de rubriques accessibles d'un coup | `mega-menu` |
| 15 | `15-typographique` | Liens en fin de section, aucune barre | Aucune image : uniquement de la typographie, du contraste et du vide | `colonne-unique` |

---

## Famille 02 — Boutique & catalogue

Présenter un ensemble d'articles, permettre de filtrer, montrer une fiche.
Les mécaniques sont là (grille, filtres, panier), le contenu ne dit rien du secteur.

**Pages livrées :** `index.html` · `listing.html` · `produit.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-grille-classique` | Barre horizontale + icône panier | Bandeau, catégories, grille régulière de trois ou quatre colonnes, pagination | `grille-uniforme` |
| 02 | `02-filtres-sidebar` | Barre horizontale + colonne de filtres persistante à gauche | Filtres toujours visibles, grille à droite qui se met à jour | `sidebar` |
| 03 | `03-filtres-barre-haute` | Barre de filtres collante sous la navigation | Grille pleine largeur sans colonne latérale, tri et facettes en haut | `nav-sticky` |
| 04 | `04-lookbook-plein-ecran` | Navigation superposée, discrète | Grandes images plein cadre, très peu de texte, articles révélés au survol | `plein-ecran` |
| 05 | `05-masonry` | Barre horizontale minimale | Grille en briques, hauteurs variables, rythme irrégulier | `masonry` |
| 06 | `06-liste-dense` | Barre horizontale + barre d'outils | Vue en liste avec beaucoup de caractéristiques par ligne, faite pour comparer | `liste-dense` |
| 07 | `07-carrousels-categories` | Barre horizontale fine | Suite de carrousels horizontaux, un par catégorie, façon catalogue de streaming | `carrousels` |
| 08 | `08-mono-produit` | Ancres uniquement | Une seule page pour un seul article : argumentaire long, détails, achat en fin | `one-page` |
| 09 | `09-fiche-split` | Barre horizontale | Fiche article : galerie figée à gauche, informations qui défilent à droite | `split-screen` |
| 10 | `10-panier-drawer` | Barre horizontale + tiroir latéral permanent | Le panier s'ouvre en tiroir sans jamais quitter la page en cours | `drawer-modale` |
| 11 | `11-scroll-infini` | Navigation réduite, aucun pied de page | Chargement continu, ni pagination ni fin, exploration sans rupture | `scroll-infini` |
| 12 | `12-catalogue-editorial` | Barre horizontale avec rubriques | Alternance d'articles rédactionnels et de blocs d'articles, façon magazine | `multi-colonnes` |
| 13 | `13-configurateur-etapes` | Fil d'étapes en haut | Parcours guidé : on compose son article étape par étape, récapitulatif final | `multi-etapes` |
| 14 | `14-quick-view` | Barre horizontale | La fiche s'ouvre en fenêtre superposée, on ne quitte jamais la grille | `drawer-modale` |

---

## Famille 03 — Portfolio & galerie

Montrer un ensemble de réalisations. La variation porte sur la façon dont on parcourt
la collection et dont on entre dans un élément.

**Pages livrées :** `index.html` · `projet.html` · `contact.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-grille-uniforme` | Barre horizontale simple | Grille régulière de vignettes toutes au même format, légende au survol | `grille-uniforme` |
| 02 | `02-masonry` | Barre horizontale minimale | Grille en briques, hauteurs libres, densité forte | `masonry` |
| 03 | `03-liste-hover` | Barre horizontale discrète | Une simple liste de titres ; l'aperçu apparaît au survol, suivant le curseur | `colonne-unique` |
| 04 | `04-un-par-ecran` | Points latéraux + flèches | Un élément par écran, plein cadre, défilement aimanté | `scroll-snap` |
| 05 | `05-scroll-horizontal` | Barre fixe + barre de progression | La collection défile latéralement, molette redirigée | `scroll-horizontal` |
| 06 | `06-index-fixe-detail` | L'index sert de navigation | Index figé à gauche, l'élément sélectionné s'affiche à droite sans rechargement | `split-screen` |
| 07 | `07-bento` | Barre horizontale minimale | Mosaïque de tailles inégales, hiérarchie donnée par la surface occupée | `bento` |
| 08 | `08-carrousel-centre` | Flèches + pagination | Un élément au centre, les précédents et suivants visibles sur les côtés | `carrousels` |
| 09 | `09-lightbox` | Barre horizontale | Grille + visionneuse plein écran, navigation au clavier, zoom | `drawer-modale` |
| 10 | `10-projet-recit` | Barre discrète, retour à l'index | Chaque élément est un récit long : visuels fixes, texte qui défile par-dessus | `parallaxe` |
| 11 | `11-canvas-libre` | Aucune barre, mini-carte en coin | Éléments posés librement dans un espace, zoom et déplacement à la souris | `canvas-libre` |
| 12 | `12-timeline` | Frise servant de navigation | Les éléments s'égrènent sur une chronologie verticale, regroupés par période | `timeline` |
| 13 | `13-tableau-triable` | Barre horizontale + en-têtes cliquables | Tableau dense et triable, aucune image, approche par les données | `liste-dense` |
| 14 | `14-diaporama` | Flèches uniquement, aucun défilement | Navigation image par image, plein écran, clavier et glissement | `plein-ecran` |

---

## Famille 04 — Blog & magazine

Publier du contenu daté. La variation porte sur la densité du flux et sur le confort
de lecture d'un article.

**Pages livrées :** `index.html` (le flux) · `article.html` · `categorie.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-flux-simple` | Barre horizontale + catégories | Une seule colonne centrée, articles les uns sous les autres, aéré | `colonne-unique` |
| 02 | `02-une-hierarchisee` | Barre horizontale + rubriques | Un article vedette dominant, puis des secondaires en grille décroissante | `multi-colonnes` |
| 03 | `03-grille-cartes` | Barre horizontale | Grille régulière de cartes avec vignette, titre, extrait et date | `grille-uniforme` |
| 04 | `04-sidebar-widgets` | Barre horizontale + colonne latérale | Contenu à gauche, colonne de blocs à droite : populaires, archives, étiquettes | `sidebar` |
| 05 | `05-liste-dense` | Barre horizontale minimale | Titres et dates uniquement, aucune image, une centaine d'entrées par écran | `liste-dense` |
| 06 | `06-sommaire-collant` | Barre horizontale + sommaire latéral | Article avec table des matières collante et progression de lecture | `trois-colonnes` |
| 07 | `07-lecture-centree` | Barre qui disparaît à la lecture | Colonne de 65 caractères, aucune distraction, typographie soignée | `colonne-unique` |
| 08 | `08-journal-colonnes` | Barre horizontale dense + fil d'actualité | Colonnes typographiques, filets de séparation, mise en page de presse papier | `multi-colonnes` |
| 09 | `09-flux-masonry` | Barre horizontale | Flux en briques à hauteurs variables, chargement continu | `masonry` |
| 10 | `10-archive-chronologique` | Navigation par année et par mois | Entrée par la chronologie plutôt que par la thématique | `timeline` |
| 11 | `11-article-recit` | Barre discrète | Le visuel de fond change pendant que le texte de l'article défile | `parallaxe` |
| 12 | `12-notes-en-marge` | Barre horizontale | Texte principal + annotations, sources et notes dans la marge latérale | `trois-colonnes` |

---

## Famille 05 — Landing & conversion

Une page, un objectif. La variation porte sur la façon de dérouler l'argumentaire
et de placer l'appel à l'action.

**Pages livrées :** `index.html` · `merci.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-hero-centre` | Barre légère + bouton d'action | Hero centré, puis bénéfices, preuves, tarifs, questions fréquentes, action finale | `one-page` |
| 02 | `02-hero-split` | Barre légère | Écran coupé : argumentaire à gauche, visuel ou formulaire à droite | `split-screen` |
| 03 | `03-longform` | Barre absente, action répétée dans le texte | Page très longue, argumentaire déroulé, relances régulières | `colonne-unique` |
| 04 | `04-sections-snap` | Points latéraux | Un argument par écran, défilement aimanté, rythme imposé | `scroll-snap` |
| 05 | `05-cta-collant` | Barre d'action collée en bas, toujours visible | Sections classiques, mais l'action reste accessible en permanence | `nav-sticky` |
| 06 | `06-avant-apres` | Barre légère | Toute la page est construite sur l'opposition entre deux états | `split-screen` |
| 07 | `07-preuve-sociale` | Barre légère | Avis, logos, chiffres et témoignages structurent la page plus que le discours | `grille-uniforme` |
| 08 | `08-formulaire-etapes` | Fil de progression | La page est un formulaire progressif : une question par écran | `multi-etapes` |
| 09 | `09-hero-media` | Barre transparente superposée | Média plein écran en ouverture, le reste tient en trois blocs courts | `plein-ecran` |
| 10 | `10-countdown` | Barre légère + compteur permanent | Un compte à rebours structure la page et cadence les sections | `one-page` |
| 11 | `11-onglets` | Barre légère | Tout tient dans un écran, le contenu change par onglets sans défilement | `onglets` |
| 12 | `12-parallaxe` | Barre discrète | Plans à vitesses différentes, profondeur, narration par le défilement | `parallaxe` |

---

## Famille 06 — Application & tableau de bord

Interfaces d'espace connecté. Structurellement très différentes d'un site public :
navigation permanente, densité forte, états multiples.

**Pages livrées :** `index.html` (tableau de bord) · `detail.html` · `reglages.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-sidebar-topbar` | Colonne fixe à gauche + barre supérieure | Le schéma classique : indicateurs en haut, graphiques et tableaux en dessous | `sidebar` |
| 02 | `02-sidebar-icones` | Colonne réduite aux icônes, dépliable au survol | Maximum de place pour le contenu, navigation qui s'efface | `sidebar` |
| 03 | `03-onglets-superieurs` | Onglets horizontaux, aucune colonne latérale | Structure à plat, chaque onglet est une vue complète | `onglets` |
| 04 | `04-trois-colonnes` | Colonne de sections + colonne de liste | Sections, liste, détail : trois panneaux indépendants, façon messagerie | `trois-colonnes` |
| 05 | `05-widgets-bento` | Colonne fixe | Mosaïque de blocs de tailles inégales, chacun affichant une donnée | `bento` |
| 06 | `06-tableau-dense` | Barre supérieure + filtres | Un grand tableau occupe l'écran : tri, filtres, sélection multiple, actions groupées | `liste-dense` |
| 07 | `07-kanban` | Barre supérieure | Colonnes défilant horizontalement, cartes déplaçables entre elles | `scroll-horizontal` |
| 08 | `08-editeur-apercu` | Barre d'outils supérieure | Écran coupé : édition à gauche, rendu en direct à droite | `split-screen` |
| 09 | `09-tab-bar-mobile` | Barre d'onglets en bas, pensée pour le pouce | Mobile d'abord : vues courtes, navigation à portée de main | `tab-bar` |
| 10 | `10-canvas-outils` | Palettes flottantes par-dessus l'espace de travail | Espace de travail infini, outils superposés, aucun cadre fixe | `canvas-libre` |
| 11 | `11-terminal` | Aucune : on navigue en tapant des commandes | Une invite, un historique, `help` affiche le menu | `terminal` |
| 12 | `12-modales-empilees` | Barre supérieure minimale | Toutes les actions se font en fenêtres superposées, la page de fond ne change jamais | `drawer-modale` |

---

## Famille 07 — Documentation & base de connaissances

Organiser beaucoup de contenu structuré et le rendre trouvable.

**Pages livrées :** `index.html` · `article.html` · `recherche.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-sidebar-arborescence` | Arborescence dépliable à gauche | Le sommaire complet reste visible, le contenu occupe le reste | `sidebar` |
| 02 | `02-trois-colonnes` | Arborescence à gauche + sommaire de page à droite | Navigation, contenu, sommaire : chacun sa colonne, chacun son défilement | `trois-colonnes` |
| 03 | `03-recherche-centrale` | Champ de recherche dominant en haut | L'accueil est une recherche, avec des catégories en cartes en dessous | `grille-uniforme` |
| 04 | `04-accordeons` | Barre horizontale | Tout est replié par défaut, on déplie ce qui intéresse, aucune page à charger | `accordeons` |
| 05 | `05-onglets-versions` | Barre horizontale + sélecteur de version | Même contenu décliné par version ou par variante, bascule sans rechargement | `onglets` |
| 06 | `06-mono-page-ancres` | Sommaire à ancres | Toute la documentation sur une seule page très longue, recherche par le navigateur | `one-page` |
| 07 | `07-code-cote-a-cote` | Arborescence à gauche | Explication à gauche, exemples de code figés à droite qui suivent la lecture | `split-screen` |
| 08 | `08-wiki-liens-croises` | Fil d'Ariane + rétroliens en pied | Pages courtes fortement reliées entre elles, navigation par rebond | `colonne-unique` |
| 09 | `09-tutoriel-progression` | Fil d'étapes + précédent/suivant | Parcours linéaire avec progression enregistrée et validation par étape | `multi-etapes` |
| 10 | `10-cartes-drill-down` | Fil d'Ariane uniquement | On descend de catégorie en sous-catégorie par cartes successives | `bento` |

---

## Famille 08 — Événement & temporel

Tout ce qui est organisé autour d'une date : programme, intervenants, inscription.

**Pages livrées :** `index.html` · `programme.html` · `inscription.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-hero-countdown` | Barre légère + compteur permanent | Compte à rebours dominant, puis informations essentielles en blocs courts | `plein-ecran` |
| 02 | `02-affiche` | Aucune barre, liens en pied de page | Une affiche typographique plein écran, informations minimales | `colonne-unique` |
| 03 | `03-grille-horaire` | Barre horizontale + sélecteur de jour | Planning en grille : les créneaux en lignes, les lieux en colonnes | `liste-dense` |
| 04 | `04-timeline-verticale` | Ancres par moment de la journée | Le programme se lit comme une frise verticale continue | `timeline` |
| 05 | `05-intervenants-grille` | Barre horizontale | Grille de portraits, fiche détaillée au clic, filtres par thème | `grille-uniforme` |
| 06 | `06-billetterie-etapes` | Fil de progression | Sélection, coordonnées, récapitulatif, confirmation | `multi-etapes` |
| 07 | `07-one-page-ancres` | Ancres et défilement doux | Tout sur une page : présentation, programme, lieu, inscription | `one-page` |
| 08 | `08-scroll-horizontal-jours` | Onglets de jours + défilement latéral | Chaque journée est un écran, on passe de l'une à l'autre latéralement | `scroll-horizontal` |
| 09 | `09-plan-interactif` | Barre horizontale + carte | Un plan occupe l'écran, les points d'intérêt ouvrent un panneau latéral | `carte-interactive` |
| 10 | `10-live-bandeau` | Bandeau collant de mise à jour en direct | Un fil d'actualité en temps réel structure la page pendant l'événement | `nav-sticky` |

---

## Famille 09 — Annuaire, listing & recherche

Beaucoup d'entrées, des critères, une fiche de détail. Le moteur est la structure.

**Pages livrées :** `index.html` (recherche) · `fiche.html` · `carte.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-filtres-lateraux` | Barre horizontale + colonne de critères à gauche | Critères persistants, résultats en liste à droite, compteur en temps réel | `sidebar` |
| 02 | `02-carte-panneau` | Barre horizontale, la carte occupe l'écran | Carte plein écran, panneau de résultats latéral synchronisé au survol | `carte-interactive` |
| 03 | `03-cartes-filtres-haut` | Filtres en pastilles sous la navigation | Résultats en grille de cartes pleine largeur, filtres rapides en haut | `grille-uniforme` |
| 04 | `04-tableau-triable` | Barre horizontale + en-têtes cliquables | Tableau dense, tri multi-colonnes, comparaison directe ligne à ligne | `liste-dense` |
| 05 | `05-facettes-avancees` | Colonne de facettes repliables | Recherche experte : nombreux critères combinables, requête sauvegardable | `sidebar` |
| 06 | `06-fiche-galerie-fixe` | Retour aux résultats + navigation entre fiches | Fiche de détail : galerie figée d'un côté, informations qui défilent de l'autre | `split-screen` |
| 07 | `07-comparateur` | Barre horizontale | Deux ou trois entrées côte à côte, différences mises en évidence | `trois-colonnes` |
| 08 | `08-scroll-infini` | Barre minimale, aucune pagination | Vignettes en flux continu, filtres en tiroir | `scroll-infini` |
| 09 | `09-onglets-categories` | Onglets de catégories en haut | Chaque onglet est un listing complet et indépendant | `onglets` |
| 10 | `10-liste-chronologique` | Barre horizontale simple | Entrées classées par date, format compact, façon petites annonces | `colonne-unique` |

---

## Famille 10 — Profil & page personnelle

Une seule personne ou une seule entité. Format court, forte identité.

**Pages livrées :** `index.html` (+ une seconde page selon la variante)

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-carte-liens` | Aucune | Portrait, une phrase, une pile de liens en pleine largeur | `colonne-unique` |
| 02 | `02-cv-timeline` | Ancres latérales | Parcours en frise verticale, expériences datées, compétences en fin | `timeline` |
| 03 | `03-cv-deux-colonnes` | Aucune, tout est visible | Colonne étroite pour l'identité et les contacts, colonne large pour le parcours | `split-screen` |
| 04 | `04-photo-fixe` | Liens superposés au visuel | Portrait plein écran figé, le texte défile par-dessus | `plein-ecran` |
| 05 | `05-terminal-interactif` | Commandes tapées | Le visiteur découvre le contenu en tapant `about`, `work`, `contact` | `terminal` |
| 06 | `06-recto-verso` | Bouton de retournement | Une carte unique qui se retourne : identité au recto, détails au verso | `drawer-modale` |
| 07 | `07-manifeste` | Aucune | Un texte long, aucune image, la typographie porte tout | `colonne-unique` |
| 08 | `08-bento` | Barre minimale | Mosaïque de blocs : présentation, liens, statistiques, actualité récente | `bento` |
| 09 | `09-minimale` | Aucune | Un écran, cinq lignes, trois liens. Rien d'autre | `one-page` |
| 10 | `10-profil-realisations` | Barre horizontale légère | Présentation courte suivie d'une grille de réalisations | `grille-uniforme` |

---

## Famille 11 — Média riche & immersif

Quand l'image, la vidéo ou le son est le contenu principal et impose sa mise en page.

**Pages livrées :** `index.html` · `lecture.html`

| # | Variante | Navigation | Organisation de la page principale | Archétype |
|---|---|---|---|---|
| 01 | `01-carrousels-catalogue` | Barre superposée qui s'opacifie au défilement | Rangées horizontales successives, une par thématique, façon catalogue vidéo | `carrousels` |
| 02 | `02-lecteur-overlay` | Barre horizontale | La lecture s'ouvre en surimpression plein écran, le catalogue reste en dessous | `drawer-modale` |
| 03 | `03-vignettes-apercu` | Barre horizontale minimale | Grille de vignettes qui s'animent au survol, aperçu sans clic | `grille-uniforme` |
| 04 | `04-player-persistant` | Barre de lecture collée en bas, toujours active | La lecture continue pendant qu'on navigue dans le reste du site | `tab-bar` |
| 05 | `05-recit-media-fixe` | Barre discrète | Le média reste fixe pendant que le texte défile et le commente | `parallaxe` |
| 06 | `06-galerie-snap` | Points latéraux | Un média par écran, défilement aimanté, plein cadre | `scroll-snap` |
| 07 | `07-visualiseur-360` | Barre minimale + commandes | Un objet manipulable au centre, rotation et zoom à la souris | `canvas-libre` |
| 08 | `08-timeline-horizontale` | Frise servant de navigation | Les médias s'égrènent sur une frise horizontale parcourue à la molette | `scroll-horizontal` |
| 09 | `09-mur-mosaique` | Aucune, ou réduite à un logo | Mur d'images sans marge, hauteurs variables, immersion totale | `masonry` |
| 10 | `10-mode-cinema` | Disparaît pendant la lecture | Tout s'assombrit autour du média, l'interface s'efface | `plein-ecran` |

---

## Famille 12 — Pages système & tunnels

Pages isolées, courtes, rapides à produire. Ce sont elles qui montrent le mieux
un thème en quelques secondes — et le meilleur banc d'essai des tokens.

**Pages livrées :** une page autonome par variante

| # | Variante | Rôle | Organisation | Archétype |
|---|---|---|---|---|
| 01 | `01-404-illustree` | Erreur 404 | Illustration SVG centrale, message court, recherche et liens de secours | `plein-ecran` |
| 02 | `02-404-typographique` | Erreur 404 | Un chiffre géant occupe l'écran, aucun visuel, un seul lien de retour | `colonne-unique` |
| 03 | `03-404-interactive` | Erreur 404 | Un mini-jeu occupe la page pendant que le visiteur décide où aller | `canvas-libre` |
| 04 | `04-maintenance` | Indisponibilité | Compte à rebours, raison de l'interruption, inscription pour être prévenu | `plein-ecran` |
| 05 | `05-coming-soon` | Avant lancement | Formulaire d'inscription dominant, visuel d'attente, réseaux en pied | `colonne-unique` |
| 06 | `06-connexion-centree` | Authentification | Carte centrée sur fond neutre, champs, connexion externe, mot de passe oublié | `colonne-unique` |
| 07 | `07-connexion-split` | Authentification | Écran coupé : visuel plein cadre d'un côté, formulaire de l'autre | `split-screen` |
| 08 | `08-inscription-etapes` | Création de compte | Trois étapes, indicateur de progression, force du mot de passe, conditions | `multi-etapes` |
| 09 | `09-tunnel-paiement` | Commande | Panier, livraison, paiement, récapitulatif — avec éléments de réassurance | `multi-etapes` |
| 10 | `10-tarifs-colonnes` | Offres | Trois colonnes, offre mise en avant, bascule mensuel/annuel, questions fréquentes | `grille-uniforme` |
| 11 | `11-tarifs-comparatif` | Offres | Grand tableau de comparaison ligne à ligne, en-tête collant, infobulles | `liste-dense` |
| 12 | `12-contact-carte` | Contact | Formulaire à gauche, carte et coordonnées à droite, horaires en dessous | `carte-interactive` |
| 13 | `13-contact-split` | Contact | Écran coupé : visuel figé d'un côté, formulaire long de l'autre | `split-screen` |
| 14 | `14-faq-accordeons` | Questions fréquentes | Recherche en haut, catégories, questions repliées, contact en dernier recours | `accordeons` |
| 15 | `15-remerciement` | Après conversion | Confirmation, prochaines étapes, partage, suggestion de suite | `colonne-unique` |
| 16 | `16-style-guide` | Validation technique | Toutes les couleurs, tailles, composants et états sur une seule page | `trois-colonnes` |

> La variante `16-style-guide` n'est pas destinée aux clients : c'est l'outil qui valide
> qu'un nouveau thème tient la route avant de l'appliquer ailleurs.

---

## Index transversal — par archétype

Le second axe d'entrée dans le catalogue. Un client qui dit « je veux une colonne à gauche »
ou « je veux que ça défile sur le côté » arrive ici et voit toutes les variantes concernées,
toutes familles confondues.

> ### Ce tableau est aussi le registre des risques de doublon
>
> Onze variantes partagent `split-screen`. Dix partagent `grille-uniforme`. Neuf
> partagent `plein-ecran`. Écrites sans précaution, ce sont onze, dix et neuf
> photocopies — et l'audit a montré que c'est le mode d'échec par défaut.
>
> **Règle opposable :** deux variantes de même archétype doivent présenter une
> distance ADN **≥ 0.45**, soit une différence sur au moins quatre autres axes,
> dont un lourd (`composition`, `density` ou `typography`). Vérifié par
> `node _tools/dna-report.js --collisions`, qui liste explicitement les paires de
> même archétype trop proches.
>
> Autrement dit : partager une mise en page est autorisé, à condition de ne
> partager que ça. Un `split-screen` éditorial en presse imprimée et un
> `split-screen` de données en terminal monochrome n'ont, en pratique, rien en
> commun.

**Raccourcis de famille :** `vitrine` · `boutique` · `portfolio` · `blog` · `landing` · `app`
· `doc` · `evenement` · `annuaire` · `profil` · `media` · `systeme`

| Archétype | Principe | Variantes | Nb |
|---|---|---|---:|
| `colonne-unique` | Une seule colonne centrée, lecture linéaire | `vitrine/15` · `portfolio/03` · `blog/01` · `blog/07` · `landing/03` · `doc/08` · `evenement/02` · `annuaire/10` · `profil/01` · `profil/07` · `systeme/02` · `systeme/05` · `systeme/06` · `systeme/15` | 14 |
| `split-screen` | Écran coupé en deux, une moitié fixe | `vitrine/05` · `boutique/09` · `portfolio/06` · `landing/02` · `landing/06` · `app/08` · `doc/07` · `annuaire/06` · `profil/03` · `systeme/07` · `systeme/13` | 11 |
| `grille-uniforme` | Grille régulière, tous les éléments au même format | `boutique/01` · `portfolio/01` · `blog/03` · `landing/07` · `doc/03` · `evenement/05` · `annuaire/03` · `profil/10` · `media/03` · `systeme/10` | 10 |
| `plein-ecran` | Média ou visuel plein cadre, interface effacée | `vitrine/09` · `boutique/04` · `portfolio/14` · `landing/09` · `evenement/01` · `profil/04` · `media/10` · `systeme/01` · `systeme/04` | 9 |
| `sidebar` | Colonne de navigation verticale sur le côté | `vitrine/03` · `boutique/02` · `blog/04` · `app/01` · `app/02` · `doc/01` · `annuaire/01` · `annuaire/05` | 8 |
| `liste-dense` | Liste ou tableau dense, priorité à l'information | `boutique/06` · `portfolio/13` · `blog/05` · `app/06` · `evenement/03` · `annuaire/04` · `systeme/11` | 7 |
| `one-page` | Tout sur une seule page, navigation par ancres | `vitrine/04` · `boutique/08` · `landing/01` · `landing/10` · `doc/06` · `evenement/07` · `profil/09` | 7 |
| `drawer-modale` | Le contenu s'ouvre en tiroir ou en surimpression | `boutique/10` · `boutique/14` · `portfolio/09` · `app/12` · `profil/06` · `media/02` | 6 |
| `multi-etapes` | Parcours guidé avec progression | `boutique/13` · `landing/08` · `doc/09` · `evenement/06` · `systeme/08` · `systeme/09` | 6 |
| `trois-colonnes` | Trois panneaux à défilement indépendant | `blog/06` · `blog/12` · `app/04` · `doc/02` · `annuaire/07` · `systeme/16` | 6 |
| `bento` | Mosaïque de blocs de tailles inégales | `vitrine/07` · `portfolio/07` · `app/05` · `doc/10` · `profil/08` | 5 |
| `scroll-horizontal` | La page défile latéralement | `vitrine/11` · `portfolio/05` · `app/07` · `evenement/08` · `media/08` | 5 |
| `canvas-libre` | Espace libre, zoom et déplacement, aucun cadre fixe | `portfolio/11` · `app/10` · `media/07` · `systeme/03` | 4 |
| `masonry` | Grille en briques à hauteurs variables | `boutique/05` · `portfolio/02` · `blog/09` · `media/09` | 4 |
| `multi-colonnes` | Colonnes typographiques, densité de presse | `vitrine/10` · `boutique/12` · `blog/02` · `blog/08` | 4 |
| `nav-sticky` | Barre ou bandeau collant qui reste accessible au défilement | `vitrine/02` · `boutique/03` · `landing/05` · `evenement/10` | 4 |
| `onglets` | Contenu changé par onglets, sans défilement | `landing/11` · `app/03` · `doc/05` · `annuaire/09` | 4 |
| `parallaxe` | Plans à vitesses différentes, narration au défilement | `portfolio/10` · `blog/11` · `landing/12` · `media/05` | 4 |
| `scroll-snap` | Un écran par section, défilement aimanté | `vitrine/08` · `portfolio/04` · `landing/04` · `media/06` | 4 |
| `timeline` | Frise chronologique comme structure principale | `portfolio/12` · `blog/10` · `evenement/04` · `profil/02` | 4 |
| `carrousels` | Rangées horizontales défilantes | `boutique/07` · `portfolio/08` · `media/01` | 3 |
| `carte-interactive` | Une carte occupe l'écran, panneau latéral synchronisé | `evenement/09` · `annuaire/02` · `systeme/12` | 3 |
| `accordeons` | Contenu replié par défaut, déplié à la demande | `doc/04` · `systeme/14` | 2 |
| `scroll-infini` | Chargement continu, ni pagination ni fin | `boutique/11` · `annuaire/08` | 2 |
| `tab-bar` | Barre d'onglets en bas d'écran, pensée mobile | `app/09` · `media/04` | 2 |
| `terminal` | Navigation en tapant des commandes | `app/11` · `profil/05` | 2 |
| `mega-menu` | Menu déroulant multi-colonnes pour arborescence riche | `vitrine/14` | 1 |
| `nav-flottante` | Navigation en pilule flottante, détachée du bord | `vitrine/13` | 1 |
| `nav-horizontale` | Barre de navigation classique en haut de page | `vitrine/01` | 1 |
| `nav-overlay` | Menu qui couvre tout l'écran à l'ouverture | `vitrine/06` | 1 |
| `sticky-stack` | Les sections se superposent en se collant en haut | `vitrine/12` | 1 |

**31 archétypes** répartis sur **145 variantes**.

---
# CATALOGUE B — DIRECTIONS, PALETTES ET CAPACITÉS

## Le recomptage

Ce catalogue annonçait **333 thèmes**. L'audit a montré qu'il mélangeait quatre
choses de natures différentes, et que ce mélange était l'une des causes du
problème de diversité — parce qu'il faisait passer pour un axe de variation ce qui
n'en était pas un.

| Nature réelle | Ce que c'est | Environ |
|---|---|---:|
| **Direction artistique** | change la forme, la matière, la typographie | ~150 |
| **Palette** | change les couleurs et rien d'autre | ~120 |
| **Valeur d'un axe d'ADN** | n'est pas un habillage : c'est une dimension du design | ~38 |
| **Capacité technique** | n'est pas visuel : c'est un drapeau de production | 15 |

**Le cas le plus net.** La famille T1 « Teintes chromatiques » comptait quarante-six
entrées — `bold-red`, `bold-orange`, `wheat-golden`, `fresh-mint`, `olive-sage`… —
qui ne diffèrent **que par la teinte**. Quarante-six « thèmes » produisant un seul
design. Les appeler des palettes rend le catalogue honnête : on a une direction
artistique, déclinable en quarante-six couleurs.

**Le cas le plus révélateur.** La famille T11 « Partis pris de mise en page »
contenait `bento-grid`, `split-screen`, `masonry`, `sidebar-fixed`,
`horizontal-scroll`, `timeline-vertical`, `sticky-stack`, `broken-grid`,
`asymmetric`, `magazine-columns`… — c'est-à-dire **la liste des archétypes de
composition**, déjà présente dans le catalogue A. La même chose était comptée deux
fois : une fois comme forme, une fois comme peau. De même, T10 « Partis pris
typographiques » est l'axe `typography` et T12 « Partis pris techniques » est une
liste de drapeaux de build.

Ces dimensions ne s'étaient pas égarées par hasard : **elles cherchaient à
exister**. Le modèle `architecture × thème` n'avait pas de place pour elles, alors
elles se sont réfugiées dans la seule liste ouverte. C'est le meilleur argument en
faveur du modèle à trois couches : le catalogue des thèmes contenait déjà, en
creux, les axes qui lui manquaient.

**Ce que le recomptage change.** Rien n'est perdu, tout est remis à sa place — et
l'espace réel s'agrandit :

```
avant   145 structures × 333 « thèmes »   →  145 compositions distinctes
après   145 structures × ~150 directions × ~120 palettes
        + 9 axes d'ADN qui contraignent l'écriture des structures
```

### Verdict par famille

Les tableaux ci-dessous **conservent leur numérotation et leur contenu d'origine**.
Seule leur nature est corrigée.

| Famille | Titre d'origine | Nature réelle | À faire |
|---|---|---|---|
| T1 | Teintes chromatiques (46) | **Palettes** | déplacer vers `_core/palettes/` |
| T2 | Clair, sombre, contraste (15) | **Palettes + modes** | idem ; `auto-adaptive` devient une capacité |
| T3 | Écoles & mouvements (46) | **Directions** ✅ | le cœur de la valeur du catalogue |
| T4 | Époques & nostalgie (30) | **Directions** ✅ | idem |
| T5 | Futurs & science-fiction (20) | **Directions** ✅ | idem |
| T6 | Matières & textures (32) | **Directions** ✅ | l'axe `surface` incarné |
| T7 | Nature & paysages (23) | **Palettes** + un motif | ~4 seulement sont des directions |
| T8 | Cultures & artisanat (23) | **Palettes + ornement** | `ukiyoe`, `manga-ink` sont de vraies directions |
| T9 | Ambiances & moods (30) | **Mixte** | ~8 directions, le reste des palettes |
| T10 | Partis pris typographiques (14) | **Axe `typography`** | absorbé dans `_core/dna/schema.json` |
| T11 | Partis pris de mise en page (24) | **Axe `composition`** | absorbé ; doublon du catalogue A |
| T12 | Partis pris techniques (15) | **Capacités** | deviennent des tags de `meta.json` |
| T13 | Saisonnier & fêtes (15) | **Palettes + décor** | `--decor-level` suffit |

> **Comment lire la suite.** Une ligne dont la nature est « palette » ne fournit que
> la colonne `Dominantes` ; ses colonnes `Typo` et `Signature` décrivent la
> **direction avec laquelle on la montre**, pas la palette elle-même. Une ligne dont
> la nature est « direction » est un vrai chantier de 100 à 250 lignes de CSS.

Colonnes : `Dominantes` = les 2-4 couleurs pivot · `Typo` = couple titre/texte ·
`Signature` = ce qui la rend reconnaissable en 1 seconde.

### Produites à ce jour

| Préréglage | Direction | Palette | Rôle |
|---|---|---|---|
| `moderne-clair` | `moderne-neutre` | `bleu-corporate` | **le témoin** — la somme des réflexes, conservée pour mesurer les autres |
| `neon-nuit` | `neon-nocturne` | `neon-cyan-magenta` | éprouve le contraste inversé et la profondeur par halo |
| `neo-brutal` | `neo-brutaliste` | `jaune-corail` | casse tout ce qui suppose ombre floue, arrondi, bordure fine |
| `quotidien` | `presse-imprimee` | `encre-journal` | hiérarchie par filets, grain de papier, densité 0.62, zéro mouvement |
| `console` | `terminal-phosphore` | `phosphore-vert` | échelle typographique plate (1.06), hiérarchie par inversion, monochrome |

Les deux dernières ont été écrites après l'audit, pour vérifier que la couche
« direction » a réellement du pouvoir. Mesuré : sur la même architecture,
`quotidien` s'éloigne de 0.31 à 0.34 des trois autres, qui restent groupées entre
0.25 et 0.28. La couche fonctionne — et sa limite est nette : elle n'a pas
décentré la page, parce que le centrage est une décision de structure.

---

## Famille T1 — Teintes chromatiques

La base : une dominante forte, le reste neutre. Ce sont les thèmes les plus "vendables"
parce qu'un client dit « je veux du bleu », pas « je veux du néo-brutalisme ».

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `bold-red` | Rouge Franc | `#E1121C` `#1A1A1A` `#FFF` | Sans grasse / sans | Aplats rouges pleins, CTA impossibles à rater, urgence |
| `bordeaux-wine` | Bordeaux | `#6B1F2E` `#C89B6A` `#F5EFE6` | Serif / serif | Profond, feutré, filets dorés, texture papier |
| `earthy-terracotta` | Terracotta | `#C96F4A` `#E8D5C4` `#3A2B24` | Serif humaniste / sans | Chaleur méditerranéenne, formes arrondies, argile |
| `bold-orange` | Orange Impact | `#FF6B00` `#111` `#FFF` | Sans condensée / sans | Énergie, diagonales, gros chiffres, dynamisme |
| `wheat-golden` | Blé Doré | `#D9A441` `#F7EFE0` `#4A3B22` | Serif / sans | Champêtre, doux, lumière rasante |
| `luxury-gold` | Or & Noir | `#C9A227` `#0B0B0B` `#F4F1EA` | Didone / sans fine | Filets fins, lettrage espacé, luxe classique |
| `mustard-retro` | Moutarde | `#D4A017` `#2E2A25` `#F0E7D8` | Slab / sans | 70s tempéré, contrastes chauds |
| `honey-amber` | Ambre Miel | `#F0A500` `#FFF8E7` `#3D2B1F` | Rounded sans | Miellé, translucide, arrondis généreux |
| `fresh-mint` | Menthe Fraîche | `#3BC9A5` `#EAFBF5` `#123B33` | Sans rounded | Propreté, respiration, santé, légèreté |
| `botanical-green` | Vert Botanique | `#2F6B4F` `#DCEBDF` `#1B2A22` | Serif / sans | Feuillages SVG, organique, naturel |
| `forest-deep` | Forêt Profonde | `#14342B` `#7A9E7E` `#E8E4D9` | Serif / sans | Sombre végétal, texture écorce, mystère |
| `olive-sage` | Olive & Sauge | `#8A9A5B` `#E9EAD8` `#3B4028` | Sans humaniste | Doux, mat, apaisant, presque poussiéreux |
| `emerald-rich` | Émeraude | `#046A38` `#0B1F17` `#E6C79C` | Serif / sans | Vert profond + accents dorés, opulence |
| `corporate-blue` | Bleu Corporate | `#0B5FFF` `#F4F7FB` `#0A1F44` | Sans neutre | Sérieux, cartes blanches, ombres douces |
| `navy-authority` | Bleu Marine | `#0A2540` `#F0F4F8` `#C8A96A` | Serif / sans | Institutionnel, sobre, autoritaire |
| `aqua-lagoon` | Lagon | `#12B5C9` `#E6FAFC` `#083B45` | Sans rounded | Aquatique, dégradés turquoise, vagues SVG |
| `deep-ocean` | Océan Profond | `#022B3A` `#1F7A8C` `#BFDBF7` | Sans / sans | Bleu abyssal, faisceaux de lumière, silence |
| `ice-glacial` | Glacial | `#BFE3F0` `#F7FCFF` `#1C3A4B` | Sans fine | Blanc bleuté, transparences, arêtes nettes |
| `cyan-electric` | Cyan Électrique | `#00E5FF` `#06121A` `#FFF` | Sans techno | Glow cyan sur fond noir, lignes fines |
| `indigo-night` | Indigo Nuit | `#3F3D9E` `#12112B` `#C9C6FF` | Sans / sans | Nocturne mais pas noir, profondeur veloutée |
| `mystic-purple` | Violet Mystique | `#6B2FA0` `#1A0E2E` `#E0C3FC` | Serif / sans | Ésotérique, halos, étoiles, dégradés violets |
| `lavender-calm` | Lavande | `#B8A9DB` `#F5F1FA` `#3A3050` | Sans rounded | Doux, féminin, apaisant, mat |
| `magenta-pop` | Magenta Pop | `#FF2D95` `#141018` `#FFF` | Sans grasse | Saturation maximale, flash, jeune |
| `rose-blush` | Rose Poudré | `#E8A5A5` `#FDF3F1` `#4A2C2A` | Serif fine / sans | Délicat, beauté, arrondis, ombres roses |
| `romantic-blush` | Romantique | `#EBD3D0` `#FFF9F7` `#8C6A5D` `#C9A227` | Script / serif | Mariage, calligraphie, fleurs aquarelle |
| `coral-warm` | Corail | `#FF6F61` `#FFF1EE` `#2F2A28` | Sans rounded | Vivant, accueillant, moderne tempéré |
| `salmon-soft` | Saumon | `#F5A18C` `#FFF6F2` `#4A3B36` | Sans humaniste | Chaleureux, pastel évolué |
| `coffee-brown` | Café | `#4B3025` `#C89F7B` `#F3EBE2` | Serif / sans | Torréfié, grain, chaleur, artisanat |
| `chocolate-dark` | Chocolat Noir | `#2B1A14` `#8B5E3C` `#EFE3D6` | Serif / sans | Riche, gourmand, mat profond |
| `desert-sand` | Sable | `#DCC9A6` `#F7F1E5` `#5B4A32` | Sans humaniste | Aride, doux, dunes, chaleur sèche |
| `savanna-ochre` | Ocre Savane | `#B87333` `#E8D6B0` `#33261A` | Slab / sans | Terre brûlée, motifs graphiques, animalier |
| `slate-gray` | Ardoise | `#4A5568` `#F7FAFC` `#1A202C` | Sans neutre | Gris bleuté, sobre, passe-partout |
| `concrete-gray` | Béton | `#8C8C88` `#E4E3DF` `#232320` | Grotesk | Texture granuleuse, brut, urbain |
| `charcoal-mono` | Charbon | `#1C1C1C` `#F2F2F2` `#9B9B9B` | Grotesk | Monochrome sérieux, contraste maîtrisé |
| `ivory-cream` | Ivoire | `#FBF7F0` `#EDE4D3` `#2E2A24` | Serif / serif | Chaleur du blanc cassé, papier, calme |
| `copper-patina` | Cuivre Patiné | `#B87333` `#3E5C55` `#F0EBE1` | Serif / sans | Métal oxydé, vert-de-gris, artisanat |
| `chrome-silver` | Chrome | `#C0C4C8` `#0F1113` `#EDEFF1` | Sans techno | Reflets métalliques, dégradés durs, brillance |
| `bronze-antique` | Bronze | `#8C6B3F` `#241C14` `#E3D5BF` | Serif classique | Patiné, muséal, sérieux |
| `plum-deep` | Prune | `#4A1E4A` `#E9D8EE` `#1A0C1A` | Serif / sans | Sombre fruité, élégance nocturne |
| `khaki-military` | Kaki | `#6B6B47` `#D9D6C3` `#22221A` | Sans condensée | Utilitaire, stencil, robuste |
| `neon-lime` | Vert Néon | `#C6FF00` `#0A0A0A` `#FFF` | Grotesk grasse | Acide, sportif, hyper visible |
| `pastel-soft` | Pastel Doux | `#FDF6F0` `#CDE7E0` `#F6D6DA` `#5A5148` | Sans rounded | Teintes lavées, arrondis généreux, aucune agressivité |
| `pastel-rainbow` | Arc-en-ciel Pastel | 6 pastels + `#FFF` | Sans rounded | Multicolore doux, catégories colorées |
| `duotone-strict` | Duotone | 2 couleurs, zéro autre | Grotesk | Toutes les images en bichromie, radical |
| `tritone` | Tritone | 3 couleurs imposées | Grotesk | Contrainte forte, très identitaire |
| `monochrome-single` | Monochrome absolu | 1 teinte × 9 nuances | Sans neutre | Discipline totale, aucune couleur d'accent |

---

## Famille T2 — Clair, sombre, contraste

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `modern-light` | Moderne Clair | `#FFF` `#1A1A1A` `#0B5FFF` | Sans géométrique | Blanc dominant, grandes marges, ombres douces — le passe-partout |
| `dark-slate` | Sombre Ardoise | `#161A1D` `#E6E8EA` `#4C9AFF` | Sans neutre | Dark mode sobre, gris chauds, lisibilité avant tout |
| `dark-neon` | Sombre Néon | `#0A0A0F` `#00F0FF` `#FF00A0` | Sans techno | Glow, bordures lumineuses, halos, nuit urbaine |
| `dark-luxe` | Sombre Luxe | `#0C0C0C` `#D4AF37` `#F5F5F0` | Didone / sans fine | Noir profond + or, lettrage espacé, silence |
| `dark-ink` | Encre Noire | `#121212` `#F2EFE9` `#B02A26` | Display / sans | Noir d'encre mat, traits épais, un seul rouge, tatouage |
| `dark-code` | Sombre Développeur | `#1E1E2E` `#CDD6F4` `#89B4FA` | Mono / sans | Palette d'éditeur, coloration syntaxique partout |
| `dark-fintech` | Sombre Finance | `#0D1117` `#00D68F` `#FF3D71` | Sans neutre / mono | Vert/rouge de marché, chiffres tabulaires, graphes |
| `dark-studio` | Sombre Studio | `#111` `#EDEDED` `#A0A0A0` | Sans neutre | Neutre absolu pour laisser vivre les images/vidéos |
| `amoled-black` | Noir Absolu | `#000` `#FFF` `#1DB954` | Sans neutre | Vrai noir OLED, économie de batterie, contraste max |
| `dim-twilight` | Pénombre | `#22252A` `#C9CDD3` `#E0A458` | Sans humaniste | Entre clair et sombre, chaud, confort du soir |
| `high-contrast` | Contraste Maximal | `#000` `#FFF` `#FFE600` | Sans grasse | Accessibilité extrême, bordures épaisses, focus visibles |
| `clinical-white` | Blanc Clinique | `#FFF` `#F0F4F8` `#0A6EBD` | Sans neutre | Aseptisé, grilles nettes, zéro fantaisie |
| `gallery-white` | Blanc Galerie | `#FAFAFA` `#111` | Sans fine | Cimaise : l'image est reine, UI quasi invisible |
| `sepia-reading` | Sépia Lecture | `#F4ECD8` `#3B322A` | Serif / serif | Confort de lecture longue, chaleur, zéro bleu |
| `auto-adaptive` | Adaptatif | dépend du système | Sans neutre | Bascule clair/sombre automatique + toggle manuel |

---

## Famille T3 — Écoles & mouvements du design

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `minimal-mono` | Minimalisme | `#FFF` `#000` | Grotesk / grotesk | Une seule taille de texte ou presque, aucun ornement |
| `minimal-luxe` | Minimalisme Luxe | `#F7F5F2` `#1A1A1A` `#B8A88A` | Serif fine / sans | Vide généreux, photos plein cadre, lenteur |
| `swiss-grid` | Grille Suisse | `#FFF` `#000` `#E10600` | Helvetica-like | Grille visible, alignement au pixel, rouge d'accent |
| `bauhaus` | Bauhaus | `#E63946` `#F1C40F` `#1D3557` `#FFF` | Geometric sans | Cercles/carrés/triangles primaires, aplats francs |
| `de-stijl` | De Stijl | rouge/jaune/bleu + noir/blanc | Geometric sans | Lignes noires épaisses, rectangles asymétriques |
| `constructivist` | Constructivisme | `#D62828` `#000` `#F0EAD6` | Condensée grasse | Diagonales, typo en biais, agit-prop |
| `suprematist` | Suprématisme | `#000` `#FFF` `#E63946` | Geometric | Formes flottantes, espace blanc actif |
| `neo-brutalism` | Néo-brutalisme | `#FFDE59` `#000` `#FF5F5F` | Grotesk grasse | Bordures 3px noires, ombres dures décalées, couleurs criardes |
| `brutalist-raw` | Brutalisme Web | `#FFF` `#00F` `#800080` | Times / Arial par défaut | HTML nu assumé, liens bleus soulignés, zéro CSS décoratif |
| `brutalist-type` | Brutalisme Typo | `#000` `#FFF` | Display énorme | Titres qui débordent, texte qui remplit l'écran |
| `flat-design` | Flat Design | palette plate saturée | Sans géométrique | Zéro ombre, zéro dégradé, icônes plates |
| `material-flat` | Material | `#6200EE` `#03DAC6` `#FFF` | Roboto-like | Élévations, FAB, ripple, cartes, règles strictes |
| `skeuomorphic` | Skeuomorphisme | textures réalistes | Serif / sans | Cuir, feutre, boutons bombés, ombres portées |
| `neumorphism` | Neumorphisme | `#E0E5EC` `#FFF` `#A3B1C6` | Sans rounded | Reliefs doux, double ombre in/out, monochrome |
| `glassmorphism` | Glassmorphisme | fond coloré + `rgba` blanc | Sans géométrique | `backdrop-filter: blur()`, bordures translucides |
| `claymorphism` | Claymorphisme | pastels saturés | Sans rounded très | Formes 3D gonflées, arrondis énormes, jouet |
| `aurora-gradient` | Aurora | `#7F5AF0` `#2CB67D` `#FF8906` | Sans géométrique | Dégradés maillés animés, halos flous, moderne SaaS |
| `gradient-aurora` | Dégradé Aurore | `#667EEA` `#764BA2` `#F093FB` | Sans géométrique | Le dégradé SaaS par excellence, blobs animés |
| `holographic` | Holographique | irisé multicolore | Sans techno | Reflets qui changent au scroll/hover, chrome liquide |
| `iridescent-foil` | Foil Irisé | nacré + noir | Display | Effet pellicule holographique sur les titres |
| `memphis` | Memphis | `#FF6B6B` `#4ECDC4` `#FFE66D` `#1A535C` | Sans géométrique | Squiggles, confettis, motifs 80s, chaos maîtrisé |
| `pop-art` | Pop Art | `#FF0` `#F00` `#00F` `#000` | Comic / grasse | Trames Ben-Day, contours noirs, onomatopées |
| `psychedelic-70s` | Psychédélique | `#FF4E00` `#8E44AD` `#F9C80E` | Display liquide | Typo ondulante, spirales, couleurs qui vibrent |
| `art-deco` | Art Déco | `#0B0B0B` `#C9A227` `#EDE6D6` | Display géométrique | Éventails, symétrie, filets dorés, chevrons |
| `art-nouveau` | Art Nouveau | `#2E4034` `#C4A77D` `#F0E9DC` | Display organique | Courbes végétales, cadres ornés, feuillages |
| `victorian-ornate` | Victorien | `#3B2F2F` `#A6874E` `#EDE0C8` | Blackletter / serif | Cadres, filigranes, ornements typographiques |
| `baroque-rococo` | Baroque | `#1B1B2F` `#D4AF37` `#F5E6CA` | Serif ornée | Dorures, volutes, surcharge assumée |
| `gothic-noir` | Gothique | `#0D0D0F` `#8B0000` `#C8C3BC` | Blackletter / serif | Ogives, ombres longues, textures pierre |
| `medieval-manuscript` | Manuscrit Médiéval | `#EFE0C0` `#7B241C` `#1B1B1B` `#B7950B` | Uncial / serif | Lettrines enluminées, marges décorées, parchemin |
| `japandi` | Japandi | `#EDE8E0` `#3A3733` `#8A7F6D` | Sans humaniste / serif | Bois clair, vide, lignes horizontales, calme |
| `scandinavian` | Scandinave | `#FFF` `#E8E4DE` `#2F2F2F` `#D96C4E` | Sans géométrique | Clarté, bois blond, un accent chaud, fonctionnel |
| `wabi-sabi` | Wabi-sabi | `#E7E1D6` `#5A4F45` | Serif irrégulière | Imperfection, bords irréguliers, texture, asymétrie |
| `zen-minimal` | Zen | `#F5F3EE` `#3C3C3C` `#9CAF88` | Sans fine | Respiration extrême, cercle enso, lenteur |
| `editorial-serif` | Éditorial Serif | `#FFF` `#141414` `#8C1D18` | Serif de labeur | Colonnes, lettrines, notes en marge, hiérarchie riche |
| `editorial-mono` | Éditorial Mono | `#FAFAFA` `#111` | Mono / grotesk | Tout en monospace, légendes techniques, froid |
| `magazine-grid` | Grille Magazine | `#FFF` `#111` `#E63946` | Display / serif | Grille irrégulière, gros titres, chapô, encadrés |
| `newspaper` | Journal | `#F5F2EA` `#111` | Serif condensée | Colonnes justifiées, filets, une dense, texture papier |
| `zine-diy` | Fanzine | `#FFF` `#000` `#FF3B00` | Typo machine + découpée | Photocopie, collage, scotch, imperfection volontaire |
| `punk-collage` | Collage Punk | `#000` `#FF0` `#F00` | Lettres de rançon | Découpé-collé, angles, agressif, trames de photocopie |
| `risograph` | Risographie | `#F94F8D` `#3D5AFE` `#F7F3E8` | Grotesk | Trames, surimpression, décalage d'encre, grain |
| `halftone-print` | Trame d'impression | `#FFF` `#111` + 1 spot | Grotesk | Points de trame visibles, esthétique offset |
| `blueprint` | Plan technique | `#0B3D91` `#FFF` `#7FA8D9` | Mono / sans | Fond bleu, traits blancs, cotes, grille millimétrée |
| `wireframe-sketch` | Wireframe | `#FFF` `#999` `#333` | Hand-drawn sans | Traits crayonnés, boîtes vides, esthétique maquette |
| `hand-drawn` | Dessiné à la main | `#FFFDF5` `#2B2B2B` + crayons | Manuscrite | Traits tremblés, flèches, annotations, doodles |
| `data-viz` | Data First | `#0F1620` + palette catégorielle | Sans / mono tabulaire | Graphes partout, chiffres alignés, densité assumée |
| `museum-label` | Cartel de Musée | `#F2EFE9` `#1A1A1A` | Serif / sans petite | Légendes techniques, numéros d'inventaire, sobriété |

---

## Famille T4 — Époques & nostalgie numérique

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `web1-nostalgia` | Web 1.0 | `#C0C0C0` `#00F` `#800080` | Times New Roman | Tables, liens visités violets, "under construction" |
| `geocities` | Geocities | fonds à motifs criards | Comic Sans | GIF animés, marquee, compteur de visites, midi |
| `win95-ui` | Windows 95 | `#C0C0C0` `#000080` `#FFF` | MS Sans-like | Fenêtres, biseaux, barre de titre bleue, boutons 3D |
| `mac-classic` | Mac System 7 | `#FFF` `#000` gris tramé | Chicago-like | Pixels 1-bit, ombres tramées, fenêtres à rayures |
| `bbs-terminal` | BBS / ANSI | `#000` `#0F0` `#0AF` | Mono bitmap | Art ASCII/ANSI, blocs de couleur, modem vibes |
| `terminal-green` | Terminal Phosphore | `#0A0F0A` `#33FF33` | Mono | Curseur clignotant, scanlines, prompt, glow vert |
| `terminal-amber` | Terminal Ambre | `#140D00` `#FFB000` | Mono | Variante ambre des vieux moniteurs, chaleureux |
| `matrix-code` | Matrix | `#000` `#00FF41` | Mono | Pluie de caractères, glyphes katakana, glitch |
| `arcade-crt` | Borne d'Arcade | `#12002B` `#FF00FF` `#00FFFF` | Bitmap | Scanlines, courbure d'écran, "INSERT COIN", high scores |
| `pixel-art` | Pixel Art | palette 16 couleurs | Font bitmap | Bordures en escalier, sprites, image-rendering: pixelated |
| `gameboy-mono` | Game Boy | `#0F380F` `#306230` `#8BAC0F` `#9BBC0F` | Bitmap | 4 nuances de vert, écran DMG, contraintes assumées |
| `snes-16bit` | 16 bits | palette SNES saturée | Bitmap | Dégradés en bandes, sprites détaillés, HUD de jeu |
| `vaporwave` | Vaporwave | `#FF71CE` `#01CDFE` `#05FFA1` | Display + katakana | Bustes grecs, damiers, palmiers, nostalgie ironique |
| `synthwave` | Synthwave | `#FF2E97` `#00E0FF` `#1A0033` | Display chromée | Grille en perspective, soleil rayé, montagnes filaires |
| `outrun` | Outrun | `#F72585` `#7209B7` `#3A0CA3` | Italique chromée | Route infinie, coucher de soleil dégradé, néon |
| `retro-70s` | Seventies | `#D97706` `#8B5E3C` `#EFCB68` `#2C4A3B` | Display bulbeuse | Arrondis épais, arcs, palette terreuse chaude |
| `retro-80s` | Eighties | `#FF6B9D` `#00D9FF` `#1B1B3A` | Display italique | Néons, formes géométriques, memphis + chrome |
| `y2k` | Y2K | `#C0C0C0` `#FF71CE` bleu iridescent | Squarish / bubble | Bulles chromées, transparences, étoiles, lens flare |
| `frutiger-aero` | Frutiger Aero | `#7FD4E8` `#B8E986` `#FFF` | Sans humaniste | Verre, bulles, herbe, ciel bleu, Windows Vista |
| `vintage-americana` | Americana | `#B02A26` `#F2E6D0` `#1F3A5F` | Slab / script | Enseignes rétro, badges, bannières, étoiles |
| `vintage-travel` | Affiche de Voyage | `#E07A5F` `#3D405B` `#F4F1DE` `#81B29A` | Display vintage | Aplats sérigraphiés, illustrations de destination |
| `vintage-circus` | Cirque | `#B02A26` `#F5E6C8` `#1A1A1A` `#D4AF37` | Display ornée | Bannières, guirlandes, rayures, cadres dorés |
| `sepia-memory` | Souvenir Sépia | `#F0E4D0` `#6B4F35` | Serif ancienne | Photos jaunies, coins arrondis, texture papier vieilli |
| `film-noir` | Film Noir | `#0A0A0A` `#EDEDED` `#8A8A8A` | Display condensée | Noir & blanc contrasté, ombres de stores, grain |
| `polaroid` | Polaroid | `#FFF` cadre + photo | Manuscrite | Cadres photo blancs, légendes écrites à la main, rotation |
| `vhs-glitch` | VHS | `#111` + aberration RVB | Mono + display | Tracking, bandes, date/heure en overlay, bruit |
| `cassette-tape` | Cassette Audio | `#2B2B2B` `#E8DCC0` `#D96C4E` | Mono étiquette | Bobines, étiquettes manuscrites, mixtape |
| `bauhaus-poster` | Affiche Bauhaus | primaires + noir | Geometric | Composition d'affiche, grands aplats, diagonale |
| `soviet-poster` | Affiche Soviétique | `#C1121F` `#FDF0D5` `#003049` | Condensée grasse | Poings, rayons, typo cyrillique-like, propagande stylisée |
| `wpa-poster` | Affiche WPA | `#2A4D69` `#E8A87C` `#F4EBD9` | Display années 30 | Parcs nationaux, aplats sérigraphiés, montagne |

---

## Famille T5 — Futurs & science-fiction

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `cyberpunk` | Cyberpunk | `#0D0221` `#FF003C` `#00F0FF` | Techno / mono | Néons japonais, glitch, HUD, pluie, corporate dystopique |
| `solarpunk` | Solarpunk | `#2E8B57` `#F6E7B6` `#4FC3F7` | Sans humaniste | Végétal + solaire, optimisme, courbes, verre et plantes |
| `steampunk` | Steampunk | `#3E2723` `#B8860B` `#D7CCC8` | Serif victorienne | Engrenages, laiton, rivets, cadrans, cuir |
| `dieselpunk` | Dieselpunk | `#2B2D2F` `#A47148` `#C0392B` | Condensée déco | Machinerie lourde, art déco industriel, entre-deux-guerres |
| `atompunk` | Atompunk | `#F2E8CF` `#E76F51` `#2A9D8F` | Display 50s | Atomes, boomerangs, optimisme atomique, googie |
| `biopunk` | Biopunk | `#0B2027` `#7DE2D1` `#C74B50` | Sans organique | Cellules, membranes, formes molles, bio-luminescence |
| `space-age` | Ère Spatiale | `#0B0E17` `#F5F5F5` `#FF5722` | Sans techno large | Mission control, orbites, comptes à rebours, sobriété NASA |
| `mission-control` | Contrôle de Mission | `#04141C` `#00FF9C` `#FFB000` | Mono | Écrans de télémétrie, courbes, statuts, jargon technique |
| `sci-fi-hud` | HUD Science-Fiction | `#001018` `#22D3EE` | Mono techno | Coins biseautés, réticules, lignes de scan, angles coupés |
| `hologram-ui` | Interface Holographique | translucides bleutés | Sans techno fine | Panneaux flottants, transparences, glow, parallaxe |
| `starfield` | Champ d'Étoiles | `#04040C` `#FFF` `#8AB4F8` | Sans fine | Étoiles animées, parallaxe, silence spatial |
| `cosmic-nebula` | Nébuleuse | `#160B2E` `#7B2FA0` `#F72585` `#4CC9F0` | Sans / display | Dégradés cosmiques, poussière d'étoiles, mystique |
| `lunar-surface` | Surface Lunaire | `#1C1C1E` `#D8D8D8` `#6E6E73` | Sans techno | Gris poudreux, cratères, lumière dure, ombres franches |
| `mars-red` | Mars | `#7C3A1E` `#E0A96D` `#160E0A` | Sans techno | Poussière rouge, horizon, exploration |
| `wireframe-3d` | Filaire 3D | `#000` `#00FF9C` | Mono | Maillages en fil de fer, rotation, vecteurs |
| `glitch-art` | Glitch | base + décalage RVB | Grotesk | Aberration chromatique, datamosh, corruption volontaire |
| `datamosh` | Datamosh | couleurs baveuses | Display | Compression cassée, blocs de pixels étalés |
| `ai-generative` | IA Générative | dégradés mouvants | Sans géométrique | Formes qui mutent, bruit de Perlin, organique/numérique |
| `matrix-rain` | Pluie Numérique | `#000` `#00FF41` | Mono | Colonnes de caractères tombants en fond |
| `utopian-white` | Utopie Blanche | `#FFF` `#E8ECEF` `#00BFA5` | Sans géométrique fine | Tout blanc, courbes douces, futur propre et lisse |

---

## Famille T6 — Matières & textures

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `paper-craft` | Papier Découpé | pastels + ombres portées | Sans rounded | Calques de papier superposés, ombres douces, relief |
| `craft-kraft` | Papier Kraft | `#C8A87C` `#4A3B2A` `#F0E6D2` | Slab / sans | Texture carton, tampons, ficelle, artisanal |
| `parchment` | Parchemin | `#EFE0C0` `#3B2F1E` | Serif ancienne | Bords brûlés, taches, sceau de cire, ancien |
| `linen-textile` | Lin & Textile | `#EDE7DC` `#5A5348` | Serif humaniste | Trame tissée, couture, étiquettes, doux |
| `denim-fabric` | Denim | `#2C4A6E` `#E8D9B5` | Slab | Coutures orange, rivets, jean délavé |
| `dark-leather` | Cuir Sombre | `#241A15` `#8C6239` `#E0D3C0` | Serif / condensée | Grain de cuir, surpiqûres, laiton, motard |
| `wood-warm` | Bois Chaud | `#8B5A2B` `#D9B382` `#F3EDE4` | Serif / sans | Veines de bois, chaleur, menuiserie, rainures |
| `concrete-brut` | Béton Brut | `#9A9A94` `#3A3A36` `#E6E4DE` | Grotesk | Texture coffrage, gris minéral, angles francs |
| `marble-classic` | Marbre | `#F5F2ED` `#2C2C2C` `#B08D57` | Didone / serif | Veines de marbre, colonnes, sérénité classique |
| `granite-stone` | Granit | `#4E4E4E` `#B7B3A9` | Grotesk | Grain minéral, lourd, solide |
| `industrial-steel` | Acier Industriel | `#2E3338` `#C7CDD2` `#F5A623` | Condensée grasse | Tôle striée, rivets, bandes d'avertissement, robuste |
| `rust-oxide` | Rouille | `#8B3A1F` `#D9C5A0` `#241A14` | Slab usée | Métal oxydé, texture rugueuse, abandon |
| `chrome-liquid` | Chrome Liquide | reflets métalliques | Display chromée | Blobs métalliques, réflexions, Y2K premium |
| `glass-frosted` | Verre Dépoli | blancs translucides | Sans fine | Flou d'arrière-plan, profondeur, superpositions |
| `neon-tube` | Tube Néon | `#0A0A0F` + néons saturés | Script néon | Lettrage néon qui grésille, reflets sur mur sombre |
| `velvet-curtain` | Velours | `#4A0E1F` `#D4AF37` `#1A0508` | Serif ornée | Rideau de scène, texture veloutée, dorures |
| `ceramic-glaze` | Céramique Émaillée | pastels brillants | Sans rounded | Reflets glossy, craquelures, artisanat |
| `sand-grain` | Grain de Sable | `#E4D5B7` `#6B5B45` | Sans humaniste | Texture granuleuse partout, chaleur, dunes |
| `ink-wash` | Lavis d'Encre | `#F5F2EA` `#1A1A1A` | Serif / brush | Taches d'encre diluée, coups de pinceau, sumi-e |
| `watercolor` | Aquarelle | pastels délavés | Manuscrite / serif | Auréoles, débordements, transparences, papier grain |
| `gouache-flat` | Gouache | couleurs mates saturées | Sans rounded | Aplats mats, texture pinceau, illustration jeunesse |
| `charcoal-sketch` | Fusain | `#F2EFE9` `#2B2B2B` | Manuscrite | Traits estompés, hachures, dessin d'atelier |
| `embroidery` | Broderie | fils colorés sur toile | Serif décorative | Points de croix, motifs textiles, fait main |
| `mosaic-tile` | Mosaïque | tesselles colorées | Serif / sans | Carreaux, joints, motifs géométriques, byzantin |
| `stained-glass` | Vitrail | couleurs saturées + plomb | Blackletter | Contours noirs épais, lumière traversante |
| `neon-sign` | Enseigne Lumineuse | fond brique + néons | Script | Enseigne de bar, reflets mouillés, nuit |
| `holo-foil` | Dorure à Chaud | noir + or/irisé | Didone | Effets de foil sur les titres, luxe imprimé |
| `letterpress` | Typographie en Relief | `#F2EDE4` `#2B2B2B` | Serif classique | Empreinte creuse, texture papier chiffon, artisanat |
| `chalkboard` | Ardoise / Craie | `#1E2A22` `#F5F1E6` | Manuscrite craie | Traits craie, effacements, menu de bistrot |
| `whiteboard-marker` | Feutre & Tableau | `#FFF` + feutres | Manuscrite | Traits de marqueur, post-its, brainstorm |
| `cork-board` | Panneau de Liège | `#C89F6B` + papiers | Manuscrite | Punaises, notes épinglées, ficelle rouge |
| `blackboard-menu` | Ardoise de Menu | `#2A2A28` `#EFE8D8` | Script craie | Menu du jour manuscrit, encadrements dessinés |

---

## Famille T7 — Nature, paysages & éléments

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `mountain-alpine` | Alpin | `#2C3E50` `#ECF0F1` `#7F8C8D` | Sans condensée | Silhouettes de sommets, courbes de niveau, air froid |
| `tropical-sunset` | Coucher Tropical | `#FF6B6B` `#FFD93D` `#6BCB77` `#4D96FF` | Sans rounded | Dégradés orangés, palmiers, chaleur, vacances |
| `mediterranean` | Méditerranéen | `#1B6CA8` `#F5F0E1` `#E9A03C` | Serif humaniste | Bleu-blanc, chaux, oliviers, arches |
| `nordic-fjord` | Fjord Nordique | `#3C5A6B` `#D7E1E6` `#8FA9B8` | Sans géométrique | Bleus froids, brume, minimal, eau calme |
| `desert-canyon` | Canyon | `#C1683B` `#E8C39E` `#4A2F22` | Slab | Strates rocheuses, chaleur, ombres longues |
| `jungle-lush` | Jungle | `#0F3D2E` `#7BC47F` `#F0E4C8` | Serif / sans | Feuillages superposés, humidité, densité |
| `savanna-golden` | Savane | `#C89F5C` `#7A5C32` `#F0E2C6` | Slab | Herbes hautes, acacias, lumière dorée |
| `arctic-ice` | Arctique | `#DDEEF5` `#0B3C5D` | Sans fine | Blanc bleuté, craquelures, froid, aurores |
| `volcanic-lava` | Volcanique | `#1A0F0A` `#FF4500` `#8B2500` | Display grasse | Coulées incandescentes, cendres, chaleur menaçante |
| `ocean-wave` | Vague | `#0077BE` `#F0F8FF` `#003554` | Sans rounded | Courbes SVG en vagues, mouvement, fraîcheur |
| `coral-reef` | Récif Corallien | `#FF7F50` `#40E0D0` `#FFF5EE` | Sans rounded | Couleurs vives sous-marines, formes organiques |
| `bioluminescent` | Bioluminescence | `#020B14` `#00FFC8` `#3B0A5C` | Sans fine | Lueurs organiques dans le noir, méduses, plancton |
| `autumn-fall` | Automne | `#C1440E` `#E09F3E` `#7A4419` `#F3E9D2` | Serif | Feuilles, roux, lumière basse, mélancolie douce |
| `spring-bloom` | Printemps | `#F2A2C0` `#A8D5BA` `#FFF8E7` | Sans rounded | Pétales, vert tendre, légèreté, renouveau |
| `summer-bright` | Été | `#FFD23F` `#3BCEAC` `#EE4266` | Sans grasse | Saturation, soleil, énergie, ombres courtes |
| `winter-frost` | Hiver | `#E8F1F5` `#33566E` `#B9CBD6` | Serif fine | Givre, silence, bleus pâles, contraste doux |
| `storm-thunder` | Orage | `#1F242B` `#F5C518` `#6B7480` | Condensée grasse | Ciel de plomb, éclairs, tension |
| `fog-mist` | Brume | `#D8DCE0` `#6C757D` | Sans fine | Flou progressif, superpositions, mystère doux |
| `cave-underground` | Souterrain | `#12100E` `#8A6A4B` `#3E3A34` | Serif | Obscurité, stalactites, lampe frontale, minéral |
| `botanical-plate` | Planche Botanique | `#F4F0E4` `#2E4034` `#A0522D` | Serif ancienne | Illustrations gravées, noms latins, cadres, herbier |
| `cottagecore` | Cottagecore | `#EADFC8` `#7A8B5A` `#B5651D` | Serif / script | Fleurs séchées, nappes à carreaux, douceur rurale |
| `boho-natural` | Bohème | `#D9A87C` `#7A6A55` `#F0E9DE` | Serif / sans humaniste | Macramé, terracotta, plantes, franges, chaleur |
| `farmhouse-rustic` | Ferme Rustique | `#F5F1E8` `#4A4038` `#8B6F47` | Slab / script | Bois vieilli, blanc cassé, enseignes peintes |

---

## Famille T8 — Cultures & artisanat du monde

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `japanese-ukiyoe` | Ukiyo-e | `#E8DCC8` `#1B4965` `#C1121F` | Serif / brush | Estampes, vagues, aplats, cadres, encre |
| `manga-ink` | Manga | `#FFF` `#000` + trames | Display japonisante | Trames de gris, lignes de vitesse, cases, onomatopées |
| `anime-vibrant` | Anime | ciels dégradés saturés | Sans rounded | Lumières lens flare, cheveux colorés, ciel de fin d'aprem |
| `kawaii` | Kawaii | `#FFB7D5` `#B5EAD7` `#FFF` | Rounded très | Mascottes, visages, arrondis, stickers, pastel |
| `korean-hanbok` | Hanbok | `#F5EFE6` `#1B4965` `#C1121F` `#F6BD60` | Serif fine | Aplats élégants, courbes, symétrie douce |
| `chinese-ink` | Encre Chinoise | `#F2EEE3` `#1A1A1A` `#B02A26` | Serif / brush | Lavis, sceaux rouges, verticalité, vide actif |
| `indian-rangoli` | Rangoli | `#FF9933` `#138808` `#FFF` `#C1121F` | Display ornée | Motifs concentriques, symétrie, couleurs de fête |
| `moroccan-zellige` | Zellige | `#0F5257` `#E8C07D` `#F3EDE3` | Serif ornée | Motifs géométriques entrelacés, arches, carreaux |
| `persian-carpet` | Tapis Persan | `#7B2D26` `#1B3A4B` `#D9B382` | Serif ornée | Motifs répétés, bordures riches, symétrie |
| `aztec-maya` | Aztèque | `#D9531E` `#1C7C54` `#F2E3C6` `#231F20` | Display géométrique | Frises à degrés, glyphes, pyramides |
| `african-wax` | Wax Africain | `#F2A104` `#00587A` `#D62828` | Sans grasse | Motifs textiles répétés, couleurs franches, rythme |
| `nordic-viking` | Viking | `#2B3A42` `#BDD4DE` `#8C5A3B` | Runique / serif | Nœuds entrelacés, bois gravé, runes |
| `celtic-knot` | Celtique | `#1F3B2C` `#C9A227` `#F0E9DC` | Uncial | Entrelacs, spirales, triquetras, vert profond |
| `greek-marble` | Grec Antique | `#F5F2EA` `#1B4965` `#C9A227` | Serif classique | Colonnes, clés grecques, statuaire, sobriété |
| `egyptian-papyrus` | Égyptien | `#E4C98D` `#1B1B1B` `#0F5257` `#C9A227` | Display hiéroglyphique | Frises, papyrus, or et lapis, symétrie |
| `native-southwest` | Sud-Ouest Américain | `#C1683B` `#5B8266` `#EFE0C0` | Slab | Motifs à degrés, terre cuite, turquoise |
| `hawaiian-tiki` | Tiki | `#0B6E4F` `#F4A259` `#5B3A29` | Display sculptée | Motifs tribaux, bambou, feuillages, bar polynésien |
| `mexican-fiesta` | Fiesta | `#E63946` `#F1FAEE` `#F4A259` `#2A9D8F` | Display festive | Papel picado, fleurs, couleurs saturées, joie |
| `dia-de-muertos` | Día de Muertos | `#2B0A3D` `#F4A259` `#E63946` `#F1FAEE` | Display ornée | Calaveras, soucis, dentelles, fête des morts |
| `brazilian-tropical` | Brésilien | `#009C3B` `#FFDF00` `#002776` | Sans rounded | Motifs de Copacabana, courbes Niemeyer, énergie |
| `russian-khokhloma` | Khokhloma | `#0B0B0B` `#C1121F` `#D4AF37` | Serif ornée | Volutes florales dorées sur noir et rouge |
| `dutch-delft` | Delft | `#FFF` `#1B4965` | Serif classique | Bleu sur blanc, faïence, scènes miniatures |
| `bavarian-alpine` | Bavarois | `#1B6CA8` `#FFF` `#2E7D32` | Display gothique | Carreaux, cœurs, bois, fête de la bière |

---

## Famille T9 — Ambiances & moods

| slug | Nom | Dominantes | Typo | Signature |
|---|---|---|---|---|
| `startup-vibrant` | Startup Énergique | `#5B5BD6` `#00C48C` `#FFF` | Sans géométrique | Illustrations plates, badges, gros CTA, optimisme |
| `trust-clean` | Confiance | `#0A6EBD` `#FFF` `#28A745` | Sans neutre | Badges de garantie, avis, chiffres rassurants, sobriété |
| `sober-elegant` | Sobre & Élégant | `#F7F5F2` `#2B2B2B` `#7A6A55` | Serif / sans | Retenue, marges, aucune animation gratuite |
| `cartoon-playful` | Cartoon | `#FFD93D` `#6BCB77` `#FF6B6B` | Rounded grasse | Personnages, blobs, rebonds, humour |
| `bubbly-fun` | Pétillant | pastels saturés | Rounded très | Bulles, rebonds, micro-animations partout |
| `luxury-quiet` | Luxe Discret | `#EFECE7` `#1A1A1A` | Serif fine | "Quiet luxury", pas d'or, juste du vide et du beau papier |
| `dark-academia` | Dark Academia | `#2B2118` `#C9A227` `#E8DFC8` | Serif classique | Bibliothèques, tweed, latin, bougies, savoir |
| `light-academia` | Light Academia | `#F5EFE0` `#6B5B45` `#A8927A` | Serif classique | Version lumineuse : marbre, lin, matinées d'étude |
| `pastel-goth` | Pastel Goth | `#1A1A1A` `#E5B3E0` `#9AD8E8` | Display gothique | Noir + pastel, croix, mignon-sombre |
| `gothic-romance` | Romance Gothique | `#1B0F14` `#8B1A2B` `#E8D9C0` | Serif ornée | Roses fanées, dentelles, mélancolie |
| `witchy-occult` | Occulte | `#14101C` `#C9A227` `#7B2FA0` | Serif ésotérique | Symboles, cartes, lune, herbes séchées |
| `cozy-hygge` | Hygge | `#F0E9DE` `#6B5B4A` `#C77D5A` | Serif humaniste | Bougies, laine, chaleur, lenteur |
| `brutal-honest` | Franc & Direct | `#FFF` `#000` `#FF3B00` | Grotesk grasse | Zéro marketing, texte brut, prix affichés, honnêteté |
| `corporate-boring` | Corporate Assumé | `#FFF` `#0B5FFF` `#5A6B7B` | Sans neutre | Volontairement sans surprise : ça rassure, ça convertit |
| `premium-tech` | Tech Premium | `#0B0B0F` `#FFF` `#A0A0A8` | Sans géométrique fine | Style Apple : produit centré, animation lente, silence |
| `friendly-local` | Commerce de Quartier | `#F5E9D7` `#3B5D50` `#D96C4E` | Script / sans | Photos vraies, ton chaleureux, horaires en gros |
| `urgent-alert` | Urgence | `#FFE600` `#000` `#E1121C` | Condensée grasse | Bandes de danger, clignotements, hiérarchie brutale |
| `mysterious-tease` | Mystère | `#0A0A0A` `#8A8A8A` | Serif fine | Presque rien, révélations au scroll, teasing |
| `nostalgic-warm` | Nostalgie | `#F0E4D0` `#8B6F47` | Serif ancienne | Grain, vignettage, photos décalées, souvenir |
| `energetic-sport` | Sport | `#111` `#F5A623` `#FFF` | Condensée italique | Diagonales, mouvement figé, chiffres énormes |
| `carbon-sport` | Carbone | `#0E0E10` `#C8102E` `#D0D3D4` | Condensée italique | Fibre de carbone, rouge de vitesse, agressif |
| `zen-slow` | Lenteur | `#F5F3EE` `#4A4A4A` | Serif fine | Transitions très longues, un seul élément par écran |
| `chaotic-maximal` | Maximalisme | tout à la fois | Mélange assumé | Superpositions, motifs, sur-décoration, horror vacui |
| `anti-design` | Anti-design | couleurs qui jurent | Polices système mal assorties | Volontairement laid, ironique, mémorable |
| `graffiti` | Graffiti | `#111` + sprays saturés | Display tag | Tags, coulures, béton, bombes, énergie de rue |
| `italian-trattoria` | Trattoria | `#008C45` `#F4F5F0` `#CD212A` | Script / serif | Nappes à carreaux, tricolore, convivialité |
| `traditional-flash` | Flash Traditionnel | `#F2E8D5` `#B02A26` `#1B4965` `#E8B84B` | Display old-school | Tatouage traditionnel : contours épais, roses, ancres |
| `comic-book` | Comic | `#FFF` `#000` primaires | Comic / grasse | Cases, bulles, trames, onomatopées, contours noirs |
| `kinetic-type` | Typo Cinétique | `#000` `#FFF` + 1 accent | Display variable | Le texte bouge : au scroll, au hover, en boucle |
| `cinematic-letterbox` | Cinéma | `#000` + bandes noires | Display condensée | Format 2.35:1, générique, étalonnage teal & orange |

---

## Famille T10 — Partis pris typographiques

Ces thèmes se définissent d'abord par la typo. Ils se combinent avec n'importe quelle teinte.

| slug | Nom | Principe |
|---|---|---|
| `mono-only` | Tout en monospace | Une seule famille mono, chiffres alignés, esthétique technique |
| `serif-forward` | Serif dominante | Serif pour titres ET texte, aucune sans-serif |
| `variable-font` | Police variable | Le poids/la largeur s'anime au scroll, au hover, au chargement |
| `display-huge` | Titres géants | Titres à 20vw, tout le reste minuscule |
| `type-only` | Zéro image | Uniquement de la typographie et de la couleur, aucune illustration |
| `handwritten` | Manuscrite | Tout écrit à la main, imperfections, personnel |
| `blackletter` | Gothique typographique | Fraktur pour les titres, austérité médiévale |
| `stencil-military` | Pochoir | Lettres au pochoir, kaki, utilitaire |
| `condensed-dense` | Condensée | Tout en condensé, densité d'information maximale |
| `wide-expanded` | Étendue | Lettrage très large, luxe, espace, lenteur |
| `bicameral-mix` | Contraste typo maximal | Didone + grotesk, opposition assumée titre/texte |
| `ascii-art` | Art ASCII | Logos, illustrations et séparateurs en caractères |
| `vertical-type` | Typographie verticale | Écriture verticale (mode CJK), rotations, colonnes |
| `justified-book` | Mise en page de livre | Justification, césures, veuves/orphelines gérées, notes |

---

## Famille T11 — Partis pris de mise en page

| slug | Nom | Principe |
|---|---|---|
| `bento-grid` | Grille Bento | Cartes de tailles inégales dans une grille, style dashboard moderne |
| `one-page-scroll` | Une seule page | Tout sur une page, ancres, nav collante, sections plein écran |
| `fullscreen-sections` | Sections plein écran | Chaque section = 100vh, snap scroll |
| `split-screen` | Écran divisé | Deux moitiés fixes, l'une scrolle, l'autre non |
| `horizontal-scroll` | Défilement horizontal | Le contenu défile latéralement, galeries, timelines |
| `sidebar-fixed` | Barre latérale fixe | Nav permanente à gauche, contenu à droite, docs/app |
| `masonry` | Masonry | Grille en briques, hauteurs variables, galeries |
| `broken-grid` | Grille cassée | Chevauchements, éléments hors alignement, tension |
| `asymmetric` | Asymétrie | Aucun centrage, poids visuel déséquilibré volontairement |
| `card-based` | Tout en cartes | Chaque bloc est une carte, ombres, hover, uniformité |
| `magazine-columns` | Colonnes de magazine | Multi-colonnes CSS, chapô, encadrés, filets |
| `timeline-vertical` | Frise verticale | Tout est une chronologie, jalons, connecteurs |
| `map-centered` | Carte au centre | La carte occupe l'écran, panneau latéral de résultats |
| `scrollytelling` | Récit au scroll | Le visuel change pendant que le texte défile |
| `parallax-depth` | Parallaxe | Plusieurs plans à vitesses différentes, profondeur |
| `sticky-stack` | Cartes empilées | Les sections se superposent en collant en haut |
| `infinite-canvas` | Canevas infini | Zoom/pan libre, contenu positionné dans l'espace |
| `terminal-cli` | Interface en ligne de commande | On navigue en tapant des commandes, `help` affiche le menu |
| `os-desktop` | Bureau d'OS | Fenêtres déplaçables, icônes, barre des tâches |
| `book-pages` | Pages de livre | Tourner les pages, double page, marge de reliure |
| `slideshow-deck` | Présentation | Navigation par slides, flèches, plein écran, mode présentateur |
| `chat-interface` | Interface de conversation | Le contenu se révèle en bulles de discussion |
| `gallery-lightbox` | Galerie & visionneuse | Grille + plein écran, navigation clavier, zoom |
| `single-column-narrow` | Colonne unique étroite | 65ch max, tout centré, lecture pure |

---

## Famille T12 — Partis pris techniques

Moins "visuels", mais ce sont d'excellents arguments de vente et des contraintes fertiles.

| slug | Nom | Principe |
|---|---|---|
| `no-js` | Zéro JavaScript | Tout en HTML/CSS, y compris menus, onglets, accordéons, carrousels |
| `ultra-light` | Ultra-léger | Objectif < 14 Ko total, aucune police externe, aucune image bitmap |
| `a11y-first` | Accessibilité d'abord | AAA, navigation clavier complète, ARIA, focus visibles, skip links |
| `print-optimized` | Optimisé pour l'impression | Feuille `@media print` soignée, CV/facture/menu imprimables |
| `offline-pwa` | PWA hors-ligne | Service worker, installable, fonctionne sans réseau |
| `motion-reduced` | Mouvement réduit | Respecte `prefers-reduced-motion`, alternatives statiques |
| `motion-heavy` | Animation intensive | Scroll-driven animations, view transitions, chorégraphie |
| `css-only-art` | Art en CSS pur | Illustrations dessinées uniquement en CSS, zéro image |
| `svg-driven` | Tout en SVG | Illustrations, icônes, motifs et animations en SVG inline |
| `container-queries` | Composants adaptatifs | Les composants s'adaptent à leur conteneur, pas au viewport |
| `dark-mode-native` | Bascule de thème | Clair/sombre/système, sans flash, mémorisé |
| `rtl-ready` | Compatible RTL | Fonctionne en arabe/hébreu, propriétés logiques CSS |
| `i18n-ready` | Multilingue | Structure prête pour plusieurs langues, sélecteur, hreflang |
| `seo-maxed` | SEO maximal | Données structurées, Open Graph, sitemap, sémantique stricte |
| `email-safe` | Compatible email | Version tables pour newsletters, clients mail |

---

## Famille T13 — Saisonnier & fêtes

Déclinaisons ponctuelles, très utiles pour les commerces.

| slug | Nom | Dominantes | Signature |
|---|---|---|---|
| `christmas-classic` | Noël Classique | `#B02A26` `#1B5E20` `#F5F0E6` `#C9A227` | Sapin, neige, guirlandes, compte à rebours |
| `christmas-nordic` | Noël Scandinave | `#F5F0E6` `#2B3A42` `#C77D5A` | Version sobre : bois, laine, minimal |
| `halloween` | Halloween | `#0F0A14` `#FF7518` `#7B2FA0` | Citrouilles, chauves-souris, curseur personnalisé |
| `new-year` | Nouvel An | `#0B0B0F` `#D4AF37` `#FFF` | Confettis, feux d'artifice, compte à rebours |
| `valentines` | Saint-Valentin | `#E63946` `#FFF0F3` `#FFB3C1` | Cœurs, dégradés roses, script |
| `easter` | Pâques | pastels + `#FFF` | Œufs, lapins, printemps, arrondis |
| `spring-sale` | Soldes de Printemps | `#A8D5BA` `#F2A2C0` | Bandeaux promo, fleurs, fraîcheur |
| `summer-sale` | Soldes d'Été | `#FFD23F` `#3BCEAC` | Soleil, glaces, pourcentages énormes |
| `black-friday` | Black Friday | `#000` `#FFF` `#FF3B00` | Compte à rebours, prix barrés, urgence |
| `back-to-school` | Rentrée | `#1B4965` `#F5A623` `#F5F0E6` | Cahiers, règles, carreaux, cartable |
| `oktoberfest` | Oktoberfest | `#1B6CA8` `#FFF` `#D9A441` | Carreaux bleus, chopes, bretzels |
| `pride` | Pride | arc-en-ciel | Dégradés inclusifs, célébration, badges |
| `ramadan-eid` | Ramadan / Eid | `#0F5257` `#C9A227` `#F3EDE3` | Croissants, lanternes, motifs géométriques |
| `lunar-new-year` | Nouvel An Lunaire | `#C1121F` `#D4AF37` | Enveloppes rouges, animal de l'année, lanternes |
| `sports-event-season` | Grande Compétition | selon l'événement | Tableau de matchs, compte à rebours, drapeaux |

---

## Diversity Benchmark

**Avant toute production en masse.** La question à trancher n'est pas « combien de
variantes reste-t-il à écrire » mais :

> *Ce système sait-il réellement produire des interfaces radicalement différentes ?*

Tant qu'elle n'a pas de réponse mesurée, écrire les 129 architectures restantes
revient à répliquer 129 fois un défaut connu. **Le benchmark passe donc avant le
lot 2.**

Douze références délibérément opposées, dans `benchmark/`. Chacune est construite
avec le système réel — mêmes tokens, mêmes couches, mêmes outils — et non à la
main : c'est le **système** qu'on éprouve, pas le talent d'un jour. Si le système
ne sait pas exprimer l'une d'elles, c'est un résultat, pas un échec à masquer.

| # | Référence | Composition | Densité | Typographie | Navigation | Surface | Contraintes |
|---|---|---|---|---|---|---|---|
| 01 | Éditorial minimal | `narrow-measure` | `airy` | `size-driven` / `oldstyle-serif` | `inline-contextual` | `paper` | `no-cards` `empty` |
| 02 | Brutalisme brut | `broken-grid` | `dense` | `weight-driven` / `poster-heavy` | `numeric-index` | `flat-paint` | `no-rounded` `no-shadow` `no-standard-cta` |
| 03 | Interface de données | `tabular` | `information-heavy` | `flat` / `system-mono` | `tab-panel` | `flat-paint` | `data-first` `dense` `no-cards` |
| 04 | Système d'exploitation ancien | `panelled` | `compact` | `case-driven` / `neo-grotesque` | `map-spatial` | `plastic` | `no-rounded` `raw-web` |
| 05 | Imprimé de luxe | `asymmetric-weighted` | `void` | `spacing-driven` / `didone` | `marginal-notes` | `paper` | `empty` `no-shadow` `no-standard-cta` |
| 06 | Direction artistique asymétrique | `diagonal` | `balanced` | `family-contrast` / `condensed` | `floating` | `modular-blocks`¹ | `asymmetry` `no-centered-text` |
| 07 | Terminal | `flush-left-ragged` | `compact` | `case-driven` / `typewriter-mono` | `command-line` | `screen-phosphor` | `monochrome` `single-type-size` `no-sans-serif` |
| 08 | Collage maximaliste | `scattered` | `maximalist` | `mixed-mismatch` | `overlay-menu` | `printed-halftone` | `controlled-chaos` `no-gradient` |
| 09 | Planche scientifique | `modular-grid` | `dense` | `rule-driven` / `humanist-sans` | `alphabetic-index` | `newsprint` | `visible-grid` `editorial` |
| 10 | Ultra-minimal | `marginal` | `void` | `flat` / `neo-grotesque` | `scroll-only` | `void` | `empty` `no-images` `no-animation` |
| 11 | Tactile / skeuomorphe | `stacked-planes` | `balanced` | `size-driven` / `engraved` | `bottom-bar` | `metal` | `physical` `no-cards` |
| 12 | Spatial expérimental | `full-bleed` | `airy` | `display-dominant` / `geometric-sans` | `progress-driven` | `glass` | `no-hero` `no-standard-cta` |

<sub>¹ `geometry`, les autres colonnes « Surface » donnant `surface`. Le tableau est
un résumé ; l'ADN complet des neuf axes vit dans le `meta.json` de chaque
référence.</sub>

**Critères de réussite — les trois doivent passer.**

1. **Distance ADN ≥ 0.60 pour les 66 paires.** Aucune exception.
2. **Distance perceptuelle ≥ 0.35 pour les 66 paires** — soit près du double du
   seuil de collision. Deux références qui se ressemblent à l'écran invalident le
   benchmark même si leurs métadonnées divergent.
3. **Composition sur axe central ≤ 25 %** sur l'ensemble des douze — contre 82 %
   aujourd'hui.

Et un critère humain, qui reste le juge de dernier ressort : **poser les douze
captures côte à côte et les montrer à quelqu'un qui ne connaît pas le projet.**
S'il dit « c'est le même système de design », les trois seuils ne valent rien et
il faut reprendre le modèle, pas les variantes.

**Ce que le benchmark autorise en cas d'échec :** modifier le vocabulaire d'ADN,
ajouter des tokens, revoir la séparation des couches. Ce qu'il n'autorise pas :
passer au lot 2 en se disant que ça s'arrangera au volume.

---

## Feuille de route

Approche : **un noyau dense, puis des rayons**. Pas de production en largeur avant que
les fondations ne soient éprouvées — et désormais, pas de production en largeur
avant que la **capacité à diverger** ne soit éprouvée.

### Lot 0 — Fondations · ✅ *terminé*

1. ✅ `_core/reset.css` et `_core/tokens.css` — 40 variables, contrat de contraste documenté
2. ✅ Trois thèmes de référence délibérément opposés : `modern-light`, `dark-neon`, `neo-brutalism`
3. ✅ `systeme/16-style-guide` — mesure les contrastes réels et permet de changer de thème en direct
4. ✅ `_tools/new-variant.sh` et `_tools/build.js`
5. ✅ `_tools/check-contrast.js` — ajouté en cours de route, voir ci-dessous

**Ce que le lot a révélé.** Le style-guide a immédiatement trouvé onze paires de couleurs
sous le seuil AA, dont une erreur de conception : `--accent` servait à la fois de fond de
bouton et de couleur de lien. Sur `neo-brutalism`, cela rendait les liens illisibles
(2.25:1). D'où la séparation `--accent` / `--accent-text`, et l'ajout de
`_tools/check-contrast.js` pour rendre le contrat vérifiable en une commande plutôt qu'à
l'œil. Les trois thèmes passent désormais les seize paires.

> C'était le lot le moins gratifiant — aucune page présentable à la fin — mais c'est
> exactement là que ces défauts coûtaient le moins cher à corriger.

### Lot 1 — Les pages système · ✅ *terminé*

Les seize variantes de la famille `12-systeme`, validées sur les trois thèmes de référence.
**48 dossiers livrables** générés par `build.js`.

C'était le bon banc d'essai : une 404 typographique et un tableau comparatif de tarifs ne
sollicitent pas du tout les mêmes variables. Résultat du contrôle automatisé — **1 116
éléments de texte mesurés sur 45 combinaisons page × thème, zéro contraste sous le seuil**,
et aucun débordement horizontal sur 320 / 768 / 1280 / 1920 px.

**Ce que le lot a appris.** Deux pièges de vérification, pas de défaut de conception :

- Dans une grille `justify-items: center`, les enfants prennent leur largeur `max-content` :
  un titre long refuse de se replier et déborde. Il faut `max-inline-size: 100%`.
- Un décor en `position: absolute` s'échappe de son conteneur dès que celui-ci repasse en
  `position: static` — `overflow: hidden` ne le clippe alors plus.

**Ce que le lot 1 a vraiment appris — constat de l'audit.** Les vérifications
techniques étaient bonnes et le sont restées : zéro contraste sous le seuil, zéro
débordement. Mais elles ne mesuraient que la **correction**, jamais la
**singularité**. Seize pages irréprochables et interchangeables : 82 % composées
sur un axe central, 100 % en pile système sur aplat numérique, budget anti-réflexes
moyen à 7,8 pour un plafond de 6. Le contrôle qualité n'était pas faux, il était
incomplet — et un catalogue ne se vend pas sur l'absence de défauts.

D'où la révision qui suit : **le lot 2 est repoussé derrière une preuve de
capacité.**

### Lot 1R — Le système de diversité · ✅ *terminé*

1. ✅ Audit mesuré du lot 1 — la signature de catalogue, chiffrée et reproductible
2. ✅ Vocabulaire d'ADN : `_core/dna/schema.json`, neuf axes, valeurs à conséquence
3. ✅ Contraintes créatives vérifiables : `_core/dna/constraints.json`
4. ✅ Budget anti-réflexes : `_core/dna/anti-llm.json`
5. ✅ Séparation direction artistique / palette + couches CSS explicites
6. ✅ Tokens expressifs : surface, profondeur, filets, contrôles, focus, densité, médias
7. ✅ Outillage : `dna-report.js`, `check-constraints.js`, `screenshot.js`, `perceptual-diff.js`
8. ✅ ADN renseigné sur les seize variantes existantes
9. ✅ Deux directions écrites après l'audit — `presse-imprimee`, `terminal-phosphore` —
   pour vérifier que la couche a du pouvoir

### Lot 2 — Diversity Benchmark · ⏭ *prochaine étape*

Les douze références opposées, et les trois critères de réussite décrits
[plus haut](#diversity-benchmark). **C'est un lot de validation, pas de production :
son livrable est une réponse, pas des templates à vendre.**

Si le benchmark échoue, on corrige le modèle. Il vaut mieux le découvrir sur douze
pages que sur cent quarante-cinq.

### Lot 2bis — Reprise des seize pages système

Les seize variantes du lot 1 repassées au nouveau système : ADN honoré, deux
contraintes minimum chacune, budget ramené sous 6, `layout.css` migré dans
`@layer structure`, aucune collision entre elles. C'est le premier vrai test du
processus sur du code existant — et le seul moyen que le lot 1 cesse d'être la
partie la plus uniforme du catalogue.

### Lot 3 — Le socle des trois familles principales

Les cinq premières variantes de `01-vitrine`, `02-boutique` et `03-portfolio`.
Chacune conçue selon le [processus](#processus-de-création-dune-variante), avec
consultation du rapport de couverture **avant** écriture.

Contrainte de lot : les quinze variantes doivent employer **quinze compositions
différentes**. Aucune ne peut être `centered-axial` tant que cette valeur dépasse
40 % du catalogue.

### Lot 4 — Une variante par archétype

Une variante pour chacun des trente et un archétypes. Objectif inchangé — que
l'index transversal soit intégralement navigable — avec la règle ajoutée :
distance ADN ≥ 0.45 entre variantes de même archétype.

### Lot 5 — Les directions spectaculaires

`synthwave` · `brutalist-type` · `geocities` · `terminal-green` · `art-deco` ·
`cyberpunk`, écrites comme de vraies directions artistiques et non comme des
palettes. Coût marginal, effet maximal en démonstration — à condition qu'elles
changent la forme, ce qui est désormais vérifiable : une direction qui ne déplace
pas la distance perceptuelle n'est qu'une palette déguisée.

### Lot 6 — Extraction des blocs

Une fois cinquante variantes produites, les blocs récurrents sont extraits dans
`_core/blocks/`.

> ⚠ **Ce lot est le plus dangereux du catalogue.** Un kit de blocs partagés est,
> par construction, une machine à uniformiser : c'est exactement ce qui a rendu les
> seize pages système interchangeables. Condition d'entrée : chaque bloc extrait
> doit exister en **au moins trois variantes structurellement différentes**, et
> `perceptual-diff.js` doit être relancé après extraction pour vérifier que la
> distance moyenne du catalogue n'a pas baissé.

### Lot 7 et suivants

À la demande, en piochant dans le catalogue selon les besoins réels.

---

## La galerie

Un `gallery/index.html` qui donne accès aux deux axes :

- **entrée par famille** — vitrine, boutique, portfolio…
- **entrée par archétype** — sidebar, split-screen, plein écran…
- filtres croisés architecture × direction × palette, et par tag technique
- sélecteur d'habillage en direct : changer de préréglage sans recharger
- vue « comparer » : la même architecture sous quatre habillages côte à côte
- vignettes générées automatiquement, recherche instantanée
- compteurs : *N architectures · M directions · P palettes · K templates produits*

Sans elle, un dépôt de cent quarante-cinq dossiers est impossible à présenter.
**Elle vaut plus que vingt variantes supplémentaires** — c'est elle, l'outil de vente.

**À ajouter, depuis l'audit :** une **planche-contact** — toutes les vignettes à la
même échelle, sans nom ni étiquette, dans un ordre aléatoire. C'est la vue qui
révèle immédiatement si le catalogue a une signature : les doublons se voient en
deux secondes quand rien n'indique qu'ils sont censés être différents. C'est aussi
la vue à montrer à quelqu'un d'extérieur pour le test humain du benchmark.

---

## Checklist qualité

Une variante n'est finie que quand tout est coché. La checklist du lot 1 ne
vérifiait que la **correction** — et seize pages correctes se sont révélées
interchangeables. La section « singularité » est celle qui manquait.

### Correction — inchangée, elle fonctionne

- [ ] Responsive vérifié à 320 / 768 / 1280 / 1920 px
- [ ] Aucune valeur de couleur en dur hors de `_core/palettes/`
- [ ] Aucun mot orienté métier — libellés neutres et lorem ipsum uniquement
- [ ] Les liens vers les pages non livrées portent `data-stub`
- [ ] Les pages annoncées dans `meta.json` existent réellement
- [ ] Navigation clavier complète, focus toujours visible
- [ ] Contrastes AA minimum — AAA pour `a11y-first` et `high-contrast`
- [ ] `prefers-reduced-motion` respecté
- [ ] Aucune ressource distante (police, CDN, image)
- [ ] Formulaires : labels, `required`, messages d'erreur, état de succès
- [ ] `layout.css` enveloppé dans `@layer structure`

### Singularité — la partie qui manquait

- [ ] `meta.json` déclare les **neuf axes** d'ADN, et chaque valeur tient sa
      `consequence` (vérifié en revue, pas seulement en lecture)
- [ ] **Au moins deux contraintes créatives**, dont **au moins une structurelle**
- [ ] `node _tools/check-constraints.js` passe — contraintes tenues
- [ ] **Budget anti-réflexes ≤ 6**, ou dépassement justifié par écrit dans
      `meta.json.justifications`, en nommant la direction que le réflexe sert
- [ ] `node _tools/dna-report.js` : **aucune collision** (distance ≥ 0.30) et
      **≥ 0.45 avec toute variante de même archétype**
- [ ] `node _tools/perceptual-diff.js` : **aucune collision visuelle** (≥ 0.20)
      avec une architecture différente
- [ ] La variante n'emploie **aucune valeur d'axe déjà au-delà de 40 %** du
      catalogue, sauf raison écrite
- [ ] Le `README.md` de la variante commence par son **intention visuelle**, et
      la règle interne est écrite si la contrainte `controlled-chaos` est portée

### Présentation

- [ ] Testée avec au moins trois préréglages très différents, dont un sombre,
      un brutaliste et un éditorial
- [ ] Captures générées en 1280 / 768 / 375 px
- [ ] Comparaison visuelle faite avec les variantes voisines — et si trop
      proche : **redessinée, pas recoloriée**

> **La règle qui prime sur les autres.** Si une variante passe tous les tests
> automatiques mais qu'un observateur qui ne connaît pas le projet la range
> spontanément avec une autre, elle est à refaire. Les seuils sont des garde-fous,
> pas des juges.

---

## Idées à garder sous le coude

| Idée | Intérêt |
|---|---|
| **Sélecteur de thème en direct** | Changer l'habillage devant le client, sans recharger |
| **Vue comparaison** | La même architecture sous quatre thèmes côte à côte |
| **Mode client** | Une URL de démo qui masque numéros, slugs et jargon technique |
| **Fiche récapitulative** | Un PDF d'une page par choix retenu, à envoyer après le rendez-vous |
| **Export ZIP** | Téléchargement d'un template autonome depuis la galerie |
| **Tags de difficulté** | ⭐ simple · ⭐⭐ moyen · ⭐⭐⭐ avancé, pour estimer un devis |
| **Statistiques du dépôt** | Poids moyen, score Lighthouse, nombre de variantes par famille |
| **CI GitHub Actions** | Lint HTML/CSS, Lighthouse et capture automatiques à chaque PR |
| **Convention de branche** | `archi/<famille>/<variante>` et `theme/<slug>` |

---

## État d'avancement

| | Catalogué | Produit |
|---|---:|---:|
| Architectures | 145 | 16 |
| Archétypes couverts | 31 | 11 |
| Directions artistiques | ~150 | 5 |
| Palettes | ~120 | 5 |
| Préréglages | — | 5 |
| Templates générés | — | 49 |

### Santé de la diversité — mesurée, pas estimée

| Indicateur | Aujourd'hui | Cible | |
|---|---:|---:|---|
| Composition sur axe central | 82 % | ≤ 25 % | ✗ |
| Valeurs de `composition` employées | 5 / 15 | ≥ 12 | ✗ |
| Valeurs de `typography.voice` employées | 1 / 17 | ≥ 10 | ✗ |
| Valeurs de `surface` employées | 1 / 11 | ≥ 7 | ✗ |
| Budget anti-réflexes moyen | 7,8 | ≤ 6 | ✗ |
| Collisions ADN | 34 / 120 | 0 | ✗ |
| Collisions visuelles | 9 | 0 | ✗ |
| Variantes conformes aux contraintes | 0 / 16 | 16 / 16 | ✗ |
| Contrastes sous le seuil AA | 0 | 0 | ✅ |
| Débordements horizontaux | 0 | 0 | ✅ |

**Ce tableau est le vrai état du projet.** Les deux dernières lignes étaient les
seules mesurées jusqu'ici, et elles étaient au vert — d'où l'impression que le
lot 1 était terminé. Les huit autres montrent ce qu'il en était réellement.

Aucune n'est un échec de fabrication : ce sont les mesures d'un système qui n'avait
pas d'axe de diversité. Elles servent de **ligne de base**. Tout l'intérêt du
lot 1R est qu'elles soient désormais chiffrées, reproductibles, et qu'on puisse
voir si elles bougent.

```bash
node _tools/dna-report.js && node _tools/check-constraints.js
node _tools/screenshot.js && node _tools/perceptual-diff.js
```

**Prochaine étape : le [Diversity Benchmark](#diversity-benchmark)** — douze
références opposées, trois critères de réussite. Pas le lot des trois familles
principales : rien ne sert de produire cent vingt-neuf architectures avant de
savoir si le système sait en produire douze qui ne se ressemblent pas.

Prochaine étape : **Lot 2**, le socle de `01-vitrine`, `02-boutique` et `03-portfolio`.

Deux points restent à décider :

- **Démo en ligne** — le dépôt étant privé, GitHub Pages demande un plan payant.
  Alternative : un déploiement Netlify ou Vercel privé. En attendant, la galerie s'ouvre en local.
- **Licence et usage** — usage personnel, livraison client ou revente ? Cela change ce qu'on
  écrit dans le `README.md` de chaque variante.

Le raisonnement qui a mené à cette organisation, les décisions actées et les pistes écartées
avec la condition pour y revenir sont conservés dans [`BRAINSTORM.md`](BRAINSTORM.md).

---

## Ce qui a changé au lot 1R

### Créé

| Fichier | Rôle |
|---|---|
| `_core/dna/schema.json` | Les neuf axes, leurs valeurs, la `consequence` exigée de chacune, les poids perceptuels et les seuils |
| `_core/dna/constraints.json` | Vingt-cinq contraintes créatives, chacune avec sa méthode de vérification |
| `_core/dna/anti-llm.json` | La table des réflexes et leur coût, le budget, les exemptions |
| `_core/presets.json` | Direction + palette sous un nom vendable |
| `_core/palettes/` | `bleu-corporate` · `neon-cyan-magenta` · `jaune-corail` · `encre-journal` · `phosphore-vert` + README |
| `_core/directions/` | `moderne-neutre` (témoin) · `neon-nocturne` · `neo-brutaliste` · `presse-imprimee` · `terminal-phosphore` + README |
| `_tools/dna-report.js` | Couverture des axes, collisions, suggestions de combinaisons inédites |
| `_tools/check-constraints.js` | Contraintes, budget anti-réflexes, hygiène (couleurs en dur, ressources, couches) |
| `_tools/screenshot.js` | Captures multi-viewport + sonde de structure, via Chromium *headless*, sans dépendance |
| `_tools/perceptual-diff.js` | Décodeur PNG + six signatures + comparaison invariante à la palette |
| `benchmark/README.md` | Le plan des douze références et ses critères de réussite |
| `CONTRIBUTING.md` | Le processus d'ajout d'une architecture, d'une direction, d'une palette |

### Modifié

| Fichier | Changement |
|---|---|
| `README.md` | Modèle à trois couches, ADN, contraintes, règles anti-LLM, typographie, mouvement, mémoire de diversité, test visuel, processus, benchmark, feuille de route, checklist, recomptage du catalogue B |
| `BRAINSTORM.md` | §5 à §10 : l'audit, la mesure, le budget, les couches, l'ordre de production, le piège du chaos — et six pistes écartées de plus |
| `_core/tokens.css` | Ordre des couches ; tokens expressifs (densité, rythme, surface, profondeur, filets, contrôles, focus, médias, décoration, système typographique, mouvement) ; densité appliquée à toute l'échelle ; focus paramétrable ; `prefers-reduced-motion` global |
| `_core/reset.css` | Enveloppé dans `@layer reset` |
| `_tools/build.js` | Gère `--preset`, `--direction/--palette`, `--all-presets` ; réécrit les liens en deux couches ; rétrocompatible avec les anciens thèmes |
| `templates/12-systeme/*/meta.json` | Seize fichiers : ADN sur neuf axes, habillage de référence, champs de contraintes |
| `templates/12-systeme/10-tarifs-colonnes/assets/css/layout.css` | Migré dans `@layer structure` — preuve de bout en bout du mécanisme |

### Conservé volontairement

`_core/themes/` (les trois thèmes monolithiques) reste lisible par `build.js` le
temps que les seize variantes du lot 1 soient reprises. La séparation contraste /
focus / mouvement réduit du lot 0 est inchangée : **elle fonctionnait**, et les
nouvelles règles la renforcent au lieu de la remplacer.

### Non-régression vérifiée

Les captures des livrables existants sont **identiques octet pour octet** avant et
après les modifications de `tokens.css`, `reset.css` et le passage aux couches
CSS. `node _tools/check-contrast.js` : trois habillages, seize paires chacun,
toutes conformes.
