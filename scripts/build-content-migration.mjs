#!/usr/bin/env node
// Génère pocketbase/pb_migrations/1761600000_contenu.js à partir de pocketbase/seed/parcours.json :
// au premier démarrage d'un PocketBase vide (Dokploy, Docker), matières, parcours et unités sont créés
// sans aucune commande. Ne touche jamais à un parcours ou une matière qui existe déjà.
//   node scripts/build-content-migration.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const data = JSON.parse(await readFile(root + "pocketbase/seed/parcours.json", "utf8"));

const body = `/// <reference path="../pb_data/types.d.ts" />
// Contenu de départ, généré par scripts/build-content-migration.mjs depuis pocketbase/seed/parcours.json.
// Ne pas modifier à la main : modifier le JSON puis relancer le script.

const DATA = ${JSON.stringify(data)};

migrate((app) => {
  const exists = (col, slug) => {
    try { return app.findFirstRecordByFilter(col, "slug = {:s}", { s: slug }); } catch (_) { return null; }
  };
  const matCol = app.findCollectionByNameOrId("matieres");
  const matiereId = {};
  for (const m of DATA.matieres || []) {
    let rec = exists("matieres", m.slug);
    if (!rec) {
      rec = new Record(matCol);
      for (const k of Object.keys(m)) rec.set(k, m[k]);
      app.save(rec);
    }
    matiereId[m.slug] = rec.id;
  }
  const pCol = app.findCollectionByNameOrId("parcours");
  const uCol = app.findCollectionByNameOrId("unites");
  for (const p of DATA.parcours) {
    if (exists("parcours", p.slug)) continue;
    const rec = new Record(pCol);
    for (const k of Object.keys(p)) {
      if (k === "unites") continue;
      rec.set(k, k === "matiere" ? (matiereId[p.matiere] || "") : p[k]);
    }
    app.save(rec);
    for (const u of p.unites) {
      const ur = new Record(uCol);
      for (const k of Object.keys(u)) ur.set(k, u[k]);
      ur.set("parcours", rec.id);
      app.save(ur);
    }
  }
}, (app) => {
  // Retour arrière : on ne supprime pas le contenu (il a pu être retouché dans l'admin).
});
`;
await writeFile(root + "pocketbase/pb_migrations/1761600000_contenu.js", body);
console.log(`Migration de contenu : ${data.matieres?.length ?? 0} matières, ${data.parcours.length} parcours.`);
