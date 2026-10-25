import { fr, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Sur une balançoire à bascule, un adulte et un enfant. Où l’adulte doit-il s’asseoir pour équilibrer ?", "Plus près de l’axe", ["Plus loin de l’axe", "Au même endroit que l’enfant", "Debout sur le siège"], "Le plus lourd se rapproche de l’axe (le point de rotation) pour équilibrer."],
  ["Où placer le carton dans les ciseaux pour le couper le plus facilement ?", "Au fond des lames, près de l’axe", ["Au bout des lames", "N’importe où, c’est pareil", "Sur la poignée"], "Près de l’axe, la force de la main est la plus efficace : c’est le principe du levier."],
  ["Pour casser une noix avec un casse-noix, il faut tenir les branches…", "au bout, loin de l’axe", ["tout près de l’axe", "au milieu de la noix", "avec un doigt seulement"], "Plus on appuie loin de l’axe, moins il faut de force."],
  ["Une barre posée sur un caillou sert à soulever une grosse pierre. Le caillou est…", "l’axe (le point d’appui) du levier", ["la charge", "la force", "le moteur"], "Le levier tourne autour du point d’appui."],
  ["Avec un levier, pour soulever une charge lourde avec peu de force, on appuie…", "loin du point d’appui", ["tout près du point d’appui", "sur la charge", "au milieu, toujours"], "Plus le bras de levier est long, moins il faut de force."],
  ["Quel instrument mesure la masse ?", "Une balance", ["Un thermomètre", "Un chronomètre", "Une règle"], "La masse se mesure avec une balance, en grammes ou en kilogrammes."],
  ["Sur un vélo, qu’est-ce qui transmet le mouvement du pédalier à la roue arrière ?", "La chaîne", ["Le guidon", "La selle", "Le frein"], "La chaîne relie le plateau (pédalier) au pignon de la roue arrière."],
  ["Sur un vélo, le plateau avant a 40 dents, le pignon arrière 20 dents. Un tour de pédale fait tourner la roue arrière de…", "2 tours", ["1 tour", "½ tour", "20 tours"], "40 ÷ 20 = 2 : le pignon fait 2 tours quand le plateau en fait 1."],
  ["Une roue dentée tourne dans le sens des aiguilles d’une montre. La roue engrenée à côté tourne…", "dans le sens inverse", ["dans le même sens", "elle ne tourne pas", "une fois sur deux"], "Deux roues dentées en contact tournent en sens contraires."],
  ["Le mouvement d’une roue qui tourne sur elle-même est une…", "rotation", ["translation", "oscillation", "vibration"], "Tourner autour d’un axe : c’est une rotation."],
  ["Un tiroir qui glisse tout droit fait un mouvement de…", "translation", ["rotation", "balancement", "spirale"], "Avancer en ligne droite sans tourner : c’est une translation."],
  ["Un pendule (balancier d’horloge) fait un mouvement…", "de va-et-vient", ["en ligne droite infinie", "en spirale", "sans jamais bouger"], "Le pendule oscille : il va et vient régulièrement."],
];

/** Cycle 2 · mécanique : équilibre, leviers, transmission du mouvement. */
export function gen(): Question {
  if (Math.random() < 0.35) {
    // Balançoire à bascule équilibrée : m1 × d1 = m2 × d2 (nombres simples).
    const [m1, m2, d1] = pick([[20, 40, 2], [30, 60, 2], [25, 50, 2], [20, 30, 3], [30, 45, 3], [40, 20, 1], [36, 24, 2]]);
    const d2 = (m1 * d1) / m2;
    const a = `${fr(d2)} m`;
    const faux = [`${d1} m`, `${fr(d1 * 2)} m`, `${fr(d2 + 1)} m`, `${fr(Math.max(d2 - 0.5, 0.25))} m`];
    const choices = shuffle([...new Set([a, ...faux.filter((x) => x !== a)])].slice(0, 4));
    return {
      q: `Balançoire à bascule : Zoé (${m1} kg) est assise à ${d1} m de l’axe. À quelle distance de l’axe Tom (${m2} kg) doit-il s’asseoir de l’autre côté pour équilibrer ?`, txt: 1,
      a, choices, why: `Équilibre : masse × distance doit être pareil des deux côtés. ${m1} × ${d1} = ${m1 * d1}, donc ${m1 * d1} ÷ ${m2} = ${fr(d2)} m.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
