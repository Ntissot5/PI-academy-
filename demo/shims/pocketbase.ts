/**
 * Fausse PocketBase pour la version démo : même interface que le SDK utilisé par l'appli
 * (authStore, collection(), send(), filter()), données dans le localStorage du navigateur.
 * Les routes /api/pi/* reprennent la logique de pocketbase/pb_hooks (séries, leçons, état,
 * élèves, tableau du prof). Rien ne part sur internet.
 */
import seed from "../../pocketbase/seed/parcours.json";
import seedPer from "../../pocketbase/seed/parcours-per.json";
import perNotions from "../../data/per/per_notions.json";
import { prochainIntervalle, serieAvecGels } from "./memoire";

type Rec = Record<string, any> & { id: string; collectionName: string; created: string; updated: string };
interface Store { db: Record<string, Rec[]>; pw: Record<string, string> }

const DB_KEY = "pi-academy-demo-db-v2";
const AUTH_KEY = "pi-academy-demo-auth-v1";
const COLS = ["users", "parcours", "unites", "matieres", "classes", "progressions", "sessions", "erreurs"];

/* ---------- utilitaires ---------- */

const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(15)), (b) => "abcdefghijklmnopqrstuvwxyz0123456789"[b % 36]).join("");
const now = () => new Date().toISOString().replace("T", " ");

function lastSundayUtc(y: number, m: number) {
  const last = new Date(Date.UTC(y, m + 1, 0));
  return Date.UTC(y, m, last.getUTCDate() - last.getUTCDay(), 1);
}
/** Jour calendaire Europe/Zurich (même règle que pocketbase/pb_hooks/lib/zurich.js). */
export function zurichDate(ms = Date.now()) {
  const y = new Date(ms).getUTCFullYear();
  const off = ms >= lastSundayUtc(y, 2) && ms < lastSundayUtc(y, 9) ? 2 : 1;
  return new Date(ms + off * 3600000).toISOString().slice(0, 10);
}
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };

export class ClientResponseError extends Error {
  status: number;
  url: string;
  response: { message: string; data: Record<string, { code: string; message: string }>; status: number };
  isAbort = false;
  originalError = null;
  constructor(status: number, message: string, url = "", data: Record<string, { code: string; message: string }> = {}) {
    super(message);
    this.status = status;
    this.url = url;
    this.response = { message, data, status };
  }
}
const fail = (status: number, message: string, url = "", data = {}) => { throw new ClientResponseError(status, message, url, data); };

/* ---------- stockage ---------- */

let store: Store = { db: {}, pw: {} };
const subs: Record<string, Set<(e: { action: string; record: Rec }) => void>> = {};

function load(): Store {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (raw) return JSON.parse(raw) as Store;
  } catch { /* stockage indisponible */ }
  return seedStore();
}
function persist() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(store)); } catch { /* stockage plein ou bloqué */ }
}
function emit(col: string, action: string, record: Rec) {
  subs[col]?.forEach((cb) => cb({ action, record }));
}
// Autre onglet : la base a changé, on recharge et on prévient les écrans abonnés (prof en temps réel).
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key !== DB_KEY || !e.newValue) return;
    store = JSON.parse(e.newValue);
    for (const c of ["progressions", "sessions", "erreurs", "users"]) emit(c, "update", { id: "", collectionName: c, created: "", updated: "" });
  });
}

const T = (c: string) => (store.db[c] ??= []);
function insert(col: string, data: Record<string, any>): Rec {
  const r = { ...data, id: data.id ?? rid(), collectionName: col, collectionId: col, created: data.created ?? now(), updated: now() } as Rec;
  T(col).push(r);
  return r;
}

export function resetDemo() {
  store = seedStore();
  persist();
  auth.clear();
}

/* ---------- données de départ (mêmes que le seed --demo) ---------- */

function seedStore(): Store {
  const s: Store = { db: Object.fromEntries(COLS.map((c) => [c, []])), pw: {} };
  const prev = store;
  store = s;
  const matId: Record<string, string> = {};
  for (const m of (seed as any).matieres ?? []) matId[m.slug] = insert("matieres", m).id;
  const bySlug: Record<string, Rec> = {};
  for (const { unites, ...p } of [...(seed as any).parcours, ...(seedPer as any).parcours]) {
    const rec = insert("parcours", { cantons: [], ...p, matiere: matId[p.matiere] ?? "" });
    bySlug[p.slug] = rec;
    for (const u of unites) insert("unites", { ...u, parcours: rec.id });
  }
  const user = (email: string, password: string, extra: Record<string, any>) => {
    const u = insert("users", { email, emailVisibility: false, verified: true, xp: 0, theme: "", canton: "", pseudo: "", classe: "", name: "", ...extra });
    s.pw[u.id] = password;
    return u;
  };
  user("adulte.demo@example.ch", "demo-adulte-2026", { role: "adulte", name: "Adulte démo" });
  user("admin.demo@example.ch", "demo-admin-2026", { role: "admin", name: "Admin démo" });
  const prof = user("prof.demo@example.ch", "demo-prof-2026", { role: "prof", name: "Prof démo", canton: "VD" });
  const classe = insert("classes", { prof: prof.id, nom: "Classe démo 9e", code: "DEMO42", canton: "VD", parcours_assignes: [bySlug["9e-bases"].id, bySlug["francais-conjugaison"]?.id].filter(Boolean) });
  const units = T("unites").filter((u) => u.parcours === bySlug["9e-bases"].id).sort((a, b) => a.ordre - b.ordre);
  const today = zurichDate();
  const DEMO: [string, number, Record<string, any>[], number[], boolean][] = [
    ["Démo-Alex", 380, [{ u: 0, lecon_lue: true, nb_entrainements: 2, meilleur_entrainement: 9, nb_boss: 1, meilleur_boss: 9, valide: true, revision_le: today, intervalle: 1 }, { u: 1, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 8 }, { u: 2, lecon_lue: true }], [0, 1, 2], false],
    ["Démo-Sam", 210, [{ u: 0, lecon_lue: true, nb_entrainements: 3, meilleur_entrainement: 8, nb_boss: 2, meilleur_boss: 6, boss_rates: 2 }], [0, 3], true],
    ["Démo-Lou", 40, [{ u: 0, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 4 }], [10], false],
  ];
  for (const [pseudo, xp, progs, days, errs] of DEMO) {
    const e = user("", "1234", { role: "eleve", pseudo, classe: classe.id, xp, pin_echecs: 0, pin_bloque_jusqua: "" });
    for (const { u, ...p } of progs) insert("progressions", { meilleur_entrainement: 0, meilleur_boss: 0, nb_entrainements: 0, nb_boss: 0, boss_rates: 0, valide: false, lecon_lue: false, ...p, utilisateur: e.id, unite: units[u].id });
    days.forEach((off, k) => insert("sessions", { utilisateur: e.id, serie: `demo${e.id}${k}`, unite: units[0].id, mode: "entrainement", date: addDays(today, -off), minutes: 14, total: 10, bonnes: 7, xp_gagne: 70, terminee: true }));
    if (errs) for (const [enonce, rep, bonne] of [["−7 − (−3)", "−10", "−4"], ["12 + (−18)", "6", "−6"], ["−4 × (−5)", "−20", "20"]]) {
      insert("erreurs", { utilisateur: e.id, unite: units[0].id, enonce, reponse_donnee: rep, bonne_reponse: bonne, date: today });
    }
  }
  store = prev;
  return s;
}

// Chargement initial, une fois toutes les fonctions ci-dessus définies.
store = load();

/* ---------- filtres et tri (sous-ensemble de la syntaxe PocketBase) ---------- */

function matches(r: Rec, filter?: string): boolean {
  if (!filter) return true;
  if (filter.includes("||")) return filter.split("||").some((f) => matches(r, f));
  return filter.split("&&").every((part) => {
    const m = part.trim().match(/^([\w.]+)\s*(=|!=)\s*(?:"((?:[^"\\]|\\.)*)"|'([^']*)'|(\S+))$/);
    if (!m) return true;
    const [, field, op, dq, sq, raw] = m;
    const want = dq ?? sq ?? raw;
    const v = r[field];
    const eq = Array.isArray(v) ? v.includes(want) : String(v ?? "") === String(want);
    return op === "=" ? eq : !eq;
  });
}
function sorted(list: Rec[], sort?: string) {
  if (!sort) return list;
  const keys = sort.split(",").map((k) => k.trim()).filter(Boolean);
  return [...list].sort((a, b) => {
    for (const k of keys) {
      const desc = k.startsWith("-"), f = desc ? k.slice(1) : k;
      const x = a[f], y = b[f];
      if (x === y) continue;
      const c = typeof x === "number" && typeof y === "number" ? x - y : String(x ?? "").localeCompare(String(y ?? ""), "fr");
      return desc ? -c : c;
    }
    return 0;
  });
}
const pub = (r: Rec) => {
  const { pin_echecs: _a, pin_bloque_jusqua: _b, ...rest } = r;
  void _a; void _b;
  return structuredClone(rest);
};

/* ---------- authentification ---------- */

type AuthCb = (token: string, record: Rec | null) => void;
class AuthStore {
  token = "";
  record: Rec | null = null;
  private cbs = new Set<AuthCb>();
  constructor() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) { const a = JSON.parse(raw); this.token = a.token; this.record = a.record; }
    } catch { /* stockage indisponible */ }
  }
  get isValid() { return !!this.token && !!this.record; }
  get model() { return this.record; }
  save(token: string, record: Rec | null) {
    this.token = token;
    this.record = record;
    try { localStorage.setItem(AUTH_KEY, JSON.stringify({ token, record })); } catch { /* stockage indisponible */ }
    this.cbs.forEach((cb) => cb(token, record));
  }
  clear() {
    this.token = "";
    this.record = null;
    try { localStorage.removeItem(AUTH_KEY); } catch { /* stockage indisponible */ }
    this.cbs.forEach((cb) => cb("", null));
  }
  onChange(cb: AuthCb, fire = false) {
    this.cbs.add(cb);
    if (fire) cb(this.token, this.record);
    return () => { this.cbs.delete(cb); };
  }
}
const auth = new AuthStore();
const me = () => (auth.record ? T("users").find((u) => u.id === auth.record!.id) ?? null : null);
const login = (u: Rec) => { const record = pub(u); auth.save("demo." + u.id, record); return { token: auth.token, record }; };

/** Connexion directe (bandeau démo) : entre avec un compte démo sans taper le mot de passe. */
export function demoLogin(kind: "adulte" | "prof" | "admin" | "eleve") {
  const u = kind === "eleve" ? T("users").find((x) => x.pseudo === "Démo-Alex") : T("users").find((x) => x.email === `${kind}.demo@example.ch`);
  if (u) login(u);
}

/* ---------- collections ---------- */

class Collection {
  constructor(private name: string) {}
  // Texte officiel du PER : en lecture seule, hors du localStorage (trop gros).
  private rows() { return this.name === "per_notion" ? (perNotions as unknown as Rec[]) : T(this.name); }
  private find(id: string) {
    const r = this.rows().find((x) => x.id === id);
    if (!r) fail(404, "The requested resource wasn't found.");
    return r!;
  }
  async getFullList<R = Rec>(opts: { filter?: string; sort?: string } = {}): Promise<R[]> {
    return sorted(this.rows().filter((r) => matches(r, opts.filter)), opts.sort).map(pub) as R[];
  }
  async getList<R = Rec>(page = 1, perPage = 30, opts: { filter?: string; sort?: string } = {}) {
    const all = await this.getFullList<R>(opts);
    return { page, perPage, totalItems: all.length, totalPages: Math.ceil(all.length / perPage), items: all.slice((page - 1) * perPage, page * perPage) };
  }
  async getOne<R = Rec>(id: string): Promise<R> { return pub(this.find(id)) as R; }
  async getFirstListItem<R = Rec>(filter: string): Promise<R> {
    const r = this.rows().find((x) => matches(x, filter));
    if (!r) fail(404, "The requested resource wasn't found.");
    return pub(r!) as R;
  }

  async create<R = Rec>(data: Record<string, any>): Promise<R> {
    const url = `/api/collections/${this.name}/records`;
    if (this.name === "users") {
      const { password = "", passwordConfirm, ...rest } = data;
      if (rest.role !== "adulte" && rest.role !== "prof") fail(400, "Failed to create record.", url);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(rest.email ?? "")) fail(400, "Failed to create record.", url, { email: { code: "validation_invalid_email", message: "" } });
      if (this.rows().some((u) => u.email && u.email.toLowerCase() === rest.email.toLowerCase())) fail(400, "Failed to create record.", url, { email: { code: "validation_not_unique", message: "" } });
      if (String(password).length < 8) fail(400, "Ton mot de passe doit faire au moins 8 caractères.", url);
      if (passwordConfirm !== undefined && passwordConfirm !== password) fail(400, "Failed to create record.", url, { passwordConfirm: { code: "validation_values_mismatch", message: "" } });
      const u = insert("users", { emailVisibility: false, verified: false, theme: "", canton: "", pseudo: "", classe: "", name: "", ...rest, xp: 0 });
      store.pw[u.id] = password;
      persist(); emit("users", "create", u);
      return pub(u) as R;
    }
    if (this.name === "classes") {
      const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
      let code = "";
      do code = Array.from(crypto.getRandomValues(new Uint8Array(6)), (b) => ALPHA[b % ALPHA.length]).join("");
      while (T("classes").some((c) => c.code === code));
      const r = insert("classes", { parcours_assignes: [], canton: "", ...data, code });
      persist(); emit("classes", "create", r);
      return pub(r) as R;
    }
    const r = insert(this.name, data);
    persist(); emit(this.name, "create", r);
    return pub(r) as R;
  }

  async update<R = Rec>(id: string, data: Record<string, any>): Promise<R> {
    const r = this.find(id);
    const { password: _p, passwordConfirm: _c, oldPassword: _o, ...rest } = data;
    void _p; void _c; void _o;
    Object.assign(r, rest, { updated: now() });
    persist(); emit(this.name, "update", r);
    if (this.name === "users" && auth.record?.id === id) auth.save(auth.token, pub(r));
    return pub(r) as R;
  }

  async delete(id: string) {
    this.find(id);
    store.db[this.name] = this.rows().filter((x) => x.id !== id);
    if (this.name === "users") {
      for (const c of ["progressions", "sessions", "erreurs"]) store.db[c] = T(c).filter((x) => x.utilisateur !== id);
      delete store.pw[id];
    }
    persist(); emit(this.name, "delete", { id, collectionName: this.name, created: "", updated: "" });
    return true;
  }

  async authWithPassword(identity: string, password: string) {
    const u = this.rows().find((x) => x.email && x.email.toLowerCase() === identity.toLowerCase() && x.role !== "eleve");
    if (!u || store.pw[u.id] !== password) fail(400, "Failed to authenticate.", `/api/collections/${this.name}/auth-with-password`);
    return login(u!);
  }

  async authRefresh() {
    const u = me();
    if (!u) fail(401, "The request requires valid record authorization token.");
    return login(u!);
  }

  async subscribe(_topic: string, cb: (e: { action: string; record: Rec }) => void) {
    (subs[this.name] ??= new Set()).add(cb);
    return async () => { subs[this.name]?.delete(cb); };
  }
  async unsubscribe() { delete subs[this.name]; }
}

/* ---------- routes /api/pi (logique de pocketbase/pb_hooks) ---------- */

const GOAL = 20, LEN = 10, PASS = 8, XP_GOOD = 10, XP_BOSS = 100, MAX_MIN = 30;

function requireAuth() {
  const u = me();
  if (!u) fail(401, "The request requires valid record authorization token.");
  return u!;
}

function userStats(uid: string) {
  const today = zurichDate();
  const days: Record<string, number> = {};
  let answered = 0;
  for (const s of T("sessions").filter((x) => x.utilisateur === uid)) {
    days[s.date] = (days[s.date] || 0) + (s.minutes || 0);
    answered += s.total || 0;
  }
  const serie = serieAvecGels(days, today);
  const cal = [];
  for (let i = 27; i >= 0; i--) { const k = addDays(today, -i); cal.push({ date: k, minutes: Math.round((days[k] || 0) * 10) / 10, gel: serie.geles.includes(k) }); }
  const u = T("users").find((x) => x.id === uid);
  return { xp: u?.xp ?? 0, streak: serie.streak, gels: serie.gels, today, minutesToday: Math.round(days[today] || 0), goal: GOAL, days: cal, answered };
}

function canOpen(u: Rec, p: Rec) {
  if (u.role !== "eleve") return true;
  const c = T("classes").find((x) => x.id === u.classe);
  return !!c && (c.parcours_assignes || []).includes(p.id);
}

const progOf = (uid: string, unite: string) => T("progressions").find((p) => p.utilisateur === uid && p.unite === unite);
function ensureProg(uid: string, unite: string) {
  return progOf(uid, unite) ?? insert("progressions", { utilisateur: uid, unite, meilleur_entrainement: 0, meilleur_boss: 0, nb_entrainements: 0, nb_boss: 0, boss_rates: 0, valide: false, lecon_lue: false });
}
const cleanStatement = (s: unknown) => String(s ?? "").slice(0, 600).replace(/<(?!\/?(sup|sub|b)>)[^>]*>/gi, "");
const cleanShort = (s: unknown) => String(s ?? "").replace(/[<>]/g, "").slice(0, 60);

function etat(slug?: string) {
  const u = requireAuth();
  const stats = userStats(u.id);
  if (!slug) return { stats };
  const p = T("parcours").find((x) => x.slug === slug);
  if (!p) fail(404, "Parcours introuvable.");
  if (!canOpen(u, p!)) fail(403, "Ce parcours n'est pas ouvert pour toi.");
  let canton = u.canton || "";
  if (!canton && u.classe) canton = T("classes").find((c) => c.id === u.classe)?.canton ?? "";
  if (!canton && u.role === "prof") canton = sorted(T("classes").filter((c) => c.prof === u.id && c.canton), "-created")[0]?.canton ?? "";
  const m = T("matieres").find((x) => x.id === p!.matiere);
  return {
    stats, canton, matiere: m ? { slug: m.slug, nom: m.nom } : null, parcours: pub(p!),
    unites: sorted(T("unites").filter((x) => x.parcours === p!.id), "ordre").map((x) => {
      const pr = progOf(u.id, x.id);
      return { ...pub(x), progression: pr ? { meilleur_entrainement: pr.meilleur_entrainement, meilleur_boss: pr.meilleur_boss, nb_entrainements: pr.nb_entrainements, nb_boss: pr.nb_boss, valide: pr.valide, lecon_lue: pr.lecon_lue, revision_le: pr.revision_le ?? "", intervalle: pr.intervalle ?? 0 } : null };
    }),
  };
}

function serie(body: any) {
  const u = requireAuth();
  const serieId = String(body.serie || "");
  if (!/^[a-z0-9]{8,40}$/.test(serieId)) fail(400, "Identifiant de série invalide.");
  const mode = body.mode === "boss" ? "boss" : "entrainement";
  const reponses = Array.isArray(body.reponses) ? body.reponses.slice(0, LEN) : [];
  const finished = body.terminee === true && reponses.length === LEN;
  const unite = T("unites").find((x) => x.id === body.unite);
  if (!unite) fail(404, "Unité introuvable.");
  const p = T("parcours").find((x) => x.id === unite!.parcours)!;
  if (!canOpen(u, p)) fail(403, "Ce parcours n'est pas ouvert pour toi.");
  if (unite!.statut === "bientot") fail(400, "Cette leçon arrive bientôt.");
  const out: any = { xp: 0, bonus: 0, valide: false, nouveau: false };

  let s = T("sessions").find((x) => x.utilisateur === u.id && x.serie === serieId);
  if (!s) s = insert("sessions", { utilisateur: u.id, serie: serieId, unite: unite!.id, mode, date: zurichDate(), minutes: 0, total: 0, bonnes: 0, xp_gagne: 0, terminee: false });
  if (s.unite !== unite!.id) fail(400, "Série déjà liée à une autre unité.");
  const fresh = reponses.slice(s.total);
  let good = 0;
  for (const r of fresh) {
    if (r && r.ok === true) { good++; continue; }
    const e = insert("erreurs", { utilisateur: u.id, unite: unite!.id, enonce: cleanStatement(r?.enonce), reponse_donnee: cleanShort(r?.reponse), bonne_reponse: cleanShort(r?.bonne), date: zurichDate() });
    emit("erreurs", "create", e);
  }
  let xp = good * XP_GOOD;
  s.minutes = Math.round(Math.min(Math.max(Number(body.minutes) || 0, s.minutes, 0), MAX_MIN) * 100) / 100;
  s.total = Math.max(s.total, reponses.length);
  s.bonnes += good;
  if (finished && !s.terminee) {
    s.terminee = true;
    const pr = ensureProg(u.id, unite!.id);
    const today = zurichDate();
    if (pr.valide && pr.revision_le && pr.revision_le <= today) {
      const iv = prochainIntervalle(pr.intervalle || 0, s.bonnes >= PASS);
      pr.intervalle = iv;
      pr.revision_le = addDays(today, iv);
      pr.nb_revisions = (pr.nb_revisions || 0) + 1;
      out.revision = { reussie: s.bonnes >= PASS, prochaine: pr.revision_le, intervalle: iv };
    }
    if (mode === "boss") {
      pr.nb_boss++;
      pr.meilleur_boss = Math.max(pr.meilleur_boss, s.bonnes);
      if (s.bonnes >= PASS) {
        out.valide = true;
        if (!pr.valide) { pr.valide = true; pr.intervalle = 1; pr.revision_le = addDays(today, 1); xp += XP_BOSS; out.bonus = XP_BOSS; out.nouveau = true; }
      } else pr.boss_rates++;
    } else {
      pr.nb_entrainements++;
      pr.meilleur_entrainement = Math.max(pr.meilleur_entrainement, s.bonnes);
    }
    emit("progressions", "update", pr);
  }
  s.xp_gagne += xp;
  u.xp = (u.xp || 0) + xp;
  out.xp = xp;
  persist();
  emit("sessions", "update", s);
  out.stats = userStats(u.id);
  return out;
}

/** Révisions du jour : comme la route /api/pi/revisions du serveur. */
function revisions() {
  const u = requireAuth();
  const today = zurichDate();
  const out = [];
  for (const pr of sorted(T("progressions").filter((p) => p.utilisateur === u.id && p.valide && p.revision_le && p.revision_le <= today), "revision_le").slice(0, 50)) {
    const un = T("unites").find((x) => x.id === pr.unite);
    const pc = un && T("parcours").find((x) => x.id === un.parcours);
    if (!un || !pc || !canOpen(u, pc)) continue;
    out.push({ parcours: pc.slug, parcours_titre: pc.titre, ordre: un.ordre, titre: un.titre, icone: un.icone, id_generateur: un.id_generateur, revision_le: pr.revision_le, intervalle: pr.intervalle });
  }
  return { today, revisions: out };
}

function lecon(body: any) {
  const u = requireAuth();
  const unite = T("unites").find((x) => x.id === body.unite);
  if (!unite) fail(404, "Unité introuvable.");
  const pr = ensureProg(u.id, unite!.id);
  if (!pr.lecon_lue) { pr.lecon_lue = true; persist(); emit("progressions", "update", pr); }
  return { ok: true };
}

const normCode = (s: unknown) => String(s || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
const normPseudo = (s: unknown) => String(s || "").trim().replace(/\s+/g, " ");
const findEleve = (classe: string, pseudo: string) => T("users").find((u) => u.role === "eleve" && u.classe === classe && u.pseudo.toLowerCase() === pseudo.toLowerCase());

function rejoindre(body: any) {
  const code = normCode(body.code), pseudo = normPseudo(body.pseudo), pin = String(body.pin || "");
  const classe = T("classes").find((c) => c.code === code);
  if (!classe) fail(400, "Ce code de classe n’existe pas. Vérifie-le avec ton prof.");
  if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,23}$/u.test(pseudo)) fail(400, "Ton pseudo fait 2 à 24 caractères : lettres, chiffres, espace, point, tiret.");
  if (!/^\d{4}$/.test(pin)) fail(400, "Le PIN fait 4 chiffres.");
  if (findEleve(classe!.id, pseudo)) fail(400, "Ce pseudo est déjà pris dans ta classe. Choisis-en un autre.");
  const u = insert("users", { role: "eleve", pseudo, classe: classe!.id, xp: 0, verified: true, email: "", theme: "", canton: "", name: "", pin_echecs: 0, pin_bloque_jusqua: "" });
  store.pw[u.id] = pin;
  persist(); emit("users", "create", u);
  return login(u);
}

function connexion(body: any) {
  const WRONG = "Code de classe, pseudo ou PIN incorrect.";
  const classe = T("classes").find((c) => c.code === normCode(body.code));
  if (!classe) fail(400, WRONG);
  const u = findEleve(classe!.id, normPseudo(body.pseudo));
  if (!u) fail(400, WRONG);
  const until = u!.pin_bloque_jusqua ? Date.parse(u!.pin_bloque_jusqua) : 0;
  if (until > Date.now()) fail(429, `Trop d’essais. Réessaie dans ${Math.ceil((until - Date.now()) / 60000)} min, ou demande un nouveau PIN à ton prof.`);
  if (store.pw[u!.id] !== String(body.pin || "")) {
    u!.pin_echecs = (u!.pin_echecs || 0) + 1;
    if (u!.pin_echecs >= 5) {
      u!.pin_echecs = 0;
      u!.pin_bloque_jusqua = new Date(Date.now() + 10 * 60000).toISOString();
      persist();
      fail(429, "Trop d’essais. Réessaie dans 10 min, ou demande un nouveau PIN à ton prof.");
    }
    persist();
    const rest = 5 - u!.pin_echecs;
    fail(400, `${WRONG} Encore ${rest} essai${rest > 1 ? "s" : ""}.`);
  }
  u!.pin_echecs = 0;
  u!.pin_bloque_jusqua = "";
  persist();
  return login(u!);
}

function board(id: string) {
  const u = requireAuth();
  const classe = T("classes").find((c) => c.id === id);
  if (!classe || classe.prof !== u.id) fail(404, "Classe introuvable.");
  const today = zurichDate(), limit = addDays(today, -7);
  const unitTitle: Record<string, string> = {};
  const parcours = (classe!.parcours_assignes as string[]).map((pid) => T("parcours").find((p) => p.id === pid)).filter(Boolean).map((p) => ({
    id: p!.id, slug: p!.slug, titre: p!.titre, ordre: p!.ordre, matiere: p!.matiere, annee_min: p!.annee_min, annee_max: p!.annee_max,
    unites: sorted(T("unites").filter((x) => x.parcours === p!.id), "ordre").map((x) => { unitTitle[x.id] = x.titre; return { id: x.id, ordre: x.ordre, titre: x.titre, id_generateur: x.id_generateur, icone: x.icone, statut: x.statut || "actif", per_codes: x.per_codes ?? [], annee: x.annee ?? "" }; }),
  })).sort((a, b) => a.ordre - b.ordre);
  const eleves = sorted(T("users").filter((x) => x.role === "eleve" && x.classe === classe!.id), "pseudo").map((e) => {
    const progression: Record<string, any> = {};
    const raisons: string[] = [];
    for (const p of T("progressions").filter((x) => x.utilisateur === e.id)) {
      progression[p.unite] = { meilleur_entrainement: p.meilleur_entrainement, meilleur_boss: p.meilleur_boss, nb_entrainements: p.nb_entrainements, nb_boss: p.nb_boss, boss_rates: p.boss_rates, valide: p.valide, lecon_lue: p.lecon_lue };
      if (!p.valide && p.boss_rates >= 2 && unitTitle[p.unite]) raisons.push(`Boss « ${unitTitle[p.unite]} » raté ${p.boss_rates} fois`);
    }
    const last = sorted(T("sessions").filter((s) => s.utilisateur === e.id), "-date")[0]?.date ?? "";
    const joined = zurichDate(Date.parse(e.created.replace(" ", "T")));
    if (last && last < limit) raisons.unshift(`Aucune session depuis ${last.split("-").reverse().join(".")}`);
    else if (!last && joined < limit) raisons.unshift("Aucune session depuis son arrivée (7+ jours)");
    return { id: e.id, pseudo: e.pseudo, xp: e.xp, derniere_session: last, nouveau: !last && joined >= limit, bloque: raisons.length > 0, raisons, erreurs: T("erreurs").filter((x) => x.utilisateur === e.id).length, progression };
  });
  return { today, classe: pub(classe!), parcours, eleves };
}

function resetPin(id: string, body: any) {
  const u = requireAuth();
  const e = T("users").find((x) => x.id === id && x.role === "eleve");
  const c = e && T("classes").find((x) => x.id === e.classe);
  if (!e || !c || c.prof !== u.id) fail(404, "Élève introuvable.");
  if (!/^\d{4}$/.test(String(body.pin || ""))) fail(400, "Le PIN fait 4 chiffres.");
  store.pw[e!.id] = String(body.pin);
  e!.pin_echecs = 0;
  e!.pin_bloque_jusqua = "";
  persist();
  return { ok: true };
}

/* ---------- client ---------- */

export default class PocketBase {
  authStore = auth;
  baseURL: string;
  constructor(url = "") { this.baseURL = url; }
  autoCancellation() { return this; }
  collection(name: string) { return new Collection(name); }
  filter(raw: string, params: Record<string, unknown> = {}) {
    return raw.replace(/\{:(\w+)\}/g, (_, k) => JSON.stringify(params[k] ?? ""));
  }
  async send<R = any>(path: string, opts: { method?: string; body?: any; query?: Record<string, any> } = {}): Promise<R> {
    // Petite latence, comme un vrai serveur : les écrans de chargement restent cohérents.
    await new Promise((r) => setTimeout(r, 60));
    const body = opts.body ?? {};
    const m = path.match(/^\/api\/pi\/prof\/(classe|eleve)\/([^/]+)(\/pin)?$/);
    if (path === "/api/pi/etat") return etat(opts.query?.parcours) as R;
    if (path === "/api/pi/revisions") return revisions() as R;
    if (path === "/api/pi/serie") return serie(body) as R;
    if (path === "/api/pi/lecon") return lecon(body) as R;
    if (path === "/api/pi/eleve/rejoindre") return rejoindre(body) as R;
    if (path === "/api/pi/eleve/connexion") return connexion(body) as R;
    if (m && m[1] === "classe") return board(m[2]) as R;
    if (m && m[1] === "eleve" && m[3]) return resetPin(m[2], body) as R;
    return fail(404, "Route inconnue dans la démo.");
  }
}
