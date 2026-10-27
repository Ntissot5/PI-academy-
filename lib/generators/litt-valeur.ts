import { NZ, P, R, S, pick } from "../math";
import type { Question } from "./types";

/** Valeur numérique d'une expression littérale : on remplace les lettres par des nombres (PER MSN 33, 9e-11e). */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const b = R(2, 12), h = 2 * R(1, 6);
    return { q: `Calcule <b>b·h/2</b> pour b = ${b} et h = ${h}.`, txt: 1, a: (b * h) / 2, hint: "Remplace, puis calcule", why: `${b} · ${h} / 2 = ${b * h} / 2 = ${(b * h) / 2}.` };
  }
  if (t === 1) {
    const a = NZ(-6, 9), b = R(-9, 9), x = NZ(-6, 6), v = a * x + b;
    const expr = `${a === 1 ? "" : a === -1 ? "−" : S(a)}x ${b < 0 ? "− " + -b : "+ " + b}`;
    return { q: `Calcule <b>${expr}</b> pour x = ${S(x)}.`, txt: 1, a: v, hint: "Remplace x par sa valeur", why: `${S(a)} · ${P(x)} ${b < 0 ? "− " + -b : "+ " + b} = ${S(a * x)} ${b < 0 ? "− " + -b : "+ " + b} = ${S(v)}.` };
  }
  if (t === 2) {
    const a = R(2, 5), c = R(1, 9), x = NZ(-4, 4), v = a * x * x - c;
    return { q: `Calcule <b>${a}x² − ${c}</b> pour x = ${S(x)}.`, txt: 1, a: v, hint: "Le carré d’abord", why: `${P(x)}² = ${x * x} (un carré n’est jamais négatif), puis ${a} · ${x * x} − ${c} = ${S(v)}.` };
  }
  if (t === 3) {
    const a = NZ(-5, 5), b = R(2, 5), c = NZ(-3, 3), v = a * b * c;
    return { q: `Calcule <b>abc</b> pour a = ${S(a)}, b = ${b} et c = ${S(c)}.`, txt: 1, a: v, hint: "abc = a · b · c", why: `${S(a)} · ${b} · ${P(c)} = ${S(v)}.` };
  }
  if (t === 4) {
    const B = R(4, 14), b = R(2, B - 1), h = 2 * R(1, 5);
    return { q: `Aire d’un trapèze : calcule <b>(B + b)·h/2</b> pour B = ${B}, b = ${b} et h = ${h}.`, txt: 1, a: ((B + b) * h) / 2, hint: "La parenthèse d’abord", why: `(${B} + ${b}) · ${h} / 2 = ${B + b} · ${h} / 2 = ${((B + b) * h) / 2}.` };
  }
  const x = pick([-3, -2, -1, 2, 3, 4]), v = x ** 3;
  return { q: `Calcule <b>x³</b> pour x = ${S(x)}.`, txt: 1, a: v, hint: "x³ = x · x · x", why: `${P(x)} · ${P(x)} · ${P(x)} = ${S(v)}${x < 0 ? " (trois signes moins : le résultat est négatif)" : ""}.` };
}
