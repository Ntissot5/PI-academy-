import { R, pick } from "../math";
import type { Question } from "./types";

// [sujet, be, forme courte de be]
const S: [string, string, string][] = [
  ["I", "am", "I'm"], ["She", "is", "She's"], ["We", "are", "We're"], ["They", "are", "They're"], ["My brother", "is", ""], ["You", "are", "You're"],
];
const PLANS: [string, string][] = [["visit", "my grandma next weekend"], ["buy", "a new phone next month"], ["learn", "Spanish next year"], ["watch", "the match tonight"], ["paint", "the bedroom tomorrow"]];
const PREDICTIONS: [string, string, string][] = [
  ["I think it", "be", "sunny tomorrow"], ["Maybe they", "win", "the game"], ["In 2050, people", "live", "on the Moon"],
  ["I'm sure you", "pass", "the test"], ["I hope she", "come", "to my party"],
];
// QCM : [situation, phrase, bonne réponse, mauvaise réponse, explication]
const CHOIX: [string, string, string, string, string][] = [
  ["Une décision prise à l’instant", "The phone is ringing. — I … answer it!", "will", "am going to", "décision spontanée → will (I'll)"],
  ["Une offre d’aide spontanée", "Your bag looks heavy. — I … carry it for you.", "will", "am going to", "offre spontanée → will (I'll)"],
  ["Une promesse", "I promise I … call you tonight.", "will", "am going to", "promesse → will"],
  ["Un projet déjà décidé", "We've bought the tickets. We … see the concert on Friday.", "are going to", "will", "projet décidé à l’avance → be going to"],
  ["Une intention", "I've saved my money because I … buy a guitar.", "am going to", "will", "intention déjà prise → be going to"],
];

/** Futur : be going to (projet, intention) et will (prédiction, décision spontanée, promesse). */
export function gen(): Question {
  const t = R(0, 2);
  if (t === 0) {
    const [suj, be, court] = pick(S);
    const [v, fin] = pick(PLANS);
    const a = `${be} going to ${v}`;
    return {
      q: `Futur avec going to : <b>${suj} … ${fin}.</b> (${v})`,
      txt: 1,
      a,
      accept: [`${suj} ${a}`, ...(court ? [`${court} going to ${v}`, `${court.slice(court.indexOf("'"))} going to ${v}`] : [])],
      hint: "am / is / are + going to + verbe",
      why: `${suj} ${a} ${fin}. be going to : un projet ou une intention.`,
    };
  }
  if (t === 1) {
    const [debut, v, fin] = pick(PREDICTIONS);
    const neg = R(0, 2) === 0;
    const a = neg ? `won't ${v}` : `will ${v}`;
    return {
      q: `Futur avec will${neg ? " (négatif)" : ""} : <b>${debut} … ${fin}.</b> (${v})`,
      txt: 1,
      a,
      accept: neg ? [`will not ${v}`] : [`'ll ${v}`],
      hint: neg ? "won't + verbe" : "will + verbe",
      why: `${debut} ${a} ${fin}. will + base verbale (même forme pour toutes les personnes)${neg ? " ; will not = won't" : ""} : une prédiction ou un espoir.`,
    };
  }
  const [situation, phrase, a, faux, why] = pick(CHOIX);
  return {
    q: `${situation} : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: [a, faux].sort(),
    why: `${phrase.replace("…", a)} — ${why}.`,
  };
}
