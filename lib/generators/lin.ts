import { NZ, P, R, S, lin } from "../math";
import type { Question } from "./types";

/** Fonctions et droites. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) { const m = NZ(-5, 5), b = R(-8, 8), x1 = R(-5, 3), x2 = x1 + R(1, 5); return { q: `Pente de la droite passant par (${S(x1)} ; ${S(m * x1 + b)}) et (${S(x2)} ; ${S(m * x2 + b)}) ?`, txt: 1, a: m, why: `(${S(m * x2 + b)} − ${P(m * x1 + b)}) ÷ (${S(x2)} − ${P(x1)}) = ${S(m * (x2 - x1))} ÷ ${x2 - x1} = ${S(m)}.` }; }
  if (t === 1) { const m = NZ(-6, 6), b = R(-10, 10), x = R(-6, 6); return { q: `f(x) = ${lin(m, b)}. Calcule f(${S(x)}).`, a: m * x + b, why: `${S(m)} × ${P(x)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${S(m * x + b)}.` }; }
  if (t === 2) { const m = NZ(-5, 5), r = R(-8, 8), b = -m * r; return { q: `Où la droite y = ${lin(m, b)} coupe-t-elle l’axe x ?`, txt: 1, hint: "x = ?", a: r, why: `${lin(m, b)} = 0 → x = ${S(-b)} ÷ ${P(m)} = ${S(r)}.` }; }
  let m1: number, m2: number;
  do { m1 = NZ(-5, 5); m2 = NZ(-5, 5); } while (m1 === m2);
  const x0 = R(-6, 6), b1 = R(-8, 8), b2 = (m1 - m2) * x0 + b1;
  return { q: `y = ${lin(m1, b1)} et y = ${lin(m2, b2)}. En quel x se croisent-elles ?`, txt: 1, a: x0, why: `${lin(m1, b1)} = ${lin(m2, b2)} → ${S(m1 - m2)}x = ${S(b2 - b1)} → x = ${S(x0)}.` };
}
