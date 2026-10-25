# Pi Academy

Plateforme d’apprentissage gamifiée, en français (Suisse romande), pour les élèves de 9e–11e Harmos suivis par leur prof et pour les adultes qui visent le niveau d’entrée EPFL. Mascotte : Pi. Tout est gratuit.

Matières : mathématiques, sciences de la nature, français, allemand, anglais, géographie, histoire, citoyenneté. Chaque utilisateur (ou classe) choisit son canton : les parcours de son plan d’études (Plan d’études romand, Lehrplan 21, Piano di studio tessinois) passent en premier, et certaines questions portent sur son canton.

- **Front** : Next.js 15 (App Router, TypeScript strict), CSS du prototype repris tel quel (`styles/`), polices auto-hébergées (`@fontsource`, aucun appel à Google).
- **Back** : PocketBase (auth, base, règles d’accès, routes `pb_hooks`).
- **Exercices** : générés et corrigés dans le navigateur (`lib/generators`). Seuls les résultats partent au serveur.
- **Référence visuelle** : `DESIGN.md` et `reference/route-epfl.html`. Le nom affiché vient de `lib/config.ts` (`APP_NAME`).

## Lancer en local

**En une commande** (Mac ou Linux, avec Node.js installé) : `npm run demo`. Tout démarre (PocketBase, contenu, comptes démo, site) et le navigateur s’ouvre sur http://localhost:3000.

Étape par étape :

Prérequis : Node 22, `curl` et `unzip` (le script télécharge PocketBase tout seul).

```bash
npm install

# 1. PocketBase (terminal 1)
bash scripts/pocketbase.sh superuser upsert admin@example.ch un-mot-de-passe-solide
npm run pb                      # http://127.0.0.1:8090/_/

# 2. Contenu de départ + comptes démo (une fois)
PB_SUPERUSER_EMAIL=admin@example.ch PB_SUPERUSER_PASSWORD=un-mot-de-passe-solide npm run pb:seed -- --demo

# 3. Application (terminal 2)
npm run dev                     # http://localhost:3000
```

Comptes démo (tous marqués « démo », aucune donnée réelle) :

| Rôle | Identifiant | Mot de passe / PIN |
|---|---|---|
| Adulte | `adulte.demo@example.ch` | `demo-adulte-2026` |
| Prof | `prof.demo@example.ch` | `demo-prof-2026` |
| Élèves | `Démo-Alex`, `Démo-Sam`, `Démo-Lou` (classe « Classe démo 9e », code affiché par le seed ; Sam et Lou apparaissent « bloqués ») | PIN `1234` |

Avec Docker : `docker compose up --build`, puis les étapes 1 (superuser, via `docker compose exec pocketbase /pb/pocketbase superuser upsert … --dir=/pb/pb_data`) et 2 avec `PB_URL=http://localhost:8090`.

Pour te donner le rôle admin : dans le tableau de bord PocketBase (`/_/`), collection `users`, mets `role = admin` sur ton compte.

## Tests

```bash
npm test             # Vitest : 12 générateurs × 1 000 tirages, fidélité au prototype, parse/fr, dates Zurich
npm run test:e2e     # Playwright : démarre un PocketBase jetable (8091) et l’appli (3001)
                     # adulte (inscription → boss → autre appareil), prof + élève (temps réel, bloqués, PIN), blocage PIN, admin
npm run typecheck
```

`tests/unit/fidelite.test.ts` exécute le moteur du prototype et le portage TypeScript avec la même graine : ils doivent produire exactement les mêmes questions.

Captures comparées prototype ↔ appli (400 px et desktop, clair et sombre) :

```bash
NEXT_PUBLIC_E2E=1 npx next build && NEXT_PUBLIC_E2E=1 npx next start &
PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/captures.mjs captures/
```

## Ajouter un parcours

Voir `docs/AJOUTER-UN-PARCOURS.md` (guide sans code). En bref : ajouter le parcours et ses unités dans un fichier JSON au format de `pocketbase/seed/parcours.json` (champs `matiere`, `plan`, `annee_min`, `annee_max`, `cantons`, `statut` compris), puis l’importer depuis `/admin` ou avec `npm run pb:seed -- mon-fichier.json`. Chaque unité référence un générateur existant par `id_generateur` (liste et libellés dans `lib/generators/index.ts`, `GENERATOR_LABEL`) ; l’unité `final` mélange toutes les unités de son parcours.

Le seed ne modifie jamais un parcours ou une unité qui existe déjà, sauf avec `--force`.

## Ajouter un générateur

1. Créer `lib/generators/<id>.ts` qui exporte `gen(ctx?): Question` (`{ q, a, accept?, choices?, keys?, tol?, hint?, txt?, why }`).
   - `a` nombre : corrigé avec `tol` (clavier − / ,).
   - `a` texte : comparé sans majuscules ni espaces en trop, accents exigés, ß = ss ; `accept` liste les variantes ; `keys` les touches d’accents.
   - `choices` : QCM, `a` doit en faire partie.
   - `ctx.canton` : canton de l’élève (ex. `cit-canton`). `q` peut contenir `<sup>`, `<sub>`, `<b>`, rien d’autre.
2. L’enregistrer dans `GENERATORS`, `GENERATOR_LABEL` et `DEFAULT_ICON` (`lib/generators/index.ts`).
3. `npm test` : le test des 1 000 tirages le prend automatiquement (pas de `NaN`, pas d’énoncé vide, bonne réponse acceptée, QCM sans doublon).
4. L’utiliser dans une unité via `id_generateur`.

## Déployer sur Dokploy

Une seule application Dokploy, de type **Compose**, avec `docker-compose.prod.yml`. Le site et PocketBase sont servis à la même adresse : le proxy (`deploy/caddy/Caddyfile`) envoie `/api` et `/_` (administration) à PocketBase, et tout le reste au site.

1. Dokploy → **Create Service → Compose** → dépôt GitHub, branche, chemin `docker-compose.prod.yml`.
2. Onglet **Environment** : `PB_SUPERUSER_EMAIL=…` et `PB_SUPERUSER_PASSWORD=…` (compte d'administration PocketBase, créé ou mis à jour à chaque démarrage).
3. Onglet **Domains** : service `proxy`, port `80`, ton domaine (ou le domaine gratuit proposé par Dokploy), HTTPS activé.
4. **Deploy**. Les données restent dans le volume `pb_data` entre deux déploiements.
5. Dans PocketBase (`https://ton-domaine/_/`) → Settings : l'URL de l'application, le SMTP si besoin, et le *rate limiting*.
6. Te donner le rôle admin dans l'app : `users` → ton compte → `role = admin`.

Testé sans Docker en reproduisant le proxy (inscription, séries, tableau prof en temps réel, blocage PIN).

Les migrations (`pocketbase/pb_migrations`) s’appliquent toutes seules au démarrage, contenu de départ compris (`1761600000_contenu.js`, généré depuis `pocketbase/seed/parcours.json` par `node scripts/build-content-migration.mjs`) : un PocketBase neuf a directement ses matières, parcours et unités. Le seed reste utile pour les comptes démo (`--demo`).

## Données et règles

- **Rôles** (`users.role`) : `eleve`, `prof`, `adulte`, `admin`. L’inscription publique n’accepte que `adulte` et `prof`.
- **Élèves** : pseudo (unique dans la classe, sans tenir compte des majuscules) + PIN 4 chiffres + code de classe. Pas d’e-mail. Le PIN est le mot de passe PocketBase de l’élève, donc haché en bcrypt ; la connexion standard par e-mail leur est fermée, ils passent par `POST /api/pi/eleve/rejoindre` et `POST /api/pi/eleve/connexion` (5 essais ratés, puis blocage 10 min). Le prof peut donner un nouveau PIN (ce qui débloque) ou retirer l’élève (compte et progression supprimés).
- **Prof** : `GET /api/pi/prof/classe/{id}` renvoie la grille élèves × unités et les élèves bloqués (aucune session depuis 7 jours, ou boss d’une unité non validée raté 2 fois ou plus). L’écran s’abonne en temps réel aux progressions, sessions, erreurs et arrivées d’élèves.
- **Admin** (`/admin`, rôle `admin`) : textes des unités, réglages et ordre des parcours, import/export JSON.
- **Écritures de progression** : uniquement via `POST /api/pi/serie` et `POST /api/pi/lecon`. Les collections `progressions`, `sessions`, `erreurs` sont en lecture seule pour le client.
- **Séries** : le client envoie l’état cumulé de la série (à l’abandon, quand l’onglet passe en arrière-plan, à la fin). Le serveur n’enregistre que le nouveau : minutes et erreurs d’une série quittée sont gardées, rien n’est compté deux fois. Hors ligne, la série est mise en attente et renvoyée au prochain chargement.
- **Dates** : jour de session, série de jours, objectif du jour et calendrier 28 jours calculés côté serveur en Europe/Zurich (`pocketbase/pb_hooks/lib/zurich.js`, testé sur les changements d’heure).
- **Lecture** : chacun voit ses données ; un prof voit les élèves de ses classes seulement ; l’admin voit tout.
- **Protection des mineurs** : pas d’e-mail ni de nom complet pour les élèves, pas d’analytics ni de traceur tiers, polices servies par l’appli.

## Plan d’études romand (PER)

Source : Plan d’études romand, © CIIP. Le texte officiel est repris tel quel ; il n’est jamais modifié. Avant une mise en production publique, l’accord de la CIIP (ciip@ne.ch) est attendu.

- **Texte officiel** : `data/per/` (24 fichiers par discipline et par cycle), extrait de l’API publique du PER par `data/per-kit/tool/extract.mjs` (voir `data/per-kit/PROMPT-PER.md`). Contrôle : les fichiers sont identiques à ceux de `data/per-kit/reference/`.
- **Programme par année** : `node scripts/per-programme.mjs` → `data/per/programme_par_annee.json` (1re à 11e) et `data/per/per_notions.json` (une progression officielle par ligne, avec une clé stable).
- **Rattachement des exercices** : `lib/per-generateurs.json` (code + notion + plage + extrait du texte officiel). `node scripts/build-per-content.mjs` vérifie chaque lien contre le texte officiel et produit `lib/per-liens.json`, les champs PER de `pocketbase/seed/parcours.json`, `pocketbase/seed/parcours-per.json` (un parcours par année et par discipline) et la migration `1761700001_per_contenu.js`.
- **Règle** : pas d’exercice sans code PER ni année. Chaque question générée porte `per_code` et `annee` ; une unité sans code PER ou sans année est refusée par le serveur. Trigonométrie, logarithmes, dérivées et le Δ du 2e degré sont `secondaire_II` (hors PER) et n’existent que dans la Prépa EPFL.
- **Parcours par année** : « Maths 9e », « Français 7e »… une leçon par notion du PER ; une notion sans exercice est affichée « Bientôt », visible mais verrouillée. Ces parcours sont marqués Bêta tant que les rattachements ne sont pas relus.
- **Pour les profs** : chaque unité montre le texte officiel visé, avec le lien vers la source, et la répartition du canton de la classe quand il en publie une (`data/cantons/cantons.json`, copié dans `public/data/`). Les élèves ne voient que les titres et les explications de l’app.
- **Cantons** (GE, VD, FR, VS, NE, JU, BE francophone) : documents officiels dans `data/cantons/<canton>/pdf/` (téléchargés via le navigateur, avec URL et SHA-256 dans `sources.json`), extraits dans `data/cantons/<canton>/canton.json` (grilles horaires, niveaux et filières, répartition par année, évaluations ; texte recopié, « INTROUVABLE » sinon). `node scripts/build-cantons.mjs` contrôle et rassemble tout dans `data/cantons/cantons.json` et `public/data/cantons.json`. Seul Genève publie une répartition notion par année pour toutes les disciplines ; Vaud, pour l’option Mathématiques et physique (codes cantonaux MEP 31-34).
- **Couverture** : `node scripts/per-couverture.mjs` → `docs/COUVERTURE-PER.md` (tableau année × discipline, 20 notions prioritaires sans exercice, rattachements à relire).
- **Compléter plus tard** (nouveaux exercices, documents cantonaux, nouvelle version du PER) : `docs/COMPLETER-LE-PER.md`.

Les exercices sont créés par la plateforme et ne reprennent pas ceux des moyens d’enseignement romands, protégés par le droit d’auteur.

## Contenu des nouvelles matières

Les parcours de français, allemand, anglais, sciences, géographie, histoire et citoyenneté sont marqués **Bêta** (`statut = a_valider`) : le contenu est écrit à partir de faits vérifiables (conjugaisons, institutions, dates), mais il doit être relu par des enseignant·es avant d’être présenté comme conforme au plan d’études. L’admin passe un parcours en « Publié » une fois relu.

- Les cantons et leur plan d’études sont dans `lib/cantons.ts` (26 cantons, chefs-lieux, langues). Les institutions cantonales (parlement, gouvernement) y sont renseignées pour BE, FR, TI, VD, VS, NE, GE et JU ; pour les autres cantons, la question « Ton canton » porte sur un de ces cantons, en le nommant.
- Les parcours de langues et de sciences suivent le Plan d’études romand : pour un canton du Lehrplan 21 ou le Tessin, ils restent visibles, avec la mention « Autre plan d’études ».
- Pas de contenu pour Arts et Corps et mouvement : ces domaines ne se prêtent pas à une correction automatique.

## Limites connues

- **Correction côté client, triche possible.** Les exercices sont générés et corrigés dans le navigateur ; le serveur fait confiance au champ `ok` de chaque réponse. Un élève qui bricole les requêtes peut s’attribuer des XP ou valider un boss. Accepté pour le MVP ; une correction serveur demanderait de générer les questions côté serveur (ou de signer les tirages).
- L’URL de PocketBase est figée au build de l’appli (`NEXT_PUBLIC_PB_URL`).
- Pas de paiement : le champ `parcours.payant` existe mais n’est pas utilisé (phase 3).
