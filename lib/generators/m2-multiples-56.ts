import { R, pick } from "../math";
import { nb, qcm } from "./m2-outils";
import type { Question } from "./types";

const CRIT: Record<number, string> = {
  2: "Un nombre est divisible par 2 s’il se termine par 0, 2, 4, 6 ou 8.",
  5: "Un nombre est divisible par 5 s’il se termine par 0 ou 5.",
  10: "Un nombre est divisible par 10 s’il se termine par 0.",
  100: "Un nombre est divisible par 100 s’il se termine par 00.",
};

/** Multiples, critères de divisibilité par 2, 5, 10, 100 et suites arithmétiques (5e-6e). */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const k = R(3, 9), m = k * R(3, 12);
    const d = [m + 1, m - 1, m + 2, k * 10 + (k > 5 ? 1 : 3), m + k - 1].filter((x) => x % k !== 0);
    return { q: `Lequel de ces nombres est un multiple de ${k} ?`, txt: 1, a: String(m), choices: qcm(String(m), d.map(String)), hint: `Pense à la table de ${k}`, why: `${m} = ${k} × ${m / k} : c’est un multiple de ${k}.` };
  }
  if (t === 1) {
    const k = R(2, 9), N = R(20, 100);
    return { q: `Combien y a-t-il de multiples de ${k} entre 1 et ${N} (${N} compris) ?`, txt: 1, a: Math.floor(N / k), hint: `${k}, ${2 * k}, ${3 * k}, …`, why: `Le plus grand est ${k} × ${Math.floor(N / k)} = ${k * Math.floor(N / k)} ≤ ${N} : il y en a ${Math.floor(N / k)}.` };
  }
  if (t === 2) {
    const k = R(3, 12), n = R(20, 120);
    const a = (Math.floor(n / k) + 1) * k;
    return { q: `Quel est le premier multiple de ${k} plus grand que ${n} ?`, txt: 1, a, why: `${k} × ${Math.floor(n / k)} = ${k * Math.floor(n / k)} ≤ ${n}, et ${k} × ${Math.floor(n / k) + 1} = ${a}.` };
  }
  if (t === 3) {
    const k = pick([2, 5, 10, 100]);
    const ok = k === 100 ? R(1, 99) * 100 : k === 10 ? R(10, 999) * 10 : k === 5 ? R(10, 999) * 10 + 5 : R(10, 4999) * 2;
    const faux = k === 100 ? [ok + 10, ok + 50, ok - 1] : k === 10 ? [ok + 5, ok + 1, ok - 2] : k === 5 ? [ok + 1, ok + 3, ok - 2] : [ok + 1, ok + 3, ok - 5];
    return { q: `Lequel de ces nombres est divisible par ${k} ?`, txt: 1, a: nb(ok), choices: qcm(nb(ok), faux.map(nb)), why: `${CRIT[k]} ${nb(ok)} convient.` };
  }
  if (t === 4) {
    const s = R(2, 25), r = R(2, 15), up = Math.random() < 0.7, n = 5;
    const u0 = up ? s : s + r * (n + 1);
    const seq = Array.from({ length: n }, (_, i) => (up ? u0 + i * r : u0 - i * r));
    const nxt = up ? u0 + n * r : u0 - n * r;
    if (Math.random() < 0.5) return { q: `Quel nombre vient ensuite ? <b>${seq.join(" ; ")} ; …</b>`, txt: 1, a: nxt, hint: "Regarde l’écart entre deux nombres", why: `On ${up ? "ajoute" : "enlève"} ${r} à chaque fois : ${seq[n - 1]} ${up ? "+" : "−"} ${r} = ${nxt}.` };
    const i = R(1, n - 2), aff = seq.map((x, j) => (j === i ? "?" : String(x)));
    return { q: `Quel nombre manque ? <b>${aff.join(" ; ")}</b>`, txt: 1, a: seq[i], why: `L’écart est de ${r} : ${seq[i - 1]} ${up ? "+" : "−"} ${r} = ${seq[i]}.` };
  }
  const s = R(1, 30), r = R(2, 12), seq = Array.from({ length: 4 }, (_, i) => s + i * r);
  const a = `on ajoute ${r}`;
  return { q: `Quelle est la règle de la suite <b>${seq.join(" ; ")} ; …</b> ?`, txt: 1, a, choices: qcm(a, [`on ajoute ${r + 1}`, `on ajoute ${r - 1 || r + 2}`, `on multiplie par ${r}`, `on ajoute ${s}`]), why: `${seq[1]} − ${seq[0]} = ${r}, ${seq[2]} − ${seq[1]} = ${r} : on ajoute ${r} à chaque fois.` };
}
