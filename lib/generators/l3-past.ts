import { R, pick } from "../math";
import type { Question } from "./types";

// Verbes réguliers : [base, prétérit, autres formes, règle, complément]
const REG: [string, string, string[], string, string][] = [
  ["play", "played", [], "on ajoute -ed", "tennis"], ["stop", "stopped", [], "consonne doublée : stop → stopped", "the car"],
  ["study", "studied", [], "consonne + y → -ied", "for the test"], ["like", "liked", [], "après -e, on ajoute seulement -d", "the film"],
  ["travel", "travelled", ["traveled"], "UK travelled, US traveled", "to Italy"], ["plan", "planned", [], "consonne doublée : plan → planned", "a party"],
  ["carry", "carried", [], "consonne + y → -ied", "the bags"], ["visit", "visited", [], "on ajoute -ed", "our grandparents"],
  ["dance", "danced", [], "après -e, on ajoute seulement -d", "all night"], ["watch", "watched", [], "on ajoute -ed", "a film"],
  ["open", "opened", [], "on ajoute -ed", "the window"], ["cry", "cried", [], "consonne + y → -ied", "a lot"],
  ["enjoy", "enjoyed", [], "voyelle + y : on ajoute -ed", "the concert"], ["clean", "cleaned", [], "on ajoute -ed", "the kitchen"],
];
// Verbes irréguliers fréquents : [base, prétérit, complément]
const IRR: [string, string, string][] = [
  ["go", "went", "to the cinema"], ["see", "saw", "a fox"], ["eat", "ate", "a pizza"], ["buy", "bought", "a new bike"], ["have", "had", "a party"],
  ["make", "made", "a cake"], ["take", "took", "the bus"], ["write", "wrote", "a letter"], ["meet", "met", "my friends"], ["swim", "swam", "in the lake"],
];
const SUJ = ["I", "We", "My sister", "Tom", "They", "You", "She"];
const mid = (s: string) => (s === "I" || s === "Tom" ? s : s.charAt(0).toLowerCase() + s.slice(1));

/** Past simple : -ed pour les verbes réguliers ; did / didn't + base pour les questions et les négations. */
export function gen(): Question {
  const t = R(0, 3);
  const suj = pick(SUJ);
  if (t === 0) {
    const [base, past, alt, regle, compl] = pick(REG);
    return {
      q: `Past simple : <b>Yesterday ${mid(suj)} … ${compl}.</b> (${base})`,
      txt: 1,
      a: past,
      accept: alt,
      why: `Yesterday ${mid(suj)} ${past} ${compl}. ${regle.charAt(0).toUpperCase() + regle.slice(1)}.`,
    };
  }
  const [base, past, compl] = pick([...IRR, ...REG.map((r): [string, string, string] => [r[0], r[1], r[4]])]);
  if (t === 1) {
    return {
      q: `Mets à la forme négative : <b>${suj} ${past} ${compl} last week.</b> → ${suj} … ${compl} last week.`,
      txt: 1,
      a: `didn't ${base}`,
      accept: [`did not ${base}`, `${suj} didn't ${base} ${compl} last week`, `${suj} did not ${base} ${compl} last week`],
      hint: "didn't + verbe à la base",
      why: `${suj} didn't ${base} ${compl} last week. Après didn't, le verbe revient à la base (${past} → ${base}).`,
    };
  }
  const sujQ = suj === "I" ? "you" : suj.replace(/^My/, "your").replace(/^We$/, "you").replace(/^They$/, "they").replace(/^You$/, "you").replace(/^She$/, "she");
  if (t === 2) {
    return {
      q: `Complète la question : <b>… ${sujQ} ${base} ${compl} yesterday?</b>`,
      txt: 1,
      a: "Did",
      why: `Did ${sujQ} ${base} ${compl} yesterday? Au past simple, la question se fait avec Did + sujet + base verbale, pour toutes les personnes.`,
    };
  }
  return {
    q: `Complète la question : <b>Did ${sujQ} … ${compl} yesterday?</b> (${base})`,
    txt: 1,
    a: base,
    hint: "Après did, quelle forme du verbe ?",
    why: `Did ${sujQ} ${base} ${compl} yesterday? Après did, le verbe est à la base : pas ${past} !`,
  };
}
