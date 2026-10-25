// Règles PER des unités (écran admin, seed) : voir docs/COUVERTURE-PER.md.
const PREPA = "prepa-epfl";

function liste(rec, champ) {
  const v = rec.get(champ);
  if (!v) return [];
  try { const a = JSON.parse(String(v)); return Array.isArray(a) ? a : []; } catch (_) { return Array.isArray(v) ? v : []; }
}

/** Pas d'exercice sans code PER ni année ; le secondaire II n'existe que dans la Prépa EPFL. */
function checkUnitePer(app, u) {
  const gen = u.getString("id_generateur");
  const bientot = u.getString("statut") === "bientot";
  if (!gen && !bientot) throw new BadRequestError("Choisis un type d'exercices, ou marque la leçon « Bientôt ».");
  if (bientot && gen) throw new BadRequestError("Une leçon « Bientôt » n'a pas encore d'exercices : retire le type d'exercices.");
  const secII = u.getString("tag") === "secondaire_II";
  if (secII) {
    let slug = "";
    try { slug = app.findRecordById("parcours", u.getString("parcours")).getString("slug"); } catch (_) { slug = ""; }
    if (slug !== PREPA) throw new BadRequestError("Les exercices du secondaire II (hors PER) vont seulement dans la Prépa EPFL.");
    return;
  }
  if (!liste(u, "per_codes").length) throw new BadRequestError("Il manque le code PER (ex. MSN 32).");
  if (!u.getString("annee")) throw new BadRequestError("Il manque l'année (ex. 9e ou 10e-11e).");
}

module.exports = { checkUnitePer };
