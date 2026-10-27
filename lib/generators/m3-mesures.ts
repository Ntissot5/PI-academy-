import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr, duree } from "./m3-outils";

/** Problèmes de mesurage : carrelage, peinture, piscine, clôture, aire par décomposition, grandeur manquante, durées (PER MSN 34, 9e-11e). */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0) {
    const c = pick([20, 25, 50]), i = R(4, 12), j = R(4, 12), L = arr((i * c) / 100), l = arr((j * c) / 100);
    return { q: `Une pièce rectangulaire mesure ${fr(L)} m sur ${fr(l)} m. Combien de carreaux carrés de ${c} cm de côté faut-il pour couvrir le sol (sans découpe) ?`, txt: 1, a: i * j, hint: "Combien de carreaux sur la longueur ? sur la largeur ?", why: `${fr(L)} m = ${i * c} cm → ${i} carreaux ; ${fr(l)} m = ${j * c} cm → ${j} carreaux ; ${i} × ${j} = ${i * j}.` };
  }
  if (t === 1) {
    const L = R(3, 9), l = R(2, 6), p = R(20, 80);
    return { q: `Le sol d’une chambre de ${L} m sur ${l} m sera recouvert de parquet à ${p} CHF le m². Combien coûtera le parquet ?`, txt: 1, a: L * l * p, why: `Aire : ${L} × ${l} = ${L * l} m² ; ${L * l} × ${p} = ${L * l * p} CHF.` };
  }
  if (t === 2) {
    const L = R(4, 10), H = pick([2.5, 3]), fw = pick([1, 1.5, 2]), fh = pick([1, 1.5]), k = pick([4, 5, 6, 8]);
    const A = arr(L * H - fw * fh), n = Math.ceil(A / k - 1e-9);
    return { q: `Tu peins un mur de ${L} m sur ${fr(H)} m, avec une fenêtre de ${fr(fw)} m sur ${fr(fh)} m. Un pot de 1 L couvre ${k} m². Combien de pots dois-tu acheter au minimum ?`, txt: 1, a: n, hint: "Aire à peindre, puis arrondis vers le haut.", why: `Aire : ${L} × ${fr(H)} − ${fr(fw)} × ${fr(fh)} = ${fr(A)} m² ; ${fr(A)} ÷ ${k} ≈ ${fr(A / k)} → il faut ${n} pots (on arrondit vers le haut).` };
  }
  if (t === 3) {
    const L = R(5, 25), l = R(3, 12), p = pick([1.2, 1.5, 1.8, 2]), V = arr(L * l * p);
    return { q: `Une piscine en forme de pavé mesure ${L} m sur ${l} m et a une profondeur de ${fr(p)} m. Combien de litres d’eau contient-elle quand elle est pleine ?`, txt: 1, a: arr(V * 1000), hint: "1 m³ = 1000 L", why: `V = ${L} × ${l} × ${fr(p)} = ${fr(V)} m³ = ${fr(arr(V * 1000))} L.` };
  }
  if (t === 4) {
    const a = R(8, 40), b = R(5, 30), g = R(2, 4);
    return { q: `Un jardin rectangulaire de ${a} m sur ${b} m est entouré d’une clôture, sauf un portail de ${g} m. Quelle longueur de clôture faut-il en mètres ?`, txt: 1, a: 2 * (a + b) - g, why: `Périmètre : 2 × (${a} + ${b}) = ${2 * (a + b)} m ; moins le portail : ${2 * (a + b) - g} m.` };
  }
  if (t === 5) {
    const A = R(8, 20), B = R(6, 15), a = R(2, A - 3), b = R(2, B - 3);
    if (R(0, 1)) return { q: `Une terrasse en forme de L s’obtient en enlevant un rectangle de ${a} m sur ${b} m dans un coin d’un rectangle de ${A} m sur ${B} m. Quelle est son aire en m² ?`, txt: 1, a: A * B - a * b, why: `${A} × ${B} − ${a} × ${b} = ${A * B} − ${a * b} = ${A * B - a * b} m².` };
    return { q: `Une terrasse en forme de L s’obtient en enlevant un rectangle de ${a} m sur ${b} m dans un coin d’un rectangle de ${A} m sur ${B} m. Quel est son périmètre en m ?`, txt: 1, a: 2 * (A + B), hint: "Fais glisser les côtés du coin enlevé.", why: `Les deux côtés du coin enlevé remplacent exactement ceux qui manquent : le périmètre reste celui du grand rectangle, 2 × (${A} + ${B}) = ${2 * (A + B)} m.` };
  }
  if (t === 6) {
    if (R(0, 1)) { const l = R(3, 15), L = R(4, 20); return { q: `Un rectangle a une aire de ${l * L} cm² et une largeur de ${l} cm. Quelle est sa longueur ?`, txt: 1, a: L, why: `Aire = longueur × largeur, donc longueur = ${l * L} ÷ ${l} = ${L} cm.` }; }
    const b = R(3, 16), h = R(2, 15);
    return { q: `Un triangle a une aire de ${fr((b * h) / 2)} cm² et une base de ${b} cm. Quelle est la hauteur relative à cette base ?`, txt: 1, a: h, hint: "Aire = base × hauteur ÷ 2", why: `h = 2 × aire ÷ base = 2 × ${fr((b * h) / 2)} ÷ ${b} = ${h} cm.` };
  }
  if (t === 7) {
    const l = pick([20, 30, 40, 50]), L = pick([40, 50, 60, 80, 100]), h = R(10, 40), V = (l * L * h) / 1000;
    return { q: `Un aquarium a un fond de ${l} cm sur ${L} cm. On y verse ${fr(V)} L d’eau. Quelle hauteur d’eau atteint-on en cm ?`, txt: 1, a: h, hint: "1 L = 1000 cm³", why: `${fr(V)} L = ${l * L * h} cm³ ; ${l * L * h} ÷ (${l} × ${L}) = ${h} cm.` };
  }
  const d1 = R(40, 200), d2 = R(40, 200);
  if (R(0, 1)) return { q: `Un trajet comprend deux étapes : ${duree(d1)}, puis ${duree(d2)}. Combien de minutes dure-t-il en tout ?`, txt: 1, a: d1 + d2, why: `${d1} min + ${d2} min = ${d1 + d2} min (= ${duree(d1 + d2)}).` };
  const a = R(2, 12);
  return { q: `Un cube a des arêtes de ${a} cm. Quelle est l’aire totale de ses faces en cm² ?`, txt: 1, a: 6 * a * a, why: `6 faces carrées de ${a} × ${a} = ${a * a} cm² : 6 × ${a * a} = ${6 * a * a} cm².` };
}
