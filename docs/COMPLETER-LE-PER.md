# Compléter le PER

Pi Academy est prévu pour se compléter petit à petit. La liste des notions à faire en priorité est dans `docs/COUVERTURE-PER.md` ; chaque notion sans exercice apparaît dans l’app comme leçon « Bientôt ».

## Ajouter des exercices pour une notion « Bientôt »

1. **Le générateur** : un fichier `lib/generators/<id>.ts` qui renvoie une question (voir les autres, par ex. `litt-valeur.ts`). L’ajouter dans `lib/generators/index.ts` (`GENERATORS`, `GENERATOR_LABEL`, `DEFAULT_ICON`).
2. **Le rattachement PER** : une entrée dans `lib/per-generateurs.json`, avec pour chaque lien le code, la notion et la plage **exactement** comme dans `data/per/PER_<discipline>_cycle<n>.json`, et un extrait du texte officiel (`cherche`).
3. **La leçon** (règle, exemple, image, piège) : dans `pocketbase/seed/lecons.json`.
4. Lancer :
   ```bash
   node scripts/build-per-content.mjs     # vérifie le rattachement, place l'exercice dans les parcours par année
   node scripts/per-couverture.mjs        # met à jour docs/COUVERTURE-PER.md
   npm test                               # chaque question doit porter un code PER et une année
   ```
   Le script s’arrête si un lien ne retrouve pas le texte officiel.

**Une fois le site en ligne** : la base a déjà appliqué `1761700001_per_contenu.js`. Il faut alors lancer `node scripts/build-per-content.mjs --nouvelle-migration`, qui écrit un nouveau fichier de migration. Au redémarrage, PocketBase ajoute les nouveaux exercices aux parcours par année, remet l’ordre du PER et retire les « Bientôt » remplacés. La progression des élèves et les textes retouchés dans l’admin sont gardés.

## Ajouter ou mettre à jour un document cantonal

1. Déposer le PDF dans `data/cantons/<canton>/pdf/` et compléter `sources.json` (titre, URL, SHA-256).
2. Recopier ce qu’il dit dans `data/cantons/<canton>/canton.json` (répartition par année, grilles horaires, niveaux, évaluations) ; « INTROUVABLE » si ce n’est pas lisible.
3. `node scripts/build-cantons.mjs` contrôle tout (codes PER, années, fichiers) et met à jour l’app.

Les précisions VS et BE de bdper.plandetudes.ch (derrière une connexion) pourront s’ajouter de la même façon si on y a accès.

## Mettre à jour le PER (nouvelle version de la CIIP)

Depuis une machine qui a accès à `per.ciip.ch` :

```bash
cd data/per-kit/tool && npm i && node extract.mjs ../../per
node ../../../scripts/per-programme.mjs && node ../../../scripts/build-per-content.mjs --nouvelle-migration
```

Comparer d’abord `data/per/` avec `data/per-kit/reference/` : une différence est soit une mise à jour de la CIIP, soit un bug. Le texte officiel ne se corrige jamais à la main. Si une progression change, sa clé change : le script signale les rattachements à revoir.

## Relecture

Les parcours par année sont « Bêta » tant que les rattachements n’ont pas été relus par un·e enseignant·e (tableau « Rattachement des exercices » de `docs/COUVERTURE-PER.md`). Dans l’admin, passer un parcours en « Publié » une fois relu.
