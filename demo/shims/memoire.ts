/**
 * Même calcul que pocketbase/pb_hooks/lib/memoire.js (série avec gels, intervalles de révision),
 * pour la démo dans le navigateur. tests/unit/memoire.test.ts vérifie que les deux donnent le même résultat.
 */
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const JOURS_PAR_GEL = 7, GELS_MAX = 2;

export function serieAvecGels(minutesParJour: Record<string, number>, today: string) {
  const dates = Object.keys(minutesParJour).filter((d) => minutesParJour[d] > 0 && d <= today).sort();
  if (!dates.length) return { streak: 0, gels: 0, geles: [] as string[] };
  let streak = 0, gels = 0, depuisGel = 0;
  let geles: string[] = [];
  for (let d = dates[0]; d <= today; d = addDays(d, 1)) {
    if (minutesParJour[d] > 0) {
      streak++;
      depuisGel++;
      if (depuisGel >= JOURS_PAR_GEL) { depuisGel = 0; if (gels < GELS_MAX) gels++; }
    } else if (d === today) break;
    else if (gels > 0) { gels--; geles.push(d); }
    else { streak = 0; depuisGel = 0; geles = []; }
  }
  return { streak, gels, geles };
}

export const INTERVALLES = [1, 3, 7, 14, 30, 60, 120];
export function prochainIntervalle(intervalle: number, reussi: boolean) {
  if (!reussi) return INTERVALLES[0];
  const i = INTERVALLES.indexOf(intervalle);
  return INTERVALLES[Math.min(i < 0 ? 0 : i + 1, INTERVALLES.length - 1)];
}
