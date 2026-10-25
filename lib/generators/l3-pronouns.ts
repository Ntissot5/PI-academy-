import { R, pick } from "../math";
import type { Question } from "./types";

// [sujet, complément, sens]
const P: [string, string, string][] = [
  ["I", "me", "je / moi"], ["you", "you", "tu / toi"], ["he", "him", "il / lui"], ["she", "her", "elle"], ["it", "it", "il, elle (chose, animal)"],
  ["we", "us", "nous"], ["they", "them", "ils, elles / eux"],
];
const OBJ = ["Can you help … ?", "Everybody likes … .", "This present is for … .", "Look at … !", "Please call … tonight.", "My grandma often visits … ."];
const SUJ = ["… plays tennis every Friday.", "… are in the same class.", "… is very funny.", "… live in Geneva.", "… can swim very well."];

/** Pronoms personnels sujets (I, he, they…) et compléments (me, him, them…). */
export function gen(): Question {
  const [s, o, sens] = pick(P.filter((p) => p[0] !== "you"));
  if (R(0, 2) > 0) {
    const phrase = pick(OBJ);
    const fin = phrase.replace(/ … ?([.!?])/, ` ${o}$1`).replace(" … ", ` ${o} `);
    return {
      q: `Complète avec le pronom complément de <b>${s}</b> (${sens}) : <b>${phrase}</b>`,
      txt: 1,
      a: o,
      why: `${fin} Après un verbe ou une préposition (for, at…), on utilise le pronom complément : ${s} → ${o}.`,
    };
  }
  if (s === "it") return gen();
  const troisSg = s === "he" || s === "she" || s === "it";
  const choixPhr = SUJ.filter((x) => (x.includes(" plays ") || x.includes(" is ") ? troisSg : x.includes(" are ") || x.includes(" live ") ? !troisSg && s !== "I" : true));
  const phrase = pick(choixPhr);
  const sujet = s === "I" ? "I" : s.charAt(0).toUpperCase() + s.slice(1);
  return {
    q: `Complète avec le pronom sujet qui correspond à <b>${o}</b> : <b>${phrase}</b>`,
    txt: 1,
    a: sujet,
    why: `${phrase.replace("…", sujet)} En début de phrase, devant le verbe, on met le pronom sujet : ${o} → ${s}.`,
  };
}
