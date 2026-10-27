/// <reference path="../pb_data/types.d.ts" />
// Répétition espacée : une unité validée revient en révision juste avant d'être oubliée.

migrate((app) => {
  const p = app.findCollectionByNameOrId("progressions");
  // Prochaine révision (AAAA-MM-JJ, Europe/Zurich) ; vide tant que l'unité n'est pas validée.
  p.fields.add(new TextField({ name: "revision_le", max: 10, pattern: "^(\\d{4}-\\d{2}-\\d{2})?$" }));
  // Intervalle en jours (1, 3, 7, 14, 30, 60, 120) et nombre de révisions faites.
  p.fields.add(new NumberField({ name: "intervalle", onlyInt: true }));
  p.fields.add(new NumberField({ name: "nb_revisions", onlyInt: true }));
  p.indexes.push("CREATE INDEX idx_progressions_revision ON progressions (utilisateur, revision_le)");
  app.save(p);

  // Unités déjà validées : première révision demain.
  const { zurichDate, addDays } = require(`${__hooks}/lib/zurich.js`);
  const demain = addDays(zurichDate(Date.now()), 1);
  for (const r of app.findRecordsByFilter("progressions", "valide = true", "", 0, 0)) {
    r.set("revision_le", demain);
    r.set("intervalle", 1);
    app.save(r);
  }
}, (app) => {
  const p = app.findCollectionByNameOrId("progressions");
  for (const f of ["revision_le", "intervalle", "nb_revisions"]) p.fields.removeByName(f);
  p.indexes = p.indexes.filter((i) => i.indexOf("idx_progressions_revision") < 0);
  app.save(p);
});
