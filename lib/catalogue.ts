import { PLANS, cantonByCode } from "./cantons";
import type { Matiere, Parcours } from "./api";

/** Le parcours suit-il le plan d'études du canton ? (libre = toute la Suisse) */
export function fitsCanton(p: Parcours, canton?: string): boolean {
  const c = cantonByCode(canton);
  if (p.cantons?.length && canton && !p.cantons.includes(canton)) return false;
  if (!c || !p.plan || p.plan === "libre") return true;
  return c.plans.includes(p.plan);
}

/** Le parcours est-il réservé à d'autres cantons ? Dans ce cas on ne le montre pas. */
export function hiddenForCanton(p: Parcours, canton?: string): boolean {
  return !!(p.cantons?.length && canton && !p.cantons.includes(canton));
}

export function anneesLabel(p: Parcours): string {
  if (!p.annee_min) return "";
  return p.annee_max && p.annee_max !== p.annee_min ? `${p.annee_min}e–${p.annee_max}e` : `${p.annee_min}e`;
}

export function planLabel(p: Parcours): string {
  return PLANS[(p.plan || "libre") as keyof typeof PLANS].court;
}

/** Regroupe par matière ; dans chaque matière, les parcours du plan du canton d'abord. */
export function groupByMatiere(list: Parcours[], matieres: Matiere[], canton?: string) {
  const groups = matieres.map((m) => ({ matiere: m as Matiere | null, items: list.filter((p) => p.matiere === m.id) }));
  const orphans = list.filter((p) => !matieres.some((m) => m.id === p.matiere));
  if (orphans.length) groups.push({ matiere: null, items: orphans });
  return groups
    .filter((g) => g.items.length)
    .map((g) => ({ ...g, items: [...g.items].sort((a, b) => Number(fitsCanton(b, canton)) - Number(fitsCanton(a, canton)) || a.ordre - b.ordre) }));
}
