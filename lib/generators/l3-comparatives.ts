import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, adjectif, comparatif, règle]
const C: [string, string, string, string][] = [
  ["An elephant is … than a mouse.", "big", "bigger", "adjectif court en consonne-voyelle-consonne : on double la consonne + -er"],
  ["A plane is … than a car.", "fast", "faster", "adjectif court : -er"],
  ["My grandpa is … than my dad.", "old", "older", "adjectif court : -er"],
  ["This book is … than that one.", "interesting", "more interesting", "adjectif long : more + adjectif"],
  ["A Ferrari is … than a bike.", "expensive", "more expensive", "adjectif long : more + adjectif"],
  ["Today is … than yesterday.", "hot", "hotter", "on double la consonne finale + -er"],
  ["My test result is … than last time.", "good", "better", "irrégulier : good → better"],
  ["The weather is … today than yesterday.", "bad", "worse", "irrégulier : bad → worse"],
  ["Lions are … than cats.", "dangerous", "more dangerous", "adjectif long : more + adjectif"],
  ["My sister is … than me.", "young", "younger", "adjectif court : -er"],
  ["I'm … today than yesterday.", "happy", "happier", "adjectif en -y : y → -ier"],
  ["Maths is … than history for me.", "easy", "easier", "adjectif en -y : y → -ier"],
  ["Your room is … than mine.", "tidy", "tidier", "adjectif en -y : y → -ier"],
  ["The Matterhorn is … than the Salève.", "high", "higher", "adjectif court : -er"],
  ["A giraffe is … than a horse.", "tall", "taller", "adjectif court : -er"],
  ["This street is … than that one.", "wide", "wider", "adjectif en -e : on ajoute -r"],
  ["Your idea is … than mine.", "nice", "nicer", "adjectif en -e : on ajoute -r"],
  ["Skiing is … than walking.", "difficult", "more difficult", "adjectif long : more + adjectif"],
];

/** Comparatives : -er than / more … than ; good → better, bad → worse. */
export function gen(): Question {
  const [phrase, adj, comp, regle] = pick(C);
  return {
    q: `Comparatif : <b>${phrase}</b> (${adj})`,
    txt: 1,
    a: comp,
    accept: [`${comp} than`],
    why: `${phrase.replace("…", comp)} — ${regle}.`,
  };
}
