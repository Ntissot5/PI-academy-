// Lecture des rattachements PER (lib/per-generateurs.json + lib/per-generateurs/*.json) et résolution
// de chaque lien vers les progressions officielles de data/per/per_notions.json.
import fs from "node:fs";
import path from "node:path";

export function lireRattachements(root) {
  const base = JSON.parse(fs.readFileSync(path.join(root, "lib/per-generateurs.json"), "utf8"));
  const generateurs = { ...base.generateurs };
  const enClasse = [...(base.en_classe ?? [])];
  const dir = path.join(root, "lib/per-generateurs");
  const origine = {};
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort() : []) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    for (const [id, m] of Object.entries(j.generateurs ?? {})) {
      if (generateurs[id]) throw new Error(`Rattachement en double pour ${id} (${f} et ${origine[id] ?? "per-generateurs.json"})`);
      generateurs[id] = m;
      origine[id] = f;
    }
    for (const e of j.en_classe ?? []) enClasse.push({ ...e, lot: f });
  }
  return { generateurs, enClasse };
}

export function lireLecons(root) {
  const out = {};
  const one = path.join(root, "pocketbase/seed/lecons.json");
  if (fs.existsSync(one)) Object.assign(out, JSON.parse(fs.readFileSync(one, "utf8")).lecons);
  const dir = path.join(root, "pocketbase/seed/lecons");
  for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort() : []) {
    Object.assign(out, JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")).lecons ?? {});
  }
  return out;
}

/** Clés des progressions officielles qui correspondent à un lien ; [] si aucune. */
export function resoudreLien(notions, l) {
  return notions
    .filter((n) => n.code === l.code && n.notion === l.notion && n.plage === l.plage && n.contenu.some((c) => c.includes(l.cherche)))
    .map((n) => n.cle);
}

/** Notions « en classe » : non exerçables par une correction automatique (texte à rédiger, oral, expérience…). */
export function verifierEnClasse(notions, enClasse) {
  const erreurs = [];
  for (const e of enClasse) {
    if (!e.raison) erreurs.push(`en_classe sans raison : ${e.code} « ${e.notion} »`);
    if (!notions.some((n) => n.code === e.code && n.notion === e.notion && (!e.discipline || n.discipline === e.discipline))) {
      erreurs.push(`en_classe : notion introuvable ${e.discipline ?? ""} ${e.code} « ${e.notion} »`);
    }
  }
  return erreurs;
}
