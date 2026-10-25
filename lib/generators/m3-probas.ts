import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { pgdc } from "./m3-outils";

const HINT = "Donne une fraction (ex. 1/6) ou un décimal arrondi au centième.";
const frac = (k: number, n: number): string => { const g = pgdc(k, n); return g === n ? `${k / g}` : `${k / g}/${n / g}`; };

// [événement, test sur la face du dé]
const DE: [string, (f: number) => boolean][] = [
  ["un nombre pair", (f) => f % 2 === 0],
  ["un nombre impair", (f) => f % 2 === 1],
  ["un multiple de 3", (f) => f % 3 === 0],
  ["un nombre premier", (f) => [2, 3, 5].includes(f)],
  ["un nombre supérieur à 4", (f) => f > 4],
  ["un nombre inférieur à 3", (f) => f < 3],
  ["un 6", (f) => f === 6],
  ["un nombre au moins égal à 2", (f) => f >= 2],
];

/** Situations aléatoires et probabilités simples : dé, urne, pièce, deux dés, fréquences (PER MSN 32, 10e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    const [ev, ok] = pick(DE), faces = [1, 2, 3, 4, 5, 6].filter(ok);
    return { q: `On lance un dé équilibré à 6 faces. Quelle est la probabilité d’obtenir ${ev} ?`, txt: 1, a: faces.length / 6, tol: 0.005, hint: HINT, why: `Cas favorables : ${faces.join(", ")} → ${faces.length} sur 6 = ${frac(faces.length, 6)}.` };
  }
  if (t === 1) {
    const r = R(1, 9), b = R(1, 9), v = R(1, 9), n = r + b + v;
    const [c, k] = pick([["rouge", r], ["bleue", b], ["verte", v]] as const);
    return { q: `Un sac contient ${r} billes rouges, ${b} bleues et ${v} vertes. Tu en tires une au hasard. Quelle est la probabilité qu’elle soit ${c} ?`, txt: 1, a: k / n, tol: 0.005, hint: HINT, why: `${k} billes ${c}s sur ${n} billes en tout : ${k}/${n}${frac(k, n) !== `${k}/${n}` ? ` = ${frac(k, n)}` : ""}.` };
  }
  if (t === 2) {
    const [ev, k, why] = pick([
      ["deux fois pile", 1, "Issues : PP, PF, FP, FF. Une seule est favorable (PP) : 1/4."],
      ["deux fois le même côté", 2, "Issues : PP, PF, FP, FF. Favorables : PP et FF → 2/4 = 1/2."],
      ["au moins une fois pile", 3, "Issues : PP, PF, FP, FF. Seule FF ne convient pas : 3/4."],
    ] as const);
    return { q: `On lance deux fois une pièce de monnaie. Quelle est la probabilité d’obtenir ${ev} ?`, txt: 1, a: k / 4, tol: 0.005, hint: HINT, why };
  }
  if (t === 3) {
    const s = R(2, 12), c = 6 - Math.abs(7 - s);
    const paires: string[] = [];
    for (let a = 1; a <= 6; a++) { const b = s - a; if (b >= 1 && b <= 6) paires.push(`${a}+${b}`); }
    return { q: `On lance deux dés équilibrés et on additionne les points. Quelle est la probabilité que la somme soit ${s} ?`, txt: 1, a: c / 36, tol: 0.005, hint: HINT, why: `Il y a 6 × 6 = 36 issues. Favorables : ${paires.join(", ")} → ${c}/36${frac(c, 36) !== `${c}/36` ? ` = ${frac(c, 36)}` : ""}.` };
  }
  if (t === 4) {
    const N = pick([20, 25, 50, 100, 200]), k = R(1, N / 2), f = (k / N) * 100;
    return { q: `On lance un dé ${N} fois ; le 6 sort ${k} fois. Quelle est la fréquence d’apparition du 6, en % ?`, txt: 1, a: f, why: `${k} ÷ ${N} = ${fr(k / N)} = ${fr(f)} %.` };
  }
  if (t === 5) {
    const [ev, a] = pick([
      ["obtenir 7", "impossible"], ["obtenir 0", "impossible"],
      ["obtenir un nombre entre 1 et 6", "certain"], ["obtenir un nombre plus petit que 10", "certain"],
      ["obtenir 3", "possible mais pas certain"], ["obtenir un nombre pair", "possible mais pas certain"],
    ] as const);
    return { q: `Avec un dé à 6 faces (numérotées de 1 à 6), l’événement « ${ev} » est…`, txt: 1, a, choices: ["impossible", "certain", "possible mais pas certain"], why: a === "impossible" ? "Aucune face ne convient : probabilité 0." : a === "certain" ? "Toutes les faces conviennent : probabilité 1." : "Certaines faces conviennent, d’autres non : probabilité entre 0 et 1." };
  }
  if (t === 6) {
    const N = 6 * R(5, 100);
    return { q: `Tu lances un dé équilibré ${N} fois. Environ combien de fois peux-tu t’attendre à obtenir un 4 ?`, txt: 1, a: N / 6, why: `La probabilité vaut 1/6 : ${N} × 1/6 = ${N / 6} fois environ.` };
  }
  const p = R(5, 95);
  return { q: `La probabilité qu’un événement se produise est de ${p} %. Quelle est la probabilité (en %) qu’il ne se produise pas ?`, txt: 1, a: 100 - p, why: `Les deux probabilités font 100 % ensemble : 100 − ${p} = ${100 - p} %.` };
}
