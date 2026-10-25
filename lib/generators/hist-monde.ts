import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const EV: [string, string][] = [
  ["Christophe Colomb atteint l’Amérique", "1492"],
  ["Début de la Révolution française", "1789"],
  ["Début de la Première Guerre mondiale", "1914"],
  ["Fin de la Première Guerre mondiale", "1918"],
  ["Début de la Seconde Guerre mondiale", "1939"],
  ["Fin de la Seconde Guerre mondiale", "1945"],
  ["Premiers pas sur la Lune", "1969"],
  ["Chute du mur de Berlin", "1989"],
  ["Gutenberg et l’imprimerie à caractères mobiles (vers)", "1450"],
  ["Indépendance des États-Unis", "1776"],
];

/** Grands repères de l'histoire du monde. */
export function gen(): Question {
  const [ev, y] = pick(EV);
  const faux = shuffle(EV.filter((e) => e[1] !== y)).slice(0, 3).map((e) => e[1]);
  return { q: `En quelle année ? ${ev}.`, txt: 1, a: y, choices: shuffle([y, ...faux]), why: `${ev} : ${y}.` };
}
