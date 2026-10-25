#!/usr/bin/env node
// Liste les notions PER d'un périmètre et leur état : couverte (exercice rattaché), en classe, ou À FAIRE.
//   node scripts/per-scope.mjs --codes "MSN 3" --annees 9-11 [--discipline Mathématiques] [--afaire]
// Une notion est couverte pour une année si un lien (code + notion + plage) d'un exercice couvre cette année.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { lireRattachements, resoudreLien } from "./lib/per-resolve.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const codes = arg("--codes", "").split(",").map((s) => s.trim()).filter(Boolean);
const [a0, a1 = a0] = arg("--annees", "1-11").split("-").map(Number);
const disc = arg("--discipline", "");
const seulAfaire = process.argv.includes("--afaire");

const programme = JSON.parse(fs.readFileSync(root + "data/per/programme_par_annee.json", "utf8"));
const notions = JSON.parse(fs.readFileSync(root + "data/per/per_notions.json", "utf8"));
const { generateurs, enClasse } = lireRattachements(root);
const anneesDe = (p) => { const m = p.match(/\d+/g)?.map(Number) ?? []; if (!m.length) return []; const [a, b = a] = m; return Array.from({ length: b - a + 1 }, (_, i) => a + i); };
const lab = (n) => (n === 1 ? "1re" : `${n}e`);

const couvre = new Map();
const casses = [];
for (const [id, m] of Object.entries(generateurs)) {
  if (m.secondaire_II) continue; // réservé à la Prépa EPFL, absent des parcours par année
  for (const l of m.liens) {
    if (!resoudreLien(notions, l).length) casses.push(`${id} → ${l.code} « ${l.notion} » ${l.plage} « ${l.cherche} »`);
    for (const n of anneesDe(l.plage)) {
      if (m.annees && (n < m.annees[0] || n > m.annees[1])) continue;
      const k = `${m.discipline}|${l.code}|${l.notion}|${n}`;
      couvre.set(k, [...(couvre.get(k) ?? []), id]);
    }
  }
}
const classe = (d, code, notion) => enClasse.find((e) => e.code === code && e.notion === notion && (!e.discipline || e.discipline === d));

const lignes = new Map(); // d|code|notion → { annees: {n: état} }
for (const a of programme.annees) {
  const n = anneesDe(a.annee)[0];
  if (n < a0 || n > a1) continue;
  for (const d of a.disciplines) {
    if (disc && d.discipline !== disc) continue;
    for (const o of d.objectifs) {
      if (codes.length && !codes.some((c) => o.code.startsWith(c))) continue;
      const vus = new Set();
      for (const x of o.notions) {
        const notion = x.notion === "INTROUVABLE" ? "" : x.notion;
        const raw = notions.find((y) => y.cle === x.cle)?.notion ?? notion;
        if (vus.has(raw)) continue;
        vus.add(raw);
        const k = `${d.discipline}|${o.code}|${raw}`;
        const L = lignes.get(k) ?? { d: d.discipline, code: o.code, notion: raw, annees: {} };
        const gens = couvre.get(`${d.discipline}|${o.code}|${raw}|${n}`);
        L.annees[n] = gens ? `✓ ${gens.join(",")}` : classe(d.discipline, o.code, raw) ? "en classe" : "À FAIRE";
        lignes.set(k, L);
      }
    }
  }
}

let afaire = 0, ok = 0, cl = 0;
for (const L of lignes.values()) {
  const etats = Object.entries(L.annees);
  const reste = etats.filter(([, e]) => e === "À FAIRE");
  afaire += reste.length; ok += etats.filter(([, e]) => e.startsWith("✓")).length; cl += etats.filter(([, e]) => e === "en classe").length;
  if (seulAfaire && !reste.length) continue;
  console.log(`${L.d} | ${L.code} | « ${L.notion} »`);
  for (const [n, e] of etats) if (!seulAfaire || e === "À FAIRE") console.log(`    ${lab(+n)} : ${e}`);
}
if (casses.length) console.log("\nLIENS CASSÉS :\n" + casses.join("\n"));
console.log(`\nRésumé : ${ok} couvertes, ${cl} en classe, ${afaire} À FAIRE (notion × année).`);
