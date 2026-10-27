import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr, prenom } from "./m3-outils";

/** Résolution de problèmes numériques : ordre de grandeur, calculatrice et priorités, plausibilité, problèmes à étapes, essais successifs (PER MSN 32, 9e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    const a = R(110, 940), b = R(11, 94), ra = Math.round(a / 100) * 100, rb = Math.round(b / 10) * 10, e = ra * rb;
    const env = (x: number): string => `environ ${fr(x)}`;
    const choices = [e / 10, e, e * 10, e * 100].map(env);
    return { q: `Sans calculatrice, quel est l’ordre de grandeur de ${a} × ${b} ?`, txt: 1, a: env(e), choices, why: `${a} ≈ ${ra} et ${b} ≈ ${rb} : ${ra} × ${rb} = ${fr(e)} (valeur exacte : ${fr(a * b)}).` };
  }
  if (t === 1) {
    const k = R(0, 3);
    const a = R(2, 20), b = R(2, 12), c = R(2, 9);
    if (k === 0) return { q: `Tu tapes « ${a} + ${b} × ${c} = » sur une calculatrice scientifique. Quel résultat s’affiche ?`, txt: 1, a: a + b * c, why: `La calculatrice respecte les priorités : ${b} × ${c} = ${b * c} d’abord, puis ${a} + ${b * c} = ${a + b * c}.` };
    if (k === 1) { const bb = b * c, aa = bb + a; return { q: `Tu tapes « ${aa} − ${bb} ÷ ${c} = » sur une calculatrice scientifique. Quel résultat s’affiche ?`, txt: 1, a: aa - b, why: `La division d’abord : ${bb} ÷ ${c} = ${b}, puis ${aa} − ${b} = ${aa - b}.` }; }
    if (k === 2) return { q: `Tu tapes « ${a} + ${c} x² = » (touche carré) sur une calculatrice scientifique. Quel résultat s’affiche ?`, txt: 1, a: a + c * c, why: `La puissance passe avant l’addition : ${c}² = ${c * c}, puis ${a} + ${c * c} = ${a + c * c}.` };
    return { q: `Tu tapes « ( ${a} + ${b} ) × ${c} = » sur une calculatrice scientifique. Quel résultat s’affiche ?`, txt: 1, a: (a + b) * c, why: `La parenthèse d’abord : ${a + b}, puis × ${c} = ${(a + b) * c}.` };
  }
  if (t === 2) {
    const x = R(101, 999) / 10, n = R(3, 9), ex = arr(x * n), f = pick([1, 10, 0.1]), claim = arr(ex * f), p = prenom();
    const a = f === 1 ? "oui, c’est plausible" : f === 10 ? "non, c’est environ 10 fois trop grand" : "non, c’est environ 10 fois trop petit";
    const ordre = Math.round(x / 10) * 10 * n;
    return { q: `${p} calcule ${fr(x)} × ${n} et trouve ${fr(claim)}. Ce résultat est-il plausible ?`, txt: 1, a, choices: ["oui, c’est plausible", "non, c’est environ 10 fois trop grand", "non, c’est environ 10 fois trop petit"], hint: "Estime l’ordre de grandeur.", why: `${fr(x)} ≈ ${Math.round(x / 10) * 10}, donc le résultat est proche de ${ordre} (exactement ${fr(ex)}).` };
  }
  if (t === 3) {
    const n1 = R(2, 4), p1 = R(8, 30) / 2, n2 = R(2, 4), p2 = R(5, 12) / 2;
    const tot = arr(n1 * p1 + n2 * p2), billet = [20, 50, 100, 200].find((b) => b >= tot) ?? 200, r = arr(billet - tot);
    return { q: `Au cinéma, tu achètes ${n1} billets à ${fr(p1)} CHF et ${n2} boissons à ${fr(p2)} CHF. Tu paies avec un billet de ${billet} CHF. Combien te rend-on (en CHF) ?`, txt: 1, a: r, why: `${n1} × ${fr(p1)} + ${n2} × ${fr(p2)} = ${fr(arr(n1 * p1))} + ${fr(arr(n2 * p2))} = ${fr(tot)} CHF ; ${billet} − ${fr(tot)} = ${fr(r)} CHF.` };
  }
  if (t === 4) {
    const N = pick([16, 18, 20, 24, 25]), car = N * R(12, 30), e = R(5, 18);
    return { q: `Une classe de ${N} élèves part en course d’école. Le car coûte ${car} CHF au total et l’entrée du musée ${e} CHF par élève. Combien chaque élève doit-il payer ?`, txt: 1, a: car / N + e, why: `Car : ${car} ÷ ${N} = ${car / N} CHF par élève ; + ${e} CHF d’entrée = ${car / N + e} CHF.` };
  }
  if (t === 5) {
    const n = R(6, 40);
    return { q: `Le produit de deux nombres entiers consécutifs vaut ${n * (n + 1)}. Quel est le plus petit des deux ?`, txt: 1, a: n, hint: "Essaie des nombres proches de la racine carrée.", why: `√${n * (n + 1)} ≈ ${fr(Math.sqrt(n * (n + 1)))} ; on essaie ${n} × ${n + 1} = ${n * (n + 1)}. ✔` };
  }
  if (t === 6) {
    const n = R(5, 80);
    return { q: `La somme de trois nombres entiers consécutifs vaut ${3 * n + 3}. Quel est le plus petit des trois ?`, txt: 1, a: n, why: `Le nombre du milieu vaut ${3 * n + 3} ÷ 3 = ${n + 1} ; les trois nombres sont ${n}, ${n + 1} et ${n + 2}.` };
  }
  const k = R(0, 2), a = R(6, 20), b = R(2, 5);
  if (k === 0) return { q: `Calcule le triple de la somme de ${a} et ${b}.`, txt: 1, a: 3 * (a + b), why: `On traduit : 3 × (${a} + ${b}) = 3 × ${a + b} = ${3 * (a + b)}. Les parenthèses sont indispensables.` };
  if (k === 1) return { q: `Calcule la somme du triple de ${a} et de ${b}.`, txt: 1, a: 3 * a + b, why: `On traduit : 3 × ${a} + ${b} = ${3 * a} + ${b} = ${3 * a + b}.` };
  const c = R(2, 6), s = b + c, m = s * R(2, 9);
  return { q: `Calcule le quotient de ${m} par la somme de ${b} et ${c}.`, txt: 1, a: m / s, why: `On traduit : ${m} ÷ (${b} + ${c}) = ${m} ÷ ${s} = ${m / s}.` };
}
