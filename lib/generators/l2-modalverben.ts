import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, maj, melange } from "./data/l2-outils";

type F6 = [string, string, string, string, string, string];
const MODAL: Record<string, { fr: string; f: F6 }> = {
  können: { fr: "pouvoir, savoir faire", f: ["kann", "kannst", "kann", "können", "könnt", "können"] },
  müssen: { fr: "devoir (c’est obligatoire)", f: ["muss", "musst", "muss", "müssen", "müsst", "müssen"] },
  wollen: { fr: "vouloir", f: ["will", "willst", "will", "wollen", "wollt", "wollen"] },
  dürfen: { fr: "avoir le droit de", f: ["darf", "darfst", "darf", "dürfen", "dürft", "dürfen"] },
  sollen: { fr: "devoir (on me le demande)", f: ["soll", "sollst", "soll", "sollen", "sollt", "sollen"] },
  möchten: { fr: "aimerait, voudrait", f: ["möchte", "möchtest", "möchte", "möchten", "möchtet", "möchten"] },
};
const SUJETS: [string, number][] = [["ich", 0], ["du", 1], ["Lena", 2], ["Tom", 2], ["wir", 3], ["ihr", 4], ["die Kinder", 5]];
// [milieu, infinitif]
const SUITE: [string, string][] = [
  ["heute Fussball", "spielen"], ["am Abend Deutsch", "lernen"], ["jetzt nach Hause", "gehen"], ["ein Eis", "essen"],
  ["im See", "schwimmen"], ["am Samstag ins Kino", "gehen"], ["das Fenster", "öffnen"], ["morgen früh", "aufstehen"],
];

/** Modalverben : conjuguer le verbe de mode ; l'infinitif part à la fin de la phrase. */
export function gen(): Question {
  const inf = pick(Object.keys(MODAL));
  const m = MODAL[inf];
  const [suj, p] = pick(SUJETS);
  const [milieu, verbe] = pick(SUITE);
  const forme = m.f[p];
  if (R(0, 2) > 0) {
    return {
      q: `Complète avec <b>${inf}</b> (${m.fr}) : <b>${maj(suj)} … ${milieu} ${verbe}.</b>`,
      txt: 1,
      a: forme,
      accept: [`${suj} ${forme}`],
      keys: KEYS_DE,
      hint: "Écris seulement le verbe de mode conjugué.",
      why: `${maj(suj)} ${forme} ${milieu} ${verbe}.${(p === 0 || p === 2) && inf !== "möchten" ? " Avec ich et er/sie/es, les verbes de mode n’ont pas de terminaison (ich kann, er kann)." : ""}${p < 3 && inf !== "möchten" && inf !== "sollen" ? " Attention au changement de voyelle au singulier." : ""}`,
    };
  }
  const juste = `${maj(suj)} ${forme} ${milieu} ${verbe}.`;
  const faux1 = `${maj(suj)} ${forme} ${verbe} ${milieu}.`;
  const faux2 = `${maj(suj)} ${milieu} ${forme} ${verbe}.`;
  return {
    q: `Quelle phrase est correcte ? (${inf} : ${m.fr})`,
    txt: 1,
    a: juste,
    choices: melange([juste, faux1, faux2]),
    why: `${juste} Le verbe de mode conjugué est en 2e position, l’infinitif tout à la fin.`,
  };
}
