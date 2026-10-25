import { R, fr, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [instrument, grandeur mesurée]
const INSTR: [string, string][] = [
  ["un dynamomètre", "une force"],
  ["un baromètre", "la pression de l’air"],
  ["un thermomètre", "une température"],
  ["un chronomètre", "une durée"],
  ["une balance", "une masse"],
  ["une éprouvette graduée", "un volume de liquide"],
  ["un double-mètre", "une longueur"],
  ["un ampèremètre", "l’intensité du courant électrique"],
  ["un voltmètre", "une tension électrique"],
];

const ITEMS: [string, string, string[], string][] = [
  ["On veut savoir si la longueur d’un pendule change sa période. Que doit-on garder constant ?", "La masse et l’angle de départ", ["La longueur", "Rien", "On change tout en même temps"], "On ne fait varier qu’un seul facteur à la fois (ici la longueur)."],
  ["Pourquoi répète-t-on une mesure plusieurs fois ?", "Pour réduire l’effet des erreurs et gagner en précision", ["Pour obtenir le résultat qu’on attend", "Pour remplir le tableau", "Ce n’est jamais utile"], "La moyenne de plusieurs mesures est plus fiable qu’une mesure unique."],
  ["Dans une expérience, le « témoin » sert à…", "comparer avec une situation où l’on n’a rien changé", ["décorer le montage", "remplacer la mesure", "noter la date"], "Sans témoin, on ne sait pas si l’effet vient vraiment du facteur testé."],
  ["Une hypothèse scientifique doit être…", "vérifiable par une expérience ou une observation", ["toujours vraie", "impossible à tester", "écrite après l’expérience"], "On teste l’hypothèse ; elle peut être confirmée ou réfutée."],
  ["Un résultat expérimental contredit ton hypothèse. Que fais-tu ?", "Tu révises ton hypothèse (ou vérifies le protocole)", ["Tu changes les résultats", "Tu ignores le résultat", "Tu recommences jusqu’à obtenir ce que tu voulais"], "Les résultats honnêtes priment : l’hypothèse s’adapte aux faits."],
  ["Quel graphique convient pour montrer la répartition des gaz de l’air (en %) ?", "Un diagramme circulaire", ["Un diagramme cartésien (courbe)", "Une carte", "Une frise chronologique"], "Le diagramme circulaire montre les parts d’un tout."],
  ["Quel graphique convient pour montrer la température d’une eau qui chauffe au cours du temps ?", "Un diagramme cartésien (courbe)", ["Un diagramme circulaire", "Un arbre de classement", "Une clé de détermination"], "Une courbe montre l’évolution d’une grandeur en fonction du temps."],
  ["Pour observer des cellules d’oignon, quel instrument utilise-t-on ?", "Un microscope", ["Des jumelles", "Un télescope", "Une loupe de poche suffit toujours"], "Les cellules sont trop petites pour l’œil nu : il faut un microscope."],
  ["Dans un rapport d’expérience, après « Résultats » vient en général…", "Interprétation et conclusion", ["Hypothèse", "Matériel", "Titre"], "Ordre habituel : question, hypothèse, matériel et protocole, résultats, interprétation, conclusion."],
];

/** Cycle 3 · démarche scientifique : instruments, protocole (un facteur à la fois, témoin), précision, représentations. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [instr, grandeur] = pick(INSTR);
    const faux = shuffle(INSTR.filter((x) => x[0] !== instr).map((x) => x[0])).slice(0, 3);
    return { q: `Quel instrument mesure ${grandeur} ?`, txt: 1, a: instr, choices: shuffle([instr, ...faux]), why: `On mesure ${grandeur} avec ${instr}.` };
  }
  if (t === 1) {
    // Moyenne de 4 mesures, arrondie au centième.
    const base = R(150, 250) / 100;
    const m = [0, 0.03, -0.02, 0.05].map((d) => +(base + d + R(-2, 2) / 100).toFixed(2));
    const moy = m.reduce((s, x) => s + x, 0) / 4;
    return {
      q: `Quatre mesures de la période d’un pendule : ${m.map(fr).join(" s ; ")} s. Quelle est la moyenne, en s ?`, txt: 1,
      a: moy, tol: 0.006, why: `(${m.map(fr).join(" + ")}) ÷ 4 ≈ ${fr(moy)} s.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
