import { pick } from "../math";
import { gras, melange } from "./f-outils";
import type { Question } from "./types";

/* Familles d'homophones lexicaux : [mots, phrases [phrase avec ___, mot, sens]]. */
const FAM: readonly (readonly [readonly string[], readonly (readonly [string, string, string])[]])[] = [
  [["mer", "mère", "maire"], [["Nous nageons dans la ___.", "mer", "la mer : la grande étendue d’eau salée"], ["Ma ___ prépare le repas.", "mère", "la mère : la maman"], ["Le ___ de la commune fait un discours.", "maire", "le maire : la personne qui dirige la commune"]]],
  [["verre", "ver", "vert", "vers"], [["Il boit un ___ d’eau.", "verre", "le verre : le récipient pour boire"], ["Un ___ de terre sort après la pluie.", "ver", "le ver : le petit animal sans pattes"], ["Le pré est ___.", "vert", "vert : la couleur"], ["Nous marchons ___ la gare.", "vers", "vers : en direction de"]]],
  [["pain", "pin", "peint"], [["J’achète du ___ à la boulangerie.", "pain", "le pain : l’aliment"], ["Un grand ___ pousse près du chalet.", "pin", "le pin : l’arbre"], ["Mon oncle a ___ la barrière.", "peint", "peint : du verbe peindre"]]],
  [["sel", "selle"], [["Ajoute une pincée de ___.", "sel", "le sel : on en met dans la soupe"], ["La ___ de mon vélo est trop haute.", "selle", "la selle : le siège du vélo ou du cheval"]]],
  [["cou", "coup", "coût"], [["La girafe a un long ___.", "cou", "le cou : la partie du corps sous la tête"], ["Il a donné un ___ de pied dans le ballon.", "coup", "le coup : le choc"], ["Le ___ du voyage est élevé.", "coût", "le coût : le prix"]]],
  [["sang", "cent", "sans", "sent"], [["Mon arrière-grand-mère a fêté ses ___ ans.", "cent", "cent : le nombre 100"], ["Le ___ circule dans le corps.", "sang", "le sang : le liquide rouge"], ["Il est parti ___ son manteau.", "sans", "sans : le contraire de « avec »"], ["Cette rose ___ bon.", "sent", "sent : du verbe sentir"]]],
  [["port", "porc"], [["Les bateaux entrent dans le ___.", "port", "le port : l’abri pour les bateaux"], ["Le ___ se roule dans la boue.", "porc", "le porc : le cochon"]]],
  [["conte", "compte", "comte"], [["Grand-papa nous lit un ___.", "conte", "le conte : l’histoire merveilleuse"], ["Il ___ ses billes.", "compte", "compte : du verbe compter"], ["Le ___ vivait dans un château.", "comte", "le comte : un noble"]]],
  [["champ", "chant"], [["Le ___ de blé est doré.", "champ", "le champ : le terrain cultivé"], ["J’entends le ___ des oiseaux.", "chant", "le chant : de chanter"]]],
  [["fois", "foie", "foi"], [["Je l’ai vu trois ___.", "fois", "la fois : de une fois, deux fois"], ["Le ___ est un organe.", "foie", "le foie : l’organe"]]],
  [["père", "paire", "perd"], [["Mon ___ travaille à Sion.", "père", "le père : le papa"], ["J’ai acheté une ___ de chaussures.", "paire", "la paire : deux objets qui vont ensemble"], ["Il ___ toujours ses clés.", "perd", "perd : du verbe perdre"]]],
  [["voix", "voie", "vois"], [["Elle chante d’une belle ___.", "voix", "la voix : le son qu’on produit pour parler"], ["Le train arrive sur la ___ 3.", "voie", "la voie : le chemin, les rails"], ["Je ___ le lac depuis ma fenêtre.", "vois", "vois : du verbe voir"]]],
  [["tante", "tente"], [["Nous dormons sous la ___.", "tente", "la tente : l’abri de toile"], ["Ma ___ habite à Fribourg.", "tante", "la tante : la sœur du père ou de la mère"]]],
  [["cour", "cours", "court"], [["Les élèves jouent dans la ___.", "cour", "la cour : l’espace devant l’école"], ["Le ___ de musique commence à 10 heures.", "cours", "le cours : la leçon"], ["Le lièvre ___ très vite.", "court", "court : du verbe courir"]]],
  [["seau", "saut", "sot"], [["L’enfant remplit son ___ de sable.", "seau", "le seau : le récipient"], ["Elle a gagné le concours de ___ en hauteur.", "saut", "le saut : de sauter"]]],
  [["poids", "pois"], [["Le ___ de ce sac est de cinq kilos.", "poids", "le poids : ce que pèse un objet"], ["Je mange des petits ___.", "pois", "les pois : les petites graines vertes"]]],
  [["faim", "fin"], [["J’ai ___ : je vais manger.", "faim", "la faim : l’envie de manger"], ["La ___ du film est triste.", "fin", "la fin : le contraire du début"]]],
  [["cygne", "signe"], [["Un ___ blanc nage sur le lac.", "cygne", "le cygne : le grand oiseau blanc"], ["Il me fait un ___ de la main.", "signe", "le signe : le geste"]]],
  [["date", "datte"], [["Quelle est la ___ de ton anniversaire ?", "date", "la date : le jour"], ["La ___ est le fruit du palmier dattier.", "datte", "la datte : le fruit"]]],
  [["lait", "laid"], [["Le veau boit du ___.", "lait", "le lait : la boisson blanche"], ["Ce vieux pull est vraiment ___.", "laid", "laid : le contraire de beau"]]],
  [["temps", "tant", "tend"], [["Quel ___ fait-il aujourd’hui ?", "temps", "le temps : la météo ou la durée"], ["Il me ___ la main.", "tend", "tend : du verbe tendre"]]],
];

/** Homophones lexicaux : choisir le mot qui convient au sens. */
export function gen(): Question {
  const [mots, phrases] = pick(FAM);
  const [p, a, sens] = pick(phrases);
  return { q: gras(p.replace("___", "<b>___</b>")), txt: 1, a, choices: melange(mots), why: `« ${a} » : ${sens}.` };
}
