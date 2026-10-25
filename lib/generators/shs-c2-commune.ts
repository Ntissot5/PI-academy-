import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  // Sociétés locales
  ["Une fanfare, un club de foot, une troupe de théâtre du village sont…", "des sociétés locales (associations)", ["des entreprises de la Confédération", "des partis politiques", "des tribunaux"], "Les sociétés locales réunissent des personnes autour d’une activité commune."],
  ["Les samaritains d’un village sont une société…", "d’entraide (premiers secours)", ["sportive", "commerciale", "militaire"], "Ce sont des bénévoles formés aux premiers secours."],
  ["Comment se prennent souvent les décisions dans une association ?", "Les membres votent à l’assemblée générale", ["Le plus âgé décide seul", "On tire au sort chaque fois", "La Confédération décide"], "L’assemblée générale réunit les membres, qui votent."],
  ["Une société caritative a pour but…", "d’aider les personnes dans le besoin", ["de gagner beaucoup d’argent", "de construire des routes", "de juger les délits"], "Caritatif = qui aide, souvent avec des bénévoles."],
  ["Lors d’un vote, une proposition est acceptée si elle obtient…", "la majorité des voix", ["une seule voix", "l’avis du président seulement", "toutes les voix sans exception"], "La majorité, c’est plus de la moitié des votes exprimés."],
  ["Dans la classe, 13 élèves votent « oui » et 11 « non ». La proposition est…", "acceptée", ["refusée", "à refaire obligatoirement", "annulée"], "13 > 11 : le oui l’emporte à la majorité."],
  // Commune
  ["Dans une votation, les citoyennes et citoyens…", "acceptent ou refusent un objet (une proposition)", ["choisissent des personnes", "jugent un accusé", "nomment un roi"], "Votation : on dit oui ou non à un texte."],
  ["Dans une élection, les citoyennes et citoyens…", "choisissent des personnes pour les représenter", ["disent oui ou non à une loi", "paient leurs impôts", "construisent la mairie"], "Élection : on élit des personnes (conseil communal, parlement…)."],
  ["Le pouvoir exécutif de la commune…", "dirige la commune et applique les décisions", ["vote seul toutes les lois fédérales", "juge les délits", "n’existe pas"], "Selon le canton, il s’appelle municipalité, conseil communal, conseil administratif…"],
  ["Le pouvoir législatif de la commune…", "vote le budget et les règlements communaux", ["dirige l’armée suisse", "rend la justice", "nomme le Conseil fédéral"], "C’est le conseil général ou communal, ou l’assemblée de commune où tous les citoyens peuvent venir."],
  ["Dans une petite commune, l’assemblée communale réunit…", "tous les citoyens et citoyennes qui veulent y participer", ["seulement le président", "les élèves de l’école", "les conseillers fédéraux"], "C’est une forme de démocratie directe au niveau local."],
  ["Laquelle de ces tâches relève en général de la commune ?", "Organiser la collecte des déchets", ["Battre la monnaie (francs suisses)", "Signer des traités avec d’autres pays", "Diriger l’armée"], "Déchets, routes communales, bâtiments scolaires : tâches communales. La monnaie et l’armée : Confédération."],
  ["Qui entretient en général les bâtiments de l’école primaire ?", "La commune", ["L’ONU", "Le Tribunal fédéral", "Une association sportive"], "Les bâtiments scolaires sont le plus souvent une tâche communale."],
  ["Comment s’appelle la personne qui préside l’exécutif d’une commune vaudoise ?", "Le syndic ou la syndique", ["Le maire de la Confédération", "Le chancelier", "Le conseiller fédéral"], "Selon le canton : syndic (VD, FR), maire (GE, JU), président de commune (VS)."],
];

/** Cycle 2 · sociétés locales, votation et élection, organisation politique de la commune (exécutif, législatif). */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
