import { R, fr, pick } from "../math";
import type { Question } from "./types";

/** Fractions et pourcentages. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) { const p = pick([5, 10, 12, 15, 20, 25, 30, 40, 60, 75]), N = R(2, 100) * 20; return { q: `${p} % de ${fr(N)}`, a: (N * p) / 100, why: `${fr(N)} × ${p} ÷ 100 = ${fr((N * p) / 100)}.` }; }
  if (t === 1) { const p = pick([5, 10, 20, 25, 50]), N = R(2, 50) * 20; return { q: `Un prix de ${fr(N)} CHF augmente de ${p} %. Nouveau prix ?`, txt: 1, a: N * (1 + p / 100), why: `${fr(N)} × ${fr(1 + p / 100)} = ${fr(N * (1 + p / 100))}.` }; }
  if (t === 2) { const p = pick([10, 20, 25, 40, 50, 75]), N = R(2, 40) * 20, M = (N * p) / 100; return { q: `${fr(M)} représente combien de % de ${fr(N)} ?`, txt: 1, a: p, why: `${fr(M)} ÷ ${fr(N)} × 100 = ${p} %.` }; }
  if (t === 3) { const b = R(2, 9), d = R(2, 9), a = R(1, b - 1 || 1), c = R(1, d - 1 || 1); return { q: `${a}/${b} + ${c}/${d}`, a: a / b + c / d, tol: 0.01, hint: "Réponse en fraction (ex. 7/12) ou en décimal arrondi à 0,01.", why: `Même dénominateur ${b * d} : ${a * d}/${b * d} + ${c * b}/${b * d} = ${a * d + c * b}/${b * d} ≈ ${fr(a / b + c / d)}.` }; }
  if (t === 4) { const b = R(2, 9), d = R(2, 9), a = R(1, 9), c = R(1, 9); return { q: `${a}/${b} × ${c}/${d}`, a: (a * c) / (b * d), tol: 0.01, hint: "Fraction ou décimal arrondi à 0,01.", why: `Haut × haut, bas × bas : ${a * c}/${b * d} ≈ ${fr((a * c) / (b * d))}.` }; }
  const p = R(55, 85), A = R(2, 90) * 10;
  return { q: `Une surface de ${fr(A)} km² est couverte à ${p} % d’eau. Quelle aire en km² est de la terre ferme ?`, txt: 1, a: (A * (100 - p)) / 100, tol: 0.01, why: `Terre = ${100 - p} % : ${fr(A)} × ${100 - p} ÷ 100 = ${fr((A * (100 - p)) / 100)}.` };
}
