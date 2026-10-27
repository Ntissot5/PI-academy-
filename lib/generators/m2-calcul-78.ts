import { R, pick } from "../math";
import { arr, nb, nbFixe } from "./m2-outils";
import type { Question } from "./types";

/** Calculs (7e-8e) : livret jusqu'à 12 × 12, distributivité, opérations en colonnes avec des décimaux, division euclidienne et décimale. */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    const a = R(2, 12), b = pick([R(2, 12), 11, 12]);
    if (Math.random() < 0.7) return { q: `${a} × ${b} = ?`, a: a * b, why: `${a} × ${b} = ${a * b}.` };
    return { q: `${a * b} : ${a} = ?`, a: b, hint: `Dans la table de ${a}`, why: `${a} × ${b} = ${a * b}, donc ${a * b} : ${a} = ${b}.` };
  }
  if (t === 1) {
    const it = pick([
      () => { const k = R(3, 12), m = pick([98, 99, 101, 102, 49, 51]), r = pick([100, 50].filter((x) => Math.abs(x - m) <= 2)) ?? 100; const d = m - r; return [`${k} × ${m}`, k * m, `${k} × ${m} = ${k} × ${r} ${d < 0 ? "−" : "+"} ${k} × ${Math.abs(d)} = ${k * r} ${d < 0 ? "−" : "+"} ${k * Math.abs(d)} = ${k * m}.`] as const; },
      () => { const k = R(3, 12), a = R(11, 89), b = 100 - a; return [`${k} × ${a} + ${k} × ${b}`, 100 * k, `${k} × ${a} + ${k} × ${b} = ${k} × (${a} + ${b}) = ${k} × 100 = ${100 * k}.`] as const; },
      () => { const k = R(11, 25), u = R(2, 9); return [`${k} × 1${u}`, k * (10 + u), `${k} × 1${u} = ${k} × 10 + ${k} × ${u} = ${k * 10} + ${k * u} = ${k * (10 + u)}.`] as const; },
      () => { const k = R(3, 9), a = R(2, 9) * 10 + R(1, 9); return [`${k} × ${a}`, k * a, `${k} × ${a} = ${k} × ${a - (a % 10)} + ${k} × ${a % 10} = ${k * (a - (a % 10))} + ${k * (a % 10)} = ${k * a}.`] as const; },
    ]);
    const [q, a, w] = it();
    return { q: `Calcule de tête (pense à la distributivité) : ${q}`, a, hint: "Décompose un facteur : a × (b + c) = a × b + a × c", why: w };
  }
  if (t === 2) {
    const da = pick([1, 2]), db = pick([0, 1, 2]);
    const a = R(100, 99999) / 10 ** da, b = R(10, 9999) / 10 ** db;
    const plus = Math.random() < 0.5;
    const [x, y] = plus ? [a, b] : [Math.max(a, b), Math.min(a, b)];
    const r = arr(plus ? x + y : x - y);
    return { q: `Calcule en colonnes : ${nb(arr(x))} ${plus ? "+" : "−"} ${nb(arr(y))}`, a: r, hint: "Aligne les virgules ; complète avec des zéros si besoin", why: `On aligne les virgules : ${nb(arr(x))} ${plus ? "+" : "−"} ${nb(arr(y))} = ${nb(r)}.` };
  }
  if (t === 3) {
    let a: number, b: number;
    if (Math.random() < 0.5) { a = R(11, 99) / 10; b = R(11, 99) / 10; }
    else { a = R(101, 999) / 100; b = R(2, 9); }
    const r = arr(a * b);
    const dec = (String(a).split(".")[1]?.length ?? 0) + (String(b).split(".")[1]?.length ?? 0);
    return { q: `Calcule en colonnes : ${nb(a)} × ${nb(b)}`, a: r, hint: "Calcule sans virgule, puis place-la", why: `${String(Math.round(a * 10 ** (String(a).split(".")[1]?.length ?? 0)))} × ${String(Math.round(b * 10 ** (String(b).split(".")[1]?.length ?? 0)))} = ${Math.round(r * 10 ** dec)} ; il y a ${dec} décimale${dec > 1 ? "s" : ""} dans les facteurs, donc ${nb(r)}.` };
  }
  if (t === 4) {
    const d = R(3, 99), q = R(11, Math.floor(9999 / d) - 1), r = R(1, d - 1), D = d * q + r;
    if (D >= 10000) return { q: `Division euclidienne : ${nb(d * q)} : ${d}. Quel est le quotient ?`, a: q, why: `${d} × ${q} = ${nb(d * q)}, reste 0.` };
    const reste = Math.random() < 0.5;
    return { q: `Division euclidienne de ${nb(D)} par ${d}. Quel est le <b>${reste ? "reste" : "quotient"}</b> ?`, txt: 1, a: reste ? r : q, hint: "Le reste est toujours plus petit que le diviseur", why: `${nb(D)} = ${d} × ${q} + ${r} (et ${r} < ${d}) : quotient ${q}, reste ${r}.` };
  }
  if (t === 5) {
    for (;;) {
      const d = R(2, 40), D10 = R(20, 9990); // dividende en dixièmes
      if ((D10 * 10) % d !== 0) continue;
      const qc = (D10 * 10) / d; // quotient en centièmes
      if (qc < 10) continue;
      const D = D10 / 10, q = qc / 100;
      return { q: `Calcule : ${nb(D)} : ${d}`, a: arr(q), hint: "Continue la division après la virgule", why: `${nb(D)} : ${d} = ${nb(arr(q))}. Vérification : ${d} × ${nb(arr(q))} = ${nb(D)}.` };
    }
  }
  if (t === 6) {
    const p = R(12, 98) / 10, n = R(2, 9);
    const it = pick([
      [`Une baguette coûte ${nbFixe(p, 2)} CHF. Combien coûtent ${n} baguettes, en CHF ?`, arr(p * n), `${nbFixe(p, 2)} × ${n} = ${nbFixe(arr(p * n), 2)} CHF.`],
      [`${n} amis se partagent équitablement une addition de ${nb(arr(p * n * 10))} CHF. Combien paie chacun, en CHF ?`, arr(p * 10), `${nb(arr(p * n * 10))} : ${n} = ${nb(arr(p * 10))} CHF.`],
    ] as [string, number, string][]);
    return { q: it[0], txt: 1, a: it[1], why: it[2] };
  }
  const a = R(2, 9), b = R(2, 9), c = R(2, 9);
  const it = pick([
    [`${a} + ${b} × ${c}`, a + b * c, `La multiplication d’abord : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${a + b * c}.`],
    [`(${a} + ${b}) × ${c}`, (a + b) * c, `La parenthèse d’abord : ${a} + ${b} = ${a + b}, puis × ${c} = ${(a + b) * c}.`],
    [`${(a + b) * c} − ${b} × ${c}`, a * c, `${b} × ${c} = ${b * c} d’abord, puis ${(a + b) * c} − ${b * c} = ${a * c}.`],
  ] as [string, number, string][]);
  return { q: `${it[0]} = ?`, a: it[1], hint: "× et : avant + et −, sauf parenthèses", why: it[2] };
}
