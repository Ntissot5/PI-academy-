import { R, pick } from "../math";
import type { Question } from "./types";
import { compte, melange } from "./m1-outils";

/** Répertoires additif et soustractif, surcomptage, doubles et moitiés, propriétés de l'addition, jusqu'à 20 : PER MSN 13, 3e-4e. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const a = R(0, 9), b = R(0, 9);
    return { q: `${a} + ${b} = <b>?</b>`, a: a + b, why: a + b > 10 && a < 10 && b < 10 && Math.max(a, b) >= 5 ? `On passe par 10 : ${Math.max(a, b)} + ${10 - Math.max(a, b)} = 10, puis 10 + ${a + b - 10} = ${a + b}.` : `${a} + ${b} = ${a + b}.` };
  }
  if (t === 1) {
    let a: number, b: number;
    if (Math.random() < 0.5) { a = R(0, 10); b = R(0, a); }
    else { a = R(11, 18); b = R(a - 9, 9); }
    return { q: `${a} − ${b} = <b>?</b>`, a: a - b, why: `${a - b} + ${b} = ${a}, donc ${a} − ${b} = ${a - b}.` };
  }
  if (t === 2) {
    const a = R(5, 15), s = R(a + 1, Math.min(20, a + 6)), m = s - a;
    return { q: `${a} + <b>?</b> = ${s}`, a: m, hint: `Pars de ${a} et compte jusqu’à ${s}.`, why: `On surcompte depuis ${a} : ${compte(a + 1, s)}. Ça fait ${m} pas, donc ${a} + ${m} = ${s}.` };
  }
  if (t === 3) {
    if (Math.random() < 0.5) {
      const n = R(1, 10);
      return { q: `Le <b>double</b> de ${n} = <b>?</b>`, txt: 1, a: 2 * n, why: `Le double, c’est deux fois le nombre : ${n} + ${n} = ${2 * n}.` };
    }
    const m = 2 * R(1, 10);
    return { q: `La <b>moitié</b> de ${m} = <b>?</b>`, txt: 1, a: m / 2, why: `La moitié, c’est partager en deux parts égales : ${m / 2} + ${m / 2} = ${m}.` };
  }
  if (t === 4) {
    const s = R(0, 3);
    if (s === 0) {
      const a = R(2, 9), b = R(2, 9);
      return { q: `${a} + ${b} = ${b} + <b>?</b>`, a, why: `On peut changer l’ordre dans une addition : ${a} + ${b} = ${b} + ${a}.` };
    }
    if (s === 1) {
      const a = R(1, 20), plus = Math.random() < 0.5;
      return { q: `${a} ${plus ? "+" : "−"} 0 = <b>?</b>`, a, why: `${plus ? "Ajouter" : "Enlever"} 0 ne change rien : ${a}.` };
    }
    if (s === 2) {
      const u = R(1, 9);
      return Math.random() < 0.5
        ? { q: `10 + ${u} = <b>?</b>`, a: 10 + u, why: `1 dizaine et ${u} unité${u > 1 ? "s" : ""} : ${10 + u}.` }
        : { q: `${10 + u} − ${u} = <b>?</b>`, a: 10, why: `${10 + u}, c’est 10 + ${u}. Sans les ${u} unité${u > 1 ? "s" : ""}, il reste 10.` };
    }
    const x = R(1, 9), y = 10 - x, z = R(1, 10), ordre = melange([x, y, z]);
    return { q: `${ordre.join(" + ")} = <b>?</b>`, a: 10 + z, hint: "Cherche deux nombres qui font 10.", why: `${x} + ${y} = 10, puis 10 + ${z} = ${10 + z}.` };
  }
  if (t === 5) {
    let a: number, b: number;
    do { a = R(1, 9); b = R(1, 9); } while (a + b === 10);
    const plus = a + b > 10, choix = ["plus que 10", "moins que 10"];
    return { q: `Sans calculer : ${a} + ${b}, c’est plus ou moins que 10 ?`, txt: 1, a: plus ? choix[0] : choix[1], choices: choix, why: `${a} + ${10 - a} = 10. Ici on ajoute ${b}, c’est ${b > 10 - a ? "plus" : "moins"} que ${10 - a} : le résultat est ${plus ? "plus" : "moins"} que 10 (${a + b}).` };
  }
  const n = pick([2, 3, 4, 5, 6, 7, 8, 9]);
  return { q: `${n} + ${n} = <b>?</b>`, a: 2 * n, hint: "Un double !", why: `${n} + ${n}, c’est le double de ${n} : ${2 * n}.` };
}
