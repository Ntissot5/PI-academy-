"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { Loading } from "@/components/Loading";
import { Pi } from "@/components/Pi";
import { listParcours, type Parcours } from "@/lib/api";
import { useRequireAuth } from "@/lib/hooks";
import { img } from "@/lib/icons";

/** Catalogue des parcours : cartes dans le style des cartes d'unités. */
export default function Catalogue() {
  const ok = useRequireAuth();
  const { user, logout } = useApp();
  const router = useRouter();
  const [list, setList] = useState<Parcours[] | null>(null);

  useEffect(() => {
    if (!ok) return;
    listParcours().then(async (all) => {
      if (user?.role === "eleve" && user.classe) {
        // Un élève ne voit que les parcours assignés à sa classe.
        const { pb } = await import("@/lib/pb");
        const cl = await pb().collection("classes").getOne<{ parcours_assignes: string[] }>(user.classe);
        all = all.filter((p) => cl.parcours_assignes.includes(p.id));
      }
      // Une seule porte d'entrée pour l'élève : on l'ouvre directement.
      if (user?.role === "eleve" && all.length === 1) return router.replace(`/parcours/${all[0].slug}`);
      setList(all);
    }).catch(() => setList([]));
  }, [ok, user, router]);

  if (!list) return <Loading />;
  return (
    <section className="intro">
      <div className="hero">
        <div>
          <div className="kick">Catalogue · Mathématiques</div>
          <h1>Choisis ton parcours</h1>
          <p className="sub">Chaque parcours suit le même rythme : 20 minutes par jour, une règle, un entraînement, un boss.</p>
        </div>
        <div className="guide">
          <div className="bubble">Tu peux en suivre plusieurs. Ta progression est gardée pour chacun.</div>
          <Pi className="bob pi-big" />
        </div>
      </div>
      <div className="sec-h"><h2>Parcours</h2></div>
      <div className="units">
        {list.map((p) => (
          <button key={p.id} className="unit" onClick={() => router.push(`/parcours/${p.slug}`)}>
            <span className="ic"><img src={img(p.icone || "star")} alt="" /></span>
            <span className="meta"><span className="num">{p.niveau}</span><h3>{p.titre}</h3><p>{p.accroche}</p>
              <span className="skills"><span>{p.public === "ecole" ? "École obligatoire" : "Adultes"}</span></span></span>
            <span className="go">Ouvrir →</span>
          </button>
        ))}
        {list.length === 0 && <p className="foot">{user?.role === "eleve" ? "Ton prof n’a pas encore ouvert de parcours pour ta classe. Reviens un peu plus tard !" : "Aucun parcours ouvert pour l’instant."}</p>}
      </div>
      <p className="foot">
        {user?.role === "admin" && <><Link className="link" href="/admin">Admin : contenu des parcours</Link> · </>}
        {user?.role === "prof" && <><Link className="link" href="/prof">Espace prof</Link> · </>}
        <button className="link" onClick={logout}>Se déconnecter</button>
      </p>
    </section>
  );
}
