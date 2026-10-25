import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quelle est l’unité de base de tout être vivant ?", "La cellule", ["L’organe", "L’atome", "Le tissu"], "Tout être vivant est formé d’une ou de plusieurs cellules."],
  ["Quelle partie de la cellule contient l’information génétique (chez l’animal et la plante) ?", "Le noyau", ["La membrane", "Le cytoplasme", "La paroi"], "Le noyau contient les chromosomes, faits d’ADN."],
  ["Quelle enveloppe entoure toute cellule et contrôle les échanges ?", "La membrane", ["La paroi", "Le noyau", "La chlorophylle"], "La membrane sépare l’intérieur de la cellule du milieu extérieur."],
  ["Quel élément trouve-t-on dans une cellule végétale, mais pas dans une cellule animale ?", "La paroi (et les chloroplastes)", ["La membrane", "Le noyau", "Le cytoplasme"], "La paroi rigide en cellulose donne sa forme à la cellule végétale."],
  ["Le liquide qui remplit la cellule autour du noyau s’appelle…", "le cytoplasme", ["le plasma sanguin", "la sève", "la membrane"], "Le cytoplasme est le siège de nombreuses réactions chimiques."],
  ["Un neurone, un globule rouge, une cellule musculaire sont…", "des cellules spécialisées", ["des cellules souches", "des organes", "des bactéries"], "Chacune a une forme adaptée à sa fonction."],
  ["Une cellule souche peut…", "se transformer en différents types de cellules spécialisées", ["seulement transporter le dioxygène", "seulement conduire les messages nerveux", "ne jamais se diviser"], "Les cellules souches assurent le renouvellement des tissus."],
  ["Quel est le rôle commun de tous les systèmes du corps ?", "Permettre le fonctionnement de chaque cellule", ["Faire grandir les cheveux", "Produire de la chaleur seulement", "Protéger la peau"], "Nutrition, respiration, circulation, excrétion : tout sert finalement aux cellules."],
  ["Une bactérie qui se divise en deux bactéries identiques se reproduit de façon…", "asexuée", ["sexuée", "par fécondation", "par pollinisation"], "Sans gamètes ni fécondation : les descendants sont des copies (clones)."],
  ["Le fraisier qui produit des stolons se reproduit…", "de façon asexuée (multiplication végétative)", ["uniquement de façon sexuée", "par division de bactéries", "il ne se reproduit pas"], "Les stolons donnent de nouveaux plants identiques. Le fraisier peut aussi se reproduire par ses graines."],
  ["La reproduction sexuée nécessite…", "la fusion de deux gamètes (fécondation)", ["une seule cellule qui se coupe en deux", "un stolon", "un bourgeon seulement"], "Les descendants sont différents de leurs parents : c’est une source de diversité."],
  ["Combien de chromosomes une cellule humaine (non sexuelle) contient-elle ?", "46 (23 paires)", ["23", "44", "92"], "Les cellules du corps humain ont 46 chromosomes, en 23 paires."],
  ["Combien de chromosomes contient un gamète humain (ovule ou spermatozoïde) ?", "23", ["46", "12", "92"], "Le gamète n’a qu’un chromosome de chaque paire : 23. À la fécondation, on retrouve 46."],
  ["Les gènes sont portés par…", "les chromosomes (molécule d’ADN)", ["les globules rouges", "la membrane", "les mitochondries seulement"], "Un chromosome est une longue molécule d’ADN portant de nombreux gènes."],
  ["Une mitose donne…", "2 cellules filles identiques à la cellule mère", ["4 cellules toutes différentes", "1 cellule plus grosse", "des gamètes"], "La mitose sert à la croissance et à la réparation des tissus."],
  ["Les gamètes se forment par une division qui sépare les chromosomes de chaque paire. Lors de la fécondation, les gamètes qui se rencontrent sont…", "choisis au hasard", ["toujours les mêmes", "choisis par les parents", "identiques entre frères et sœurs"], "Ségrégation des chromosomes + rencontre aléatoire des gamètes : chaque enfant est unique (sauf les vrais jumeaux)."],
  ["Deux êtres vivants appartiennent à la même espèce s’ils…", "peuvent se reproduire ensemble et avoir des descendants féconds", ["ont la même couleur", "vivent au même endroit", "ont la même taille"], "Le cheval et l’âne donnent un mulet stérile : ce sont deux espèces différentes."],
  ["L’évolution des espèces explique…", "l’origine de la biodiversité", ["la rotation de la Terre", "les saisons", "la formation des nuages"], "Au fil des générations, les espèces se transforment ; de nouvelles espèces apparaissent."],
];

/** Cycle 3 · la cellule, cellules spécialisées, reproduction sexuée et asexuée, chromosomes, gènes, mitose, espèce. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
