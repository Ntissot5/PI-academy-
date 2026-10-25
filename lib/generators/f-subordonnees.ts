import { deBanque, etiquette, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const R: Record<string, string> = {
  "subordonnée relative": "Introduite par un pronom relatif, elle complète un nom (son antécédent).",
  "subordonnée conjonctive": "Introduite par une conjonction de subordination (que, quand, parce que, si…).",
  "subordonnée interrogative indirecte": "Elle rapporte une question après un verbe comme « se demander », « savoir », « dire » (si, qui, où, quand, comment…).",
  "subordonnée infinitive": "Son verbe est à l’infinitif et elle a son propre sujet (après voir, entendre, sentir, laisser…).",
  "subordonnée participiale": "Son verbe est un participe et elle a son propre sujet, différent de celui de la principale.",
};
const T = ["subordonnée relative", "subordonnée conjonctive", "subordonnée interrogative indirecte", "subordonnée infinitive", "subordonnée participiale"];
const I: readonly (readonly [string, string, string?])[] = [
  ["Le gâteau *que tu as fait* est délicieux.", "subordonnée relative"], ["J’ai un ami *qui vit à Sion*.", "subordonnée relative"],
  ["Je pense *que tu as raison*.", "subordonnée conjonctive", "Conjonctive complément du verbe."], ["*Quand l’hiver arrive*, les marmottes hibernent.", "subordonnée conjonctive", "Conjonctive complément de phrase (temps)."],
  ["Il est heureux *que tu sois venu*.", "subordonnée conjonctive", "Conjonctive complément de l’adjectif « heureux »."], ["*Que tu sois en retard* m’inquiète.", "subordonnée conjonctive", "Conjonctive sujet du verbe « inquiète »."],
  ["Je me demande *si le train est parti*.", "subordonnée interrogative indirecte"], ["Dis-moi *où tu habites*.", "subordonnée interrogative indirecte"],
  ["Elle ne sait pas *pourquoi il pleure*.", "subordonnée interrogative indirecte"],
  ["J’entends *les oiseaux chanter*.", "subordonnée infinitive", "« les oiseaux » est le sujet de l’infinitif « chanter »."], ["Je regarde *la neige tomber*.", "subordonnée infinitive"],
  ["*La nuit tombée*, nous sommes rentrés.", "subordonnée participiale", "« la nuit » est le sujet du participe « tombée »."], ["*Le travail terminé*, les ouvriers sont partis.", "subordonnée participiale"],
];

const SENS: readonly Item[] = [
  ["Quelle nuance exprime *Bien qu’il pleuve*, nous sortons ?", "opposition / concession", ["cause", "condition", "but"], "« bien que » introduit une concession (+ subjonctif)."],
  ["Quelle nuance exprime *Si tu viens*, nous irons au lac ?", "condition", ["cause", "conséquence", "temps"], "« si » introduit une condition."],
  ["Quelle nuance exprime *Puisqu’il fait beau*, allons nous promener ?", "cause", ["but", "condition", "concession"], "« puisque » introduit une cause."],
  ["Quelle nuance exprime Je parle fort *pour que tout le monde m’entende* ?", "but", ["cause", "conséquence", "temps"], "« pour que » introduit un but (+ subjonctif)."],
  ["Quelle nuance exprime Il a tant mangé *qu’il a mal au ventre* ?", "conséquence", ["but", "cause", "comparaison"], "« tant … que » introduit une conséquence."],
  ["Quelle nuance exprime *Pendant que tu lis*, je cuisine ?", "temps", ["cause", "but", "condition"], "« pendant que » exprime la simultanéité dans le temps."],
  ["Quelle nuance exprime Il est plus grand *que je ne le pensais* ?", "comparaison", ["conséquence", "cause", "concession"], "« plus … que » introduit une comparaison."],
];
const MODE: readonly Item[] = [
  ["Choisis la bonne forme : Bien qu’il *…* fatigué, il continue.", "soit", ["est", "sera", "était"], "« bien que » est suivi du subjonctif."],
  ["Choisis la bonne forme : Je parle lentement pour que tu *…* bien.", "comprennes", ["comprends", "comprendras", "comprenais"], "« pour que » est suivi du subjonctif."],
  ["Choisis la bonne forme : Je pense qu’il *…* raison.", "a", ["ait", "aie", "aurait eu"], "Après « je pense que » (certitude), on emploie l’indicatif."],
  ["Choisis la bonne forme : Avant que tu *…*, range ta chambre.", "partes", ["pars", "partiras", "partais"], "« avant que » est suivi du subjonctif."],
  ["Choisis la bonne forme : Je suis sûr que nous *…* le match.", "gagnerons", ["gagnions", "gagnassions", "gagniez"], "Après « je suis sûr que », l’indicatif (ici le futur)."],
];

/** Types de subordonnées, nuances de sens, mode dans la subordonnée. */
export function gen(): Question {
  return tirer([etiquette("Quel type de subordonnée est en gras ?", I, T, R), deBanque(SENS), deBanque(MODE)]);
}
