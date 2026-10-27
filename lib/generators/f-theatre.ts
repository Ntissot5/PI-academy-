import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ITEMS: readonly Item[] = [
  ["Dans une pièce de théâtre, une indication en italique comme *(Il entre en courant.)* s’appelle…", "une didascalie", ["une réplique", "une tirade", "un aparté"], "La didascalie donne des indications de jeu ou de décor."],
  ["Ce qu’un personnage dit quand c’est son tour de parler s’appelle…", "une réplique", ["une didascalie", "une scène", "un acte"], "Une réplique est une prise de parole."],
  ["Une longue réplique, sans interruption, s’appelle…", "une tirade", ["un aparté", "une didascalie", "un dialogue"], "La tirade est une longue réplique."],
  ["Un personnage seul sur scène qui parle pour lui-même fait…", "un monologue", ["un aparté", "un dialogue", "une didascalie"], "Monologue : un personnage seul parle."],
  ["Une réplique dite pour le public, que les autres personnages sont censés ne pas entendre, est…", "un aparté", ["un monologue", "une tirade", "un dialogue"], "L’aparté est entendu du public seulement."],
  ["Une pièce de théâtre est découpée en…", "actes et scènes", ["chapitres et paragraphes", "strophes et vers", "titres et intertitres"], "Les grandes parties sont des actes, divisés en scènes."],
  ["Au théâtre, une nouvelle scène commence généralement…", "quand un personnage entre ou sort", ["à chaque nouvelle réplique", "à chaque didascalie", "à chaque changement de décor seulement"], "Le changement de scène suit les entrées et sorties."],
  ["Un personnage tombe, glisse, reçoit un coup de bâton : c’est un comique de…", "geste", ["mots", "caractère", "situation"], "Le comique de geste vient des mouvements et des chutes."],
  ["Un personnage déforme les mots ou fait des jeux de mots : c’est un comique de…", "mots", ["geste", "situation", "caractère"], "Comique de mots (de langage)."],
  ["Un personnage est ridicule par son avarice ou sa vantardise : c’est un comique de…", "caractère", ["geste", "mots", "répétition"], "Comique de caractère : un défaut exagéré."],
  ["Un personnage se cache dans une armoire et tout le monde se trompe sur qui est là : c’est un comique de…", "situation", ["mots", "caractère", "geste"], "Comique de situation : quiproquo, malentendu."],
  ["Au théâtre, quand un personnage parle à un autre, il s’adresse aussi au public : c’est…", "la double énonciation", ["l’aparté", "la didascalie", "le monologue"], "Les paroles visent à la fois le personnage et les spectateurs."],
  ["La première partie d’une pièce, qui présente les personnages et la situation, s’appelle…", "l’exposition", ["le nœud", "le dénouement", "l’épilogue"], "Exposition, nœud (conflit), dénouement : la structure théâtrale."],
  ["La fin de la pièce, où le conflit est résolu, s’appelle…", "le dénouement", ["l’exposition", "le nœud", "la tirade"], "Le dénouement règle le conflit."],
];

/** Le texte théâtral : réplique, didascalie, tirade, monologue, aparté, procédés comiques, structure. */
export function gen(): Question {
  return tirer([deBanque(ITEMS)]);
}
