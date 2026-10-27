import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Une balle qui roule possède de l’énergie…", "cinétique", ["potentielle de gravitation", "chimique", "nucléaire"], "L’énergie cinétique est liée au mouvement."],
  ["L’eau retenue en haut d’un barrage possède de l’énergie…", "potentielle de gravitation", ["cinétique", "électrique", "lumineuse"], "Grâce à sa hauteur, l’eau peut tomber et faire tourner des turbines."],
  ["Le bois, le gaz et les aliments contiennent de l’énergie…", "chimique", ["cinétique", "électrique", "potentielle de gravitation"], "Elle est libérée par une réaction chimique (combustion, digestion)."],
  ["Le Soleil nous envoie de l’énergie sous forme de…", "rayonnement", ["énergie cinétique", "énergie chimique", "électricité"], "La lumière et la chaleur du Soleil arrivent par rayonnement."],
  ["Lequel est une source d’énergie renouvelable ?", "La géothermie", ["L’uranium", "Le charbon", "Le gaz naturel"], "La chaleur du sous-sol se renouvelle ; l’uranium et les combustibles fossiles s’épuisent."],
  ["Lequel est une source d’énergie non renouvelable ?", "L’uranium", ["Le vent", "Le soleil", "L’eau d’une rivière"], "L’uranium est un minerai : ses réserves sont limitées."],
  ["Une centrale hydroélectrique transforme…", "l’énergie de l’eau en énergie électrique", ["l’énergie électrique en eau", "le vent en chaleur", "le charbon en lumière"], "L’eau fait tourner une turbine reliée à un alternateur."],
  ["Un panneau photovoltaïque transforme…", "le rayonnement solaire en énergie électrique", ["l’électricité en lumière", "la chaleur en vent", "le vent en électricité"], "Les cellules photovoltaïques produisent du courant à la lumière."],
  ["Une lampe à incandescence transforme l’énergie électrique en lumière et surtout en…", "chaleur", ["mouvement", "énergie chimique", "son"], "Une grande partie part en chaleur : son rendement est faible."],
  ["Pourquoi une lampe LED est-elle plus économique qu’une ampoule à incandescence ?", "Elle transforme plus d’énergie en lumière et moins en chaleur", ["Elle ne consomme rien", "Elle produit plus de chaleur", "Elle fonctionne sans électricité"], "Meilleur rendement : moins d’énergie perdue en chaleur."],
  ["Principe de conservation de l’énergie : l’énergie…", "ne se crée pas et ne disparaît pas, elle se transforme", ["se crée dans les centrales", "disparaît quand on l’utilise", "ne peut jamais être transformée"], "L’énergie « perdue » est en fait transformée, souvent en chaleur."],
  ["Un frigo transporte la chaleur de l’intérieur vers…", "l’extérieur (la grille à l’arrière chauffe)", ["l’intérieur", "le néant : il détruit la chaleur", "le congélateur des voisins"], "Le frigo consomme de l’électricité pour sortir la chaleur de l’intérieur."],
];

/** Cycle 3 · énergie : formes, sources, transformations, conservation, énergie électrique et thermique, rendement. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const P = pick([60, 100, 500, 1000, 1500, 2000, 2200]), h = pick([0.5, 1, 2, 3, 4]);
    const E = (P * h) / 1000;
    return { q: `Un appareil de ${P} W fonctionne ${fr(h)} h. Énergie consommée en kWh ?`, txt: 1, a: E, tol: tolAbs(E, 0.01, 0.005), why: `E = P × t = ${P} W × ${fr(h)} h = ${fr(P * h)} Wh = ${fr(E)} kWh.` };
  }
  if (t === 1) {
    const m = pick([0.5, 1, 1.5, 2]), dT = pick([20, 40, 60, 80]);
    const Q = 4.18 * m * dT;
    return { q: `Quelle énergie faut-il pour élever de ${dT} °C la température de ${fr(m)} kg d’eau, en kJ ? (c = 4,18 kJ/(kg·°C))`, txt: 1, a: Q, tol: tolAbs(Q, 0.01, 0.5), why: `Q = m × c × ΔT = ${fr(m)} × 4,18 × ${dT} ≈ ${fr(Q)} kJ.` };
  }
  if (t === 2) {
    const Ef = pick([100, 200, 400, 500, 1000]), r = pick([0.2, 0.25, 0.4, 0.5, 0.8, 0.9]);
    const Eu = Ef * r;
    return { q: `Un appareil reçoit ${Ef} J et fournit ${fr(Eu)} J d’énergie utile. Rendement en % ?`, txt: 1, a: r * 100, tol: 0.5, why: `Rendement = énergie utile ÷ énergie reçue = ${fr(Eu)} ÷ ${Ef} = ${fr(r)}, soit ${fr(r * 100)} %.` };
  }
  if (t === 3) {
    const k = pick([0.15, 0.2, 0.25, 0.3]), E = pick([2, 4, 5, 10, 20]);
    return { q: `Le kWh coûte ${fr(k)} CHF. Combien coûtent ${E} kWh, en CHF ?`, txt: 1, a: k * E, tol: 0.01, why: `${E} × ${fr(k)} = ${fr(k * E)} CHF.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
