"use client";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { pb, type User } from "@/lib/pb";
import { flushPending, getStats, type Stats } from "@/lib/api";
import { applyTheme } from "@/lib/theme";

interface AppCtx {
  ready: boolean;
  user: User | null;
  stats: Stats | null;
  setStats: (s: Stats | null | ((s: Stats | null) => Stats | null)) => void;
  refreshStats: () => Promise<void>;
  logout: () => void;
  toast: (t: string) => void;
}

const Ctx = createContext<AppCtx | null>(null);

export function useApp(): AppCtx {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp hors de <AppProvider>");
  return c;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [toastText, setToastText] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const refreshStats = useCallback(async () => {
    if (!pb().authStore.isValid) return setStats(null);
    try { setStats(await getStats()); } catch { /* hors ligne : on garde l'affichage */ }
  }, []);

  useEffect(() => {
    const store = pb().authStore;
    const sync = () => {
      const rec = store.isValid ? (store.record as unknown as User) : null;
      setUser(rec);
      if (rec?.theme) applyTheme(rec.theme);
    };
    sync();
    setReady(true);
    const off = store.onChange(sync);
    if (store.isValid) {
      // rafraîchit le jeton et le profil, puis renvoie les séries restées en attente
      const col = store.record?.collectionName || "users";
      pb().collection(col).authRefresh().catch(() => store.clear());
      flushPending().finally(refreshStats);
    }
    return off;
  }, [refreshStats]);

  const router = useRouter();
  const logout = useCallback(() => {
    pb().authStore.clear();
    setStats(null);
    router.replace("/");
  }, [router]);

  const toast = useCallback((t: string) => {
    setToastText(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastText(null), 1800);
  }, []);

  return (
    <Ctx.Provider value={{ ready, user, stats, setStats, refreshStats, logout, toast }}>
      {children}
      <div className="toast" hidden={!toastText} role="status">{toastText}</div>
    </Ctx.Provider>
  );
}
