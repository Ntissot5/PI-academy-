import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Range du plus petit au plus grand niveau d’organisation.", "Cellule, tissu, organe, système", ["Organe, cellule, tissu, système", "Tissu, cellule, système, organe", "Système, organe, tissu, cellule"], "Des cellules semblables forment un tissu ; plusieurs tissus, un organe ; plusieurs organes, un système (appareil)."],
  ["Le cœur est…", "un organe", ["une cellule", "un tissu", "un système entier"], "Le cœur est un organe du système cardiovasculaire."],
  ["Le muscle cardiaque, fait de cellules semblables, est…", "un tissu", ["un organe", "un système", "une molécule"], "Un tissu = un ensemble de cellules semblables qui ont la même fonction."],
  ["Quel système apporte le dioxygène dans le sang ?", "Le système respiratoire", ["Le système digestif", "Le système nerveux", "Le squelette"], "Les poumons font passer le dioxygène dans le sang."],
  ["Quel système transforme les aliments en nutriments ?", "Le système digestif", ["Le système respiratoire", "Le système excréteur", "Le système nerveux"], "La digestion découpe les aliments en nutriments absorbables."],
  ["Quel système transporte nutriments et dioxygène jusqu’à chaque cellule ?", "Le système circulatoire (cardiovasculaire)", ["Le système digestif", "Le système nerveux", "Le système reproducteur"], "Le sang, pompé par le cœur, distribue tout aux cellules."],
  ["Pourquoi les systèmes digestif, respiratoire et circulatoire sont-ils complémentaires ?", "Ils assurent ensemble l’approvisionnement de chaque cellule", ["Ils font tous la même chose", "Ils ne sont pas liés", "Seul le cerveau compte"], "Nutriments (digestif) + dioxygène (respiratoire), transportés par le sang (circulatoire)."],
  ["Les antibiotiques sont efficaces contre…", "les bactéries", ["les virus", "toutes les maladies", "les allergies"], "Les antibiotiques n’agissent pas sur les virus (grippe, rhume)."],
  ["La grippe est causée par…", "un virus", ["une bactérie", "un champignon", "un manque de vitamines"], "La grippe est une maladie virale : les antibiotiques n’y peuvent rien."],
  ["Le pied d’athlète (démangeaisons entre les orteils) est le plus souvent causé par…", "un champignon (mycose)", ["un virus", "une bactérie", "un parasite intestinal"], "Les mycoses sont des infections par des champignons microscopiques."],
  ["Comment agit un vaccin ?", "Il entraîne le système immunitaire à reconnaître un microbe", ["Il tue directement tous les microbes", "Il remplace les globules rouges", "Il soigne les fractures"], "Le vaccin prépare les défenses du corps avant une infection."],
  ["Quel geste limite la propagation des microbes ?", "Se laver les mains régulièrement", ["Partager sa gourde", "Tousser dans sa main puis toucher la poignée", "Ne jamais aérer"], "Le lavage des mains est un geste de prévention simple et efficace."],
  ["Quelles cellules du sang défendent le corps contre les microbes ?", "Les globules blancs", ["Les globules rouges", "Les plaquettes", "Les neurones"], "Les globules blancs font partie du système immunitaire."],
  ["Quelle substance du tabac rend dépendant ?", "La nicotine", ["La caféine", "Le sucre", "Le dioxygène"], "La nicotine crée une dépendance ; le goudron et les autres produits abîment les poumons."],
  ["Une exposition prolongée à un bruit très fort (concert, écouteurs à fond) peut…", "abîmer l’oreille de façon définitive", ["améliorer l’ouïe", "n’avoir aucun effet", "soigner les acouphènes"], "Les cellules ciliées de l’oreille interne ne repoussent pas."],
  ["Parmi ces comportements, lequel est une addiction possible ?", "L’usage excessif des écrans et d’Internet", ["Faire du sport une heure par semaine", "Boire de l’eau", "Dormir 9 heures"], "Une addiction : un besoin qu’on ne contrôle plus, malgré ses effets négatifs."],
  ["L’alcool agit d’abord sur…", "le système nerveux (le cerveau)", ["les ongles", "les cheveux", "les dents"], "L’alcool ralentit les réflexes et altère le jugement ; il abîme aussi le foie."],
  ["Une hygiène de vie équilibrée comprend…", "activité physique, alimentation variée et sommeil suffisant", ["sauter le petit-déjeuner", "rester assis toute la journée", "manger seulement des protéines"], "Ces trois piliers protègent la santé à long terme."],
  ["Les polluants de l’air (particules fines) touchent surtout…", "le système respiratoire", ["le système digestif", "le squelette", "la peau des pieds"], "Les particules fines pénètrent profondément dans les poumons."],
];

/** Cycle 3 · organisation du corps, systèmes et leur complémentarité, agents infectieux, prévention et addictions. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
