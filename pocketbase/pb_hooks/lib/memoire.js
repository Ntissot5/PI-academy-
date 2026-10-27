// Série de jours avec « gels », et calendrier de révision (répétition espacée).
// Fonctions pures, sans base de données : les mêmes calculs servent au serveur, à la démo et aux tests.

const { addDays } = require(`${typeof __hooks !== "undefined" ? __hooks : __dirname + "/.."}/lib/zurich.js`);

/** Une série de 7 jours rapporte un gel ; on en garde 2 au plus. Un gel couvre un jour manqué. */
const JOURS_PAR_GEL = 7;
const GELS_MAX = 2;

/**
 * Rejoue l'historique jour par jour. Un jour sans activité consomme un gel s'il en reste
 * (la série continue, sans compter ce jour) ; sinon la série repart à zéro.
 * Aujourd'hui sans activité ne casse rien : la journée n'est pas finie.
 * @param {Record<string, number>} minutesParJour  date (AAAA-MM-JJ) → minutes
 * @param {string} today
 * @returns {{ streak: number, gels: number, geles: string[] }}
 */
function serieAvecGels(minutesParJour, today) {
  const dates = Object.keys(minutesParJour).filter((d) => minutesParJour[d] > 0 && d <= today).sort();
  if (!dates.length) return { streak: 0, gels: 0, geles: [] };
  let streak = 0, gels = 0, depuisGel = 0;
  let geles = [];
  for (let d = dates[0]; d <= today; d = addDays(d, 1)) {
    if (minutesParJour[d] > 0) {
      streak++;
      depuisGel++;
      if (depuisGel >= JOURS_PAR_GEL) { depuisGel = 0; if (gels < GELS_MAX) gels++; }
    } else if (d === today) {
      break;
    } else if (gels > 0) {
      gels--;
      geles.push(d);
    } else {
      streak = 0;
      depuisGel = 0;
      geles = [];
    }
  }
  return { streak, gels, geles };
}

/** Intervalles de révision en jours : on revoit une unité juste avant de l'oublier. */
const INTERVALLES = [1, 3, 7, 14, 30, 60, 120];

/** Intervalle suivant après une révision : réussie → on espace ; ratée → on revoit demain. */
function prochainIntervalle(intervalle, reussi) {
  if (!reussi) return INTERVALLES[0];
  const i = INTERVALLES.indexOf(intervalle);
  return INTERVALLES[Math.min(i < 0 ? 0 : i + 1, INTERVALLES.length - 1)];
}

module.exports = { serieAvecGels, prochainIntervalle, INTERVALLES, JOURS_PAR_GEL, GELS_MAX };
