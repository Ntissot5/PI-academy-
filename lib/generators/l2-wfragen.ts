import { pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// [question avec …, réponse, mot interrogatif, sens, mots à ne pas proposer]
const F: [string, string, string, string, string[]][] = [
  ["… wohnst du?", "In Lausanne.", "Wo", "où", ["Wohin"]],
  ["… kommst du?", "Aus Italien.", "Woher", "d’où", []],
  ["… fährst du in den Ferien?", "Nach Spanien.", "Wohin", "où (direction)", ["Wann"]],
  ["… heisst du?", "Ich heisse Mia.", "Wie", "comment", []],
  ["… alt bist du?", "Ich bin zwölf.", "Wie", "comment / combien", []],
  ["… ist das?", "Das ist mein Bruder.", "Wer", "qui", ["Was"]],
  ["… machst du am Samstag?", "Ich spiele Tennis.", "Was", "que, quoi", ["Wann", "Wie"]],
  ["… beginnt der Film?", "Um acht Uhr.", "Wann", "quand", ["Wie"]],
  ["… kommst du nicht?", "Weil ich krank bin.", "Warum", "pourquoi", ["Wann", "Wie"]],
  ["… spielt Gitarre?", "Lena.", "Wer", "qui", []],
  ["… isst du gern?", "Pizza.", "Was", "que, quoi", ["Wann", "Wie"]],
  ["… hast du Geburtstag?", "Im Mai.", "Wann", "quand", []],
  ["… geht es dir?", "Gut, danke.", "Wie", "comment", []],
  ["… ist mein Heft?", "Auf dem Tisch.", "Wo", "où", []],
  ["… lernst du Deutsch?", "Weil ich in Zürich arbeiten möchte.", "Warum", "pourquoi", ["Wie", "Wo", "Wann"]],
  ["… Geschwister hast du?", "Zwei Schwestern.", "Wie viele", "combien", ["Welche"]],
];
const MOTS = ["Wo", "Woher", "Wohin", "Wie", "Wer", "Was", "Wann", "Warum", "Wie viele"];

/** W-Fragen : choisir le mot interrogatif d'après la réponse. */
export function gen(): Question {
  const [question, reponse, a, sens, exclus] = pick(F);
  const leurres = MOTS.filter((m) => m !== a && !exclus.includes(m));
  return {
    q: `Complète la question : <b>${question}</b> — ${reponse}`,
    txt: 1,
    a,
    choices: propositions(a, leurres),
    why: `${question.replace("…", a)} — ${reponse} ${a} = ${sens}. Le verbe conjugué vient juste après le mot interrogatif.`,
  };
}
