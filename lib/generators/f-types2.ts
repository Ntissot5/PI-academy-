import { pick } from "../math";
import { qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

const TYPES = ["déclaratif", "interrogatif", "impératif", "exclamatif"] as const;
type T = (typeof TYPES)[number];

const PHRASES: readonly (readonly [string, T])[] = [
  ["Les hirondelles reviennent au printemps.", "déclaratif"], ["Mon cousin travaille à La Chaux-de-Fonds.", "déclaratif"],
  ["Je n’ai pas vu ton message.", "déclaratif"], ["Le concert aura lieu samedi.", "déclaratif"],
  ["Viendras-tu à la fête ?", "interrogatif"], ["Pourquoi pleure-t-il ?", "interrogatif"], ["Est-ce que le magasin est ouvert ?", "interrogatif"],
  ["Qui a gagné le match ?", "interrogatif"],
  ["Range ta chambre.", "impératif"], ["Prends ton parapluie.", "impératif"], ["Ne cours pas dans le couloir.", "impératif"],
  ["Écoutez bien la consigne.", "impératif"], ["Allons voir le lac.", "impératif"], ["Viens ici tout de suite !", "impératif"],
  ["Quelle belle journée !", "exclamatif"], ["Comme ce lac est grand !", "exclamatif"], ["Que tu es drôle !", "exclamatif"],
  ["Quel froid il fait ce matin !", "exclamatif"], ["Comme tu as grandi !", "exclamatif"],
];

const POURQUOI: Record<T, string> = {
  déclaratif: "Elle affirme ou nie une information et se termine par un point : type déclaratif.",
  interrogatif: "Elle pose une question (inversion du sujet, « est-ce que » ou mot interrogatif) : type interrogatif.",
  impératif: "Le verbe est à l’impératif, sans sujet exprimé : elle donne un ordre ou un conseil. Même avec « ! », c’est le type impératif.",
  exclamatif: "Elle commence par « quel », « comme » ou « que » et exprime une émotion : type exclamatif.",
};

function type(): Question {
  const [p, t] = pick(PHRASES);
  return qcmFixe(`Quel est le type de cette phrase ? <b>${p}</b>`, t, TYPES, POURQUOI[t]);
}

/* Forme neutre ou emphatique : [phrase, emphatique ?]. */
const EMPH: readonly (readonly [string, boolean])[] = [
  ["C’est Lucie qui a gagné la course.", true], ["Ce film, je l’ai vu trois fois.", true], ["C’est à Genève que nous allons.", true],
  ["Les fraises, Noah les adore.", true], ["Moi, je préfère la montagne.", true], ["C’est demain que nous partons.", true],
  ["Lucie a gagné la course.", false], ["J’ai vu ce film trois fois.", false], ["Nous allons à Genève.", false],
  ["Noah adore les fraises.", false], ["Je préfère la montagne.", false], ["Nous partons demain.", false],
];

function emphase(): Question {
  const [p, e] = pick(EMPH);
  return qcmFixe(
    `Cette phrase est-elle de forme neutre ou emphatique ? <b>${p}</b>`,
    e ? "emphatique" : "neutre",
    ["neutre", "emphatique"],
    e
      ? "Un élément est mis en relief (« c’est … qui », « c’est … que », ou détaché en tête puis repris par un pronom) : forme emphatique."
      : "Les mots sont dans l’ordre habituel, sans mise en relief : forme neutre.",
  );
}

const NEG: readonly (readonly [string, boolean])[] = [
  ["Personne n’est venu.", true], ["Je ne vois rien.", true], ["Il ne neige plus.", true], ["Elle n’a jamais pris l’avion.", true],
  ["Nous ne sommes pas d’accord.", true], ["Je n’ai aucune idée.", true],
  ["Tout le monde est venu.", false], ["Je vois quelque chose.", false], ["Il neige encore.", false], ["Elle a déjà pris l’avion.", false],
];

function negation(): Question {
  const [p, n] = pick(NEG);
  return qcmFixe(
    `Cette phrase est-elle de forme positive ou négative ? <b>${p}</b>`,
    n ? "négative" : "positive",
    ["positive", "négative"],
    n ? "Elle contient une négation en deux parties : « ne » + pas, plus, jamais, rien, personne ou aucun." : "Elle ne contient pas de négation « ne … pas, plus, jamais, rien, personne » : elle est positive.",
  );
}

/* Transformations : [consigne, phrase de départ, réponse, pièges]. */
const TRANSFO: readonly (readonly [string, string, string, readonly string[], string])[] = [
  ["emphatique (en mettant le sujet en relief)", "Léo a cassé le vase.", "C’est Léo qui a cassé le vase.", ["C’est Léo que a cassé le vase.", "Léo n’a pas cassé le vase.", "Léo a-t-il cassé le vase ?"], "On encadre le sujet par « c’est … qui »."],
  ["emphatique (en mettant le lieu en relief)", "Nous skions à Verbier.", "C’est à Verbier que nous skions.", ["C’est à Verbier qui nous skions.", "Skions à Verbier.", "Skions-nous à Verbier ?"], "On encadre le complément de lieu par « c’est … que »."],
  ["interrogative (avec inversion du sujet)", "Tu aimes la musique.", "Aimes-tu la musique ?", ["Tu aimes-tu la musique ?", "Aime-tu la musique ?", "Aimes tu la musique."], "On place le sujet pronom après le verbe, relié par un trait d’union, et on termine par « ? »."],
  ["interrogative (avec inversion du sujet)", "Il part demain.", "Part-il demain ?", ["Il part-il demain ?", "Part il demain.", "Partil demain ?"], "On place le sujet pronom après le verbe, relié par un trait d’union, et on termine par « ? »."],
  ["interrogative (avec inversion du sujet)", "Elle a fini.", "A-t-elle fini ?", ["A-elle fini ?", "At-elle fini ?", "Elle a-t-elle fini ?"], "Entre deux voyelles (a-elle), on ajoute un « t » euphonique entre deux traits d’union : « a-t-elle »."],
  ["impérative", "Tu fermes la porte.", "Ferme la porte.", ["Fermes la porte.", "Tu ferme la porte.", "Fermer la porte."], "À l’impératif, il n’y a pas de sujet, et les verbes en -er ne prennent pas de « s » à la 2e personne du singulier."],
  ["impérative", "Vous écoutez la consigne.", "Écoutez la consigne.", ["Écouter la consigne.", "Vous écoutez la consigne !", "Écoutes la consigne."], "À l’impératif, on supprime le sujet : « écoutez »."],
  ["exclamative", "Ce paysage est beau.", "Comme ce paysage est beau !", ["Ce paysage est-il beau ?", "Que ce paysage est-il beau !", "Ce paysage n’est pas beau."], "La phrase exclamative commence souvent par « comme », « que » ou « quel » et se termine par « ! »."],
  ["négative", "Quelqu’un a téléphoné.", "Personne n’a téléphoné.", ["Quelqu’un n’a pas téléphoné personne.", "Personne a téléphoné.", "Quelqu’un a pas téléphoné."], "Le contraire de « quelqu’un » est « personne … ne » : « Personne n’a téléphoné »."],
  ["négative", "J’ai déjà mangé des huîtres.", "Je n’ai jamais mangé d’huîtres.", ["J’ai jamais mangé des huîtres.", "Je n’ai déjà pas mangé des huîtres.", "Je ne ai jamais mangé d’huîtres."], "Le contraire de « déjà » est « ne … jamais » ; après une négation, « des » devient « de » (d’huîtres)."],
];

function transformer(): Question {
  const [c, p, a, faux, why] = pick(TRANSFO);
  return qcm(`Quelle phrase transforme « ${p} » en phrase <b>${c}</b> ?`, a, faux, `« ${a} » ${why}`);
}

/** Les 4 types de phrase ; formes positive/négative et neutre/emphatique. */
export function gen(): Question {
  return tirer([type, type, type, emphase, emphase, negation, transformer, transformer]);
}
