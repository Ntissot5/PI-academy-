import { R, fr, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [grandeur à mesurer, instrument, unité usuelle]
const INSTR: [string, string, string][] = [
  ["la température de l’eau d’un aquarium", "un thermomètre", "°C"],
  ["la durée d’une course de 60 m", "un chronomètre", "s"],
  ["la masse d’un sac de pommes", "une balance", "kg"],
  ["le volume d’eau dans un verre", "un récipient gradué", "ml ou dl"],
  ["la longueur d’un couloir", "un mètre ruban", "m"],
  ["la longueur d’une feuille d’arbre", "une règle graduée", "cm"],
];

const ITEMS: [string, string, string[], string][] = [
  ["Tu veux savoir si la lumière aide une plante à pousser. Que dois-tu changer entre tes deux pots ?", "Seulement la lumière (même eau, même terre, même plante)", ["La lumière et l’eau", "Tout, pour voir", "Rien du tout"], "On ne change qu’un seul facteur à la fois ; sinon, on ne sait pas lequel a agi."],
  ["Tu testes si le sucre fond plus vite dans l’eau chaude. Que dois-tu garder identique ?", "La quantité d’eau et de sucre, et la façon de mélanger", ["Rien", "Seulement la couleur du verre", "La température de l’eau"], "Seule la température change ; tout le reste reste pareil."],
  ["« L’eau du verre a baissé en 3 jours. » C’est…", "un constat (résultat observé)", ["une interprétation", "une hypothèse", "une question de recherche"], "On l’a mesuré : c’est un résultat, un constat."],
  ["« L’eau a baissé parce qu’elle s’est évaporée. » C’est…", "une interprétation (explication)", ["un constat", "une mesure", "un instrument"], "C’est une explication du constat, qu’on peut vérifier par une autre expérience."],
  ["« Je pense que la glace fond plus vite au soleil qu’à l’ombre. » Avant l’expérience, c’est…", "une hypothèse", ["un résultat", "une conclusion", "une mesure"], "Une hypothèse est une réponse possible, à vérifier par l’expérience."],
  ["Pourquoi refaire plusieurs fois la même mesure ?", "Pour avoir un résultat plus fiable", ["Pour perdre du temps", "Pour changer le résultat", "Ce n’est jamais utile"], "Plusieurs mesures permettent de repérer une erreur et de calculer une moyenne."],
  ["Où noter les observations d’une expérience qui dure plusieurs semaines ?", "Dans un journal d’observations", ["Nulle part, on s’en souviendra", "Sur une feuille qu’on jette", "Seulement à la fin"], "Le journal d’observations garde la trace de chaque étape (date, dessin, mesure)."],
  ["Pour lire un thermomètre correctement, on place ses yeux…", "à la hauteur du liquide", ["bien au-dessus", "bien en dessous", "n’importe où"], "Regarder de travers fausse la lecture : c’est une erreur de lecture."],
  ["Quel graphique convient pour montrer la croissance d’une plante jour après jour ?", "Un graphique en ligne (courbe)", ["Une carte de géographie", "Un arbre généalogique", "Une liste de courses"], "Une courbe montre bien l’évolution d’une mesure dans le temps."],
];

/** Cycle 2 · démarche scientifique : instruments et unités, un seul facteur à la fois, constat/interprétation, moyenne. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [quoi, instr] = pick(INSTR);
    const faux = shuffle(INSTR.filter((x) => x[1] !== instr).map((x) => x[1])).slice(0, 3);
    return { q: `Quel instrument choisis-tu pour mesurer ${quoi} ?`, txt: 1, a: instr, choices: shuffle([instr, ...faux]), why: `On mesure ${quoi} avec ${instr} (unité : ${pick(INSTR.filter((x) => x[1] === instr))[2]}).` };
  }
  if (t === 1) {
    const [quoi, , unite] = pick(INSTR);
    const faux = shuffle([...new Set(INSTR.map((x) => x[2]).filter((u) => u !== unite))]).slice(0, 3);
    return { q: `Quelle unité convient pour ${quoi} ?`, txt: 1, a: unite, choices: shuffle([unite, ...faux]), why: `Pour ${quoi}, on utilise : ${unite}.` };
  }
  if (t === 2) {
    // Moyenne de 3 mesures de temps (s).
    const base = R(10, 20);
    const m = [base + R(-1, 1) * 0.5 + 0.2, base + 0.4, base + R(0, 2) * 0.5 + 0.3].map((x) => +x.toFixed(1));
    const moy = (m[0] + m[1] + m[2]) / 3;
    return {
      q: `Trois mesures de la même chute d’une bille : ${m.map(fr).join(" s ; ")} s. Quelle est la moyenne (en s, au dixième) ?`, txt: 1,
      a: +moy.toFixed(1), tol: 0.051, why: `(${m.map(fr).join(" + ")}) ÷ 3 ≈ ${fr(+moy.toFixed(1))} s.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}

