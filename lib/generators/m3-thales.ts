import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr } from "./m3-outils";

/** Théorème de Thalès et figures semblables (11e) : longueurs dans la configuration, ombres, rapports. */
export function gen(): Question {
  const t = R(0, 4);
  const k = pick([1.5, 2, 2.5, 3, 4]);
  if (t === 0) {
    const am = 2 * R(1, 6), an = 2 * R(1, 6), ab = arr(am * k), ac = arr(an * k);
    return { q: `Dans le triangle ABC, M est sur [AB] et N sur [AC], avec (MN) parallèle à (BC). AM = ${am} cm, AB = ${fr(ab)} cm et AN = ${an} cm. Combien mesure AC ?`, txt: 1, a: ac, hint: "AM/AB = AN/AC", why: `Thalès : AC/AN = AB/AM = ${fr(ab)} ÷ ${am} = ${fr(k)} ; AC = ${an} × ${fr(k)} = ${fr(ac)} cm.` };
  }
  if (t === 1) {
    const am = 2 * R(1, 6), mn = 2 * R(1, 8), ab = arr(am * k), bc = arr(mn * k);
    return { q: `Dans le triangle ABC, M est sur [AB] et N sur [AC], avec (MN) parallèle à (BC). AM = ${am} cm, AB = ${fr(ab)} cm et BC = ${fr(bc)} cm. Combien mesure MN ?`, txt: 1, a: mn, hint: "AM/AB = MN/BC", why: `Rapport AM/AB = ${am} ÷ ${fr(ab)} ; MN = ${fr(bc)} × ${am} ÷ ${fr(ab)} = ${mn} cm.` };
  }
  if (t === 2) {
    const x = R(2, 6), z = x * R(1, 4), y = R(2, 9), nc = (z * y) / x;
    return { q: `Dans le triangle ABC, (MN) est parallèle à (BC), avec M sur [AB] et N sur [AC]. AM = ${x} cm, MB = ${y} cm et AN = ${z} cm. Combien mesure NC ?`, txt: 1, a: nc, hint: "Les parallèles coupent les côtés dans le même rapport : AM/MB = AN/NC.", why: `NC = AN × MB ÷ AM = ${z} × ${y} ÷ ${x} = ${fr(nc)} cm.` };
  }
  if (t === 3) {
    const h = pick([1, 1.5, 2]), s = pick([0.5, 0.8, 1.2, 1.5, 2]), m = R(3, 12), S = arr(s * m), H = arr(h * m);
    return { q: `Au même moment, un bâton vertical de ${fr(h)} m a une ombre de ${fr(s)} m, et un arbre a une ombre de ${fr(S)} m. Quelle est la hauteur de l’arbre en m ?`, txt: 1, a: H, hint: "Les rayons du soleil sont parallèles.", why: `Les deux triangles sont semblables : l’ombre de l’arbre est ${fr(S)} ÷ ${fr(s)} = ${m} fois plus longue, donc l’arbre mesure ${fr(h)} × ${m} = ${fr(H)} m.` };
  }
  const a = 2 * R(2, 8), A = R(3, 20);
  if (R(0, 1)) return { q: `Deux triangles sont semblables. Le petit a un côté de ${a} cm, et le côté correspondant du grand mesure ${fr(arr(a * k))} cm. Quel est le rapport de similitude (grand ÷ petit) ?`, txt: 1, a: k, why: `${fr(arr(a * k))} ÷ ${a} = ${fr(k)}.` };
  return { q: `Deux figures sont semblables ; les longueurs de la grande sont ${fr(k)} fois celles de la petite. La petite a une aire de ${A} cm². Quelle est l’aire de la grande ?`, txt: 1, a: arr(A * k * k), why: `Les aires sont multipliées par ${fr(k)}² = ${fr(k * k)} : ${A} × ${fr(k * k)} = ${fr(arr(A * k * k))} cm².` };
}
