import { R, pick } from "../math";
import type { Question } from "./types";
import { ANIMAUX, qcm, tirer } from "./m1-outils";

const OPP: Record<string, string> = { "→": "←", "←": "→", "↑": "↓", "↓": "↑" };
const rep = (f: string, n: number) => Array.from({ length: n }, () => f).join(" ");

/** Gauche, droite, trajets codés avec des flèches, déductions de position : PER MSN 11, 3e-4e. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) {
    const rang = tirer(ANIMAUX, 5), ligne = rang.join(" ");
    if (Math.random() < 0.5) {
      const droite = Math.random() < 0.5, i = droite ? R(0, 3) : R(1, 4), a = rang[droite ? i + 1 : i - 1];
      return { q: `${ligne}  Qui est juste à <b>${droite ? "droite" : "gauche"}</b> de ${rang[i]} ?`, txt: 1, a, choices: qcm(a, [rang[droite ? i - 1 : i + 1], ...rang.filter((x) => x !== a && x !== rang[i])].filter(Boolean)), hint: "Comme tu vois la rangée.", why: `En regardant la rangée, ${a} est juste à ${droite ? "droite" : "gauche"} de ${rang[i]}.` };
    }
    const depuisGauche = Math.random() < 0.5, n = R(2, 4), a = depuisGauche ? rang[n - 1] : rang[5 - n];
    return { q: `${ligne}  Qui est le <b>${n}e</b> en partant de la <b>${depuisGauche ? "gauche" : "droite"}</b> ?`, txt: 1, a, choices: qcm(a, [depuisGauche ? rang[5 - n] : rang[n - 1], ...rang]), why: `On compte depuis le bout ${depuisGauche ? "gauche" : "droit"} : 1, 2${n > 2 ? ", 3" : ""}${n > 3 ? ", 4" : ""}… le ${n}e est ${a}.` };
  }
  if (t === 1) {
    let s: number, code: string[], fin: number;
    for (;;) {
      s = R(0, 10);
      code = Array.from({ length: R(3, 5) }, () => (Math.random() < 0.6 ? "→" : "←"));
      let p = s, ok = true;
      for (const f of code) { p += f === "→" ? 1 : -1; if (p < 0 || p > 10) ok = false; }
      fin = p;
      if (ok) break;
    }
    const d = code.filter((f) => f === "→").length, g = code.length - d;
    return { q: `Une ligne de cases numérotées de 0 à 10. Pi est sur la case <b>${s}</b>. Il suit le code <b>${code.join(" ")}</b>. Sur quelle case arrive-t-il ?`, txt: 1, a: fin, hint: "→ avance d’une case, ← recule d’une case.", why: `${d} fois → et ${g} fois ← : ${s} + ${d} − ${g} = ${fin}.` };
  }
  if (t === 2) {
    const h = pick(["→", "←"]), v = pick(["↑", "↓"]), nh = R(1, 3), nv = R(1, 2);
    const code = `${rep(h, nh)} ${rep(v, nv)}`;
    const a = `${rep(OPP[v], nv)} ${rep(OPP[h], nh)}`;
    const choices = qcm(a, [`${rep(v, nv)} ${rep(h, nh)}`, `${rep(OPP[v], nv)} ${rep(h, nh)}`, `${rep(v, nv)} ${rep(OPP[h], nh)}`], 4);
    return { q: `Sur un quadrillage, Pi suit le code <b>${code}</b>. Quel code le ramène à son point de départ ?`, txt: 1, a, choices, why: `Pour revenir, on fait chaque pas dans le sens contraire : ${h} devient ${OPP[h]} et ${v} devient ${OPP[v]}.` };
  }
  if (t === 3) {
    const [x, y, z] = tirer(ANIMAUX, 3);
    const indices = Math.random() < 0.5 ? `${x} est devant ${y}. ${z} est derrière ${y}.` : `${y} est derrière ${x}. ${y} est devant ${z}.`;
    const s = R(0, 2), mot = ["le premier", "au milieu", "le dernier"][s], a = [x, y, z][s];
    return { q: `Trois animaux font la file. ${indices} Qui est <b>${mot}</b> ?`, txt: 1, a, choices: qcm(a, [x, y, z]), why: `Dans l’ordre, du premier au dernier : ${x} ${y} ${z}. ${mot[0].toUpperCase() + mot.slice(1)} : ${a}.` };
  }
  if (Math.random() < 0.5) {
    const main = pick(["droite", "gauche"]), a = main === "droite" ? "à ta gauche" : "à ta droite";
    return { q: `Tu es face à Pi. Pi lève sa main <b>${main}</b>. De ton côté, cette main est…`, txt: 1, a, choices: ["à ta gauche", "à ta droite"], why: `Face à face, tout est inversé : la main ${main} de Pi est ${a}.` };
  }
  const cote = pick(["droite", "gauche"]), a = cote === "droite" ? "à ta gauche" : "à ta droite";
  return { q: `Pi est à ta <b>${cote}</b>. Tu fais demi-tour. Maintenant, Pi est…`, txt: 1, a, choices: ["à ta gauche", "à ta droite"], why: `Quand tu fais demi-tour, ta droite et ta gauche s’échangent : Pi est maintenant ${a}.` };
}
