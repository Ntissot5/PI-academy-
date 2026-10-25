"use client";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import { useApp } from "@/components/AppProvider";
import { Pi } from "@/components/Pi";
import { pb, type User } from "@/lib/pb";

export default function ConnexionRoute() {
  return <Suspense><Connexion /></Suspense>;
}

function message(err: unknown): string {
  if (err instanceof ClientResponseError) {
    const d = err.response?.data as Record<string, { code?: string }> | undefined;
    if (d?.email?.code === "validation_not_unique") return "Un compte existe déjà avec cet e-mail. Connecte-toi.";
    if (d?.email) return "Cet e-mail n’a pas l’air valide.";
    if (d?.passwordConfirm) return "Les deux mots de passe ne sont pas pareils.";
    if (err.status === 400 && err.url.includes("auth-with-password")) return "E-mail ou mot de passe incorrect.";
    if (err.status === 0) return "Pas de connexion au serveur. Réessaie dans un instant.";
    return err.response?.message || "Ça n’a pas marché. Réessaie.";
  }
  return "Ça n’a pas marché. Réessaie.";
}

/** Connexion et inscription par e-mail : profs et adultes. */
function Connexion() {
  const sp = useSearchParams();
  const role = sp.get("role") === "prof" ? "prof" : "adulte";
  const suite = sp.get("suite");
  const router = useRouter();
  const { ready, user } = useApp();
  const [tab, setTab] = useState<"login" | "signup">(sp.get("role") ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const go = (u: User) => router.replace(suite && suite.startsWith("/") ? suite : u.role === "prof" ? "/prof" : "/parcours");
  useEffect(() => { if (ready && user) go(user); }); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (tab === "signup" && password.length < 8) return setErr("Ton mot de passe doit faire au moins 8 caractères.");
    if (tab === "signup" && password !== password2) return setErr("Les deux mots de passe ne sont pas pareils.");
    setBusy(true);
    try {
      if (tab === "signup") {
        await pb().collection("users").create({ email, password, passwordConfirm: password2, role, emailVisibility: false });
      }
      const r = await pb().collection("users").authWithPassword(email, password);
      go(r.record as unknown as User);
    } catch (e2) {
      setErr(message(e2));
    } finally {
      setBusy(false);
    }
  };

  const who = role === "prof" ? "prof" : "adulte";
  return (
    <section className="narrow">
      <div className="guide" style={{ alignSelf: "center" }}>
        <div className="bubble">{tab === "signup" ? (who === "prof" ? "Bienvenue ! Crée ton compte prof, puis ta première classe." : "Bienvenue ! Crée ton compte, ta progression te suivra partout.") : "Content de te revoir. On continue ?"}</div>
        <Pi className="bob pi-big" />
      </div>
      <div className="article">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "login"} onClick={() => setTab("login")}>J’ai un compte</button>
          <button type="button" role="tab" aria-selected={tab === "signup"} onClick={() => setTab("signup")}>Créer un compte</button>
        </div>
        <form className="form" onSubmit={submit}>
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <div className="field"><label htmlFor="pw">Mot de passe</label><input id="pw" type="password" autoComplete={tab === "signup" ? "new-password" : "current-password"} required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          {tab === "signup" && <div className="field"><label htmlFor="pw2">Encore une fois</label><input id="pw2" type="password" autoComplete="new-password" required value={password2} onChange={(e) => setPassword2(e.target.value)} /></div>}
          {err && <div className="err" role="alert">{err}</div>}
          <button className="cta" type="submit" disabled={busy}>{tab === "signup" ? (who === "prof" ? "Créer mon compte prof" : "Créer mon compte") : "Me connecter"}</button>
        </form>
      </div>
      <p className="foot">Tu es élève ? <a className="link" href="/eleve">Entre avec ton code de classe</a>.</p>
    </section>
  );
}
