// Élèves : rejoindre une classe et se connecter avec code de classe + pseudo + PIN.

const MAX_TRIES = 5;
const LOCK_MIN = 10;

function normCode(s) { return String(s || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, ""); }
function normPseudo(s) { return String(s || "").trim().replace(/\s+/g, " "); }

function findClasse(app, code) {
  if (code.length !== 6) return null;
  try { return app.findFirstRecordByFilter("classes", "code = {:c}", { c: code }); } catch (_) { return null; }
}

/** Pseudo comparé sans tenir compte des majuscules (la classe est petite, on filtre en JS). */
function findEleve(app, classeId, pseudo) {
  const low = pseudo.toLowerCase();
  const all = app.findRecordsByFilter("users", 'classe = {:c} && role = "eleve"', "", 0, 0, { c: classeId });
  for (const u of all) if (u.getString("pseudo").toLowerCase() === low) return u;
  return null;
}

/** Minutes de blocage restantes (0 si pas bloqué). */
function lockedMinutes(u) {
  const until = u.getDateTime("pin_bloque_jusqua");
  if (until.isZero()) return 0;
  const left = until.unix() * 1000 - Date.now();
  return left > 0 ? Math.ceil(left / 60000) : 0;
}

function iso(ms) { return new Date(ms).toISOString().replace("T", " "); }

module.exports = { MAX_TRIES, LOCK_MIN, normCode, normPseudo, findClasse, findEleve, lockedMinutes, iso };
