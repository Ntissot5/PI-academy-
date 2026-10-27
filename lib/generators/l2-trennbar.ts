import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, maj, melange } from "./data/l2-outils";

type F6 = [string, string, string, string, string, string];
// [infinitif, traduction, particule, présent (ich…sie), Partizip II, complément]
const V: [string, string, string, F6, string, string][] = [
  ["aufstehen", "se lever", "auf", ["stehe", "stehst", "steht", "stehen", "steht", "stehen"], "aufgestanden", "um sieben Uhr"],
  ["anrufen", "téléphoner à", "an", ["rufe", "rufst", "ruft", "rufen", "ruft", "rufen"], "angerufen", "Oma"],
  ["einkaufen", "faire les courses", "ein", ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"], "eingekauft", "im Supermarkt"],
  ["fernsehen", "regarder la télé", "fern", ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"], "ferngesehen", "am Abend"],
  ["mitkommen", "venir avec", "mit", ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], "mitgekommen", "heute"],
  ["aufräumen", "ranger", "auf", ["räume", "räumst", "räumt", "räumen", "räumt", "räumen"], "aufgeräumt", "das Zimmer"],
  ["anfangen", "commencer", "an", ["fange", "fängst", "fängt", "fangen", "fangt", "fangen"], "angefangen", "um acht Uhr"],
  ["abholen", "aller chercher", "ab", ["hole", "holst", "holt", "holen", "holt", "holen"], "abgeholt", "das Paket"],
  ["einladen", "inviter", "ein", ["lade", "lädst", "lädt", "laden", "ladet", "laden"], "eingeladen", "viele Freunde"],
  ["ankommen", "arriver", "an", ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"], "angekommen", "um zehn Uhr"],
  ["abfahren", "partir (en véhicule)", "ab", ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"], "abgefahren", "um neun Uhr"],
  ["zuhören", "écouter", "zu", ["höre", "hörst", "hört", "hören", "hört", "hören"], "zugehört", "gut"],
  ["anziehen", "mettre (un habit)", "an", ["ziehe", "ziehst", "zieht", "ziehen", "zieht", "ziehen"], "angezogen", "eine Jacke"],
  ["aufmachen", "ouvrir", "auf", ["mache", "machst", "macht", "machen", "macht", "machen"], "aufgemacht", "das Fenster"],
];
const SUJETS: [string, number][] = [["ich", 0], ["du", 1], ["Lena", 2], ["Tom", 2], ["wir", 3], ["ihr", 4], ["meine Eltern", 5]];

/** Trennbare Verben : la particule se détache et part à la fin. */
export function gen(): Question {
  const v = pick(V);
  const [inf, fr, part, f, pp, compl] = v;
  const t = R(0, 2);
  if (t === 2) {
    return {
      q: `Partizip II de <b>${inf}</b> (${fr}) ?`,
      txt: 1,
      a: pp,
      keys: KEYS_DE,
      why: `${inf} → ${pp} : le ge- se glisse entre la particule ${part}- et le verbe.`,
    };
  }
  const [suj, p] = pick(SUJETS);
  const forme = f[p];
  const juste = `${maj(suj)} ${forme} ${compl} ${part}.`;
  if (t === 1) {
    const faux = [`${maj(suj)} ${part}${forme} ${compl}.`, `${maj(suj)} ${forme} ${part} ${compl}.`, `${maj(suj)} ${compl} ${forme} ${part}.`];
    return {
      q: `Quelle phrase est correcte ? (${inf} : ${fr})`,
      txt: 1,
      a: juste,
      choices: melange([juste, ...faux]),
      why: `${juste} Le verbe conjugué est en 2e position et la particule ${part} part à la fin.`,
    };
  }
  return {
    q: `Conjugue <b>${inf}</b> (${fr}) : <b>${maj(suj)} … ${compl} … .</b>`,
    txt: 1,
    a: `${forme} ${part}`,
    accept: [`${forme} ... ${part}`, `${forme}…${part}`, `${forme} … ${part}`, `${forme}, ${part}`, `${suj} ${forme} ${compl} ${part}`],
    keys: KEYS_DE,
    hint: "Écris les deux morceaux, séparés par un espace.",
    why: `${juste} Au présent, la particule ${part} se détache et va à la fin de la phrase.`,
  };
}
