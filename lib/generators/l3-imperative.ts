import { pick } from "../math";
import type { Question } from "./types";

// [consigne en français, verbe, réponse, autres réponses, suite de la phrase]
const I: [string, string, string, string[], string][] = [
  ["Ferme la porte, s’il te plaît !", "close", "Close", ["Shut"], "the door, please"],
  ["Ouvrez vos livres !", "open", "Open", [], "your books"],
  ["Écoute bien !", "listen", "Listen", [], "carefully"],
  ["Assieds-toi !", "sit down", "Sit down", [], ""],
  ["Lève-toi !", "stand up", "Stand up", [], ""],
  ["Regarde le tableau !", "look", "Look", [], "at the board"],
  ["Lis le texte !", "read", "Read", [], "the text"],
  ["Écris ton nom !", "write", "Write", [], "your name"],
  ["Ne cours pas dans le couloir !", "run", "Don't run", ["Do not run"], "in the corridor"],
  ["Ne parle pas !", "talk", "Don't talk", ["Do not talk"], ""],
  ["N’oublie pas tes devoirs !", "forget", "Don't forget", ["Do not forget"], "your homework"],
  ["Ne mange pas en classe !", "eat", "Don't eat", ["Do not eat"], "in class"],
  ["Allons au parc !", "go", "Let's go", ["Let us go"], "to the park"],
  ["Chantons une chanson !", "sing", "Let's sing", ["Let us sing"], "a song"],
  ["Sois sage !", "be", "Be", [], "good"],
  ["Ne sois pas en retard !", "be", "Don't be", ["Do not be"], "late"],
];

/** Imperative : la base verbale, Don't + base, Let's + base. */
export function gen(): Question {
  const [fr, verbe, a, alt, suite] = pick(I);
  const phrase = suite ? `${a} ${suite}!` : `${a}!`;
  return {
    q: `« ${fr} » → <b>… ${suite ? `${suite}!` : "!"}</b> (to ${verbe})`,
    txt: 1,
    a,
    accept: [...alt, ...[a, ...alt].map((x) => (suite ? `${x} ${suite}` : x))],
    hint: "Pas de sujet à l’impératif.",
    why: `${phrase} ${a.startsWith("Don't") ? "Interdiction : Don't + verbe." : a.startsWith("Let's") ? "Proposition : Let's + verbe (= allons, faisons…)." : "Impératif : le verbe seul, sans sujet."}`,
  };
}
