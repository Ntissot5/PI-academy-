"use client";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import {
  createClasse, getBoard, lastErrors, listClasses, listMatieres, listParcours, removeEleve, resetPin, setParcoursAssignes,
  type Board, type BoardEleve, type Classe, type Erreur, type Matiere, type Parcours,
} from "@/lib/api";
import { DEFAULT_ICON } from "@/lib/generators";
import { useRequireAuth } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { LVL, mastery } from "@/lib/mastery";
import { CANTONS, cantonByCode } from "@/lib/cantons";
import { anneesLabel, fitsCanton, groupByMatiere, planLabel } from "@/lib/catalogue";
import { pb } from "@/lib/pb";

const frDate = (d: string) => (d ? d.split("-").reverse().join(".") : "—");

/** Espace prof : classes, codes, parcours assignés, maîtrise élèves × unités, erreurs, élèves bloqués. */
export default function Prof() {
  const ok = useRequireAuth();
  const { user, logout, toast } = useApp();
  const router = useRouter();
  const [classes, setClasses] = useState<Classe[] | null>(null);
  const [current, setCurrent] = useState<string | null>(null);
  const [catalog, setCatalog] = useState<Parcours[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [board, setBoard] = useState<Board | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (ok && user && user.role !== "prof" && user.role !== "admin") router.replace("/parcours");
  }, [ok, user, router]);

  const loadClasses = useCallback(async () => {
    if (!user) return;
    const cs = await listClasses(user.id);
    setClasses(cs);
    setCurrent((c) => c && cs.some((x) => x.id === c) ? c : cs[0]?.id ?? null);
  }, [user]);

  useEffect(() => {
    if (!ok) return;
    loadClasses().catch(() => setClasses([]));
    listParcours().then(setCatalog).catch(() => {});
    listMatieres().then(setMatieres).catch(() => {});
  }, [ok, loadClasses]);

  const reload = useCallback(async () => {
    if (!current) return setBoard(null);
    try { setBoard(await getBoard(current)); } catch { /* hors ligne : on garde l'affichage */ }
  }, [current]);

  useEffect(() => { setBoard(null); setSelected(null); reload(); }, [reload]);

  // Temps réel : toute progression, session, erreur ou arrivée d'élève visible par ce prof recharge le tableau.
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!ok || !current) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const bump = () => { clearTimeout(timer); timer = setTimeout(() => { reload(); setTick((t) => t + 1); }, 300); };
    const offs: Promise<() => Promise<void>>[] = ["progressions", "sessions", "erreurs", "users"].map((c) =>
      pb().collection(c).subscribe("*", bump));
    return () => { clearTimeout(timer); offs.forEach((p) => p.then((off) => off()).catch(() => {})); };
  }, [ok, current, reload]);

  if (!classes) return <Loading />;
  const classe = classes.find((c) => c.id === current) ?? null;
  const bloques = board?.eleves.filter((e) => e.bloque) ?? [];
  const msg = !classes.length ? "Bienvenue ! Crée ta première classe : je te donne un code à 6 caractères pour tes élèves."
    : !board ? "Je charge ta classe…"
    : !board.eleves.length ? `Donne le code ${board.classe.code} à tes élèves : ils choisissent un pseudo et un PIN, sans e-mail.`
    : bloques.length ? `${bloques.length} élève${bloques.length > 1 ? "s" : ""} à regarder de près aujourd’hui.`
    : "Tout le monde avance. Rien à signaler aujourd’hui.";

  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">Espace prof</div>
          <h1>Tes classes</h1>
          <p className="sub">Crée une classe, assigne des parcours, puis suis la maîtrise de chaque élève. Le tableau se met à jour tout seul.</p>
        </div>
        <div className="guide">
          <div className="bubble">{msg}</div>
          <Pi mood={bloques.length ? "think" : "idle"} className="bob pi-big" />
        </div>
      </div>

      <div className="class-bar">
        <div className="class-tabs" role="tablist" aria-label="Classes">
          {classes.map((c) => (
            <button key={c.id} type="button" role="tab" aria-selected={c.id === current} onClick={() => setCurrent(c.id)}>{c.nom}</button>
          ))}
        </div>
        <NewClass defaultCanton={user?.canton ?? classes[classes.length - 1]?.canton ?? ""} onCreate={async (nom, canton) => {
          const c = await createClasse(user!.id, nom, canton);
          await loadClasses();
          setCurrent(c.id);
          toast(`Classe créée : code ${c.code}`);
        }} first={!classes.length} />
      </div>

      {classe && (
        <>
          <ClassHead classe={classe} count={board?.eleves.length} />
          <Assign classe={classe} catalog={catalog} matieres={matieres} onChange={async (ids) => {
            await setParcoursAssignes(classe.id, ids);
            await loadClasses();
            reload();
          }} />
          {board && bloques.length > 0 && (
            <div className="card stuck" aria-labelledby="h-stuck">
              <h3 id="h-stuck">À regarder</h3>
              {bloques.map((e) => (
                <button key={e.id} type="button" className="stuck-row" onClick={() => setSelected(e.id)}>
                  <b>{e.pseudo}</b><span>{e.raisons.join(" · ")}</span>
                </button>
              ))}
            </div>
          )}
          {!board ? <Loading /> : <Grid board={board} selected={selected} onSelect={setSelected} />}
          {board && selected && board.eleves.find((e) => e.id === selected) && (
            <Detail key={selected} eleve={board.eleves.find((e) => e.id === selected)!} board={board} tick={tick}
              onClose={() => setSelected(null)} onRemoved={() => { setSelected(null); reload(); }} />
          )}
        </>
      )}
      <p className="foot">Tu ne vois que tes propres classes. Les élèves n’ont ni e-mail ni nom complet. <button className="link" onClick={logout}>Se déconnecter</button></p>
    </section>
  );
}

function NewClass({ onCreate, first, defaultCanton }: { onCreate: (nom: string, canton: string) => Promise<void>; first: boolean; defaultCanton: string }) {
  const [open, setOpen] = useState(first);
  const [nom, setNom] = useState("");
  const [canton, setCanton] = useState(defaultCanton);
  useEffect(() => { if (!canton && defaultCanton) setCanton(defaultCanton); }, [defaultCanton, canton]);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (first) setOpen(true); }, [first]);
  if (!open) return <button type="button" className="cta ghost" id="new-class" onClick={() => setOpen(true)}>+ Nouvelle classe</button>;
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!nom.trim()) return;
    setBusy(true);
    try { await onCreate(nom.trim(), canton); setNom(""); setOpen(false); } finally { setBusy(false); }
  };
  return (
    <form className="new-class" onSubmit={submit}>
      <div className="field"><label htmlFor="class-name">Nom de la classe</label>
        <input id="class-name" required maxLength={60} placeholder="9e B · maths" value={nom} onChange={(e) => setNom(e.target.value)} autoFocus /></div>
      <div className="field"><label htmlFor="class-canton">Canton</label>
        <select id="class-canton" value={canton} onChange={(e) => setCanton(e.target.value)}>
          <option value="">Choisir…</option>
          {[...CANTONS].sort((a, b) => a.nom.localeCompare(b.nom, "fr")).map((c) => <option key={c.code} value={c.code}>{c.nom}</option>)}
        </select></div>
      <button className="cta" type="submit" disabled={busy}>Créer la classe</button>
    </form>
  );
}

function ClassHead({ classe, count }: { classe: Classe; count?: number }) {
  const { toast } = useApp();
  const copy = async () => {
    try { await navigator.clipboard.writeText(classe.code); toast("Code copié"); } catch { toast(`Code : ${classe.code}`); }
  };
  return (
    <div className="daily class-head">
      <div className="left">
        <img className="ico" src={img("report")} alt="" />
        <div><h3>{classe.nom}</h3><p className="small">{count == null ? "…" : `${count} élève${count > 1 ? "s" : ""}`}{cantonByCode(classe.canton) ? ` · ${cantonByCode(classe.canton)!.nom}` : ""} · les élèves entrent sur la page « Je suis élève »</p></div>
      </div>
      <div className="code-box">
        <span className="small">Code de classe</span>
        <b className="mono" id="class-code">{classe.code}</b>
        <button type="button" className="cta ghost" onClick={copy}>Copier</button>
      </div>
    </div>
  );
}

function Assign({ classe, catalog, matieres, onChange }: { classe: Classe; catalog: Parcours[]; matieres: Matiere[]; onChange: (ids: string[]) => Promise<void> }) {
  // Affichage immédiat ; on revient à l'état serveur si l'enregistrement échoue.
  const [ids, setIds] = useState(classe.parcours_assignes);
  const { toast } = useApp();
  useEffect(() => { setIds(classe.parcours_assignes); }, [classe.parcours_assignes]);
  const toggle = async (id: string) => {
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    setIds(next);
    try { await onChange(next); } catch { setIds(classe.parcours_assignes); toast("Le changement n’a pas été enregistré"); }
  };
  const school = catalog;
  return (
    <div className="card">
      <div className="sec-h"><h2>Parcours assignés</h2><p className="small">Tes élèves ne voient que ces parcours.{cantonByCode(classe.canton) ? " Ceux du plan d’études de ta classe sont en premier." : ""}</p></div>
      {groupByMatiere(school, matieres, classe.canton).map(({ matiere, items }) => (
        <div key={matiere?.id ?? "autres"} className="assign-group">
          <h3 className="small">{matiere?.nom ?? "Autres"}</h3>
          <div className="assign">
            {items.map((p) => {
              const on = ids.includes(p.id);
              const an = anneesLabel(p);
              return (
                <label key={p.id} className={`assign-row ${on ? "on" : ""} ${fitsCanton(p, classe.canton) ? "" : "other"}`}>
                  <input type="checkbox" checked={on} onChange={() => toggle(p.id)} />
                  <span className="ic"><img src={img(p.icone || "star")} alt="" /></span>
                  <span className="meta"><span className="num">{planLabel(p)}{an ? ` · ${an}` : ""}{p.statut === "a_valider" ? " · Bêta" : ""}</span><b>{p.titre}</b></span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Grid({ board, selected, onSelect }: { board: Board; selected: string | null; onSelect: (id: string) => void }) {
  if (!board.parcours.length) return <div className="card"><p className="small">Assigne au moins un parcours pour voir la maîtrise de tes élèves.</p></div>;
  if (!board.eleves.length) return <div className="card"><p className="small">Pas encore d’élève. Donne-leur le code <b className="mono">{board.classe.code}</b>.</p></div>;
  return (
    <>
      {board.parcours.map((p) => (
        <div className="card" key={p.id}>
          <div className="sec-h"><h2>{p.titre}</h2>
            <div className="legend">{[0, 1, 2, 3].map((k) => <span key={k}><i className={k ? `lv${k}` : ""} />{LVL[k]}</span>)}</div></div>
          <div className="board-wrap">
            <table className="board">
              <thead>
                <tr>
                  <th scope="col" className="who">Élève</th>
                  {p.unites.map((u, i) => (
                    <th scope="col" key={u.id} title={u.titre}>
                      <img src={img(u.icone || DEFAULT_ICON[u.id_generateur] || "star")} alt="" />
                      <span className="mono">{u.id_generateur === "final" ? "Final" : i + 1}</span>
                    </th>
                  ))}
                  <th scope="col" className="last">Dernière session</th>
                </tr>
              </thead>
              <tbody>
                {board.eleves.map((e) => (
                  <tr key={e.id} className={e.id === selected ? "sel" : ""} onClick={() => onSelect(e.id)}>
                    <th scope="row" className="who">
                      <button type="button" onClick={() => onSelect(e.id)}>{e.pseudo}</button>
                      {e.bloque && <span className="badge bad" title={e.raisons.join(" · ")}>Bloqué</span>}
                      {e.nouveau && <span className="badge">Nouveau</span>}
                    </th>
                    {p.unites.map((u) => {
                      const pr = e.progression[u.id];
                      const lv = mastery(pr);
                      return <td key={u.id}><i className={`cell ${lv ? `lv${lv}` : ""}`} title={`${u.titre} : ${LVL[lv]}${pr?.nb_boss ? ` · boss ${pr.meilleur_boss}/10` : ""}`} data-lv={lv} /></td>;
                    })}
                    <td className="last mono">{frDate(e.derniere_session)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}

function Detail({ eleve, board, tick, onClose, onRemoved }: { eleve: BoardEleve; board: Board; tick: number; onClose: () => void; onRemoved: () => void }) {
  const { toast } = useApp();
  const [errs, setErrs] = useState<Erreur[] | null>(null);
  const [pin, setPin] = useState("");
  const [confirm, setConfirm] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const titles = useMemo(() => {
    const m: Record<string, string> = {};
    board.parcours.forEach((p) => p.unites.forEach((u) => { m[u.id] = u.titre; }));
    return m;
  }, [board]);

  useEffect(() => { lastErrors(eleve.id).then(setErrs).catch(() => setErrs([])); }, [eleve.id, tick]);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, []);

  const newPin = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{4}$/.test(pin)) return toast("Le PIN fait 4 chiffres");
    try { await resetPin(eleve.id, pin); toast(`Nouveau PIN pour ${eleve.pseudo} : ${pin}`); setPin(""); } catch { toast("Le PIN n’a pas pu être changé"); }
  };
  const remove = async () => {
    try { await removeEleve(eleve.id); toast(`${eleve.pseudo} a été retiré·e de la classe`); onRemoved(); } catch { toast("Impossible de retirer cet élève"); }
  };

  return (
    <div className="card detail" ref={ref} aria-labelledby="h-detail">
      <div className="sec-h">
        <div><div className="kick">Élève</div><h2 id="h-detail">{eleve.pseudo}</h2>
          <p className="small">{eleve.xp} XP · dernière session : {frDate(eleve.derniere_session)} · {eleve.erreurs} erreur{eleve.erreurs > 1 ? "s" : ""} au total</p></div>
        <button type="button" className="cta ghost" onClick={onClose}>Fermer</button>
      </div>
      {eleve.raisons.length > 0 && <div className="trap"><div><b>À regarder.</b> {eleve.raisons.join(" · ")}</div></div>}
      <div className="miss" id="errors">
        <h3>10 dernières erreurs</h3>
        {errs == null ? <p className="small">Chargement…</p> : errs.length === 0 ? <p className="small">Aucune erreur pour l’instant.</p> : errs.map((x) => (
          <div key={x.id}>
            <div className="small">{titles[x.unite] ?? "Unité"} · {frDate(x.date)}</div>
            <div className="q2" dangerouslySetInnerHTML={{ __html: x.enonce }} />
            <div>Réponse : <span className="mono" style={{ color: "var(--bad)" }}>{x.reponse_donnee || "—"}</span> · juste : <span className="mono" style={{ color: "var(--ok)" }}>{x.bonne_reponse}</span></div>
          </div>
        ))}
      </div>
      <div className="detail-actions">
        <form className="pin-form" onSubmit={newPin}>
          <div className="field"><label htmlFor="new-pin">Nouveau PIN</label>
            <input id="new-pin" className="pin" inputMode="numeric" value={pin} placeholder="0000" onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} /></div>
          <button className="cta" type="submit">Donner ce PIN</button>
        </form>
        {!confirm ? (
          <button type="button" className="cta ghost danger" onClick={() => setConfirm(true)}>Retirer de la classe</button>
        ) : (
          <div className="confirm">
            <span>Son compte et sa progression seront supprimés.</span>
            <button type="button" className="cta danger-full" onClick={remove}>Oui, retirer {eleve.pseudo}</button>
            <button type="button" className="cta ghost" onClick={() => setConfirm(false)}>Annuler</button>
          </div>
        )}
      </div>
    </div>
  );
}
