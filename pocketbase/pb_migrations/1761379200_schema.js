/// <reference path="../pb_data/types.d.ts" />
// Schéma de Pi Academy. Toutes les écritures de progression passent par les routes
// de pb_hooks (createRule/updateRule = null) : le client ne peut que lire ses données.

migrate((app) => {
  const users = app.findCollectionByNameOrId("users");

  // Lecture : soi-même, ses élèves (prof), tout (admin).
  const OWN_OR_PROF = 'utilisateur = @request.auth.id || utilisateur.classe.prof = @request.auth.id || @request.auth.role = "admin"';

  /* ---------- parcours ---------- */
  const parcours = new Collection({
    type: "base",
    name: "parcours",
    listRule: "",
    viewRule: "",
    createRule: '@request.auth.role = "admin"',
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
    fields: [
      { name: "slug", type: "text", required: true, pattern: "^[a-z0-9-]+$", max: 60 },
      { name: "titre", type: "text", required: true, max: 120 },
      { name: "accroche", type: "text", max: 160 },
      { name: "description", type: "text", max: 400 },
      { name: "public", type: "select", required: true, maxSelect: 1, values: ["ecole", "adulte"] },
      { name: "niveau", type: "text", max: 60 },
      { name: "icone", type: "text", max: 40 },
      { name: "ordre", type: "number", onlyInt: true },
      { name: "payant", type: "bool" },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_parcours_slug ON parcours (slug)"],
  });
  app.save(parcours);

  /* ---------- unités ---------- */
  const unites = new Collection({
    type: "base",
    name: "unites",
    listRule: "",
    viewRule: "",
    createRule: '@request.auth.role = "admin"',
    updateRule: '@request.auth.role = "admin"',
    deleteRule: '@request.auth.role = "admin"',
    fields: [
      { name: "parcours", type: "relation", required: true, collectionId: parcours.id, maxSelect: 1, cascadeDelete: true },
      { name: "ordre", type: "number", onlyInt: true },
      { name: "id_generateur", type: "text", required: true, max: 40 },
      { name: "titre", type: "text", required: true, max: 120 },
      { name: "sous_titre", type: "text", max: 160 },
      { name: "regle", type: "text", max: 2000 },
      { name: "exemple", type: "text", max: 400 },
      { name: "image", type: "text", max: 1000 },
      { name: "piege", type: "text", max: 1000 },
      { name: "icone", type: "text", max: 40 },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: ["CREATE INDEX idx_unites_parcours ON unites (parcours, ordre)"],
  });
  app.save(unites);

  /* ---------- classes ---------- */
  const classes = new Collection({
    type: "base",
    name: "classes",
    // listRule/viewRule/createRule posées plus bas, une fois users.classe et users.role créés.
    listRule: "prof = @request.auth.id",
    viewRule: "prof = @request.auth.id",
    createRule: null,
    updateRule: 'prof = @request.auth.id && (@request.body.prof:isset = false || @request.body.prof = @request.auth.id) && @request.body.code:isset = false',
    deleteRule: "prof = @request.auth.id",
    fields: [
      { name: "prof", type: "relation", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
      { name: "nom", type: "text", required: true, max: 60 },
      { name: "code", type: "text", pattern: "^[A-Z0-9]{6}$", max: 6 },
      { name: "parcours_assignes", type: "relation", collectionId: parcours.id, maxSelect: 50 },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_classes_code ON classes (code)"],
  });
  app.save(classes);

  /* ---------- utilisateurs (collection auth "users") ---------- */
  // Les élèves n'ont pas d'e-mail : leur mot de passe PocketBase est leur PIN (haché en bcrypt).
  // Comme la seule identité acceptée par la connexion standard est l'e-mail, un élève ne peut
  // se connecter que par la route /api/pi/eleve/connexion (5 essais, puis blocage 10 min).
  users.fields.getByName("email").required = false;
  users.fields.getByName("password").min = 4;
  users.fields.add(new SelectField({ name: "role", required: true, maxSelect: 1, values: ["eleve", "prof", "adulte", "admin"] }));
  users.fields.add(new TextField({ name: "pseudo", max: 24 }));
  users.fields.add(new RelationField({ name: "classe", collectionId: classes.id, maxSelect: 1, cascadeDelete: true }));
  users.fields.add(new SelectField({ name: "theme", maxSelect: 1, values: ["clair", "sombre"] }));
  users.fields.add(new NumberField({ name: "xp", onlyInt: true }));
  users.fields.add(new NumberField({ name: "pin_echecs", onlyInt: true, hidden: true }));
  users.fields.add(new DateField({ name: "pin_bloque_jusqua", hidden: true }));
  users.indexes = users.indexes.concat([
    "CREATE UNIQUE INDEX idx_users_pseudo_classe ON users (classe, pseudo COLLATE NOCASE) WHERE classe != ''",
  ]);
  const LOCKED = ["role", "xp", "classe", "pseudo", "pin_echecs", "pin_bloque_jusqua"];
  users.listRule = 'id = @request.auth.id || (role = "eleve" && classe.prof = @request.auth.id) || @request.auth.role = "admin"';
  users.viewRule = users.listRule;
  // Inscription libre : adulte ou prof seulement. Les élèves passent par /api/pi/eleve/rejoindre.
  users.createRule = '(@request.body.role = "adulte" || @request.body.role = "prof") && ' +
    LOCKED.filter((f) => f !== "role").map((f) => `@request.body.${f}:isset = false`).join(" && ");
  users.updateRule = "id = @request.auth.id && " + LOCKED.map((f) => `@request.body.${f}:isset = false`).join(" && ");
  users.deleteRule = "id = @request.auth.id";
  app.save(users);

  classes.listRule = 'prof = @request.auth.id || id = @request.auth.classe || @request.auth.role = "admin"';
  classes.viewRule = classes.listRule;
  classes.createRule = '@request.auth.role = "prof" && @request.body.prof = @request.auth.id';
  app.save(classes);

  /* ---------- progression ---------- */
  const progressions = new Collection({
    type: "base",
    name: "progressions",
    listRule: OWN_OR_PROF,
    viewRule: OWN_OR_PROF,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "utilisateur", type: "relation", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
      { name: "unite", type: "relation", required: true, collectionId: unites.id, maxSelect: 1, cascadeDelete: true },
      { name: "meilleur_entrainement", type: "number", onlyInt: true },
      { name: "meilleur_boss", type: "number", onlyInt: true },
      { name: "nb_entrainements", type: "number", onlyInt: true },
      { name: "nb_boss", type: "number", onlyInt: true },
      { name: "boss_rates", type: "number", onlyInt: true },
      { name: "valide", type: "bool" },
      { name: "lecon_lue", type: "bool" },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_progressions_user_unite ON progressions (utilisateur, unite)"],
  });
  app.save(progressions);

  /* ---------- sessions (une par série) ---------- */
  const sessions = new Collection({
    type: "base",
    name: "sessions",
    listRule: OWN_OR_PROF,
    viewRule: OWN_OR_PROF,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "utilisateur", type: "relation", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
      { name: "serie", type: "text", required: true, max: 40 },
      { name: "unite", type: "relation", collectionId: unites.id, maxSelect: 1, cascadeDelete: false },
      { name: "mode", type: "select", maxSelect: 1, values: ["entrainement", "boss"] },
      // Jour calendaire Europe/Zurich, calculé par le serveur (AAAA-MM-JJ).
      { name: "date", type: "text", required: true, pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      { name: "minutes", type: "number" },
      { name: "xp_gagne", type: "number", onlyInt: true },
      { name: "bonnes", type: "number", onlyInt: true },
      { name: "total", type: "number", onlyInt: true },
      { name: "terminee", type: "bool" },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_sessions_user_serie ON sessions (utilisateur, serie)",
      "CREATE INDEX idx_sessions_user_date ON sessions (utilisateur, date)",
    ],
  });
  app.save(sessions);

  /* ---------- erreurs ---------- */
  const erreurs = new Collection({
    type: "base",
    name: "erreurs",
    listRule: OWN_OR_PROF,
    viewRule: OWN_OR_PROF,
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "utilisateur", type: "relation", required: true, collectionId: users.id, maxSelect: 1, cascadeDelete: true },
      { name: "unite", type: "relation", collectionId: unites.id, maxSelect: 1, cascadeDelete: true },
      { name: "enonce", type: "text", max: 600 },
      { name: "reponse_donnee", type: "text", max: 60 },
      { name: "bonne_reponse", type: "text", max: 60 },
      { name: "date", type: "text", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
      { name: "created", type: "autodate", onCreate: true },
    ],
    indexes: ["CREATE INDEX idx_erreurs_user ON erreurs (utilisateur, created)"],
  });
  app.save(erreurs);
}, (app) => {
  for (const name of ["erreurs", "sessions", "progressions"]) app.delete(app.findCollectionByNameOrId(name));
  const users = app.findCollectionByNameOrId("users");
  for (const f of ["role", "pseudo", "classe", "theme", "xp", "pin_echecs", "pin_bloque_jusqua"]) users.fields.removeByName(f);
  users.indexes = users.indexes.filter((i) => !i.includes("idx_users_pseudo_classe"));
  users.fields.getByName("email").required = true;
  users.fields.getByName("password").min = 8;
  app.save(users);
  for (const name of ["classes", "unites", "parcours"]) app.delete(app.findCollectionByNameOrId(name));
});
