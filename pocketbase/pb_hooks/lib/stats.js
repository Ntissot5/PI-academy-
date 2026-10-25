// Série de jours, minutes du jour et calendrier 28 jours, calculés à partir des sessions.
const { zurichDate, addDays } = require(`${__hooks}/lib/zurich.js`);

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
  // Comme le prototype : si rien aujourd'hui, la série compte à partir d'hier.
  let d = today, streak = 0;
  if (!(days[d] > 0)) d = addDays(d, -1);
  while (days[d] > 0) { streak++; d = addDays(d, -1); }
  const cal = [];
  for (let i = 27; i >= 0; i--) {
    const k = addDays(today, -i);
    cal.push({ date: k, minutes: Math.round((days[k] || 0) * 10) / 10 });
  }
  const user = app.findRecordById("users", userId);
  return {
    xp: user.getInt("xp"),
    streak: streak,
    today: today,
    minutesToday: Math.round(days[today] || 0),
    goal: GOAL,
    days: cal,
    answered: answered,
  };
}

module.exports = { userStats };
