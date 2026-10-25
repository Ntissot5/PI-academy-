/// <reference path="../pb_data/types.d.ts" />
// Phase 3 : plusieurs matières, plan d'études (PER, Lehrplan 21, Tessin), années Harmos, cantons.

migrate((app) => {
  const matieres = new Collection({
    type: "base",
    name: "matieres",
    listRule: "",
    viewRule: "",
    createRule: '@request.auth.role = "admin"',
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
    fields: [
      { name: "slug", type: "text", required: true, pattern: "^[a-z0-9-]+$", max: 40 },
      { name: "nom", type: "text", required: true, max: 60 },
      // Domaine du Plan d'études romand (Langues, MSN, SHS…)
      { name: "domaine", type: "text", max: 80 },
      { name: "icone", type: "text", max: 40 },
      { name: "ordre", type: "number", onlyInt: true },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_matieres_slug ON matieres (slug)"],
  });
  app.save(matieres);

  const parcours = app.findCollectionByNameOrId("parcours");
  parcours.fields.add(new RelationField({ name: "matiere", collectionId: matieres.id, maxSelect: 1 }));
  // libre = valable pour toute la Suisse (ex. Prépa EPFL, institutions fédérales)
  parcours.fields.add(new SelectField({ name: "plan", maxSelect: 1, values: ["libre", "per", "lp21", "pds"] }));
  parcours.fields.add(new NumberField({ name: "annee_min", onlyInt: true }));
  parcours.fields.add(new NumberField({ name: "annee_max", onlyInt: true }));
  // Codes de cantons (["VD","GE"]) ; vide = tous les cantons du plan.
  parcours.fields.add(new JSONField({ name: "cantons", maxSize: 2000 }));
  // a_valider : contenu à relire par un·e enseignant·e (badge dans le catalogue).
  parcours.fields.add(new SelectField({ name: "statut", maxSelect: 1, values: ["publie", "a_valider"] }));
  app.save(parcours);

  const users = app.findCollectionByNameOrId("users");
  users.fields.add(new TextField({ name: "canton", max: 2, pattern: "^([A-Z]{2})?$" }));
  app.save(users);

  const classes = app.findCollectionByNameOrId("classes");
  classes.fields.add(new TextField({ name: "canton", max: 2, pattern: "^([A-Z]{2})?$" }));
  app.save(classes);
}, (app) => {
  const parcours = app.findCollectionByNameOrId("parcours");
  for (const f of ["matiere", "plan", "annee_min", "annee_max", "cantons", "statut"]) parcours.fields.removeByName(f);
  app.save(parcours);
  for (const name of ["users", "classes"]) {
    const c = app.findCollectionByNameOrId(name);
    c.fields.removeByName("canton");
    app.save(c);
  }
  app.delete(app.findCollectionByNameOrId("matieres"));
});
