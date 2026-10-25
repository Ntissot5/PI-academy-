import { NZ, P, R, S, fr, pick, sup } from "../math";
import type { Question } from "./types";

/** Puissances et notation scientifique. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) { const a = R(-15, 15), b = R(-15, 15); return { q: `10${sup(a)} · 10${sup(b)} = 10<sup>?</sup>`, a: a + b, hint: "Donne l’exposant.", why: `On additionne : ${S(a)} + ${P(b)} = ${S(a + b)}.` }; }
  if (t === 1) { const a = R(-12, 12), b = R(-12, 12); return { q: `10${sup(a)} ÷ 10${sup(b)} = 10<sup>?</sup>`, a: a - b, hint: "Donne l’exposant.", why: `On soustrait : ${S(a)} − ${P(b)} = ${S(a - b)}.` }; }
  if (t === 2) { const a = NZ(-6, 6), b = NZ(-4, 4); return { q: `(10${sup(a)})${sup(b)} = 10<sup>?</sup>`, a: a * b, hint: "Donne l’exposant.", why: `On multiplie : ${S(a)} × ${P(b)} = ${S(a * b)}.` }; }
  if (t === 3) {
    const dg = String(R(101, 999));
    const n = pick([R(-8, -1), R(2, 9)]);
    let dec: string;
    if (n < 0) dec = "0," + "0".repeat(-n - 1) + dg;
    else dec = (dg + "0".repeat(n - 2)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
    const m = dg[0] + "," + dg.slice(1);
    return { q: `${dec} = ${m} · 10<sup>?</sup>`, a: n, hint: "Donne l’exposant.", why: `La virgule bouge de ${Math.abs(n)} rang${Math.abs(n) > 1 ? "s" : ""} ${n < 0 ? "vers la droite → exposant négatif" : "vers la gauche → exposant positif"} : ${S(n)}.` };
  }
  const a = R(2, 9), b = R(2, 9), x = R(-9, 9), y = R(-9, 9), pr = a * b, n = x + y + (pr >= 10 ? 1 : 0);
  return { q: `(${a} · 10${sup(x)}) · (${b} · 10${sup(y)}) = ? · 10<sup>?</sup>`, a: n, hint: "En notation scientifique propre : donne l’exposant.", why: `${a}×${b} = ${pr}${pr >= 10 ? ` = ${fr(pr / 10)} · 10¹` : ""} ; exposant ${S(x)} + ${P(y)}${pr >= 10 ? " + 1" : ""} = ${S(n)}.` };
}
