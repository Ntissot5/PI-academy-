#!/usr/bin/env node
// Étape 4 : docs/COUVERTURE-PER.md — combien de notions PER ont déjà des exercices, par année et par discipline.
//   node scripts/per-couverture.mjs
// Une « notion » = un objectif + une notion du tableau officiel (ex. MSN 32 › Calculs), pour une année donnée.
// Elle est couverte si au moins un type d'exercices (hors secondaire II) y est rattaché pour cette année.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { lireRattachements } from "./lib/per-resolve.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const programme = JSON.parse(fs.readFileSync(root + "data/per/programme_par_annee.json", "utf8"));
const liens = JSON.parse(fs.readFileSync(root + "lib/per-liens.json", "utf8"));
const { enClasse } = lireRattachements(root);
const estEnClasse = (discipline, code, notion) => enClasse.some((e) => e.code === code && e.notion === notion && (!e.discipline || e.discipline === discipline));
const ORDRE = ["Mathématiques", "Sciences de la nature", "Français", "Allemand", "Anglais", "Géographie", "Histoire", "Citoyenneté"];
const lab = (n) => (n === 1 ? "1re" : `${n}e`);
const anneesDe = (p) => { const m = p.match(/\d+/g)?.map(Number) ?? []; if (!m.length) return []; const [a, b = a] = m; return Array.from({ length: b - a + 1 }, (_, i) => a + i); };

// (code|notion|année) → types d'exercices
const couvre = new Map();
for (const [id, l] of Object.entries(liens)) {
  if (l.secondaire_II) continue; // réservé à la Prépa EPFL, absent des parcours par année
  for (const y of l.liens) for (const n of anneesDe(y.plage)) {
    if (l.annees.length && !l.annees.includes(n)) continue;
    const k = `${y.code}|${y.notion}|${n}`;
    couvre.set(k, [...(couvre.get(k) ?? []), id]);
  }
}

const tableau = {}; // discipline → année → { total, couvert }
const manque = new Map(); // code|notion → { code, notion, discipline, annees:[], progressions }
for (const a of programme.annees) {
  const n = anneesDe(a.annee)[0];
  for (const d of a.disciplines) {
    for (const o of d.objectifs) {
      const groupes = new Map();
      // Objectif sans intitulé de notion dans le tableau officiel : "" (comme dans les rattachements).
      for (const x of o.notions) { const nn = x.notion === "INTROUVABLE" ? "" : x.notion; groupes.set(nn, (groupes.get(nn) ?? 0) + 1); }
      for (const [notion, nb] of groupes) {
        const t = ((tableau[d.discipline] ??= {})[n] ??= { total: 0, couvert: 0, classe: 0 });
        t.total++;
        if (couvre.has(`${o.code}|${notion}|${n}`)) { t.couvert++; continue; }
        if (estEnClasse(d.discipline, o.code, notion)) { t.classe++; continue; }
        const k = `${d.discipline}|${o.code}|${notion}`;
        const m = manque.get(k) ?? { code: o.code, notion, discipline: d.discipline, axe: o.axe, annees: [], progressions: 0 };
        m.annees.push(n);
        m.progressions += nb;
        manque.set(k, m);
      }
    }
  }
}

// Priorité : MSN 32/33/34 et L1 en 9e–11e, puis le reste du cycle 3, puis le cycle 2, puis le cycle 1.
const prio = (m) => {
  const c3 = m.annees.some((n) => n >= 9), c2 = m.annees.some((n) => n >= 5 && n <= 8);
  // Dans le premier groupe : maths, puis fonctionnement de la langue (L1 36, le plus facile à exercer), puis le reste du L1.
  const sous = ["MSN 32", "MSN 33", "MSN 34"].includes(m.code) ? 0 : m.code === "L1 36" ? 0.3 : m.code.startsWith("L1 ") ? 0.6 : null;
  return c3 && sous !== null ? sous : c3 ? 1 : c2 ? 2 : 3;
};
const top = [...manque.values()]
  .filter((m) => !/^Éléments pour la résolution|^$/.test(m.notion) || m.progressions > 1)
  .sort((a, b) => prio(a) - prio(b) || b.progressions - a.progressions || a.code.localeCompare(b.code, "fr", { numeric: true }))
  .slice(0, 20);

// Pourcentage sur les notions exerçables (hors notions travaillées en classe).
const pct = (t) => (t.total - t.classe ? Math.round((100 * t.couvert) / (t.total - t.classe)) : 100);
const cell = (t) => `${t.couvert} / ${t.total - t.classe} (${pct(t)} %)${t.classe ? ` · ${t.classe} en classe` : ""}`;
const fmtAns = (ans) => { const s = [...new Set(ans)].sort((a, b) => a - b); return s.length > 1 && s[s.length - 1] - s[0] === s.length - 1 ? `${lab(s[0])}-${lab(s[s.length - 1])}` : s.map(lab).join(", "); };
const libelle = (notion, m) => (notion && notion !== "INTROUVABLE" ? notion : m.axe);

let md = `# Couverture du PER par les exercices

Généré par \`node scripts/per-couverture.mjs\` à partir de \`data/per/programme_par_annee.json\` (PER extrait le ${programme.extrait_le.slice(0, 10)}) et de \`lib/per-generateurs.json\`. Ne pas modifier à la main.

Une **notion** = un objectif et une notion du tableau officiel (ex. MSN 32 › Calculs), pour une année. Elle est **couverte** quand au moins un type d’exercices y est rattaché pour cette année (hors secondaire II). Les notions non couvertes apparaissent dans l’app comme leçons « Bientôt ».

Source : Plan d’études romand, © CIIP.

## Par année et par discipline

Notions couvertes / notions exerçables (pourcentage) · notions travaillées en classe (rédaction, oral, expérience, débat : pas d’exercice corrigé automatiquement, voir la liste en bas).

| Année | ${ORDRE.join(" | ")} | Total |
|---|${ORDRE.map(() => "---:").join("|")}|---:|
`;
const tot = { total: 0, couvert: 0, classe: 0 };
for (let n = 1; n <= 11; n++) {
  const ligne = { total: 0, couvert: 0, classe: 0 };
  const cells = ORDRE.map((d) => {
    const t = tableau[d]?.[n];
    if (!t) return "—";
    ligne.total += t.total; ligne.couvert += t.couvert; ligne.classe += t.classe;
    return cell(t);
  });
  tot.total += ligne.total; tot.couvert += ligne.couvert; tot.classe += ligne.classe;
  md += `| ${lab(n)} | ${cells.join(" | ")} | ${cell(ligne)} |\n`;
}
md += `| **Total** | ${ORDRE.map((d) => {
  const t = Object.values(tableau[d] ?? {}).reduce((s, x) => ({ total: s.total + x.total, couvert: s.couvert + x.couvert, classe: s.classe + x.classe }), { total: 0, couvert: 0, classe: 0 });
  return cell(t);
}).join(" | ")} | **${cell(tot)}** |

L’allemand commence en 5e, l’anglais en 7e et la citoyenneté en 5e : les cases « — » sont normales.

## Les 20 notions prioritaires sans exercice

Ordre : MSN 32/33/34, puis Français (L1 36 fonctionnement de la langue, puis les autres L1) en 9e–11e, puis le reste du cycle 3, puis le cycle 2, puis le cycle 1 ; à priorité égale, la notion la plus fournie dans le PER d’abord.

| # | Code | Notion | Discipline | Années | Progressions PER |
|---:|---|---|---|---|---:|
${top.map((m, i) => `| ${i + 1} | ${m.code} | ${libelle(m.notion, m).replace(/\|/g, "/")} | ${m.discipline} | ${fmtAns(m.annees)} | ${m.progressions} |`).join("\n")}

## Rattachement des exercices (à relire)

Les maths reprennent \`data/per-kit/mapping_generateurs_PER.json\` ; les autres disciplines ont été rattachées d’après le texte officiel et doivent être relues par un·e enseignant·e (parcours marqués « Bêta »).

| Exercice | Code | Notion du PER | Plage | Années de placement |
|---|---|---|---|---|
${Object.entries(liens).flatMap(([id, l]) => l.liens.map((y, i) => `| ${i ? "" : `\`${id}\``} | ${y.code} | ${(y.notion || "—").replace(/\|/g, "/")} | ${y.plage} | ${i ? "" : l.annee} |`)).join("\n")}

## Notions travaillées en classe

${enClasse.length ? enClasse.map((e) => `- ${e.code} · ${e.notion || "(objectif entier)"} — ${e.raison}`).join("\n") : "Aucune pour l’instant."}

## Exercices hors PER

${Object.entries(liens).filter(([, l]) => l.secondaire_II).map(([id, l]) => `- \`${id}\` : ${l.secondaire_II}`).join("\n")}

Ces exercices portent le tag \`secondaire_II\` et n’apparaissent que dans le parcours Prépa EPFL.
`;
fs.writeFileSync(root + "docs/COUVERTURE-PER.md", md);
console.log(`Couverture : ${tot.couvert} / ${tot.total - tot.classe} notions exerçables (${pct(tot)} %), ${tot.classe} en classe, ${tot.total} au total. Écrit docs/COUVERTURE-PER.md`);
