import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

const CAT = {
  nom: ["Hund", "Schule", "Haus", "Freund", "Tisch", "Sonne", "Buch", "Katze"],
  verbe: ["spielen", "gehen", "lesen", "schreiben", "wohnen", "trinken", "lernen", "spielt"],
  adjectif: ["gross", "klein", "rot", "schön", "alt", "müde", "lustig", "kalt"],
  pronom: ["ich", "er", "wir", "ihn", "mich", "uns", "es"],
  déterminant: ["ein", "eine", "einen", "mein", "meine", "dein", "kein", "keine"],
} as const;
type Cat = keyof typeof CAT;
const LIB: Record<Cat, string> = {
  nom: "un nom (Nomen)", verbe: "un verbe (Verb)", adjectif: "un adjectif (Adjektiv)", pronom: "un pronom (Pronomen)", déterminant: "un déterminant (Artikel)",
};

/** Wortarten : reconnaître la catégorie d'un mot ; les noms prennent toujours une majuscule. */
export function gen(): Question {
  const cats = Object.keys(CAT) as Cat[];
  if (R(0, 2) === 0) {
    const nom = pick(CAT.nom);
    // Leurres qui ne peuvent pas être des noms : verbes conjugués, adjectifs, pronoms, déterminants.
    const autres = [pick(["spielt", "geht", "liest", "wohnt", "trinkt"]), pick(["müde", "lustig", "schnell", "langsam"]), pick(CAT.pronom), pick(CAT.déterminant)];
    return {
      q: "Tout est écrit en minuscules. Quel mot devrait prendre une majuscule en allemand ?",
      txt: 1,
      a: nom.toLowerCase(),
      choices: propositions(nom.toLowerCase(), autres),
      why: `${nom} est un nom : en allemand, tous les noms prennent une majuscule, où qu’ils soient dans la phrase.`,
    };
  }
  const c = pick(cats);
  const mot = pick(CAT[c]);
  return {
    q: `<b>${mot}</b>, c’est…`,
    txt: 1,
    a: LIB[c],
    choices: propositions(LIB[c], cats.filter((x) => x !== c).map((x) => LIB[x])),
    why: `${mot} : ${LIB[c]}.${c === "nom" ? " Majuscule : c’est un nom." : c === "verbe" ? " L’infinitif se termine par -en (ou -n)." : ""}`,
  };
}
