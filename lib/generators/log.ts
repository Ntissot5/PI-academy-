import { R, S, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

/** Exponentielles et logarithmes. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) { const b = pick([2, 3, 5]), k = R(2, b === 2 ? 10 : 5); return { q: `${b}<sup>x</sup> = ${fr(b ** k)}`, a: k, hint: "x = ?", why: `${b}^${k} = ${fr(b ** k)} → x = ${k}.` }; }
  if (t === 1) { const k = R(-4, 7); return { q: `log₁₀(${k < 0 ? "0," + "0".repeat(-k - 1) + "1" : fr(10 ** k)})`, a: k, why: `C’est 10${k < 0 ? "^" + S(k) : "^" + k} → ${S(k)}.` }; }
  if (t === 2) { const b = pick([2, 3, 4, 5]), k = R(1, 5); return { q: `log<sub>${b}</sub>(${fr(b ** k)})`, a: k, why: `${b}^${k} = ${fr(b ** k)} → ${k}.` }; }
  if (t === 3) { const C = R(1, 20) * 500, r = pick([2, 3, 4, 5, 6]), n = R(2, 10), v = C * (1 + r / 100) ** n; return { q: `${fr(C)} CHF placés à ${r} % par an pendant ${n} ans. Capital final ?`, txt: 1, a: v, tol: tolAbs(v, 0.005, 1), why: `${fr(C)} · ${fr(1 + r / 100)}^${n} ≈ ${fr(v)} CHF.` }; }
  const a = R(2, 5), k = R(1, 6);
  return { q: `${a} · 2<sup>x</sup> = ${fr(a * 2 ** k)}`, a: k, hint: "x = ?", why: `2^x = ${fr(a * 2 ** k)} ÷ ${a} = ${2 ** k} → x = ${k}.` };
}
