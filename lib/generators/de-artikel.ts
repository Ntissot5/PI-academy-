import { pick } from "../math";
import type { Question } from "./types";

// [nom allemand, article, traduction] — orthographe suisse (Strasse, Velo).
const NOMS: [string, "der" | "die" | "das", string][] = [
  ["Hund", "der", "le chien"], ["Katze", "die", "le chat"], ["Haus", "das", "la maison"], ["Tisch", "der", "la table"],
  ["Schule", "die", "l’école"], ["Buch", "das", "le livre"], ["Apfel", "der", "la pomme"], ["Banane", "die", "la banane"],
  ["Auto", "das", "la voiture"], ["Baum", "der", "l’arbre"], ["Stadt", "die", "la ville"], ["Kind", "das", "l’enfant"],
  ["Vater", "der", "le père"], ["Mutter", "die", "la mère"], ["Mädchen", "das", "la fille"], ["Lehrer", "der", "l’enseignant"],
  ["Fenster", "das", "la fenêtre"], ["Tür", "die", "la porte"], ["Stuhl", "der", "la chaise"], ["Uhr", "die", "la montre"],
  ["Wasser", "das", "l’eau"], ["Milch", "die", "le lait"], ["Käse", "der", "le fromage"], ["Brot", "das", "le pain"],
  ["Berg", "der", "la montagne"], ["See", "der", "le lac"], ["Sonne", "die", "le soleil"], ["Mond", "der", "la lune"],
  ["Velo", "das", "le vélo"], ["Zimmer", "das", "la chambre"], ["Küche", "die", "la cuisine"], ["Garten", "der", "le jardin"],
  ["Woche", "die", "la semaine"], ["Tag", "der", "le jour"], ["Jahr", "das", "l’année"], ["Freundin", "die", "l’amie"],
  ["Zug", "der", "le train"], ["Flugzeug", "das", "l’avion"], ["Bahnhof", "der", "la gare"], ["Strasse", "die", "la rue"],
];

/** Der, die ou das ? */
export function gen(): Question {
  const [nom, art, fr] = pick(NOMS);
  return {
    q: `${fr} : <b>… ${nom}</b>`,
    txt: 1,
    a: art,
    choices: ["der", "die", "das"],
    why: `${art} ${nom}${nom === "Mädchen" ? " : les mots en -chen sont toujours neutres." : nom.endsWith("e") && art === "die" ? " : beaucoup de noms en -e sont féminins." : "."}`,
  };
}
