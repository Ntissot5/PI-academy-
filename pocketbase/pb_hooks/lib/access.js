// Qui peut ouvrir quel parcours.
function canOpenParcours(app, auth, parcours) {
  const role = auth.getString("role");
  if (role === "admin" || role === "adulte" || role === "prof") return true;
  if (role === "eleve") {
    const classeId = auth.getString("classe");
    if (!classeId) return false;
    const classe = app.findRecordById("classes", classeId);
    return classe.getStringSlice("parcours_assignes").indexOf(parcours.id) >= 0;
  }
  return false;
}

/** Garde uniquement <sup> et <sub> sans attributs : l'énoncé vient du client et sera affiché au prof. */
function cleanStatement(s) {
  return String(s || "")
    .slice(0, 600)
    .replace(/<(?!\/?(sup|sub)>)[^>]*>/gi, "")
    .replace(/<(?=[^>]*$)/g, "");
}

function cleanShort(s) {
  return String(s == null ? "" : s).replace(/[<>]/g, "").slice(0, 60);
}

module.exports = { canOpenParcours, cleanStatement, cleanShort };
