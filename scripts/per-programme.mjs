// Étape 2 : construit, à partir des 24 fichiers PER_<discipline>_cycle<n>.json :
//  - data/per/per_notions.json : une entrée par progression officielle, avec une clé stable (collection per_notion) ;
//  - data/per/programme_par_annee.json : le programme de chaque année, de la 1re à la 11e.
// Le texte officiel est repris tel quel ; seul le niveau « (Niv …) » est relevé à part, sans être retiré du texte.
// Usage : node scripts/per-programme.mjs
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DIR = path.resolve(import.meta.dirname, "../data/per");
const ORDRE = ["Mathématiques", "Sciences de la nature", "Français", "Allemand", "Anglais", "Géographie", "Histoire", "Citoyenneté"];
const lab = (n) => (n === 1 ? "1re" : `${n}e`);

/** "9e-11e" → [9, 10, 11] ; "1re" → [1]. */
export function anneesDe(plage) {
  const m = plage.match(/\d+/g);
  if (!m) return [];
  const [a, b = a] = m.map(Number);
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

/** Mentions « (Niv …) » du contenu, dans l'ordre, sans doublon. */
export function niveauDe(contenu) {
  const all = contenu.flatMap((c) => c.match(/\(Niv[^)]*\)/g) ?? []).map((s) => s.slice(1, -1));
  return [...new Set(all)].join(" ; ") || null;
}

/** Clé stable d'une progression : change seulement si le texte officiel change. */
export const cleDe = (discipline, code, notion, plage, contenu) =>
  crypto.createHash("sha1").update([discipline, code, notion, plage, ...contenu].join("\n")).digest("hex").slice(0, 12);

const fichiers = fs.readdirSync(DIR).filter((f) => /^PER_.+_cycle\d\.json$/.test(f));
const annees = Array.from({ length: 11 }, (_, i) => ({ annee: lab(i + 1), disciplines: [] }));
const disc = (a, nom) => {
  let d = a.disciplines.find((x) => x.discipline === nom);
  if (!d) a.disciplines.push((d = { discipline: nom, objectifs: [] }));
  return d;
};
const obj = (d, o, cycle) => {
  let x = d.objectifs.find((y) => y.code === o.code);
  if (!x) d.objectifs.push((x = { code: o.code, titre: o.titre, axe: o.axe, cycle, source_url: o.source, notions: [] }));
  return x;
};

const notions = [];
for (const f of fichiers.sort((a, b) => ORDRE.indexOf(JSON.parse(fs.readFileSync(path.join(DIR, a))).discipline) - ORDRE.indexOf(JSON.parse(fs.readFileSync(path.join(DIR, b))).discipline) || a.localeCompare(b))) {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  for (const o of j.objectifs) {
    for (const p of o.progressions) {
      const ans = anneesDe(p.annee);
      const cle = cleDe(j.discipline, o.code, p.notion, p.annee, p.contenu);
      // Deux progressions au texte identique (rare) gardent la même clé : on n'en garde qu'une.
      if (!notions.some((x) => x.cle === cle)) {
        notions.push({
          cle, code: o.code, discipline: j.discipline, cycle: j.cycle,
          annee_debut: ans[0] ?? null, annee_fin: ans[ans.length - 1] ?? null, plage: p.annee,
          notion: p.notion, contenu: p.contenu, niveau: niveauDe(p.contenu), source_url: o.source, ordre: notions.length,
        });
      }
      for (const n of ans) {
        const x = obj(disc(annees[n - 1], j.discipline), o, j.cycle);
        x.notions.push({ cle, notion: p.notion || "INTROUVABLE", plage: p.annee, niveau: niveauDe(p.contenu), contenu: p.contenu });
      }
    }
    for (const r of o.reperes_par_annee ?? []) {
      for (const n of anneesDe(r.annee)) {
        const x = obj(disc(annees[n - 1], j.discipline), o, j.cycle);
        (x.reperes_par_annee ??= []).push(r.texte);
      }
    }
  }
}

const num = (c) => c.replace(/\D+/g, " ").trim().split(" ").map(Number);
for (const a of annees) {
  a.disciplines.sort((x, y) => ORDRE.indexOf(x.discipline) - ORDRE.indexOf(y.discipline));
  for (const d of a.disciplines) d.objectifs.sort((x, y) => num(x.code)[0] - num(y.code)[0] || x.code.localeCompare(y.code));
}

const index = JSON.parse(fs.readFileSync(path.join(DIR, "index.json"), "utf8"));
const out = { source: "Plan d'études romand, © CIIP", extrait_le: index.extrait_le, annees };
fs.writeFileSync(path.join(DIR, "per_notions.json"), JSON.stringify(notions, null, 1));
console.log(`per_notions.json : ${notions.length} progressions`);
fs.writeFileSync(path.join(DIR, "programme_par_annee.json"), JSON.stringify(out, null, 2));
for (const a of annees) console.log(a.annee, a.disciplines.map((d) => `${d.discipline} ${d.objectifs.reduce((s, o) => s + o.notions.length, 0)}`).join(" · "));
