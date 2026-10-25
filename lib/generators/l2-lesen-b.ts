import type { Question } from "./types";
import { lecture, type Texte } from "./data/l2-lecture";

const TEXTES: Texte[] = [
  {
    genre: "carte postale",
    texte: "Liebe Oma, ich bin mit Mama und Papa in Luzern. Das Wetter ist super: Die Sonne scheint jeden Tag. Gestern waren wir auf dem Pilatus. Heute gehen wir ins Verkehrshaus. Das Essen im Hotel ist lecker, aber das Zimmer ist ein bisschen klein. Viele Grüsse, dein Noah",
    questions: [
      ["Où est Noah ?", "à Lucerne", ["à Berne", "à Genève", "à Bâle"], "« ich bin … in Luzern » : Luzern = Lucerne."],
      ["Quel temps fait-il ?", "il fait beau", ["il pleut", "il neige", "il y a du vent"], "« Die Sonne scheint jeden Tag » : le soleil brille tous les jours."],
      ["Qu’est-ce qui ne plaît pas tout à fait à Noah ?", "la chambre est un peu petite", ["la nourriture", "le temps", "le Pilatus"], "« aber das Zimmer ist ein bisschen klein »."],
      ["Qu’a fait la famille hier ?", "elle est allée sur le Pilatus", ["elle est allée au musée des transports", "elle est allée à la piscine", "elle est restée à l’hôtel"], "« Gestern waren wir auf dem Pilatus ». Le Verkehrshaus, c’est pour aujourd’hui (heute)."],
    ],
  },
  {
    genre: "courriel",
    texte: "Hallo Jonas, wie geht’s? Ich habe eine neue Schule. Meine Klasse ist nett, aber Mathe ist schwer. Mein Lieblingsfach ist Sport. In der Pause spiele ich Basketball mit Luca. Am Mittwochnachmittag habe ich frei. Kannst du am Mittwoch zu mir kommen? Schreib bald! Elias",
    questions: [
      ["Quelle branche est difficile pour Elias ?", "les maths", ["le sport", "l’allemand", "la musique"], "« Mathe ist schwer » : schwer = difficile."],
      ["Que fait Elias à la récréation ?", "il joue au basket avec Luca", ["il joue au foot avec Jonas", "il lit un livre", "il mange"], "« In der Pause spiele ich Basketball mit Luca »."],
      ["Que demande Elias à Jonas ?", "de venir chez lui mercredi", ["de l’aider en maths", "de lui prêter un ballon", "de changer d’école"], "« Kannst du am Mittwoch zu mir kommen? »"],
      ["Quand Elias est-il libre ?", "le mercredi après-midi", ["le samedi matin", "le lundi", "pendant la récréation"], "« Am Mittwochnachmittag habe ich frei »."],
    ],
  },
  {
    genre: "affiche",
    texte: "Sommerfest im Schulhaus Bachmatt! Samstag, 21. Juni, von 14 bis 18 Uhr. Spiele, Musik und Kuchenbuffet. Eintritt frei! Bei Regen in der Turnhalle.",
    questions: [
      ["De quoi s’agit-il ?", "d’une fête d’été à l’école", ["d’un concert en ville", "d’un match de football", "d’un cours de cuisine"], "« Sommerfest im Schulhaus » = fête d’été au collège."],
      ["Combien coûte l’entrée ?", "c’est gratuit", ["5 francs", "14 francs", "18 francs"], "« Eintritt frei » = entrée libre."],
      ["S’il pleut, où a lieu la fête ?", "dans la salle de gym", ["elle est annulée", "dans le parc", "à la gare"], "« Bei Regen in der Turnhalle » : Turnhalle = salle de gym."],
      ["À quelle heure finit la fête ?", "à 18 heures", ["à 14 heures", "à 21 heures", "à minuit"], "« von 14 bis 18 Uhr » : de 14 h à 18 h."],
    ],
  },
  {
    genre: "petite histoire",
    texte: "Max hat einen Hund. Er heisst Bello. Jeden Morgen geht Max mit Bello in den Park. Heute ist Bello weg! Max sucht ihn überall: im Garten, in der Küche, unter dem Bett. Dann hört er etwas im Schrank. Bello schläft auf Papas Pullover!",
    questions: [
      ["Que se passe-t-il aujourd’hui ?", "Bello a disparu", ["Bello est malade", "Max est malade", "Max a un nouveau chien"], "« Heute ist Bello weg! » : weg = parti, disparu."],
      ["Où Max retrouve-t-il Bello ?", "dans l’armoire", ["sous le lit", "dans le jardin", "dans la cuisine"], "« Dann hört er etwas im Schrank » : Schrank = armoire."],
      ["Que fait Bello ?", "il dort", ["il mange", "il aboie", "il joue"], "« Bello schläft » : schlafen = dormir."],
    ],
  },
  {
    genre: "recette",
    texte: "Fruchtsalat für vier Personen: Schneide zwei Äpfel, eine Banane und eine Orange in kleine Stücke. Gib die Früchte in eine Schüssel. Gib den Saft von einer Zitrone dazu. Stell den Salat eine Stunde in den Kühlschrank.",
    questions: [
      ["Pour combien de personnes est cette recette ?", "4", ["2", "1", "6"], "« für vier Personen » : vier = 4."],
      ["Combien de pommes faut-il ?", "deux", ["une", "quatre", "trois"], "« zwei Äpfel » : Äpfel est le pluriel de Apfel."],
      ["Que fait-on à la fin ?", "on met la salade une heure au frigo", ["on la mange tout de suite", "on la cuit", "on ajoute du sucre"], "« Stell den Salat eine Stunde in den Kühlschrank »."],
    ],
  },
  {
    genre: "dialogue",
    texte: "— Guten Tag! Ich möchte ein Brot und sechs Brötchen, bitte. — Gern. Sonst noch etwas? — Ja, haben Sie Gipfeli? — Leider nein, die Gipfeli sind schon weg. — Schade. Was kostet das? — Sieben Franken fünfzig.",
    questions: [
      ["Où se passe ce dialogue ?", "dans une boulangerie", ["à la gare", "à l’école", "chez le médecin"], "On achète du pain (Brot), des petits pains (Brötchen) et des croissants (Gipfeli)."],
      ["Pourquoi le client n’a-t-il pas de croissants ?", "il n’y en a plus", ["ils sont trop chers", "il n’en veut pas", "ils ne sont pas encore cuits"], "« die Gipfeli sind schon weg » : il n’y en a déjà plus."],
      ["Combien paie le client ?", "7 fr. 50", ["6 fr. 50", "17 fr. 50", "7 fr. 15"], "« Sieben Franken fünfzig » = 7 francs 50."],
    ],
  },
];

/** Lesen (7e-8e) : textes simples et courts (carte postale, courriel, affiche, histoire, recette, dialogue). */
export function gen(): Question {
  return lecture(TEXTES, "Lis :");
}
