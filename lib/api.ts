"use client";
import { pb } from "./pb";
import type { Progression } from "./mastery";

export interface DayStat { date: string; minutes: number }
export interface Stats {
  xp: number;
  streak: number;
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
}

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
  progression: Progression | null;
}

export interface Etat { stats: Stats; parcours: Parcours; unites: Unite[] }

export interface Reponse { ok: boolean; enonce: string; reponse: string; bonne: string }
export interface SeriePayload {
  serie: string;
  unite: string;
  mode: "entrainement" | "boss";
  minutes: number;
  reponses: Reponse[];
  terminee: boolean;
}
export interface SerieResult { xp: number; bonus: number; valide: boolean; nouveau: boolean; stats: Stats }

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
