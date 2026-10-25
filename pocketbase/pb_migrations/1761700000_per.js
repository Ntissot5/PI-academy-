/// <reference path="../pb_data/types.d.ts" />
// Référentiel PER : collection per_notion (une ligne par progression officielle) et rattachement des unités.
// Le contenu est inséré par 1761700001_per_contenu.js (généré).

migrate((app) => {
  const perNotion = new Collection({
    type: "base",
    name: "per_notion",
    // Texte officiel public (Plan d'études romand, © CIIP) : lisible par tous, modifiable par personne via l'API.
    listRule: "",
    viewRule: "",
    createRule: null,
    updateRule: null,
    deleteRule: null,
    fields: [
      { name: "cle", type: "text", required: true, pattern: "^[0-9a-f]{12}$" },
      { name: "code", type: "text", required: true, max: 20 },
      { name: "discipline", type: "text", required: true, max: 40 },
      { name: "cycle", type: "number", onlyInt: true },
      { name: "annee_debut", type: "number", onlyInt: true },
      { name: "annee_fin", type: "number", onlyInt: true },
      { name: "notion", type: "text", max: 400 },
      { name: "contenu", type: "json", maxSize: 20000 },
      { name: "niveau", type: "text", max: 80 },
      { name: "source_url", type: "url" },
      { name: "ordre", type: "number", onlyInt: true },
    ],
    indexes: [
      "CREATE UNIQUE INDEX idx_per_notion_cle ON per_notion (cle)",
      "CREATE INDEX idx_per_notion_code ON per_notion (code, annee_debut)",
    ],
  });
  app.save(perNotion);

  const unites = app.findCollectionByNameOrId("unites");
  // Une notion PER sans exercice reste visible (« Bientôt ») : elle n'a pas de générateur.
  unites.fields.getByName("id_generateur").required = false;
  unites.fields.add(new SelectField({ name: "statut", maxSelect: 1, values: ["actif", "bientot"] }));
  // Codes d'objectifs (["MSN 32"]) et clés per_notion (["a1b2c3d4e5f6"]) visés par l'unité.
  unites.fields.add(new JSONField({ name: "per_codes", maxSize: 2000 }));
  unites.fields.add(new JSONField({ name: "per_notions", maxSize: 20000 }));
  // Année Harmos (« 9e », « 10e-11e ») ou « secondaire II ».
  unites.fields.add(new TextField({ name: "annee", max: 20 }));
  // secondaire_II : hors PER, réservé au parcours Prépa EPFL.
  unites.fields.add(new TextField({ name: "tag", max: 20 }));
  app.save(unites);

  const parcours = app.findCollectionByNameOrId("parcours");
  // Parcours créé automatiquement depuis le PER (un par année et par discipline).
  parcours.fields.add(new BoolField({ name: "auto" }));
  app.save(parcours);
}, (app) => {
  const unites = app.findCollectionByNameOrId("unites");
  for (const f of ["statut", "per_codes", "per_notions", "annee", "tag"]) unites.fields.removeByName(f);
  unites.fields.getByName("id_generateur").required = true;
  app.save(unites);
  const parcours = app.findCollectionByNameOrId("parcours");
  parcours.fields.removeByName("auto");
  app.save(parcours);
  app.delete(app.findCollectionByNameOrId("per_notion"));
});
