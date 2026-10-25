import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis la bonne orthographe : ";
const ITEMS: readonly Item[] = [
  ["Il a invité *…* amis.", "quelques", ["quel que", "quels que"], "Déterminant (= plusieurs) devant un nom pluriel : quelques."],
  ["*…* soit ton choix, je le respecterai.", "Quel que", ["Quelque", "Quelle que"], "Devant le verbe « être » au subjonctif : quel que, accordé avec le sujet « ton choix »."],
  ["*…* soient tes raisons, tu dois venir.", "Quelles que", ["Quelques", "Quels que"], "« Quelles que » s’accorde avec le sujet « tes raisons » (féminin pluriel)."],
  ["J’ai attendu *…* minutes.", "quelques", ["quelque", "quel que"], "Déterminant pluriel (plusieurs minutes)."],
  ["*…* fatigué, il continue.", "Quoique", ["Quoi que", "Quoiques"], "« Quoique » = « bien que » : en un seul mot."],
  ["*…* tu fasses, fais-le bien.", "Quoi que", ["Quoique", "Quoiques"], "« Quoi que » = « quelle que soit la chose que » : en deux mots."],
  ["*…* arrive, reste calme.", "Quoi qu’il", ["Quoiqu’il", "Quoi qu’ils"], "« Quoi qu’il arrive » = quelle que soit la chose qui arrive : deux mots."],
  ["Je vais *…* au cinéma avec mon oncle.", "quelquefois", ["quelques fois", "quelque fois"], "« Quelquefois » = parfois : un seul mot."],
  ["Je suis allé à Berne *…* cette année : trois ou quatre fois.", "quelques fois", ["quelquefois", "quelque fois"], "« Quelques fois » = un petit nombre de fois : deux mots."],
];

/** Quelque / quel que, quoique / quoi que, quelquefois / quelques fois. */
export function gen(): Question {
  return tirer([deBanque(ITEMS, C)]);
}
