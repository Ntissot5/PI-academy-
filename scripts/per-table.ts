// Génère docs/PER-correspondance.md : le tableau de relecture des unités face au Plan d'études romand.
//   node --experimental-strip-types scripts/per-table.ts
import { readFileSync, writeFileSync } from "node:fs";
import { OBJECTIFS_PER, perPourUnite } from "../lib/per.ts";

const data = JSON.parse(readFileSync(new URL("../pocketbase/seed/parcours.json", import.meta.url), "utf8"));
const PLAN: Record<string, string> = { per: "Plan d’études romand", lp21: "Lehrplan 21", pds: "Tessin", libre: "Toute la Suisse" };
const esc = (s: string) => String(s ?? "").replace(/\|/g, "\\|");

let md = `# Correspondance avec le Plan d’études romand (PER)

Ce tableau dit, pour chaque unité de Pi Academy, quels objectifs du **PER, cycle 3 (9e–11e)** elle vise.

**À relire par un·e enseignant·e.** Les codes ont été établis sans accès au site officiel (plandetudes.ch), à partir de la structure connue du PER et des documents cantonaux de Genève et de Fribourg. Pour chaque ligne, coche **OK** ou écris la correction dans « Commentaire ».

Les exercices de Pi Academy sont créés par la plateforme : ils suivent les objectifs du PER, mais ne reprennent pas les exercices des moyens d’enseignement romands (protégés par le droit d’auteur).

## Les objectifs utilisés

| Code | Discipline / axe | Intitulé (à vérifier) |
|---|---|---|
${Object.values(OBJECTIFS_PER).map((o) => `| ${o.code} | ${o.axe} | ${esc(o.titre)} |`).join("\n")}

`;

for (const p of data.parcours) {
  md += `## ${p.titre}\n\n${PLAN[p.plan] ?? "Toute la Suisse"}${p.annee_min ? ` · ${p.annee_min}e${p.annee_max && p.annee_max !== p.annee_min ? `–${p.annee_max}e` : ""} Harmos` : ""}${p.public === "adulte" ? " · adultes" : ""}\n\n`;
  md += `| # | Unité | Objectifs PER proposés | Années | Remarque | OK ? | Commentaire |\n|---|---|---|---|---|---|---|\n`;
  for (const u of p.unites) {
    const c = perPourUnite(u.id_generateur, p.unites);
    const codes = c.horsPer ? "Hors PER (secondaire II)" : c.objectifs.join(", ") || "—";
    md += `| ${u.ordre} | ${esc(u.titre)} | ${codes} | ${c.annees ?? ""} | ${esc(c.note ?? "")} | ☐ | |\n`;
  }
  md += "\n";
}

md += `## Questions pour la relecture

1. Les codes et intitulés ci-dessus correspondent-ils au PER en vigueur ?
2. Les années indiquées (9e, 10e, 11e) correspondent-elles à la progression de ton canton ?
3. Le parcours « 9e Harmos · Bases » contient les équations du 1er degré : sont-elles vues en 9e chez toi, ou plutôt en 10e ?
4. La citoyenneté est-elle bien rattachée à SHS 34 ?
5. Y a-t-il des notions importantes du PER qui manquent pour la 9e, la 10e ou la 11e ?
`;
writeFileSync(new URL("../docs/PER-correspondance.md", import.meta.url), md);
console.log("docs/PER-correspondance.md :", data.parcours.reduce((n: number, p: { unites: unknown[] }) => n + p.unites.length, 0), "unités");
