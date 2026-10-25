import { R, pick } from "../math";
import { PRENOMS, VILLES, arr, nb, nbFixe, qcm } from "./m2-outils";
import type { Question } from "./types";

/** Problèmes (7e-8e) : plusieurs étapes, division et reste, transformations successives, proportionnalité, tableaux et graphiques. */
export function gen(): Question {
  const t = R(0, 8);
  const p = pick(PRENOMS);
  if (t === 0) {
    const g = R(5, 30);
    let l: number;
    do l = R(5, 30); while (l === g);
    const net = g - l, a = `${net > 0 ? "gagné" : "perdu"} ${Math.abs(net)} points`;
    return { q: `À un jeu, ${p} gagne ${g} points à la première partie, puis en perd ${l} à la deuxième. Quel est le bilan des deux parties ?`, txt: 1, a, choices: qcm(a, [`${net > 0 ? "perdu" : "gagné"} ${Math.abs(net)} points`, `gagné ${g + l} points`, `perdu ${g + l} points`]), hint: "On compose les deux transformations", why: `+${g} et −${l} : ${g > l ? `${g} − ${l} = ${net}, c’est un gain` : `${l} − ${g} = ${-net}, c’est une perte`}.` };
  }
  if (t === 1) {
    const cap = pick([40, 50, 60]);
    let el: number;
    do el = R(cap * 2 + 1, cap * 6); while (el % cap === 0);
    return { q: `${el} élèves partent en course d’école. Un car transporte ${cap} élèves. Combien de cars faut-il au minimum ?`, txt: 1, a: Math.ceil(el / cap), hint: "Que fais-tu des élèves qui restent ?", why: `${el} : ${cap} = ${Math.floor(el / cap)} reste ${el % cap} ; il faut un car de plus pour les ${el % cap} derniers : ${Math.ceil(el / cap)} cars.` };
  }
  if (t === 2) {
    const n1 = R(2, 5), p1 = R(12, 60) * 10, n2 = R(2, 4), p2 = R(5, 30) * 10;
    const tot = n1 * p1 + n2 * p2, billet = tot <= 2000 ? 20 : tot <= 5000 ? 50 : 100, r = billet * 100 - tot;
    return { q: `Tu achètes ${n1} classeurs à ${nbFixe(p1 / 100, 2)} CHF et ${n2} stylos à ${nbFixe(p2 / 100, 2)} CHF. Tu paies avec un billet de ${billet} CHF. Combien te rend-on, en CHF ?`, txt: 1, a: arr(r / 100), hint: "Calcule d’abord le prix total", why: `${n1} × ${nbFixe(p1 / 100, 2)} + ${n2} × ${nbFixe(p2 / 100, 2)} = ${nbFixe(tot / 100, 2)} CHF ; ${billet} − ${nbFixe(tot / 100, 2)} = ${nbFixe(r / 100, 2)} CHF.` };
  }
  if (t === 3) {
    const n = R(12, 25), pr = R(8, 30), tot = n * pr;
    return { q: `La sortie au musée coûte ${tot} CHF pour une classe de ${n} élèves. Chaque élève paie la même somme. Combien paie chaque élève, en CHF ?`, txt: 1, a: pr, why: `${tot} : ${n} = ${pr} CHF.` };
  }
  if (t === 4) {
    const u = pick([1.5, 2.5, 3, 3.5, 4, 4.5, 6, 7.5]), a = pick([2, 4]), b = R(3, 12);
    const obj = pick([["kg de pommes", "1 kg"], ["litres de jus", "1 litre"], ["mètres de tissu", "1 mètre"]]);
    return { q: `Le prix est proportionnel à la quantité : ${a} ${obj[0]} coûtent ${nb(arr(a * u))} CHF. Combien coûtent ${b} ${obj[0]}, en CHF ?`, txt: 1, a: arr(b * u), hint: "Passe par l’unité", why: `${obj[1]} coûte ${nb(arr(a * u))} : ${a} = ${nb(u)} CHF ; ${b} × ${nb(u)} = ${nb(arr(b * u))} CHF.` };
  }
  if (t === 5) {
    const v = pick([12, 15, 18, 20, 24]), h = pick([2, 3, 4]), k = R(2, 7);
    const ville = pick(VILLES);
    return { q: `Un graphique montre la distance parcourue par une cycliste qui roule toujours à la même vitesse depuis ${ville}. La droite passe par le point (${h} h ; ${v * h} km). Quelle distance a-t-elle parcourue après ${k} h, en km ?`, txt: 1, a: v * k, hint: "Combien de km en 1 h ?", why: `En 1 h : ${v * h} : ${h} = ${v} km. En ${k} h : ${k} × ${v} = ${v * k} km.` };
  }
  if (t === 6) {
    const f = R(2, 9), x1 = R(2, 6), x2 = x1 + R(1, 5), x3 = R(7, 12);
    const k = R(0, 1);
    if (k === 0) return { q: `Ce tableau est un tableau de proportionnalité : ${x1} → ${x1 * f} ; ${x2} → ${x2 * f} ; ${x3} → ? Quel nombre manque ?`, txt: 1, a: x3 * f, hint: "Par quel nombre multiplie-t-on ?", why: `On multiplie toujours par ${f} (${x1} × ${f} = ${x1 * f}) : ${x3} × ${f} = ${x3 * f}.` };
    return { q: `Ce tableau est un tableau de proportionnalité : ${x1} → ${x1 * f} ; ? → ${x3 * f}. Quel nombre manque ?`, txt: 1, a: x3, hint: "Fais l’opération inverse", why: `On multiplie par ${f} (${x1} × ${f} = ${x1 * f}), donc ${x3 * f} : ${f} = ${x3}.` };
  }
  if (t === 7) {
    const a = R(2, 6), b = R(2, 9), c = R(1, 5);
    const it = pick([
      [`Tu achètes ${a} cahiers à ${b} CHF et ${a} gommes à ${c} CHF. Quel calcul donne le prix total ?`, `${a} × (${b} + ${c})`, [`${a} × ${b} + ${c}`, `(${a} + ${b}) × ${c}`, `${a} + ${b} × ${c}`], `Chaque paire cahier + gomme coûte ${b} + ${c} CHF, et il y en a ${a} : ${a} × (${b} + ${c}) = ${a * (b + c)} CHF.`],
      [`Tu as ${a * 10} CHF. Tu achètes un livre à ${b} CHF et un jeu à ${c + 10} CHF. Quel calcul donne ce qu’il te reste ?`, `${a * 10} − (${b} + ${c + 10})`, [`${a * 10} − ${b} + ${c + 10}`, `(${a * 10} − ${b}) + ${c + 10}`, `${a * 10} + ${b} − ${c + 10}`], `On enlève la dépense totale : ${a * 10} − (${b} + ${c + 10}).`],
      [`${a * b} bonbons sont partagés entre ${a} enfants, puis chaque enfant en mange ${Math.min(c, b)}. Quel calcul donne ce qui reste à chaque enfant ?`, `${a * b} : ${a} − ${Math.min(c, b)}`, [`${a * b} : (${a} − ${Math.min(c, b)})`, `${a * b} − ${a} : ${Math.min(c, b)}`, `(${a * b} − ${a}) : ${Math.min(c, b)}`], `D’abord le partage ${a * b} : ${a} = ${b}, puis ${b} − ${Math.min(c, b)} = ${b - Math.min(c, b)} (la division se fait avant la soustraction).`],
    ] as [string, string, string[], string][]);
    return { q: it[0], txt: 1, a: it[1], choices: qcm(it[1], it[2]), why: it[3] };
  }
  const v = Array.from({ length: 4 }, () => R(3, 12) * 10), mois = ["mars", "avril", "mai", "juin"];
  const k = R(0, 1), tab = mois.map((m, i) => `${m} : ${v[i]} mm`).join(" · ");
  if (k === 0) { const s = v.reduce((x, y) => x + y, 0); return { q: `Pluie tombée à ${pick(VILLES)} (données inventées) — ${tab}. Combien de mm en tout pendant ces 4 mois ?`, txt: 1, a: s, why: `${v.join(" + ")} = ${s} mm.` }; }
  const i = R(0, 2), j = R(i + 1, 3);
  return { q: `Pluie tombée à ${pick(VILLES)} (données inventées) — ${tab}. Quelle est la différence entre ${mois[i]} et ${mois[j]}, en mm ?`, txt: 1, a: Math.abs(v[i] - v[j]), why: `${Math.max(v[i], v[j])} − ${Math.min(v[i], v[j])} = ${Math.abs(v[i] - v[j])} mm.` };
}
