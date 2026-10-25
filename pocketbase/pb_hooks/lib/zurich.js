// Jour calendaire en Europe/Zurich, sans dépendre du fuseau du serveur ni du téléphone.
// Règle UE : heure d'été du dernier dimanche de mars 01:00 UTC au dernier dimanche d'octobre 01:00 UTC.
// CommonJS, partagé par les hooks PocketBase (goja) et les tests Vitest.

function lastSundayUtc(year, month) {
  const last = new Date(Date.UTC(year, month + 1, 0));
  return Date.UTC(year, month, last.getUTCDate() - last.getUTCDay(), 1, 0, 0);
}

function zurichOffsetHours(ms) {
  const y = new Date(ms).getUTCFullYear();
  return ms >= lastSundayUtc(y, 2) && ms < lastSundayUtc(y, 9) ? 2 : 1;
}

/** "AAAA-MM-JJ" à Zurich pour un instant donné (ms depuis l'epoch). */
function zurichDate(ms) {
  return new Date(ms + zurichOffsetHours(ms) * 3600000).toISOString().slice(0, 10);
}

/** Décale un jour "AAAA-MM-JJ" de n jours. */
function addDays(day, n) {
  const d = new Date(day + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

module.exports = { zurichDate, zurichOffsetHours, addDays };
