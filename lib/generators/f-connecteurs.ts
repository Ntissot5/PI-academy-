import { pick } from "../math";
import { deBanque, melange, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* Valeur d'un organisateur : [mot, valeur]. */
const VAL: readonly (readonly [string, string])[] = [
  ["parce que", "cause"], ["car", "cause"], ["puisque", "cause"], ["donc", "conséquence"], ["c’est pourquoi", "conséquence"],
  ["si bien que", "conséquence"], ["mais", "opposition"], ["pourtant", "opposition"], ["en revanche", "opposition"], ["par contre", "opposition"],
  ["d’abord", "énumération"], ["ensuite", "énumération"], ["enfin", "énumération"], ["premièrement", "énumération"],
  ["il était une fois", "temps"], ["le lendemain", "temps"], ["trois jours après", "temps"], ["soudain", "temps"], ["tout à coup", "temps"],
  ["finalement", "conclusion"], ["en conclusion", "conclusion"], ["pour conclure", "conclusion"], ["par exemple", "illustration"],
];
const VALEURS = ["cause", "conséquence", "opposition", "énumération", "temps", "conclusion", "illustration"];

function valeur(): Question {
  const [m, v] = pick(VAL);
  const autres = melange(VALEURS.filter((x) => x !== v)).slice(0, 3);
  return { q: `Quelle relation exprime l’organisateur <b>${m}</b> ?`, txt: 1, a: v, choices: melange([v, ...autres]), why: `« ${m} » exprime ${v === "temps" ? "le temps (organisateur temporel)" : `${v === "énumération" ? "une" : "la"} ${v}`}.` };
}

/* Choisir le connecteur qui convient. */
const CHOIX: readonly Item[] = [
  ["Il pleuvait, *…* nous sommes restés à l’intérieur.", "donc", ["mais", "car", "pourtant"], "La deuxième partie est la conséquence de la première : donc."],
  ["Je ne suis pas sorti *…* j’étais malade.", "parce que", ["donc", "pourtant", "ensuite"], "On donne la cause : parce que."],
  ["Il fait froid, *…* il porte un short.", "pourtant", ["donc", "car", "parce que"], "Les deux idées s’opposent : pourtant."],
  ["*…*, épluche les pommes ; ensuite, coupe-les en morceaux.", "D’abord", ["Enfin", "Pourtant", "Donc"], "Première étape d’une recette : d’abord."],
  ["Le chalet était calme. *…*, un bruit retentit.", "Soudain", ["Donc", "Car", "D’abord"], "Organisateur qui accélère le récit : soudain."],
  ["Les écrans fatiguent les yeux. *…*, il vaut mieux faire des pauses.", "C’est pourquoi", ["Pourtant", "Car", "D’abord"], "On tire une conséquence : c’est pourquoi."],
  ["Mon frère adore le ski ; ma sœur, *…*, préfère la natation.", "en revanche", ["donc", "car", "ensuite"], "Opposition entre deux préférences : en revanche."],
  ["Beaucoup d’animaux hibernent, *…* la marmotte.", "par exemple", ["pourtant", "donc", "enfin"], "On donne un exemple : par exemple."],
];

/** Organisateurs textuels et connecteurs : valeur et emploi. */
export function gen(): Question {
  return tirer([valeur, valeur, deBanque(CHOIX), deBanque(CHOIX)]);
}

