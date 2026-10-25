import { pick } from "../math";
import { qcm } from "./f-outils";
import type { Question } from "./types";

/* Petits textes originaux et questions : [texte, [question, réponse, pièges, explication]]. */
type Q = readonly [string, string, readonly string[], string];
const TEXTES: readonly (readonly [string, readonly Q[]])[] = [
  [
    "Il était une fois un petit renard qui savait parler aux étoiles. Un soir, il leur demanda où était sa maman. Une étoile filante lui montra le chemin, et le renardeau retrouva sa maman au bord de la rivière.",
    [
      ["Qui est le personnage principal ?", "un petit renard", ["une étoile filante", "une rivière", "un loup"], "L’histoire parle d’un petit renard (le renardeau)."],
      ["Cette histoire est-elle réelle ou imaginaire ?", "imaginaire", ["réelle", "on ne peut pas savoir"], "Un renard qui parle aux étoiles, c’est imaginaire : c’est un conte (« Il était une fois »)."],
      ["Que cherche le renardeau ?", "sa maman", ["une étoile", "à manger", "sa maison"], "Il demande aux étoiles où est sa maman."],
      ["Où le renardeau retrouve-t-il sa maman ?", "au bord de la rivière", ["dans le ciel", "dans la forêt", "dans son terrier"], "La dernière phrase le dit : au bord de la rivière."],
    ],
  ],
  [
    "Salade de fruits. Il te faut : une pomme, une banane, une orange et un couteau. 1. Lave la pomme. 2. Épluche la banane et l’orange. 3. Coupe les fruits en morceaux. 4. Mélange-les dans un bol.",
    [
      ["De quel type de texte s’agit-il ?", "une recette", ["un conte", "une lettre", "un poème"], "Il y a la liste de ce qu’il faut et les étapes numérotées : c’est une recette."],
      ["Quel objet faut-il pour faire cette recette ?", "un couteau", ["une casserole", "un four", "une cuillère en bois"], "« Il te faut : … un couteau »."],
      ["Que fais-tu juste après avoir lavé la pomme ?", "Tu épluches la banane et l’orange.", ["Tu mélanges les fruits.", "Tu coupes les fruits.", "Tu laves l’orange."], "Étape 2, après l’étape 1."],
      ["Que fais-tu en dernier ?", "Tu mélanges les fruits dans un bol.", ["Tu laves la pomme.", "Tu coupes les fruits.", "Tu épluches la banane."], "La dernière étape est la 4 : mélanger dans un bol."],
    ],
  ],
  [
    "Chère Mamie, je suis à Zermatt avec papa et maman. Hier, nous avons pris le train jusqu’au Gornergrat. J’ai vu le Cervin, il était tout blanc ! Je suis très contente. Gros bisous, Léna.",
    [
      ["Qui a écrit cette carte postale ?", "Léna", ["Mamie", "papa", "maman"], "La signature, à la fin, indique qui écrit : Léna."],
      ["À qui Léna écrit-elle ?", "à sa grand-mère", ["à son papa", "à sa maîtresse", "à son amie"], "« Chère Mamie » : elle écrit à sa grand-mère."],
      ["Comment Léna se sent-elle ?", "contente", ["triste", "fâchée", "fatiguée"], "Elle écrit : « Je suis très contente. »"],
      ["Qu’est-ce que Léna a fait hier ?", "Elle a pris le train jusqu’au Gornergrat.", ["Elle a skié.", "Elle a nagé dans le lac.", "Elle est rentrée à la maison."], "« Hier, nous avons pris le train jusqu’au Gornergrat. »"],
    ],
  ],
  [
    "La marmotte vit dans les Alpes. Elle creuse un terrier dans la terre. En hiver, elle dort pendant plusieurs mois : on dit qu’elle hiberne. Quand elle voit un danger, elle siffle pour prévenir les autres.",
    [
      ["De quoi parle ce texte ?", "de la marmotte", ["des Alpes", "de l’hiver", "des dangers"], "Tout le texte donne des informations sur la marmotte."],
      ["Que fait la marmotte en hiver ?", "Elle dort.", ["Elle siffle.", "Elle part au sud.", "Elle mange beaucoup."], "« En hiver, elle dort pendant plusieurs mois. »"],
      ["Pourquoi la marmotte siffle-t-elle ?", "pour prévenir les autres d’un danger", ["pour chanter", "pour appeler ses petits à manger", "parce qu’elle a froid"], "« Quand elle voit un danger, elle siffle pour prévenir les autres. »"],
      ["Ce texte raconte-t-il une histoire inventée ?", "Non, il donne des informations vraies.", ["Oui, c’est un conte.", "Oui, c’est un poème."], "C’est un texte documentaire : il transmet des savoirs."],
    ],
  ],
  [
    "Règle du jeu « Statue ». Un joueur se place contre un mur, dos aux autres. Les autres avancent vers lui. Quand il se retourne, tout le monde doit s’immobiliser. Celui qui bouge retourne au départ. Le premier qui touche le mur a gagné.",
    [
      ["Que doivent faire les joueurs quand le joueur se retourne ?", "s’immobiliser", ["courir", "crier", "s’asseoir"], "« Quand il se retourne, tout le monde doit s’immobiliser. »"],
      ["Que se passe-t-il pour celui qui bouge ?", "Il retourne au départ.", ["Il a gagné.", "Il sort du jeu pour toujours.", "Il devient le chef."], "« Celui qui bouge retourne au départ. »"],
      ["Comment gagne-t-on ?", "en touchant le mur le premier", ["en bougeant le plus vite", "en restant au départ", "en se retournant"], "« Le premier qui touche le mur a gagné. »"],
    ],
  ],
  [
    "Tom avait perdu son doudou. Il le chercha sous son lit, puis dans le salon. Enfin, il le trouva dans le panier du chien ! Le chien dormait dessus. Tom rit et le récupéra doucement.",
    [
      ["Où Tom a-t-il cherché en premier ?", "sous son lit", ["dans le salon", "dans le panier du chien", "dans le jardin"], "« Il le chercha sous son lit, puis dans le salon. »"],
      ["Où était le doudou ?", "dans le panier du chien", ["sous le lit", "dans le salon", "dans la cuisine"], "« Il le trouva dans le panier du chien. »"],
      ["Comment Tom réagit-il à la fin ?", "Il rit.", ["Il pleure.", "Il se fâche.", "Il crie."], "« Tom rit et le récupéra doucement. »"],
    ],
  ],
  [
    "Monsieur le Directeur, les élèves de 4e aimeraient avoir un bac à sable dans la cour, car nous n’avons pas de jeux pour les petits. Nous promettons d’en prendre soin. Merci de votre réponse. La classe de 4e.",
    [
      ["Que demandent les élèves ?", "un bac à sable dans la cour", ["un nouveau directeur", "plus de vacances", "des livres"], "Ils écrivent pour demander un bac à sable."],
      ["Pourquoi le demandent-ils ?", "parce qu’il n’y a pas de jeux pour les petits", ["parce qu’il fait beau", "parce que le directeur l’a promis", "parce qu’ils déménagent"], "« car nous n’avons pas de jeux pour les petits » : c’est leur justification."],
      ["À qui écrivent-ils ?", "au directeur", ["à leurs parents", "à la maîtresse", "aux petits"], "« Monsieur le Directeur » : c’est le destinataire."],
    ],
  ],
];

/** Compréhension de courts textes (conte, recette, carte postale, documentaire, règle de jeu, lettre). */
export function gen(): Question {
  const [t, qs] = pick(TEXTES);
  const [q, a, faux, why] = pick(qs);
  return qcm(`Lis le texte. ${t} <b>${q}</b>`, a, faux, why);
}
