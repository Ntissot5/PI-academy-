import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec the …, adjectif, superlatif, autres, règle]
const S: [string, string, string, string[], string][] = [
  ["Mount Everest is the … mountain in the world.", "high", "highest", [], "adjectif court : the …-est"],
  ["The blue whale is the … animal in the world.", "big", "biggest", ["largest"], "on double la consonne : the biggest"],
  ["The cheetah is the … land animal.", "fast", "fastest", [], "adjectif court : the …-est"],
  ["This is the … day of my life!", "good", "best", [], "irrégulier : good → better → the best"],
  ["That was the … film I have ever seen.", "bad", "worst", [], "irrégulier : bad → worse → the worst"],
  ["Lea is the … pupil in our class.", "young", "youngest", [], "adjectif court : the …-est"],
  ["This is the … shop in town.", "expensive", "most expensive", [], "adjectif long : the most + adjectif"],
  ["It's the … beach I know.", "beautiful", "most beautiful", [], "adjectif long : the most + adjectif"],
  ["Sunday is the … day of the week for me.", "happy", "happiest", [], "adjectif en -y : the …-iest"],
  ["In Switzerland, 21 December is the … day of the year.", "short", "shortest", [], "adjectif court : the …-est"],
  ["This is the … question in the test.", "difficult", "most difficult", [], "adjectif long : the most + adjectif"],
  ["In Switzerland, July is often the … month of the year.", "hot", "hottest", [], "on double la consonne : the hottest"],
];

/** Superlatives : the …-est / the most … ; the best, the worst. */
export function gen(): Question {
  const [phrase, adj, sup, alt, regle] = pick(S);
  return {
    q: `Superlatif : <b>${phrase}</b> (${adj})`,
    txt: 1,
    a: sup,
    accept: [...alt, `the ${sup}`, ...alt.map((x) => `the ${x}`)],
    why: `${phrase.replace("…", sup)} — ${regle}.`,
  };
}
