import { R, pick } from "../math";
import { nb, qcm } from "./m2-outils";
import type { Question } from "./types";

/** Calculatrice : ordre des opérations (priorités, parenthèses), réponse précédente, contrôle d'un affichage par l'ordre de grandeur. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const a = R(2, 9), b = R(2, 9), c = R(2, 9);
    return { q: `Tu tapes <b>${a} + ${b} × ${c} =</b> sur une calculatrice qui respecte les priorités (la multiplication avant l’addition). Qu’affiche-t-elle ?`, txt: 1, a: a + b * c, hint: "× avant +", why: `${b} × ${c} = ${b * c} d’abord, puis ${a} + ${b * c} = ${a + b * c}.` };
  }
  if (t === 1) {
    const a = R(2, 9), b = R(2, 9), c = R(2, 9);
    return { q: `Une calculatrice simple calcule au fur et à mesure, dans l’ordre où tu tapes. Tu tapes <b>${a} + ${b} × ${c} =</b>. Qu’affiche-t-elle ?`, txt: 1, a: (a + b) * c, hint: "Elle fait d’abord ce que tu as tapé en premier", why: `Elle calcule ${a} + ${b} = ${a + b}, puis ${a + b} × ${c} = ${(a + b) * c}. Une calculatrice qui respecte les priorités afficherait ${a + b * c}.` };
  }
  if (t === 2) {
    const b = R(2, 9), c = R(2, 9), d = R(1, 9), x = d + b * c + R(1, 40);
    return { q: `Tu tapes <b>${x} − (${d} + ${b} × ${c}) =</b> sur une calculatrice avec parenthèses. Qu’affiche-t-elle ?`, txt: 1, a: x - (d + b * c), hint: "Dans la parenthèse, × avant +", why: `Dans la parenthèse : ${b} × ${c} = ${b * c}, ${d} + ${b * c} = ${d + b * c} ; puis ${x} − ${d + b * c} = ${x - (d + b * c)}.` };
  }
  if (t === 3) {
    const k = R(2, 9), q = R(3, 40), m = R(2, 12), p = k * q;
    // p = a × b, puis ÷ k
    const a = pick([2, 3, 4, 5, 6].filter((x) => p % x === 0)) ?? 1;
    return { q: `Tu calcules <b>${a} × ${p / a} =</b>. Sans effacer, tu tapes <b>: ${k} =</b>, puis <b>× ${m} =</b>. Qu’affiche la calculatrice ?`, txt: 1, a: q * m, hint: "Chaque opération repart du résultat affiché", why: `${a} × ${p / a} = ${p}, puis ${p} : ${k} = ${q}, puis ${q} × ${m} = ${q * m}.` };
  }
  if (t === 4) {
    const a = R(12, 98), b = R(12, 98), r = a * b;
    const faux = [r * 10, Math.round(r / 10), r + 2, r * 100];
    return { q: `Lequel de ces affichages peut être le bon résultat de <b>${a} × ${b}</b> ?`, txt: 1, a: nb(r), choices: qcm(nb(r), faux.map(nb)), hint: "Arrondis les deux nombres à la dizaine", why: `${a} × ${b} ≈ ${Math.round(a / 10) * 10} × ${Math.round(b / 10) * 10} = ${nb(Math.round(a / 10) * 10 * Math.round(b / 10) * 10)}, et le chiffre des unités doit être celui de ${a % 10} × ${b % 10} : ${nb(r)}.` };
  }
  if (t === 5) {
    const a = R(120, 899), b0 = R(1, 9), b1 = R(0, 9);
    let b2: number;
    do b2 = R(0, 9); while (b2 === b1);
    const voulu = b0 * 100 + b1 * 10 + b2, tape = b0 * 100 + b2 * 10 + b1;
    return { q: `Tu voulais calculer ${a} + ${voulu}, mais tu as tapé ${a} + ${tape} (deux chiffres inversés). De combien ton résultat est-il trop ${tape > voulu ? "grand" : "petit"} ?`, txt: 1, a: Math.abs(tape - voulu), why: `L’écart vient seulement du deuxième nombre : ${Math.max(tape, voulu)} − ${Math.min(tape, voulu)} = ${Math.abs(tape - voulu)}.` };
  }
  const a = R(1012, 9876), b = R(12, 98);
  const it = pick([
    [`${nb(a)} × ${b}`, a * b],
    [`${nb(a * b)} : ${b}`, a],
    [`${nb(a)} + ${nb(b * 137)} − ${nb(b * 21)}`, a + b * 137 - b * 21],
  ] as [string, number][]);
  return { q: `Utilise ta calculatrice : ${it[0]} = ?`, a: it[1], hint: "Vérifie ensuite l’ordre de grandeur", why: `${it[0]} = ${nb(it[1])}.` };
}
