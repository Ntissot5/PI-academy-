# Pi Academy

Plateforme d’apprentissage gamifiée, en français (Suisse romande), pour les élèves de 9e–11e Harmos suivis par leur prof et pour les adultes qui visent le niveau d’entrée EPFL. Mascotte : Pi. Tout est gratuit.

Matières : mathématiques, sciences de la nature, français, allemand, anglais, géographie, histoire, citoyenneté. Chaque utilisateur (ou classe) choisit son canton : les parcours de son plan d’études (Plan d’études romand, Lehrplan 21, Piano di studio tessinois) passent en premier, et certaines questions portent sur son canton.

- **Front** : Next.js 15 (App Router, TypeScript strict), CSS du prototype repris tel quel (`styles/`), polices auto-hébergées (`@fontsource`, aucun appel à Google).
- **Back** : PocketBase (auth, base, règles d’accès, routes `pb_hooks`).
- **Exercices** : générés et corrigés dans le navigateur (`lib/generators`). Seuls les résultats partent au serveur.
- **Référence visuelle** : `DESIGN.md` et `reference/route-epfl.html`. Le nom affiché vient de `lib/config.ts` (`APP_NAME`).

## Lancer en local

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

Deux applications Dokploy depuis ce repo :

1. **PocketBase** : type Dockerfile, contexte `pocketbase/`, port 8090, **volume persistant monté sur `/pb/pb_data`**. Domaine par ex. `api.pi-academy.ch`. Puis, dans le terminal Dokploy : `/pb/pocketbase superuser upsert <email> <mot de passe> --dir=/pb/pb_data`.
2. **Web** : type Dockerfile, contexte racine, port 3000, argument de build `NEXT_PUBLIC_PB_URL=https://api.pi-academy.ch` (lu au build : reconstruire si l’URL change). Domaine par ex. `pi-academy.ch`.
3. Depuis ta machine : `PB_URL=https://api.pi-academy.ch PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… npm run pb:seed` (sans `--demo` en production si tu ne veux pas les comptes démo).
4. Dans PocketBase → Settings : régler l’URL de l’application, SMTP si tu veux la réinitialisation de mot de passe, et activer le *rate limiting* (en plus du blocage PIN, il freine les essais de codes de classe).
5. Te donner le rôle admin : dashboard PocketBase → `users` → ton compte → `role = admin`.

Les migrations (`pocketbase/pb_migrations`) s’appliquent toutes seules au démarrage.

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

## Contenu des nouvelles matières

Les parcours de français, allemand, anglais, sciences, géographie, histoire et citoyenneté sont marqués **Bêta** (`statut = a_valider`) : le contenu est écrit à partir de faits vérifiables (conjugaisons, institutions, dates), mais il doit être relu par des enseignant·es avant d’être présenté comme conforme au plan d’études. L’admin passe un parcours en « Publié » une fois relu.

- Les cantons et leur plan d’études sont dans `lib/cantons.ts` (26 cantons, chefs-lieux, langues). Les institutions cantonales (parlement, gouvernement) y sont renseignées pour BE, FR, TI, VD, VS, NE, GE et JU ; pour les autres cantons, la question « Ton canton » porte sur un de ces cantons, en le nommant.
- Les parcours de langues et de sciences suivent le Plan d’études romand : pour un canton du Lehrplan 21 ou le Tessin, ils restent visibles, avec la mention « Autre plan d’études ».
- Pas de contenu pour Arts et Corps et mouvement : ces domaines ne se prêtent pas à une correction automatique.

## Limites connues

- **Correction côté client, triche possible.** Les exercices sont générés et corrigés dans le navigateur ; le serveur fait confiance au champ `ok` de chaque réponse. Un élève qui bricole les requêtes peut s’attribuer des XP ou valider un boss. Accepté pour le MVP ; une correction serveur demanderait de générer les questions côté serveur (ou de signer les tirages).
- L’URL de PocketBase est figée au build de l’appli (`NEXT_PUBLIC_PB_URL`).
- Pas de paiement : le champ `parcours.payant` existe mais n’est pas utilisé (phase 3).
