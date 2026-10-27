import { R, pick } from "../math";
import type { Question } from "./types";
import { OBJETS, compte, qcmNombre, tas } from "./m1-outils";

/** Ajouter et enlever jusqu'à 10, en recomptant (petits problèmes EEE, ETE) : PER MSN 13, 1re-2e. */
export function gen(): Question {
  const t = R(0, 5), e = pick(OBJETS);
  // a + b = s ≤ 10
  const s = R(2, 10), a = R(1, s - 1), b = s - a;
  const choix = (x: number, y: number, r: number) => qcmNombre(r, [r + 1, r - 1, Math.max(x, y)], 0, 10);
  if (t === 0) {
    return { q: `${tas(e, a)}  et  ${tas(e, b)}  Combien en tout ?`, txt: 1, ...choix(a, b, s), why: `On recompte tout : ${compte(1, s)}. Il y a ${s} ${e}.` };
  }
  if (t === 1) {
    return { q: `${a} + ${b} = <b>?</b>`, ...choix(a, b, s), hint: "Compte sur tes doigts.", why: `${a} doigts, puis encore ${b} : on recompte tout, ${compte(1, s)}. ${a} + ${b} = ${s}.` };
  }
  if (t === 2) {
    return { q: `${tas("🎈", s)}  ${b} 🎈 s’envolent. Combien en reste-t-il ?`, txt: 1, ...choix(s, b, a), why: `Il y avait ${s} 🎈. ${b} partent : on recompte ceux qui restent, ${compte(1, a)}. Il en reste ${a}.` };
  }
  if (t === 3) {
    return { q: `Dans une main, tu as ${a} 🍪. Dans l’autre, ${b} 🍪. Combien de 🍪 en tout ?`, txt: 1, ...choix(a, b, s), why: `${a} 🍪 et ${b} 🍪 : on recompte tout, ${compte(1, s)}. Ça fait ${s} 🍪.` };
  }
  if (t === 4) {
    return { q: `Tu as ${a} 🔵. Tu en gagnes ${b}. Combien de 🔵 as-tu maintenant ?`, txt: 1, ...choix(a, b, s), why: `Tu avais ${a} 🔵 et tu en reçois ${b} de plus : ${a} + ${b} = ${s}.` };
  }
  return { q: `${s} − ${b} = <b>?</b>`, ...choix(s, b, a), hint: "Montre " + s + " doigts, baisses-en " + b + ".", why: `${s} doigts levés, on en baisse ${b} : on recompte ceux qui restent, ${compte(1, a)}. ${s} − ${b} = ${a}.` };
}
