import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, propositions } from "./data/l2-outils";

const H = ["zwölf", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
const heure = (h: number) => H[((h - 1) % 12) + 1];
const TAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

/** L'heure dite comme au quotidien (sur 12 heures). */
function dire(h: number, m: number): string {
  const suiv = heure(h + 1);
  switch (m) {
    case 0: return h === 1 ? "ein Uhr" : `${heure(h)} Uhr`;
    case 5: return `fünf nach ${heure(h)}`;
    case 10: return `zehn nach ${heure(h)}`;
    case 15: return `Viertel nach ${heure(h)}`;
    case 30: return `halb ${suiv}`;
    case 45: return `Viertel vor ${suiv}`;
    case 50: return `zehn vor ${suiv}`;
    default: return `fünf vor ${suiv}`;
  }
}
const MIN = [0, 5, 10, 15, 30, 45, 50, 55];
const affiche = (h: number, m: number) => `${h}:${String(m).padStart(2, "0")}`;

/** Uhrzeit, Tage und Monate. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 4) {
    const jours = R(0, 1) === 0;
    const liste = jours ? TAGE : MONATE;
    const i = R(0, liste.length - 1);
    const apres = R(0, 1) === 0;
    const a = liste[(i + (apres ? 1 : liste.length - 1)) % liste.length];
    return {
      q: `Quel ${jours ? "jour" : "mois"} vient juste ${apres ? "après" : "avant"} <b>${liste[i]}</b> ?`,
      txt: 1,
      a,
      accept: a === "Samstag" ? ["Sonnabend"] : [],
      keys: KEYS_DE,
      why: `${liste.join(", ")}.`,
    };
  }
  const h = R(1, 12);
  const m = pick(MIN);
  const a = dire(h, m);
  const voisins: [number, number][] = [[h, (m + 30) % 60], [h === 12 ? 1 : h + 1, m], [h === 1 ? 12 : h - 1, m], [h, m === 15 ? 45 : m === 45 ? 15 : m === 5 ? 55 : m === 55 ? 5 : m === 10 ? 50 : 10]];
  const piege = m === 30 ? `halb ${heure(h)}` : "";
  if (t >= 2) {
    const leurres = [piege, ...voisins.map(([hh, mm]) => dire(hh, mm))].filter(Boolean);
    return {
      q: `Il est <b>${affiche(h, m)}</b>. Comment le dit-on en allemand ?`,
      txt: 1,
      a: `Es ist ${a}.`,
      choices: propositions(`Es ist ${a}.`, leurres.map((x) => `Es ist ${x}.`)),
      why: `${affiche(h, m)} : Es ist ${a}.${m === 30 ? ` Attention : « halb ${heure(h + 1)} » = la moitié avant ${heure(h + 1)} heures, donc ${h}:30.` : m > 30 ? " vor = moins (avant l’heure suivante)." : m > 0 ? " nach = et (après l’heure)." : ""}`,
    };
  }
  const leurres = [...voisins.map(([hh, mm]) => affiche(hh, mm)), ...(m === 30 ? [affiche(h === 12 ? 1 : h + 1, 30)] : [])];
  return {
    q: `<b>Es ist ${a}.</b> Quelle heure est-il ?`,
    txt: 1,
    a: affiche(h, m),
    choices: propositions(affiche(h, m), leurres),
    why: `Es ist ${a} = ${affiche(h, m)}.${m === 30 ? ` halb ${heure(h + 1)} : la demi-heure avant ${heure(h + 1)} heures.` : ""}`,
  };
}
