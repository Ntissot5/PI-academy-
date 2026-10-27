/**
 * Précisions cantonales sur le PER (data/cantons/cantons.json, copié dans public/data/) :
 * répartition des notions par année, grilles horaires, niveaux et filières. Texte recopié des documents officiels.
 */
export interface Repartition { code: string; annee: string; notion: string; contenu?: string[]; filieres?: string[]; document?: string }
export interface CantonPer {
  canton: string;
  documents: { titre: string; fichier: string; url: string; discipline?: string; cycle?: string; annee_scolaire?: string }[];
  grille_horaire: { annee: string; discipline: string; periodes: number | string; filiere: string; note?: string }[];
  niveaux_filieres: { niveau_per: string; filieres: string[]; texte?: string }[];
  repartition_par_annee: Repartition[];
  evaluations: { annee: string; discipline: string; type: string; texte?: string }[];
}

/** « 9e-11e » → [9, 10, 11] ; « secondaire II » → []. */
export function anneesDe(s: string | undefined): number[] {
  const m = (s ?? "").match(/\d+/g)?.map(Number) ?? [];
  if (!m.length) return [];
  const [a, b = a] = m;
  return Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);
}

/** Lignes cantonales pour ces objectifs et ces années (au moins une année en commun). */
export function repartitionPour(c: CantonPer | undefined, codes: string[], annee: string | undefined): Repartition[] {
  if (!c) return [];
  const ans = new Set(anneesDe(annee));
  return c.repartition_par_annee.filter((r) => codes.includes(r.code) && (!ans.size || anneesDe(r.annee).some((n) => ans.has(n))));
}

let cache: Promise<CantonPer[]> | null = null;
export function loadCantonsPer(): Promise<CantonPer[]> {
  // La démo (un seul fichier HTML) embarque les données ; l'appli les charge depuis public/data/.
  const embarque = (globalThis as { __PI_CANTONS__?: { cantons: CantonPer[] } }).__PI_CANTONS__;
  if (embarque) return (cache ??= Promise.resolve(embarque.cantons));
  cache ??= fetch("/data/cantons.json").then((r) => (r.ok ? r.json() : [])).then((j) => (Array.isArray(j) ? j : j.cantons ?? [])).catch(() => []);
  return cache;
}
