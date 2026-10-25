import { R, pick } from "../math";
import { Rsans8, enLettres, nb, qcm, romain, sansHuitante } from "./m2-outils";
import type { Question } from "./types";

const RANGS = ["unités", "dizaines", "centaines", "milliers"];
const VAL = [1, 10, 100, 1000];

/** Variantes d'un nombre : chiffres échangés, un zéro de plus ou de moins (erreurs fréquentes). */
function variantes(n: number): number[] {
  const s = String(n), v = new Set<number>();
  for (let i = 0; i < s.length - 1; i++) {
    const t = s.split("");
    [t[i], t[i + 1]] = [t[i + 1], t[i]];
    if (t[0] !== "0") v.add(+t.join(""));
  }
  v.add(+s.replace("0", "")); v.add(n * 10); v.add(Math.floor(n / 10));
  v.delete(n); v.delete(0);
  return [...v];
}

/** Numération jusqu'à 10 000 (5e-6e) : lettres ↔ chiffres, décomposition, rangs, comparer, encadrer, bande numérique, chiffres romains. */
export function gen(): Question {
  const t = R(0, 10);
  if (t === 0) {
    const n = Rsans8(1001, 9999);
    return { q: `Écris en chiffres : <b>${enLettres(n)}</b>.`, txt: 1, a: n, why: `${enLettres(n)} = ${nb(n)}.` };
  }
  if (t === 1) {
    let n: number;
    do n = Rsans8(1001, 9999); while (variantes(n).filter(sansHuitante).length < 3);
    const a = enLettres(n);
    return { q: `Comment s’écrit <b>${nb(n)}</b> en lettres ?`, txt: 1, a, choices: qcm(a, variantes(n).filter((x) => sansHuitante(x) && x < 100000).map(enLettres)), why: `${nb(n)} : ${a}.` };
  }
  if (t === 2) {
    const ch = [R(1, 9), R(0, 9), R(0, 9), R(0, 9)];
    const n = ch[0] * 1000 + ch[1] * 100 + ch[2] * 10 + ch[3];
    const parts = [3, 2, 1, 0].filter((i) => ch[3 - i] > 0).map((i) => `${ch[3 - i]} ${ch[3 - i] === 1 ? RANGS[i].replace(/s$/, "") : RANGS[i]}`);
    const melange = Math.random() < 0.4 ? [...parts].reverse() : parts;
    return { q: `Quel nombre est formé de <b>${melange.join(" + ")}</b> ?`, txt: 1, a: n, hint: "Place chaque chiffre à son rang ; un rang vide = 0", why: `${melange.join(" + ")} = ${nb(n)}${ch.includes(0) ? " (0 dans les rangs absents)" : ""}.` };
  }
  if (t === 3) {
    const d = R(12, 99), u = R(0, 9), c = R(1, 9);
    const k = R(0, 1);
    if (k === 0) return { q: `Quel nombre est formé de <b>${d} dizaines et ${u} unités</b> ?`, txt: 1, a: d * 10 + u, why: `${d} dizaines = ${d * 10}, plus ${u} : ${d * 10 + u}.` };
    return { q: `Quel nombre est formé de <b>${d} centaines et ${c} dizaines</b> ?`, txt: 1, a: d * 100 + c * 10, why: `${d} centaines = ${nb(d * 100)}, plus ${c} dizaines = ${c * 10} : ${nb(d * 100 + c * 10)}.` };
  }
  if (t === 4) {
    const n = R(1000, 9999), i = R(0, 3), dig = Math.floor(n / VAL[i]) % 10;
    return { q: `Dans <b>${nb(n)}</b>, quel est le chiffre des <b>${RANGS[i]}</b> ?`, txt: 1, a: dig, hint: "Unités, dizaines, centaines, milliers : de droite à gauche", why: `${nb(n)} : ${Math.floor(n / 1000)} milliers, ${Math.floor(n / 100) % 10} centaines, ${Math.floor(n / 10) % 10} dizaines, ${n % 10} unités. Chiffre des ${RANGS[i]} : ${dig}.` };
  }
  if (t === 5) {
    const n = R(1000, 9999), i = R(1, 3), v = Math.floor(n / VAL[i]);
    return { q: `Combien y a-t-il de <b>${RANGS[i]}</b> en tout dans ${nb(n)} ?`, txt: 1, a: v, hint: `Pas seulement le chiffre des ${RANGS[i]}`, why: `On enlève les chiffres à droite du rang des ${RANGS[i]} : ${nb(n)} contient ${v} ${RANGS[i]} entières (le chiffre des ${RANGS[i]} seul serait ${v % 10}).` };
  }
  if (t === 6) {
    const a = R(1000, 9999);
    const b = pick([variantes(a).find((x) => x >= 1000 && x <= 9999) ?? a + R(1, 9) * 10, a + R(-9, 9) * pick([1, 10, 100]), a]);
    const r = a < b ? "<" : a > b ? ">" : "=";
    return { q: `Complète par <, > ou = : <b>${nb(a)} … ${nb(b)}</b>`, txt: 1, a: r, choices: ["<", ">", "="], why: a === b ? "Les deux nombres sont égaux." : `On compare chiffre par chiffre depuis la gauche : ${nb(Math.min(a, b))} < ${nb(Math.max(a, b))}.` };
  }
  if (t === 7) {
    let n: number[];
    do { const base = R(1000, 9999); n = [base, ...variantes(base).filter((x) => x >= 1000 && x <= 9999)].slice(0, 4); } while (n.length < 4);
    const grand = Math.random() < 0.5, a = grand ? Math.max(...n) : Math.min(...n);
    return { q: `Quel est le plus ${grand ? "grand" : "petit"} de ces nombres ?`, txt: 1, a: nb(a), choices: qcm(nb(a), n.map(nb)), why: `On compare d’abord les milliers, puis les centaines, les dizaines et les unités : le plus ${grand ? "grand" : "petit"} est ${nb(a)}.` };
  }
  if (t === 8) {
    const n = R(1001, 9899), i = R(1, 3), k = R(0, 1);
    if (n % VAL[i] === 0) return { q: `Quel nombre vient juste après ${nb(n)} ?`, txt: 1, a: n + 1, why: `${nb(n)} + 1 = ${nb(n + 1)}.` };
    const bas = Math.floor(n / VAL[i]) * VAL[i], r = k ? bas + VAL[i] : bas; 
    return { q: `Quel est ${i === 3 ? "le millier" : i === 2 ? "la centaine" : "la dizaine"} juste ${k ? "après" : "avant"} ${nb(n)} ?`, txt: 1, a: r, hint: `Un nombre « rond » : ${nb(VAL[i])}, ${nb(2 * VAL[i])}, …`, why: `${nb(bas)} < ${nb(n)} < ${nb(bas + VAL[i])} : la réponse est ${nb(r)}.` };
  }
  if (t === 9) {
    const i = R(0, 3), plus = Math.random() < 0.5;
    const n = R(1100, 8900), r = plus ? n + VAL[i] : n - VAL[i];
    const nom = ["une unité", "une dizaine", "une centaine", "un millier"][i];
    if (Math.random() < 0.5) {
      const pas = pick([10, 100, 1000]), d = Math.floor(R(1000, 4000) / pas) * pas, k = R(3, 6);
      return { q: `Sur une bande numérique, les traits vont de ${nb(pas)} en ${nb(pas)} : ${nb(d)}, ${nb(d + pas)}, ${nb(d + 2 * pas)}, … Quel nombre est au trait n° ${k + 1} (en comptant ${nb(d)} comme n° 1) ?`, txt: 1, a: d + k * pas, why: `Du trait 1 au trait ${k + 1}, on avance de ${k} pas de ${nb(pas)} : ${nb(d)} + ${nb(k * pas)} = ${nb(d + k * pas)}.` };
    }
    return { q: `Quel nombre vaut <b>${nom} de ${plus ? "plus" : "moins"}</b> que ${nb(n)} ?`, txt: 1, a: r, hint: "Attention aux retenues", why: `${nb(n)} ${plus ? "+" : "−"} ${nb(VAL[i])} = ${nb(r)}.` };
  }
  // chiffres romains
  const n = R(1, 100), lire = Math.random() < 0.6, rm = romain(n);
  if (lire) return { q: `Les Romains écrivaient les nombres avec des lettres : I = 1, V = 5, X = 10, L = 50, C = 100. Que vaut <b>${rm}</b> ?`, txt: 1, a: n, hint: "Une lettre placée avant une plus grande se soustrait (IV = 4)", why: `${rm} = ${n}.` };
  return { q: `Écris ${n} en chiffres romains (I = 1, V = 5, X = 10, L = 50, C = 100).`, txt: 1, a: rm, keys: ["I", "V", "X", "L", "C"], hint: "On ne met jamais plus de 3 fois la même lettre de suite", why: `${n} = ${rm}.` };
}
