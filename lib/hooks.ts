"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/AppProvider";
import { getEtat, type Etat } from "./api";

/** Redirige vers la connexion si personne n'est connecté. */
export function useRequireAuth() {
  const { ready, user } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (ready && !user) router.replace(`/connexion?suite=${encodeURIComponent(window.location.pathname)}`);
  }, [ready, user, router]);
  return ready && !!user;
}

// Cache par parcours : passer du tableau de bord à une unité n'affiche pas d'écran vide.
const cache = new Map<string, Etat>();

export function useEtat(slug: string) {
  const ok = useRequireAuth();
  const { setStats } = useApp();
  const [etat, setEtat] = useState<Etat | null>(() => cache.get(slug) ?? null);
  const [error, setError] = useState<string | null>(null);
  // `fresh` : l'état vient du serveur pendant ce rendu-ci (pas seulement du cache).
  const [fresh, setFresh] = useState(false);

  const reload = useCallback(async () => {
    try {
      const e = await getEtat(slug);
      cache.set(slug, e);
      setEtat(e);
      setFresh(true);
      setStats(e.stats);
    } catch (err) {
      const status = (err as { status?: number }).status;
      setError(status === 403 ? "Ce parcours n’est pas ouvert pour toi." : status === 404 ? "Parcours introuvable." : "Impossible de charger le parcours. Vérifie ta connexion.");
    }
  }, [slug, setStats]);

  useEffect(() => { if (ok) reload(); }, [ok, reload]);
  return { etat, error, reload, fresh };
}

/** À appeler quand la progression change (fin de série) : le prochain écran recharge. */
export const forgetEtat = (slug: string) => cache.delete(slug);

export const isFinal = (u: { id_generateur: string }) => u.id_generateur === "final";
export const unlocked = (etat: Etat, i: number) => i === 0 || !!etat.unites[i - 1]?.progression?.valide;
