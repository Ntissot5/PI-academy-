"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { markLesson } from "@/lib/api";
import { DEFAULT_ICON } from "@/lib/generators";
import { isBientot, isFinal, unlocked, useEtat } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { LVL, mastery } from "@/lib/mastery";
import { OBJECTIFS_PER, pastille, perPourUnite } from "@/lib/per";
import { PerOfficiel } from "@/components/PerOfficiel";
import type { Unite } from "@/lib/api";

/** Page d'unité : openUnit() du prototype. */
export default function UnitPage() {
  const { slug, n } = useParams<{ slug: string; n: string }>();
  const { etat, error, reload, fresh } = useEtat(slug);
  const { toast, user } = useApp();
  const router = useRouter();
  const marked = useRef(false);

  const i = etat ? etat.unites.findIndex((u) => String(u.ordre) === n) : -1;
  const c = etat && i >= 0 ? etat.unites[i] : null;
  const open = !!etat && i >= 0 && unlocked(etat, i);

  useEffect(() => {
    if (fresh && etat && c && !open) { toast(isBientot(c) ? "Cette leçon arrive bientôt" : "Bats d’abord le boss de l’unité précédente"); router.replace(`/parcours/${slug}`); }
  }, [fresh, etat, c, open, slug, router, toast]);

  useEffect(() => {
    if (!c || !open || marked.current || c.progression?.lecon_lue) return;
    marked.current = true;
    markLesson(c.id).then(reload).catch(() => {});
  }, [c, open, reload]);

  if (error) return <Loading text={error} />;
  if (!etat) return <Loading />;
  if (!c) return <Loading text="Cette unité n’existe pas." />;
  if (!open) return <Loading />;

  const f = isFinal(c);
  const p = c.progression;
  const train = p?.nb_entrainements ? p.meilleur_entrainement : null;
  const best = p?.nb_boss ? p.meilleur_boss : null;
  // La leçon est lue dès l'ouverture, comme dans le prototype.
  const lv = Math.max(mastery(p), 1);
  const nUnits = etat.unites.filter((u) => !isFinal(u)).length;
  const quiz = (mode: "train" | "boss") => router.push(`/parcours/${slug}/unite/${c.ordre}/quiz${mode === "boss" ? "?mode=boss" : ""}`);

  return (
    <section>
      <div className="crumb"><Link href={`/parcours/${slug}`} id="bk">Cours</Link><span>›</span><span>{f ? "Examen final" : `Unité ${i + 1}`}</span></div>
      <div className="uhead"><img className="ico" src={img(c.icone || DEFAULT_ICON[c.id_generateur] || "star")} alt="" /><div><h1>{c.titre}</h1><p>{c.sous_titre} · {LVL[lv]}</p></div></div>
      <PerLine u={c} units={etat.unites} />
      <div className="ugrid">
        <article className="article">
          <div><h4>La règle</h4><p>{c.regle}</p></div>
          <div><h4>Exemple</h4><div className="ex">{c.exemple}</div></div>
          <div className="tip"><Pi mood="think" w={56} h={38} /><p>{c.image}</p></div>
          <div className="trap"><div><b>Le piège classique.</b> {c.piege}</div></div>
        </article>
        <div className="acts">
          {!f && (
            <div className="act">
              <div className="h"><img className="ico" src={img("plane")} alt="" /><div><h3>Entraînement</h3><p>10 questions · correction après chaque réponse</p></div></div>
              <button className="cta" id="go" onClick={() => quiz("train")}>{train != null ? "Nouvelle série" : "Commencer"}</button>
              {train != null && <p>Meilleur score : {train}/10</p>}
            </div>
          )}
          <div className="act boss">
            <div className="h"><img className="ico" src={img("star")} alt="" /><div><h3>{f ? "Examen final" : "Boss de l’unité"}</h3><p>{f ? `10 questions tirées des ${nUnits} unités` : "8/10 sans aide pour débloquer la suite"} · +100 XP</p></div></div>
            <button className="cta" id="boss" onClick={() => quiz("boss")}>{p?.valide ? "Rejouer" : "Affronter le boss"}</button>
            {best != null && <p>Meilleur score : {best}/10</p>}
          </div>
        </div>
      </div>
      {(user?.role === "prof" || user?.role === "admin") && <PerOfficiel unite={c} canton={etat.canton} />}
    </section>
  );
}

/** Objectifs du Plan d'études romand visés par l'unité (ou mention « hors PER » pour le secondaire II). */
function PerLine({ u, units }: { u: Unite; units: Unite[] }) {
  const per = perPourUnite(u, units);
  if (per.horsPer && !per.codes.length) return <p className="per-line"><span className="pill-s mute" title={per.note}>Hors PER · secondaire II</span></p>;
  if (!per.codes.length) return null;
  return (
    <p className="per-line">
      <span className="small">Plan d’études romand{per.annee ? ` · ${per.annee}` : ""} :</span>
      {per.codes.map((code) => (
        <span key={code} className="pill-s" title={OBJECTIFS_PER[code]?.titre}>{pastille(code)}</span>
      ))}
      {per.horsPer && <span className="pill-s mute" title={per.note}>+ secondaire II</span>}
    </p>
  );
}
