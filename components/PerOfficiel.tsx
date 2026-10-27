"use client";
import { useEffect, useState } from "react";
import { getPerNotions, type PerNotion, type Unite } from "@/lib/api";
import { cantonByCode } from "@/lib/cantons";
import { loadCantonsPer, repartitionPour, type CantonPer } from "@/lib/cantons-per";
import { OBJECTIFS_PER } from "@/lib/per";

/**
 * Pour les profs : le texte officiel du PER visé par l'unité, tel quel, avec le lien vers la source.
 * Si le canton a publié une répartition par année, on la montre ; sinon on garde celle du PER.
 */
export function PerOfficiel({ unite, canton: cantonClasse }: { unite: Unite; canton: string }) {
  const [notions, setNotions] = useState<PerNotion[] | null>(null);
  const [canton, setCanton] = useState(cantonClasse);
  useEffect(() => { if (cantonClasse) setCanton(cantonClasse); }, [cantonClasse]);
  const [cantons, setCantons] = useState<CantonPer[]>([]);
  useEffect(() => {
    getPerNotions(unite.per_notions ?? []).then(setNotions).catch(() => setNotions([]));
    loadCantonsPer().then(setCantons);
  }, [unite.per_notions]);

  const codes = unite.per_codes ?? [];
  if (!codes.length) return null;
  const cn = cantonByCode(canton);
  const rep = repartitionPour(cantons.find((c) => c.canton === canton), codes, unite.annee);
  const docs = cantons.find((c) => c.canton === canton)?.documents ?? [];
  const docUrl = (f?: string) => docs.find((d) => d.fichier === f)?.url;

  return (
    <details className="per-off">
      <summary>Programme officiel · {codes.join(", ")}{unite.annee ? ` · ${unite.annee}` : ""}</summary>
      <label className="small per-canton">Canton{" "}
        <select value={canton} onChange={(e) => setCanton(e.target.value)}>
          <option value="">—</option>
          {cantons.map((c) => <option key={c.canton} value={c.canton}>{cantonByCode(c.canton)?.nom ?? c.canton}</option>)}
        </select>
      </label>
      {rep.length > 0 ? (
        <div>
          <h4>Répartition du canton : {cn?.nom ?? canton}</h4>
          <ul>
            {rep.map((r, k) => (
              <li key={k}>
                <b>{r.code} · {r.annee}</b>{r.notion && r.notion !== "INTROUVABLE" ? ` · ${r.notion}` : ""}
                {r.filieres && !r.filieres.includes("toutes") && <span className="small"> ({r.filieres.join(", ")})</span>}
                {r.contenu?.map((t, j) => <div key={j} className="per-txt">{t}</div>)}
                {docUrl(r.document) && <a className="link small" href={docUrl(r.document)} target="_blank" rel="noreferrer">Document cantonal</a>}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="small">{cn ? `Pas de répartition cantonale publiée pour ${cn.nom} : on suit celle du PER.` : "Choisis un canton pour voir sa répartition, s’il en publie une."}</p>
      )}
      <h4>Plan d’études romand</h4>
      {notions === null ? <p className="small">Chargement…</p> : (
        <ul>
          {notions.map((n) => (
            <li key={n.cle}>
              <b>{n.code} · {n.annee_debut === n.annee_fin ? `${n.annee_debut}e` : `${n.annee_debut}e-${n.annee_fin}e`}</b>{n.notion ? ` · ${n.notion}` : ""}
              {n.contenu.map((t, j) => <div key={j} className="per-txt">{t}</div>)}
              <a className="link small" href={n.source_url} target="_blank" rel="noreferrer">Source</a>
            </li>
          ))}
        </ul>
      )}
      <p className="small">{codes.map((c) => OBJECTIFS_PER[c]?.titre).filter(Boolean).join(" · ")}</p>
      <p className="small">Source : Plan d’études romand, © CIIP.</p>
    </details>
  );
}
