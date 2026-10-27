import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, réponse, explication]
const S: [string, string, string][] = [
  ["Ich habe … Hund.", "keinen", "ein Hund → kein Hund ; masculin à l’accusatif : keinen"],
  ["Ich habe heute … Zeit.", "keine", "nom sans article (Zeit, féminin) → keine"],
  ["Das ist … Katze, das ist ein Hase.", "keine", "eine Katze → keine Katze"],
  ["Das ist … Apfel, das ist eine Birne.", "kein", "ein Apfel → kein Apfel (nominatif)"],
  ["Wir haben heute … Hausaufgaben.", "keine", "nom au pluriel sans article → keine"],
  ["Er isst … Fleisch.", "kein", "nom sans article (das Fleisch) → kein"],
  ["Sie trinkt … Milch.", "keine", "nom sans article (die Milch) → keine"],
  ["Ich habe … Hunger.", "keinen", "der Hunger, accusatif → keinen"],
  ["Wir haben … Auto.", "kein", "ein Auto → kein Auto"],
  ["Der Film ist … gut.", "nicht", "on nie un adjectif → nicht"],
  ["Ich komme heute …", "nicht", "on nie le verbe → nicht, à la fin"],
  ["Das Wasser ist … kalt.", "nicht", "on nie un adjectif → nicht"],
  ["Ich finde den Schlüssel …", "nicht", "nom avec l’article défini (den Schlüssel) → nicht"],
  ["Ich kann … schwimmen.", "nicht", "on nie le verbe → nicht"],
  ["Tom ist … krank.", "nicht", "on nie un adjectif → nicht"],
  ["Lena wohnt … in Bern.", "nicht", "on nie un lieu → nicht"],
  ["Das ist … mein Velo.", "nicht", "nom avec un possessif (mein) → nicht"],
  ["Ich habe … Geschwister.", "keine", "nom au pluriel sans article → keine"],
];

/** Négation : kein devant un nom sans article ou avec ein ; nicht dans les autres cas. */
export function gen(): Question {
  const [phrase, a, raison] = pick(S);
  return {
    q: `Complète avec <b>nicht</b> ou <b>kein</b> : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: ["nicht", "kein", "keine", "keinen"],
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
