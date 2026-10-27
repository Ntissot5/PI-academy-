import { R, pick } from "../math";
import type { Question } from "./types";
import { estPremier, melange, pgdc, ppmc, ville } from "./m3-outils";

const CRIT: Record<number, string> = {
  2: "son dernier chiffre est pair (0, 2, 4, 6 ou 8)",
  3: "la somme de ses chiffres est divisible par 3",
  4: "le nombre formé par ses deux derniers chiffres est divisible par 4",
  5: "il se termine par 0 ou 5",
  9: "la somme de ses chiffres est divisible par 9",
  10: "il se termine par 0",
  25: "il se termine par 00, 25, 50 ou 75",
};
const PREMIERS = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
const PIEGES = [21, 27, 33, 39, 49, 51, 57, 63, 69, 77, 81, 87, 91, 93];

const ROM: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
function romain(n: number): string {
  let s = "";
  for (const [v, l] of ROM) while (n >= v) { s += l; n -= v; }
  return s;
}
function parts(n: number): string[] {
  const p: string[] = [];
  for (const [v, l] of ROM) while (n >= v) { p.push(`${v} (${l})`); n -= v; }
  return p;
}
const sommeChiffres = (n: number): number => String(n).split("").reduce((s, c) => s + Number(c), 0);

/** Nombres naturels : critères de divisibilité, nombres premiers, pgdc, ppmc, facteurs premiers, numération romaine et binaire (PER MSN 32, 9e-10e). */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0) {
    const d = pick([2, 3, 4, 5, 9, 10, 25]);
    const bon = d * R(Math.ceil(100 / d), Math.floor(9999 / d));
    const autres = new Set<number>();
    // Pour 9, un piège : multiple de 3 mais pas de 9.
    if (d === 9) autres.add(3 * pick([1, 2, 4, 5, 7, 8]) + 9 * R(12, 1000));
    while (autres.size < 3) { const x = R(100, 9999); if (x % d !== 0) autres.add(x); }
    const choices = melange([bon, ...autres].map(String));
    const detail = d === 3 || d === 9 ? ` (${String(bon).split("").join(" + ")} = ${sommeChiffres(bon)})` : "";
    return { q: `Lequel de ces nombres est divisible par ${d} ?`, txt: 1, a: String(bon), choices, why: `Un nombre est divisible par ${d} si ${CRIT[d]} : c’est le cas de ${bon}${detail}.` };
  }
  if (t === 1) {
    const p = pick(PREMIERS), d = melange(PIEGES).slice(0, 3);
    const fac = d.map((n) => { for (let k = 2; ; k++) if (n % k === 0) return `${n} = ${k} × ${n / k}`; });
    return { q: "Lequel de ces nombres est premier ?", txt: 1, a: String(p), choices: melange([p, ...d].map(String)), why: `${p} n’a que deux diviseurs : 1 et lui-même. Les autres se décomposent : ${fac.join(", ")}.` };
  }
  if (t === 2) {
    const g = R(2, 15);
    let m: number, n: number;
    do { m = R(2, 12); n = R(2, 12); } while (m === n || pgdc(m, n) !== 1);
    return { q: `Quel est le pgdc (plus grand diviseur commun) de ${g * m} et ${g * n} ?`, txt: 1, a: g, why: `${g * m} = ${g} × ${m} et ${g * n} = ${g} × ${n} ; ${m} et ${n} n’ont plus de diviseur commun : pgdc = ${g}.` };
  }
  if (t === 3) {
    let a: number, b: number;
    do { a = R(4, 30); b = R(4, 30); } while (a === b || a % b === 0 || b % a === 0 || ppmc(a, b) > 360);
    const l = ppmc(a, b);
    return { q: `Quel est le ppmc (plus petit multiple commun) de ${a} et ${b} ?`, txt: 1, a: l, why: `Multiples de ${Math.max(a, b)} : ${Array.from({ length: l / Math.max(a, b) }, (_, i) => (i + 1) * Math.max(a, b)).join(", ")}… Le premier aussi multiple de ${Math.min(a, b)} est ${l}.` };
  }
  if (t === 4) {
    let e: number[], n: number;
    do { e = [R(1, 4), R(0, 3), R(0, 2), R(0, 1)]; n = 2 ** e[0] * 3 ** e[1] * 5 ** e[2] * 7 ** e[3]; } while (n < 30 || n > 2000);
    const ps = [2, 3, 5, 7], dec = ps.map((p, i) => (e[i] ? (e[i] > 1 ? `${p}<sup>${e[i]}</sup>` : `${p}`) : "")).filter(Boolean).join(" × ");
    if (R(0, 1)) {
      const i = pick([0, 1, 2, 3].filter((k) => e[k] > 0));
      return { q: `On décompose ${n} en produit de facteurs premiers. Quel est l’exposant du facteur ${ps[i]} ?`, txt: 1, a: e[i], why: `${n} = ${dec}.` };
    }
    const max = ps[[0, 1, 2, 3].filter((k) => e[k] > 0).pop() ?? 0];
    return { q: `Quel est le plus grand facteur premier de ${n} ?`, txt: 1, a: max, why: `${n} = ${dec} : le plus grand facteur premier est ${max}.` };
  }
  if (t === 5) {
    let a: number, b: number;
    do { a = pick([6, 8, 10, 12, 15, 18, 20]); b = pick([6, 8, 10, 12, 15, 18, 20]); } while (a === b || a % b === 0 || b % a === 0);
    const l = ppmc(a, b);
    return { q: `Deux bus partent ensemble de la gare de ${ville()} à 8 h. L’un repart toutes les ${a} min, l’autre toutes les ${b} min. Dans combien de minutes repartiront-ils de nouveau ensemble ?`, txt: 1, a: l, hint: "Cherche un multiple commun.", why: `Il faut le plus petit multiple commun de ${a} et ${b} : ppmc = ${l} min.` };
  }
  if (t === 6) {
    const g = R(4, 15);
    let m: number, n: number;
    do { m = R(2, 9); n = R(2, 9); } while (m === n || pgdc(m, n) !== 1);
    return { q: `Tu prépares des sachets identiques avec ${g * m} bonbons et ${g * n} caramels, sans qu’il en reste. Combien de sachets au maximum peux-tu faire ?`, txt: 1, a: g, hint: "Le nombre de sachets divise les deux nombres.", why: `Il faut le plus grand diviseur commun : pgdc(${g * m} ; ${g * n}) = ${g}, avec ${m} bonbons et ${n} caramels par sachet.` };
  }
  if (t === 7) {
    const n = R(0, 1) ? R(1, 100) : R(1000, 2500);
    if (R(0, 1)) return { q: `Écris ${n} en chiffres romains.`, txt: 1, a: romain(n), keys: ["I", "V", "X", "L", "C", "D", "M"], why: `${n} = ${parts(n).join(" + ")} → ${romain(n)}.` };
    return { q: `Quel nombre s’écrit <b>${romain(n)}</b> en chiffres romains ?`, txt: 1, a: n, why: `M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1 ; un symbole placé avant un plus grand se soustrait (IV = 4) : ${romain(n)} = ${n}.` };
  }
  const n = R(5, 63), b = n.toString(2);
  const det = b.split("").map((c, i) => (c === "1" ? 2 ** (b.length - 1 - i) : 0)).filter(Boolean).join(" + ");
  if (R(0, 1)) return { q: `Quel nombre décimal s’écrit <b>${b}</b> en binaire ?`, txt: 1, a: n, why: `Chaque 1 vaut une puissance de 2 : ${det} = ${n}.` };
  return { q: `Écris ${n} en binaire.`, txt: 1, a: b, keys: ["0", "1"], why: `${n} = ${det} → ${b}.` };
}
