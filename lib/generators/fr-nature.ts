import { pick } from "../math";
import type { Question } from "./types";

const NATURES = ["nom", "verbe", "adjectif", "déterminant", "pronom", "adverbe", "préposition", "conjonction"] as const;

// [phrase avec le mot entre *étoiles*, nature]
const ITEMS: [string, (typeof NATURES)[number]][] = [
  ["Le *chien* aboie.", "nom"],
  ["Ma sœur *lit* un roman.", "verbe"],
  ["Il porte un pull *bleu*.", "adjectif"],
  ["*Le* train part à huit heures.", "déterminant"],
  ["*Elle* joue au foot.", "pronom"],
  ["Il court *vite*.", "adverbe"],
  ["Le livre est *sur* la table.", "préposition"],
  ["J’aime le thé *et* le café.", "conjonction"],
  ["Nous *mangeons* à midi.", "verbe"],
  ["Cette *montagne* est haute.", "nom"],
  ["Cette montagne est *haute*.", "adjectif"],
  ["*Cette* montagne est haute.", "déterminant"],
  ["Je *te* prête mon stylo.", "pronom"],
  ["Elle arrive *toujours* à l’heure.", "adverbe"],
  ["Il vient *de* Genève.", "préposition"],
  ["Il pleut, *mais* il fait chaud.", "conjonction"],
  ["Les élèves *travaillent* en silence.", "verbe"],
  ["Un *petit* oiseau chante.", "adjectif"],
  ["*Mes* parents sont au travail.", "déterminant"],
  ["*Nous* partons demain.", "pronom"],
  ["Le film était *très* drôle.", "adverbe"],
  ["Je vais à l’école *avec* mon frère.", "préposition"],
  ["Tu viens *ou* tu restes ?", "conjonction"],
  ["La *neige* tombe sur le village.", "nom"],
];

/** Nature (classe grammaticale) d'un mot dans une phrase. */
export function gen(): Question {
  const [phrase, nature] = pick(ITEMS);
  const others = NATURES.filter((n) => n !== nature).sort(() => Math.random() - 0.5).slice(0, 3);
  const choices = [nature, ...others].sort(() => Math.random() - 0.5);
  return {
    q: `Quelle est la nature du mot en gras ? ${phrase.replace(/\*(.+?)\*/, "<b>$1</b>")}`,
    txt: 1,
    a: nature,
    choices,
    why: `« ${phrase.match(/\*(.+?)\*/)![1]} » est un${nature === "préposition" || nature === "conjonction" ? "e" : ""} ${nature}.`,
  };
}
