import { R, pick } from "../math";
import type { Question } from "./types";
import { NOMEN, avecArt } from "./data/l2-woerter";

const PRON = { der: "er", die: "sie", das: "es" } as const;
const FIN = ["hier", "dort", "sehr gross", "sehr klein"];
const THEMES = ["famille", "école", "animaux", "maison", "vêtements", "ville"];

/** Remplacer un groupe nominal par er, sie, es ou sie (pluriel). */
export function gen(): Question {
  const n = pick(NOMEN.filter((x) => x.pl && THEMES.includes(x.theme) && x.de !== "Familie"));
  const fin = pick(FIN);
  const pluriel = n.pl !== n.de && R(0, 3) === 0;
  const groupe = pluriel ? `Die ${n.pl}` : `${avecArt(n).charAt(0).toUpperCase()}${avecArt(n).slice(1)}`;
  const verbe = pluriel ? "sind" : "ist";
  const a = pluriel ? "sie" : PRON[n.art];
  return {
    q: `Remplace par un pronom : <b>${groupe} ${verbe} ${fin}.</b> → <b>…</b> ${verbe} ${fin}.`,
    txt: 1,
    a,
    choices: ["er", "sie", "es"],
    why: pluriel
      ? `${groupe} : pluriel → sie (${a} ${verbe} ${fin}).`
      : `${avecArt(n)} : ${n.art} → ${a}.${n.de === "Mädchen" ? " Das Mädchen est neutre, donc es, même si c’est une fille !" : n.art === "das" && n.personne ? " Le pronom suit le genre du mot, pas le sexe de la personne." : n.art === "die" && !n.personne ? ` Une chose féminine se remplace aussi par sie.` : ""}`,
  };
}
