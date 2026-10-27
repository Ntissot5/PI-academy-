#!/usr/bin/env node
// Étape 3 : relie les exercices au PER et prépare le contenu par année.
//   node scripts/per-programme.mjs        (d'abord, si data/per/ a changé)
//   node scripts/build-per-content.mjs
// Produit :
//  - lib/per-liens.json : pour chaque type d'exercices, codes PER, clés des progressions (per_notion), années ;
//  - pocketbase/seed/parcours.json : champs per_codes / per_notions / annee / tag des unités existantes ;
//  - pocketbase/seed/parcours-per.json : un parcours par année et par discipline (une leçon par notion PER) ;
//  - pocketbase/pb_migrations/1761700001_per_contenu.js : per_notion + parcours par année, au premier démarrage.
// Échoue si un lien de lib/per-generateurs.json ne retrouve aucune progression officielle.
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { lireLecons, lireRattachements, resoudreLien, verifierEnClasse } from "./lib/per-resolve.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const read = (p) => JSON.parse(fs.readFileSync(root + p, "utf8"));
const notions = read("data/per/per_notions.json");
const programme = read("data/per/programme_par_annee.json");
const { generateurs: mapping, enClasse } = lireRattachements(root);
const seedPath = "pocketbase/seed/parcours.json";
const seed = read(seedPath);

export const lab = (n) => (n === 1 ? "1re" : `${n}e`);
const range = (a, b) => (a === b ? lab(a) : `${lab(a)}-${lab(b)}`);
const anneesDe = (plage) => {
  const m = plage.match(/\d+/g)?.map(Number) ?? [];
  if (!m.length) return [];
  const [a, b = a] = m;
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
};
const uniq = (xs) => [...new Set(xs)];

/* ---------- 1. Liens exercices → progressions officielles ---------- */

const erreurs = [];
const liens = {};
for (const [id, m] of Object.entries(mapping)) {
  const ls = m.liens.map((l) => {
    const cles = resoudreLien(notions, l);
    if (!cles.length) erreurs.push(`${id} : aucune progression pour ${l.code} « ${l.notion} » ${l.plage} « ${l.cherche} »`);
    return { code: l.code, notion: l.notion, plage: l.plage, cles };
  });
  const ans = m.annees
    ? anneesDe(`${m.annees[0]}-${m.annees[1]}`)
    : uniq(ls.flatMap((l) => anneesDe(l.plage))).sort((a, b) => a - b);
  liens[id] = {
    discipline: m.discipline,
    codes: uniq(ls.map((l) => l.code)),
    cles: uniq(ls.flatMap((l) => l.cles)),
    annees: ans,
    annee: ans.length ? range(ans[0], ans[ans.length - 1]) : "secondaire II",
    ...(m.secondaire_II && { secondaire_II: m.secondaire_II }),
    liens: ls,
  };
}
erreurs.push(...verifierEnClasse(notions, enClasse));
const estEnClasse = (discipline, code, notion) => enClasse.some((e) => e.code === code && e.notion === notion && (!e.discipline || e.discipline === discipline));
if (erreurs.length) {
  console.error(erreurs.join("\n"));
  process.exit(1);
}
fs.writeFileSync(root + "lib/per-liens.json", JSON.stringify(liens, null, 1) + "\n");

// Titres officiels des objectifs (pastilles « MSN 32 · Nombres » dans l'app).
const objectifs = {};
for (const a of programme.annees) for (const d of a.disciplines) for (const o of d.objectifs) {
  objectifs[o.code] ??= { axe: o.axe, titre: o.titre, discipline: d.discipline, cycle: o.cycle, source_url: o.source_url };
}
fs.writeFileSync(root + "lib/per-objectifs.json", JSON.stringify(objectifs, null, 1) + "\n");

/** Champs PER d'une unité, d'après son générateur ; l'examen final reprend ceux des autres unités du parcours. */
function champsPer(idGen, freres, annee) {
  if (idGen === "final") {
    const ls = freres.filter((u) => u.id_generateur !== "final").map((u) => liens[u.id_generateur]).filter(Boolean);
    const ans = uniq(ls.flatMap((l) => l.annees)).sort((a, b) => a - b);
    return {
      per_codes: uniq(ls.flatMap((l) => l.codes)).sort(),
      per_notions: uniq(ls.flatMap((l) => l.cles)),
      annee: annee ?? (ans.length ? range(ans[0], ans[ans.length - 1]) : "secondaire II"),
      tag: ls.length && ls.every((l) => l.secondaire_II) ? "secondaire_II" : "",
    };
  }
  const l = liens[idGen];
  if (!l) throw new Error(`Générateur sans rattachement PER : ${idGen} (ajoute-le dans lib/per-generateurs.json)`);
  return { per_codes: l.codes, per_notions: l.cles, annee: annee ?? l.annee, tag: l.secondaire_II ? "secondaire_II" : "" };
}

/* ---------- 2. Unités existantes ---------- */

for (const p of seed.parcours) {
  for (const u of p.unites) Object.assign(u, champsPer(u.id_generateur, p.unites));
  const tagged = p.unites.filter((u) => u.tag === "secondaire_II").map((u) => u.id_generateur);
  if (tagged.length && p.slug !== "prepa-epfl") throw new Error(`Exercices secondaire II hors Prépa EPFL (${p.slug}) : ${tagged.join(", ")}`);
}
fs.writeFileSync(root + seedPath, JSON.stringify(seed, null, 2) + "\n");

/* ---------- 3. Un parcours par année et par discipline ---------- */

const MATIERE = {
  "Mathématiques": "mathematiques", "Sciences de la nature": "sciences", "Français": "francais", "Allemand": "allemand",
  "Anglais": "anglais", "Géographie": "geographie", "Histoire": "histoire", "Citoyenneté": "citoyennete",
};
const COURT = { "Mathématiques": "Maths", "Sciences de la nature": "Sciences" };
const matIcone = Object.fromEntries(seed.matieres.map((m) => [m.slug, m.icone]));
// Texte de leçon d'un exercice : celui de sa première unité dans parcours.json.
const lecon = {};
for (const p of seed.parcours) for (const u of p.unites) lecon[u.id_generateur] ??= u;
for (const [id, l] of Object.entries(lireLecons(root))) lecon[id] ??= l;

for (const [id, l] of Object.entries(liens)) {
  if (!l.secondaire_II && !lecon[id]?.regle) {
    console.error(`${id} : pas de leçon (règle, exemple, image, piège) dans pocketbase/seed/lecons/*.json`);
    process.exit(1);
  }
}

/** Libellé court d'une notion pour l'élève : dernier niveau, sans les renvois « ( 1 , 5 ) ». */
const libelle = (notion, o) => {
  const t = (notion === "INTROUVABLE" ? "" : notion || "").split(" › ").pop().replace(/\s*\(\s*[\d\s,]+\)\s*$/, "").trim();
  return t || o.axe || o.titre;
};
const couper = (s, n) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");

const parcoursPer = [];
for (const a of programme.annees) {
  const n = anneesDe(a.annee)[0];
  for (const d of a.disciplines) {
    const ici = Object.entries(liens).filter(([, l]) => l.discipline === d.discipline && !l.secondaire_II && l.annees.includes(n));
    const unites = [];
    const places = new Set();
    const couvert = new Set(ici.flatMap(([, l]) => l.liens.filter((y) => anneesDe(y.plage).includes(n)).map((y) => `${y.code}|${y.notion}`)));
    for (const o of d.objectifs) {
      const groupes = [];
      for (const x of o.notions) {
        // Objectif sans intitulé de notion dans le tableau officiel : "" (comme dans les rattachements).
        const nn = x.notion === "INTROUVABLE" ? "" : x.notion;
        let g = groupes.find((y) => y.notion === nn);
        if (!g) groupes.push((g = { notion: nn, cles: [] }));
        g.cles.push(x.cle);
      }
      for (const g of groupes) {
        const titre = couper(libelle(g.notion, o), 120);
        // Exercices placés ici : le premier de leurs liens qui couvre cette année tombe sur cette notion.
        const gens = ici.filter(([id, l]) => {
          if (places.has(id)) return false;
          const premier = l.liens.find((y) => anneesDe(y.plage).includes(n));
          return premier && premier.code === o.code && premier.notion === g.notion;
        });
        const sous = couper(`${o.code} · ${titre === (o.axe || "") ? o.titre : o.axe || o.titre}`, 160);
        // Notion travaillée par un exercice placé sous une autre notion de l'année : pas de leçon « Bientôt » en double.
        if (!gens.length && couvert.has(`${o.code}|${g.notion}`)) continue;
        if (!gens.length) {
          // « en_classe » : notion travaillée en classe (rédaction, oral, expérience…), pas d'exercice automatique prévu.
          const tag = estEnClasse(d.discipline, o.code, g.notion) ? "en_classe" : "";
          unites.push({ id_generateur: "", statut: "bientot", titre, sous_titre: sous, icone: "lock", per_codes: [o.code], per_notions: uniq(g.cles), annee: lab(n), tag });
          continue;
        }
        for (const [id, l] of gens) {
          places.add(id);
          const s = lecon[id] ?? {};
          const cles = uniq(l.liens.filter((y) => anneesDe(y.plage).includes(n)).flatMap((y) => y.cles));
          unites.push({
            id_generateur: id, statut: "actif", titre: s.titre ?? titre, sous_titre: couper(`${o.code} · ${titre}`, 160),
            regle: s.regle ?? "", exemple: s.exemple ?? "", image: s.image ?? "", piege: s.piege ?? "", icone: s.icone ?? "",
            per_codes: uniq(l.liens.filter((y) => anneesDe(y.plage).includes(n)).map((y) => y.code)), per_notions: cles, annee: lab(n), tag: "",
          });
        }
      }
    }
    const actives = unites.filter((u) => u.statut === "actif");
    if (actives.length >= 2) {
      unites.push({ id_generateur: "final", statut: "actif", titre: "Examen final", sous_titre: `Tout le programme travaillé en ${lab(n)}`, icone: "star",
        per_codes: uniq(actives.flatMap((u) => u.per_codes)).sort(), per_notions: uniq(actives.flatMap((u) => u.per_notions)), annee: lab(n), tag: "" });
    }
    unites.forEach((u, i) => (u.ordre = i + 1));
    const slugMat = MATIERE[d.discipline];
    const nbNotions = unites.filter((u) => u.id_generateur !== "final").length;
    parcoursPer.push({
      slug: `${slugMat}-${lab(n)}`,
      titre: `${COURT[d.discipline] ?? d.discipline} ${lab(n)}`,
      accroche: `Le programme officiel de ${lab(n)} année`,
      description: `${nbNotions} notions du Plan d’études romand. ${actives.filter((u) => u.id_generateur !== "final").length} ont déjà leurs exercices${unites.some((u) => u.tag === "en_classe") ? ", d’autres se travaillent en classe" : ""}${unites.some((u) => u.statut === "bientot" && u.tag !== "en_classe") ? ", les autres arrivent bientôt" : ""}.`,
      public: "ecole", niveau: `${lab(n)} Harmos`, icone: matIcone[slugMat] ?? "star", ordre: 100 + n, payant: false,
      matiere: slugMat, plan: "per", annee_min: n, annee_max: n, cantons: [], statut: "a_valider", auto: true,
      unites,
    });
  }
}
fs.writeFileSync(root + "pocketbase/seed/parcours-per.json", JSON.stringify({ parcours: parcoursPer }, null, 1) + "\n");

/* ---------- 4. Migration de contenu ---------- */

const body = `/// <reference path="../pb_data/types.d.ts" />
// Contenu PER, généré par scripts/build-per-content.mjs (ne pas modifier à la main).
// Source : Plan d'études romand, © CIIP — texte officiel recopié tel quel (data/per/).
// 1. per_notion : une ligne par progression officielle (clé stable « cle »).
// 2. Unités existantes : champs per_codes / per_notions / annee / tag, d'après leur type d'exercices.
// 3. Un parcours par année et par discipline. Ne touche jamais à un parcours qui existe déjà.

const NOTIONS = ${JSON.stringify(notions.map(({ plage, ...n }) => n))};
const LIENS = ${JSON.stringify(Object.fromEntries(Object.entries(liens).map(([k, l]) => [k, { codes: l.codes, cles: l.cles, annees: l.annees, annee: l.annee, tag: l.secondaire_II ? "secondaire_II" : "" }])))};
const PARCOURS = ${JSON.stringify(parcoursPer)};

migrate((app) => {
  const nCol = app.findCollectionByNameOrId("per_notion");
  for (const n of NOTIONS) {
    try { app.findFirstRecordByFilter("per_notion", "cle = {:c}", { c: n.cle }); continue; } catch (_) { /* nouvelle */ }
    const r = new Record(nCol);
    for (const k of Object.keys(n)) r.set(k, n[k]);
    app.save(r);
  }

  const vide = (u) => { const raw = u.getString("per_codes"); return !raw || raw === "null" || raw === "[]"; };
  const parParcours = {};
  for (const u of app.findRecordsByFilter("unites", "id != ''", "", 0, 0)) {
    if (!vide(u)) continue;
    const g = u.getString("id_generateur");
    if (g === "final") { (parParcours[u.getString("parcours")] = parParcours[u.getString("parcours")] || []).push(u); continue; }
    const l = LIENS[g];
    if (!l) continue;
    u.set("per_codes", l.codes); u.set("per_notions", l.cles); u.set("annee", l.annee); u.set("tag", l.tag); u.set("statut", "actif");
    app.save(u);
  }
  for (const pid of Object.keys(parParcours)) {
    const freres = app.findRecordsByFilter("unites", "parcours = {:p} && id_generateur != 'final'", "", 0, 0, { p: pid })
      .map((u) => LIENS[u.getString("id_generateur")]).filter(Boolean);
    const codes = [...new Set(freres.flatMap((l) => l.codes))].sort();
    const cles = [...new Set(freres.flatMap((l) => l.cles))];
    const ans = freres.flatMap((l) => l.annees).sort((a, b) => a - b);
    const lab = (n) => (n === 1 ? "1re" : n + "e");
    const annee = !ans.length ? "secondaire II" : ans[0] === ans[ans.length - 1] ? lab(ans[0]) : lab(ans[0]) + "-" + lab(ans[ans.length - 1]);
    for (const u of parParcours[pid]) {
      u.set("per_codes", codes); u.set("per_notions", cles); u.set("annee", annee); u.set("statut", "actif");
      app.save(u);
    }
  }

  const matiereId = {};
  for (const m of app.findRecordsByFilter("matieres", "1 = 1", "", 0, 0)) matiereId[m.getString("slug")] = m.id;
  const pCol = app.findCollectionByNameOrId("parcours");
  const uCol = app.findCollectionByNameOrId("unites");
  // Clé d'une leçon d'un parcours par année : son type d'exercices, ou sa première notion PER si « Bientôt ».
  const cleU = (gen, notions) => gen || "bientot:" + ((notions && notions[0]) || "");
  for (const p of PARCOURS) {
    let exist = null;
    try { exist = app.findFirstRecordByFilter("parcours", "slug = {:s}", { s: p.slug }); } catch (_) { /* nouveau */ }
    if (exist) {
      // Parcours déjà créé : on ajoute les nouveaux exercices, on remet l'ordre du PER, on retire les « Bientôt »
      // devenus inutiles. Les textes retouchés dans l'admin et la progression des élèves sont gardés.
      if (!exist.getBool("auto")) continue;
      const deja = {};
      for (const u of app.findRecordsByFilter("unites", "parcours = {:p}", "", 0, 0, { p: exist.id })) {
        let ns = [];
        try { ns = JSON.parse(u.getString("per_notions") || "[]"); } catch (_) { ns = []; }
        deja[cleU(u.getString("id_generateur"), ns)] = u;
      }
      const vus = {};
      for (const u of p.unites) {
        const k = cleU(u.id_generateur, u.per_notions);
        vus[k] = true;
        let ur = deja[k];
        if (!ur) { ur = new Record(uCol); for (const f of Object.keys(u)) ur.set(f, u[f]); ur.set("parcours", exist.id); }
        else { ur.set("ordre", u.ordre); ur.set("per_codes", u.per_codes); ur.set("per_notions", u.per_notions); ur.set("annee", u.annee); if (!u.id_generateur) ur.set("tag", u.tag); }
        app.save(ur);
      }
      for (const k of Object.keys(deja)) if (!vus[k] && k.indexOf("bientot:") === 0) app.delete(deja[k]);
      continue;
    }
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
  // Retour arrière : on garde le contenu (il a pu être retouché dans l'admin).
});
`;
// Une base déjà en ligne a appliqué 1761700001 : après un ajout de contenu, --nouvelle-migration écrit un nouveau
// fichier (même logique, synchronise les parcours existants) au lieu de réécrire celui-là.
const nom = process.argv.includes("--nouvelle-migration") ? `${Math.floor(Date.now() / 1000)}_per_contenu.js` : "1761700001_per_contenu.js";
fs.writeFileSync(root + "pocketbase/pb_migrations/" + nom, body);
console.log(`Migration : pocketbase/pb_migrations/${nom}`);

const nU = parcoursPer.reduce((s, p) => s + p.unites.length, 0);
const nA = parcoursPer.reduce((s, p) => s + p.unites.filter((u) => u.statut === "actif").length, 0);
console.log(`Liens : ${Object.keys(liens).length} types d'exercices. Parcours par année : ${parcoursPer.length}, ${nU} leçons dont ${nA} avec exercices.`);
