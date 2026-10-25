import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [événement, année]
const EV: [string, number][] = [
  ["Pacte fédéral entre Uri, Schwytz et Unterwald", 1291],
  ["Bataille de Morgarten", 1315],
  ["Bataille de Sempach", 1386],
  ["Bataille de Marignan", 1515],
  ["Traités de Westphalie : indépendance de la Confédération reconnue", 1648],
  ["République helvétique", 1798],
  ["Acte de médiation de Napoléon", 1803],
  ["Congrès de Vienne : neutralité de la Suisse reconnue", 1815],
  ["Première Constitution fédérale : naissance de l’État fédéral", 1848],
  ["Révision totale de la Constitution fédérale", 1874],
  ["Droit de vote des femmes au niveau fédéral", 1971],
  ["Entrée en souveraineté du canton du Jura", 1979],
  ["Adhésion de la Suisse à l’ONU", 2002],
];

/** Repères de l'histoire suisse. */
export function gen(): Question {
  const [ev, y] = pick(EV);
  const faux = shuffle(EV.filter((e) => e[1] !== y)).slice(0, 3).map((e) => String(e[1]));
  return { q: `En quelle année ? ${ev}.`, txt: 1, a: String(y), choices: shuffle([String(y), ...faux]), why: `${ev} : ${y}.` };
}
