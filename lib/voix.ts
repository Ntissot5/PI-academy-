/**
 * Lecture à voix haute avec la synthèse vocale du navigateur (Web Speech API) :
 * gratuite, hors ligne sur la plupart des appareils, et aucun texte ne quitte l'appareil.
 */
export type Langue = "fr" | "de" | "en";
const BCP47: Record<Langue, string[]> = { fr: ["fr-CH", "fr-FR", "fr"], de: ["de-CH", "de-DE", "de"], en: ["en-GB", "en-US", "en"] };

export const voixDisponible = () => typeof window !== "undefined" && "speechSynthesis" in window;

function voixPour(l: Langue): SpeechSynthesisVoice | undefined {
  const all = window.speechSynthesis.getVoices();
  for (const tag of BCP47[l]) {
    const v = all.find((x) => x.lang.toLowerCase() === tag.toLowerCase()) ?? all.find((x) => x.lang.toLowerCase().startsWith(tag.toLowerCase()));
    if (v) return v;
  }
  return undefined;
}

/** Texte lisible : sans balises, exposants lus « puissance », signes typographiques simplifiés. */
export function texteLisible(html: string): string {
  return html
    .replace(/<sup>\s*2\s*<\/sup>/g, " au carré").replace(/<sup>\s*3\s*<\/sup>/g, " au cube")
    .replace(/<sup>([^<]*)<\/sup>/g, " puissance $1").replace(/<sub>([^<]*)<\/sub>/g, " $1")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
    .replace(/−/g, " moins ").replace(/×|·/g, " fois ").replace(/÷/g, " divisé par ")
    .replace(/…/g, " … ").replace(/\s+/g, " ").trim();
}

/**
 * Découpe un énoncé : le texte en <b>…</b> est lu dans la langue étudiée (allemand, anglais),
 * le reste en français.
 */
export function segments(html: string, cible: Langue): { texte: string; langue: Langue }[] {
  if (cible === "fr") return [{ texte: texteLisible(html), langue: "fr" }];
  const out: { texte: string; langue: Langue }[] = [];
  const re = /<b>([\s\S]*?)<\/b>/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m.index > last) out.push({ texte: texteLisible(html.slice(last, m.index)), langue: "fr" });
    out.push({ texte: texteLisible(m[1]), langue: cible });
    last = m.index + m[0].length;
  }
  if (last < html.length) out.push({ texte: texteLisible(html.slice(last)), langue: "fr" });
  return out.filter((s) => s.texte && /[\p{L}\p{N}]/u.test(s.texte));
}

export function lire(parties: { texte: string; langue: Langue }[], vitesse = 0.95) {
  if (!voixDisponible()) return;
  const s = window.speechSynthesis;
  s.cancel();
  for (const p of parties) {
    const u = new SpeechSynthesisUtterance(p.texte);
    const v = voixPour(p.langue);
    if (v) u.voice = v;
    u.lang = v?.lang ?? BCP47[p.langue][1];
    u.rate = vitesse;
    s.speak(u);
  }
}

export const taire = () => { if (voixDisponible()) window.speechSynthesis.cancel(); };

/** Préférence de l'élève (par appareil) : lecture automatique oui / non. */
const CLE = "pi-voix-auto";
export function lectureAuto(defaut: boolean): boolean {
  try { const v = localStorage.getItem(CLE); return v === null ? defaut : v === "1"; } catch { return defaut; }
}
export function setLectureAuto(on: boolean) { try { localStorage.setItem(CLE, on ? "1" : "0"); } catch { /* stockage indisponible */ } }
