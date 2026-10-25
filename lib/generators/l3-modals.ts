import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, sens en français, réponse, leurres, explication]
const M: [string, string, string, string[], string][] = [
  ["You … smoke in the hospital.", "c’est interdit", "mustn't", ["don't have to", "should"], "mustn't = interdiction"],
  ["Tomorrow is Sunday, so I … get up early.", "ce n’est pas nécessaire", "don't have to", ["mustn't", "can"], "don't have to = pas obligatoire (mais permis)"],
  ["You look tired. You … go to bed.", "un conseil", "should", ["mustn't", "can't"], "should = conseil"],
  ["When I was five, I … swim.", "capacité dans le passé", "could", ["can", "must"], "could = can au passé"],
  ["She … speak three languages.", "capacité", "can", ["must", "should"], "can = savoir, pouvoir"],
  ["At our school, we … wear a uniform.", "c’est obligatoire (règle)", "have to", ["don't have to", "mustn't"], "have to = obligation"],
  ["You … touch the oven, it's hot!", "c’est interdit", "mustn't", ["have to", "can"], "mustn't = interdiction"],
  ["… I open the window? It's hot in here.", "demander la permission", "Can", ["Must", "Have"], "Can I…? = demander la permission"],
  ["You … eat more vegetables, they are good for you.", "un conseil", "should", ["mustn't", "can't"], "should = conseil"],
  ["I … help my mum yesterday, so I couldn't come.", "obligation dans le passé", "had to", ["must", "should"], "had to = obligation au passé (must n’a pas de passé)"],
  ["My little brother … read yet, he's only four.", "incapacité", "can't", ["mustn't", "doesn't have to"], "can't = ne pas savoir / ne pas pouvoir"],
  ["Tom … work on Saturdays. It's part of his job.", "obligation, 3e personne", "has to", ["have to", "must to"], "has to à la 3e personne du singulier"],
];

/** Modal verbs : can, could, must, mustn't, have to, don't have to, should. */
export function gen(): Question {
  const [phrase, sens, a, leurres, raison] = pick(M);
  return {
    q: `Complète (${sens}) : <b>${phrase}</b>`,
    txt: 1,
    a,
    choices: [a, ...leurres].sort(),
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
