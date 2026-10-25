import { NZ, P, R, S, quad } from "../math";
import type { Question } from "./types";

/** Équations du 2e degré. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) { const r1 = R(-8, 8); let r2 = R(-8, 8); if (r1 === r2) r2++; const b = -(r1 + r2), c = r1 * r2; return { q: `${quad(1, b, c)} = 0. Donne la plus grande solution.`, txt: 1, a: Math.max(r1, r2), why: `Somme ${S(r1 + r2)}, produit ${S(c)} → x = ${S(Math.min(r1, r2))} ou x = ${S(Math.max(r1, r2))}.` }; }
  if (t === 1) { const a = NZ(-4, 4), b = R(-9, 9), c = R(-9, 9); return { q: `Calcule Δ pour ${quad(a, b, c)} = 0.`, txt: 1, a: b * b - 4 * a * c, why: `Δ = ${P(b)}² − 4 × ${P(a)} × ${P(c)} = ${b * b} − ${P(4 * a * c)} = ${S(b * b - 4 * a * c)}.` }; }
  if (t === 2) { const a = R(2, 3), r1 = R(-6, 6); let r2 = R(-6, 6); if (r1 === r2) r2++; const b = -a * (r1 + r2), c = a * r1 * r2; return { q: `${quad(a, b, c)} = 0. Donne la plus petite solution.`, txt: 1, a: Math.min(r1, r2), why: `Divise par ${a} : ${quad(1, -(r1 + r2), r1 * r2)} = 0 → x = ${S(Math.min(r1, r2))} ou ${S(Math.max(r1, r2))}.` }; }
  const a = NZ(-3, 3), b = 2 * a * R(-6, 6), c = R(-9, 9);
  return { q: `Abscisse x du sommet de y = ${quad(a, b, c)} ?`, txt: 1, a: -b / (2 * a), why: `x = −b ÷ 2a = ${S(-b)} ÷ ${S(2 * a)} = ${S(-b / (2 * a))}.` };
}
