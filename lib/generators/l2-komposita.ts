import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

type Art = "der" | "die" | "das";
// [mot composé, article, 1er mot (article, sens), 2e mot (article, sens), traduction]
const K: [string, Art, [string, string], [string, string], string][] = [
  ["Handschuh", "der", ["die Hand", "la main"], ["der Schuh", "la chaussure"], "le gant"],
  ["Kühlschrank", "der", ["kühl", "frais"], ["der Schrank", "l’armoire"], "le frigo"],
  ["Bahnhof", "der", ["die Bahn", "le chemin de fer"], ["der Hof", "la cour"], "la gare"],
  ["Hausaufgabe", "die", ["das Haus", "la maison"], ["die Aufgabe", "la tâche"], "le devoir (à la maison)"],
  ["Geburtstag", "der", ["die Geburt", "la naissance"], ["der Tag", "le jour"], "l’anniversaire"],
  ["Schlafzimmer", "das", ["schlafen", "dormir"], ["das Zimmer", "la pièce"], "la chambre à coucher"],
  ["Fussball", "der", ["der Fuss", "le pied"], ["der Ball", "le ballon"], "le football"],
  ["Apfelsaft", "der", ["der Apfel", "la pomme"], ["der Saft", "le jus"], "le jus de pomme"],
  ["Kinderzimmer", "das", ["die Kinder", "les enfants"], ["das Zimmer", "la pièce"], "la chambre d’enfant"],
  ["Sonnenbrille", "die", ["die Sonne", "le soleil"], ["die Brille", "les lunettes"], "les lunettes de soleil"],
  ["Regenschirm", "der", ["der Regen", "la pluie"], ["der Schirm", "l’écran, le parapluie"], "le parapluie"],
  ["Zahnbürste", "die", ["der Zahn", "la dent"], ["die Bürste", "la brosse"], "la brosse à dents"],
  ["Schneemann", "der", ["der Schnee", "la neige"], ["der Mann", "l’homme"], "le bonhomme de neige"],
  ["Spielplatz", "der", ["spielen", "jouer"], ["der Platz", "la place"], "la place de jeux"],
  ["Wörterbuch", "das", ["die Wörter", "les mots"], ["das Buch", "le livre"], "le dictionnaire"],
  ["Haustier", "das", ["das Haus", "la maison"], ["das Tier", "l’animal"], "l’animal de compagnie"],
  ["Stundenplan", "der", ["die Stunde", "l’heure"], ["der Plan", "le plan"], "l’horaire (des cours)"],
  ["Klassenzimmer", "das", ["die Klasse", "la classe"], ["das Zimmer", "la pièce"], "la salle de classe"],
  ["Lieblingsfarbe", "die", ["der Liebling", "le préféré"], ["die Farbe", "la couleur"], "la couleur préférée"],
  ["Schokoladenkuchen", "der", ["die Schokolade", "le chocolat"], ["der Kuchen", "le gâteau"], "le gâteau au chocolat"],
  ["Taschengeld", "das", ["die Tasche", "la poche"], ["das Geld", "l’argent"], "l’argent de poche"],
  ["Badezimmer", "das", ["baden", "se baigner"], ["das Zimmer", "la pièce"], "la salle de bains"],
  ["Hauptstadt", "die", ["das Haupt", "la tête"], ["die Stadt", "la ville"], "la capitale"],
  ["Schultasche", "die", ["die Schule", "l’école"], ["die Tasche", "le sac"], "le sac d’école"],
  ["Tischtennis", "das", ["der Tisch", "la table"], ["das Tennis", "le tennis"], "le ping-pong"],
];

/** Komposita : repérer les mots connus dans un mot composé ; c'est le dernier mot qui donne l'article. */
export function gen(): Question {
  const k = pick(K);
  const [mot, art, m1, m2, fr] = k;
  const nu = (s: string) => s.replace(/^(der|die|das) /, "");
  const decoupe = `${nu(m1[0])} (${m1[1]}) + ${nu(m2[0])} (${m2[1]})`;
  const t = R(0, 2);
  if (t === 0) {
    return {
      q: `Mot composé : <b>… ${mot}</b> (${fr}). Quel article ?`,
      txt: 1,
      a: art,
      choices: ["der", "die", "das"],
      hint: "Cherche le dernier mot caché dedans.",
      why: `${mot} = ${decoupe} : c’est le dernier mot qui décide, ${m2[0]} → ${art} ${mot}.`,
    };
  }
  if (t === 1) {
    return {
      q: `Que signifie <b>${mot}</b> ? Indice : ${decoupe}.`,
      txt: 1,
      a: fr,
      choices: propositions(fr, K.filter((x) => x !== k).map((x) => x[4])),
      why: `${mot} = ${decoupe} → ${fr}.`,
    };
  }
  return {
    q: `Quel mot connu se cache à la fin de <b>${mot}</b> ?`,
    txt: 1,
    a: nu(m2[0]),
    choices: propositions(nu(m2[0]), [nu(m1[0]), ...K.filter((x) => x !== k).map((x) => nu(x[3][0]))]),
    why: `${mot} = ${decoupe}. Le dernier mot (${m2[0]}) donne le sens principal et l’article.`,
  };
}
