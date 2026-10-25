import { pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// [question avec …, réponse, mot interrogatif, sens, mots à ne pas proposer]
const Q: [string, string, string, string, string[]][] = [
  ["… do you live?", "In Geneva.", "Where", "où", []],
  ["… is your birthday?", "In May.", "When", "quand", ["What"]],
  ["… is your favourite colour?", "Blue.", "What", "quel / quoi", ["Which"]],
  ["… is that girl?", "She's my cousin.", "Who", "qui", ["What"]],
  ["… are you late?", "Because I missed the bus.", "Why", "pourquoi", []],
  ["… are you?", "I'm fine, thanks.", "How", "comment", ["Who", "Where"]],
  ["… old is your brother?", "He's fourteen.", "How", "comment / combien (+ adjectif)", []],
  ["… brothers have you got?", "Two.", "How many", "combien (+ nom comptable)", ["Which"]],
  ["… milk do you want?", "Just a little.", "How much", "combien (+ nom non comptable)", ["Which", "What"]],
  ["… bag is this?", "It's Tom's.", "Whose", "à qui", ["Which", "What"]],
  ["… do you go to school?", "By bus.", "How", "comment", ["When", "Why", "Where"]],
  ["… does the film start?", "At eight o'clock.", "When", "quand", ["What time"]],
  ["… are you doing?", "I'm reading.", "What", "que, quoi", ["How"]],
  ["… is my phone?", "On the table.", "Where", "où", []],
];
const MOTS = ["What", "Where", "When", "Who", "Why", "How", "How many", "How much", "Whose", "Which"];

/** Question words : choisir le mot interrogatif d'après la réponse. */
export function gen(): Question {
  const [question, reponse, a, sens, exclus] = pick(Q);
  return {
    q: `Complète la question : <b>${question}</b> — ${reponse}`,
    txt: 1,
    a,
    choices: propositions(a, MOTS.filter((m) => m !== a && !exclus.includes(m))),
    why: `${question.replace("…", a)} — ${reponse} ${a} = ${sens}.`,
  };
}
