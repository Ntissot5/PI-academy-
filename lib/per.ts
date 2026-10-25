/**
 * Objectifs du Plan d'études romand (PER), cycle 3 (9e–11e), et correspondance avec nos types d'exercices.
 *
 * Statut : établi sans accès au site officiel (plandetudes.ch / per.ciip.ch), à partir de la structure
 * connue du PER, recoupée pour les mathématiques avec les prescriptions genevoises et la planification
 * fribourgeoise. Chaque correspondance est à valider par un·e enseignant·e (voir docs/PER-correspondance.md).
 */

export interface ObjectifPer {
  code: string;
  domaine: "MSN" | "L1" | "L2" | "L3" | "SHS";
  /** Axe ou discipline, tel qu'on le dit en classe. */
  axe: string;
  titre: string;
}

export const OBJECTIFS_PER: Record<string, ObjectifPer> = {
  "MSN 31": { code: "MSN 31", domaine: "MSN", axe: "Espace", titre: "Poser et résoudre des problèmes pour structurer le plan et l’espace" },
  "MSN 32": { code: "MSN 32", domaine: "MSN", axe: "Nombres", titre: "Poser et résoudre des problèmes pour construire et structurer des représentations des nombres réels" },
  "MSN 33": { code: "MSN 33", domaine: "MSN", axe: "Opérations", titre: "Résoudre des problèmes numériques et algébriques" },
  "MSN 34": { code: "MSN 34", domaine: "MSN", axe: "Grandeurs et mesures", titre: "Mobiliser la mesure pour comparer, décrire et quantifier des grandeurs" },
  "MSN 35": { code: "MSN 35", domaine: "MSN", axe: "Modélisation", titre: "Modéliser des phénomènes naturels, techniques, sociaux ou des situations mathématiques" },
  "MSN 36": { code: "MSN 36", domaine: "MSN", axe: "Phénomènes naturels et techniques", titre: "Analyser des phénomènes naturels et des technologies à l’aide de démarches caractéristiques des sciences expérimentales" },
  "L1 36": { code: "L1 36", domaine: "L1", axe: "Fonctionnement de la langue", titre: "Analyser le fonctionnement de la langue et élaborer des critères d’appréciation pour comprendre et produire des textes" },
  "L2 36": { code: "L2 36", domaine: "L2", axe: "Fonctionnement de la langue", titre: "Observer le fonctionnement de la langue et s’approprier des outils de base pour comprendre et produire des textes (allemand)" },
  "L3 36": { code: "L3 36", domaine: "L3", axe: "Fonctionnement de la langue", titre: "Observer le fonctionnement de la langue et s’approprier des outils de base pour comprendre et produire des textes (anglais)" },
  "SHS 31": { code: "SHS 31", domaine: "SHS", axe: "Géographie", titre: "Analyser des espaces géographiques et les relations établies entre les hommes et entre les sociétés à travers ceux-ci" },
  "SHS 32": { code: "SHS 32", domaine: "SHS", axe: "Histoire", titre: "Analyser l’organisation collective des sociétés humaines d’ici et d’ailleurs à travers le temps" },
  "SHS 34": { code: "SHS 34", domaine: "SHS", axe: "Citoyenneté", titre: "Saisir les formes et le fonctionnement de la vie sociale et politique" },
};

export interface CorrespondancePer {
  /** Codes d'objectifs PER visés ; vide si le contenu sort du cycle 3. */
  objectifs: string[];
  /** Années Harmos où le contenu est habituellement travaillé (cycle 3). */
  annees?: string;
  /** Contenu du secondaire II (gymnase, maturité, prépa EPFL) : hors PER cycle 3. */
  horsPer?: boolean;
  note?: string;
}

/** Correspondance par type d'exercices. Une unité peut la préciser avec son propre champ (admin). */
export const PER_PAR_GENERATEUR: Record<string, CorrespondancePer> = {
  rel: { objectifs: ["MSN 32", "MSN 33"], annees: "9e", note: "Nombres relatifs : ordre, opérations, règle des signes." },
  frac: { objectifs: ["MSN 32", "MSN 33", "MSN 35"], annees: "9e–10e", note: "Fractions, pourcentages ; proportionnalité pour les augmentations." },
  pow: { objectifs: ["MSN 32", "MSN 33"], annees: "9e–10e", note: "Puissances de 10, notation scientifique." },
  eq1: { objectifs: ["MSN 33"], annees: "10e–11e", note: "Calcul littéral, équations du 1er degré." },
  geo: { objectifs: ["MSN 34", "MSN 31"], annees: "9e–11e", note: "Aires, volumes, conversions d’unités." },
  iso: { objectifs: ["MSN 33", "MSN 34"], annees: "10e–11e", note: "Transformer une formule (grandeurs et mesures)." },
  lin: { objectifs: ["MSN 33", "MSN 35"], annees: "10e–11e", note: "Fonctions linéaires et affines, pente." },
  eq2: { objectifs: [], horsPer: true, note: "Équations du 2e degré : secondaire II (seule une initiation à la factorisation peut figurer en 11e)." },
  trig: { objectifs: [], horsPer: true, note: "Trigonométrie (sin, cos, tan) : secondaire II ; le cycle 3 s’arrête à Pythagore et Thalès." },
  log: { objectifs: [], horsPer: true, note: "Exponentielles et logarithmes : secondaire II." },
  der: { objectifs: [], horsPer: true, note: "Dérivées : secondaire II." },
  "fr-present": { objectifs: ["L1 36"], annees: "9e", note: "Conjugaison : présent de l’indicatif." },
  "fr-imparfait": { objectifs: ["L1 36"], annees: "9e" },
  "fr-futur": { objectifs: ["L1 36"], annees: "9e" },
  "fr-pc": { objectifs: ["L1 36"], annees: "9e–10e", note: "Accord du participe passé avec être." },
  "fr-homophones": { objectifs: ["L1 36"], annees: "9e–11e", note: "Orthographe grammaticale." },
  "fr-nature": { objectifs: ["L1 36"], annees: "9e–11e", note: "Classes grammaticales." },
  "de-praesens": { objectifs: ["L2 36"], annees: "9e" },
  "de-artikel": { objectifs: ["L2 36"], annees: "9e" },
  "de-zahlen": { objectifs: ["L2 36"], annees: "9e", note: "Lexique de base." },
  "de-perfekt": { objectifs: ["L2 36"], annees: "10e–11e" },
  "en-present": { objectifs: ["L3 36"], annees: "9e" },
  "en-irregular": { objectifs: ["L3 36"], annees: "9e–11e" },
  "sci-unites": { objectifs: ["MSN 34", "MSN 36"], annees: "9e–11e" },
  "sci-masse-volumique": { objectifs: ["MSN 36", "MSN 34"], annees: "9e–10e" },
  "sci-electricite": { objectifs: ["MSN 36"], annees: "10e–11e", note: "Circuits, tension, courant, résistance." },
  "chi-symboles": { objectifs: ["MSN 36"], annees: "10e–11e", note: "Éléments et symboles chimiques." },
  "geo-cantons": { objectifs: ["SHS 31"], annees: "9e–11e", note: "Repères géographiques sur la Suisse (proche des attentes cantonales)." },
  "geo-suisse": { objectifs: ["SHS 31"], annees: "9e–11e" },
  "hist-suisse": { objectifs: ["SHS 32"], annees: "9e–11e" },
  "hist-monde": { objectifs: ["SHS 32"], annees: "9e–11e" },
  "cit-federal": { objectifs: ["SHS 34"], annees: "11e", note: "Institutions fédérales, droits populaires." },
  "cit-canton": { objectifs: ["SHS 34"], annees: "11e", note: "Institutions cantonales." },
};

/** Correspondance d'une unité ; l'examen final reprend celles des unités de son parcours. */
export function perPourUnite(idGenerateur: string, parcoursUnits: { id_generateur: string }[] = []): CorrespondancePer {
  if (idGenerateur === "final") {
    const all = parcoursUnits.filter((u) => u.id_generateur !== "final").map((u) => PER_PAR_GENERATEUR[u.id_generateur]).filter(Boolean);
    const objectifs = [...new Set(all.flatMap((c) => c.objectifs))].sort();
    return { objectifs, horsPer: objectifs.length === 0 && all.some((c) => c.horsPer) };
  }
  return PER_PAR_GENERATEUR[idGenerateur] ?? { objectifs: [] };
}
