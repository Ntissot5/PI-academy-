import { R } from "../math";
import type { Question } from "./types";
import { melange } from "./m1-outils";

const suite = (s: number, pas: number, n: number) => Array.from({ length: n }, (_, i) => s + i * pas);

/** Compter et décompter de 1 en 1, de 10 en 10, de 2 en 2, de 5 en 5 ; pairs et impairs : PER MSN 12, 3e-4e. */
export function gen(): Question {
  const t = R(0, 5);
  if (t <= 3) {
    let pas: number, s: number;
    if (t === 0) { pas = Math.random() < 0.5 ? 1 : -1; s = pas > 0 ? R(10, 196) : R(14, 200); }
    else if (t === 1) { pas = Math.random() < 0.5 ? 10 : -10; s = pas > 0 ? R(1, 160) : R(40, 200); }
    else if (t === 2) { pas = 2; s = 2 * R(0, 16); }
    else { pas = 5; s = 5 * R(0, 15); }
    const termes = suite(s, pas, 4), trou = Math.random() < 0.3 ? R(1, 2) : 3, a = termes[trou];
    const montre = termes.map((x, i) => (i === trou ? "<b>?</b>" : String(x))).join(", ");
    const sens = pas > 0 ? `de ${pas} en ${pas}` : `à rebours de ${-pas} en ${-pas}`;
    return { q: `Continue : on compte ${sens}.  ${montre}`, txt: 1, a, why: `${termes.join(", ")} : on ${pas > 0 ? "ajoute" : "enlève"} ${Math.abs(pas)} à chaque fois.` };
  }
  if (t === 4) {
    const n = R(1, 200), u = n % 10, pair = u % 2 === 0;
    return { q: `<b>${n}</b> est-il pair ou impair ?`, txt: 1, a: pair ? "pair" : "impair", choices: ["pair", "impair"], why: `On regarde le chiffre des unités : ${u}. ${pair ? "0, 2, 4, 6, 8 → pair" : "1, 3, 5, 7, 9 → impair"}.` };
  }
  const veutPair = Math.random() < 0.5, base = R(5, 95);
  const vise = (x: number) => (x % 2 === 0) === veutPair;
  let a = base;
  while (!vise(a)) a++;
  const autres: number[] = [];
  for (let x = a + 1; autres.length < 3; x += 2) if (!vise(x)) autres.push(x + 10 * autres.length);
  return { q: `Lequel est <b>${veutPair ? "pair" : "impair"}</b> ?`, txt: 1, a: String(a), choices: melange([a, ...autres]).map(String), why: `${a} se termine par ${a % 10} : il est ${veutPair ? "pair" : "impair"}. Les autres se terminent par un chiffre ${veutPair ? "impair" : "pair"}.` };
}
