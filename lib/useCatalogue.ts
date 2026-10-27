"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { listMatieres, listParcours, type Matiere, type Parcours } from "./api";
import { hiddenForCanton } from "./catalogue";
import { useRequireAuth } from "./hooks";
import { pb } from "./pb";

/** Code « hors de Suisse / je ne sais pas » : tout le catalogue, sans plan mis en avant. */
export const CANTON_AUCUN = "CH";

/** Parcours visibles, matières et canton de l'utilisateur (catalogue et pages de matière). */
export function useCatalogue() {
  const ok = useRequireAuth();
  const { user } = useApp();
  const router = useRouter();
  const [list, setList] = useState<Parcours[] | null>(null);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [canton, setCanton] = useState("");

  useEffect(() => {
    if (!ok || !user) return;
    (async () => {
      let all = await listParcours();
      setMatieres(await listMatieres().catch(() => []));
      let c = user.canton ?? "";
      if (user.role === "eleve" && user.classe) {
        // Un élève ne voit que les parcours assignés à sa classe ; le canton est celui de la classe.
        const cl = await pb().collection("classes").getOne<{ parcours_assignes: string[]; canton: string }>(user.classe);
        all = all.filter((p) => cl.parcours_assignes.includes(p.id));
        c = c || cl.canton || CANTON_AUCUN;
        // Une seule porte d'entrée pour l'élève : on l'ouvre directement.
        if (all.length === 1) return router.replace(`/parcours/${all[0].slug}`);
      }
      setCanton(c);
      setList(all);
    })().catch(() => setList([]));
  }, [ok, user, router]);

  const chooseCanton = useCallback((c: string) => {
    setCanton(c);
    if (user) pb().collection("users").update(user.id, { canton: c }).catch(() => {});
  }, [user]);

  const visible = (list ?? []).filter((p) => !hiddenForCanton(p, canton));
  return { ready: list !== null, user, canton, chooseCanton, matieres, visible };
}
