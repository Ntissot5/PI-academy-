import { R, pick } from "../math";
import type { Question } from "./types";
import { OBJETS, melange, qcm, tas, tirer } from "./m1-outils";

const signe = (a: number, b: number) => (a < b ? "<" : a > b ? ">" : "=");

/** Comparer, ranger, encadrer et intercaler des nombres jusqu'à 200 ; comparer des collections : PER MSN 12, 3e-4e. */
export function gen(): Question {
  const t = R(0, 7), e = pick(OBJETS);
  if (t === 0) {
    let a: number, b: number;
    const s = R(0, 9);
    if (s === 0) { a = R(10, 200); b = a; }
    else if (s <= 3) { const d = R(1, 9), u = R(1, 9); a = 10 * d + u; b = 10 * u + d; if (a === b) b = a + 9; }
    else if (s <= 5) { const d = R(1, 19); a = 10 * d + R(0, 9); b = 10 * d + R(0, 9); }
    else { a = R(0, 200); b = R(0, 200); }
    const sg = signe(a, b);
    return { q: `${a} <b>?</b> ${b}`, a: sg, choices: ["<", "=", ">"], hint: "La pointe du signe montre le plus petit.", why: sg === "=" ? `Les deux nombres sont pareils : ${a} = ${b}.` : `${Math.min(a, b)} est plus petit que ${Math.max(a, b)}, donc ${a} ${sg} ${b}.` };
  }
  if (t === 1) {
    const d = R(1, 9);
    let u = R(1, 9);
    if (u === d) u = d === 9 ? 1 : d + 1;
    const ns = melange([10 * d + u, 10 * u + d, 100 + 10 * d + u, R(0, 9) + 10 * R(1, 9)].filter((x, i, arr) => arr.indexOf(x) === i)).slice(0, 3);
    const grand = Math.random() < 0.5, a = grand ? Math.max(...ns) : Math.min(...ns);
    return { q: `Quel est le plus <b>${grand ? "grand" : "petit"}</b> nombre ?`, txt: 1, a: String(a), choices: ns.map(String), why: `On compare d’abord le nombre de chiffres, puis les centaines, les dizaines, les unités : ${a} est le plus ${grand ? "grand" : "petit"}.` };
  }
  if (t === 2) {
    const ns = tirer([R(5, 9), R(10, 49), R(50, 99), R(100, 200)], 3);
    if (new Set(ns).size < 3) return gen();
    const croissant = [...ns].sort((x, y) => x - y), lex = [...ns].sort((x, y) => String(x).localeCompare(String(y)));
    const f = (l: number[]) => l.join(" – ");
    const a = f(croissant);
    return { q: `Range du plus petit au plus grand : ${ns.join(" ; ")}`, txt: 1, a, choices: qcm(a, [f(lex), f([...croissant].reverse()), f([croissant[1], croissant[0], croissant[2]])]), why: `Moins un nombre a de chiffres, plus il est petit ; avec autant de chiffres, on compare le premier chiffre : ${a}.` };
  }
  if (t === 3) {
    const d = R(1, 19), n = 10 * d + R(1, 9);
    const a = `${10 * d} et ${10 * d + 10}`;
    return { q: `Entre quelles dizaines se trouve <b>${n}</b> ?`, txt: 1, a, choices: qcm(a, [`${10 * d - 10} et ${10 * d}`, `${10 * d + 10} et ${10 * d + 20}`]), why: `${n} a ${d} dizaine${d > 1 ? "s" : ""} : il est après ${10 * d} et avant ${10 * d + 10}.` };
  }
  if (t === 4) {
    const a = R(0, 197);
    return { q: `Quel nombre est entre <b>${a}</b> et <b>${a + 2}</b> ?`, txt: 1, a: a + 1, why: `${a}, ${a + 1}, ${a + 2} : le nombre du milieu est ${a + 1}.` };
  }
  if (t === 5) {
    const x = R(8, 16), y = Math.random() < 0.15 ? x : R(8, 16);
    const a = x > y ? "A" : x < y ? "B" : "Autant";
    return { q: `Compte : où y a-t-il le plus de ${e} ?  A : ${tas(e, x)}  B : ${tas(e, y)}`, txt: 1, a, choices: ["A", "B", "Autant"], hint: "Les objets sont groupés par 5.", why: `A : ${x} ${e}, B : ${y} ${e}. ${a === "Autant" ? "C’est pareil." : `${a} en a plus.`}` };
  }
  if (t === 6) {
    const p = R(4, 7), g = R(3 * p, 25), aGauche = Math.random() < 0.5;
    const [x, y] = aGauche ? [g, p] : [p, g];
    return { q: `Sans compter : où y a-t-il le plus de ${e} ?  A : ${tas(e, x)}  B : ${tas(e, y)}`, txt: 1, a: aGauche ? "A" : "B", choices: ["A", "B"], why: `Un coup d’œil suffit : il y en a ${g} d’un côté et seulement ${p} de l’autre.` };
  }
  const n = R(10, 20), m = R(5, n - 1);
  return { q: `Il y a ${n} enfants. Chaque enfant doit avoir une 🥄. Combien de 🥄 manque-t-il ?  ${tas("🥄", m)}`, txt: 1, a: n - m, why: `On compte les 🥄 : ${m}. Pour ${n} enfants, il en manque ${n} − ${m} = ${n - m}.` };
}
