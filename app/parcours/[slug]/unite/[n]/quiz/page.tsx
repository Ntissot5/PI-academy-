"use client";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { newSerieId, sendSerie, type Reponse, type SerieResult, type Unite } from "@/lib/api";
import { BOSS_PASS, DAILY_GOAL, SERIES_LENGTH } from "@/lib/config";
import { DEFAULT_ICON, resolveGenerator, type Question } from "@/lib/generators";
import { answerText, grade } from "@/lib/grade";
import { forgetEtat, isFinal, unlocked, useEtat } from "@/lib/hooks";
import { img } from "@/lib/icons";
import { fr } from "@/lib/math";
import { lectureAuto, lire, segments, setLectureAuto, taire, voixDisponible, type Langue } from "@/lib/voix";

type Mode = "train" | "boss";
interface Miss { q: string; you: string; a: string; why: string }
interface Fb { kind: "idle" | "unreadable" | "ok" | "ko"; text?: string }
interface Done { score: number; win: boolean; bonus: number; unlock: string; res: SerieResult | null }

const MAX_MIN = 30;

export default function QuizRoute() {
  return <Suspense fallback={<Loading />}><QuizPage /></Suspense>;
}

/** Quiz et résultat : startQuiz/renderQ/check/finish du prototype. */
function QuizPage() {
  const { slug, n } = useParams<{ slug: string; n: string }>();
  const mode: Mode = useSearchParams().get("mode") === "boss" ? "boss" : "train";
  const { etat, error, reload, fresh } = useEtat(slug);
  const router = useRouter();

  const i = etat ? etat.unites.findIndex((u) => String(u.ordre) === n) : -1;
  const c = etat && i >= 0 ? etat.unites[i] : null;
  const ok = !!etat && i >= 0 && unlocked(etat, i) && !(mode === "train" && c && isFinal(c));
  const [run, setRun] = useState(0); // « Encore une série » relance un nouveau quiz

  useEffect(() => { if (fresh && etat && !ok) router.replace(`/parcours/${slug}`); }, [fresh, etat, ok, slug, router]);

  if (error) return <Loading text={error} />;
  if (!etat || !c || !ok) return <Loading />;
  // Voix : langue étudiée pour les mots en gras ; lecture automatique pour les 1re-4e (ne lisent pas encore tous).
  const langue: Langue = etat.matiere?.slug === "allemand" ? "de" : etat.matiere?.slug === "anglais" ? "en" : "fr";
  const petits = !!etat.parcours.annee_max && etat.parcours.annee_max <= 4;
  return <Quiz key={`${run}-${mode}`} slug={slug} units={etat.unites} index={i} mode={mode} canton={etat.canton} langue={langue} petits={petits} onAgain={(m) => { reload(); if (m === mode) setRun((r) => r + 1); else router.replace(`/parcours/${slug}/unite/${c.ordre}/quiz${m === "boss" ? "?mode=boss" : ""}`); }} />;
}

function Quiz({ slug, units, index, mode, canton, langue, petits, onAgain }: { slug: string; units: Unite[]; index: number; mode: Mode; canton?: string; langue: Langue; petits: boolean; onAgain: (m: Mode) => void }) {
  const { setStats, toast } = useApp();
  const router = useRouter();
  const c = units[index];
  const gen = useMemo(() => resolveGenerator(c.id_generateur, units), [c.id_generateur, units]);
  const wasValid = !!c.progression?.valide;

  const [qn, setQn] = useState(0);
  const [cur, setCur] = useState<Question>(() => gen({ canton }));
  const [answered, setAnswered] = useState(false);
  const [value, setValue] = useState("");
  const [fb, setFb] = useState<Fb>({ kind: "idle" });
  const [done, setDone] = useState<Done | null>(null);
  const [beat, setBeat] = useState(0); // relance l'animation de Pi à chaque réponse

  // Détecté après le premier rendu : le serveur ne connaît pas la synthèse vocale de l'appareil.
  const [peutParler, setPeutParler] = useState(false);
  const [auto, setAuto] = useState(false);
  useEffect(() => { const ok = voixDisponible(); setPeutParler(ok); setAuto(ok && lectureAuto(petits)); }, [petits]);
  const ecouter = useCallback(() => {
    const parts = segments(cur.q, langue);
    if (cur.choices) parts.push({ texte: `Réponses : ${cur.choices.join(" ; ")}`, langue: langue === "fr" ? "fr" : langue });
    lire(parts, petits ? 0.85 : 0.95);
  }, [cur, langue, petits]);
  // Nouvelle question : lecture automatique si activée ; on se tait en quittant.
  useEffect(() => { if (auto && !done) ecouter(); }, [qn, auto, done, ecouter]);
  useEffect(() => () => taire(), []);

  const serie = useRef(newSerieId());
  const answers = useRef<Reponse[]>([]);
  const miss = useRef<Miss[]>([]);
  const activeMs = useRef(0);
  const since = useRef<number | null>(Date.now());
  const finished = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const okBtn = useRef<HTMLButtonElement>(null);

  const minutes = () => {
    const now = Date.now();
    if (since.current != null) { activeMs.current += now - since.current; since.current = now; }
    return Math.min(activeMs.current / 60000, MAX_MIN);
  };
  const payload = useCallback((terminee: boolean) => ({
    serie: serie.current, unite: c.id, mode: mode === "boss" ? "boss" as const : "entrainement" as const,
    minutes: minutes(), reponses: answers.current, terminee,
  }), [c.id, mode]);

  // Pendant le quiz, la bande de correction est collée au bas de l'écran (main sans padding bas),
  // comme show('quiz') dans le prototype ; le résultat retrouve le padding normal.
  useEffect(() => {
    if (done) return;
    const main = document.querySelector("main");
    if (main) main.style.paddingBottom = "0";
    return () => { if (main) main.style.paddingBottom = ""; };
  }, [done]);

  // Onglet en arrière-plan ou fermé : on enregistre minutes et erreurs déjà faites.
  useEffect(() => {
    const onVis = () => {
      if (finished.current) return;
      if (document.hidden) {
        const p = payload(false);
        since.current = null;
        if (p.reponses.length || p.minutes > 0.05) sendSerie(p, { keepalive: true });
      } else since.current = Date.now();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", onVis);
    return () => { document.removeEventListener("visibilitychange", onVis); window.removeEventListener("pagehide", onVis); };
  }, [payload]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!answered && !done) { const t = setTimeout(() => input.current?.focus(), 30); return () => clearTimeout(t); }
    if (answered) okBtn.current?.focus();
  }, [qn, answered, done]);

  // Accroche pour les tests de bout en bout uniquement (jamais en production).
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_E2E === "1") (window as unknown as { __piAnswer?: string }).__piAnswer = answerText(cur);
  }, [cur]);

  const quit = () => {
    if (!finished.current) {
      finished.current = true;
      const p = payload(false);
      if (p.reponses.length || p.minutes > 0.05) sendSerie(p, { keepalive: true });
      forgetEtat(slug);
    }
    router.push(`/parcours/${slug}/unite/${c.ordre}`);
  };

  const check = (v: string = value) => {
    const g = grade(v, cur);
    if (g === "unreadable") { setFb({ kind: "unreadable" }); return; }
    const good = g === "ok";
    answers.current.push({ ok: good, enonce: cur.q, reponse: v, bonne: answerText(cur) });
    if (!good) miss.current.push({ q: cur.q, you: v, a: answerText(cur), why: cur.why });
    if (good) setStats((s) => (s ? { ...s, xp: s.xp + 10, answered: s.answered + 1 } : s));
    else setStats((s) => (s ? { ...s, answered: s.answered + 1 } : s));
    setAnswered(true);
    setBeat((b) => b + 1);
    setFb({ kind: good ? "ok" : "ko", text: mode === "train" ? cur.why : good ? "" : "Correction à la fin." });
  };

  const finish = async () => {
    finished.current = true;
    const score = answers.current.filter((a) => a.ok).length;
    const win = mode === "boss" && score >= BOSS_PASS;
    const res = await sendSerie(payload(true));
    forgetEtat(slug);
    if (res) setStats(res.stats);
    else toast("Pas de réseau : ta série sera envoyée plus tard");
    const bonus = res ? res.bonus : win && !wasValid ? 100 : 0;
    const next = units[index + 1];
    const unlock = win && bonus ? (isFinal(c) || !next ? "Parcours validé." : `Unité ${index + 2} débloquée : ${next.titre}.`) : "";
    setDone({ score, win, bonus, unlock, res });
  };

  const next = () => {
    if (qn + 1 >= SERIES_LENGTH) { finish(); return; }
    setQn(qn + 1);
    setCur(gen({ canton }));
    setAnswered(false);
    setValue("");
    setFb({ kind: "idle" });
  };

  const act = (e?: FormEvent) => { e?.preventDefault(); if (answered) next(); else check(); };

  if (done) return <Result slug={slug} c={c} units={units} index={index} mode={mode} done={done} miss={miss.current} onAgain={onAgain} />;

  // Nombres : − / , comme le prototype. Texte : les accents utiles. QCM : pas de clavier.
  const keys = cur.keys ?? (typeof cur.a === "number" ? ["−", "/", ","] : []);
  const kick = mode === "boss" ? "star" : c.icone || DEFAULT_ICON[c.id_generateur] || "star";
  const width = (answered ? qn + 1 : qn) * 10;
  return (
    <section>
      <div className="qwrap">
        <div className="qbar"><button className="x" id="qx" aria-label="Arrêter" onClick={quit}>✕</button><div className="bar"><i style={{ width: `${width}%` }} /></div><span className="mono">{qn + 1}/10</span></div>
        <div className="qcard">
          <div className="qkick"><img src={img(kick)} alt="" />{mode === "boss" ? "Boss · " : ""}{cur.tag || c.titre}</div>
          <div className={`q ${cur.txt ? "text" : ""}`} dangerouslySetInnerHTML={{ __html: cur.q }} />
          {peutParler && (
            <div className="voix">
              <button type="button" className="voix-btn" onClick={ecouter} aria-label="Écouter la question">🔊 Écouter</button>
              <label className="small"><input type="checkbox" checked={auto} onChange={(e) => { setAuto(e.target.checked); setLectureAuto(e.target.checked); if (!e.target.checked) taire(); }} /> Lire chaque question</label>
            </div>
          )}
          {cur.hint && <div className="hint">{cur.hint}</div>}
          {cur.choices ? (
            <div className="choices" role="group" aria-label="Propositions">
              {cur.choices.map((c) => (
                <button key={c} type="button" disabled={answered}
                  className={answered ? (c === answerText(cur) ? "good" : c === value ? "bad" : "") : ""}
                  onClick={() => { setValue(c); check(c); }}>{c}</button>
              ))}
            </div>
          ) : (
            <form className="ans" id="af" autoComplete="off" onSubmit={act}>
              <input id="ain" ref={input} inputMode="text" enterKeyHint="done" placeholder="Ta réponse" aria-label="Ta réponse"
                autoCapitalize="off" autoCorrect="off" spellCheck={false}
                value={value} disabled={answered} onChange={(e) => setValue(e.target.value)} />
              {keys.length > 0 && <div className={`keys ${keys.length > 3 ? "many" : ""}`}>{keys.map((k) => <button key={k} type="button" disabled={answered} onClick={() => { setValue((v) => v + k); input.current?.focus(); }}>{k}</button>)}</div>}
              <button type="submit" hidden />
            </form>
          )}
        </div>
      </div>
      <div className={`check ${fb.kind === "ok" ? "ok" : fb.kind === "ko" ? "ko" : ""}`} id="chk">
        <div className="in">
          <div className="fbx" id="fbx">
            {fb.kind === "idle" && <><Pi mood="think" w={64} h={44} /><span className="hint">{cur.choices ? "Choisis une réponse." : "Écris ta réponse puis vérifie."}</span></>}
            {fb.kind === "unreadable" && <><Pi mood="think" w={64} h={44} />{typeof cur.a === "number"
              ? <div><b>Je ne lis pas ce nombre</b><span>Écris par exemple −3, 4,5 ou 7/12.</span></div>
              : <div><b>Écris ta réponse</b><span>Le champ est vide.</span></div>}</>}
            {(fb.kind === "ok" || fb.kind === "ko") && (
              <><Pi key={beat} mood={fb.kind === "ok" ? "happy" : "sad"} className={fb.kind === "ok" ? "jump" : "shake"} w={64} h={44} />
                <div><b>{fb.kind === "ok" ? "Juste ! +10 XP" : `Réponse : ${answerText(cur)}`}</b><span>{fb.text}</span></div></>
            )}
          </div>
          <button className="cta" id="ok" ref={okBtn} onClick={() => act()} disabled={!!cur.choices && !answered}>{!answered ? "Vérifier" : qn === SERIES_LENGTH - 1 ? "Voir le résultat" : "Continuer"}</button>
        </div>
      </div>
    </section>
  );
}

const CONFETTI = ["#2356E8", "#3AA8F4", "#7EA2FF", "#14966A", "#FFC94A"];

function Result({ slug, c, units, index, mode, done, miss, onAgain }: { slug: string; c: Unite; units: Unite[]; index: number; mode: Mode; done: Done; miss: Miss[]; onAgain: (m: Mode) => void }) {
  const router = useRouter();
  const { stats } = useApp();
  const { score, win, bonus, unlock } = done;
  const f = isFinal(c);
  const good = mode === "boss" ? win : score >= BOSS_PASS;
  const title = mode === "boss" ? (win ? "Boss battu !" : "Le boss résiste") : good ? "Série réussie" : "Bien joué, on continue";
  const sub = mode === "boss"
    ? win ? unlock || "Unité déjà validée. Bon entretien." : "Il faut 8/10. Refais un entraînement sur tes erreurs, puis retente."
    : good ? "Tu es prêt à affronter le boss." : "Encore une série et tu y es.";
  const rev = done.res?.revision;
  const revMsg = rev ? (rev.reussie ? `Révision réussie : on la revoit dans ${rev.intervalle} jour${rev.intervalle > 1 ? "s" : ""}.` : "Révision à reprendre : on la revoit demain.") : "";
  const m = Math.round(stats?.minutesToday ?? 0);
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <section>
      <div className="res">
        <div className="top2">
          {good && <div className="confetti">{Array.from({ length: 26 }, (_, k) => <i key={k} style={{ left: `${k * 3.9}%`, background: CONFETTI[k % 5], animationDelay: `${(k % 7) * 0.08}s` }} />)}</div>}
          <Pi mood={good ? "happy" : "sad"} className={good ? "jump pi-big" : "pi-big"} />
          <div className="score">{score}/10</div><h2>{title}</h2><p style={{ color: "var(--muted)" }}>{sub}</p>
          {revMsg && <p className="badge rev" style={{ margin: "6px auto 0" }}>{revMsg}</p>}
          <div className="kpis">
            <div className="kpi"><img src={img("star")} alt="" /><b>+{score * 10 + bonus}</b><span>XP</span></div>
            <div className="kpi"><img src={img("fire")} alt="" /><b>{stats?.streak ?? 0}</b><span>jours de suite</span></div>
            <div className="kpi"><img src={img("calendar")} alt="" /><b>{m}/{DAILY_GOAL}</b><span>min aujourd’hui</span></div>
          </div>
        </div>
        {miss.length > 0 && (
          <div className="miss"><h3>Corrections</h3>
            {miss.map((x, k) => (
              <div key={k}>
                <div className="q2" dangerouslySetInnerHTML={{ __html: x.q }} />
                <div>Toi : <span className="mono" style={{ color: "var(--bad)" }}>{x.you || "—"}</span> · juste : <span className="mono" style={{ color: "var(--ok)" }}>{x.a}</span></div>
                <div className="why">{x.why}</div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
          <button className="cta" id="again" onClick={() => onAgain(mode === "boss" && !win && !f ? "train" : mode)}>{mode === "boss" && !win && !f ? "Entraînement" : "Encore une série"}</button>
          {win && !f && units[index + 1] && <button className="cta dark" id="nextU" onClick={() => router.push(`/parcours/${slug}/unite/${units[index + 1].ordre}`)}>Unité suivante →</button>}
          <button className="cta ghost" id="home2" onClick={() => router.push(`/parcours/${slug}`)}>Retour au cours</button>
        </div>
      </div>
    </section>
  );
}
