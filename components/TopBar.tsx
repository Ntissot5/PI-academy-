"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { APP_NAME } from "@/lib/config";
import { img } from "@/lib/icons";
import { pb } from "@/lib/pb";
import { applyTheme, effectiveTheme, type ThemeChoice } from "@/lib/theme";
import { Pi } from "./Pi";
import { useApp } from "./AppProvider";

function ThemeToggle() {
  const { user } = useApp();
  const [t, setT] = useState<ThemeChoice | null>(null);
  useEffect(() => { setT(effectiveTheme()); }, []);
  const next: ThemeChoice = t === "sombre" ? "clair" : "sombre";
  const flip = () => {
    applyTheme(next);
    setT(next);
    if (user) pb().collection("users").update(user.id, { theme: next }).catch(() => {});
  };
  return (
    <button type="button" className="chip theme" onClick={flip} aria-label={next === "sombre" ? "Passer en mode sombre" : "Passer en mode clair"} title={next === "sombre" ? "Mode sombre" : "Mode clair"}>
      <i aria-hidden="true" />
    </button>
  );
}

export function TopBar() {
  const { user, stats, ready } = useApp();
  const home = !ready ? "/" : !user ? "/" : user.role === "prof" ? "/prof" : "/parcours";
  return (
    <div className="top"><div className="in pad">
      <Link className="logo" href={home} aria-label="Accueil">
        <Pi w={44} h={30} /><span className="t">{APP_NAME}</span>
      </Link>
      <div className="chips">
        {user && user.role !== "prof" && (
          <>
            <span className="chip" title="Jours de suite"><img src={img("fire")} alt="" /><span>{stats?.streak ?? 0}</span></span>
            <span className="chip" title="XP"><img src={img("star")} alt="" /><span>{stats?.xp ?? user.xp ?? 0}</span></span>
          </>
        )}
        <ThemeToggle />
      </div>
    </div></div>
  );
}
