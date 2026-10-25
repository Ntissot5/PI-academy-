import { pick } from "../math";
import { qcm, tirer } from "./f-outils";
import type { Question } from "./types";

const SIGNES = ["la virgule", "le point-virgule", "les deux-points", "le point", "le point d’interrogation", "le point d’exclamation", "les points de suspension", "les guillemets", "le tiret", "les parenthèses"];

/* [signe montré, nom]. */
const NOMS: readonly (readonly [string, string])[] = [
  [";", "le point-virgule"], [":", "les deux-points"], ["…", "les points de suspension"], ["« »", "les guillemets"], ["—", "le tiret"],
  ["( )", "les parenthèses"], ["!", "le point d’exclamation"], ["?", "le point d’interrogation"], [",", "la virgule"],
];

function nom(): Question {
  const [s, n] = pick(NOMS);
  return qcm(`Comment s’appelle ce signe : <b>${s}</b> ?`, n, SIGNES, `« ${s} » : ${n}.`);
}

/* [rôle, signe]. */
const ROLES: readonly (readonly [string, string])[] = [
  ["annonce une énumération, une explication ou des paroles rapportées", "les deux-points"],
  ["encadrent les paroles rapportées directement", "les guillemets"],
  ["indique, dans un dialogue, que quelqu’un d’autre prend la parole", "le tiret"],
  ["marque une phrase inachevée, une hésitation ou une suite qu’on ne dit pas", "les points de suspension"],
  ["sépare les éléments d’une énumération", "la virgule"],
  ["termine une phrase qui pose une question directe", "le point d’interrogation"],
  ["sépare deux parties de phrase liées par le sens, plus fortement qu’une virgule, mais moins qu’un point", "le point-virgule"],
  ["encadrent une précision que l’on pourrait supprimer, comme une date ou une explication", "les parenthèses"],
];

function role(): Question {
  const [r, s] = pick(ROLES);
  return qcm(`Quel signe <b>${r}</b> ?`, s, SIGNES, `C’est ${s}.`);
}

/* [phrase correcte, fautes, explication]. */
const PHRASES: readonly (readonly [string, readonly string[], string])[] = [
  ["J’ai invité Léa, Noé, Sami et Zoé.", ["J’ai invité Léa Noé Sami et Zoé.", "J’ai invité, Léa, Noé, Sami, et Zoé.", "J’ai invité Léa, Noé, Sami, et, Zoé."], "Dans une énumération, une virgule sépare les éléments ; pas de virgule avant le dernier « et »."],
  ["Lucas, viens ici !", ["Lucas viens, ici !", "Lucas viens ici, !", "Lucas, viens, ici !"], "La personne à qui l’on parle (« Lucas ») est séparée par une virgule."],
  ["« Où vas-tu ? » demanda Lina.", ["« Où vas-tu. » demanda Lina.", "« Où vas-tu ? », demanda Lina.", "Où vas-tu ? « demanda Lina »."], "Les guillemets encadrent les paroles ; le point d’interrogation reste à l’intérieur, sans virgule ensuite."],
  ["Dans mon sac, il y a : un livre, une gomme et une règle.", ["Dans mon sac, il y a, un livre : une gomme et une règle.", "Dans mon sac il y a un livre une gomme et une règle.", "Dans mon sac : il y a, un livre, une gomme, et une règle."], "Les deux-points annoncent l’énumération, puis des virgules séparent les éléments."],
  ["Le lac de Neuchâtel (le plus grand lac entièrement suisse) est très calme.", ["Le lac de Neuchâtel, (le plus grand lac entièrement suisse est très calme).", "Le lac de Neuchâtel (le plus grand lac entièrement suisse est très calme.)", "(Le lac de Neuchâtel) le plus grand lac entièrement suisse est très calme."], "Les parenthèses encadrent seulement la précision qu’on pourrait supprimer."],
  ["Il hésita… puis il sauta dans l’eau.", ["Il hésita, … puis il sauta dans l’eau.", "Il hésita… Puis il sauta dans l’eau…?", "Il hésita : … puis il sauta dans l’eau."], "Les points de suspension marquent l’hésitation."],
];

function corrige(): Question {
  const [a, faux, why] = pick(PHRASES);
  return qcm("Quelle phrase est correctement ponctuée ?", a, faux, why);
}

function graphique(): Question {
  const signes = ["la virgule", "le point", "les deux-points", "le point-virgule", "le point d’interrogation"];
  const graph = pick(["la majuscule", "le trait d’union", "l’apostrophe"]);
  return qcm(
    "Lequel de ces éléments n’est <b>pas</b> un signe de ponctuation, mais un signe graphique ?",
    graph,
    signes,
    `${graph[0].toUpperCase() + graph.slice(1)} est un signe graphique : elle ne découpe pas la phrase comme les signes de ponctuation.`.replace("Le trait d’union est un signe graphique : elle", "Le trait d’union est un signe graphique : il").replace("L’apostrophe est un signe graphique : elle", "L’apostrophe est un signe graphique : elle"),
  );
}

/** Ponctuation : noms et rôles des signes, phrases bien ponctuées. */
export function gen(): Question {
  return tirer([nom, role, role, corrige, corrige, graphique]);
}
