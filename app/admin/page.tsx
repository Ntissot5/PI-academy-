"use client";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { listMatieres, type Matiere, type Parcours } from "@/lib/api";
import { CANTONS, PLANS } from "@/lib/cantons";
import { DEFAULT_ICON, FINAL_ID, GENERATORS, GENERATOR_LABEL } from "@/lib/generators";
import { forgetEtat, useRequireAuth } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { pb } from "@/lib/pb";
import { PER_PAR_GENERATEUR, TAG_SECONDAIRE_II, perPourUnite } from "@/lib/per";

/** Champs PER d'une unité d'après son type d'exercices (l'examen final reprend ceux du parcours). */
function perAuto(id: string, freres: UniteRec[]): Pick<UniteRec, "per_codes" | "per_notions" | "annee" | "tag" | "statut"> {
  if (!id) return { statut: "bientot" };
  const l = PER_PAR_GENERATEUR[id];
  if (id === FINAL_ID) {
    const ls = freres.filter((u) => u.id_generateur && u.id_generateur !== FINAL_ID).map((u) => PER_PAR_GENERATEUR[u.id_generateur]).filter(Boolean);
    const per = perPourUnite({ id_generateur: id }, freres);
    const ans = ls.flatMap((x) => x.annees).sort((a, b) => a - b);
    const lab = (n: number) => (n === 1 ? "1re" : `${n}e`);
    return { statut: "actif", per_codes: per.codes, per_notions: [...new Set(ls.flatMap((x) => x.cles))], tag: "",
      annee: !ans.length ? "secondaire II" : ans[0] === ans[ans.length - 1] ? lab(ans[0]) : `${lab(ans[0])}-${lab(ans[ans.length - 1])}` };
  }
  return { statut: "actif", per_codes: l?.codes ?? [], per_notions: l?.cles ?? [], annee: l?.annee ?? "", tag: l?.secondaire_II ? TAG_SECONDAIRE_II : "" };
}

interface UniteRec {
  id: string; parcours: string; ordre: number; id_generateur: string; titre: string; sous_titre: string;
  regle: string; exemple: string; image: string; piege: string; icone: string;
  statut?: string; per_codes?: string[] | null; per_notions?: string[] | null; annee?: string; tag?: string;
}
type Sel = { kind: "parcours"; id: string } | { kind: "unite"; id: string } | null;

const ICONS = ["flower", "report", "molecule", "pin", "folder", "mail", "plane", "note", "eye", "cal31", "laptop", "star"];
const GEN_IDS = [...Object.keys(GENERATORS), FINAL_ID];
const UNIT_FIELDS = ["ordre", "id_generateur", "titre", "sous_titre", "regle", "exemple", "image", "piege", "icone", "statut", "per_codes", "per_notions", "annee", "tag"] as const;
const PARCOURS_FIELDS = ["slug", "titre", "accroche", "description", "public", "niveau", "icone", "ordre", "payant", "plan", "annee_min", "annee_max", "cantons", "statut", "auto"] as const;

/** Admin : éditer les textes des unités et l'ordre des parcours, importer/exporter en JSON. */
export default function Admin() {
  const ok = useRequireAuth();
  const { user, toast } = useApp();
  const router = useRouter();
  const [parcours, setParcours] = useState<Parcours[] | null>(null);
  const [unites, setUnites] = useState<UniteRec[]>([]);
  const [sel, setSel] = useState<Sel>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);

  useEffect(() => { if (ok && user && user.role !== "admin") router.replace("/"); }, [ok, user, router]);

  const load = useCallback(async () => {
    const [ps, us] = await Promise.all([
      pb().collection("parcours").getFullList<Parcours>({ sort: "ordre,created" }),
      pb().collection("unites").getFullList<UniteRec>({ sort: "ordre" }),
    ]);
    setParcours(ps);
    setUnites(us);
    setMatieres(await listMatieres().catch(() => []));
  }, []);
  useEffect(() => { if (ok && user?.role === "admin") load().catch(() => setParcours([])); }, [ok, user, load]);

  if (!parcours || user?.role !== "admin") return <Loading />;

  const move = async (i: number, d: -1 | 1) => {
    const list = [...parcours];
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    setParcours(list);
    await Promise.all(list.map((p, k) => (p.ordre !== k + 1 ? pb().collection("parcours").update(p.id, { ordre: k + 1 }) : null)));
    await load();
    toast("Ordre des parcours enregistré");
  };

  const selP = sel?.kind === "parcours" ? parcours.find((p) => p.id === sel.id) : undefined;
  const selU = sel?.kind === "unite" ? unites.find((u) => u.id === sel.id) : undefined;

  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">Admin</div>
          <h1>Contenu des parcours</h1>
          <p className="sub">Retouche la règle, l’exemple, l’image et le piège de chaque unité, ou l’ordre des parcours. Les élèves voient le changement au prochain chargement.</p>
        </div>
        <div className="guide">
          <div className="bubble">Choisis une unité à gauche. Phrases courtes, tutoiement, une analogie du quotidien.</div>
          <Pi className="bob pi-big" />
        </div>
      </div>

      <div className="admin-grid">
        <nav className="side admin-list" aria-label="Parcours et unités" style={{ display: "flex" }}>
          {parcours.map((p, i) => (
            <div key={p.id}>
              <h4>
                <span>{p.titre}</span>
                <span className="order">
                  <button type="button" aria-label={`Monter ${p.titre}`} disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
                  <button type="button" aria-label={`Descendre ${p.titre}`} disabled={i === parcours.length - 1} onClick={() => move(i, 1)}>↓</button>
                </span>
              </h4>
              <button type="button" aria-current={sel?.kind === "parcours" && sel.id === p.id} onClick={() => setSel({ kind: "parcours", id: p.id })}>
                <img src={img(p.icone || "star")} alt="" />Réglages du parcours
              </button>
              {unites.filter((u) => u.parcours === p.id).map((u) => (
                <button key={u.id} type="button" aria-current={sel?.kind === "unite" && sel.id === u.id} onClick={() => setSel({ kind: "unite", id: u.id })}>
                  <img src={img(u.icone || DEFAULT_ICON[u.id_generateur] || "star")} alt="" />{u.ordre}. {u.titre}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="content">
          {selU && <UnitForm key={selU.id} u={selU} slug={parcours.find((p) => p.id === selU.parcours)?.slug ?? ""} freres={unites.filter((x) => x.parcours === selU.parcours)} onSaved={load} />}
          {selP && <ParcoursForm key={selP.id} p={selP} matieres={matieres} onSaved={load} />}
          {!sel && <div className="card"><p className="small">Choisis un parcours ou une unité dans la liste.</p></div>}
          <JsonTools parcours={parcours} unites={unites} matieres={matieres} onImported={load} />
        </div>
      </div>
    </section>
  );
}

function useSave(onSaved: () => Promise<void>) {
  const [state, setState] = useState<"idle" | "busy" | "ok" | string>("idle");
  const run = async (fn: () => Promise<unknown>) => {
    setState("busy");
    try { await fn(); await onSaved(); setState("ok"); } catch (e) { setState((e as { message?: string }).message || "Erreur à l’enregistrement"); }
  };
  return { state, run };
}

function UnitForm({ u, slug, freres, onSaved }: { u: UniteRec; slug: string; freres: UniteRec[]; onSaved: () => Promise<void> }) {
  const [v, setV] = useState(u);
  const [codes, setCodes] = useState((u.per_codes ?? []).join(", "));
  const setGen = (e: ChangeEvent<HTMLSelectElement>) => {
    const auto = perAuto(e.target.value, freres.filter((x) => x.id !== u.id));
    setV({ ...v, id_generateur: e.target.value, ...auto });
    setCodes((auto.per_codes ?? v.per_codes ?? []).join(", "));
  };
  const { state, run } = useSave(onSaved);
  const set = (k: keyof UniteRec) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      const per_codes = codes.split(",").map((c) => c.trim()).filter(Boolean);
      await pb().collection("unites").update(u.id, {
        titre: v.titre, sous_titre: v.sous_titre, regle: v.regle, exemple: v.exemple, image: v.image, piege: v.piege, icone: v.icone,
        id_generateur: v.id_generateur, statut: v.id_generateur ? "actif" : "bientot", per_codes, per_notions: v.per_notions ?? [], annee: v.annee ?? "", tag: v.tag ?? "",
      });
      forgetEtat(slug);
    });
  };
  return (
    <form className="card form" onSubmit={submit} aria-labelledby="h-unit">
      <div className="sec-h"><div><div className="kick">Unité {u.ordre}</div><h2 id="h-unit">{v.titre || "Sans titre"}</h2></div>
        {slug && <Link className="link" href={`/parcours/${slug}/unite/${u.ordre}`}>Voir la page →</Link>}</div>
      <div className="row2">
        <div className="field"><label htmlFor="u-titre">Titre</label><input id="u-titre" required maxLength={120} value={v.titre} onChange={set("titre")} /></div>
        <div className="field"><label htmlFor="u-st">Sous-titre</label><input id="u-st" maxLength={160} value={v.sous_titre} onChange={set("sous_titre")} /></div>
      </div>
      <div className="field"><label htmlFor="u-regle">La règle</label><textarea id="u-regle" maxLength={2000} value={v.regle} onChange={set("regle")} /></div>
      <div className="field"><label htmlFor="u-ex">Exemple</label><textarea id="u-ex" className="mono" maxLength={400} value={v.exemple} onChange={set("exemple")} /></div>
      <div className="field"><label htmlFor="u-img">En image (l’analogie de Pi)</label><textarea id="u-img" maxLength={1000} value={v.image} onChange={set("image")} /></div>
      <div className="field"><label htmlFor="u-piege">Le piège classique</label><textarea id="u-piege" maxLength={1000} value={v.piege} onChange={set("piege")} /></div>
      <div className="row2">
        <div className="field"><label htmlFor="u-gen">Type d’exercices</label>
          <select id="u-gen" className="select" value={v.id_generateur} onChange={setGen}>
            <option value="">Bientôt (pas encore d’exercices)</option>
            {GEN_IDS.map((g) => <option key={g} value={g}>{GENERATOR_LABEL[g] ?? g}</option>)}</select></div>
        <div className="field"><label htmlFor="u-icone">Icône</label>
          <select id="u-icone" className="select" value={v.icone} onChange={set("icone")}>{ICONS.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="u-per">Codes PER</label>
          <input id="u-per" placeholder="MSN 32, MSN 33" disabled={v.tag === TAG_SECONDAIRE_II && !codes} value={codes} onChange={(e) => setCodes(e.target.value)} /></div>
        <div className="field"><label htmlFor="u-annee">Année</label>
          <input id="u-annee" maxLength={20} placeholder="9e ou 10e-11e" value={v.annee ?? ""} onChange={set("annee")} /></div>
      </div>
      {v.tag === TAG_SECONDAIRE_II && <p className="small">Hors PER (secondaire II) : seulement dans la Prépa EPFL.</p>}
      {state === "ok" && <div className="ok-msg" role="status">Enregistré.</div>}
      {state !== "ok" && state !== "idle" && state !== "busy" && <div className="err" role="alert">{state}</div>}
      <button className="cta" type="submit" disabled={state === "busy"}>Enregistrer l’unité</button>
    </form>
  );
}

function ParcoursForm({ p, matieres, onSaved }: { p: Parcours; matieres: Matiere[]; onSaved: () => Promise<void> }) {
  const [v, setV] = useState(p);
  const [cantons, setCantons] = useState((p.cantons ?? []).join(", "));
  const { state, run } = useSave(onSaved);
  const set = (k: keyof Parcours) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setV({ ...v, [k]: e.target.value });
  const submit = (e: FormEvent) => {
    e.preventDefault();
    run(async () => {
      const codes = cantons.toUpperCase().split(/[^A-Z]+/).filter(Boolean);
      const bad = codes.filter((c) => !CANTONS.some((x) => x.code === c));
      if (bad.length) throw new Error(`Canton inconnu : ${bad.join(", ")}. Utilise les abréviations (VD, GE, ZH…).`);
      await pb().collection("parcours").update(p.id, {
        titre: v.titre, accroche: v.accroche, description: v.description, niveau: v.niveau, public: v.public, icone: v.icone,
        matiere: v.matiere, plan: v.plan, annee_min: Number(v.annee_min) || 0, annee_max: Number(v.annee_max) || 0, cantons: codes, statut: v.statut,
      });
      forgetEtat(p.slug);
    });
  };
  return (
    <form className="card form" onSubmit={submit} aria-labelledby="h-parcours">
      <div className="sec-h"><div><div className="kick">Parcours · {p.slug}</div><h2 id="h-parcours">{v.titre}</h2></div>
        <Link className="link" href={`/parcours/${p.slug}`}>Voir le parcours →</Link></div>
      <div className="row2">
        <div className="field"><label htmlFor="p-titre">Titre</label><input id="p-titre" required value={v.titre} onChange={set("titre")} /></div>
        <div className="field"><label htmlFor="p-niveau">Niveau</label><input id="p-niveau" value={v.niveau} onChange={set("niveau")} /></div>
      </div>
      <div className="field"><label htmlFor="p-acc">Accroche (titre du bandeau)</label><input id="p-acc" maxLength={160} value={v.accroche} onChange={set("accroche")} /></div>
      <div className="field"><label htmlFor="p-desc">Description</label><textarea id="p-desc" maxLength={400} value={v.description} onChange={set("description")} /></div>
      <div className="row2">
        <div className="field"><label htmlFor="p-public">Public</label>
          <select id="p-public" className="select" value={v.public} onChange={set("public")}><option value="ecole">École obligatoire</option><option value="adulte">Adultes</option></select></div>
        <div className="field"><label htmlFor="p-icone">Icône</label>
          <select id="p-icone" className="select" value={v.icone} onChange={set("icone")}>{ICONS.map((g) => <option key={g} value={g}>{g}</option>)}</select></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="p-matiere">Matière</label>
          <select id="p-matiere" value={v.matiere} onChange={set("matiere")}><option value="">—</option>{matieres.map((m) => <option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
        <div className="field"><label htmlFor="p-plan">Plan d’études</label>
          <select id="p-plan" value={v.plan || "libre"} onChange={set("plan")}>{Object.entries(PLANS).map(([k, x]) => <option key={k} value={k}>{x.nom}</option>)}</select></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="p-amin">Année Harmos de</label><input id="p-amin" type="number" min={0} max={12} value={v.annee_min || ""} onChange={set("annee_min")} /></div>
        <div className="field"><label htmlFor="p-amax">à</label><input id="p-amax" type="number" min={0} max={12} value={v.annee_max || ""} onChange={set("annee_max")} /></div>
      </div>
      <div className="row2">
        <div className="field"><label htmlFor="p-cantons">Réservé aux cantons (vide = tous)</label><input id="p-cantons" placeholder="VD, GE" value={cantons} onChange={(e) => setCantons(e.target.value)} /></div>
        <div className="field"><label htmlFor="p-statut">Statut</label>
          <select id="p-statut" value={v.statut || "publie"} onChange={set("statut")}><option value="publie">Publié</option><option value="a_valider">Bêta (à valider)</option></select></div>
      </div>
      {state === "ok" && <div className="ok-msg" role="status">Enregistré.</div>}
      {state !== "ok" && state !== "idle" && state !== "busy" && <div className="err" role="alert">{state}</div>}
      <button className="cta" type="submit" disabled={state === "busy"}>Enregistrer le parcours</button>
    </form>
  );
}

/** Même format que pocketbase/seed/parcours.json. */
function JsonTools({ parcours, unites, matieres, onImported }: { parcours: Parcours[]; unites: UniteRec[]; matieres: Matiere[]; onImported: () => Promise<void> }) {
  const [force, setForce] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const exportJson = () => {
    const data = {
      matieres: matieres.map(({ slug, nom, domaine, icone, ordre }) => ({ slug, nom, domaine, icone, ordre })),
      parcours: parcours.map((p) => ({
        ...Object.fromEntries(PARCOURS_FIELDS.map((k) => [k, p[k]])),
        matiere: matieres.find((m) => m.id === p.matiere)?.slug ?? "",
        unites: unites.filter((u) => u.parcours === p.id).map((u) => Object.fromEntries(UNIT_FIELDS.map((k) => [k, u[k]]))),
      })),
    };
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
    a.download = "parcours.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null); setReport(null);
    try {
      const data = JSON.parse(await file.text()) as { parcours?: (Record<string, unknown> & { slug: string; unites?: Record<string, unknown>[] })[] };
      if (!Array.isArray(data.parcours)) throw new Error("Le fichier doit contenir une liste « parcours ».");
      const lines: string[] = [];
      for (const { unites: us = [], ...p } of data.parcours) {
        for (const u of us) {
          if (!u.id_generateur && u.statut === "bientot") continue;
          if (!GEN_IDS.includes(String(u.id_generateur))) throw new Error(`Type d’exercices inconnu : « ${u.id_generateur} » (unité « ${u.titre} »).`);
          // Champs PER absents du fichier : on les déduit du type d'exercices.
          if (!Array.isArray(u.per_codes) || !u.per_codes.length) Object.assign(u, perAuto(String(u.id_generateur), us as unknown as UniteRec[]));
        }
        const fields: Record<string, unknown> = Object.fromEntries(PARCOURS_FIELDS.filter((k) => k in p).map((k) => [k, p[k]]));
        if (typeof p.matiere === "string") {
          const m = matieres.find((x) => x.slug === p.matiere);
          if (!m && p.matiere) throw new Error(`Matière inconnue : « ${p.matiere} ». Matières existantes : ${matieres.map((x) => x.slug).join(", ")}.`);
          fields.matiere = m?.id ?? "";
        }
        let rec = parcours.find((x) => x.slug === p.slug);
        if (!rec) rec = await pb().collection("parcours").create<Parcours>(fields);
        else if (force) rec = await pb().collection("parcours").update<Parcours>(rec.id, fields);
        let created = 0, updated = 0;
        for (const u of us) {
          const uf = { ...Object.fromEntries(UNIT_FIELDS.filter((k) => k in u).map((k) => [k, u[k]])), parcours: rec.id };
          const ex = unites.find((x) => x.parcours === rec!.id && x.ordre === Number(u.ordre));
          if (!ex) { await pb().collection("unites").create(uf); created++; }
          else if (force) { await pb().collection("unites").update(ex.id, uf); updated++; }
        }
        forgetEtat(rec.slug);
        lines.push(`« ${rec.titre} » : ${created} unité${created > 1 ? "s" : ""} créée${created > 1 ? "s" : ""}${force ? `, ${updated} mise${updated > 1 ? "s" : ""} à jour` : ""}.`);
      }
      await onImported();
      setReport(lines.join(" "));
    } catch (e2) {
      setErr((e2 as { message?: string }).message || "Fichier illisible.");
    }
  };

  return (
    <div className="card" aria-labelledby="h-json">
      <div className="sec-h"><h2 id="h-json">Fichier JSON</h2><p className="small">Pour proposer un parcours complet d’un coup (voir le guide « Ajouter un parcours »).</p></div>
      <div className="detail-actions">
        <button type="button" className="cta ghost" onClick={exportJson}>Télécharger tous les parcours</button>
        <label className="cta" htmlFor="json-file" style={{ cursor: "pointer" }}>Importer un fichier…</label>
        <input id="json-file" type="file" accept="application/json,.json" hidden onChange={importJson} />
      </div>
      <label className="small" style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" checked={force} onChange={(e) => setForce(e.target.checked)} /> Remplacer les textes des unités qui existent déjà
      </label>
      {report && <div className="ok-msg" role="status">{report}</div>}
      {err && <div className="err" role="alert">{err}</div>}
    </div>
  );
}
