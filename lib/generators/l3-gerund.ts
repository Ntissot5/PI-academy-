import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, verbe, réponse, raison]
const G: [string, string, string, string][] = [
  ["I enjoy … in the lake.", "swim", "swimming", "enjoy + -ing"],
  ["She wants … Spanish.", "learn", "to learn", "want + to + base"],
  ["We finished … at six.", "eat", "eating", "finish + -ing"],
  ["They decided … a dog.", "buy", "to buy", "decide + to + base"],
  ["Do you mind … the window?", "open", "opening", "mind + -ing"],
  ["I hope … you soon.", "see", "to see", "hope + to + base"],
  ["He keeps … the same mistake.", "make", "making", "keep + -ing"],
  ["We need … more water.", "drink", "to drink", "need + to + base"],
  ["She is good at … .", "draw", "drawing", "après une préposition (at) : -ing"],
  ["Thank you for … me.", "help", "helping", "après une préposition (for) : -ing"],
  ["I'm planning … my cousins in July.", "visit", "to visit", "plan + to + base"],
  ["He promised … on time.", "be", "to be", "promise + to + base"],
  ["They avoid … sweets.", "eat", "eating", "avoid + -ing"],
  ["I would like … a pizza.", "order", "to order", "would like + to + base"],
  ["My brother is interested in … films.", "make", "making", "après une préposition (in) : -ing"],
];

/** Verbes suivis du gérondif (-ing) ou de l'infinitif (to + base). */
export function gen(): Question {
  const [phrase, verbe, a, raison] = pick(G);
  return {
    q: `-ing ou to + verbe ? <b>${phrase}</b> (${verbe})`,
    txt: 1,
    a,
    why: `${phrase.replace(" … .", ` ${a}.`).replace("…", a)} — ${raison}.`,
  };
}
