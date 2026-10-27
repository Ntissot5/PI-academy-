#!/usr/bin/env node
// Étape 5 : rassemble data/cantons/<canton>/canton.json (extraits des documents officiels de data/cantons/<canton>/pdf/)
// dans data/cantons/cantons.json, et le copie dans public/data/cantons.json pour l'app.
//   node scripts/build-cantons.mjs
// Contrôles : fichiers sources présents, codes PER connus (ou « INTROUVABLE »), années au format 1re…11e.
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const DIR = root + "data/cantons/";
const ORDRE = ["GE", "VD", "FR", "VS", "NE", "JU", "BE"];
const objectifs = JSON.parse(fs.readFileSync(root + "lib/per-objectifs.json", "utf8"));
const ANNEE = /^(1re|[2-9]e|1[01]e)(-(1re|[2-9]e|1[01]e))?$/;

const erreurs = [], avertissements = [];
const cantons = [];
for (const c of ORDRE) {
  const f = `${DIR}${c}/canton.json`;
  if (!fs.existsSync(f)) { avertissements.push(`${c} : pas de canton.json`); continue; }
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  if (j.canton !== c) erreurs.push(`${c} : champ canton = ${j.canton}`);
  for (const d of j.documents ?? []) if (d.fichier && !fs.existsSync(`${DIR}${c}/${d.fichier}`)) erreurs.push(`${c} : fichier absent ${d.fichier}`);
  for (const r of j.repartition_par_annee ?? []) {
    // Codes cantonaux hors PER, écrits tels quels dans le document (VD : MEP 31-34, option Mathématiques et physique).
    const cantonal = c === "VD" && /^MEP 3\d$/.test(r.code);
    if (r.code !== "INTROUVABLE" && !objectifs[r.code] && !cantonal) erreurs.push(`${c} : code PER inconnu « ${r.code} »`);
    if (r.annee !== "INTROUVABLE" && !ANNEE.test(r.annee)) erreurs.push(`${c} : année « ${r.annee} »`);
    if (r.document && !fs.existsSync(`${DIR}${c}/${r.document}`)) erreurs.push(`${c} : document absent ${r.document}`);
  }
  for (const g of j.grille_horaire ?? []) {
    if (g.annee !== "INTROUVABLE" && !ANNEE.test(g.annee)) erreurs.push(`${c} : grille, année « ${g.annee} »`);
  }
  const nI = (j.repartition_par_annee ?? []).filter((r) => r.code === "INTROUVABLE").length;
  if (nI) avertissements.push(`${c} : ${nI} ligne(s) de répartition sans code PER (texte cantonal non rattaché)`);
  cantons.push(j);
}
if (erreurs.length) { console.error(erreurs.join("\n")); process.exit(1); }

const out = { source: "Documents officiels des départements cantonaux de l'instruction publique (voir data/cantons/<canton>/sources.json)", genere_le: new Date().toISOString().slice(0, 10), cantons };
fs.writeFileSync(DIR + "cantons.json", JSON.stringify(out, null, 1) + "\n");
fs.mkdirSync(root + "public/data", { recursive: true });
fs.writeFileSync(root + "public/data/cantons.json", JSON.stringify(out));
for (const j of cantons) {
  console.log(`${j.canton} : ${j.documents?.length ?? 0} documents, ${j.grille_horaire?.length ?? 0} lignes de grille, ${j.repartition_par_annee?.length ?? 0} répartitions, ${j.evaluations?.length ?? 0} évaluations`);
}
if (avertissements.length) console.log(avertissements.join("\n"));
