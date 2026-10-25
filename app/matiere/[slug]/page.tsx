"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import type { Parcours } from "@/lib/api";
import { PLANS, cantonByCode } from "@/lib/cantons";
import { anneesLabel, fitsCanton, planLabel } from "@/lib/catalogue";
import { img } from "@/lib/icons";
import { useCatalogue } from "@/lib/useCatalogue";

/** Espace d'une matière : ses programmes, ceux du plan d'études du canton en premier. */
export default function MatierePage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { ready, canton, matieres, visible } = useCatalogue();

  if (!ready) return <Loading />;
  const m = matieres.find((x) => x.slug === slug);
  if (!m) return <Loading text="Cette matière n’existe pas." />;
  const cn = cantonByCode(canton);
  const items = visible.filter((p) => p.matiere === m.id).sort((a, b) => a.ordre - b.ordre);
  const mine = items.filter((p) => fitsCanton(p, canton));
  const others = items.filter((p) => !fitsCanton(p, canton));
  const plans = cn ? cn.plans.map((p) => PLANS[p].court).join(" et ") : "";

  const card = (p: Parcours, other = false) => {
    const an = anneesLabel(p);
    return (
      <button key={p.id} className={`unit ${other ? "other" : ""}`} onClick={() => router.push(`/parcours/${p.slug}`)}>
        <span className="ic"><img src={img(p.icone || m.icone || "star")} alt="" /></span>
        <span className="meta"><span className="num">{p.niveau}</span><h3>{p.titre}</h3><p>{p.accroche}</p>
          <span className="skills">
            <span className="pill-s">{planLabel(p)}</span>
            {an && <span className="pill-s mute">{an} Harmos</span>}
            {p.public === "adulte" && <span className="pill-s mute">Adultes</span>}
            {p.statut === "a_valider" && <span className="pill-s" title="Contenu nouveau, en cours de relecture par des enseignant·es">Bêta</span>}
          </span>
        </span>
        <span className="go">Ouvrir →</span>
      </button>
    );
  };

  return (
    <section className="intro">
      <div className="crumb"><Link href="/parcours">Matières</Link><span>›</span><span>{m.nom}</span></div>
      <div className="uhead"><img className="ico" src={img(m.icone || "star")} alt="" /><div><h1>{m.nom}</h1><p>{m.domaine}{cn ? ` · ${cn.nom}` : ""}</p></div></div>

      {items.length === 0 && (
        <div className="guide" style={{ alignSelf: "center" }}>
          <div className="bubble">Pas encore de programme dans cette matière. Reviens bientôt !</div>
          <Pi className="bob pi-big" />
        </div>
      )}

      {mine.length > 0 && (
        <>
          {cn && others.length > 0 && <div className="sec-h"><h2>Pour ton canton</h2><p className="small">{plans}</p></div>}
          <div className="units">{mine.map((p) => card(p))}</div>
        </>
      )}
      {others.length > 0 && (
        <>
          <div className="sec-h"><h2>{mine.length ? "Autres plans d’études" : "Programmes disponibles"}</h2>{cn && <p className="small">Ils suivent un autre plan que celui de {cn.nom}.</p>}</div>
          <div className="units">{others.map((p) => card(p, true))}</div>
        </>
      )}
    </section>
  );
}
