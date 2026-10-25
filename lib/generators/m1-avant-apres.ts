import { R, pick } from "../math";
import type { Question } from "./types";
import { OBJETS, qcmNombre, tas } from "./m1-outils";

/** Suite des nombres jusqu'à 30 (avant, après, nombre qui manque) et collection qui augmente ou diminue : PER MSN 12, 1re-2e. */
export function gen(): Question {
  const t = R(0, 6), e = pick(OBJETS);
  if (t === 0) {
    const n = R(1, 29);
    return { q: `Quel nombre vient juste <b>après</b> ${n} ?`, txt: 1, ...qcmNombre(n + 1, [n - 1, n + 2], 0, 30), why: `On compte : ${n}, ${n + 1}. Juste après ${n}, c’est ${n + 1}.` };
  }
  if (t === 1) {
    const n = R(2, 30);
    return { q: `Quel nombre vient juste <b>avant</b> ${n} ?`, txt: 1, ...qcmNombre(n - 1, [n + 1, n - 2], 0, 31), why: `On compte : ${n - 1}, ${n}. Juste avant ${n}, c’est ${n - 1}.` };
  }
  if (t === 2) {
    const s = R(1, 27), trou = R(1, 3), suite = [s, s + 1, s + 2, s + 3];
    const a = suite[trou];
    const q = suite.map((x, i) => (i === trou ? "<b>?</b>" : String(x))).join(", ");
    return { q: `Quel nombre manque ?  ${q}`, txt: 1, ...qcmNombre(a, [a + 1, a - 1], 0, 31), why: `On compte de 1 en 1 : ${suite.join(", ")}.` };
  }
  if (t === 3) {
    const s = R(4, 20);
    return { q: `On compte à rebours : ${s}, ${s - 1}, ${s - 2}, <b>?</b>`, txt: 1, ...qcmNombre(s - 3, [s - 2 + 1, s - 4], 0, 21), why: `À rebours, on enlève 1 à chaque fois : ${s}, ${s - 1}, ${s - 2}, ${s - 3}.` };
  }
  if (t === 4) {
    const n = R(1, 9), k = R(1, 2), m = n + k;
    return { q: `${tas(e, n)}  ➕ ${tas(e, k)}  Combien maintenant ?`, txt: 1, ...qcmNombre(m, [n, m + 1], 1, 12), why: `Il y en avait ${n}. On en ajoute ${k} : ${n}… ${Array.from({ length: k }, (_, i) => n + i + 1).join(", ")}. Il y en a ${m}.` };
  }
  if (t === 5) {
    const n = R(3, 10), k = R(1, 2), m = n - k;
    return { q: `${tas(e, n)}  On enlève ${k} ${e}. Combien en reste-t-il ?`, txt: 1, ...qcmNombre(m, [n, m + 1, m - 1], 0, 12), why: `${n} ${e}, on en enlève ${k} : il en reste ${m}.` };
  }
  const age = R(4, 8), k = R(1, 2);
  return { q: `Tu as ${age} ans. Quel âge auras-tu dans ${k} an${k > 1 ? "s" : ""} ?`, txt: 1, ...qcmNombre(age + k, [age, age + k + 1], 1, 12), why: `Chaque année, on a 1 an de plus : ${age} + ${k} = ${age + k} ans.` };
}
