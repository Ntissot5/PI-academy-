import { pick } from "../math";
import { qcm } from "./f-outils";
import type { Question } from "./types";

type Q = readonly [string, string, readonly string[], string];
/* Textes originaux et questions de compréhension : [texte, questions]. */
const TEXTES: readonly (readonly [string, readonly Q[]])[] = [
  [
    "Un écureuil se moquait d’une tortue : « Tu es si lente que tu n’arriveras jamais au sommet de la colline ! » La tortue ne répondit rien et se mit en route. L’écureuil, sûr de lui, s’amusa toute la journée. Le soir, quand il voulut enfin grimper, la tortue l’attendait déjà au sommet. Rien ne sert de se moquer : la patience l’emporte sur la vantardise.",
    [
      ["De quel genre de texte s’agit-il ?", "une fable", ["un fait divers", "une recette", "un article encyclopédique"], "Des animaux qui parlent et une morale à la fin : c’est une fable."],
      ["Quelle est la morale de ce texte ?", "La patience l’emporte sur la vantardise.", ["Les écureuils sont rapides.", "Il faut grimper le soir.", "Les tortues sont tristes."], "La morale est la leçon donnée à la fin."],
      ["Quel signe montre que l’écureuil parle ?", "les guillemets", ["les parenthèses", "le point-virgule", "les points de suspension"], "Les paroles rapportées directement sont entre guillemets."],
      ["Quel est l’élément déclencheur (la complication) ?", "L’écureuil se moque de la tortue.", ["La tortue arrive au sommet.", "Le soir tombe.", "L’écureuil s’amuse."], "C’est la moquerie qui lance l’histoire."],
    ],
  ],
  [
    "Bulle – Hier matin, un veau s’est échappé de son enclos et s’est promené dans la rue principale. Les passants ont été très surpris. Après une heure de poursuite, deux agriculteurs ont réussi à le ramener à la ferme. L’animal n’a pas été blessé.",
    [
      ["De quel genre de texte s’agit-il ?", "un fait divers", ["un conte", "une fable", "une règle de jeu"], "Un événement réel et récent, rapporté avec le lieu et le moment : c’est un fait divers."],
      ["Où l’événement s’est-il passé ?", "à Bulle", ["à Genève", "dans une forêt", "on ne le sait pas"], "Le lieu est indiqué au début : Bulle."],
      ["Quand l’événement s’est-il produit ?", "hier matin", ["la semaine passée", "hier soir", "il y a un an"], "« Hier matin » : c’est l’organisateur temporel."],
      ["Quel est le but de ce texte ?", "informer d’un événement réel", ["faire rire avec une histoire inventée", "expliquer comment jouer", "convaincre d’acheter un veau"], "Un fait divers rend compte d’un événement proche."],
    ],
  ],
  [
    "Madame, Monsieur, je lis souvent votre journal. Je pense que notre commune devrait créer une piste cyclable vers l’école. D’abord, beaucoup d’élèves viennent à vélo. Ensuite, la route est dangereuse aux heures de pointe. Enfin, le vélo est bon pour la santé et pour l’environnement. J’espère que vous publierez ma lettre. Sami, 12 ans.",
    [
      ["Quelle est l’opinion de Sami ?", "La commune devrait créer une piste cyclable.", ["Le vélo est dangereux.", "Il faut fermer l’école.", "Les journaux sont inutiles."], "« Je pense que … » introduit son opinion."],
      ["Lequel est un argument de Sami ?", "La route est dangereuse aux heures de pointe.", ["Je lis souvent votre journal.", "J’espère que vous publierez ma lettre.", "Sami a 12 ans."], "Un argument sert à justifier l’opinion."],
      ["Quel organisateur introduit le dernier argument ?", "Enfin", ["D’abord", "Ensuite", "Je pense que"], "D’abord, ensuite, enfin : organisateurs d’énumération."],
      ["De quel genre de texte s’agit-il ?", "une lettre au courrier des lecteurs", ["un conte", "une recette", "un fait divers"], "Sami écrit au journal pour donner son avis."],
    ],
  ],
  [
    "Fabriquer un moulin à vent. Matériel : une feuille carrée, une paille, une épingle, une gomme. Étapes : 1. Découpe les quatre coins de la feuille en direction du centre, sans aller jusqu’au bout. 2. Ramène une pointe sur deux vers le centre. 3. Fixe-les avec l’épingle sur la paille. 4. Plante la gomme au bout de l’épingle pour la protéger.",
    [
      ["À quoi sert ce texte ?", "à expliquer comment fabriquer un objet", ["à raconter une aventure", "à donner son avis", "à décrire un paysage"], "C’est une marche à suivre : un texte qui règle des comportements."],
      ["Quelle partie du texte dit ce qu’il faut préparer ?", "le matériel", ["les étapes", "le titre", "la conclusion"], "La liste du matériel vient avant les étapes."],
      ["Que fais-tu juste avant de fixer les pointes avec l’épingle ?", "Tu ramènes une pointe sur deux vers le centre.", ["Tu plantes la gomme.", "Tu découpes les coins.", "Tu prends une autre feuille."], "Étape 2, puis étape 3."],
      ["Pourquoi plante-t-on la gomme au bout de l’épingle ?", "pour la protéger", ["pour faire tourner le moulin", "pour décorer", "pour effacer"], "« … pour la protéger » (pour ne pas se piquer)."],
    ],
  ],
  [
    "Le bouquetin des Alpes. Où vit-il ? Le bouquetin vit en haute montagne, souvent au-dessus de la limite des forêts. Que mange-t-il ? Il se nourrit d’herbes, de mousses et de lichens. Un grimpeur remarquable : grâce à ses sabots, il escalade des parois très raides.",
    [
      ["Comment ce texte est-il organisé ?", "en parties annoncées par des intertitres", ["en strophes et en vers", "en répliques", "en étapes numérotées"], "Les questions « Où vit-il ? », « Que mange-t-il ? » servent d’intertitres."],
      ["Que mange le bouquetin ?", "des herbes, des mousses et des lichens", ["des insectes", "des petits rongeurs", "des fruits"], "La partie « Que mange-t-il ? » donne la réponse."],
      ["Quel est le but de ce texte ?", "transmettre des savoirs", ["raconter une histoire inventée", "donner un ordre", "convaincre"], "C’est un texte documentaire."],
      ["Grâce à quoi le bouquetin escalade-t-il des parois raides ?", "ses sabots", ["ses cornes", "sa queue", "ses dents"], "« grâce à ses sabots »."],
    ],
  ],
  [
    "Ce matin-là, Nora partit seule explorer la grotte. Au début, tout était calme. Soudain, sa lampe s’éteignit. Elle tâtonna longtemps dans le noir, le cœur battant. Enfin, elle aperçut un rayon de lumière et suivit le courant d’air jusqu’à la sortie. Depuis ce jour, elle n’explore plus jamais sans un ami.",
    [
      ["Quelle est la complication (le problème) ?", "La lampe de Nora s’éteint.", ["Nora part explorer.", "Nora trouve la sortie.", "Nora explore avec un ami."], "« Soudain » introduit l’événement qui crée le problème."],
      ["Quel mot accélère le rythme du récit ?", "Soudain", ["Au début", "Depuis ce jour", "Ce matin-là"], "« Soudain » marque un changement brusque."],
      ["Comment Nora se sent-elle dans le noir ?", "Elle a peur.", ["Elle est joyeuse.", "Elle s’ennuie.", "Elle est en colère."], "« le cœur battant » montre sa peur."],
      ["Que dit la situation finale ?", "Nora n’explore plus jamais seule.", ["Nora reste dans la grotte.", "La lampe se rallume.", "Nora part à l’aventure."], "La dernière phrase montre ce qui a changé."],
    ],
  ],
];

/** Compréhension de textes (fable, fait divers, lettre d'opinion, marche à suivre, documentaire, récit d'aventure). */
export function gen(): Question {
  const [t, qs] = pick(TEXTES);
  const [q, a, faux, why] = pick(qs);
  return qcm(`Lis le texte. ${t} <b>${q}</b>`, a, faux, why);
}
