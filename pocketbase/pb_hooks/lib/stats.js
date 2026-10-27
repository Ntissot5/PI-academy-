// Série de jours, minutes du jour et calendrier 28 jours, calculés à partir des sessions.
const { zurichDate, addDays } = require(`${__hooks}/lib/zurich.js`);
const { serieAvecGels } = require(`${__hooks}/lib/memoire.js`);

const GOAL = 20;

function userStats(app, userId) {
  const today = zurichDate(Date.now());
  const rows = app.findRecordsByFilter("sessions", "utilisateur = {:u}", "", 0, 0, { u: userId });
  const days = {};
  let answered = 0;
  for (const r of rows) {
    const d = r.getString("date");
    days[d] = (days[d] || 0) + r.getFloat("minutes");
    answered += r.getInt("total");
  }
  // Comme le prototype, rien aujourd'hui ne casse pas la série ; un jour manqué consomme un gel s'il en reste.
  const serie = serieAvecGels(days, today);
  const cal = [];
  for (let i = 27; i >= 0; i--) {
    const k = addDays(today, -i);
    cal.push({ date: k, minutes: Math.round((days[k] || 0) * 10) / 10, gel: serie.geles.indexOf(k) >= 0 });
  }
  const user = app.findRecordById("users", userId);
  return {
    xp: user.getInt("xp"),
    streak: serie.streak,
    gels: serie.gels,
    today: today,
    minutesToday: Math.round(days[today] || 0),
    goal: GOAL,
    days: cal,
    answered: answered,
  };
}

module.exports = { userStats };
