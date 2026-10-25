import { R, pick } from "../math";
import { CANTONS, cantonByCode } from "../cantons";
import type { GenContext, Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
export const CANTONS_INSTITUTIONS = CANTONS.filter((c) => c.institutions).map((c) => c.code);

/** Institutions du canton de l'élève (ou d'un canton tiré au hasard s'il n'est pas encore couvert). */
export function gen(ctx?: GenContext): Question {
  const own = cantonByCode(ctx?.canton);
  const c = own?.institutions ? own : cantonByCode(pick(CANTONS_INSTITUTIONS))!;
  const i = c.institutions!;
  const t = R(0, 3);
  const nums = (n: number, pool: number[]) => shuffle([String(n), ...shuffle(pool.filter((x) => x !== n)).slice(0, 3).map(String)]);
  if (t === 0) return { q: `Canton de ${c.nom} : combien de sièges compte le ${i.parlement} ?`, txt: 1, a: String(i.sieges), choices: nums(i.sieges, [50, 60, 90, 100, 110, 120, 130, 150, 160, 180]), why: `Le ${i.parlement} (parlement) de ${c.nom} compte ${i.sieges} membres.` };
  if (t === 1) return { q: `Canton de ${c.nom} : combien de membres compte le ${i.gouvernement} ?`, txt: 1, a: String(i.membres), choices: nums(i.membres, [3, 5, 7, 9]), why: `Le ${i.gouvernement} (gouvernement) de ${c.nom} a ${i.membres} membres.` };
  if (t === 2) {
    return { q: `Canton de ${c.nom} : comment s’appelle le gouvernement cantonal ?`, txt: 1, a: i.gouvernement, choices: shuffle([...new Set([i.gouvernement, "Conseil d’État", "Gouvernement", "Conseil-exécutif", "Conseil fédéral"])].slice(0, 4)), why: `À ${c.chefLieu}, le gouvernement s’appelle le ${i.gouvernement}.` };
  }
  const sieges = c.demi ? 1 : 2;
  return { q: `Combien de sièges le canton de ${c.nom} a-t-il au Conseil des États ?`, txt: 1, a: String(sieges), choices: ["1", "2", "4"], why: c.demi ? `${c.nom} est un ancien demi-canton : 1 siège.` : `Chaque canton a 2 sièges, sauf les 6 anciens demi-cantons (1 siège).` };
}
