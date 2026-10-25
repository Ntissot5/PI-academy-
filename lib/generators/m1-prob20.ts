import { R, pick } from "../math";
import type { Question } from "./types";
import { PRENOMS } from "./m1-outils";

const que = (n: string) => (/^[AEIOUÉ]/.test(n) ? `qu’${n}` : `que ${n}`);

/** Petits problèmes additifs et soustractifs (EEE, ETE, ECE), argent, premières multiplications ; nombres jusqu'à `max`. */
export function probleme(max: number): Question {
  const grand = max > 20;
  const p = pick(PRENOMS), p2 = pick(PRENOMS.filter((x) => x !== p));
  // a + b = s ≤ max
  const s = grand ? R(30, max) : R(8, max), a = grand ? R(10, s - 10) : R(2, s - 2), b = s - a;
  const t = R(0, 10);
  if (t === 0) return { q: `${p} a ${a} billes. À la récré, ${p} en gagne ${b}. Combien de billes a ${p} maintenant ?`, txt: 1, a: s, why: `On gagne des billes : on ajoute. ${a} + ${b} = ${s} billes.` };
  if (t === 1) return { q: `Il y a ${s} oiseaux ${grand ? "dans le parc" : "sur un arbre"}. ${b} s’envolent. Combien d’oiseaux restent ${grand ? "dans le parc" : "sur l’arbre"} ?`, txt: 1, a, why: `Des oiseaux partent : on enlève. ${s} − ${b} = ${a} oiseaux.` };
  if (t === 2) return { q: `${p} avait ${a} cartes. On lui en donne encore. Maintenant, ${p} a ${s} cartes. Combien de cartes lui a-t-on données ?`, txt: 1, a: b, hint: "Cherche ce qui manque.", why: `De ${a} pour aller à ${s}, il manque ${b} : ${a} + ${b} = ${s}, ou ${s} − ${a} = ${b}.` };
  if (t === 3) return { q: `Un marchand vend ${b} pommes. Il lui en reste ${a}. Combien de pommes avait-il au début ?`, txt: 1, a: s, hint: "Avant de vendre, il en avait plus.", why: `Au début, il y avait les pommes vendues et celles qui restent : ${b} + ${a} = ${s}.` };
  if (t === 4) {
    if (Math.random() < 0.5) return { q: `Dans le bus, il y a ${a} enfants et ${b} adultes. Combien de personnes y a-t-il dans le bus ?`, txt: 1, a: s, why: `Enfants et adultes ensemble : ${a} + ${b} = ${s} personnes.` };
    return { q: `${grand ? "Une école" : "Une classe"} a ${s} élèves. ${a} sont des filles. Combien y a-t-il de garçons ?`, txt: 1, a: b, why: `Les garçons, c’est le reste : ${s} − ${a} = ${b} garçons.` };
  }
  if (t === 5) return { q: `${p} a ${a} autocollants. ${p2} en a ${b} de plus ${que(p)}. Combien d’autocollants a ${p2} ?`, txt: 1, a: s, why: `« De plus » : ${a} + ${b} = ${s} autocollants.` };
  if (t === 6) return { q: `${p} a lu ${s} pages. ${p2} a lu ${b} pages de moins ${que(p)}. Combien de pages a lu ${p2} ?`, txt: 1, a, why: `« De moins » : ${s} − ${b} = ${a} pages.` };
  if (t === 7) return { q: `${p} a ${s} billes, ${p2} en a ${a}. Combien de billes manque-t-il à ${p2} pour en avoir autant ${que(p)} ?`, txt: 1, a: b, why: `On cherche l’écart : ${a} + ${b} = ${s}, donc il manque ${b} billes.` };
  if (t === 8) {
    if (Math.random() < 0.5) return { q: `Tu as ${s} CHF. Tu achètes un livre à ${a} CHF. Combien d’argent te reste-t-il ?`, txt: 1, a: b, hint: "En CHF", why: `On paie, donc on enlève : ${s} − ${a} = ${b} CHF.` };
    if (grand) {
      const x = R(1, 5), y = R(1, 5), z = R(0, 4), tot = 20 * x + 10 * y + 5 * z;
      return { q: `Tu as ${x} billet${x > 1 ? "s" : ""} de 20 CHF${z ? "," : " et"} ${y} billet${y > 1 ? "s" : ""} de 10 CHF${z ? ` et ${z} pièce${z > 1 ? "s" : ""} de 5 CHF` : ""}. Combien d’argent as-tu ?`, txt: 1, a: tot, hint: "En CHF", why: `${20 * x} CHF + ${10 * y} CHF${z ? ` + ${5 * z} CHF` : ""} = ${tot} CHF.` };
    }
    const x = R(1, 5), y = R(0, 2), tot = 2 * x + 5 * y;
    return { q: `Tu as ${x} pièce${x > 1 ? "s" : ""} de 2 CHF${y ? ` et ${y} pièce${y > 1 ? "s" : ""} de 5 CHF` : ""}. Combien d’argent as-tu ?`, txt: 1, a: tot, hint: "En CHF", why: `${Array.from({ length: x }, () => 2).join(" + ")}${y ? " + " + Array.from({ length: y }, () => 5).join(" + ") : ""} = ${tot} CHF.` };
  }
  if (t === 9) {
    if (Math.random() < 0.6) {
      const k = grand ? R(2, 6) : R(2, 4), n = grand ? R(3, 10) : R(2, 5), objet = pick([["boîtes", "œufs"], ["sachets", "billes"], ["rangées", "chaises"]]);
      return { q: `Il y a ${k} ${objet[0]} de ${n} ${objet[1]}. Combien de ${objet[1]} en tout ?`, txt: 1, a: k * n, why: `${Array.from({ length: k }, () => n).join(" + ")} = ${k * n} : c’est aussi ${k} × ${n}.` };
    }
    const x = R(2, 4), y = R(2, 3);
    return { q: `${p} a ${x} t-shirts et ${y} shorts. Avec 1 t-shirt et 1 short, combien de tenues différentes peut-on faire ?`, txt: 1, a: x * y, hint: "Chaque t-shirt va avec chaque short.", why: `Chaque t-shirt va avec les ${y} shorts : ${Array.from({ length: x }, () => y).join(" + ")} = ${x * y} tenues (${x} × ${y}).` };
  }
  const n = grand ? R(10, 90) : R(3, 9), tot = 2 * n + 1;
  return { q: `Deux nombres qui se suivent font ${tot} ensemble. Quel est le plus petit des deux ?`, txt: 1, a: n, hint: "Essaie, puis ajuste.", why: `On essaie : ${n} et ${n + 1}, ça fait ${n} + ${n + 1} = ${tot}. Le plus petit est ${n}.` };
}

/** Problèmes additifs, soustractifs, argent et premières multiplications jusqu'à 20 : PER MSN 13, 3e-4e. */
export function gen(): Question {
  return probleme(20);
}
