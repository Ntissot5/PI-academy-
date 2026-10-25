import { NZ, R, S, quad, sup } from "../math";
import type { Question } from "./types";

/** Dérivées. */
export function gen(): Question {
  const t = R(0, 2);
  if (t === 0) { const a = NZ(-5, 5), n = R(2, 4), x = R(-3, 3); return { q: `f(x) = ${a === 1 ? "" : a === -1 ? "−" : S(a)}x${sup(n)}. Calcule f′(${S(x)}).`, a: a * n * x ** (n - 1), why: `f′(x) = ${S(a * n)}x${n - 1 > 1 ? "^" + (n - 1) : ""} → f′(${S(x)}) = ${S(a * n * x ** (n - 1))}.` }; }
  if (t === 1) { const a = NZ(-5, 5), b = R(-9, 9), c = R(-9, 9), x = R(-4, 4); return { q: `f(x) = ${quad(a, b, c)}. Pente de la tangente en x = ${S(x)} ?`, txt: 1, a: 2 * a * x + b, why: `f′(x) = ${S(2 * a)}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} → f′(${S(x)}) = ${S(2 * a * x + b)}.` }; }
  const a = NZ(-3, 3), b = 2 * a * R(-5, 5), c = R(-9, 9);
  return { q: `f(x) = ${quad(a, b, c)}. Pour quel x a-t-on f′(x) = 0 ?`, txt: 1, a: -b / (2 * a), why: `f′(x) = ${S(2 * a)}x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0 → x = ${S(-b / (2 * a))}.` };
}
