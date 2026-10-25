import { R, pick } from "../math";
import { futur, imparfait, passeCompose, present, pronom, avecEtre, TOUS_VERBES, type Personne, type Temps } from "./data/verbes-fr";
import type { Question } from "./types";

export const KEYS_FR = ["é", "è", "ê", "à", "ç", "ù", "î", "û"];
const NOM: Record<Temps, string> = { present: "au présent", imparfait: "à l’imparfait", futur: "au futur simple", pc: "au passé composé" };

/** Conjugaison d'un verbe tiré au hasard, à un temps donné. On répond par la forme du verbe. */
export function conj(temps: Temps): Question {
  const v = pick(TOUS_VERBES);
  let p = R(0, 5) as Personne;
  // Avec être, je/tu/nous/vous ne disent pas si c'est masculin ou féminin : on prend il/elle/ils/elles.
  const etre = temps === "pc" && avecEtre(v);
  if (etre && ![2, 5].includes(p)) p = pick([2, 5] as const);
  const fem = (p === 2 || p === 5) && R(0, 1) === 1;
  const forme = temps === "pc" ? passeCompose(v, p, fem) : (temps === "present" ? present(v) : temps === "imparfait" ? imparfait(v) : futur(v))[p];
  const pr = pronom(p, forme, fem);
  const why = temps === "pc"
    ? `Passé composé = ${etre ? "être" : "avoir"} au présent + participe passé${etre ? ", accordé avec le sujet" : ""} : ${pr}${forme}.`
    : `${pr}${forme}.`;
  return {
    q: `Conjugue « ${v} » ${NOM[temps]} : <b>${pr.trim() === "j’" ? "j’…" : pr.trim() + " …"}</b>`,
    txt: 1,
    a: forme,
    accept: [`${pr}${forme}`, `${pr.replace("’", "'")}${forme}`],
    keys: KEYS_FR,
    hint: "Écris seulement le verbe (le pronom est accepté aussi).",
    why,
  };
}
