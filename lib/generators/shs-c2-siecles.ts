import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

/** Chiffres romains (1 à 39). */
function romain(n: number): string {
  const t = ["", "X", "XX", "XXX"][Math.floor(n / 10)];
  const u = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][n % 10];
  return t + u;
}
const siecle = (annee: number) => Math.floor((annee - 1) / 100) + 1;

/** Cycle 2 · mesurer le temps historique : siècles, chiffres romains, durées, avant / après J.-C. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) {
    const y = R(101, 2025);
    const s = siecle(y);
    const a = `${romain(s)}e siècle`;
    const faux = [...new Set([s - 1, s + 1, Math.floor(y / 100)].filter((x) => x !== s && x > 0))].map((x) => `${romain(x)}e siècle`);
    return {
      q: `En quel siècle se trouve l’année ${y} ?`, txt: 1, a, choices: shuffle([a, ...faux.slice(0, 3)]),
      why: `Le ${romain(s)}e siècle va de l’an ${(s - 1) * 100 + 1} à l’an ${s * 100}. ${y} en fait partie.`,
    };
  }
  if (t === 1) {
    const s = R(2, 21);
    return { q: `Le ${romain(s)}e siècle : quel est le nombre en chiffres arabes ?`, txt: 1, a: s, why: `${romain(s)} = ${s}. Le ${s}e siècle va de ${(s - 1) * 100 + 1} à ${s * 100}.` };
  }
  if (t === 2) {
    const [ev1, y1, ev2, y2] = pick([
      ["la bataille de Morgarten", 1315, "la bataille de Marignan", 1515],
      ["la naissance de l’État fédéral suisse", 1848, "le droit de vote des femmes au niveau fédéral", 1971],
      ["l’arrivée de Christophe Colomb en Amérique", 1492, "le début de la Révolution française", 1789],
      ["le Pacte fédéral", 1291, "la naissance de l’État fédéral suisse", 1848],
      ["la bataille de Sempach", 1386, "la bataille de Marignan", 1515],
    ] as const);
    return { q: `Combien d’années séparent ${ev1} (${y1}) et ${ev2} (${y2}) ?`, txt: 1, a: y2 - y1, why: `${y2} − ${y1} = ${y2 - y1} ans.` };
  }
  if (t === 3) {
    // Avant J.-C. → après J.-C. (il n'y a pas d'an 0).
    const av = pick([58, 15, 44, 100, 200]);
    const ap = pick([14, 50, 100, 260, 476]);
    return { q: `Combien d’années séparent l’an ${av} av. J.-C. et l’an ${ap} apr. J.-C. ? (Il n’y a pas d’année 0.)`, txt: 1, a: av + ap - 1, why: `${av} + ${ap} − 1 = ${av + ap - 1} ans, car on passe directement de l’an 1 av. J.-C. à l’an 1 apr. J.-C.` };
  }
  const [a, why] = pick([
    ["Un siècle", "Un siècle = 100 ans."],
    ["Un millénaire", "Un millénaire = 1000 ans."],
    ["Une décennie", "Une décennie = 10 ans."],
  ] as const);
  const n = a === "Un siècle" ? 100 : a === "Un millénaire" ? 1000 : 10;
  return { q: `Combien d’années dure ${a.toLowerCase()} ?`, txt: 1, a: n, why };
}
