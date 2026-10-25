import { R, pick } from "../math";
import { PRENOMS, VILLES, arr, autresValeurs, nb, nbFixe, qcm } from "./m2-outils";
import type { Question } from "./types";

const deux = (): [string, string] => {
  const a = pick(PRENOMS);
  let b: string;
  do b = pick(PRENOMS); while (b === a);
  return [a, b];
};

/** Problèmes (5e-6e) : additifs (composition, transformation, comparaison), multiplicatifs, proportionnalité, tableaux, monnaie. */
export function gen(): Question {
  const t = R(0, 8);
  const [p1, p2] = deux();
  if (t === 0) {
    const f = R(8, 15), g = R(8, 15), k = R(0, 1);
    if (k === 0) return { q: `Une classe compte ${f} filles et ${g} garçons. Combien d’élèves y a-t-il ?`, txt: 1, a: f + g, why: `On réunit les deux parties : ${f} + ${g} = ${f + g}.` };
    return { q: `Une classe compte ${f + g} élèves, dont ${f} filles. Combien y a-t-il de garçons ?`, txt: 1, a: g, why: `On cherche une partie : ${f + g} − ${f} = ${g}.` };
  }
  if (t === 1) {
    const ini = R(20, 90), tr = R(8, 60), k = R(0, 3);
    if (k === 0) return { q: `${p1} avait ${ini + tr} CHF dans sa tirelire et dépense ${tr} CHF. Combien lui reste-t-il ?`, txt: 1, a: ini, why: `L’état final : ${ini + tr} − ${tr} = ${ini} CHF.` };
    if (k === 1) return { q: `Le sac de ${p1} contenait ${ini} billes avant la récréation et en contient ${ini + tr} après. Combien de billes ont été gagnées ?`, txt: 1, a: tr, hint: "On cherche ce qui a changé", why: `La transformation : ${ini + tr} − ${ini} = ${tr} billes gagnées.` };
    if (k === 2) return { q: `À la récréation, ${p1} gagne ${tr} billes. Son sac en contient maintenant ${ini + tr}. Combien de billes contenait-il avant ?`, txt: 1, a: ini, hint: "Remonte le temps : il faut enlever ce qui a été gagné", why: `On fait l’inverse : ${ini + tr} − ${tr} = ${ini}. Vérification : ${ini} + ${tr} = ${ini + tr}.` };
    return { q: `Un bus part de ${pick(VILLES)} avec ${ini + tr} passagers. À un arrêt, ${tr} personnes descendent et ${Math.min(tr, 9)} montent. Combien y a-t-il de passagers maintenant ?`, txt: 1, a: ini + Math.min(tr, 9), why: `${ini + tr} − ${tr} + ${Math.min(tr, 9)} = ${ini + Math.min(tr, 9)}.` };
  }
  if (t === 2) {
    const a = R(15, 80), d = R(5, 40), k = R(0, 2);
    if (k === 0) return { q: `${p1} a ${a} cartes. ${p2} en a ${d} de plus. Combien de cartes a ${p2} ?`, txt: 1, a: a + d, why: `« ${d} de plus » : ${a} + ${d} = ${a + d}.` };
    if (k === 1) return { q: `${p1} a ${a + d} cartes. ${p2} en a ${d} de moins. Combien de cartes a ${p2} ?`, txt: 1, a, why: `« ${d} de moins » : ${a + d} − ${d} = ${a}.` };
    return { q: `${p1} a ${a + d} cartes et ${p2} en a ${a}. Combien de cartes de plus que ${p2} a ${p1} ?`, txt: 1, a: d, hint: "On compare : on cherche l’écart", why: `L’écart : ${a + d} − ${a} = ${d}.` };
  }
  if (t === 3) {
    const k = R(0, 2), a = R(3, 9), b = R(4, 12);
    if (k === 0) return { q: `Un carton contient ${a} boîtes de ${b} œufs. Combien d’œufs en tout ?`, txt: 1, a: a * b, why: `${a} fois ${b} œufs : ${a} × ${b} = ${a * b}.` };
    if (k === 1) { const c = R(2, 5); return { q: `${p1} a ${a} t-shirts et ${c} pantalons. Combien de tenues différentes (un t-shirt + un pantalon) sont possibles ?`, txt: 1, a: a * c, hint: "Pour chaque t-shirt, combien de pantalons ?", why: `Chaque t-shirt va avec ${c} pantalons : ${a} × ${c} = ${a * c} tenues.` }; }
    return { q: `Dans la salle de gym, on place ${a} rangées de ${b} chaises. Combien de chaises en tout ?`, txt: 1, a: a * b, why: `${a} rangées × ${b} chaises = ${a * b}.` };
  }
  if (t === 4) {
    const u = R(2, 9), n = R(2, 5), m = R(6, 12);
    const obj = pick([["cahiers", "CHF"], ["billets de bus", "CHF"], ["kg de pommes", "CHF"]]);
    return { q: `${n} ${obj[0]} coûtent ${n * u} ${obj[1]}. Combien coûtent ${m} ${obj[0]}, au même prix ?`, txt: 1, a: m * u, hint: "Cherche d’abord le prix d’un seul", why: `Un seul : ${n * u} : ${n} = ${u} CHF, donc ${m} × ${u} = ${m * u} CHF.` };
  }
  if (t === 5) {
    const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
    let v: number[];
    do v = jours.map(() => R(12, 60)); while (new Set(v).size < 5);
    const k = R(0, 2), tab = jours.map((j, i) => `${j} : ${v[i]}`).join(" · ");
    const ctx = `Nombre de sandwichs vendus à la cafétéria — ${tab}.`;
    if (k === 0) { const a = jours[v.indexOf(Math.max(...v))]; return { q: `${ctx} Quel jour en a-t-on vendu le plus ?`, txt: 1, a, choices: [...jours], why: `Le plus grand nombre est ${Math.max(...v)} : c’est ${a}.` }; }
    if (k === 1) {
      const i = R(0, 3), plus = v[i + 1] > v[i], e = Math.abs(v[i + 1] - v[i]);
      return { q: `${ctx} Combien en a-t-on vendu de ${plus ? "plus" : "moins"} le ${jours[i + 1]} que le ${jours[i]} ?`, txt: 1, a: e, why: `${Math.max(v[i], v[i + 1])} − ${Math.min(v[i], v[i + 1])} = ${e}.` };
    }
    const s = v.reduce((x, y) => x + y, 0);
    return { q: `${ctx} Combien en a-t-on vendu pendant toute la semaine ?`, txt: 1, a: s, why: `${v.join(" + ")} = ${s}.` };
  }
  if (t === 6) {
    const a = R(4, 15), b = R(3, 9);
    const it = pick([
      [`Un livre coûte ${a} CHF. Combien coûtent ${b} livres ?`, `${b} × ${a}`, [`${a} + ${b}`, `${a} − ${b}`, `${a} : ${b}`]],
      [`${p1} a ${a + b} ans. Son frère a ${b} ans de moins. Quel âge a son frère ?`, `${a + b} − ${b}`, [`${a + b} + ${b}`, `${a + b} × ${b}`, `${b} − ${a + b}`]],
      [`Un train a ${b} wagons de ${a * 2} places. Combien de places en tout ?`, `${b} × ${a * 2}`, [`${b} + ${a * 2}`, `${a * 2} − ${b}`, `${a * 2} : ${b}`]],
      [`Tu as ${a} CHF et ta grand-mère t’en donne ${b * 2}. Combien as-tu maintenant ?`, `${a} + ${b * 2}`, [`${a} × ${b * 2}`, `${b * 2} − ${a}`, `${a} − ${b * 2}`]],
    ] as [string, string, string[]][]);
    return { q: `Quel calcul permet de répondre ? ${it[0]}`, txt: 1, a: it[1], choices: qcm(it[1], autresValeurs(it[1], it[2])), why: `Le bon calcul est ${it[1]}.` };
  }
  if (t === 7) {
    const c = (R(22, 198) * 5) / 100, billet = c < 5 ? 5 : 10, r = arr(billet - c);
    return { q: `${p1} achète un goûter à ${nbFixe(c, 2)} CHF et paie avec ${billet === 5 ? "une pièce de 5 CHF" : "un billet de 10 CHF"}. Combien lui rend-on, en CHF ?`, txt: 1, a: r, hint: "Complète jusqu’au franc, puis jusqu’au total", why: `${nbFixe(billet, 2)} − ${nbFixe(c, 2)} = ${nbFixe(r, 2)} CHF.` };
  }
  const n2 = R(0, 4), n1 = R(0, 5), c50 = R(0, 5), c20 = R(0, 5), c10 = R(1, 5);
  const tot = arr(n2 * 2 + n1 + c50 * 0.5 + c20 * 0.2 + c10 * 0.1);
  const parts = [[n2, "pièce de 2 CHF", "pièces de 2 CHF"], [n1, "pièce de 1 CHF", "pièces de 1 CHF"], [c50, "pièce de 50 centimes", "pièces de 50 centimes"], [c20, "pièce de 20 centimes", "pièces de 20 centimes"], [c10, "pièce de 10 centimes", "pièces de 10 centimes"]].filter(([n]) => n) as [number, string, string][];
  return { q: `Dans son porte-monnaie, ${p1} a ${parts.map(([n, s, p]) => `${n} ${n > 1 ? p : s}`).join(", ")}. Combien d’argent y a-t-il en tout, en CHF ?`, txt: 1, a: tot, hint: "100 centimes = 1 CHF", why: `${parts.map(([n, s]) => `${n} × ${s.replace("pièce de ", "")}`).join(" + ")} = ${nbFixe(tot, 2)} CHF (${Math.round(tot * 100)} centimes).` };
}
