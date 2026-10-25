/**
 * Plan d'études romand (PER) : objectifs officiels et rattachement des exercices.
 *
 * Source : Plan d'études romand, © CIIP. Le texte officiel est extrait de l'API publique du PER
 * (data/per/, voir data/per-kit/PROMPT-PER.md) et n'est jamais modifié. Les rattachements des types
 * d'exercices sont dans lib/per-generateurs.json ; scripts/build-per-content.mjs les vérifie contre le
 * texte officiel et produit lib/per-liens.json et lib/per-objectifs.json.
 */
import LIENS from "./per-liens.json";
import OBJECTIFS from "./per-objectifs.json";

export interface ObjectifPer { axe: string; titre: string; discipline: string; cycle: number; source_url: string }
export interface LienPer {
  discipline: string;
  codes: string[];
  /** Clés des progressions officielles (collection per_notion). */
  cles: string[];
  annees: number[];
  /** « 9e-11e », ou « secondaire II » pour un contenu hors PER. */
  annee: string;
  /** Contenu du secondaire II (hors PER), réservé au parcours Prépa EPFL. */
  secondaire_II?: string;
  liens: { code: string; notion: string; plage: string; cles: string[] }[];
}

export const OBJECTIFS_PER = OBJECTIFS as Record<string, ObjectifPer>;
export const PER_PAR_GENERATEUR = LIENS as Record<string, LienPer>;
export const TAG_SECONDAIRE_II = "secondaire_II";
export const SLUG_PREPA = "prepa-epfl";

/** Ce que l'app affiche d'une unité : ses codes PER, son année, ou « hors PER ». */
export interface PerUnite { codes: string[]; annee: string; horsPer: boolean; note?: string }

type UniteLike = { id_generateur: string; per_codes?: string[] | null; annee?: string; tag?: string };

/** Champs PER d'une unité : ceux de la fiche si présents, sinon ceux de son type d'exercices. */
export function perPourUnite(u: UniteLike, parcoursUnits: UniteLike[] = []): PerUnite {
  const l = PER_PAR_GENERATEUR[u.id_generateur];
  const horsPer = u.tag === TAG_SECONDAIRE_II || (!u.tag && !!l?.secondaire_II && !l.codes.length);
  if (u.per_codes?.length) return { codes: u.per_codes, annee: u.annee || l?.annee || "", horsPer, note: l?.secondaire_II };
  if (u.id_generateur === "final") {
    const ls = parcoursUnits.filter((x) => x.id_generateur !== "final").map((x) => PER_PAR_GENERATEUR[x.id_generateur]).filter(Boolean);
    const codes = [...new Set(ls.flatMap((x) => x.codes))].sort();
    return { codes, annee: u.annee || "", horsPer: !codes.length && ls.some((x) => x.secondaire_II) };
  }
  return { codes: l?.codes ?? [], annee: u.annee || l?.annee || "", horsPer, note: l?.secondaire_II };
}

/** Code PER et année portés par chaque question générée. */
export function perExercice(idGenerateur: string): { per_code: string | null; annee: string } {
  const l = PER_PAR_GENERATEUR[idGenerateur];
  if (!l) throw new Error(`Type d'exercices sans rattachement PER : ${idGenerateur} (lib/per-generateurs.json)`);
  return { per_code: l.codes[0] ?? null, annee: l.annee };
}

/** Pas d'exercice sans code PER ni année, sauf le secondaire II (hors PER, Prépa EPFL). */
export function exerciceValide(q: { per_code?: string | null; annee?: string; tag?: string }, idGenerateur?: string): boolean {
  if (idGenerateur && PER_PAR_GENERATEUR[idGenerateur]?.secondaire_II && !q.per_code) return true;
  return !!q.per_code && !!q.annee;
}

/** « MSN 32 · Nombres » : pastille d'un objectif. */
export const pastille = (code: string) => (OBJECTIFS_PER[code] ? `${code} · ${OBJECTIFS_PER[code].axe}` : code);
