"use client";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ClientResponseError } from "pocketbase";
import { useApp } from "@/components/AppProvider";
import { Pi } from "@/components/Pi";
import { eleveConnexion, eleveRejoindre } from "@/lib/api";

/** Entrée élève : code de classe + pseudo + PIN, sans e-mail. */
export default function Eleve() {
  const router = useRouter();
  const { ready, user } = useApp();
  const [tab, setTab] = useState<"join" | "login">("join");
  const [code, setCode] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && user) router.replace(user.role === "prof" ? "/prof" : "/parcours"); }, [ready, user, router]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!/^\d{4}$/.test(pin)) return setErr("Le PIN fait 4 chiffres.");
    if (tab === "join" && pin !== pin2) return setErr("Les deux PIN ne sont pas pareils.");
    setBusy(true);
    try {
      const body = { code, pseudo, pin };
      await (tab === "join" ? eleveRejoindre(body) : eleveConnexion(body));
      router.replace("/parcours");
    } catch (e2) {
      setErr(e2 instanceof ClientResponseError && e2.status ? e2.response?.message || "Ça n’a pas marché. Réessaie." : "Pas de connexion au serveur. Réessaie dans un instant.");
    } finally {
      setBusy(false);
    }
  };

  const onlyDigits = (v: string) => v.replace(/\D/g, "").slice(0, 4);
  return (
    <section className="narrow">
      <div className="guide" style={{ alignSelf: "center" }}>
        <div className="bubble">{tab === "join" ? "Salut ! Entre le code que ton prof t’a donné, puis choisis un pseudo et un PIN." : "Re-salut ! Ton code de classe, ton pseudo et ton PIN."}</div>
        <Pi className="bob pi-big" />
      </div>
      <div className="article">
        <div className="tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "join"} onClick={() => { setTab("join"); setErr(null); }}>Je rejoins ma classe</button>
          <button type="button" role="tab" aria-selected={tab === "login"} onClick={() => { setTab("login"); setErr(null); }}>J’ai déjà un pseudo</button>
        </div>
        <form className="form" onSubmit={submit} autoComplete="off">
          <div className="field"><label htmlFor="code">Code de classe</label>
            <input id="code" className="pin" required maxLength={6} autoCapitalize="characters" spellCheck={false} placeholder="K7M2QP" value={code} onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} /></div>
          <div className="field"><label htmlFor="pseudo">Pseudo</label>
            <input id="pseudo" required maxLength={24} spellCheck={false} value={pseudo} onChange={(e) => setPseudo(e.target.value)} /></div>
          <div className="field"><label htmlFor="pin">PIN à 4 chiffres</label>
            <input id="pin" className="pin" type="password" inputMode="numeric" required value={pin} onChange={(e) => setPin(onlyDigits(e.target.value))} /></div>
          {tab === "join" && <div className="field"><label htmlFor="pin2">Encore une fois</label>
            <input id="pin2" className="pin" type="password" inputMode="numeric" required value={pin2} onChange={(e) => setPin2(onlyDigits(e.target.value))} /></div>}
          {err && <div className="err" role="alert">{err}</div>}
          <button className="cta" type="submit" disabled={busy}>{tab === "join" ? "Rejoindre ma classe" : "Entrer"}</button>
        </form>
      </div>
      <p className="foot">Pas d’e-mail, pas de nom : choisis un pseudo, ou ton prénom seulement. Retiens bien ton PIN, ton prof peut t’en donner un nouveau.</p>
    </section>
  );
}
