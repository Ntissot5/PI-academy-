import { pick } from "../math";
import { deBanque, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

type Reg = "familier" | "courant" | "soutenu";
const REGS: Reg[] = ["familier", "courant", "soutenu"];

/* Mots classés par registre. */
const MOTS: readonly (readonly [string, Reg])[] = [
  ["une bagnole", "familier"], ["une voiture", "courant"], ["bosser", "familier"], ["travailler", "courant"], ["œuvrer", "soutenu"],
  ["un bouquin", "familier"], ["un livre", "courant"], ["un ouvrage", "soutenu"], ["la flotte (l’eau)", "familier"],
  ["se marrer", "familier"], ["rire", "courant"], ["s’esclaffer", "soutenu"], ["un gamin", "familier"], ["un enfant", "courant"],
  ["la frousse", "familier"], ["la peur", "courant"], ["l’effroi", "soutenu"], ["bouffer", "familier"], ["manger", "courant"],
  ["se restaurer", "soutenu"], ["un pote", "familier"], ["un ami", "courant"], ["une demeure", "soutenu"], ["une maison", "courant"],
  ["piquer (voler)", "familier"], ["dérober", "soutenu"], ["un flic", "familier"], ["un policier", "courant"],
];

function registre(): Question {
  const [m, r] = pick(MOTS);
  return qcmFixe(`À quel registre de langue appartient <b>${m}</b> ?`, r, REGS, {
    familier: `« ${m} » appartient au registre familier : on l’emploie entre amis, à l’oral.`,
    courant: `« ${m} » appartient au registre courant : il convient à presque toutes les situations.`,
    soutenu: `« ${m} » appartient au registre soutenu : on le trouve surtout à l’écrit, dans un langage recherché.`,
  }[r]);
}

/* Passage d'un registre à l'autre : [consigne, réponse, pièges, explication]. */
const PASSAGE: readonly Item[] = [
  ["Quelle phrase est au registre courant ? (« J’ai pas pigé. »)", "Je n’ai pas compris.", ["J’ai pas compris.", "Je n’ai point saisi votre propos.", "J’pige pas."], "Registre courant : négation complète (ne … pas) et verbe courant."],
  ["Quelle phrase est au registre soutenu ? (« Il pleut beaucoup. »)", "Il tombe une pluie diluvienne.", ["Il flotte grave.", "Ça pleut fort.", "Il pleut beaucoup."], "Registre soutenu : vocabulaire recherché."],
  ["Quelle phrase est au registre familier ? (« Je suis très fatigué. »)", "Je suis crevé.", ["Je suis épuisé.", "Je suis très fatigué.", "Je suis exténué."], "« Crevé » appartient au registre familier."],
  ["Quelle phrase est au registre courant ? (« Ce film est trop nul. »)", "Ce film est très mauvais.", ["Ce film est trop nul.", "Ce film est d’une médiocrité affligeante.", "C’est nul, ce film."], "Registre courant : vocabulaire simple, sans mot familier."],
  ["Quelle question est au registre soutenu ? (« Tu viens quand ? »)", "Quand viendrez-vous ?", ["Tu viens quand ?", "Quand est-ce que tu viens ?", "Tu viens à quelle heure ?"], "Registre soutenu : interrogation avec inversion du sujet."],
];

/* Régionalismes de Suisse romande : [mot, sens]. */
const REGIO: readonly Item[] = [
  ["En Suisse romande, *septante* veut dire…", "soixante-dix", ["soixante", "dix-sept", "quatre-vingts"], "« Septante » (70) est un régionalisme de Suisse romande et de Belgique."],
  ["En Suisse romande, *nonante* veut dire…", "quatre-vingt-dix", ["neuf", "quatre-vingts", "cent"], "« Nonante » (90) est un régionalisme."],
  ["En Suisse romande, *le natel* désigne…", "le téléphone portable", ["la télévision", "le vélo", "le nageur"], "« Natel » est un régionalisme suisse pour le téléphone portable."],
  ["En Suisse romande, *le dîner* est…", "le repas de midi", ["le repas du soir", "le petit-déjeuner", "le goûter"], "En Suisse romande : déjeuner (matin), dîner (midi), souper (soir)."],
  ["En Suisse romande, *une panosse* est…", "une serpillière", ["une casserole", "une écharpe", "une pâtisserie"], "« Panosse » est un régionalisme romand."],
];

/** Registres de langue (familier, courant, soutenu) et régionalismes. */
export function gen(): Question {
  return tirer([registre, registre, deBanque(PASSAGE), deBanque(REGIO)]);
}
