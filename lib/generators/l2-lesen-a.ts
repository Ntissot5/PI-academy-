import type { Question } from "./types";
import { lecture, type Texte } from "./data/l2-lecture";

const TEXTES: Texte[] = [
  {
    genre: "présentation",
    texte: "Hallo! Ich heisse Lena. Ich bin zehn Jahre alt. Ich wohne in Sitten. Ich habe einen Bruder und eine Katze. Die Katze heisst Mimi.",
    questions: [
      ["Quel âge a Lena ?", "10 ans", ["12 ans", "9 ans", "11 ans"], "« Ich bin zehn Jahre alt » : zehn = 10."],
      ["Quel animal a Lena ?", "un chat", ["un chien", "un lapin", "un cheval"], "« eine Katze » = un chat. Elle s’appelle Mimi."],
      ["Où habite Lena ?", "à Sion", ["à Berne", "à Zurich", "à Bâle"], "« Ich wohne in Sitten » : Sitten, c’est Sion en allemand."],
      ["Qui est Mimi ?", "le chat de Lena", ["la sœur de Lena", "l’amie de Lena", "la maîtresse"], "« Die Katze heisst Mimi » : le chat s’appelle Mimi."],
    ],
  },
  {
    genre: "présentation",
    texte: "Mein Name ist Tom. Meine Lieblingsfarbe ist Blau. Ich spiele gern Fussball. Ich esse gern Pizza, aber ich mag keine Tomaten.",
    questions: [
      ["Quelle est la couleur préférée de Tom ?", "le bleu", ["le rouge", "le vert", "le jaune"], "« Meine Lieblingsfarbe ist Blau » : Lieblings- = préféré."],
      ["Quel sport aime Tom ?", "le football", ["le tennis", "le ski", "la natation"], "« Ich spiele gern Fussball »."],
      ["Qu’est-ce que Tom n’aime pas ?", "les tomates", ["la pizza", "le football", "le bleu"], "« ich mag keine Tomaten » : keine = pas de."],
    ],
  },
  {
    genre: "consigne",
    texte: "Nimm deine Farbstifte. Male den Hund braun und die Sonne gelb. Schreib deinen Namen unten auf das Blatt.",
    questions: [
      ["De quelle couleur faut-il colorier le chien ?", "brun", ["jaune", "rouge", "bleu"], "« Male den Hund braun » : braun = brun."],
      ["De quelle couleur faut-il colorier le soleil ?", "jaune", ["brun", "orange", "rouge"], "« die Sonne gelb » : gelb = jaune."],
      ["Où faut-il écrire son nom ?", "en bas de la feuille", ["en haut de la feuille", "au dos de la feuille", "sur le chien"], "« unten auf das Blatt » : unten = en bas."],
    ],
  },
  {
    genre: "dialogue",
    texte: "— Guten Morgen, Frau Meier! — Guten Morgen, Sara! Wie geht es dir? — Gut, danke. Und Ihnen? — Sehr gut, danke.",
    questions: [
      ["À quel moment de la journée se passe ce dialogue ?", "le matin", ["le soir", "la nuit", "à midi"], "« Guten Morgen » = bonjour, le matin."],
      ["Comment va Sara ?", "bien", ["mal", "elle est malade", "elle est triste"], "« Gut, danke » = bien, merci."],
      ["Que veut dire « danke » ?", "merci", ["bonjour", "s’il te plaît", "au revoir"], "danke = merci ; bitte = s’il te plaît."],
    ],
  },
  {
    genre: "emploi du temps",
    texte: "Am Montag habe ich Sport. Am Dienstag habe ich Musik. Am Mittwoch spiele ich mit Ben. Am Donnerstag lese ich ein Buch. Am Freitag besuche ich Oma.",
    questions: [
      ["Quel jour l’élève a-t-il de la musique ?", "mardi", ["lundi", "vendredi", "jeudi"], "« Am Dienstag habe ich Musik » : Dienstag = mardi."],
      ["Que fait l’élève le vendredi ?", "il rend visite à sa grand-mère", ["il lit un livre", "il fait du sport", "il joue avec Ben"], "« Am Freitag besuche ich Oma » : Oma = grand-maman."],
      ["Avec qui joue l’élève le mercredi ?", "avec Ben", ["avec Oma", "avec Tom", "tout seul"], "« Am Mittwoch spiele ich mit Ben »."],
    ],
  },
  {
    genre: "invitation",
    texte: "Einladung! Ich habe Geburtstag. Ich werde elf. Komm am Samstag um drei Uhr zu mir. Wir essen Kuchen und spielen im Garten. Bis bald, Mia",
    questions: [
      ["Pourquoi Mia écrit-elle ?", "pour inviter à son anniversaire", ["pour dire merci", "pour demander un livre", "pour annoncer un match"], "« Einladung » = invitation ; « Geburtstag » = anniversaire."],
      ["Quand est la fête ?", "samedi à 3 heures", ["dimanche à 3 heures", "samedi à 11 heures", "lundi à 3 heures"], "« am Samstag um drei Uhr » = samedi à 3 heures."],
      ["Quel âge aura Mia ?", "11 ans", ["3 ans", "10 ans", "12 ans"], "« Ich werde elf » : elf = 11."],
      ["Que vont faire les enfants ?", "manger du gâteau et jouer au jardin", ["regarder un film", "aller à la piscine", "faire leurs devoirs"], "« Wir essen Kuchen und spielen im Garten »."],
    ],
  },
];

/** Lesen (5e-6e) : textes très simples et très courts. */
export function gen(): Question {
  return lecture(TEXTES, "Lis :");
}
