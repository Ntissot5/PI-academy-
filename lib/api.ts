"use client";
import { pb } from "./pb";
import type { Progression } from "./mastery";

/** gel : jour manqué couvert par un gel de série. */
export interface DayStat { date: string; minutes: number; gel?: boolean }
export interface Stats {
  xp: number;
  streak: number;
  /** Gels de série en réserve (1 tous les 7 jours d'affilée, 2 au plus). */
  gels?: number;
  today: string;
  minutesToday: number;
  goal: number;
  days: DayStat[];
  answered: number;
}

export interface Parcours {
  id: string;
  slug: string;
  titre: string;
  accroche: string;
  description: string;
  public: "ecole" | "adulte";
  niveau: string;
  icone: string;
  ordre: number;
  payant: boolean;
  matiere: string;
  plan: "libre" | "per" | "lp21" | "pds" | "";
  annee_min: number;
  annee_max: number;
  cantons: string[] | null;
  statut: "publie" | "a_valider" | "";
  /** Parcours créé depuis le PER : un par année et par discipline. */
  auto?: boolean;
}

export interface Matiere { id: string; slug: string; nom: string; domaine: string; icone: string; ordre: number }
export const listMatieres = () => pb().collection("matieres").getFullList<Matiere>({ sort: "ordre" });

export interface Unite {
  id: string;
  ordre: number;
  id_generateur: string;
  titre: string;
  sous_titre: string;
  regle: string;
  exemple: string;
  image: string;
  piege: string;
  icone: string;
  /** bientot : notion PER sans exercice encore, visible mais verrouillée. */
  statut?: "actif" | "bientot" | "";
  per_codes?: string[];
  /** Clés des progressions officielles (collection per_notion). */
  per_notions?: string[];
  annee?: string;
  tag?: string;
  progression: Progression | null;
}

export interface Etat { stats: Stats; parcours: Parcours; unites: Unite[]; canton: string; matiere: { slug: string; nom: string } | null }

export interface Reponse { ok: boolean; enonce: string; reponse: string; bonne: string }
export interface SeriePayload {
  serie: string;
  unite: string;
  mode: "entrainement" | "boss";
  minutes: number;
  reponses: Reponse[];
  terminee: boolean;
}
export interface SerieResult {
  xp: number; bonus: number; valide: boolean; nouveau: boolean; stats: Stats;
  /** Présent quand la série était une révision prévue. */
  revision?: { reussie: boolean; prochaine: string; intervalle: number };
}

/** Unités à réviser aujourd'hui (répétition espacée), dans tous les parcours ouverts à l'utilisateur. */
export interface Revision {
  parcours: string; parcours_titre: string; ordre: number; titre: string; icone: string; id_generateur: string;
  revision_le: string; intervalle: number;
}
export const getRevisions = () => pb().send<{ today: string; revisions: Revision[] }>("/api/pi/revisions", {});

export const getEtat = (slug: string) =>
  pb().send<Etat>("/api/pi/etat", { query: { parcours: slug } });

export const getStats = () => pb().send<{ stats: Stats }>("/api/pi/etat", {}).then((r) => r.stats);

export const markLesson = (unite: string) =>
  pb().send("/api/pi/lecon", { method: "POST", body: { unite } });

export const listParcours = () =>
  pb().collection("parcours").getFullList<Parcours>({ sort: "ordre" });

/* ---------- séries : envoi cumulatif, avec file d'attente hors ligne ---------- */

const PENDING = "pi-pending-series";

function readPending(): Record<string, SeriePayload> {
  try { return JSON.parse(localStorage.getItem(PENDING) || "{}"); } catch { return {}; }
}
function writePending(p: Record<string, SeriePayload>) {
  try { localStorage.setItem(PENDING, JSON.stringify(p)); } catch { /* stockage indisponible */ }
}

/** Envoie l'état cumulé d'une série. En cas d'échec, il est gardé et renvoyé plus tard. */
export async function sendSerie(p: SeriePayload, opts: { keepalive?: boolean } = {}): Promise<SerieResult | null> {
  const pending = readPending();
  pending[p.serie] = p;
  writePending(pending);
  try {
    const r = await pb().send<SerieResult>("/api/pi/serie", { method: "POST", body: p, keepalive: opts.keepalive });
    const after = readPending();
    if (after[p.serie] === undefined || after[p.serie].reponses.length <= p.reponses.length) {
      delete after[p.serie];
      writePending(after);
    }
    return r;
  } catch {
    return null;
  }
}

/** Renvoie les séries restées en attente (réseau coupé, onglet fermé…). */
export async function flushPending(): Promise<void> {
  if (!pb().authStore.isValid) return;
  for (const p of Object.values(readPending())) await sendSerie(p);
}

export const newSerieId = () =>
  Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => (b % 36).toString(36)).join("");

/* ---------- élèves ---------- */

export interface EleveAuth { code: string; pseudo: string; pin: string }

async function eleveAuth(path: string, body: EleveAuth) {
  const r = await pb().send<{ token: string; record: Record<string, unknown> }>(path, { method: "POST", body });
  pb().authStore.save(r.token, r.record as never);
  return r.record;
}
export const eleveRejoindre = (b: EleveAuth) => eleveAuth("/api/pi/eleve/rejoindre", b);
export const eleveConnexion = (b: EleveAuth) => eleveAuth("/api/pi/eleve/connexion", b);

/* ---------- prof ---------- */

export interface Classe { id: string; nom: string; code: string; parcours_assignes: string[]; prof: string; canton: string }
export interface BoardUnite {
  id: string; ordre: number; titre: string; id_generateur: string; icone: string;
  statut?: string; per_codes?: string[]; annee?: string;
}
export interface BoardParcours { id: string; slug: string; titre: string; ordre: number; matiere?: string; annee_min?: number; annee_max?: number; unites: BoardUnite[] }
export interface BoardEleve {
  id: string;
  pseudo: string;
  xp: number;
  derniere_session: string;
  nouveau: boolean;
  bloque: boolean;
  raisons: string[];
  erreurs: number;
  progression: Record<string, Progression & { boss_rates: number }>;
}
export interface Board { today: string; classe: Classe; parcours: BoardParcours[]; eleves: BoardEleve[] }
export interface Erreur { id: string; unite: string; enonce: string; reponse_donnee: string; bonne_reponse: string; date: string; created: string }

export const listClasses = (prof: string) =>
  pb().collection("classes").getFullList<Classe>({ filter: pb().filter("prof = {:p}", { p: prof }), sort: "created" });
export const createClasse = (prof: string, nom: string, canton: string) =>
  pb().collection("classes").create<Classe>({ prof, nom, canton, parcours_assignes: [] });
export const setParcoursAssignes = (id: string, ids: string[]) =>
  pb().collection("classes").update<Classe>(id, { parcours_assignes: ids });
export const getBoard = (id: string) => pb().send<Board>(`/api/pi/prof/classe/${id}`, {});
export const lastErrors = (eleve: string) =>
  pb().collection("erreurs").getList<Erreur>(1, 10, { filter: pb().filter("utilisateur = {:u}", { u: eleve }), sort: "-created" }).then((r) => r.items);
export const resetPin = (eleve: string, pin: string) =>
  pb().send(`/api/pi/prof/eleve/${eleve}/pin`, { method: "POST", body: { pin } });
export const removeEleve = (eleve: string) => pb().collection("users").delete(eleve);

/* ---------- Plan d'études romand : texte officiel (prof, admin) ---------- */

export interface PerNotion {
  id: string; cle: string; code: string; discipline: string; cycle: number;
  annee_debut: number; annee_fin: number; notion: string; contenu: string[]; niveau: string; source_url: string; ordre: number;
}
/** Progressions officielles d'une unité, dans l'ordre du PER. */
export function getPerNotions(cles: string[]) {
  const ok = cles.filter((c) => /^[0-9a-f]{12}$/.test(c)).slice(0, 60);
  if (!ok.length) return Promise.resolve([] as PerNotion[]);
  return pb().collection("per_notion").getFullList<PerNotion>({ filter: ok.map((c) => `cle = "${c}"`).join(" || "), sort: "ordre" });
}
