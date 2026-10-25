"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { DEFAULT_ICON } from "@/lib/generators";
import { isBientot, isFinal, unlocked, useEtat } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { LVL, courseMastery, mastery } from "@/lib/mastery";
import { DAILY_GOAL } from "@/lib/config";
import type { Unite } from "@/lib/api";

const icon = (u: Unite) => u.icone || DEFAULT_ICON[u.id_generateur] || "star";

/** Tableau de bord du parcours : l'accueil du prototype (renderHome), à l'identique. */
export default function Dashboard() {
  const { slug } = useParams<{ slug: string }>();
  const { etat, error } = useEtat(slug);
  const { toast, logout } = useApp();
  const router = useRouter();

  if (error) return <Loading text={error} />;
  if (!etat) return <Loading />;

  const { unites, stats } = etat;
  const cur = unites.findIndex((u) => !isBientot(u) && !u.progression?.valide);
  const actives = unites.filter((u) => !isBientot(u));
  const c = unites[cur < 0 ? unites.indexOf(actives[actives.length - 1] ?? unites[unites.length - 1]) : cur];
  const m = Math.round(stats.minutesToday);
  const cm = courseMastery(actives.map((u) => u.progression));
  const nClasse = unites.filter((u) => isBientot(u) && u.tag === "en_classe").length;
  const nBientot = unites.length - actives.length - nClasse;
  const msg = !actives.length
    ? "Les exercices de ce programme arrivent bientôt. Tu peux déjà voir ce que tu vas apprendre cette année."
    : cur < 0
    ? "Parcours terminé. Garde la forme avec quelques séries."
    : m >= DAILY_GOAL ? `Objectif du jour rempli. Bravo ! Une série bonus sur « ${c.titre} » ?`
    : m > 0 ? `Encore ${DAILY_GOAL - m} min aujourd’hui. On continue « ${c.titre} » ?`
    : `Salut, moi c’est Pi. ${DAILY_GOAL} min aujourd’hui : on attaque « ${c.titre} » ?`;
  const href = (i: number) => `/parcours/${slug}/unite/${unites[i].ordre}`;
  const open = (i: number) => (unlocked(etat, i) ? router.push(href(i)) : toast(isBientot(unites[i]) ? (unites[i].tag === "en_classe" ? "Cette notion se travaille en classe, avec ton prof" : "Cette leçon arrive bientôt") : "Bats d’abord le boss de l’unité précédente"));
  const sq = (u: Unite) => {
    const lv = mastery(u.progression);
    return <span className="sq">{[1, 2, 3].map((k) => <i key={k} className={lv >= k ? `lv${k}` : ""} />)}</span>;
  };
  const p = (u: Unite) => u.progression;

  return (
    <section>
      <div className="hero">
        <div>
          <div className="kick">Cours · {etat.matiere?.nom ?? "Mathématiques"}</div>
          <h1>{etat.parcours.accroche || etat.parcours.titre}</h1>
          <p className="sub">{etat.parcours.description}</p>
          <div className="prog">
            <div className="row"><span>Maîtrise du cours</span><span className="mono">{cm} %</span></div>
            <div className="bar"><i style={{ width: `${cm}%` }} /></div>
          </div>
        </div>
        <div className="guide">
          <div className="bubble">{msg}</div>
          <Pi mood={m >= DAILY_GOAL ? "happy" : "idle"} className="bob pi-big" />
          {cur >= 0 && <button className="cta" id="cont" onClick={() => open(cur)}>Continuer · Unité {cur + 1}</button>}
        </div>
      </div>
      <div className="cols">
        <nav className="side" aria-label="Unités"><h4>Unités du cours</h4>
          {unites.map((u, i) => (
            <button key={u.id} className={unlocked(etat, i) ? "" : "lk"} onClick={() => open(i)}>
              <img src={img(unlocked(etat, i) ? icon(u) : "lock")} alt="" />
              {isFinal(u) ? "Boss final" : `${i + 1}. ${u.titre}`}{isBientot(u) ? <span className="small soon">{u.tag === "en_classe" ? "En classe" : "Bientôt"}</span> : sq(u)}
            </button>
          ))}
        </nav>
        <div className="content">
          <div className="daily">
            <div className="left">
              <div className="ring">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="var(--m0)" strokeWidth="11" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={m >= DAILY_GOAL ? "var(--ok)" : "var(--brand)"} strokeWidth="11" strokeLinecap="round" strokeDasharray="264" strokeDashoffset={264 - (264 * Math.min(m, DAILY_GOAL)) / DAILY_GOAL} />
                </svg>
                <b>{m}′</b>
              </div>
              <div><h3>Objectif du jour : {DAILY_GOAL} min</h3><p className="small">{stats.streak} jour{stats.streak > 1 ? "s" : ""} de suite · {stats.answered} questions faites</p></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
              <div className="days">
                {stats.days.map((d, i) => (
                  <i key={d.date} className={`${d.minutes >= DAILY_GOAL ? "f" : d.minutes > 0 ? "p" : ""} ${i === stats.days.length - 1 ? "t" : ""}`} title={`${d.date} : ${Math.round(d.minutes)} min`} />
                ))}
              </div>
              <div className="small" style={{ display: "flex", justifyContent: "space-between" }}><span>il y a 4 semaines</span><span>aujourd’hui</span></div>
            </div>
          </div>
          <div className="sec-h"><h2>Unités{nBientot || nClasse ? <span className="small"> · {actives.length} avec exercices{nClasse ? `, ${nClasse} en classe` : ""}{nBientot ? `, ${nBientot} bientôt` : ""}</span> : null}</h2>
            <div className="legend">{[0, 1, 2, 3].map((k) => <span key={k}><i className={k ? `lv${k}` : ""} />{LVL[k]}</span>)}</div>
          </div>
          <div className="units">
            {unites.map((u, i) => {
              const lk = !unlocked(etat, i), lv = mastery(u.progression), f = isFinal(u), bt = isBientot(u);
              if (bt) {
                return (
                  <button key={u.id} className="unit lk soon" onClick={() => open(i)} aria-disabled>
                    <span className="ic"><img src={img("lock")} alt="" /></span>
                    <span className="meta"><span className="num">Notion {i + 1}</span><h3>{u.titre}</h3><p>{u.sous_titre}</p></span>
                    <span className="go">{u.tag === "en_classe" ? "En classe" : "Bientôt"}</span>
                  </button>
                );
              }
              return (
                <button key={u.id} className={`unit ${lk ? "lk" : ""} ${f ? "final" : ""}`} onClick={() => open(i)} aria-disabled={lk || undefined}>
                  <span className="ic"><img src={img(icon(u))} alt="" />{lk && <img className="lock" src={img("lock")} alt="Verrouillé" />}</span>
                  <span className="meta"><span className="num">{f ? "Examen final" : `Unité ${i + 1}`}</span><h3>{u.titre}</h3><p>{u.sous_titre}</p>
                    <span className="skills">
                      <span><i className={lv >= 1 ? "lv1" : ""} />Leçon</span>
                      <span><i className={lv >= 2 ? "lv2" : ""} />Entraînement {p(u)?.nb_entrainements ? `${p(u)!.meilleur_entrainement}/10` : ""}</span>
                      <span><i className={lv >= 3 ? "lv3" : ""} />Boss {p(u)?.nb_boss ? `${p(u)!.meilleur_boss}/10` : ""}</span>
                    </span>
                  </span>
                  <span className="go">{lk ? "Verrouillé" : lv === 3 ? "Revoir →" : lv > 0 ? "Continuer →" : "Commencer →"}</span>
                </button>
              );
            })}
          </div>
          <p className="foot">
            Ta progression est gardée sur ton compte : tu la retrouves sur tous tes appareils.{" "}
            <Link className="link" href={etat.matiere ? `/matiere/${etat.matiere.slug}` : "/parcours"}>{etat.matiere ? `Autres programmes en ${etat.matiere.nom.toLowerCase()}` : "Autres parcours"}</Link> · <button className="link" onClick={logout}>Se déconnecter</button>
          </p>
        </div>
      </div>
    </section>
  );
}
