import { etiquette, deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const DET = ["déterminant défini", "déterminant indéfini", "déterminant possessif", "déterminant démonstratif", "déterminant interrogatif", "déterminant numéral", "déterminant partitif"];
const RD: Record<string, string> = {
  "déterminant défini": "le, la, les, l’ (et au, aux) : le nom est connu.",
  "déterminant indéfini": "un, une, des, chaque, plusieurs, quelques… : le nom n’est pas précisé.",
  "déterminant possessif": "mon, ton, son, notre, leur… : il indique à qui appartient la chose.",
  "déterminant démonstratif": "ce, cet, cette, ces : il montre.",
  "déterminant interrogatif": "quel, quelle… : il pose une question.",
  "déterminant numéral": "deux, trois, cent… : il indique un nombre précis.",
  "déterminant partitif": "du, de la, de l’ : une partie d’une chose qu’on ne compte pas.",
};
const ID: readonly (readonly [string, string, string?])[] = [
  ["*Le* train part.", "déterminant défini"], ["*Les* élèves écoutent.", "déterminant défini"],
  ["J’ai vu *un* chamois.", "déterminant indéfini"], ["*Chaque* élève a un cahier.", "déterminant indéfini"], ["*Plusieurs* amis sont venus.", "déterminant indéfini"],
  ["*Notre* maison est petite.", "déterminant possessif"], ["Ils promènent *leur* chien.", "déterminant possessif"],
  ["*Cette* montagne est haute.", "déterminant démonstratif"], ["*Cet* arbre est centenaire.", "déterminant démonstratif"],
  ["*Quel* temps fait-il ?", "déterminant interrogatif"], ["*Quelle* heure est-il ?", "déterminant interrogatif"],
  ["*Deux* chats dorment.", "déterminant numéral"], ["Il a *vingt* ans.", "déterminant numéral"],
  ["Je bois *du* lait.", "déterminant partitif"], ["Elle mange *de la* confiture.", "déterminant partitif"],
];

const PRO = ["pronom personnel", "pronom possessif", "pronom démonstratif", "pronom relatif", "pronom interrogatif", "pronom indéfini"];
const RP: Record<string, string> = {
  "pronom personnel": "je, tu, il, nous, me, le, lui, leur, en, y…",
  "pronom possessif": "le mien, la tienne, les nôtres… : il remplace un nom en indiquant à qui il appartient.",
  "pronom démonstratif": "celui, celle, ceux, ceci, cela, ça…",
  "pronom relatif": "qui, que, dont, où, lequel… : il introduit une subordonnée relative.",
  "pronom interrogatif": "qui, que, lequel… : il pose une question.",
  "pronom indéfini": "chacun, personne, rien, quelqu’un, tout, on…",
};
const IP: readonly (readonly [string, string, string?])[] = [
  ["Je *leur* parle.", "pronom personnel"], ["Elle *nous* regarde.", "pronom personnel"], ["J’*en* veux encore.", "pronom personnel"],
  ["Ce vélo est *le mien*.", "pronom possessif"], ["Ta trousse est rouge, *la sienne* est bleue.", "pronom possessif"],
  ["Je préfère *celui-ci*.", "pronom démonstratif"], ["*Cela* me plaît.", "pronom démonstratif"],
  ["La fille *qui* chante est ma sœur.", "pronom relatif"], ["Le film *dont* tu parles est génial.", "pronom relatif"],
  ["*Qui* a sonné ?", "pronom interrogatif"], ["*Lequel* préfères-tu ?", "pronom interrogatif"],
  ["*Personne* n’est venu.", "pronom indéfini"], ["*Chacun* a son tour.", "pronom indéfini"], ["*Quelqu’un* frappe à la porte.", "pronom indéfini"],
];

const DEG: readonly Item[] = [
  ["Dans *Lina est plus grande que Zoé*, l’adjectif est au…", "comparatif de supériorité", ["comparatif d’égalité", "comparatif d’infériorité", "superlatif relatif"], "« plus … que » : comparatif de supériorité."],
  ["Dans *Ce film est aussi drôle que le premier*, l’adjectif est au…", "comparatif d’égalité", ["comparatif de supériorité", "comparatif d’infériorité", "superlatif relatif"], "« aussi … que » : comparatif d’égalité."],
  ["Dans *Le train est moins rapide que l’avion*, l’adjectif est au…", "comparatif d’infériorité", ["comparatif d’égalité", "comparatif de supériorité", "superlatif relatif"], "« moins … que » : comparatif d’infériorité."],
  ["Dans *La pointe Dufour est le plus haut sommet de Suisse*, l’adjectif est au…", "superlatif relatif", ["comparatif de supériorité", "superlatif absolu", "comparatif d’infériorité"], "« le plus … de » : superlatif relatif."],
  ["Quel est le comparatif de supériorité de *bon* ?", "meilleur", ["plus bon", "mieux", "bonnement"], "On ne dit pas « plus bon » : le comparatif de « bon » est « meilleur »."],
  ["Quel est le superlatif relatif de *mauvais* ?", "le pire", ["le plus pire", "le mieux", "le meilleur"], "« le pire » (on dit aussi « le plus mauvais ») ; « le plus pire » est incorrect."],
  ["Dans *Ce gâteau est très bon*, l’adjectif est au…", "superlatif absolu", ["comparatif de supériorité", "superlatif relatif", "comparatif d’égalité"], "« très » + adjectif, sans comparaison : superlatif absolu."],
];

/** Sous-classes des déterminants et des pronoms ; degrés de l'adjectif. */
export function gen(): Question {
  return tirer([
    etiquette("Quelle est la sous-classe du déterminant en gras ?", ID, DET, RD),
    etiquette("Quelle est la sous-classe du pronom en gras ?", IP, PRO, RP),
    deBanque(DEG),
  ]);
}
