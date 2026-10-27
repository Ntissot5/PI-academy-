import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE } from "./data/l2-outils";

type F6 = [string, string, string, string, string, string];
// [infinitif, traduction, formes, fin de phrase]
const PRAET: [string, string, F6, string][] = [
  ["sein", "être", ["war", "warst", "war", "waren", "wart", "waren"], "im Zoo"],
  ["sein", "être", ["war", "warst", "war", "waren", "wart", "waren"], "sehr müde"],
  ["haben", "avoir", ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"], "keine Zeit"],
  ["haben", "avoir", ["hatte", "hattest", "hatte", "hatten", "hattet", "hatten"], "Fieber"],
  ["können", "pouvoir", ["konnte", "konntest", "konnte", "konnten", "konntet", "konnten"], "nicht kommen"],
  ["müssen", "devoir", ["musste", "musstest", "musste", "mussten", "musstet", "mussten"], "früh aufstehen"],
  ["wollen", "vouloir", ["wollte", "wolltest", "wollte", "wollten", "wolltet", "wollten"], "ins Kino gehen"],
  ["dürfen", "avoir le droit de", ["durfte", "durftest", "durfte", "durften", "durftet", "durften"], "lange fernsehen"],
];
const FUTUR: F6 = ["werde", "wirst", "wird", "werden", "werdet", "werden"];
const SUITE_FUTUR: [string, string][] = [["Nächstes Jahr", "mehr Deutsch lernen"], ["Morgen", "Oma besuchen"], ["Am Wochenende", "das Zimmer aufräumen"], ["Im Sommer", "nach Bern fahren"], ["Bald", "ein Velo kaufen"]];
const SUJETS: [string, number][] = [["ich", 0], ["du", 1], ["Lena", 2], ["Tom", 2], ["wir", 3], ["ihr", 4], ["die Kinder", 5]];

/** Präteritum de sein, haben et des verbes de mode ; futur avec werden. */
export function gen(): Question {
  const [suj, p] = pick(SUJETS);
  if (R(0, 3) === 0) {
    const [quand, suite] = pick(SUITE_FUTUR);
    return {
      q: `Futur avec <b>werden</b> : <b>${quand} … ${suj} ${suite}.</b>`,
      txt: 1,
      a: FUTUR[p],
      keys: KEYS_DE,
      why: `${quand} ${FUTUR[p]} ${suj} ${suite}. werden est conjugué en 2e position (inversion après « ${quand} »), l’infinitif va à la fin.`,
    };
  }
  const [inf, fr, f, fin] = pick(PRAET);
  const forme = f[p];
  return {
    q: `Präteritum de <b>${inf}</b> (${fr}) : <b>Gestern … ${suj} ${fin}.</b>`,
    txt: 1,
    a: forme,
    keys: KEYS_DE,
    hint: "Écris seulement le verbe conjugué.",
    why: `Gestern ${forme} ${suj} ${fin}.${inf === "sein" || inf === "haben" ? ` Pour ${inf}, on utilise surtout le Präteritum (${f[0]}) plutôt que le Perfekt.` : ` Verbes de mode au Präteritum : -te, sans tréma (${f[0]}).`}${p === 0 || p === 2 ? " Avec ich et er/sie/es, même forme." : ""}`,
  };
}
