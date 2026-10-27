"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { CantonPicker } from "@/components/CantonPicker";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { RevisionsDuJour } from "@/components/Revisions";
import { cantonByCode } from "@/lib/cantons";
import { fitsCanton } from "@/lib/catalogue";
import { img } from "@/lib/icons";
import { useCatalogue } from "@/lib/useCatalogue";

/** Catalogue : d'abord le canton, puis une grille de matières. Chaque matière a sa page. */
export default function Catalogue() {
  const { logout } = useApp();
  const router = useRouter();
  const { ready, user, canton, chooseCanton, matieres, visible } = useCatalogue();

  if (!ready) return <Loading />;
  const cn = cantonByCode(canton);
  const isEleve = user?.role === "eleve";
  const tiles = matieres
    .map((m) => {
      const items = visible.filter((p) => p.matiere === m.id);
      return { m, n: items.length, fit: items.filter((p) => fitsCanton(p, canton)).length };
    })
    .filter((t) => t.n > 0);

  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">Catalogue{cn ? ` · ${cn.nom}` : ""}</div>
          <h1>{canton ? "Choisis ta matière" : "D’abord, ton canton"}</h1>
          <p className="sub">{canton ? "Chaque matière a ses programmes. 20 minutes par jour, une règle, un entraînement, un boss. Tout est gratuit." : "Je te montre ensuite les programmes de ton école en premier."}</p>
        </div>
        <div className="guide">
          <div className="bubble">{canton ? "Tu peux suivre plusieurs matières en même temps. Ta progression est gardée pour chacune." : "Dans quel canton tu vas à l’école ?"}</div>
          <Pi className="bob pi-big" />
        </div>
      </div>

      {!isEleve && <CantonPicker value={canton} onChange={chooseCanton} />}

      {canton && (
        <>
          <RevisionsDuJour />
          <div className="mat-grid" role="list">
            {tiles.map(({ m, n, fit }) => (
              <button key={m.id} type="button" role="listitem" className="mat-tile" onClick={() => router.push(`/matiere/${m.slug}`)}>
                <span className="ic"><img src={img(m.icone || "star")} alt="" /></span>
                <b>{m.nom}</b>
                <span className="small">{n} programme{n > 1 ? "s" : ""}{cn && fit < n ? ` · ${fit} pour ${cn.code}` : ""}</span>
              </button>
            ))}
          </div>
          {tiles.length === 0 && <p className="foot">{isEleve ? "Ton prof n’a pas encore ouvert de parcours pour ta classe. Reviens un peu plus tard !" : "Aucun parcours ouvert pour l’instant."}</p>}
        </>
      )}

      <p className="foot">
        {user?.role === "admin" && <><Link className="link" href="/admin">Admin : contenu des parcours</Link> · </>}
        {user?.role === "prof" && <><Link className="link" href="/prof">Espace prof</Link> · </>}
        <button className="link" onClick={logout}>Se déconnecter</button>
      </p>
    </section>
  );
}
