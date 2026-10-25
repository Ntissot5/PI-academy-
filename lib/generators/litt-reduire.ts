import { NZ, R, S, lin } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
/** a·x^n joliment (n = 1, 2 ou 3). */
const mono = (a: number, n: number, v = "x") => `${a === 1 ? "" : a === -1 ? "−" : S(a)}${v}${n === 2 ? "²" : n === 3 ? "³" : ""}`;
/** Garde la bonne réponse et 3 erreurs fréquentes, sans doublon. */
const qcm = (a: string, faux: string[]) => shuffle([a, ...[...new Set(faux)].filter((f) => f !== a).slice(0, 3)]);

/** Réduire, développer, multiplier des monômes et des polynômes (PER MSN 33, 10e-11e). */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    // ax + bx + c
    let a: number, b: number;
    do { a = NZ(-7, 9); b = NZ(-7, 9); } while (a + b === 0);
    const c = NZ(-9, 9);
    const q = `${mono(a, 1)} ${b < 0 ? "− " + mono(-b, 1) : "+ " + mono(b, 1)} ${c < 0 ? "− " + -c : "+ " + c}`;
    const ans = lin(a + b, c);
    return { q: `Réduis : <b>${q}</b>`, txt: 1, a: ans, choices: qcm(ans, [lin(a + b + c, 0), mono(a + b + c, 1), lin(a - b, c), lin(a + b, -c)]),
      why: `On additionne les termes en x : ${S(a)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = ${S(a + b)}, donc ${ans}. Le ${S(c)} reste seul : il n’a pas de x.` };
  }
  if (t === 1) {
    // k(x + b)
    const k = NZ(-6, 7), b = NZ(-9, 9);
    const ans = lin(k, k * b);
    return { q: `Développe : <b>${S(k)}(x ${b < 0 ? "− " + -b : "+ " + b})</b>`, txt: 1, a: ans, choices: qcm(ans, [lin(k, b), lin(k, -k * b), lin(1, k * b), lin(k, k + b)]),
      why: `On multiplie chaque terme par ${S(k)} : ${S(k)} · x = ${mono(k, 1)} et ${S(k)} · ${b < 0 ? "(−" + -b + ")" : b} = ${S(k * b)}.` };
  }
  if (t === 2) {
    // (ax^m)(bx^n)
    const a = NZ(-5, 6), b = NZ(-5, 6), m = R(1, 2), n = R(1, 3 - m);
    const ans = mono(a * b, m + n);
    return { q: `Calcule : <b>(${mono(a, m)}) · (${mono(b, n)})</b>`, txt: 1, a: ans, choices: qcm(ans, [mono(a * b, m * n), mono(a + b, m + n), mono(-a * b, m + n), mono(a * b, m + n + 1)]),
      why: `On multiplie les nombres (${S(a)} · ${S(b)} = ${S(a * b)}) et on additionne les exposants (x${m === 1 ? "" : m === 2 ? "²" : "³"} · x${n === 1 ? "" : n === 2 ? "²" : "³"} = x${m + n === 2 ? "²" : "³"}).` };
  }
  // (ax + b) − (cx + d)
  let a: number, c: number;
  do { a = NZ(-6, 9); c = NZ(-6, 9); } while (a === c);
  const b = NZ(-9, 9), d = NZ(-9, 9);
  const ans = (b - d) === 0 ? mono(a - c, 1) : lin(a - c, b - d);
  const wrong = (b + d) === 0 ? mono(a - c, 1) : lin(a - c, b + d);
  return { q: `Réduis : <b>(${lin(a, b)}) − (${lin(c, d)})</b>`, txt: 1, a: ans, choices: qcm(ans, [wrong, lin(a + c, b + d), lin(a - c, d - b), lin(c - a, b - d)]),
    why: `Le signe − devant la parenthèse change tous ses signes : ${lin(a, b)} ${c < 0 ? "+ " + mono(-c, 1) : "− " + mono(c, 1)} ${d < 0 ? "+ " + -d : "− " + d} = ${ans}.` };
}
