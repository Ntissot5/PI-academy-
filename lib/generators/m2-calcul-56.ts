import { R, pick } from "../math";
import { nb, qcm } from "./m2-outils";
import type { Question } from "./types";

/** Calculs (5e-6e) : répertoires soustractif et multiplicatif, additions, soustractions et multiplications en colonnes, calcul réfléchi, estimations. */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0) {
    const b = R(0, 9), a = R(b, Math.min(19, b + 10));
    return { q: `${a} − ${b} = ?`, a: a - b, why: `${b} + ${a - b} = ${a}, donc ${a} − ${b} = ${a - b}.` };
  }
  if (t === 1) {
    const a = R(0, 9), b = R(0, 9);
    if (Math.random() < 0.6 || a === 0) return { q: `${a} × ${b} = ?`, a: a * b, why: `${a} × ${b} = ${a * b}${b && a ? ` (c’est aussi ${b} × ${a})` : " : multiplier par 0 donne 0"}.` };
    return { q: `? × ${a} = ${a * b}`, a: b, hint: `Dans quelle table de ${a} trouve-t-on ${a * b} ?`, why: `${b} × ${a} = ${a * b}.` };
  }
  if (t === 2) {
    const a = R(1200, 6999), b = R(150, 9999 - a);
    return { q: `Calcule en colonnes : ${nb(a)} + ${nb(b)}`, a: a + b, hint: "Unités sous unités, et n’oublie pas les retenues", why: `${nb(a)} + ${nb(b)} = ${nb(a + b)}.` };
  }
  if (t === 3) {
    let a: number, b: number;
    do { a = R(1000, 9999); b = R(100, a - 1); } while (b % 10 <= a % 10 && Math.random() < 0.7);
    return { q: `Calcule en colonnes : ${nb(a)} − ${nb(b)}`, a: a - b, hint: "Vérifie avec une addition", why: `${nb(a)} − ${nb(b)} = ${nb(a - b)}. Vérification : ${nb(a - b)} + ${nb(b)} = ${nb(a)}.` };
  }
  if (t === 4) {
    if (Math.random() < 0.5) {
      const a = R(102, 999), b = R(2, 9);
      return { q: `Calcule en colonnes : ${a} × ${b}`, a: a * b, hint: "Commence par les unités", why: `${a} × ${b} = ${nb(a * b)}.` };
    }
    const a = R(12, 99), b = R(1, 9) * 10 + R(1, 9);
    return { q: `Calcule en colonnes : ${a} × ${b}`, a: a * b, hint: `${a} × ${b % 10} puis ${a} × ${b - (b % 10)}`, why: `${a} × ${b % 10} = ${a * (b % 10)} et ${a} × ${b - (b % 10)} = ${a * (b - (b % 10))} ; ${a * (b % 10)} + ${a * (b - (b % 10))} = ${nb(a * b)}.` };
  }
  if (t === 5) {
    const it = pick([
      () => { const x = R(11, 99); return [`25 × ${x} × 4`, 100 * x, `25 × 4 = 100, donc 100 × ${x} = ${nb(100 * x)}.`] as const; },
      () => { const x = R(11, 99); return [`5 × ${x} × 2`, 10 * x, `5 × 2 = 10, donc 10 × ${x} = ${nb(10 * x)}.`] as const; },
      () => { const a = R(11, 89), c = 100 - a, b = R(11, 99); return [`${a} + ${b} + ${c}`, 100 + b, `${a} + ${c} = 100, donc 100 + ${b} = ${100 + b}.`] as const; },
      () => { const a = R(110, 890) , c = 1000 - a, b = R(11, 99); return [`${a} + ${b} + ${c}`, 1000 + b, `${a} + ${c} = 1000, donc 1000 + ${b} = ${nb(1000 + b)}.`] as const; },
      () => { const x = R(2, 9); return [`${x} × 50 × 2`, 100 * x, `50 × 2 = 100, donc ${x} × 100 = ${100 * x}.`] as const; },
    ]);
    const [q, a, w] = it();
    return { q: `Calcule astucieusement : ${q}`, a, hint: "Change l’ordre pour regrouper les nombres qui vont bien ensemble", why: w };
  }
  if (t === 6) {
    const it = pick([
      () => { const b = R(12, 899), k = pick([9, 99]); return [`${b} + ${k}`, b + k, `${b} + ${k + 1} − 1 = ${b + k + 1} − 1 = ${b + k}.`] as const; },
      () => { const b = R(120, 999), k = pick([9, 99]); return [`${b} − ${k}`, b - k, `${b} − ${k + 1} + 1 = ${b - k - 1} + 1 = ${b - k}.`] as const; },
      () => { const b = R(12, 49), k = R(3, 9); return [`${k} × ${b}`, k * b, `${k} × ${b - (b % 10)} + ${k} × ${b % 10} = ${k * (b - (b % 10))} + ${k * (b % 10)} = ${k * b}.`] as const; },
      () => { const b = R(101, 999); return [`${b} + 198`, b + 198, `${b} + 200 − 2 = ${b + 200} − 2 = ${b + 198}.`] as const; },
      () => { const k = R(2, 9); return [`${k} × 19`, k * 19, `${k} × 20 − ${k} = ${k * 20} − ${k} = ${k * 19}.`] as const; },
    ]);
    const [q, a, w] = it();
    return { q: `Calcule de tête : ${q}`, a, hint: "Décompose un des nombres", why: w };
  }
  if (t === 7) {
    const k = R(0, 1);
    let a: number, b: number, r: number, op: string;
    if (k === 0) { a = R(2, 9) * 100 + pick([-3, -2, -1, 1, 2, 3]); b = R(2, 9) * 100 + pick([-2, -1, 1, 2]); r = Math.round(a / 100) * 100 + Math.round(b / 100) * 100; op = "+"; }
    else { a = R(2, 9) * 10 + pick([-1, 1]); b = R(2, 9); r = Math.round(a / 10) * 10 * b; op = "×"; }
    const ch = [r, r * 10, r / 10, r + (k ? 10 * b : 100)].map(nb);
    return { q: `Sans calculer exactement : quel nombre est le plus proche de <b>${a} ${op} ${b}</b> ?`, txt: 1, a: nb(r), choices: qcm(nb(r), ch), hint: "Arrondis d’abord", why: `${a} ≈ ${Math.round(a / (k ? 10 : 100)) * (k ? 10 : 100)}${k ? `, et ${Math.round(a / 10) * 10} × ${b} = ${nb(r)}` : ` et ${b} ≈ ${Math.round(b / 100) * 100}`} : environ ${nb(r)} (exactement ${nb(k ? a * b : a + b)}).` };
  }
  const a = R(3, 9);
  let b: number;
  do b = R(3, 9); while (b === a);
  const it = pick([
    [`Quel calcul donne le même résultat que ${a} × ${b} ?`, `${b} × ${a}`, [`${a} + ${b}`, `${a} × ${b + 1}`, `${a}${b}`], "On peut échanger les facteurs d’une multiplication : c’est la commutativité."],
    [`Quel calcul donne le même résultat que ${a * 10} + ${b} ?`, `${b} + ${a * 10}`, [`${a * 10} − ${b}`, `${b} × ${a * 10}`, `${b} − ${a * 10}`], "On peut échanger les termes d’une addition, pas ceux d’une soustraction."],
    [`Quel calcul donne le même résultat que (${a} × ${b}) × 10 ?`, `${a} × (${b} × 10)`, [`(${a} + ${b}) × 10`, `${a} × ${b} + 10`, `${a} + ${b} × 10`], "Dans une multiplication, on peut regrouper les facteurs comme on veut : c’est l’associativité."],
  ] as [string, string, string[], string][]);
  return { q: it[0], txt: 1, a: it[1], choices: qcm(it[1], it[2]), why: it[3] };
}
