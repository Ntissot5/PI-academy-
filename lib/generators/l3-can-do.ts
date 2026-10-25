import { R, pick } from "../math";
import type { Question } from "./types";

// [sujet, pronom pour la réponse courte, 3e personne ?]
const S: [string, string, boolean][] = [
  ["you", "I", false], ["your sister", "she", true], ["Tom", "he", true], ["your parents", "they", false], ["your friends", "they", false],
  ["she", "she", true], ["he", "he", true], ["they", "they", false],
];
const CAN = ["swim", "ski", "play the guitar", "speak Italian", "ride a horse", "cook pasta"];
const DO = ["like pizza", "play tennis", "live in Bern", "have a cat", "speak German", "watch TV in the morning"];
const S3: Record<string, string> = { like: "likes", play: "plays", have: "has", speak: "speaks", watch: "watches" };
// Sujets pour les phrases négatives : [sujet, 3e personne ?]
const SN: [string, boolean][] = [["I", false], ["We", false], ["My brother", true], ["She", true], ["They", false], ["Tom", true]];

/** can et do : questions, négations et réponses courtes. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 3) {
    const [suj, trois] = pick(SN);
    const act = pick(DO.filter((d) => !d.startsWith("live")));
    const [v, ...reste] = act.split(" ");
    const neg = trois ? "doesn't" : "don't";
    return {
      q: `Mets à la forme négative : <b>${suj} ${trois ? S3[v] : v} ${reste.join(" ")}.</b> → ${suj} … ${reste.join(" ")}.`,
      txt: 1,
      a: `${neg} ${v}`,
      accept: [`${trois ? "does" : "do"} not ${v}`, `${suj} ${neg} ${v} ${reste.join(" ")}`, `${suj} ${trois ? "does" : "do"} not ${v} ${reste.join(" ")}`],
      hint: "don't / doesn't + verbe à la base",
      why: `${suj} ${neg} ${v} ${reste.join(" ")}. ${trois ? "À la 3e personne : doesn't + base verbale (sans -s)." : "don't + base verbale."}`,
    };
  }
  const [suj, pron, trois] = pick(S);
  const avecCan = R(0, 1) === 0;
  const act = pick(avecCan ? CAN : DO);
  const aux = avecCan ? "Can" : trois ? "Does" : "Do";
  const oui = R(0, 1) === 0;
  const court = avecCan ? (oui ? "can" : "can't") : oui ? aux.toLowerCase() : trois ? "doesn't" : "don't";
  if (t === 0) {
    return {
      q: `Complète la question : <b>… ${suj} ${act}?</b> — ${oui ? "Yes" : "No"}, ${pron} ${court}.`,
      txt: 1,
      a: aux,
      why: `${aux} ${suj} ${act}? ${avecCan ? "can : capacité." : trois ? "3e personne du singulier : Does." : "Do pour I, you, we, they."} La réponse courte reprend l’auxiliaire.`,
    };
  }
  return {
    q: `Réponse courte : <b>${aux} ${suj} ${act}?</b> — ${oui ? "Yes" : "No"}, ${pron} … .`,
    txt: 1,
    a: court,
    accept: court === "can't" ? ["cannot", "can not"] : court === "doesn't" ? ["does not"] : court === "don't" ? ["do not"] : [],
    why: `${oui ? "Yes" : "No"}, ${pron} ${court}. On reprend l’auxiliaire de la question (${aux.toLowerCase()}), sans le verbe principal.`,
  };
}
