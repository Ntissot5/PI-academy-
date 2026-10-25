import { pick } from "../math";
import type { Question } from "./types";
import { melange } from "./data/l2-outils";

// [phrase correcte, fausses, règle]
const W: [string, string[], string][] = [
  ["I always walk to school.", ["I walk always to school.", "I walk to always school."], "les adverbes de fréquence (always, never, often…) se placent devant le verbe"],
  ["She never eats meat.", ["She eats never meat.", "She eats meat never."], "never se place devant le verbe"],
  ["We usually have lunch at noon.", ["We have usually lunch at noon.", "We have lunch usually at noon."], "usually se place devant le verbe"],
  ["He is always late.", ["He always late is.", "Always he late is."], "avec be, l’adverbe vient après le verbe : is always"],
  ["I have a red car.", ["I have a car red.", "I have red a car."], "l’adjectif se place devant le nom"],
  ["She has a big black dog.", ["She has a black big dog.", "She has a dog big black."], "taille avant couleur : big black dog"],
  ["We have a nice old house.", ["We have an old nice house.", "We have a house nice old."], "opinion avant âge : nice old house"],
  ["I go to school every day.", ["I go every day to school.", "I every day go to school."], "le lieu vient avant le moment : to school every day"],
  ["Where do you live?", ["Where you live?", "Where live you?"], "question : mot interrogatif + do/does + sujet + verbe"],
  ["What does your brother like?", ["What your brother likes?", "What likes your brother?"], "question : mot interrogatif + does + sujet + base verbale"],
  ["My sister plays the piano very well.", ["My sister plays very well the piano.", "My sister very well plays the piano."], "le complément suit le verbe, l’adverbe vient après : plays the piano very well"],
  ["The book is on the table.", ["The book on the table is.", "Is the book the table on."], "sujet + verbe + complément de lieu"],
];

/** Word order : place des adverbes, des adjectifs et des compléments ; ordre de la question. */
export function gen(): Question {
  const [juste, faux, regle] = pick(W);
  return {
    q: "Quelle phrase est correcte ?",
    txt: 1,
    a: juste,
    choices: melange([juste, ...faux]),
    why: `${juste} — ${regle}.`,
  };
}
