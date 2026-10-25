#!/usr/bin/env node
// Remplit PocketBase avec les parcours de parcours.json et, avec --demo, les comptes de démo.
//
//   PB_URL=http://127.0.0.1:8090 PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node pocketbase/seed/seed.mjs [--demo] [--force] [fichier.json]
//
// Sans --force, un parcours ou une unité qui existe déjà n'est pas modifié(e) :
// les textes retouchés dans l'écran admin ne sont jamais écrasés par erreur.

import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const DEMO = args.includes("--demo");
const FORCE = args.includes("--force");
const file = args.find((a) => !a.startsWith("--")) ?? fileURLToPath(new URL("./parcours.json", import.meta.url));

const PB = (process.env.PB_URL || "http://127.0.0.1:8090").replace(/\/$/, "");
const EMAIL = process.env.PB_SUPERUSER_EMAIL;
const PASSWORD = process.env.PB_SUPERUSER_PASSWORD;
if (!EMAIL || !PASSWORD) {
  console.error("Il faut PB_SUPERUSER_EMAIL et PB_SUPERUSER_PASSWORD.");
  process.exit(1);
}

let token = "";
async function api(method, path, body) {
  const res = await fetch(PB + path, {
    method,
    headers: { "Content-Type": "application/json", ...(token && { Authorization: token }) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json)}`);
  return json;
}
const q = (s) => encodeURIComponent(s);
async function first(col, filter) {
  const r = await api("GET", `/api/collections/${col}/records?perPage=1&filter=${q(filter)}`);
  return r.items[0] ?? null;
}

token = (await api("POST", "/api/collections/_superusers/auth-with-password", { identity: EMAIL, password: PASSWORD })).token;

const data = JSON.parse(await readFile(file, "utf8"));

// Matières : référencées par leur slug dans les parcours.
const matiereId = {};
for (const m of data.matieres ?? []) {
  let rec = await first("matieres", `slug = "${m.slug}"`);
  if (!rec) rec = await api("POST", "/api/collections/matieres/records", m);
  else if (FORCE) rec = await api("PATCH", `/api/collections/matieres/records/${rec.id}`, m);
  matiereId[m.slug] = rec.id;
}
const empty = (v) => v === "" || v == null || v === 0 || (Array.isArray(v) && v.length === 0);

const bySlug = {};
for (const { unites, ...raw } of data.parcours) {
  const p = { ...raw };
  if (p.matiere) {
    p.matiere = matiereId[p.matiere] ?? (await first("matieres", `slug = "${p.matiere}"`))?.id ?? "";
  }
  let rec = await first("parcours", `slug = "${p.slug}"`);
  if (!rec) rec = await api("POST", "/api/collections/parcours/records", p);
  else if (FORCE) rec = await api("PATCH", `/api/collections/parcours/records/${rec.id}`, p);
  else {
    // Sans --force : on ne remplit que les champs encore vides (ex. nouveaux champs après une migration).
    const fill = Object.fromEntries(Object.entries(p).filter(([k, v]) => empty(rec[k]) && !empty(v)));
    if (Object.keys(fill).length) rec = await api("PATCH", `/api/collections/parcours/records/${rec.id}`, fill);
  }
  bySlug[p.slug] = rec;
  let created = 0;
  for (const u of unites) {
    const existing = await first("unites", `parcours = "${rec.id}" && ordre = ${u.ordre}`);
    if (!existing) { await api("POST", "/api/collections/unites/records", { ...u, parcours: rec.id }); created++; }
    else if (FORCE) await api("PATCH", `/api/collections/unites/records/${existing.id}`, { ...u, parcours: rec.id });
  }
  console.log(`Parcours « ${p.titre} » : ${unites.length} unités (${created} créées).`);
}

if (DEMO) {
  // Comptes de démo, marqués « démo » partout. Aucune donnée réelle.
  const PROF = { email: "prof.demo@example.ch", password: "demo-prof-2026", name: "Prof démo", role: "prof" };
  const ADULTE = { email: "adulte.demo@example.ch", password: "demo-adulte-2026", name: "Adulte démo", role: "adulte" };
  for (const u of [PROF, ADULTE]) {
    if (!(await first("users", `email = "${u.email}"`))) {
      await api("POST", "/api/collections/users/records", { ...u, passwordConfirm: u.password, verified: true, emailVisibility: false });
    }
  }
  const prof = await first("users", `email = "${PROF.email}"`);
  let classe = await first("classes", `prof = "${prof.id}" && nom = "Classe démo 9e"`);
  if (!classe) {
    classe = await api("POST", "/api/collections/classes/records", {
      prof: prof.id, nom: "Classe démo 9e", parcours_assignes: [bySlug["9e-bases"]?.id].filter(Boolean),
    });
  }
  // Un peu d'activité fictive, pour que le tableau du prof montre les 4 niveaux et des élèves « bloqués ».
  const units = bySlug["9e-bases"]
    ? (await api("GET", `/api/collections/unites/records?sort=ordre&perPage=50&filter=${q(`parcours = "${bySlug["9e-bases"].id}"`)}`)).items
    : [];
  const day = (off) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(new Date(Date.now() - off * 864e5));
  const DEMO = {
    "Démo-Alex": { xp: 380, prog: [{ u: 0, lecon_lue: true, nb_entrainements: 2, meilleur_entrainement: 9, nb_boss: 1, meilleur_boss: 9, valide: true }, { u: 1, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 8 }, { u: 2, lecon_lue: true }], days: [0, 1, 2] },
    "Démo-Sam": { xp: 210, prog: [{ u: 0, lecon_lue: true, nb_entrainements: 3, meilleur_entrainement: 8, nb_boss: 2, meilleur_boss: 6, boss_rates: 2 }], days: [0, 3], errors: true },
    "Démo-Lou": { xp: 40, prog: [{ u: 0, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 4 }], days: [10] },
  };
  for (const [pseudo, d] of Object.entries(DEMO)) {
    if (await first("users", `classe = "${classe.id}" && pseudo = "${pseudo}"`)) continue;
    const u = await api("POST", "/api/collections/users/records", { role: "eleve", pseudo, classe: classe.id, password: "1234", passwordConfirm: "1234" });
    if (!units.length) continue;
    await api("PATCH", `/api/collections/users/records/${u.id}`, { xp: d.xp });
    for (const { u: i, ...p } of d.prog) await api("POST", "/api/collections/progressions/records", { ...p, utilisateur: u.id, unite: units[i].id });
    for (const [k, off] of d.days.entries()) {
      await api("POST", "/api/collections/sessions/records", { utilisateur: u.id, serie: `demo${u.id}${k}`, unite: units[0].id, mode: "entrainement", date: day(off), minutes: 14, total: 10, bonnes: 7, xp_gagne: 70, terminee: true });
    }
    if (d.errors) {
      for (const [enonce, rep, bonne] of [["−7 − (−3)", "−10", "−4"], ["12 + (−18)", "6", "−6"], ["−4 × (−5)", "−20", "20"]]) {
        await api("POST", "/api/collections/erreurs/records", { utilisateur: u.id, unite: units[0].id, enonce, reponse_donnee: rep, bonne_reponse: bonne, date: day(0) });
      }
    }
  }
  console.log(`Démo : ${PROF.email} / ${PROF.password} · ${ADULTE.email} / ${ADULTE.password}`);
  console.log(`Démo : classe « ${classe.nom} », code ${classe.code}, élèves Démo-Alex / Démo-Sam / Démo-Lou, PIN 1234.`);
}
