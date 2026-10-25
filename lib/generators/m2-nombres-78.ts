import { R, pick } from "../math";
import { Rsans8, VILLES, sansHuitante, arr, enLettres, nb, qcm, repDec, romain } from "./m2-outils";
import type { Question } from "./types";

const DEC = ["dixièmes", "centièmes", "millièmes"];

/** Réponse numérique si ≤ 2 décimales, texte sinon (la correction arrondit à 2 décimales). */
const rep = (x: number): { a: number } | { a: string; accept: string[] } => (Math.abs(Math.round(x * 100) - x * 100) < 1e-6 ? { a: arr(x, 2) } : repDec(x));

/** Nombres (7e-8e) : décimaux (lettres, décomposition, rangs, comparer, droite graduée), fractions, relatifs, puissances, romains. */
export function gen(): Question {
  const t = R(0, 11);
  if (t === 0) {
    let e: number;
    do e = Rsans8(1, 99); while (e % 10 === 1 && e !== 1);
    const k = R(0, 2), d = k === 0 ? R(1, 9) : k === 1 ? Rsans8(1, 99) : Rsans8(1, 999);
    const x = arr(e + d / 10 ** (k + 1), 3);
    return { q: `Écris en chiffres : <b>${e === 1 ? "une unité" : `${enLettres(e)} unités`} et ${enLettres(d)} ${d > 1 ? DEC[k] : DEC[k].replace(/s$/, "")}</b>.`, txt: 1, ...rep(x), hint: "Dixièmes : 1 chiffre après la virgule, centièmes : 2, millièmes : 3", why: `${d} ${DEC[k]} s’écrit avec ${k + 1} chiffre${k ? "s" : ""} après la virgule : ${nb(x)}.` };
  }
  if (t === 1) {
    let n: number;
    do n = R(1, 9) * 1e6 + (R(0, 9) * 100 + R(0, 9) * 10) * 1000; while (!sansHuitante(n));
    return { q: `Écris en chiffres : <b>${enLettres(n)}</b>.`, txt: 1, a: n, hint: "Un million = 1 000 000 (6 zéros)", why: `${enLettres(n)} = ${nb(n)}.` };
  }
  if (t === 2) {
    const ch = [R(0, 9), R(1, 9), R(0, 9), R(0, 9), R(0, 9)]; // dizaines, unités, dixièmes, centièmes, millièmes
    const noms = ["dizaines", "unités", "dixièmes", "centièmes", "millièmes"], val = [10, 1, 0.1, 0.01, 0.001];
    const x = arr(ch.reduce((s, c, i) => s + c * val[i], 0), 3);
    const parts = ch.map((c, i) => (c ? `${c} ${c === 1 ? noms[i].replace(/s$/, "") : noms[i]}` : "")).filter(Boolean);
    return { q: `Quel nombre est formé de <b>${parts.join(" + ")}</b> ?`, txt: 1, ...rep(x), hint: "Un rang absent = 0", why: `${parts.join(" + ")} = ${nb(x)}.` };
  }
  if (t === 3) {
    const k = R(0, 1);
    if (k === 0) {
      const i = R(0, 1), x = i === 0 ? arr(R(11, 999) / 10, 1) : arr(R(101, 9999) / 100, 2), v = Math.round(x * 10 ** (i + 1));
      return { q: `Combien y a-t-il de <b>${DEC[i]}</b> en tout dans ${nb(x)} ?`, txt: 1, a: v, hint: "Pas seulement le chiffre de ce rang", why: `1 unité = ${i === 0 ? "10 dixièmes" : "100 centièmes"}, donc ${nb(x)} = ${v} ${DEC[i]}.` };
    }
    const y = arr(R(1000, 99999) / 1000, 3), i = R(0, 2), dig = Math.round(y * 1000) % 10 ** (3 - i) / 10 ** (2 - i) | 0;
    return { q: `Dans <b>${nb(y)}</b>, quel est le chiffre des <b>${DEC[i]}</b> ?`, txt: 1, a: dig, hint: "Dixièmes, centièmes, millièmes : de gauche à droite après la virgule", why: `Après la virgule : ${DEC[0]}, puis ${DEC[1]}, puis ${DEC[2]}. Le chiffre des ${DEC[i]} de ${nb(y)} est ${dig}.` };
  }
  if (t === 4) {
    const u = R(0, 9), a = R(1, 9), b = R(1, 9);
    const cand = [u + a / 10, u + a / 10 + b / 100, u + b / 10 + a / 100, u + a / 100, u + a / 10 + b / 1000, u + b / 100 + a / 1000].map((x) => arr(x, 3));
    const n = [...new Set(cand)].slice(0, 4);
    if (n.length < 3) n.push(arr(u + 1, 3));
    const grand = Math.random() < 0.5, x = grand ? Math.max(...n) : Math.min(...n);
    return { q: `Quel est le plus ${grand ? "grand" : "petit"} de ces nombres ?`, txt: 1, a: nb(x), choices: qcm(nb(x), n.map(nb)), hint: "Compare les dixièmes, puis les centièmes…", why: `On compare rang par rang après la virgule (on peut ajouter des zéros : ${n.map((v) => v.toFixed(3).replace(".", ",")).join(" ; ")}). Le plus ${grand ? "grand" : "petit"} est ${nb(x)}.` };
  }
  if (t === 5) {
    const k = R(0, 1);
    if (k === 0) {
      const d = R(0, 12), i = R(1, 9);
      return { q: `Sur une droite graduée, l’intervalle entre ${d} et ${d + 1} est partagé en 10 parts égales. Quel nombre est au ${i}e trait après ${d} ?`, txt: 1, a: arr(d + i / 10), why: `Chaque part vaut 1 dixième : ${d} + ${i} dixièmes = ${nb(arr(d + i / 10))}.` };
    }
    const d = arr(R(10, 99) / 10, 1), i = R(1, 9);
    return { q: `Sur une droite graduée, l’intervalle entre ${nb(d)} et ${nb(arr(d + 0.1, 1))} est partagé en 10 parts égales. Quel nombre est au ${i}e trait après ${nb(d)} ?`, txt: 1, a: arr(d + i / 100), why: `Chaque part vaut 1 centième : ${nb(d)} + ${i} centièmes = ${nb(arr(d + i / 100))}.` };
  }
  if (t === 6) {
    const it = pick([
      ["dix fois plus que", 10], ["cent fois plus que", 100], ["mille fois plus que", 1000], ["dix fois moins que", 0.1], ["cent fois moins que", 0.01],
    ] as [string, number][]);
    const dec = Math.random() < 0.4;
    const n = it[1] < 1 ? R(2, 99) * 100 : dec ? arr(R(11, 99) / 10, 1) : R(2, 999);
    const v = arr(n * it[1], 2);
    return { q: `Quel nombre vaut <b>${it[0]}</b> ${nb(n)} ?`, txt: 1, a: v, why: `${nb(n)} ${it[1] < 1 ? ":" : "×"} ${it[1] < 1 ? nb(Math.round(1 / it[1])) : nb(it[1])} = ${nb(v)} : chaque chiffre ${it[1] < 1 ? "recule" : "avance"} de ${String(Math.round(it[1] < 1 ? 1 / it[1] : it[1])).length - 1} rang${(it[1] === 10 || it[1] === 0.1) ? "" : "s"}.` };
  }
  if (t === 7) {
    if (Math.random() < 0.5) {
      const den = [2, 3, 4, 5, 6, 8, 10].sort(() => Math.random() - 0.5).slice(0, 4);
      const grand = Math.random() < 0.5, a = `1/${grand ? Math.min(...den) : Math.max(...den)}`;
      return { q: `Quelle fraction est la plus ${grand ? "grande" : "petite"} ?`, txt: 1, a, choices: qcm(a, den.map((d) => `1/${d}`)), why: `Avec 1 au numérateur, plus on partage en beaucoup de parts, plus chaque part est petite : ${a} est la plus ${grand ? "grande" : "petite"}.` };
    }
    const d = R(5, 12), nums = [...new Set(Array.from({ length: 6 }, () => R(1, d - 1)))].slice(0, 4);
    if (nums.length < 2) nums.push(nums[0] === 1 ? 2 : 1);
    const grand = Math.random() < 0.5, a = `${grand ? Math.max(...nums) : Math.min(...nums)}/${d}`;
    return { q: `Quelle fraction est la plus ${grand ? "grande" : "petite"} ?`, txt: 1, a, choices: qcm(a, nums.map((n) => `${n}/${d}`)), why: `Même dénominateur (${d}) : on compare les numérateurs. ${a} est la plus ${grand ? "grande" : "petite"}.` };
  }
  if (t === 8) {
    const k = R(0, 2);
    if (k === 0) {
      const m = -R(1, 12), s = R(1, 15), v = pick(VILLES);
      return { q: `À ${v}, il fait ${nb(m)} °C le matin et ${s} °C l’après-midi. De combien de degrés la température a-t-elle monté ?`, txt: 1, a: s - m, hint: "Passe par 0", why: `De ${nb(m)} à 0 : ${-m} degrés ; de 0 à ${s} : ${s} degrés. En tout ${s - m} degrés.` };
    }
    if (k === 1) {
      const n = [...new Set(Array.from({ length: 5 }, () => R(-12, 8)))].slice(0, 4);
      if (n.length < 2) n.push(n[0] - 3);
      const a = Math.min(...n);
      return { q: `Quelle température est la plus froide ?`, txt: 1, a: `${nb(a)} °C`, choices: qcm(`${nb(a)} °C`, n.map((x) => `${nb(x)} °C`)), why: `Sous zéro, plus le nombre après le signe − est grand, plus il fait froid : ${nb(a)} °C est la plus basse.` };
    }
    const d = R(-5, 6), p = R(2, 9), g = Math.random() < 0.5;
    return { q: `Sur une droite graduée de 1 en 1, quel nombre est ${p} graduations à ${g ? "gauche" : "droite"} de ${nb(d)} ?`, txt: 1, a: g ? d - p : d + p, keys: ["−"], why: `${nb(d)} ${g ? "−" : "+"} ${p} = ${nb(g ? d - p : d + p)}${g && d - p < 0 ? " (à gauche de 0, les nombres sont négatifs)" : ""}.` };
  }
  if (t === 9) {
    const it = pick([
      ["1/2", 0.5], ["1/4", 0.25], ["3/4", 0.75], ["1/5", 0.2], ["1/10", 0.1], ["3/10", 0.3], ["7/10", 0.7], ["2/5", 0.4], ["1/100", 0.01], ["25/100", 0.25], ["5 dixièmes", 0.5], ["35 centièmes", 0.35], ["la moitié de 1", 0.5], ["le quart de 1", 0.25],
    ] as [string, number][]);
    return { q: `Écris <b>${it[0]}</b> sous forme de nombre décimal.`, txt: 1, a: it[1], hint: "Pense en dixièmes ou en centièmes", why: `${it[0]} = ${nb(it[1])} = ${Math.round(it[1] * 100)} centièmes.` };
  }
  if (t === 10) {
    const it = pick([["la moitié", 2, 1], ["le tiers", 3, 1], ["le quart", 4, 1], ["les trois quarts", 4, 3], ["le dixième", 10, 1], ["les deux tiers", 3, 2], ["le cinquième", 5, 1]] as [string, number, number][]);
    const q = it[1] * R(2, 15);
    const ctx = pick([`${q} élèves`, `${q} CHF`, `${q} km`, `${q} billes`]);
    return { q: `Combien valent <b>${it[0]}</b> de ${ctx} ?`, txt: 1, a: (q / it[1]) * it[2], hint: "Divise, puis multiplie", why: `${q} : ${it[1]} = ${q / it[1]}${it[2] > 1 ? `, puis × ${it[2]} = ${(q / it[1]) * it[2]}` : ""}.` };
  }
  // puissances ou romains
  const k = R(0, 2);
  if (k === 0) {
    const b = pick([2, 3, 5, 10]), e = b === 2 ? R(2, 6) : b === 10 ? R(2, 6) : R(2, 3);
    return { q: `Calcule <b>${b}<sup>${e}</sup></b>.`, txt: 1, a: b ** e, hint: `${b}<sup>${e}</sup> = ${Array(e).fill(b).join(" × ")}`, why: `${Array(e).fill(b).join(" × ")} = ${nb(b ** e)} (et pas ${b} × ${e} = ${b * e}).` };
  }
  if (k === 1) {
    const b = pick([2, 10]), e = R(2, 6);
    return { q: `Écris ${nb(b ** e)} comme une puissance de ${b} : ${b}<sup>?</sup>. Quel est l’exposant ?`, txt: 1, a: e, why: `${nb(b ** e)} = ${Array(e).fill(b).join(" × ")} = ${b}<sup>${e}</sup>.` };
  }
  const n = R(100, 2100), rm = romain(n);
  return { q: `En chiffres romains, I = 1, V = 5, X = 10, L = 50, C = 100, D = 500, M = 1000. Que vaut <b>${rm}</b> ?`, txt: 1, a: n, hint: "Une lettre placée avant une plus grande se soustrait (CM = 900)", why: `${rm} = ${n}.` };
}
