import { pick } from "../../math";
import type { Question } from "../types";
import { propositions } from "./l2-outils";

/** Un court texte original et ses questions : [question, bonne réponse, leurres, explication]. */
export interface Texte {
  genre: string;
  texte: string;
  questions: [string, string, string[], string][];
}

/** Tire un texte et une de ses questions (QCM). */
export function lecture(textes: readonly Texte[], consigne: string): Question {
  const t = pick(textes);
  const [question, a, leurres, why] = pick(t.questions);
  return {
    q: `${consigne} (${t.genre}) « ${t.texte} » — <b>${question}</b>`,
    txt: 1,
    a,
    choices: propositions(a, leurres),
    why,
  };
}
