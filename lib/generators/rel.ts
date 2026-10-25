import { NZ, P, R, S } from "../math";
import type { Question } from "./types";

/** Nombres négatifs. */
export function gen(): Question {
  const t = R(0, 4);
  let a: number, b: number;
  if (t === 0) { a = NZ(-20, 20); b = NZ(-20, 20); return { q: `${S(a)} + ${P(b)}`, a: a + b, why: `${S(a)} + ${P(b)} = ${S(a + b)}.` }; }
  if (t === 1) { a = NZ(-20, 20); b = NZ(-20, 20); return { q: `${S(a)} − ${P(b)}`, a: a - b, why: b < 0 ? `Moins un négatif = plus : ${S(a)} + ${-b} = ${S(a - b)}.` : `${S(a)} − ${b} = ${S(a - b)}.` }; }
  if (t === 2) { a = NZ(-12, 12); b = NZ(-12, 12); return { q: `${S(a)} × ${P(b)}`, a: a * b, why: `${(a < 0) === (b < 0) ? "Signes pareils → +" : "Signes différents → −"} : ${S(a * b)}.` }; }
  if (t === 3) { b = NZ(-9, 9); const k = NZ(-9, 9); a = b * k; return { q: `${S(a)} ÷ ${P(b)}`, a: k, why: `${(a < 0) === (b < 0) ? "Signes pareils → +" : "Signes différents → −"} : ${S(k)}.` }; }
  a = NZ(-15, 15); b = NZ(-15, 15); const c = NZ(-15, 15);
  return { q: `${S(a)} − ${P(b)} + ${P(c)}`, a: a - b + c, why: `De gauche à droite : ${S(a)} − ${P(b)} = ${S(a - b)}, puis + ${P(c)} = ${S(a - b + c)}.` };
}
