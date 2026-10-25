import { R, pick } from "../math";
import type { Question } from "./types";
import { melange } from "./data/l2-outils";

// [proposition principale, conjonctions possibles, sujet, milieu, verbe conjugué]
const P: [string, ("weil" | "denn" | "dass" | "wenn")[], string, string, string][] = [
  ["Ich bleibe heute zu Hause", ["weil", "denn"], "ich", "krank", "bin"],
  ["Lena kommt nicht ins Kino", ["weil", "denn"], "sie", "keine Zeit", "hat"],
  ["Wir spielen drinnen", ["weil", "denn"], "es", "draussen", "regnet"],
  ["Ich lerne heute Abend", ["weil", "denn"], "ich", "morgen eine Prüfung", "habe"],
  ["Mein Bruder ist müde", ["weil", "denn"], "er", "zu spät ins Bett gegangen", "ist"],
  ["Ich kann nicht kommen", ["weil", "denn"], "ich", "meiner Mutter helfen", "muss"],
  ["Tom ist glücklich", ["weil", "denn"], "er", "einen Hund bekommen", "hat"],
  ["Ich weiss", ["dass"], "du", "gut Deutsch", "sprichst"],
  ["Tom sagt", ["dass"], "der Film", "spannend", "ist"],
  ["Ich glaube", ["dass"], "wir", "morgen eine Prüfung", "haben"],
  ["Lena hofft", ["dass"], "ihre Freundin", "zur Party", "kommt"],
  ["Wir gehen schwimmen", ["wenn"], "es", "warm", "ist"],
  ["Ich rufe dich an", ["wenn"], "ich", "zu Hause", "bin"],
  ["Mein Hund bellt", ["wenn"], "jemand", "an der Tür", "klingelt"],
];

const SENS: Record<string, string> = { weil: "parce que", denn: "car", dass: "que", wenn: "quand, si" };

/** Phrases complexes : après weil, dass, wenn, le verbe conjugué va à la fin ; après denn (und, aber), il reste en 2e position. */
export function gen(): Question {
  const [main, conjs, s, m, v] = pick(P);
  const conj = pick(conjs);
  const sub = conj !== "denn";
  const juste = sub ? `${main}, ${conj} ${s} ${m} ${v}.` : `${main}, ${conj} ${s} ${v} ${m}.`;
  if (conjs.length === 2 && R(0, 2) === 0) {
    const debut = sub ? `${s} ${m} ${v}` : `${s} ${v} ${m}`;
    return {
      q: `Complète avec <b>weil</b> ou <b>denn</b> : <b>${main}, … ${debut}.</b>`,
      txt: 1,
      a: conj,
      choices: ["weil", "denn"],
      why: `${juste} ${sub ? "Le verbe conjugué est à la fin : c’est une subordonnée, donc weil." : "Le verbe conjugué est en 2e position : denn ne change pas l’ordre des mots."}`,
    };
  }
  const faux = sub
    ? [`${main}, ${conj} ${s} ${v} ${m}.`, `${main}, ${conj} ${v} ${s} ${m}.`]
    : [`${main}, ${conj} ${s} ${m} ${v}.`, `${main}, ${conj} ${v} ${s} ${m}.`];
  return {
    q: `Quelle phrase est correcte ? (${conj} = ${SENS[conj]})`,
    txt: 1,
    a: juste,
    choices: melange([juste, ...faux]),
    why: sub
      ? `${juste} Après ${conj}, le verbe conjugué (${v}) va tout à la fin, et une virgule sépare les deux propositions.`
      : `${juste} denn relie deux propositions principales : le verbe (${v}) reste en 2e position.`,
  };
}
