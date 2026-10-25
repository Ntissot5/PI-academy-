import { R, pick } from "../math";
import { PRENOMS, nb } from "./m2-outils";
import type { Question } from "./types";

type Indice = [string, (x: number) => boolean];
const somme = (x: number): number => String(x).split("").reduce((s, c) => s + +c, 0);

/** Énigme « Qui suis-je ? » : on ajoute des indices jusqu'à ce qu'un seul nombre convienne (vérifié par recherche). */
function quiSuisJe(): Question {
  for (;;) {
    const n = R(12, 999), lo = Math.max(1, n - R(4, 40)), hi = n + R(4, 40);
    const cand: Indice[] = [];
    for (const k of [2, 3, 4, 5, 6, 7, 8, 9]) if (n % k === 0) cand.push([`Je suis un multiple de ${k}.`, (x) => x % k === 0]);
    cand.push([`La somme de mes chiffres est ${somme(n)}.`, (x) => somme(x) === somme(n)]);
    cand.push([`Mon chiffre des unités est ${n % 10}.`, (x) => x % 10 === n % 10]);
    if (n >= 100) cand.push([`Mon chiffre des centaines est ${Math.floor(n / 100)}.`, (x) => Math.floor(x / 100) % 10 === Math.floor(n / 100)]);
    cand.push([n % 2 ? "Je suis impair." : "Je suis pair.", (x) => x % 2 === n % 2]);
    const pris: Indice[] = [];
    const base = (x: number): boolean => x > lo && x < hi;
    let sol: number[] = [];
    for (const c of cand.sort(() => Math.random() - 0.5)) {
      pris.push(c);
      sol = [];
      for (let x = lo + 1; x < hi; x++) if (base(x) && pris.every(([, f]) => f(x))) sol.push(x);
      if (sol.length === 1) break;
    }
    if (sol.length !== 1 || pris.length < 2) continue;
    // on retire un à un les indices inutiles (la solution doit rester unique)
    const nbSol = (ind: Indice[]): number => { let k = 0; for (let x = lo + 1; x < hi; x++) if (ind.every(([, f]) => f(x))) k++; return k; };
    let utiles = [...pris];
    for (const c of [...pris]) { const sans = utiles.filter((d) => d !== c); if (nbSol(sans) === 1) utiles = sans; }
    if (utiles.length < 2 || nbSol(utiles) !== 1 || !utiles.every(([, f]) => f(n))) continue;
    return { q: `Qui suis-je ? Je suis plus grand que ${lo} et plus petit que ${hi}. ${utiles.map(([s]) => s).join(" ")}`, txt: 1, a: n, hint: "Fais la liste des nombres possibles, puis élimine", why: `Entre ${lo} et ${hi}, seul ${n} respecte tous les indices.` };
  }
}

/** Énigmes et problèmes de recherche : qui suis-je, essais successifs, opérations à l'envers, plus grand nombre avec des chiffres donnés. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0 || t === 1) return quiSuisJe();
  if (t === 2) {
    const g = R(10, 60), p = R(2, g - 1);
    return { q: `La somme de deux nombres est ${g + p} et leur différence est ${g - p}. Quel est le plus grand des deux ?`, txt: 1, a: g, hint: "Essaie, puis ajuste", why: `(${g + p} + ${g - p}) : 2 = ${g}. Vérification : ${g} + ${p} = ${g + p} et ${g} − ${p} = ${g - p}.` };
  }
  if (t === 3) {
    const l = R(2, 12), pp = R(2, 15), h = l + pp, pat = 4 * l + 2 * pp;
    return { q: `Dans une ferme, il y a des poules et des lapins. On compte ${h} têtes et ${pat} pattes. Combien y a-t-il de lapins ?`, txt: 1, a: l, hint: "Si tous étaient des poules, combien de pattes ?", why: `Si les ${h} animaux étaient des poules : ${2 * h} pattes. Il y a ${pat - 2 * h} pattes de plus, 2 de plus par lapin : ${pat - 2 * h} : 2 = ${l} lapins.` };
  }
  if (t === 4) {
    const x = R(2, 20), m = R(2, 6), b = R(1, 20), v = x * m + b, p = pick(PRENOMS);
    return { q: `${p} pense à un nombre. Elle ou il le multiplie par ${m}, puis ajoute ${b}, et obtient ${v}. À quel nombre pensait-il ou elle ?`, txt: 1, a: x, hint: "Fais les opérations à l’envers", why: `À l’envers : ${v} − ${b} = ${v - b}, puis ${v - b} : ${m} = ${x}.` };
  }
  if (t === 5) {
    const N = R(12, 150);
    const c = Math.min(N, 9) + Math.max(0, Math.min(N, 99) - 9) * 2 + Math.max(0, N - 99) * 3;
    return { q: `Pour numéroter les pages d’un carnet de 1 à ${N}, combien de chiffres faut-il écrire ?`, txt: 1, a: c, hint: "Sépare les pages à 1, 2 et 3 chiffres", why: `Pages 1 à 9 : 9 chiffres${N > 9 ? ` ; pages 10 à ${Math.min(N, 99)} : ${Math.min(N, 99) - 9} × 2 = ${(Math.min(N, 99) - 9) * 2}` : ""}${N > 99 ? ` ; pages 100 à ${N} : ${N - 99} × 3 = ${(N - 99) * 3}` : ""}. Total : ${c}.` };
  }
  let ch: number[];
  do ch = Array.from({ length: R(4, 5) }, () => R(0, 9)); while (new Set(ch).size !== ch.length);
  const grand = Math.random() < 0.5;
  const tri = [...ch].sort((a, b) => (grand ? b - a : a - b));
  if (!grand && tri[0] === 0) { const i = tri.findIndex((d) => d > 0); [tri[0], tri[i]] = [tri[i], tri[0]]; }
  const n = +tri.join("");
  return { q: `Avec les chiffres ${ch.join(", ")}, utilisés une seule fois chacun, quel est le plus ${grand ? "grand" : "petit"} nombre de ${ch.length} chiffres que tu peux écrire ?`, txt: 1, a: n, hint: grand ? "Le plus grand chiffre au rang le plus fort" : "Un nombre ne commence pas par 0", why: `On place les chiffres du ${grand ? "plus grand au plus petit" : "plus petit au plus grand"}${!grand && ch.includes(0) ? ", sans commencer par 0" : ""} : ${nb(n)}.` };
}
