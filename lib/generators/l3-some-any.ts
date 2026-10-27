import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, réponse, choix, raison]
const S: [string, string, string[], string][] = [
  ["There isn't … milk left.", "any", ["some", "any"], "phrase négative → any"],
  ["I'd like … water, please.", "some", ["some", "any"], "demande polie → some"],
  ["Are there … apples in the fridge?", "any", ["some", "any"], "question → any"],
  ["We have … bread for breakfast.", "some", ["some", "any"], "phrase affirmative → some"],
  ["Have you got … brothers or sisters?", "any", ["some", "any"], "question → any"],
  ["Would you like … cake?", "some", ["some", "any"], "offre (Would you like…?) → some"],
  ["There aren't … chairs in the room.", "any", ["some", "any"], "phrase négative → any"],
  ["I need … help with my homework.", "some", ["some", "any"], "phrase affirmative → some"],
  ["She doesn't have … pets.", "any", ["some", "any"], "phrase négative → any"],
  ["How … sugar do you take?", "much", ["much", "many"], "sugar est non comptable → how much"],
  ["How … brothers have you got?", "many", ["much", "many"], "brothers est comptable (pluriel) → how many"],
  ["How … money have you got?", "much", ["much", "many"], "money est non comptable → how much"],
  ["How … people are coming to the party?", "many", ["much", "many"], "people est comptable (pluriel) → how many"],
  ["How … water do you drink every day?", "much", ["much", "many"], "water est non comptable → how much"],
  ["How … apples do you need?", "many", ["much", "many"], "apples est comptable (pluriel) → how many"],
  ["How … homework do you have?", "much", ["much", "many"], "homework est non comptable en anglais → how much"],
];

/** some / any, how much / how many. */
export function gen(): Question {
  const [phrase, a, choix, raison] = pick(S);
  return {
    q: `Complète : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: choix,
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
