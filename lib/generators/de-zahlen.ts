import { R } from "../math";
import type { Question } from "./types";

const U = ["null", "eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];
const TEEN: Record<number, string> = { 13: "dreizehn", 14: "vierzehn", 15: "fünfzehn", 16: "sechzehn", 17: "siebzehn", 18: "achtzehn", 19: "neunzehn" };
const TENS = ["", "", "zwanzig", "dreissig", "vierzig", "fünfzig", "sechzig", "siebzig", "achtzig", "neunzig"];

function under100(n: number): string {
  if (n <= 12) return U[n];
  if (n < 20) return TEEN[n];
  const t = Math.floor(n / 10), u = n % 10;
  return u === 0 ? TENS[t] : `${u === 1 ? "ein" : U[u]}und${TENS[t]}`;
}

/** Écriture en lettres, orthographe suisse (dreissig). Renvoie la forme principale et ses variantes. */
export function zahl(n: number): { a: string; accept: string[] } {
  if (n < 100) {
    const a = under100(n);
    return { a, accept: [a.replace("dreissig", "dreißig")] };
  }
  const h = Math.floor(n / 100), r = n % 100;
  const hund = `${h === 1 ? "" : U[h]}hundert`;
  const tail = r === 0 ? "" : under100(r);
  const a = hund + tail;
  const variants = [a, (h === 1 ? "ein" : "") + a];
  return { a, accept: [...variants, ...variants.map((v) => v.replace("dreissig", "dreißig"))] };
}

/** Zahlen : écrire un nombre en lettres. */
export function gen(): Question {
  const n = Math.random() < 0.6 ? R(13, 99) : R(100, 999);
  const { a, accept } = zahl(n);
  return {
    q: `Écris en lettres : <b>${n}</b>`,
    txt: 1,
    a,
    accept,
    keys: ["ä", "ö", "ü"],
    hint: "En un seul mot, sans espace.",
    why: `${n} = ${a}${n % 10 && n % 100 > 20 ? " : en allemand, on dit l’unité avant la dizaine." : "."}`,
  };
}
