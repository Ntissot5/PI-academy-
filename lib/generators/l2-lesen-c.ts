import type { Question } from "./types";
import { lecture, type Texte } from "./data/l2-lecture";

const TEXTES: Texte[] = [
  {
    genre: "petite annonce",
    texte: "Babysitterin gesucht! Wir (Familie Keller, Biel) suchen eine zuverlässige Person für unsere zwei Kinder (4 und 7 Jahre), jeweils am Dienstag- und Donnerstagabend von 18 bis 21 Uhr. Lohn: 15 Franken pro Stunde. Interessiert? Ruf an: 032 123 45 67.",
    questions: [
      ["Que cherche la famille Keller ?", "une baby-sitter", ["une femme de ménage", "un professeur de piano", "un appartement à Bienne"], "« Babysitterin gesucht » : gesucht = recherché(e)."],
      ["Combien d’heures par semaine dure le travail ?", "6 heures", ["3 heures", "4 heures", "15 heures"], "Mardi et jeudi, de 18 h à 21 h : 2 × 3 heures = 6 heures."],
      ["De quel genre de texte s’agit-il ?", "d’une petite annonce", ["d’une lettre personnelle", "d’un article de presse", "d’une recette"], "On cherche quelqu’un, on donne le salaire et un numéro de téléphone : c’est une petite annonce."],
      ["Quel âge ont les enfants ?", "4 et 7 ans", ["2 et 7 ans", "4 et 17 ans", "7 et 15 ans"], "« zwei Kinder (4 und 7 Jahre) »."],
    ],
  },
  {
    genre: "journal intime",
    texte: "Liebes Tagebuch, heute war ein komischer Tag. Zuerst habe ich den Bus verpasst, weil mein Wecker nicht geklingelt hat. Dann habe ich in der Schule gemerkt, dass ich mein Sportzeug vergessen hatte. Aber am Nachmittag kam die beste Nachricht: Ich habe beim Malwettbewerb den ersten Preis gewonnen!",
    questions: [
      ["Pourquoi l’auteure a-t-elle raté le bus ?", "son réveil n’a pas sonné", ["elle était malade", "le bus était en avance", "elle a oublié son sac"], "« weil mein Wecker nicht geklingelt hat » : Wecker = réveil."],
      ["Qu’a-t-elle oublié ?", "ses affaires de sport", ["son pique-nique", "ses devoirs", "son vélo"], "« mein Sportzeug vergessen »."],
      ["Quelle est la bonne nouvelle ?", "elle a gagné un concours de dessin", ["elle a congé demain", "elle a eu une bonne note", "elle a un nouveau réveil"], "« beim Malwettbewerb den ersten Preis gewonnen » : premier prix du concours de dessin."],
      ["De quel genre de texte s’agit-il ?", "d’un journal intime", ["d’une petite annonce", "d’une interview", "d’un règlement"], "« Liebes Tagebuch » : cher journal."],
    ],
  },
  {
    genre: "reportage",
    texte: "Jedes Jahr im Januar findet in Wengen das berühmte Lauberhornrennen statt. Die Abfahrt ist mit rund 4,4 Kilometern die längste im Weltcup. Tausende Zuschauer kommen mit dem Zug, denn Wengen ist autofrei. Für das Dorf ist das Rennen sehr wichtig: Hotels und Restaurants sind ausgebucht.",
    questions: [
      ["Pourquoi les spectateurs viennent-ils en train ?", "parce qu’il n’y a pas de voitures à Wengen", ["parce que le train est gratuit", "parce qu’il neige trop", "parce que la route est fermée en janvier"], "« denn Wengen ist autofrei » : sans voitures."],
      ["Quelle est la particularité de cette descente ?", "c’est la plus longue de la Coupe du monde", ["c’est la plus courte de la Coupe du monde", "elle a lieu en été", "elle est réservée aux jeunes"], "« die längste im Weltcup » : la plus longue."],
      ["Quand a lieu la course ?", "en janvier", ["en mars", "en décembre", "en juin"], "« Jedes Jahr im Januar »."],
      ["Pourquoi la course est-elle importante pour le village ?", "les hôtels et les restaurants sont complets", ["le village gagne une médaille", "les habitants peuvent skier gratuitement", "on construit une nouvelle route"], "« Hotels und Restaurants sind ausgebucht » : complets."],
    ],
  },
  {
    genre: "interview",
    texte: "Reporterin: Lina, du bist 16 und machst eine Lehre als Köchin. Warum? — Lina: Ich koche, seit ich klein bin. Kochen macht mich glücklich. — Reporterin: Was ist schwierig? — Lina: Die Arbeitszeiten. Ich arbeite oft am Abend und am Wochenende. — Reporterin: Und dein Traum? — Lina: Später möchte ich ein eigenes Restaurant in Lausanne eröffnen.",
    questions: [
      ["Quelle formation fait Lina ?", "un apprentissage de cuisinière", ["un apprentissage de boulangère", "des études de journaliste", "un apprentissage de serveuse"], "« eine Lehre als Köchin » : Lehre = apprentissage."],
      ["Qu’est-ce qui est difficile pour Lina ?", "les horaires de travail", ["la cuisine", "les collègues", "le salaire"], "« Die Arbeitszeiten » : elle travaille souvent le soir et le week-end."],
      ["Quel est le rêve de Lina ?", "ouvrir son propre restaurant", ["devenir journaliste", "partir vivre en Allemagne", "arrêter de cuisiner"], "« ein eigenes Restaurant … eröffnen »."],
    ],
  },
  {
    genre: "courrier des lecteurs",
    texte: "Handyverbot an Schulen? Ich bin dagegen. Natürlich sollen die Schüler im Unterricht nicht chatten. Aber das Handy ist auch ein wichtiges Werkzeug: Wir können Wörter nachschlagen, Fotos von der Tafel machen und mit den Eltern in Kontakt bleiben. Ein totales Verbot ist für mich keine Lösung. Besser sind klare Regeln. — Sara, 15, Freiburg",
    questions: [
      ["Quelle est la position de Sara ?", "elle est contre une interdiction totale du téléphone", ["elle veut interdire le téléphone", "elle n’a pas d’avis", "elle veut qu’on chatte en classe"], "« Ich bin dagegen » : je suis contre ; « Ein totales Verbot ist für mich keine Lösung »."],
      ["Que propose Sara ?", "des règles claires", ["une interdiction totale", "des téléphones gratuits", "plus de cours d’informatique"], "« Besser sind klare Regeln »."],
      ["Lequel n’est PAS un argument de Sara ?", "on peut jouer à des jeux", ["on peut chercher des mots", "on peut photographier le tableau", "on peut rester en contact avec les parents"], "Sara parle de chercher des mots, de photographier le tableau et du contact avec les parents ; pas des jeux."],
      ["De quel genre de texte s’agit-il ?", "d’un courrier des lecteurs", ["d’une recette", "d’une petite annonce", "d’un journal intime"], "Une lectrice donne son opinion, signée avec son âge et sa ville : courrier des lecteurs."],
    ],
  },
  {
    genre: "article",
    texte: "Immer mehr Jugendliche in der Schweiz kaufen Kleider aus zweiter Hand. Das ist gut für die Umwelt: Für ein neues T-Shirt braucht man nämlich viel Wasser und Energie. Ausserdem sind Secondhand-Kleider billiger. Kritiker sagen aber, dass man in Secondhand-Läden nicht immer die richtige Grösse findet.",
    questions: [
      ["Quel est le thème de l’article ?", "les vêtements de seconde main", ["la mode de luxe", "le recyclage du papier", "les uniformes scolaires"], "« Kleider aus zweiter Hand » : vêtements de seconde main."],
      ["Quel argument POUR est donné ?", "c’est bon pour l’environnement et moins cher", ["c’est plus à la mode", "il y a plus de choix", "les vêtements sont neufs"], "« gut für die Umwelt » et « billiger » (moins cher)."],
      ["Quelle critique est mentionnée ?", "on ne trouve pas toujours la bonne taille", ["c’est trop cher", "les magasins sont trop loin", "les vêtements sont démodés"], "« nicht immer die richtige Grösse » : pas toujours la bonne taille."],
    ],
  },
];

/** Lesen (9e-11e) : annonces, journal, reportage, interview, courrier des lecteurs, article. */
export function gen(): Question {
  return lecture(TEXTES, "Lis :");
}
