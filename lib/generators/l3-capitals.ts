import { pick } from "../math";
import type { Question } from "./types";

// [phrase (mot en minuscules entre crochets), mot, majuscule ?, raison]
const S: [string, string, boolean, string][] = [
  ["My birthday is in [july].", "july", true, "les mois prennent une majuscule"],
  ["We have football on [monday].", "monday", true, "les jours de la semaine prennent une majuscule"],
  ["Can [i] come with you?", "i", true, "le pronom I s’écrit toujours en majuscule"],
  ["Yesterday [i] played tennis.", "i", true, "le pronom I s’écrit toujours en majuscule"],
  ["She speaks [german] and French.", "german", true, "les langues prennent une majuscule"],
  ["My favourite subject is [english].", "english", true, "les langues (même comme branche scolaire) prennent une majuscule"],
  ["Roger Federer is [swiss].", "swiss", true, "les nationalités prennent une majuscule"],
  ["We love [italian] food.", "italian", true, "les adjectifs de nationalité prennent une majuscule"],
  ["We visited [london] last year.", "london", true, "les villes prennent une majuscule"],
  ["They live in [canada].", "canada", true, "les pays prennent une majuscule"],
  ["We open presents at [christmas].", "christmas", true, "les fêtes prennent une majuscule"],
  ["I go skiing in [winter].", "winter", false, "les saisons s’écrivent en minuscules"],
  ["It’s hot in [summer].", "summer", false, "les saisons s’écrivent en minuscules"],
  ["My [dog] is very friendly.", "dog", false, "un nom commun s’écrit en minuscules"],
  ["I get up early in the [morning].", "morning", false, "les moments de la journée s’écrivent en minuscules"],
  ["Our [teacher] is nice.", "teacher", false, "un nom commun s’écrit en minuscules"],
  ["She lives near the [river].", "river", false, "un nom commun s’écrit en minuscules"],
  ["I play the [guitar].", "guitar", false, "un nom commun s’écrit en minuscules"],
  ["My little [brother] is six.", "brother", false, "un nom commun s’écrit en minuscules"],
  ["We have a test [tomorrow].", "tomorrow", false, "tomorrow n’est pas un nom propre : minuscules"],
];

/** Capital letters : quand l'anglais met une majuscule (jours, mois, I, langues, nationalités…). */
export function gen(): Question {
  const [phrase, mot, maj, raison] = pick(S);
  return {
    q: `${phrase.replace(`[${mot}]`, `<b>${mot}</b>`)} — Faut-il une majuscule à « ${mot} » ?`,
    txt: 1,
    a: maj ? "oui" : "non",
    choices: ["oui", "non"],
    why: `${maj ? `Oui : ${mot.charAt(0).toUpperCase() + mot.slice(1)}` : `Non : ${mot}`} — ${raison}.`,
  };
}
