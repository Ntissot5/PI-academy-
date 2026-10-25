import { NZ, P, R, S, lin } from "../math";
import type { Question } from "./types";

/** Équations du 1er degré. */
export function gen(): Question {
  const t = R(0, 2), s = R(-9, 9);
  if (t === 0) {
    let a: number, c: number;
    do { a = NZ(-9, 9); c = NZ(-9, 9); } while (a === c);
    const b = R(-15, 15), d = a * s + b - c * s;
    return { q: `${lin(a, b)} = ${lin(c, d)}`, a: s, hint: "x = ?", why: `${S(a)}x − ${P(c)}x = ${S(d)} − ${P(b)} → ${S(a - c)}x = ${S(d - b)} → x = ${S(s)}.` };
  }
  if (t === 1) { const k = R(2, 6), b = R(-10, 10), x = k * s, c = s + b; return { q: `x/${k} ${b < 0 ? "− " + -b : "+ " + b} = ${S(c)}`, a: x, hint: "x = ?", why: `x/${k} = ${S(c)} − ${P(b)} = ${S(s)} → x = ${S(s)} × ${k} = ${S(x)}.` }; }
  const a = NZ(-6, 6), b = R(-8, 8), c = a * (s + b);
  return { q: `${S(a)}(x ${b < 0 ? "− " + -b : "+ " + b}) = ${S(c)}`, a: s, hint: "x = ?", why: `x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${S(c)} ÷ ${P(a)} = ${S(s + b)} → x = ${S(s)}.` };
}
