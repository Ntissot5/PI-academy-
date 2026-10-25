"use client";
import Link from "next/link";
import { Pi } from "@/components/Pi";

/** Espace élève (code de classe + pseudo + PIN) : construit en phase 2. */
export default function Eleve() {
  return (
    <section className="narrow">
      <div className="guide" style={{ alignSelf: "center" }}>
        <div className="bubble">L’entrée avec ton code de classe arrive très bientôt. Demande à ton prof !</div>
        <Pi className="bob pi-big" />
      </div>
      <Link className="cta ghost" href="/">Retour à l’accueil</Link>
    </section>
  );
}
