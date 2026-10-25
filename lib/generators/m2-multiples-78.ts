import { R, pick } from "../math";
import { diviseurs, nb, qcm } from "./m2-outils";
import type { Question } from "./types";

const somme = (x: number): number => String(x).split("").reduce((s, c) => s + +c, 0);

/** Multiples et diviseurs, critères de divisibilité (2, 3, 5, 9, 10, 100), suites numériques et leur loi (7e-8e). */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const n = pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 60, 64, 72, 80, 90, 96, 100]);
    const d = diviseurs(n);
    return { q: `Combien de diviseurs a ${n} (1 et ${n} compris) ?`, txt: 1, a: d.length, hint: "Cherche-les par paires : 1 × " + n, why: `Les diviseurs de ${n} sont ${d.join(", ")} : il y en a ${d.length}.` };
  }
  if (t === 1) {
    const n = pick([24, 30, 36, 40, 42, 48, 54, 56, 60, 63, 72, 84, 90]);
    const d = diviseurs(n), non = Array.from({ length: n - 2 }, (_, i) => i + 2).filter((x) => n % x !== 0 && x < n / 2);
    const a = String(pick(non));
    return { q: `Lequel de ces nombres n’est <b>pas</b> un diviseur de ${n} ?`, txt: 1, a, choices: qcm(a, d.filter((x) => x > 1 && x < n).map(String)), why: `${n} : ${a} ne tombe pas juste (reste ${n % +a}). Les diviseurs de ${n} sont ${d.join(", ")}.` };
  }
  if (t === 2) {
    const k = pick([3, 9]);
    let ok: number;
    do ok = R(100, 9999); while (ok % k !== 0);
    const faux: number[] = [];
    while (faux.length < 3) { const x = ok + R(1, 20); if (x % k !== 0 && !faux.includes(x)) faux.push(x); }
    return { q: `Lequel de ces nombres est divisible par ${k} ?`, txt: 1, a: nb(ok), choices: qcm(nb(ok), faux.map(nb)), hint: "Additionne les chiffres", why: `La somme des chiffres de ${nb(ok)} est ${somme(ok)}, qui est divisible par ${k} ; donc ${nb(ok)} est divisible par ${k}.` };
  }
  if (t === 3) {
    const n = R(100, 9999), k = pick([2, 3, 5, 9, 10]);
    const oui = n % k === 0;
    const crit: Record<number, string> = { 2: "il faut un chiffre des unités pair", 3: `la somme des chiffres (${somme(n)}) doit être divisible par 3`, 5: "il faut finir par 0 ou 5", 9: `la somme des chiffres (${somme(n)}) doit être divisible par 9`, 10: "il faut finir par 0" };
    return { q: `${nb(n)} est-il divisible par ${k} ?`, txt: 1, a: oui ? "oui" : "non", choices: ["oui", "non"], why: `${oui ? "Oui" : "Non"} : ${crit[k]}.` };
  }
  if (t === 4) {
    const k = R(0, 3);
    let seq: number[], nxt: number, loi: string;
    if (k === 0) { const s = R(1, 5), r = pick([2, 3]); seq = Array.from({ length: 5 }, (_, i) => s * r ** i); nxt = s * r ** 5; loi = `on multiplie par ${r}`; }
    else if (k === 1) { const s = R(1, 6); seq = Array.from({ length: 5 }, (_, i) => (s + i) ** 2); nxt = (s + 5) ** 2; loi = "ce sont les carrés de nombres qui se suivent"; }
    else if (k === 2) { const s = R(1, 20), r = R(2, 5); seq = [s]; for (let i = 1; i < 5; i++) seq.push(seq[i - 1] + r + i - 1); nxt = seq[4] + r + 4; loi = `l’écart augmente de 1 à chaque fois (+${r}, +${r + 1}, …)`; }
    else { const s = R(10, 300) * 2 ** 5, r = 2; seq = Array.from({ length: 5 }, (_, i) => s / r ** i); nxt = s / r ** 5; loi = "on divise par 2"; }
    return { q: `Quel nombre vient ensuite ? <b>${seq.map(nb).join(" ; ")} ; …</b>`, txt: 1, a: nxt, hint: "Cherche la loi de formation", why: `Loi : ${loi}. Le suivant est ${nb(nxt)}.` };
  }
  if (t === 5) {
    const r = pick([2, 3, 5]), s = R(1, 4), seq = Array.from({ length: 4 }, (_, i) => s * r ** i);
    const a = `on multiplie par ${r}`;
    return { q: `Quelle est la loi de la suite <b>${seq.join(" ; ")} ; …</b> ?`, txt: 1, a, choices: qcm(a, [`on ajoute ${seq[1] - seq[0]}`, `on multiplie par ${r + 1}`, `on ajoute ${r}`]), why: `${seq[0]} × ${r} = ${seq[1]}, ${seq[1]} × ${r} = ${seq[2]}… L’écart n’est pas constant : on multiplie par ${r}.` };
  }
  const a = R(2, 9);
  let b: number;
  do b = R(2, 9); while (b === a);
  let m = Math.max(a, b);
  while (m % a || m % b) m++;
  return { q: `Quel est le plus petit nombre non nul qui est à la fois un multiple de ${a} et de ${b} ?`, txt: 1, a: m, hint: `Écris les multiples de ${Math.max(a, b)} et cherche le premier qui est aussi dans la table de ${Math.min(a, b)}`, why: `Multiples de ${Math.max(a, b)} : ${Array.from({ length: m / Math.max(a, b) }, (_, i) => (i + 1) * Math.max(a, b)).join(", ")}… ; ${m} est le premier divisible par ${Math.min(a, b)}.` };
}
