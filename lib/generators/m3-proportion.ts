import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr } from "./m3-outils";

const PRODUITS = ["pommes", "cerises", "abricots", "tomates", "pommes de terre", "carottes"];

/** Proportionnalité quantité / quantité : prix, devises, recettes, tableaux, facteur, agrandissements (PER MSN 33, 9e-10e). */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const uc = 5 * R(24, 120), q1 = R(2, 6);
    let q2: number; do q2 = R(2, 9); while (q2 === q1);
    const p = pick(PRODUITS);
    return { q: `${q1} kg de ${p} coûtent ${fr(arr((uc * q1) / 100))} CHF. Combien coûtent ${q2} kg ?`, txt: 1, a: arr((uc * q2) / 100), hint: "Passe par le prix de 1 kg.", why: `1 kg : ${fr(arr((uc * q1) / 100))} ÷ ${q1} = ${fr(uc / 100)} CHF ; ${q2} kg : ${q2} × ${fr(uc / 100)} = ${fr(arr((uc * q2) / 100))} CHF.` };
  }
  if (t === 1) {
    const c = pick([0.92, 0.94, 0.95, 0.96, 0.98]), E = 10 * R(2, 40), chf = arr(c * E);
    if (R(0, 1)) return { q: `Pour cet exercice, 1 € vaut ${fr(c)} CHF. Combien de francs obtiens-tu pour ${E} € ?`, txt: 1, a: chf, why: `${E} × ${fr(c)} = ${fr(chf)} CHF.` };
    return { q: `Pour cet exercice, 1 € vaut ${fr(c)} CHF. Combien d’euros obtiens-tu pour ${fr(chf)} CHF ?`, txt: 1, a: E, why: `${fr(chf)} ÷ ${fr(c)} = ${E} €.` };
  }
  if (t === 2) {
    const p1 = pick([2, 4, 6]), k = 5 * R(5, 30);
    let p2: number; do p2 = R(2, 12); while (p2 === p1);
    const ing = pick(["farine", "sucre", "chocolat", "beurre"]);
    return { q: `Pour un gâteau pour ${p1} personnes, il faut ${k * p1} g de ${ing}. Combien en faut-il pour ${p2} personnes ?`, txt: 1, a: k * p2, why: `Par personne : ${k * p1} ÷ ${p1} = ${k} g ; pour ${p2} : ${p2} × ${k} = ${k * p2} g.` };
  }
  if (t === 3) {
    const k = pick([1.5, 2, 2.5, 3, 4, 0.5, 1.2]), x1 = 2 * R(1, 6);
    let x2: number; do x2 = 2 * R(1, 10); while (x2 === x1);
    return { q: `Tableau de proportionnalité : ${x1} → ${fr(k * x1)} et ${x2} → ?`, txt: 1, a: arr(k * x2), hint: "Cherche le facteur de proportionnalité.", why: `Facteur : ${fr(k * x1)} ÷ ${x1} = ${fr(k)} ; ${x2} × ${fr(k)} = ${fr(arr(k * x2))}.` };
  }
  if (t === 4) {
    const k = R(2, 6), xs = [R(1, 3), R(4, 6), R(7, 10)], prop = R(0, 1) === 1, d = R(1, 3) * (R(0, 1) ? 1 : -1);
    const ys = xs.map((x, i) => k * x + (!prop && i === 2 ? d : 0));
    const rap = xs.map((x, i) => fr(arr(ys[i] / x)));
    return { q: `Ce tableau est-il un tableau de proportionnalité ? ${xs.map((x, i) => `${x} → ${ys[i]}`).join(" ; ")}`, txt: 1, a: prop ? "oui" : "non", choices: ["oui", "non"], hint: "Divise chaque nombre du bas par celui du haut.", why: prop ? `On multiplie toujours par ${k} : c’est proportionnel.` : `Les quotients ne sont pas tous égaux (${rap.join(" ; ")}) : ce n’est pas proportionnel.` };
  }
  if (t === 5) {
    const a = 2 * R(2, 8), b = 2 * R(3, 12), f = pick([1.5, 2, 2.5, 3, 0.5]);
    return { q: `Un rectangle de ${a} cm sur ${b} cm est ${f > 1 ? "agrandi" : "réduit"} : le côté de ${a} cm devient ${fr(a * f)} cm. Que devient le côté de ${b} cm ?`, txt: 1, a: b * f, why: `Facteur : ${fr(a * f)} ÷ ${a} = ${fr(f)} ; ${b} × ${fr(f)} = ${fr(b * f)} cm.` };
  }
  const k = pick([1.5, 2.5, 3, 4, 0.5, 1.2]), x1 = 2 * R(1, 9);
  return { q: `Dans une situation de proportionnalité, ${x1} correspond à ${fr(arr(k * x1))}. Quel est le facteur de proportionnalité ?`, txt: 1, a: k, why: `${fr(arr(k * x1))} ÷ ${x1} = ${fr(k)}.` };
}
