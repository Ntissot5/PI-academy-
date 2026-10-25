"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { CantonPicker } from "@/components/CantonPicker";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { listMatieres, listParcours, type Matiere, type Parcours } from "@/lib/api";
import { cantonByCode } from "@/lib/cantons";
import { anneesLabel, fitsCanton, groupByMatiere, hiddenForCanton, planLabel } from "@/lib/catalogue";
import { useRequireAuth } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { pb } from "@/lib/pb";

/** Catalogue des parcours, par matière, en mettant en avant le plan d'études du canton. */
export default function Catalogue() {
  const ok = useRequireAuth();
  const { user, logout } = useApp();
  const router = useRouter();
  const [list, setList] = useState<Parcours[] | null>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [canton, setCanton] = useState("");

  useEffect(() => {
    if (!ok || !user) return;
    (async () => {
      let all = await listParcours();
      setMatieres(await listMatieres().catch(() => []));
      let c = user.canton ?? "";
      if (user.role === "eleve" && user.classe) {
        // Un élève ne voit que les parcours assignés à sa classe.
        const cl = await pb().collection("classes").getOne<{ parcours_assignes: string[]; canton: string }>(user.classe);
        all = all.filter((p) => cl.parcours_assignes.includes(p.id));
        c = c || cl.canton || "";
        // Une seule porte d'entrée pour l'élève : on l'ouvre directement.
        if (all.length === 1) return router.replace(`/parcours/${all[0].slug}`);
      }
      setCanton(c);
      setList(all);
    })().catch(() => setList([]));
  }, [ok, user, router]);

  const chooseCanton = (c: string) => {
    setCanton(c);
    if (user) pb().collection("users").update(user.id, { canton: c }).catch(() => {});
  };

  if (!list) return <Loading />;
  const cn = cantonByCode(canton);
  const visible = list.filter((p) => !hiddenForCanton(p, canton));
  const groups = groupByMatiere(visible, matieres, canton);
  const isEleve = user?.role === "eleve";

  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">Catalogue{cn ? ` · ${cn.nom}` : ""}</div>
          <h1>Choisis ton parcours</h1>
          <p className="sub">Chaque parcours suit le même rythme : 20 minutes par jour, une règle, un entraînement, un boss. Tout est gratuit.</p>
        </div>
        <div className="guide">
          <div className="bubble">{cn ? `Je mets d’abord les parcours de ton plan d’études. Tu peux en suivre plusieurs.` : "Dis-moi ton canton : je te montre d’abord les parcours de ton école."}</div>
          <Pi className="bob pi-big" />
        </div>
      </div>

      {!isEleve && <CantonPicker value={canton} onChange={chooseCanton} />}

      {groups.map(({ matiere, items }) => (
        <div key={matiere?.id ?? "autres"} className="intro" style={{ gap: 12 }}>
          <div className="mat-h">
            <img className="ico" src={img(matiere?.icone || "star")} alt="" />
            <div><h2>{matiere?.nom ?? "Autres parcours"}</h2>{matiere?.domaine && <span className="small">{matiere.domaine}</span>}</div>
          </div>
          <div className="units">
            {items.map((p) => {
              const fit = fitsCanton(p, canton);
              const an = anneesLabel(p);
              return (
                <button key={p.id} className={`unit ${fit ? "" : "other"}`} onClick={() => router.push(`/parcours/${p.slug}`)}>
                  <span className="ic"><img src={img(p.icone || "star")} alt="" /></span>
                  <span className="meta"><span className="num">{p.niveau}</span><h3>{p.titre}</h3><p>{p.accroche}</p>
                    <span className="skills">
                      <span className="pill-s">{planLabel(p)}</span>
                      {an && <span className="pill-s mute">{an} Harmos</span>}
                      {p.public === "adulte" && <span className="pill-s mute">Adultes</span>}
                      {p.statut === "a_valider" && <span className="pill-s" title="Contenu nouveau, en cours de relecture par des enseignant·es">Bêta</span>}
                      {!fit && cn && <span className="pill-s mute">Autre plan d’études</span>}
                    </span>
                  </span>
                  <span className="go">Ouvrir →</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {visible.length === 0 && <p className="foot">{isEleve ? "Ton prof n’a pas encore ouvert de parcours pour ta classe. Reviens un peu plus tard !" : "Aucun parcours ouvert pour l’instant."}</p>}

      <p className="foot">
        {user?.role === "admin" && <><Link className="link" href="/admin">Admin : contenu des parcours</Link> · </>}
        {user?.role === "prof" && <><Link className="link" href="/prof">Espace prof</Link> · </>}
        <button className="link" onClick={logout}>Se déconnecter</button>
      </p>
    </section>
  );
}
