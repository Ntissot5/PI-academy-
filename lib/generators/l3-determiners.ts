import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// a ou an : [nom, réponse, raison]
const AAN: [string, "a" | "an", string][] = [
  ["apple", "an", "son voyelle au début"], ["banana", "a", "son consonne au début"], ["umbrella", "an", "son voyelle au début"],
  ["hour", "an", "le h ne se prononce pas : son voyelle"], ["university", "a", "university commence par le son « you » (consonne)"],
  ["uniform", "a", "uniform commence par le son « you » (consonne)"], ["egg", "an", "son voyelle au début"], ["orange", "an", "son voyelle au début"],
  ["horse", "a", "le h se prononce : son consonne"], ["elephant", "an", "son voyelle au début"], ["honest boy", "an", "le h de honest ne se prononce pas"],
  ["European city", "a", "European commence par le son « you » (consonne)"], ["ice cream", "an", "son voyelle au début"], ["dog", "a", "son consonne au début"],
];
// Possessifs : [phrase avec …, réponse, raison]
const POSS: [string, string, string][] = [
  ["Tom loves … dog.", "his", "à Tom (un garçon) → his"], ["Anna is reading … book.", "her", "à Anna (une fille) → her"],
  ["Ben and Mia visit … grandparents.", "their", "à Ben et Mia → their"], ["The cat is eating … food.", "its", "au chat (animal ou chose) → its, sans apostrophe"],
  ["We love … new house.", "our", "à nous → our"], ["I can’t find … keys.", "my", "à moi → my"], ["Is this … bag, Sara?", "your", "à toi → your"],
  ["My parents sold … car.", "their", "à mes parents → their"], ["The tree has lost … leaves.", "its", "à l’arbre → its"], ["Mr Smith is washing … car.", "his", "à Mr Smith → his"],
];
// Démonstratifs : [phrase, réponse, raison]
const DEM: [string, string, string][] = [
  ["… shoes here are new. (proche, pluriel)", "These", "proche + pluriel → these"], ["… book here is mine. (proche, singulier)", "This", "proche + singulier → this"],
  ["Look at … house over there! (loin, singulier)", "that", "loin + singulier → that"], ["… mountains over there are very high. (loin, pluriel)", "Those", "loin + pluriel → those"],
  ["I like … T-shirt I’m wearing. (proche, singulier)", "this", "proche + singulier → this"], ["Can you see … birds in the sky? (loin, pluriel)", "those", "loin + pluriel → those"],
];

/** Déterminants : a / an, the ; possessifs (my, his, her, its, their…) ; démonstratifs (this, that, these, those). */
export function gen(): Question {
  const t = R(0, 2);
  if (t === 0) {
    const [nom, a, raison] = pick(AAN);
    return {
      q: `<b>a</b> ou <b>an</b> ? <b>… ${nom}</b>`,
      txt: 1,
      a,
      choices: ["a", "an"],
      why: `${a} ${nom} : ${raison}. On regarde le son, pas la lettre.`,
    };
  }
  if (t === 1) {
    const [phrase, a, raison] = pick(POSS);
    return {
      q: `Complète avec un possessif : <b>${phrase}</b> (ce qui appartient ${raison.split(" → ")[0]})`,
      txt: 1,
      a,
      choices: propositions(a, ["my", "your", "his", "her", "its", "our", "their", "it's"]),
      why: `${phrase.replace("…", a)} — ${raison}.`,
    };
  }
  const [phrase, a, raison] = pick(DEM);
  return {
    q: `Complète : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: a.charAt(0) === a.charAt(0).toUpperCase() ? ["This", "That", "These", "Those"] : ["this", "that", "these", "those"],
    why: `${phrase.replace("…", a).replace(/ \(.*\)/, "")} — ${raison}.`,
  };
}
