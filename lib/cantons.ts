/**
 * Les 26 cantons et le plan d'études de leur école obligatoire.
 * PER = Plan d'études romand · LP21 = Lehrplan 21 · PdS = Piano di studio (Tessin).
 * Les cantons bilingues suivent deux plans selon la région linguistique.
 */

export type Plan = "per" | "lp21" | "pds";

export const PLANS: Record<Plan | "libre", { nom: string; court: string }> = {
  per: { nom: "Plan d’études romand", court: "PER" },
  lp21: { nom: "Lehrplan 21", court: "LP21" },
  pds: { nom: "Piano di studio (Tessin)", court: "PdS" },
  libre: { nom: "Toute la Suisse", court: "Suisse" },
};

export type Langue = "fr" | "de" | "it" | "rm";

export interface Institutions {
  /** Nom du parlement cantonal, en français. */
  parlement: string;
  sieges: number;
  /** Nom du gouvernement cantonal, en français. */
  gouvernement: string;
  membres: number;
}

export interface Canton {
  code: string;
  nom: string;
  /** Chef-lieu (siège des autorités), et variantes d'orthographe acceptées. */
  chefLieu: string;
  chefLieuAccept?: string[];
  langues: Langue[];
  plans: Plan[];
  /** Demi-canton historique : 1 siège au Conseil des États au lieu de 2. */
  demi?: boolean;
  institutions?: Institutions;
}

export const CANTONS: Canton[] = [
  { code: "ZH", nom: "Zurich", chefLieu: "Zurich", chefLieuAccept: ["Zürich"], langues: ["de"], plans: ["lp21"] },
  { code: "BE", nom: "Berne", chefLieu: "Berne", chefLieuAccept: ["Bern"], langues: ["de", "fr"], plans: ["lp21", "per"],
    institutions: { parlement: "Grand Conseil", sieges: 160, gouvernement: "Conseil-exécutif", membres: 7 } },
  { code: "LU", nom: "Lucerne", chefLieu: "Lucerne", chefLieuAccept: ["Luzern"], langues: ["de"], plans: ["lp21"] },
  { code: "UR", nom: "Uri", chefLieu: "Altdorf", langues: ["de"], plans: ["lp21"] },
  { code: "SZ", nom: "Schwytz", chefLieu: "Schwytz", chefLieuAccept: ["Schwyz"], langues: ["de"], plans: ["lp21"] },
  { code: "OW", nom: "Obwald", chefLieu: "Sarnen", langues: ["de"], plans: ["lp21"], demi: true },
  { code: "NW", nom: "Nidwald", chefLieu: "Stans", langues: ["de"], plans: ["lp21"], demi: true },
  { code: "GL", nom: "Glaris", chefLieu: "Glaris", chefLieuAccept: ["Glarus"], langues: ["de"], plans: ["lp21"] },
  { code: "ZG", nom: "Zoug", chefLieu: "Zoug", chefLieuAccept: ["Zug"], langues: ["de"], plans: ["lp21"] },
  { code: "FR", nom: "Fribourg", chefLieu: "Fribourg", chefLieuAccept: ["Freiburg"], langues: ["fr", "de"], plans: ["per", "lp21"],
    institutions: { parlement: "Grand Conseil", sieges: 110, gouvernement: "Conseil d’État", membres: 7 } },
  { code: "SO", nom: "Soleure", chefLieu: "Soleure", chefLieuAccept: ["Solothurn"], langues: ["de"], plans: ["lp21"] },
  { code: "BS", nom: "Bâle-Ville", chefLieu: "Bâle", chefLieuAccept: ["Basel", "Bale"], langues: ["de"], plans: ["lp21"], demi: true },
  { code: "BL", nom: "Bâle-Campagne", chefLieu: "Liestal", langues: ["de"], plans: ["lp21"], demi: true },
  { code: "SH", nom: "Schaffhouse", chefLieu: "Schaffhouse", chefLieuAccept: ["Schaffhausen"], langues: ["de"], plans: ["lp21"] },
  { code: "AR", nom: "Appenzell Rhodes-Extérieures", chefLieu: "Herisau", chefLieuAccept: ["Trogen"], langues: ["de"], plans: ["lp21"], demi: true },
  { code: "AI", nom: "Appenzell Rhodes-Intérieures", chefLieu: "Appenzell", langues: ["de"], plans: ["lp21"], demi: true },
  { code: "SG", nom: "Saint-Gall", chefLieu: "Saint-Gall", chefLieuAccept: ["St-Gall", "St. Gallen", "Sankt Gallen"], langues: ["de"], plans: ["lp21"] },
  { code: "GR", nom: "Grisons", chefLieu: "Coire", chefLieuAccept: ["Chur"], langues: ["de", "rm", "it"], plans: ["lp21"] },
  { code: "AG", nom: "Argovie", chefLieu: "Aarau", langues: ["de"], plans: ["lp21"] },
  { code: "TG", nom: "Thurgovie", chefLieu: "Frauenfeld", langues: ["de"], plans: ["lp21"] },
  { code: "TI", nom: "Tessin", chefLieu: "Bellinzone", chefLieuAccept: ["Bellinzona"], langues: ["it"], plans: ["pds"],
    institutions: { parlement: "Grand Conseil", sieges: 90, gouvernement: "Conseil d’État", membres: 5 } },
  { code: "VD", nom: "Vaud", chefLieu: "Lausanne", langues: ["fr"], plans: ["per"],
    institutions: { parlement: "Grand Conseil", sieges: 150, gouvernement: "Conseil d’État", membres: 7 } },
  { code: "VS", nom: "Valais", chefLieu: "Sion", chefLieuAccept: ["Sitten"], langues: ["fr", "de"], plans: ["per", "lp21"],
    institutions: { parlement: "Grand Conseil", sieges: 130, gouvernement: "Conseil d’État", membres: 5 } },
  { code: "NE", nom: "Neuchâtel", chefLieu: "Neuchâtel", chefLieuAccept: ["Neuchatel"], langues: ["fr"], plans: ["per"],
    institutions: { parlement: "Grand Conseil", sieges: 100, gouvernement: "Conseil d’État", membres: 5 } },
  { code: "GE", nom: "Genève", chefLieu: "Genève", chefLieuAccept: ["Geneve"], langues: ["fr"], plans: ["per"],
    institutions: { parlement: "Grand Conseil", sieges: 100, gouvernement: "Conseil d’État", membres: 7 } },
  { code: "JU", nom: "Jura", chefLieu: "Delémont", chefLieuAccept: ["Delemont"], langues: ["fr"], plans: ["per"],
    institutions: { parlement: "Parlement", sieges: 60, gouvernement: "Gouvernement", membres: 5 } },
];

export const LANGUE_NOM: Record<Langue, string> = { fr: "français", de: "allemand", it: "italien", rm: "romanche" };

export const cantonByCode = (code?: string | null) => CANTONS.find((c) => c.code === code);

/** Libellé des langues officielles : « français et allemand ». */
export function languesLabel(c: Canton): string {
  // Ordre fixe, pour que « français et allemand » s'écrive pareil pour Berne, Fribourg et le Valais.
  const ORDER: Langue[] = ["fr", "de", "it", "rm"];
  const l = ORDER.filter((x) => c.langues.includes(x)).map((x) => LANGUE_NOM[x]);
  return l.length === 1 ? l[0] : `${l.slice(0, -1).join(", ")} et ${l[l.length - 1]}`;
}
