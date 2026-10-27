import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

/* Valeurs de temps, de lieu, de but (5e-6e). */
const V1 = ["temps", "lieu", "but"];
const R1: Record<string, string> = {
  temps: "Il répond à la question « quand ? ».",
  lieu: "Il répond à la question « où ? ».",
  but: "Il répond à la question « dans quel but ? » (pour, afin de).",
};
const I1: readonly (readonly [string, string, string?])[] = [
  ["*Ce matin*, il a neigé.", "temps"], ["*En hiver*, les marmottes dorment.", "temps"], ["*Après l’école*, je fais mes devoirs.", "temps"],
  ["Nous partons *à huit heures*.", "temps"], ["*Pendant les vacances*, nous irons en Gruyère.", "temps"],
  ["Nous pique-niquons *au bord du lac*.", "lieu"], ["*À Lausanne*, il y a un métro.", "lieu"], ["Les vaches restent *à l’alpage* tout l’été.", "lieu"],
  ["Le chat dort *sous la table*.", "lieu"], ["*Dans la forêt*, on entend un coucou.", "lieu"],
  ["Elle s’entraîne *pour gagner la course*.", "but"], ["Il économise *pour acheter un vélo*.", "but"], ["Je me lève tôt *pour ne pas rater le bus*.", "but"],
  ["Il a mis un pull *afin d’avoir chaud*.", "but"], ["Nous chuchotons *pour ne pas réveiller le bébé*.", "but"],
];
/* Valeurs étendues (7e-11e) : temps, lieu, but, manière, cause, conséquence. */
const V2 = ["temps", "lieu", "but", "manière", "cause", "conséquence"];
const R2: Record<string, string> = {
  ...R1,
  manière: "Il répond à la question « comment ? ».",
  cause: "Il répond à la question « pourquoi ? » et donne la raison (parce que, à cause de).",
  conséquence: "Il indique le résultat (si bien que, tellement … que).",
};
const I2: readonly (readonly [string, string, string?])[] = [
  ...I1,
  ["Elle marche *avec prudence*.", "manière"], ["Il ferme la porte *doucement*.", "manière"], ["Le chat avance *sans bruit*.", "manière"],
  ["*À cause de la pluie*, le match est annulé.", "cause"], ["Il est resté au lit *parce qu’il était malade*.", "cause"],
  ["Elle tremble *de froid*.", "cause"], ["*Comme il faisait beau*, nous sommes sortis.", "cause"],
  ["Il a tellement couru *qu’il est épuisé*.", "conséquence"], ["Il pleuvait fort, *si bien que la rivière a débordé*.", "conséquence"],
  ["Le vent soufflait si fort *que les arbres pliaient*.", "conséquence"],
];

export function gen1(): Question {
  return tirer([etiquette("Quelle valeur exprime le groupe en gras ?", I1, V1, R1)]);
}

/** Valeurs sémantiques des compléments : temps, lieu, but, manière, cause, conséquence. */
export function gen2(): Question {
  return tirer([etiquette("Quelle valeur exprime le groupe en gras ?", I2, V2, R2)]);
}
