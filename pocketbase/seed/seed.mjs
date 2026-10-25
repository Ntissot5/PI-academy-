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
const bySlug = {};
for (const { unites, ...p } of data.parcours) {
  let rec = await first("parcours", `slug = "${p.slug}"`);
  if (!rec) rec = await api("POST", "/api/collections/parcours/records", p);
  else if (FORCE) rec = await api("PATCH", `/api/collections/parcours/records/${rec.id}`, p);
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
  for (const pseudo of ["Démo-Alex", "Démo-Sam", "Démo-Lou"]) {
    if (!(await first("users", `classe = "${classe.id}" && pseudo = "${pseudo}"`))) {
      await api("POST", "/api/collections/users/records", { role: "eleve", pseudo, classe: classe.id, password: "1234", passwordConfirm: "1234" });
    }
  }
  console.log(`Démo : ${PROF.email} / ${PROF.password} · ${ADULTE.email} / ${ADULTE.password}`);
  console.log(`Démo : classe « ${classe.nom} », code ${classe.code}, élèves Démo-Alex / Démo-Sam / Démo-Lou, PIN 1234.`);
}
