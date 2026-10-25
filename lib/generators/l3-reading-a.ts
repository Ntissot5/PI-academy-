import type { Question } from "./types";
import { lecture, type Texte } from "./data/l2-lecture";

const TEXTES: Texte[] = [
  {
    genre: "portrait",
    texte: "Hi! My name is Chloe. I'm twelve years old and I live in Montreux with my mum, my dad and my little brother, Leo. I've got a dog called Max. My favourite subject is art, but I don't like maths. At the weekend I go swimming.",
    questions: [
      ["Combien de frères et sœurs a Chloe ?", "un petit frère", ["deux frères", "une sœur", "aucun"], "« my little brother, Leo » : un petit frère."],
      ["Quelle branche Chloe préfère-t-elle ?", "les arts visuels (dessin)", ["les maths", "la musique", "le sport"], "« My favourite subject is art »."],
      ["Que fait Chloe le week-end ?", "elle va nager", ["elle fait du vélo", "elle joue au foot", "elle promène Max"], "« At the weekend I go swimming »."],
      ["Qui est Max ?", "le chien de Chloe", ["le frère de Chloe", "le père de Chloe", "le chat de Chloe"], "« I've got a dog called Max »."],
    ],
  },
  {
    genre: "menu",
    texte: "CAFÉ ROMA – Menu. Pizza Margherita CHF 14. Spaghetti Bolognese CHF 16. Green salad CHF 7. Chocolate cake CHF 6. Orange juice CHF 4. All our pizzas are also available without cheese. Open every day except Monday.",
    questions: [
      ["Combien coûte une salade verte ?", "7 francs", ["6 francs", "14 francs", "4 francs"], "« Green salad CHF 7 »."],
      ["Quel jour le café est-il fermé ?", "le lundi", ["le dimanche", "le samedi", "le mercredi"], "« Open every day except Monday » : ouvert tous les jours sauf le lundi."],
      ["Qu’est-ce qui est possible pour toutes les pizzas ?", "les commander sans fromage", ["les commander plus petites", "les avoir gratuitement le lundi", "les commander avec du chocolat"], "« also available without cheese »."],
    ],
  },
  {
    genre: "courriel",
    texte: "Hi Sam, thanks for your email! I'm on holiday in Scotland with my family. It's cold and it rains a lot, but it's beautiful. Yesterday we visited a castle in Edinburgh. Tomorrow we're going to see a big lake – maybe we'll see Nessie! See you soon, Ana",
    questions: [
      ["Où est Ana ?", "en Écosse", ["en Irlande", "au Canada", "en Australie"], "« I'm on holiday in Scotland » : Scotland = l’Écosse."],
      ["Quel temps fait-il ?", "il fait froid et il pleut beaucoup", ["il fait très chaud", "il neige", "il y a du soleil"], "« It's cold and it rains a lot »."],
      ["Qu’a fait la famille hier ?", "elle a visité un château", ["elle a vu un lac", "elle a nagé", "elle est rentrée à la maison"], "« Yesterday we visited a castle in Edinburgh ». Le lac, c’est pour demain."],
    ],
  },
  {
    genre: "règlement de classe",
    texte: "Classroom rules: 1. Be on time. 2. Put up your hand before you speak. 3. Don't eat in the classroom. 4. Switch off your mobile phone. 5. Help your classmates.",
    questions: [
      ["Que faut-il faire avant de parler ?", "lever la main", ["se lever", "attendre la fin du cours", "écrire au tableau"], "« Put up your hand before you speak »."],
      ["Qu’est-ce qui est interdit ?", "manger en classe", ["aider ses camarades", "arriver à l’heure", "parler après avoir levé la main"], "« Don't eat in the classroom »."],
      ["Que faut-il faire avec son téléphone ?", "l’éteindre", ["le poser sur la table", "le donner à l’enseignant", "l’utiliser pour traduire"], "« Switch off your mobile phone » : switch off = éteindre."],
    ],
  },
  {
    genre: "petite histoire",
    texte: "It's Saturday morning. Jack wants to play football in the park, but it's raining. He's bored. Then his grandma calls: 'Do you want to bake a cake with me?' Jack says yes. They make a big chocolate cake. In the afternoon the sun comes out, and Jack goes to the park with a piece of cake in his bag.",
    questions: [
      ["Pourquoi Jack s’ennuie-t-il le matin ?", "il pleut et il ne peut pas jouer au foot", ["il est malade", "ses amis sont partis", "il n’a pas de ballon"], "« he wants to play football … but it's raining. He's bored »."],
      ["Que font Jack et sa grand-mère ?", "un gâteau au chocolat", ["une promenade au parc", "des devoirs", "un match de foot"], "« They make a big chocolate cake »."],
      ["Que se passe-t-il l’après-midi ?", "le soleil revient", ["il neige", "il pleut encore plus", "la grand-mère s’en va"], "« In the afternoon the sun comes out »."],
    ],
  },
  {
    genre: "affiche",
    texte: "LOST CAT! Our cat Tiger is lost. He's grey and white and he has a red collar. He's very friendly. Last seen: Friday evening near the train station. Please call Emma: 079 555 12 34. Reward!",
    questions: [
      ["De quoi parle cette affiche ?", "d’un chat perdu", ["d’un chat à vendre", "d’un chien trouvé", "d’un concours de chats"], "« LOST CAT! » : lost = perdu."],
      ["De quelle couleur est Tiger ?", "gris et blanc", ["roux et blanc", "noir", "rouge"], "« He's grey and white » ; c’est son collier qui est rouge."],
      ["Où a-t-on vu Tiger pour la dernière fois ?", "près de la gare", ["dans le parc", "à l’école", "chez Emma"], "« Last seen: … near the train station »."],
    ],
  },
];

/** Reading (7e-8e) : textes courts et simples de la vie quotidienne. */
export function gen(): Question {
  return lecture(TEXTES, "Lis :");
}
