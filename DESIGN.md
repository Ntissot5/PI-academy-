---
name: route-epfl-art-direction
description: Direction artistique de Route EPFL (plateforme de maths gamifiée, mascotte Pi, icônes en verre bleu). À charger pour tout écran, composant ou page de la plateforme. Ne pas improviser hors de ce document.
---

# Route EPFL — Direction artistique

Source de vérité visuelle : `reference/route-epfl.html` (prototype validé par Noa le 25 oct. 2026).
Toute nouvelle page doit être visuellement indiscernable de ce prototype. En cas de doute, copier le CSS du prototype, ne pas réinventer.

## 1. Esprit
- Plateforme de cours claire, façon Khan Academy / Coursera : fond blanc-bleuté, cartes blanches, beaucoup d'air.
- Toute la couleur vient des **icônes en verre bleu** et de **Pi**. L'interface reste calme autour.
- Ton : tutoiement, phrases courtes, encourageant, jamais infantilisant.

## 2. Tokens (copier tels quels)
```css
:root{
  --bg:#F5F7FC; --surface:#FFFFFF; --ink:#0D1B3E; --muted:#5A6684; --line:#E2E8F3;
  --brand:#2356E8; --brand-2:#3AA8F4; --ice:#EAF1FF; --ice-2:#F4F8FF;
  --ok:#14966A; --ok-soft:#E2F5EC; --bad:#D2433F; --bad-soft:#FCEBEA;
  --m0:#E2E8F3; --m1:#C3D4FF; --m2:#7EA2FF; --m3:#2356E8;   /* niveaux de maîtrise */
  --shadow:0 1px 2px rgba(13,27,62,.06),0 6px 24px rgba(35,86,232,.07);
}
/* Dark (prefers-color-scheme ET [data-theme="dark"]) */
--bg:#0A1022; --surface:#111A33; --ink:#E9EEFB; --muted:#97A4C6; --line:#22305A;
--brand:#6E97FF; --brand-2:#5CC4FF; --ice:#14224B; --ice-2:#0F1A3A;
--ok:#4CD496; --ok-soft:#12352A; --bad:#FF7B76; --bad-soft:#3A1C24;
--m0:#22305A; --m1:#2E4690; --m2:#4E74E0; --m3:#7FA3FF;
```
Interdits : autre teinte d'accent, violet, dégradés arc-en-ciel, couleurs en dur hors tokens.

## 3. Typographie (Google Fonts)
- Titres : **Lexend** 600/700, letter-spacing −0.015em, `text-wrap:balance`.
- Texte : **Figtree** 400–700, 16 px, line-height 1.55.
- Maths, scores, chiffres : **JetBrains Mono** 500/700, `tabular-nums`.
- Sur-titres (« UNITÉ 3 », « LA RÈGLE ») : 0.75–0.8rem, 700, uppercase, letter-spacing .08em, couleur `--brand`.

## 4. Formes
- Rayons : cartes 16 px · hero et carte de question 20 px · boutons/inputs 12 px · chips 99 px · tuile d'icône 18 px.
- Bordure 1 px `--line` + `--shadow` sur les cartes. Hover d'une carte cliquable : translateY(−2px) + bordure `--brand`.
- Bouton principal : fond `--brand`, texte blanc, 700, ombre bleue douce. Variantes : ghost (blanc, bordure), dark (`--ink`).
- Cartes « Boss » et « Examen final » : dégradé `--ink` → mélange ink/brand, texte clair, accent `--brand-2`.

## 5. Icônes (dossier `icons/`, WebP détourés)
Toujours avec `filter: drop-shadow(0 6px 10px rgba(35,86,232,.18))`, posées sur une tuile `--ice-2` (rayon 18 px) dans les listes.

| Rôle | Fichier |
|---|---|
| Mascotte Pi (corps) | blob |
| Série de jours | fire |
| XP, boss, examen final | star |
| Objectif du jour | calendar |
| Unité verrouillée | lock |
| Entraînement | plane |
| Unités maths 1→11 | flower, report, molecule, pin, folder, mail, plane, note, eye, cal31, laptop |
| Réserve (nouveaux parcours) | — réutiliser en priorité ; nouvelles icônes = même style verre bleu, fond transparent |

Ne jamais utiliser d'emoji ni d'icônes vectorielles génériques à la place.

## 6. Pi, la mascotte
- Corps : `icons/blob.webp` (320×219). Visage : SVG superposé, `viewBox="0 0 320 219"`, groupe `transform="translate(160 88) scale(1.45) translate(-160 -88)"`.
- 4 expressions (code SVG exact dans `reference/route-epfl.html`, objet `FACES`) :
  - `idle` : yeux ovales blancs + pupilles, petit sourire, joues roses, clignement.
  - `happy` : yeux en ^ ^, bouche ouverte, joues marquées. Animation `jump`.
  - `sad` : sourcils inclinés, bouche à l'envers. Animation `shake`.
  - `think` : pupilles en haut, bouche droite (pendant une question).
- Animations : `bob` au repos (3,2 s), `jump` sur bonne réponse, `shake` sur erreur, confettis aux couleurs brand/ok/or quand un boss est battu.
- Pi parle via une bulle blanche (rayon 16 px, ombre). Messages courts, tutoiement.

## 7. Composants à reproduire
1. **Barre du haut** sticky : logo (mini-Pi + « Route EPFL »), chips série (fire) et XP (star).
2. **Hero du parcours** : sur-titre, titre, sous-titre, barre « Maîtrise du cours » en dégradé brand → brand-2, Pi + bulle + CTA « Continuer · Unité N ».
3. **Carte objectif du jour** : anneau 20 min, 28 carrés de jours (m0 / m1 / m3).
4. **Carte d'unité** : tuile icône 72 px, sur-titre, titre, sous-titre, 3 carrés de compétences (Leçon / Entraînement / Boss), lien d'action à droite.
5. **Page d'unité** : fil d'Ariane, en-tête avec grande icône, article (Règle, Exemple en mono sur `--ice-2`, encadré Pi « En image », encadré rouge « Le piège classique »), colonne d'actions (Entraînement, Boss).
6. **Quiz** : barre de progression verte, carte question (police mono pour les maths), input + touches − / , ; bande de correction en bas, verte ou rouge, avec Pi qui réagit.
7. **Résultat** : Pi géant, score en Lexend 3rem, 3 KPI (XP, série, minutes), corrections, boutons.

## 8. Maîtrise
4 niveaux, toujours avec ces couleurs : Pas commencé `--m0` · Tenté `--m1` · Familier `--m2` (entraînement ≥ 8/10) · Maîtrisé `--m3` (boss ≥ 8/10).

## 9. Règles
- Mobile d'abord (400 px), gouttière ≥ 16 px, pas de scroll horizontal.
- Clair et sombre obligatoires, via les tokens.
- `prefers-reduced-motion` coupe toutes les animations.
- Données d'élèves mineurs : pseudo ou prénom seulement, pas d'e-mail obligatoire.
