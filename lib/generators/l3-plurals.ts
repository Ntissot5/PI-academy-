import { R, pick } from "../math";
import type { Question } from "./types";

// [singulier, pluriel, autres pluriels acceptés, règle]
const P: [string, string, string[], string][] = [
  ["box", "boxes", [], "après -x, -s, -sh, -ch : -es"], ["bus", "buses", ["busses"], "après -s : -es"], ["watch", "watches", [], "après -ch : -es"],
  ["dish", "dishes", [], "après -sh : -es"], ["glass", "glasses", [], "après -ss : -es"], ["potato", "potatoes", [], "beaucoup de mots en -o : -es"],
  ["tomato", "tomatoes", [], "beaucoup de mots en -o : -es"], ["baby", "babies", [], "consonne + y → -ies"], ["city", "cities", [], "consonne + y → -ies"],
  ["party", "parties", [], "consonne + y → -ies"], ["family", "families", [], "consonne + y → -ies"], ["boy", "boys", [], "voyelle + y : on ajoute -s"],
  ["day", "days", [], "voyelle + y : on ajoute -s"], ["key", "keys", [], "voyelle + y : on ajoute -s"], ["toy", "toys", [], "voyelle + y : on ajoute -s"],
  ["knife", "knives", [], "-f / -fe → -ves"], ["wife", "wives", [], "-f / -fe → -ves"], ["leaf", "leaves", [], "-f / -fe → -ves"],
  ["wolf", "wolves", [], "-f / -fe → -ves"], ["shelf", "shelves", [], "-f / -fe → -ves"], ["half", "halves", [], "-f / -fe → -ves"],
  ["child", "children", [], "pluriel irrégulier"], ["man", "men", [], "pluriel irrégulier"], ["woman", "women", [], "pluriel irrégulier"],
  ["foot", "feet", [], "pluriel irrégulier"], ["tooth", "teeth", [], "pluriel irrégulier"], ["mouse", "mice", [], "pluriel irrégulier"],
  ["person", "people", ["persons"], "pluriel irrégulier"], ["sheep", "sheep", [], "même forme au singulier et au pluriel"],
  ["fish", "fish", ["fishes"], "en général, même forme au pluriel"], ["book", "books", [], "règle générale : -s"], ["bike", "bikes", [], "règle générale : -s"],
];

// Formes contractées : [forme pleine, contraction, autres]
const C: [string, string, string[]][] = [
  ["I am", "I'm", []], ["you are", "you're", []], ["he is", "he's", []], ["she is", "she's", []], ["it is", "it's", []],
  ["we are", "we're", []], ["they are", "they're", []], ["do not", "don't", []], ["does not", "doesn't", []], ["is not", "isn't", []],
  ["are not", "aren't", []], ["cannot", "can't", []], ["will not", "won't", []], ["did not", "didn't", []], ["I have", "I've", []],
  ["she will", "she'll", []], ["let us", "let's", []], ["have not", "haven't", []], ["was not", "wasn't", []],
];

/** Plurals et short forms : pluriels réguliers et irréguliers, formes contractées. */
export function gen(): Question {
  if (R(0, 2) === 0) {
    const [plein, court, alt] = pick(C);
    return {
      q: `Écris la forme contractée (short form) de <b>${plein}</b>.`,
      txt: 1,
      a: court,
      accept: alt,
      hint: "Avec une apostrophe à la place des lettres qui tombent.",
      why: `${plein} → ${court}.${court === "won't" ? " Forme spéciale : will not → won't." : court === "can't" ? " cannot s’écrit en un seul mot ; can't en est la forme courte." : " L’apostrophe remplace la lettre qui disparaît."}`,
    };
  }
  const [sg, pl, alt, regle] = pick(P);
  return {
    q: `Pluriel de <b>${sg}</b> ?`,
    txt: 1,
    a: pl,
    accept: [...alt, `the ${pl}`],
    why: `${sg} → ${pl} : ${regle}.`,
  };
}
