/// <reference path="../pb_data/types.d.ts" />
// Phase 2 : un prof peut retirer un élève de ses classes (suppression du compte, LPD).

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  users.deleteRule = 'id = @request.auth.id || (role = "eleve" && classe.prof = @request.auth.id)';
  app.save(users);
  const classes = app.findCollectionByNameOrId("classes");
  classes.indexes = classes.indexes.concat(["CREATE INDEX idx_classes_prof ON classes (prof)"]);
  app.save(classes);
}, (app) => {
  const users = app.findCollectionByNameOrId("users");
  users.deleteRule = "id = @request.auth.id";
  app.save(users);
  const classes = app.findCollectionByNameOrId("classes");
  classes.indexes = classes.indexes.filter((i) => !i.includes("idx_classes_prof"));
  app.save(classes);
});
