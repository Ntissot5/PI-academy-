import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr, melange } from "./m3-outils";

const CARRES = Array.from({ length: 20 }, (_, i) => (i + 1) ** 2);
const nonCarre = (a: number, b: number): number => { let n: number; do n = R(a, b); while (Number.isInteger(Math.sqrt(n))); return n; };

/** Racines carrées et cubiques, encadrement, nombres irrationnels et ensembles de nombres (PER MSN 32, 10e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    if (R(0, 2) === 0) { const n = R(1, 9); return { q: `√${fr(arr((n * n) / 100))} = ?`, a: n / 10, why: `${fr(n / 10)} × ${fr(n / 10)} = ${fr(arr((n * n) / 100))}, donc √${fr(arr((n * n) / 100))} = ${fr(n / 10)}.` }; }
    const n = R(2, 20);
    return { q: `√${n * n} = ?`, a: n, why: `${n} × ${n} = ${n * n}, donc √${n * n} = ${n}.` };
  }
  if (t === 1) {
    const n = R(1, 10);
    return { q: `∛${n ** 3} = ?`, a: n, hint: "Quel nombre, multiplié trois fois par lui-même ?", why: `${n} × ${n} × ${n} = ${n ** 3}, donc ∛${n ** 3} = ${n}.` };
  }
  if (t === 2) {
    const N = nonCarre(5, 300), k = Math.floor(Math.sqrt(N)), bas = R(0, 1) === 1;
    return { q: `√${N} est compris entre deux nombres entiers consécutifs. Quel est le plus ${bas ? "petit" : "grand"} ?`, txt: 1, a: bas ? k : k + 1, why: `${k}² = ${k * k} < ${N} < ${(k + 1) ** 2} = ${k + 1}², donc ${k} < √${N} < ${k + 1}.` };
  }
  if (t === 3) {
    const N = nonCarre(2, 200), v = Math.sqrt(N);
    return { q: `Donne √${N} arrondi au dixième.`, a: v, tol: 0.051, why: `√${N} ≈ ${v.toFixed(3).replace(".", ",")}… → ${fr(Math.round(v * 10) / 10)}.` };
  }
  if (t === 4) {
    const a = `√${nonCarre(2, 50)}`;
    const p = pick([3, 5, 7]), q = pick([4, 8, 9]);
    const d = [`√${pick(CARRES.slice(1, 12))}`, `${p}/${q}`, pick(["0,25", "−3", "1,5", "0,125"])];
    return { q: "Lequel de ces nombres est irrationnel ?", txt: 1, a, choices: melange([a, ...d]), why: `${a} n’est pas une racine exacte : son écriture décimale est infinie et non périodique. Les autres s’écrivent comme une fraction (√ d’un carré parfait est un entier).` };
  }
  if (t === 5) {
    const k = R(2, 9);
    if (R(0, 1)) {
      const a = `−${k}`;
      return { q: "Lequel de ces nombres appartient à ℤ mais pas à ℕ ?", txt: 1, a, choices: melange([a, `${k}`, `${2 * k + 1}/2`, "√2"]), why: `${a} est un entier négatif : il est dans ℤ (entiers relatifs) mais pas dans ℕ (entiers naturels).` };
    }
    const a = `${2 * k + 1}/4`;
    return { q: "Lequel de ces nombres appartient à ℚ mais pas à ℤ ?", txt: 1, a, choices: melange([a, `−${k}`, `√${k * k}`, "π"]), why: `${a} = ${fr((2 * k + 1) / 4)} est une fraction qui n’est pas entière : dans ℚ, pas dans ℤ. √${k * k} = ${k} est entier ; π est irrationnel.` };
  }
  if (t === 6) {
    const a = R(2, 9), b = pick([2, 3, 5, 6, 7]);
    return { q: `√${a * a * b} = a·√${b}. Que vaut a ?`, txt: 1, a, hint: `Cherche un carré parfait dans ${a * a * b}.`, why: `${a * a * b} = ${a * a} × ${b}, donc √${a * a * b} = √${a * a} · √${b} = ${a}√${b}.` };
  }
  const b = pick([2, 3, 5, 6, 7]);
  let m: number, n: number;
  do { m = R(1, 4); n = R(1, 4); } while (m * n === 1);
  const x = b * m * m, y = b * n * n;
  return { q: `√${x} · √${y} = ?`, a: b * m * n, hint: "√a · √b = √(a · b)", why: `√${x} · √${y} = √${x * y} = ${b * m * n}, car ${b * m * n}² = ${x * y}.` };
}
