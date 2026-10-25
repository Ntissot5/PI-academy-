import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Outils de mesure : [ce qu'on veut savoir, outil, explication]
const OUTILS: [string, string, string][] = [
  ["combien il fait chaud dehors", "un thermomètre", "Le thermomètre mesure la température."],
  ["combien de temps dure une course", "un chronomètre", "Le chronomètre mesure une durée."],
  ["la longueur de ta table", "une règle ou un mètre", "La règle et le mètre mesurent des longueurs."],
  ["combien pèse une pomme", "une balance", "La balance mesure la masse (le « poids »)."],
  ["combien d’eau contient une bouteille", "un verre gradué (verre mesureur)", "Le verre gradué mesure une quantité de liquide."],
  ["quel jour aura lieu ton anniversaire", "un calendrier", "Le calendrier montre les jours, les semaines et les mois."],
  ["quelle heure il est", "une horloge", "L’horloge (ou la montre) indique l’heure."],
];
const TOUS = [...new Set(OUTILS.map((o) => o[1]))];

// Constat (ce qu'on voit) ou explication (ce qu'on pense) : [phrase, réponse, explication]
const CONSTATS: [string, string, string][] = [
  ["« La règle flotte sur l’eau. »", "Je l’ai vu (constat)", "On l’a vu pendant l’expérience : c’est un constat."],
  ["« La règle flotte parce qu’elle est en bois. »", "C’est une explication (je le pense)", "C’est une idée pour expliquer ce qu’on a vu : on peut la vérifier avec d’autres objets."],
  ["« La glace a fondu sur le radiateur. »", "Je l’ai vu (constat)", "On l’a observé : c’est un constat."],
  ["« La glace a fondu parce qu’il faisait chaud. »", "C’est une explication (je le pense)", "C’est une explication de ce qu’on a vu."],
  ["« La plante sans eau est devenue toute molle. »", "Je l’ai vu (constat)", "C’est ce qu’on a observé : un constat."],
  ["« La plante est molle parce qu’elle n’a pas eu d’eau. »", "C’est une explication (je le pense)", "C’est une explication : on peut la vérifier en arrosant une autre plante."],
  ["« Le caillou est tombé au fond de l’eau. »", "Je l’ai vu (constat)", "On l’a vu : c’est un constat."],
  ["« Pourquoi la règle flotte-t-elle ? »", "C’est une question", "On se demande quelque chose : c’est une question de recherche."],
  ["« Est-ce que la glace fond plus vite au soleil ? »", "C’est une question", "C’est une question : une expérience peut y répondre."],
];

/** Cycle 1 · démarche scientifique : choisir un outil de mesure, comparer des mesures, constat ou explication. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [quoi, outil, why] = pick(OUTILS);
    const faux = shuffle(TOUS.filter((x) => x !== outil)).slice(0, 2);
    return { q: `Pour savoir ${quoi}, quel outil prends-tu ?`, txt: 1, a: outil, choices: shuffle([outil, ...faux]), why };
  }
  if (t === 1) {
    const [phrase, a, why] = pick(CONSTATS);
    return { q: `${phrase} Qu’est-ce que c’est ?`, txt: 1, a, choices: shuffle(["Je l’ai vu (constat)", "C’est une explication (je le pense)", "C’est une question"]), why };
  }
  if (t === 2) {
    // Mesure avec une unité non standard : des crayons tous pareils, des pas…
    const unite = pick(["crayons", "mains", "bâtonnets"]);
    const [o1, o2] = shuffle(["la table", "le tapis", "le banc", "l’étagère"]).slice(0, 2);
    const x = R(3, 9);
    let y = R(3, 9);
    while (y === x) y = R(3, 9);
    const a = x > y ? o1 : o2;
    return {
      q: `Avec des ${unite} tous pareils, Léa mesure ${o1} : ${x} ${unite}. Puis ${o2} : ${y} ${unite}. Quel objet est le plus long ?`, txt: 1, a,
      choices: shuffle([o1, o2, "ils sont aussi longs"]), why: `${Math.max(x, y)} ${unite}, c’est plus que ${Math.min(x, y)} ${unite} : c’est ${a}.`,
    };
  }
  const g1 = R(2, 8);
  let g2 = R(2, 8);
  while (g2 === g1) g2 = R(2, 8);
  const a = g1 > g2 ? "La bouteille bleue" : "La bouteille verte";
  return {
    q: `On vide deux bouteilles dans des gobelets pareils. La bouteille bleue remplit ${g1} gobelets, la verte ${g2} gobelets. Laquelle contenait le plus d’eau ?`, txt: 1, a,
    choices: shuffle(["La bouteille bleue", "La bouteille verte", "Autant l’une que l’autre"]), why: `Plus il y a de gobelets remplis, plus il y avait d’eau : ${Math.max(g1, g2)} gobelets.`,
  };
}
