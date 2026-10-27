import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, réponse, raison]
const P: [string, "in" | "on" | "at", string][] = [
  ["The lesson starts … 8 o'clock.", "at", "heure précise → at"], ["My birthday is … May.", "in", "mois → in"],
  ["We have sport … Monday.", "on", "jour → on"], ["I was born … 2012.", "in", "année → in"],
  ["I do my homework … the evening.", "in", "in the morning / afternoon / evening"], ["I sleep well … night.", "at", "at night (expression)"],
  ["We open presents … Christmas.", "at", "fête (période) → at Christmas"], ["It's very hot … summer.", "in", "saison → in"],
  ["The party is … 3 June.", "on", "date → on"], ["My mum is … the kitchen.", "in", "à l’intérieur d’une pièce → in"],
  ["The book is … the table.", "on", "sur une surface → on"], ["There's a picture … the wall.", "on", "sur une surface → on"],
  ["I'm … home.", "at", "at home (expression)"], ["Wait for me … the bus stop.", "at", "à un point précis → at"],
  ["Lausanne is … Switzerland.", "in", "pays, ville → in"], ["We are … the bus.", "on", "dans un bus, un train → on"],
  ["The cat is hiding … the box: I can't see it.", "in", "à l’intérieur → in"],
];

/** Prépositions de temps et de lieu : in, on, at. */
export function gen(): Question {
  const [phrase, a, raison] = pick(P);
  return {
    q: `in, on ou at ? <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: ["in", "on", "at"],
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
