"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRevisions, type Revision } from "@/lib/api";
import { DEFAULT_ICON } from "@/lib/generators";
import { img } from "@/lib/icons";

/**
 * Révisions du jour : les unités déjà maîtrisées reviennent juste avant d'être oubliées
 * (1, 3, 7, 14, 30, 60, 120 jours). Une série d'entraînement réussie (8/10) espace la suivante.
 */
export function RevisionsDuJour({ parcours }: { parcours?: string }) {
  const [list, setList] = useState<Revision[] | null>(null);
  const router = useRouter();
  useEffect(() => { getRevisions().then((r) => setList(r.revisions)).catch(() => setList([])); }, []);
  const items = (list ?? []).filter((r) => !parcours || r.parcours === parcours);
  if (!items.length) return null;
  return (
    <div className="card revisions" aria-labelledby="h-rev">
      <div className="sec-h"><h2 id="h-rev">À réviser aujourd’hui</h2><p className="small">Pour ne pas oublier ce que tu maîtrises déjà.</p></div>
      <div className="rev-list">
        {items.slice(0, 6).map((r) => (
          <button key={`${r.parcours}-${r.ordre}`} type="button" className="rev-row"
            onClick={() => router.push(`/parcours/${r.parcours}/unite/${r.ordre}/quiz`)}>
            <img src={img(r.icone || DEFAULT_ICON[r.id_generateur] || "star")} alt="" />
            <span><b>{r.titre}</b>{!parcours && <span className="small"> · {r.parcours_titre}</span>}</span>
            <span className="go">Réviser →</span>
          </button>
        ))}
      </div>
      {items.length > 6 && <p className="small">Et {items.length - 6} autre{items.length - 6 > 1 ? "s" : ""} : une à la fois, ça suffit.</p>}
    </div>
  );
}
