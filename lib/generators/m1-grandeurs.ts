import { R, pick } from "../math";
import type { Question } from "./types";
import { melange, tirer } from "./m1-outils";

// [grand, petit] : différences évidentes
const LOURD: [string, string][] = [["🐘", "🐭"], ["🚗", "🚲"], ["🍉", "🍒"], ["🐄", "🐔"], ["🐻", "🐝"]];
const HAUT: [string, string][] = [["🦒", "🐈"], ["🌳", "🌷"], ["🏠", "🐕"], ["🐘", "🐇"]];
const CONTIENT: [string, string][] = [["🛁", "☕"], ["🪣", "🥄"], ["🛁", "🥛"]];
const DUREE: [string, string][] = [
  ["dormir toute la nuit", "se laver les mains"],
  ["une journée d’école", "manger une pomme"],
  ["les vacances d’été", "un week-end"],
  ["une semaine", "une journée"],
  ["faire un gâteau", "boire un verre d’eau"],
];

/** Comparer directement des longueurs, des masses, des contenances et des durées : PER MSN 14, 1re-2e. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) {
    const k = R(2, 3), noms = ["A", "B", "C"].slice(0, k);
    let l: number[];
    do l = tirer([2, 3, 4, 5, 6, 7, 8, 9], k);
    while (l.some((x, i) => l.some((y, j) => i !== j && Math.abs(x - y) < 2)));
    const long = Math.random() < 0.6, cible = long ? Math.max(...l) : Math.min(...l), a = noms[l.indexOf(cible)];
    return { q: `Quelle bande est la plus <b>${long ? "longue" : "courte"}</b> ?  ${noms.map((n, i) => `${n} ${"▬".repeat(l[i])}`).join("   ")}`, a, choices: noms, why: `Les bandes commencent au même endroit : la bande ${a} va le ${long ? "plus loin" : "moins loin"}.` };
  }
  if (t === 1) {
    const [g, p] = pick(LOURD), lourd = Math.random() < 0.6, a = lourd ? g : p;
    return { q: `Qui est le plus <b>${lourd ? "lourd" : "léger"}</b> ?`, txt: 1, a, choices: melange([g, p]), why: `${g} est beaucoup plus lourd que ${p}.` };
  }
  if (t === 2) {
    const [g, p] = pick(HAUT), grand = Math.random() < 0.6, a = grand ? g : p;
    return { q: `Qui est le plus <b>${grand ? "grand" : "petit"}</b> ?`, txt: 1, a, choices: melange([g, p]), why: `${g} est beaucoup plus grand que ${p}.` };
  }
  if (t === 3) {
    const [g, p] = pick(CONTIENT);
    return { q: "Où peut-on mettre le plus d’eau ?", txt: 1, a: g, choices: melange([g, p]), why: `${g} contient beaucoup plus d’eau que ${p}.` };
  }
  const [l, c] = pick(DUREE), long = Math.random() < 0.6, a = long ? l : c;
  return { q: `Qu’est-ce qui dure le <b>${long ? "plus" : "moins"} longtemps</b> ?`, txt: 1, a, choices: melange([l, c]), why: `« ${l} » dure beaucoup plus longtemps que « ${c} ».` };
}
