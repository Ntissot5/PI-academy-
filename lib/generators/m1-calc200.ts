import { R, pick } from "../math";
import type { Question } from "./types";
import { melange } from "./m1-outils";

/** Calcul réfléchi jusqu'à 200 : dizaines entières, ± 9, 10, 11, passage de la dizaine, doubles et moitiés, anticipation : PER MSN 13, 4e. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const a = 10 * R(2, 15), b = 10 * R(1, 8);
    if (a + b <= 200 && Math.random() < 0.5) return { q: `${a} + ${b} = <b>?</b>`, a: a + b, why: `${a / 10} dizaines + ${b / 10} dizaines = ${(a + b) / 10} dizaines, donc ${a + b}.` };
    const [g, p] = a >= b ? [a, b] : [b, a];
    return { q: `${g} − ${p} = <b>?</b>`, a: g - p, why: `${g / 10} dizaines − ${p / 10} dizaines = ${(g - p) / 10} dizaine${g - p > 10 ? "s" : ""}, donc ${g - p}.` };
  }
  if (t === 1) {
    const n = R(20, 180), k = pick([9, 10, 11]), plus = Math.random() < 0.5, r = plus ? n + k : n - k;
    const op = plus ? "+" : "−", d = plus ? n + 10 : n - 10;
    const why = k === 10
      ? `${plus ? "Ajouter" : "Enlever"} 10, c’est changer seulement le chiffre des dizaines : ${n} ${op} 10 = ${r}.`
      : k === 9
        ? `${op} 9, c’est ${op} 10 puis ${plus ? "− 1" : "+ 1"} : ${n} ${op} 10 = ${d}, puis ${r}.`
        : `${op} 11, c’est ${op} 10 puis ${op} 1 : ${n} ${op} 10 = ${d}, puis ${r}.`;
    return { q: `${n} ${op} ${k} = <b>?</b>`, a: r, why };
  }
  if (t === 2) {
    const d = R(1, 9), u = R(5, 9), n = 10 * d + u, k = R(11 - u, 9);
    if (Math.random() < 0.5) return { q: `${n} + ${k} = <b>?</b>`, a: n + k, hint: "Passe par la dizaine.", why: `${n} + ${10 - u} = ${10 * d + 10}, puis + ${k - (10 - u)} : ${n + k}.` };
    const m = 10 * R(2, 19) + R(1, 4), j = R(m % 10 + 1, 9);
    return { q: `${m} − ${j} = <b>?</b>`, a: m - j, hint: "Passe par la dizaine.", why: `${m} − ${m % 10} = ${m - (m % 10)}, puis − ${j - (m % 10)} : ${m - j}.` };
  }
  if (t === 3) {
    const a = R(10, 99), b = R(10, Math.min(99, 200 - a));
    if (Math.random() < 0.5) return { q: `${a} + ${b} = <b>?</b>`, a: a + b, why: `On ajoute les dizaines, puis les unités : ${a} + ${b - (b % 10)} = ${a + b - (b % 10)}, puis + ${b % 10} = ${a + b}.` };
    const [g, p] = a >= b ? [a, b] : [b, a];
    return { q: `${g} − ${p} = <b>?</b>`, a: g - p, why: `On enlève les dizaines, puis les unités : ${g} − ${p - (p % 10)} = ${g - p + (p % 10)}, puis − ${p % 10} = ${g - p}.` };
  }
  if (t === 4) {
    if (Math.random() < 0.5) {
      const n = Math.random() < 0.5 ? 10 * R(1, 10) : R(11, 49);
      return { q: `Le <b>double</b> de ${n} = <b>?</b>`, txt: 1, a: 2 * n, why: `${n} + ${n} = ${2 * n}${n % 10 && n > 10 ? ` (double de ${n - (n % 10)} = ${2 * (n - (n % 10))}, double de ${n % 10} = ${2 * (n % 10)})` : ""}.` };
    }
    const m = Math.random() < 0.5 ? 20 * R(1, 10) : 2 * R(6, 49);
    return { q: `La <b>moitié</b> de ${m} = <b>?</b>`, txt: 1, a: m / 2, why: `${m / 2} + ${m / 2} = ${m}, donc la moitié de ${m} est ${m / 2}.` };
  }
  if (t === 5) {
    let a: number, b: number;
    do { a = R(20, 80); b = R(20, 80); } while (a + b === 100);
    const plus = a + b > 100, choix = ["plus que 100", "moins que 100"];
    return { q: `Sans calculer : ${a} + ${b}, c’est plus ou moins que 100 ?`, txt: 1, a: plus ? choix[0] : choix[1], choices: choix, why: `Regarde les dizaines : ${a - (a % 10)} + ${b - (b % 10)} = ${a + b - (a % 10) - (b % 10)}, et les unités ajoutent ${(a % 10) + (b % 10)}. Le résultat (${a + b}) est ${plus ? "plus" : "moins"} que 100.` };
  }
  const x = 5 * R(1, 19), y = 100 - x, z = R(1, 99), ordre = melange([x, y, z]);
  return { q: `${ordre.join(" + ")} = <b>?</b>`, a: 100 + z, hint: "Cherche deux nombres qui font 100.", why: `${x} + ${y} = 100, puis 100 + ${z} = ${100 + z}.` };
}
