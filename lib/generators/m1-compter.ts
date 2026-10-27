import { R, pick } from "../math";
import type { Question } from "./types";
import { OBJETS, melange, qcmNombre, tas, tirer } from "./m1-outils";

const DES = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
// [qui, ce qu'il veut]
const PAIRES: [string, string][] = [["🐰", "🥕"], ["🐶", "🦴"], ["🐵", "🍌"], ["🐝", "🌸"], ["🐭", "🧀"]];
// Nombres de la vie de tous les jours : [question, réponse, explication]
const VIE: [string, number, string][] = [
  ["Combien de doigts as-tu sur une main ?", 5, "Une main a 5 doigts."],
  ["Combien de doigts as-tu sur tes deux mains ?", 10, "5 doigts et encore 5 doigts : 10 doigts."],
  ["Combien de roues a un vélo 🚲 ?", 2, "Un vélo a 2 roues."],
  ["Combien de roues a une voiture 🚗 ?", 4, "Une voiture a 4 roues."],
  ["Combien de pattes a un chien 🐶 ?", 4, "Un chien a 4 pattes."],
  ["Combien de pattes a une poule 🐔 ?", 2, "Une poule a 2 pattes."],
  ["Combien de jours a une semaine ?", 7, "Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche : 7 jours."],
  ["Combien d’yeux as-tu ?", 2, "Tu as 2 yeux."],
  ["Combien de roues a un tricycle ?", 3, "Tri veut dire trois : un tricycle a 3 roues."],
];

/** Dénombrer et comparer de petites collections (nombres familiers, jusqu'à 12) : PER MSN 12, 1re-2e. */
export function gen(): Question {
  const t = R(0, 6), e = pick(OBJETS);
  if (t === 0) {
    const n = R(1, 12);
    return { q: `Combien de ${e} ? ${tas(e, n)}`, txt: 1, ...qcmNombre(n, [n + 1, n - 1], 1, 13), hint: "Touche chaque objet en comptant.", why: `On compte un par un, sans oublier ni compter deux fois : il y a ${n} ${e}.` };
  }
  if (t === 1) {
    const x = R(2, 10), y = Math.random() < 0.2 ? x : R(2, 10);
    const a = x > y ? "A" : x < y ? "B" : "Autant";
    return { q: `Où y a-t-il le plus de ${e} ?  A : ${tas(e, x)}  B : ${tas(e, y)}`, txt: 1, a, choices: ["A", "B", "Autant"], why: `A : ${x} ${e}, B : ${y} ${e}. ${a === "Autant" ? "C’est pareil." : `${a} en a plus.`}` };
  }
  if (t === 2) {
    const [qui, quoi] = pick(PAIRES), k = R(3, 8), c = R(1, k - 1), m = k - c;
    return { q: `Chaque ${qui} veut un ${quoi}. Il manque combien de ${quoi} ?  ${tas(qui, k)}  ${tas(quoi, c)}`, txt: 1, ...qcmNombre(m, [c, k, m + 1], 1, 10), why: `On fait des paires ${qui} ${quoi} : ${k} ${qui} et seulement ${c} ${quoi}, il manque ${m} ${quoi}.` };
  }
  if (t === 3) {
    if (Math.random() < 0.5) {
      const d = R(1, 6);
      return { q: `Combien de points ?  <b>${DES[d - 1]}</b>`, txt: 1, ...qcmNombre(d, [d + 1, d - 1], 1, 6), why: `Le dé montre ${d} point${d > 1 ? "s" : ""}.` };
    }
    const d1 = R(1, 6), d2 = R(1, 6), s = d1 + d2;
    return { q: `Combien de points en tout ?  <b>${DES[d1 - 1]} ${DES[d2 - 1]}</b>`, txt: 1, ...qcmNombre(s, [s + 1, s - 1, Math.max(d1, d2)], 2, 12), why: `${d1} points et ${d2} points : on compte tout, ${s} points.` };
  }
  if (t === 4) {
    const p = R(2, 4), g = R(9, 12), gaucheGrand = Math.random() < 0.5;
    const [x, y] = gaucheGrand ? [g, p] : [p, g];
    return { q: `Sans compter : où y a-t-il le plus de ${e} ?  A : ${tas(e, x)}  B : ${tas(e, y)}`, txt: 1, a: gaucheGrand ? "A" : "B", choices: ["A", "B"], why: `Un seul coup d’œil suffit : ${g} ${e}, c’est beaucoup plus que ${p}.` };
  }
  if (t === 5) {
    const ns = tirer(Array.from({ length: 12 }, (_, i) => i + 1), 3), grand = Math.random() < 0.5;
    const a = grand ? Math.max(...ns) : Math.min(...ns);
    return { q: `Quel nombre est le plus ${grand ? "grand" : "petit"} ?`, txt: 1, a: String(a), choices: melange(ns).map(String), why: `En comptant 1, 2, 3…, ${a} vient ${grand ? "après" : "avant"} les autres : c’est le plus ${grand ? "grand" : "petit"}.` };
  }
  const [q, n, why] = pick(VIE);
  return { q, txt: 1, ...qcmNombre(n, [n + 1, n - 1, n + 2], 1, 12), why };
}
