"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Pi } from "@/components/Pi";
import { APP_NAME } from "@/lib/config";
import { img } from "@/lib/icons";

const CHOICES = [
  { href: "/eleve", icon: "note", num: "Élève", h: "Je suis élève", p: "Ton prof t’a donné un code de classe. Un pseudo et un PIN suffisent, pas d’e-mail." },
  { href: "/connexion?role=prof", icon: "report", num: "Prof", h: "Je suis prof", p: "Crée ta classe, assigne des parcours et suis la maîtrise de chaque élève." },
  { href: "/connexion?role=adulte", icon: "laptop", num: "Adulte", h: "Je me prépare seul", p: "De la 11e au niveau d’entrée EPFL, 20 minutes par jour, à ton rythme." },
];

/** Accueil public : présentation et choix du profil. */
export default function Accueil() {
  const { ready, user } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (ready && user) router.replace(user.role === "prof" ? "/prof" : "/parcours");
  }, [ready, user, router]);

  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">{APP_NAME} · Mathématiques</div>
          <h1>Les maths, une marche après l’autre</h1>
          <p className="sub">Tu lis la règle, tu t’entraînes, tu bats le boss de l’unité. 20 minutes par jour suffisent pour avancer.</p>
          <div className="chips-line">
            <span><img src={img("calendar")} alt="" />20 min par jour</span>
            <span><img src={img("star")} alt="" />Un boss par unité</span>
            <span><img src={img("fire")} alt="" />Ta série de jours</span>
          </div>
        </div>
        <div className="guide">
          <div className="bubble">Salut, moi c’est Pi. Dis-moi qui tu es et on commence.</div>
          <Pi className="bob pi-big" />
        </div>
      </div>
      <div className="sec-h"><h2>Tu es…</h2></div>
      <div className="units">
        {CHOICES.map((c) => (
          <Link key={c.href} className="unit" href={c.href}>
            <span className="ic"><img src={img(c.icon)} alt="" /></span>
            <span className="meta"><span className="num">{c.num}</span><h3>{c.h}</h3><p>{c.p}</p></span>
            <span className="go">Commencer →</span>
          </Link>
        ))}
      </div>
      <p className="foot">Pas de publicité, pas de traceur. Les élèves n’ont ni e-mail ni nom complet chez nous.</p>
    </section>
  );
}
