import { pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

const CAT = ["un nom (noun)", "un verbe (verb)", "un adjectif (adjective)", "un adverbe (adverb)", "une préposition (preposition)", "une conjonction (conjunction)", "un pronom (pronoun)"];
// [phrase, mot, catégorie (index dans CAT)]
const W: [string, string, number][] = [
  ["The dog is sleeping.", "dog", 0], ["My teacher is nice.", "teacher", 0], ["We need more water.", "water", 0],
  ["We play tennis.", "play", 1], ["She is my friend.", "is", 1], ["They went home.", "went", 1],
  ["It's a beautiful song.", "beautiful", 2], ["It's a small house.", "small", 2], ["The film was boring.", "boring", 2],
  ["She sings beautifully.", "beautifully", 3], ["He opened the door slowly.", "slowly", 3], ["I always walk to school.", "always", 3],
  ["The book is on the table.", "on", 4], ["We walked through the forest.", "through", 4], ["I'm going with my brother.", "with", 4],
  ["I like tea but not coffee.", "but", 5], ["I'm hungry because I didn't eat.", "because", 5], ["You can stay or go.", "or", 5],
  ["They live in Bern.", "They", 6], ["Can you help me?", "me", 6], ["She plays the guitar.", "She", 6],
];

/** Catégories de mots en anglais. */
export function gen(): Question {
  const [phrase, mot, c] = pick(W);
  return {
    q: `${phrase.replace(new RegExp(`\\b${mot}\\b`), `<b>${mot}</b>`)} — Dans cette phrase, <b>${mot}</b> est…`,
    txt: 1,
    a: CAT[c],
    choices: propositions(CAT[c], CAT.filter((_, i) => i !== c)),
    why: `${mot} : ${CAT[c]}.${c === 3 ? " Beaucoup d’adverbes de manière se terminent par -ly." : c === 2 ? " L’adjectif décrit un nom." : ""}`,
  };
}
