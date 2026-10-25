# Proposer un nouveau parcours

Ce guide est pour toi si tu enseignes et que tu veux proposer un parcours (par ex. « 10e Harmos · Géométrie ») sans écrire de code.

Un parcours, c’est une suite d’**unités**. Chaque unité a :

| Champ | À quoi ça sert | Exemple |
|---|---|---|
| `titre` | Le nom de l’unité | Nombres négatifs |
| `sous_titre` | Une petite phrase sous le titre | Plus, moins et les signes |
| `regle` | La règle à retenir, en 2–3 phrases | Moins un négatif, ça fait plus… |
| `exemple` | Un calcul résolu, sur une ligne | −3 − (−4) = −3 + 4 = 1 |
| `image` | L’analogie racontée par Pi | Pense au thermomètre… |
| `piege` | L’erreur classique à éviter | 12 + (−18) = −6, pas 6… |
| `id_generateur` | Le type d’exercices (liste ci-dessous) | `rel` |

Les exercices sont créés automatiquement par l’application. Tu choisis simplement le type :

| `id_generateur` | Exercices | Réponse |
|---|---|---|
| `rel`, `frac`, `pow`, `eq1`, `geo`, `iso`, `lin`, `eq2`, `trig`, `log`, `der` | Mathématiques (négatifs, fractions, puissances, équations, aires et volumes, formules, droites, 2e degré, trigonométrie, logarithmes, dérivées) | nombre |
| `fr-present`, `fr-imparfait`, `fr-futur`, `fr-pc` | Français : conjugaison aux 4 temps | texte |
| `fr-homophones` | Français : a/à, et/est, son/sont, ou/où, ces/ses, on/ont, ce/se, peu/peut | choix |
| `fr-nature` | Français : nature des mots | choix |
| `de-artikel` | Allemand : der, die, das | choix |
| `de-praesens`, `de-zahlen`, `de-perfekt` | Allemand : présent, nombres, Perfekt | texte |
| `en-present`, `en-irregular` | Anglais : present simple, verbes irréguliers | texte |
| `sci-unites`, `sci-masse-volumique`, `sci-electricite` | Sciences : unités, masse volumique, loi d’Ohm | nombre |
| `chi-symboles` | Chimie : symboles des éléments | texte |
| `geo-cantons`, `geo-suisse` | Géographie : cantons, repères suisses | texte ou choix |
| `hist-suisse`, `hist-monde` | Histoire : grandes dates | choix |
| `cit-federal`, `cit-canton` | Citoyenneté : Confédération, ton canton | choix |
| `final` | Examen final : mélange toutes les unités du parcours | — |

Besoin d’un type d’exercice qui n’existe pas ? Décris-le (avec 3 exemples de questions et leurs réponses) et transmets-le : il faudra le programmer.

## Conseils d’écriture

- Tutoie l’élève, phrases courtes.
- Une règle = ce qu’on doit pouvoir réciter. Pas plus de 3 phrases.
- L’analogie (`image`) parle du quotidien de ton public : argent de poche, sport, cuisine, météo…
- Le piège : l’erreur que tu vois le plus souvent en classe, avec la bonne réponse.
- Termine le parcours par une unité `final`.

## Méthode 1 : l’écran admin

Il faut un compte avec le rôle « admin » (à demander à la personne qui gère la plateforme).

1. Connecte-toi, puis clique sur **Admin : contenu des parcours** en bas de la page des parcours (ou va sur `/admin`).
2. À gauche, la liste des parcours et de leurs unités. Clique sur une unité.
3. Modifie le titre, le sous-titre, la règle, l’exemple, l’image ou le piège, puis **Enregistrer l’unité**. Le lien **Voir la page →** montre le résultat tel que les élèves le voient.
4. Les flèches ↑ ↓ à côté du nom d’un parcours changent l’ordre des parcours dans le catalogue.
5. **Réglages du parcours** : titre, niveau, accroche (le grand titre du bandeau), description, public, icône.

Pour créer un parcours entier d’un coup, prépare un fichier JSON (méthode 2), puis, dans l’écran admin, carte « Fichier JSON » → **Importer un fichier…**. Sans la case « Remplacer les textes… », les unités qui existent déjà ne sont pas touchées. **Télécharger tous les parcours** te donne un fichier complet à recopier comme modèle.

## Méthode 2 : un fichier JSON

Copie ce modèle dans un fichier texte (par ex. `mon-parcours.json`) et remplis-le. Ensuite, soit tu l’importes toi-même depuis l’écran admin, soit tu l’envoies à l’admin, qui peut aussi le charger avec `npm run pb:seed -- mon-parcours.json`.

```json
{
  "parcours": [
    {
      "slug": "10e-geometrie",
      "titre": "10e Harmos · Géométrie",
      "accroche": "La géométrie de la 10e, pas à pas",
      "description": "3 unités, 20 minutes par jour. Tu lis la règle, tu t’entraînes, tu bats le boss de l’unité.",
      "public": "ecole",
      "niveau": "10e Harmos",
      "icone": "folder",
      "ordre": 3,
      "payant": false,
      "matiere": "mathematiques",
      "plan": "per",
      "annee_min": 10,
      "annee_max": 10,
      "cantons": [],
      "statut": "a_valider",
      "unites": [
        {
          "ordre": 1,
          "id_generateur": "geo",
          "titre": "Aires et volumes",
          "sous_titre": "Mesurer l’espace",
          "regle": "…",
          "exemple": "…",
          "image": "…",
          "piege": "…",
          "icone": "folder"
        },
        {
          "ordre": 2,
          "id_generateur": "final",
          "titre": "Examen final : 10e Géométrie",
          "sous_titre": "Tout le parcours mélangé",
          "regle": "Questions tirées des unités du parcours. Réussis 8 sur 10 sans aide pour valider le parcours.",
          "exemple": "Mélange : …",
          "image": "…",
          "piege": "…",
          "icone": "star"
        }
      ]
    }
  ]
}
```

Règles du fichier :

- `slug` : minuscules, chiffres et tirets seulement, unique (il apparaît dans l’adresse).
- `public` : `ecole` ou `adulte`.
- `matiere` : `mathematiques`, `sciences`, `francais`, `allemand`, `anglais`, `geographie`, `histoire` ou `citoyennete`.
- `plan` : `per` (Plan d’études romand), `lp21` (Lehrplan 21), `pds` (Tessin) ou `libre` (toute la Suisse).
- `annee_min` / `annee_max` : années Harmos (9 à 11 pour le cycle 3).
- `cantons` : laisse `[]` pour tous les cantons, ou mets des abréviations (`["VD", "GE"]`) pour réserver le parcours à ces cantons.
- `statut` : `a_valider` tant qu’il n’a pas été relu (badge « Bêta »), puis `publie`.
- `ordre` : 1, 2, 3… dans l’ordre où les élèves avancent. Une unité se débloque quand le boss de la précédente est battu.
- `icone` : une des icônes en verre bleu : `flower`, `report`, `molecule`, `pin`, `folder`, `mail`, `plane`, `note`, `eye`, `cal31`, `laptop`, `star`.
- Les guillemets typographiques (’ « ») sont bienvenus dans les textes ; les guillemets droits `"` doivent être écrits `\"`.

Le modèle complet des parcours existants est dans `pocketbase/seed/parcours.json`.
