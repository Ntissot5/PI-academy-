import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, réponse, choix, raison]
const C: [string, string, string[], string][] = [
  ["I stayed at home … I was ill.", "because", ["because", "so", "but"], "because = parce que (la cause)"],
  ["It was raining, … we took an umbrella.", "so", ["because", "so", "but"], "so = donc (la conséquence)"],
  ["I like cats, … I don't like dogs.", "but", ["because", "so", "but"], "but = mais (une opposition)"],
  ["… it was cold, we went swimming.", "Although", ["Although", "Because", "So"], "although = bien que (une opposition)"],
  ["I'll call you … I get home.", "when", ["when", "because", "but"], "when = quand (le moment)"],
  ["Do you want tea … coffee?", "or", ["or", "so", "because"], "or = ou (un choix)"],
  ["The girl … lives next door is Swiss.", "who", ["who", "which", "where"], "who : pronom relatif pour une personne"],
  ["The book … I read was great.", "which", ["who", "which", "where"], "which : pronom relatif pour une chose"],
  ["This is the house … I was born.", "where", ["who", "which", "where"], "where : pronom relatif pour un lieu"],
  ["She was tired, … she went to bed early.", "so", ["because", "so", "although"], "so = donc (la conséquence)"],
  ["We missed the train … we got up late.", "because", ["because", "so", "or"], "because = parce que (la cause)"],
  ["He is rich, … he isn't happy.", "but", ["but", "so", "because"], "but = mais (une opposition)"],
  ["I have a friend … plays the violin.", "who", ["who", "which", "where"], "who : pronom relatif pour une personne"],
  ["… you finish your homework, you can watch TV.", "When", ["When", "Because", "But"], "when = quand (le moment)"],
];

/** Connecteurs et subordonnées : because, so, but, although, when, or ; who, which, where. */
export function gen(): Question {
  const [phrase, a, choix, raison] = pick(C);
  return {
    q: `Complète : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: choix,
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
