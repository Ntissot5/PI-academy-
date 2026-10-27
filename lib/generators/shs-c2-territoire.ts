import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Lequel est un besoin vital ?", "S’alimenter", ["Aller au cinéma", "Faire du ski", "Jouer à la console"], "Besoins vitaux : se nourrir, boire, respirer, se protéger (logement, habits)."],
  ["Lequel est un besoin secondaire (pas vital) ?", "Se divertir", ["Boire", "Respirer", "Se protéger du froid"], "Se divertir, se déplacer, communiquer : importants, mais pas vitaux."],
  ["Quel lieu répond surtout au besoin de se loger ?", "Un quartier d’habitation", ["Une zone industrielle", "Un aéroport", "Une station de ski"], "Les zones d’habitation regroupent les logements."],
  ["Quel lieu répond surtout au besoin de se déplacer loin et vite ?", "Un aéroport ou une gare", ["Un parc public", "Une école", "Un vignoble"], "Gares, aéroports et nœuds autoroutiers sont des lieux de transport."],
  ["Une station de ski répond surtout au besoin de…", "se divertir (loisirs, tourisme)", ["se loger toute l’année", "produire du lait", "apprendre à lire"], "C’est un lieu de loisirs et de tourisme."],
  ["Pourquoi beaucoup de villages anciens se trouvent-ils près d’une rivière ou d’un lac ?", "Pour l’eau, la pêche et le transport", ["Parce que c’est toujours plus chaud", "Pour éviter les routes", "Par hasard"], "L’eau était indispensable : boire, cultiver, pêcher, faire tourner les moulins."],
  ["Pourquoi les vignes de Lavaux sont-elles plantées sur la pente au bord du Léman ?", "La pente est bien ensoleillée et le lac renvoie la chaleur", ["Parce que le sol y est plat", "Pour être loin du soleil", "Parce qu’il y neige toujours"], "Exposition au sud, soleil, et chaleur rendue par le lac et les murs : idéal pour la vigne."],
  ["Pourquoi une famille choisit-elle d’habiter près de son travail et des commerces ?", "Pour la proximité (moins de trajets)", ["Pour avoir plus de bruit", "Pour payer plus cher", "Pour être isolée"], "La proximité est une raison sociale et économique de localisation."],
  ["Pourquoi les logements sont-ils souvent plus chers au centre d’une grande ville ?", "Beaucoup de gens veulent y habiter et il y a peu de place", ["Il n’y a pas de services", "Il y a moins de transports", "Les immeubles sont plus petits"], "La demande est forte et le terrain rare : le prix monte."],
  ["À quoi sert une station d’épuration (STEP) ?", "À nettoyer les eaux usées avant de les rendre à la rivière ou au lac", ["À produire de l’eau potable en bouteille", "À fabriquer de la neige", "À stocker les déchets"], "Elle évacue et traite les eaux usées."],
  ["À quoi sert un mur antibruit le long d’une autoroute ?", "À réduire les nuisances sonores pour les habitants", ["À décorer l’autoroute", "À arrêter la pluie", "À ralentir les voitures"], "C’est un aménagement pour réduire les nuisances."],
  ["À quoi sert un pont ?", "À relier deux lieux séparés (par une rivière, une vallée)", ["À évacuer les déchets", "À stocker de l’eau", "À marquer une frontière"], "Ponts, routes et voies ferrées relient les lieux."],
  ["Un barrage dans les Alpes sert surtout à…", "produire de l’électricité et stocker de l’eau", ["relier deux villes", "évacuer les eaux usées", "faire pousser la vigne"], "Les barrages approvisionnent en énergie."],
  ["Une zone industrielle est souvent placée…", "près des voies de communication, à l’écart des habitations", ["au milieu des écoles", "au sommet des montagnes", "dans les parcs publics"], "Accès facile pour les camions et moins de nuisances pour les habitants."],
  ["Le bétonnage de terres agricoles a pour conséquence…", "moins de terres pour cultiver et moins d’espaces naturels", ["plus de champs", "plus de forêts", "aucune conséquence"], "Chaque aménagement a des impacts environnementaux, sociaux et économiques."],
  ["Les frontières d’une commune sont…", "des limites qui séparent son territoire de celui des communes voisines", ["des murs construits partout", "des rivières seulement", "des routes seulement"], "Une limite peut suivre une rivière, une crête… ou être une ligne invisible sur le terrain."],
];

/** Cycle 2 · organisation de l'espace : besoins, lieux, raisons de la localisation, aménagements et leurs impacts. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
