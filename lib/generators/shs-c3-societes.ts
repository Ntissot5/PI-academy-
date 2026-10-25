import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  // Dimension sociale et culturelle
  ["Sous l’Ancien Régime en France, quels étaient les trois ordres ?", "Le clergé, la noblesse et le tiers état", ["Les rois, les reines et les princes", "Les ouvriers, les patrons et les paysans", "Les Romains, les Gaulois et les Francs"], "Le tiers état regroupait la grande majorité de la population."],
  ["Au Moyen Âge, les corporations regroupaient…", "les artisans d’un même métier", ["les chevaliers", "les moines", "les rois d’Europe"], "Elles fixaient les règles du métier (apprentissage, prix, qualité)."],
  ["En Suisse, depuis quand les femmes peuvent-elles voter au niveau fédéral ?", "1971", ["1848", "1918", "2000"], "Le suffrage féminin fédéral est accepté en 1971 ; le dernier canton (Appenzell Rhodes-Intérieures) y est contraint en 1990."],
  ["L’AVS, l’assurance vieillesse suisse, est entrée en vigueur en…", "1948", ["1848", "1915", "1990"], "L’AVS est un des grands changements sociaux du XXe siècle en Suisse."],
  ["La révolution industrielle transforme la société : beaucoup de paysans deviennent…", "ouvriers dans les usines des villes", ["chevaliers", "moines", "seigneurs"], "C’est l’exode rural : on quitte la campagne pour travailler en ville."],
  // Dimension économique
  ["Échanger des marchandises sans utiliser de monnaie, c’est…", "le troc", ["le crédit", "l’impôt", "la bourse"], "Avant la monnaie, on échangeait directement des biens."],
  ["La révolution néolithique, c’est…", "le passage à l’agriculture, à l’élevage et à la vie sédentaire", ["l’invention de la machine à vapeur", "la découverte de l’Amérique", "l’invention d’Internet"], "Elle commence il y a environ 10 000 ans au Proche-Orient."],
  ["Quelle invention est au cœur de la première révolution industrielle ?", "La machine à vapeur", ["L’ordinateur", "La charrue", "Le moulin à eau"], "Elle fait tourner les usines textiles et les locomotives."],
  ["Le commerce triangulaire reliait…", "l’Europe, l’Afrique et l’Amérique", ["la Suisse, la France et l’Italie", "l’Asie, l’Océanie et l’Antarctique", "Rome, Athènes et Carthage"], "Des Africains réduits en esclavage étaient déportés vers l’Amérique : un crime contre l’humanité."],
  ["Une délocalisation, c’est…", "déplacer une production dans un autre pays, souvent pour réduire les coûts", ["construire une nouvelle usine dans sa commune", "fermer un magasin le dimanche", "exporter de l’eau"], "C’est un phénomène lié à la mondialisation des échanges."],
  // Dimension politique
  ["Une monarchie absolue, c’est un régime où…", "le roi détient tous les pouvoirs", ["le peuple vote toutes les lois", "il n’y a pas de chef", "les juges gouvernent"], "Exemple : Louis XIV en France."],
  ["Dans une démocratie, le pouvoir appartient…", "au peuple", ["à un roi", "à un seul parti", "à l’armée"], "Démocratie vient du grec « dêmos » (peuple) et « kratos » (pouvoir)."],
  ["Quel philosophe des Lumières a défendu la séparation des pouvoirs ?", "Montesquieu", ["Louis XIV", "Napoléon", "Calvin"], "Dans « De l’esprit des lois » (1748), il sépare législatif, exécutif et judiciaire."],
  ["Le pouvoir législatif…", "fait les lois", ["applique les lois", "juge selon les lois", "commande l’armée seulement"], "Législatif : faire les lois. Exécutif : les appliquer. Judiciaire : juger."],
  ["La Guerre froide opposait surtout…", "les États-Unis et l’URSS", ["la France et l’Allemagne", "la Suisse et l’Autriche", "la Chine et le Japon"], "De 1947 environ à 1991, deux blocs s’opposent sans guerre directe entre eux."],
  ["En quelle année le mur de Berlin est-il tombé ?", "1989", ["1945", "1961", "2001"], "La chute du Mur annonce la fin de la Guerre froide."],
  ["La décolonisation, c’est…", "l’accès à l’indépendance des anciennes colonies", ["la conquête de nouvelles colonies", "la construction de l’Union européenne", "la fin de la Préhistoire"], "Elle se produit surtout après 1945, en Asie et en Afrique."],
  ["Quelle idéologie était celle du régime d’Hitler ?", "Le nazisme", ["Le libéralisme", "Le pacifisme", "La monarchie constitutionnelle"], "Le nazisme, raciste et totalitaire, a conduit à la Shoah et à la Seconde Guerre mondiale."],
];

/** Cycle 3 · permanences et changements dans les sociétés : dimensions sociale, économique et politique. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
