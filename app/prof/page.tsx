"use client";
import { useApp } from "@/components/AppProvider";
import { Pi } from "@/components/Pi";
import { useRequireAuth } from "@/lib/hooks";

/** Espace prof : construit en phase 2. */
export default function Prof() {
  useRequireAuth();
  const { logout } = useApp();
  return (
    <section className="narrow">
      <div className="guide" style={{ alignSelf: "center" }}>
        <div className="bubble">Ton espace prof arrive très bientôt : classes, codes et tableau de maîtrise.</div>
        <Pi className="bob pi-big" />
      </div>
      <p className="foot"><button className="link" onClick={logout}>Se déconnecter</button></p>
    </section>
  );
}
