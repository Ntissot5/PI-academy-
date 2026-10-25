import { R, pick } from "../math";
import type { Question } from "./types";
import { maj, melange } from "./data/l2-outils";

// [sujet, verbe conjugué, reste]
const PHRASES: [string, string, string][] = [
  ["ich", "spiele", "Fussball"], ["wir", "gehen", "ins Kino"], ["meine Schwester", "liest", "ein Buch"],
  ["du", "hast", "Sport"], ["Tom", "isst", "eine Pizza"], ["ihr", "besucht", "Oma"], ["die Kinder", "spielen", "im Garten"],
  ["ich", "fahre", "mit dem Velo zur Schule"], ["mein Vater", "kocht", "Spaghetti"], ["Lena", "schwimmt", "im See"],
  ["wir", "haben", "Deutsch"], ["du", "machst", "die Hausaufgaben"],
];
const ZEIT = ["heute", "morgen", "am Montag", "am Abend", "jetzt", "am Wochenende", "im Sommer"];

/** Place du verbe : toujours en 2e position ; si on commence par le temps, le sujet passe après le verbe. */
export function gen(): Question {
  const [s, v, r] = pick(PHRASES);
  const z = pick(ZEIT);
  if (R(0, 1) === 0) {
    const juste = `${maj(z)} ${v} ${s} ${r}.`;
    const faux = [`${maj(z)} ${s} ${v} ${r}.`, `${maj(z)} ${r} ${v} ${s}.`, `${maj(z)} ${v} ${r} ${s}.`];
    return {
      q: `La phrase commence par <b>${maj(z)}</b>. Laquelle est correcte ?`,
      txt: 1,
      a: juste,
      choices: melange([juste, ...faux]),
      why: `${juste} Le verbe (${v}) reste en 2e position ; le sujet (${s}) passe juste après lui : c’est l’inversion.`,
    };
  }
  const juste = `${maj(s)} ${v} ${z} ${r}.`;
  const faux = [`${maj(s)} ${z} ${v} ${r}.`, `${maj(s)} ${z} ${r} ${v}.`, `${maj(s)} ${r} ${v} ${z}.`];
  return {
    q: `La phrase commence par le sujet <b>${maj(s)}</b>. Laquelle est correcte ?`,
    txt: 1,
    a: juste,
    choices: melange([juste, ...faux]),
    why: `${juste} Dans une phrase déclarative, le verbe conjugué (${v}) est en 2e position.`,
  };
}
