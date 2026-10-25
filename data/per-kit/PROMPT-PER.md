# Prompt Claude Code — Référentiel PER complet pour Pi Academy

> À coller dans Claude Code, à la racine du repo `PI-academy-`, après avoir dézippé `per-kit.zip` dans `data/per-kit/`.

---

## Contexte

Pi Academy doit couvrir **toutes les années de la 1re à la 11e** (Harmos), en **Mathématiques, Sciences de la nature, Français, Allemand, Anglais, Géographie, Histoire et Citoyenneté**. **Chaque exercice doit porter un code PER et une année.**

Le dossier `data/per-kit/` contient :
- `tool/extract.mjs` : un extracteur testé de l'API publique du Plan d'études romand (`https://per.ciip.ch/api/bdper`, celle qu'utilise portail.ciip.ch). Il recopie le texte officiel mot pour mot et attribue à chaque notion son année d'après la colonne du tableau officiel.
- `reference/` : les 24 fichiers déjà produits le 25.10.2026 et le fichier brut `PER_brut_api.json` (SHA-256 commençant par `12dc5c1911b24d25`), qui servent de témoin.
- `mapping_generateurs_PER.json` : le rattachement des 12 générateurs existants à leurs codes PER.

## Étape 1 — Extraire le PER à jour

```bash
cd data/per-kit/tool && npm i linkedom@0.18.5 && node extract.mjs ../../per
```
Sans 3e argument, le script télécharge directement l'API (environ 2 minutes, avec une pause de 150 ms entre les requêtes). Il écrit dans `data/per/` :
- `PER_<discipline>_cycle<1|2|3>.json` (24 fichiers), `index.json` ;
- `PER_brut_api.json` (copie brute, pour pouvoir rejouer sans réseau) ;
- `PER_precisions_cantonales.json` (précisions GE, VS… rattachées aux objectifs).

**Contrôle obligatoire.** Compare `data/per/` avec `data/per-kit/reference/` :
- s'il n'y a aucune différence, c'est OK ;
- s'il y a des différences, liste-les-moi. Ce sont soit des mises à jour du PER par la CIIP, soit un bug. N'invente rien et ne corrige pas le texte officiel.

Règles sur les données :
- le texte officiel ne se modifie jamais ;
- une valeur introuvable s'écrit `"INTROUVABLE"`.

## Étape 2 — Programme année par année

Génère `data/per/programme_par_annee.json` à partir des 24 fichiers :
```json
{ "annee": "9e", "disciplines": [ { "discipline": "Mathématiques", "objectifs": [
  { "code": "MSN 32", "titre": "...", "notions": [
    { "notion": "Calculs", "plage": "9e-10e", "niveau": "Niv 2-3", "contenu": ["..."] } ] } ] } ] }
```
- Une progression marquée « 9e-11e » apparaît en 9e, en 10e et en 11e, avec `"plage": "9e-11e"`.
- Extrais `niveau` des mentions « (Niv …) » présentes dans le texte, sans les retirer du texte.
- Ajoute `reperes_par_annee` quand il existe. Par exemple, Histoire 9e : « Antiquité à Moyen Âge ».
- Les années vont de 1re à 11e. L'Allemand commence en 5e, l'Anglais en 7e : c'est normal qu'ils manquent avant.

## Étape 3 — Modèle de données de l'app

1. Ajoute une collection **`per_notion`** : `code`, `discipline`, `cycle`, `annee_debut`, `annee_fin`, `notion`, `contenu`, `niveau`, `source_url`. Importe-la depuis `programme_par_annee.json` via un seed.
2. Chaque **unité** et chaque **générateur d'exercice** référence au moins une `per_notion`. Tout exercice doit avoir `per_code` et `annee` ; sans eux, il ne passe pas la validation.
3. Applique `mapping_generateurs_PER.json` aux 12 générateurs existants. Les unités Trigonométrie, Logarithmes et Dérivées, ainsi que le Δ de l'unité 2e degré, restent **hors PER**, avec le tag `secondaire_II`, et n'apparaissent que dans le parcours Prépa EPFL.
4. Crée automatiquement **un parcours par année et par discipline** (« Maths 9e », « Français 7e »…). Chaque notion PER y devient une leçon. Une notion sans générateur est affichée « Bientôt » : elle reste visible mais verrouillée.
5. Dans l'espace prof, le filtre se fait par année, discipline et code PER. Le tableau de maîtrise affiche les codes PER.

## Étape 4 — Couverture

Génère `docs/COUVERTURE-PER.md` :
- un tableau année × discipline avec le nombre de notions PER, le nombre couvert par au moins un générateur et le pourcentage ;
- la liste des 20 notions les plus prioritaires sans exercice. La priorité va d'abord à MSN 32/33/34 et L1 en 9e–11e, puis aux cycles 2 et 1.

## Étape 5 — Précisions cantonales (GE, VD, FR, VS, NE, JU, BE)

Source : `data/per-kit/sources_cantonales.json`.
1. Télécharge uniquement les documents marqués `"acces": "public"` dans `data/cantons/<canton>/`. Les 21 prescriptions de Genève se construisent à partir de `url_modele`. **Ne tente jamais de te connecter** aux documents marqués `"login"`.
2. Extrais le texte avec `pdftotext -layout`. Pour les tableaux, comme l'annexe « résumé des apprentissages » de Genève, utilise `pdfplumber` (Python) pour garder les colonnes 9e / 10e / 11e.
3. Produis `data/cantons/cantons.json`, avec une entrée par canton :
```json
{ "canton": "GE", "documents": [ { "titre": "...", "url": "...", "annee_scolaire": "2026-2027" } ],
  "grille_horaire": [ { "annee": "9e", "discipline": "Mathématiques", "periodes": 5, "filiere": "toutes" } ],
  "niveaux_filieres": [ { "niveau_per": "Niv 1", "filieres": ["R1", "CT"] } ],
  "repartition_par_annee": [ { "code": "MSN 32", "annee": "10e", "notion": "Notation scientifique", "filieres": ["toutes"] } ],
  "evaluations": [ { "annee": "11e", "discipline": "Mathématiques", "type": "EVACOM / TAF" } ] }
```
4. Recopie le texte tel qu'il est dans le PDF. Si une valeur n'est pas lisible ou est absente, écris `"INTROUVABLE"`.
5. Dans l'app, un prof peut choisir son canton. Le parcours de l'année affiche alors la répartition cantonale si elle existe, et celle du PER sinon.

## Règles

- Pas d'exercice sans `per_code`.
- Le texte PER affiché aux profs est copié tel quel, avec un lien vers `source_url`.
- Les élèves voient une formulation simplifiée, rédigée séparément. Le texte officiel n'est pas modifié.
- Licence : le PER appartient à la CIIP. Ajoute une mention « Source : Plan d'études romand, © CIIP » dans le pied de page et dans `README.md`. Avant la mise en production publique, attends ma confirmation : j'aurai écrit à la CIIP (ciip@ne.ch).

## Méthode

Présente-moi d'abord ton plan en 8 lignes maximum. Fais ensuite l’étape 1 et montre-moi le résultat du contrôle avant de passer aux étapes 2 à 5.
