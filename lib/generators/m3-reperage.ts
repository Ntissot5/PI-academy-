import { NZ, P, R, S, pick } from "../math";
import type { Question } from "./types";
import { melange, pt } from "./m3-outils";

const QUADS = ["le 1er quadrant", "le 2e quadrant", "le 3e quadrant", "le 4e quadrant"];

/** Repérage dans le plan et dans l'espace : milieu, quadrants, itinéraires, axes, coordonnées dans un pavé (PER MSN 31, 9e-11e). */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const x1 = R(-9, 9), y1 = R(-9, 9), x2 = x1 + 2 * NZ(-5, 5), y2 = y1 + 2 * NZ(-5, 5), abs = R(0, 1) === 1;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    return { q: `A${pt(x1, y1)} et B${pt(x2, y2)}. Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} du milieu M de [AB] ?`, txt: 1, a: abs ? mx : my, hint: "La moyenne des deux coordonnées.", why: `M = ((${S(x1)} + ${P(x2)}) ÷ 2 ; (${S(y1)} + ${P(y2)}) ÷ 2) = ${pt(mx, my)}.` };
  }
  if (t === 1) {
    const x = NZ(-9, 9), y = NZ(-9, 9);
    const i = x > 0 ? (y > 0 ? 0 : 3) : y > 0 ? 1 : 2;
    return { q: `Dans quel quadrant se trouve le point ${pt(x, y)} ?`, txt: 1, a: QUADS[i], choices: [...QUADS], hint: "On numérote en tournant dans le sens inverse des aiguilles d’une montre, en partant de x > 0 et y > 0.", why: `x ${x > 0 ? "> 0" : "< 0"} et y ${y > 0 ? "> 0" : "< 0"} : ${QUADS[i]}.` };
  }
  if (t === 2) {
    let x = R(-5, 5), y = R(-5, 5);
    const x0 = x, y0 = y, pas: string[] = [];
    const n = R(2, 3);
    let dirs = melange(["droite", "gauche", "haut", "bas"]).slice(0, n);
    if (dirs.includes("droite") && dirs.includes("gauche")) dirs = dirs.filter((d) => d !== "gauche");
    for (const d of dirs) {
      const k = R(1, 6);
      pas.push(`${k} vers ${d === "droite" ? "la droite" : d === "gauche" ? "la gauche" : d === "haut" ? "le haut" : "le bas"}`);
      if (d === "droite") x += k; else if (d === "gauche") x -= k; else if (d === "haut") y += k; else y -= k;
    }
    const abs = R(0, 1) === 1;
    return { q: `Sur un quadrillage, tu pars du point ${pt(x0, y0)} et tu avances de ${pas.join(", puis ")} (en unités). Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} du point d’arrivée ?`, txt: 1, a: abs ? x : y, why: `Droite/gauche changent x, haut/bas changent y : tu arrives en ${pt(x, y)}.` };
  }
  if (t === 3) {
    const v = NZ(-9, 9), surX = R(0, 1) === 1;
    const a = surX ? "sur l’axe des abscisses (axe x)" : "sur l’axe des ordonnées (axe y)";
    return { q: `Où se trouve le point ${surX ? pt(v, 0) : pt(0, v)} ?`, txt: 1, a, choices: ["sur l’axe des abscisses (axe x)", "sur l’axe des ordonnées (axe y)", "à l’origine", "dans le 1er quadrant"], why: `${surX ? "Son ordonnée est 0" : "Son abscisse est 0"} : il est ${a}.` };
  }
  if (t === 4) {
    let a: number, b: number, c: number;
    do { a = R(2, 9); b = R(2, 9); c = R(2, 9); } while (a === b || b === c || a === c);
    if (R(0, 1)) {
      const bon = `(${a} ; ${b} ; ${c})`;
      const d = [`(${a} ; ${c} ; ${b})`, `(${b} ; ${a} ; ${c})`, `(${a} ; ${b} ; 0)`];
      return { q: `Un pavé a un sommet en O(0 ; 0 ; 0) et ses arêtes le long des axes : ${a} unités sur l’axe x, ${b} sur l’axe y, ${c} sur l’axe z. Quelles sont les coordonnées du sommet opposé à O ?`, txt: 1, a: bon, choices: melange([bon, ...d]), why: `Le sommet opposé est au bout des trois arêtes : x = ${a}, y = ${b}, z = ${c}.` };
    }
    return { q: `Un pavé a un sommet en O(0 ; 0 ; 0) et ses arêtes le long des axes : ${a} unités sur l’axe x, ${b} sur l’axe y, ${c} sur l’axe z (vertical). Quelle est la cote z du sommet situé juste au-dessus de O ?`, txt: 1, a: c, why: `Au-dessus de O, on monte le long de l’axe z de ${c} : le sommet est (0 ; 0 ; ${c}).` };
  }
  if (t === 5) {
    const y = R(-6, 6), x1 = R(-9, 3), x2 = x1 + R(2, 9);
    const [p, q] = R(0, 1) ? [x1, x2] : [x2, x1];
    return R(0, 1)
      ? { q: `Quelle est la distance entre A${pt(p, y)} et B${pt(q, y)} (en unités) ?`, txt: 1, a: x2 - x1, why: `Même ordonnée : on compare les abscisses, ${S(Math.max(p, q))} − ${P(Math.min(p, q))} = ${x2 - x1}.` }
      : { q: `Quelle est la distance entre A${pt(y, p)} et B${pt(y, q)} (en unités) ?`, txt: 1, a: x2 - x1, why: `Même abscisse : on compare les ordonnées, ${S(Math.max(p, q))} − ${P(Math.min(p, q))} = ${x2 - x1}.` };
  }
  const ax = R(-6, 6), ay = R(-6, 6), mx = ax + NZ(-4, 4), my = ay + NZ(-4, 4), abs = pick([true, false]);
  const bx = 2 * mx - ax, by = 2 * my - ay;
  return { q: `M${pt(mx, my)} est le milieu de [AB], avec A${pt(ax, ay)}. Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} de B ?`, txt: 1, a: abs ? bx : by, hint: "De A à M, puis encore autant de M à B.", why: `De A à M on avance de ${pt(mx - ax, my - ay)} ; on recommence depuis M : B${pt(bx, by)}.` };
}
