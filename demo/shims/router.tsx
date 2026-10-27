/**
 * Routeur en mémoire qui remplace next/navigation et next/link dans la version démo.
 * L'adresse du navigateur ne change pas : la page démo tourne dans un cadre (artifact).
 */
import { createContext, useContext, useMemo, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent, type ReactNode } from "react";

type Loc = { path: string; search: string };
const KEY = "pi-academy-demo-route";

function initial(): Loc {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Loc;
  } catch { /* stockage indisponible */ }
  return { path: "/", search: "" };
}

let loc: Loc = initial();
const listeners = new Set<() => void>();

function go(href: string, replace: boolean) {
  const [p, q = ""] = href.split("?");
  const path = p.startsWith("/") ? p : "/" + p;
  loc = { path: path.replace(/\/+$/, "") || "/", search: q };
  try { sessionStorage.setItem(KEY, JSON.stringify(loc)); } catch { /* stockage indisponible */ }
  if (!replace) window.scrollTo(0, 0);
  listeners.forEach((l) => l());
}

export const navigate = (href: string) => go(href, false);

export function useLocation(): Loc {
  return useSyncExternalStore((cb) => { listeners.add(cb); return () => listeners.delete(cb); }, () => loc, () => loc);
}

/* ---------- next/navigation ---------- */

const ParamsCtx = createContext<Record<string, string>>({});
export const ParamsProvider = ({ params, children }: { params: Record<string, string>; children: ReactNode }) =>
  <ParamsCtx.Provider value={params}>{children}</ParamsCtx.Provider>;

export function useRouter() {
  return useMemo(() => ({
    push: (h: string) => go(h, false),
    replace: (h: string) => go(h, true),
    back: () => go("/", false),
    refresh: () => listeners.forEach((l) => l()),
    prefetch: () => {},
  }), []);
}
export const useParams = <T extends Record<string, string>>() => useContext(ParamsCtx) as T;
export const usePathname = () => useLocation().path;
export function useSearchParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}
export const redirect = (h: string) => go(h, true);
export const notFound = () => go("/", true);

/* ---------- next/link ---------- */

export default function Link({ href, children, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean }) {
  const { prefetch: _p, ...a } = rest as typeof rest & { prefetch?: boolean };
  void _p;
  const click = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    go(href, false);
  };
  return <a href="#" {...a} onClick={click}>{children}</a>;
}
