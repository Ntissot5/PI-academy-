# Documents cantonaux officiels (étape 5 du PROMPT-PER)

Téléchargés le 25.10.2026 depuis les sites officiels via le navigateur. **Ne rien retélécharger** : tout est ici. L'environnement Claude Code ne peut pas joindre ces sites.

| Canton | Contenu | Remarques |
|---|---|---|
| GE | 21 « Prescriptions cantonales concernant l'application du PER » (année 2026-2027) : maths, sciences, français, allemand, anglais, géographie, histoire, citoyenneté × 1P-4P / 5P-8P / CO | Dotation horaire, correspondance niveaux PER ↔ regroupements (R1/R2/R3, CT/LC/LS), MER, évaluations (EVACOM, TAF), **annexe « résumé des apprentissages du PER » par année** |
| VD | Grilles horaires cycles 1, 2, 3 (VP/VG) ; complément cantonal PER Mathématiques et physique | Pas de répartition notion par année publiée |
| FR | Grille horaire CO (partie francophone) ; directives changement de type de classe (EB, G, PG) ; parcours scolaire ; informations aux parents CO | `directives_changement_type_classe.txt` = **OCR** (PDF scanné) |
| VS | Grille horaire CO dès 2014-2015 ; grille horaire école primaire 2024 ; grille des classes d'observation du CO | `DCE_grille_horaire_EP_2024.txt` et `Grille_horaire_des_classes_d%27observation_du_CO.txt` = **OCR** |
| NE | Arrêté grilles horaires de l'école obligatoire 2025-2026 ; RSN 410.313.1 | — |
| JU | Arrêté grilles horaires des écoles primaires et secondaires (01.08.2026) | — |
| BE (francophone) | Dispositions générales complétant le PER (2019, mod. 2023) : §3.4 grille du secondaire I par section (p, m, g), niveaux A/B/C, grilles 1re-8e | — |

Structure de chaque dossier : `pdf/` (originaux), `txt/` (texte extrait avec `pdftotext -layout`, ou OCR Tesseract français pour les scans), `sources.json` (titre, URL d'origine, taille, SHA-256). GE a en plus `textes_bruts.json` (extraction pdf.js).

**Non inclus** : les 28 précisions VS et BE rattachées au PER sur bdper.plandetudes.ch (répartition annuelle des sciences en 9CO, différenciation NI-NII, Français C3 BE…). Elles sont derrière une authentification et n'ont pas été récupérées. Elles restent listées avec leur URL dans `data/per-kit/reference/PER_precisions_cantonales.json`.

## Pour construire `cantons.json`
- Pour les tableaux (annexes GE, grilles horaires), préfère `pdfplumber` sur `pdf/` à `txt/` : il conserve les colonnes par année.
- Vérifie toujours les textes OCR contre le PDF, en particulier les chiffres des grilles horaires. En cas de doute, écris `"INTROUVABLE"`.
- Le texte officiel ne se modifie pas.
