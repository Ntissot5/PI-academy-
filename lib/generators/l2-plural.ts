import { pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";
import { NOMEN } from "./data/l2-woerter";

const UML: Record<string, string> = { a: "ä", o: "ö", u: "ü", A: "Ä", O: "Ö", U: "Ü" };
/** Met un tréma sur la dernière voyelle a/o/u (au → äu). */
function umlaut(w: string): string {
  const m = w.match(/^(.*?)(au|a|o|u)([^aeiouäöü]*(?:e[lnr]?)?)$/i);
  if (!m) return w;
  const v = m[2].toLowerCase() === "au" ? (m[2][0] === "A" ? "Äu" : "äu") : UML[m[2]];
  return m[1] + v + m[3];
}

function regle(sg: string, pl: string): string {
  if (pl === sg) return "même forme qu’au singulier (souvent pour les mots en -er, -el, -chen)";
  if (pl.endsWith("innen")) return "les noms féminins en -in prennent -nen";
  if (pl.endsWith("s") && !sg.endsWith("s")) return "-s pour beaucoup de mots venus d’autres langues ou finissant par une voyelle (Auto, Velo, Sofa)";
  const um = pl.slice(0, sg.length) !== sg;
  if (pl.endsWith("er") && !sg.endsWith("er")) return `-er${um ? " avec tréma" : ""}`;
  if (pl.endsWith("en") || (pl.endsWith("n") && sg.endsWith("e"))) return pl.endsWith("en") && !sg.endsWith("e") ? "-en" : "-n (après -e)";
  if (pl.endsWith("e")) return `-e${um ? " avec tréma" : ""}`;
  return um ? "tréma seulement" : "pluriel à mémoriser";
}

/** Plural : la marque du pluriel des noms courants. L'article au pluriel est toujours « die ». */
export function gen(): Question {
  const n = pick(NOMEN.filter((x) => x.pl));
  const pl = n.pl as string;
  const sg = n.de;
  const base = sg.endsWith("e") ? sg.slice(0, -1) : sg;
  const ub = umlaut(base);
  const formes = [sg, base + "e", base + "en", sg + "s", base + "er", ub + "e", ub + "er", sg.endsWith("e") ? sg + "n" : sg + "en"];
  const leurres = formes.filter((f) => f !== pl && f !== "Busen").map((f) => `die ${f}`);
  return {
    q: `Pluriel de <b>${n.art} ${sg}</b> (${n.fr}) ?`,
    txt: 1,
    a: `die ${pl}`,
    choices: propositions(`die ${pl}`, leurres),
    why: `${n.art} ${sg} → die ${pl} : ${regle(sg, pl)}. Au pluriel, l’article est toujours die.`,
  };
}
