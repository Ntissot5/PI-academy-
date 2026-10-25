/**
 * Version démo de Pi Academy : le vrai code de l'appli (app/, components/, lib/), avec un routeur
 * en mémoire à la place de Next.js et une PocketBase simulée dans le navigateur.
 */
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";
import "../app/globals.css";
import "./demo.css";
import { StrictMode, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@/components/AppProvider";
import { TopBar } from "@/components/TopBar";
import { THEME_KEY, applyTheme } from "@/lib/theme";
import { ParamsProvider, navigate, useLocation } from "./shims/router";
import { demoLogin, resetDemo } from "./shims/pocketbase";
import Accueil from "@/app/page";
import Connexion from "@/app/connexion/page";
import Eleve from "@/app/eleve/page";
import Catalogue from "@/app/parcours/page";
import MatierePage from "@/app/matiere/[slug]/page";
import Dashboard from "@/app/parcours/[slug]/page";
import UnitPage from "@/app/parcours/[slug]/unite/[n]/page";
import Quiz from "@/app/parcours/[slug]/unite/[n]/quiz/page";
import Prof from "@/app/prof/page";
import Admin from "@/app/admin/page";

// Choix clair/sombre mémorisé, appliqué avant le premier rendu (THEME_BOOT dans le vrai site).
try {
  const t = localStorage.getItem(THEME_KEY);
  if (t === "clair" || t === "sombre") applyTheme(t);
} catch { /* stockage indisponible */ }

const ROUTES: [RegExp, string[], ComponentType][] = [
  [/^\/$/, [], Accueil],
  [/^\/connexion$/, [], Connexion],
  [/^\/eleve$/, [], Eleve],
  [/^\/parcours$/, [], Catalogue],
  [/^\/matiere\/([^/]+)$/, ["slug"], MatierePage],
  [/^\/parcours\/([^/]+)$/, ["slug"], Dashboard],
  [/^\/parcours\/([^/]+)\/unite\/([^/]+)$/, ["slug", "n"], UnitPage],
  [/^\/parcours\/([^/]+)\/unite\/([^/]+)\/quiz$/, ["slug", "n"], Quiz],
  [/^\/prof$/, [], Prof],
  [/^\/admin$/, [], Admin],
];

function Page() {
  const { path, search } = useLocation();
  for (const [re, names, C] of ROUTES) {
    const m = path.match(re);
    if (m) {
      const params = Object.fromEntries(names.map((n, i) => [n, decodeURIComponent(m[i + 1])]));
      // key : changer de page ou de paramètres remonte la page, comme une navigation Next.js.
      return <ParamsProvider params={params}><C key={path + "?" + search} /></ParamsProvider>;
    }
  }
  return <ParamsProvider params={{}}><Accueil /></ParamsProvider>;
}

function DemoBar() {
  const enter = (k: "adulte" | "prof" | "admin" | "eleve") => {
    demoLogin(k);
    navigate(k === "prof" ? "/prof" : k === "admin" ? "/admin" : "/parcours");
  };
  return (
    <div className="demo-bar pad">
      <div className="in">
        <span><b>Version démo</b> · tout reste dans ton navigateur. Entrer comme :</span>
        <span className="demo-btns">
          <button type="button" onClick={() => enter("adulte")}>Adulte</button>
          <button type="button" onClick={() => enter("eleve")}>Élève</button>
          <button type="button" onClick={() => enter("prof")}>Prof</button>
          <button type="button" onClick={() => enter("admin")}>Admin</button>
          <button type="button" className="reset" onClick={() => { resetDemo(); navigate("/"); location.reload(); }}>Remettre à zéro</button>
        </span>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <TopBar />
      <DemoBar />
      <main className="pad"><Page /></main>
    </AppProvider>
  );
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
