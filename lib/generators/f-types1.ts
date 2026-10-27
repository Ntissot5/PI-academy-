import { pick } from "../math";
import { qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

const DECL = [
  "Léa mange une pomme.", "Le train part à huit heures.", "Mon frère joue au foot.", "Il fait beau à Fribourg.",
  "Nous allons au marché samedi.", "Le chat dort sur le canapé.", "Noé a perdu sa casquette.", "Les vaches montent à l’alpage.",
  "Ma tante habite à Delémont.", "Le spectacle commence bientôt.",
];
const INTER = [
  "Est-ce que tu viens à la piscine ?", "Où habites-tu ?", "Quand part le bus ?", "Aimes-tu le chocolat ?", "Qui a mangé le gâteau ?",
  "Pourquoi le ciel est-il bleu ?", "Tu viens avec nous ?", "Combien de frères as-tu ?", "As-tu fini tes devoirs ?", "Comment s’appelle ton chien ?",
];
const EXCL = ["Quel beau paysage !", "Comme tu cours vite !", "Que cette tarte est bonne !", "Quelle belle surprise !", "Comme il fait chaud !"];

function type(): Question {
  const inter = Math.random() < 0.5;
  const p = pick(inter ? INTER : DECL);
  return qcmFixe(
    `Quel est le type de cette phrase ? <b>${p}</b>`,
    inter ? "interrogative" : "déclarative",
    ["déclarative", "interrogative"],
    inter
      ? "Elle pose une question et se termine par un point d’interrogation : c’est une phrase interrogative."
      : "Elle donne une information et se termine par un point : c’est une phrase déclarative.",
  );
}

function ponctuation(): Question {
  const k = pick([0, 0, 1, 1, 2]);
  const p = pick([DECL, INTER, EXCL][k]);
  const SIGNES = ["le point (.)", "le point d’interrogation (?)", "le point d’exclamation (!)"];
  const sans = p.replace(/\s?[.?!]$/, "");
  return qcmFixe(
    `Quel signe faut-il mettre à la fin de cette phrase ? <b>${sans} …</b>`,
    SIGNES[k],
    SIGNES,
    [
      "La phrase donne une information : elle se termine par un point.",
      "La phrase pose une question : elle se termine par un point d’interrogation.",
      "La phrase exprime une émotion forte : elle se termine par un point d’exclamation.",
    ][k],
  );
}

const NEG = ["Il ne pleut pas.", "Je n’aime pas les épinards.", "Sara ne joue jamais aux cartes.", "Nous ne sommes pas en retard.",
  "Le magasin n’est pas ouvert.", "Tom ne mange plus de viande.", "Mon chien n’aboie pas.", "Elles ne regardent pas la télévision."];
const POS = ["Il pleut.", "J’aime les épinards.", "Sara joue aux cartes.", "Nous sommes en retard.", "Le magasin est ouvert.",
  "Tom mange de la viande.", "Mon chien aboie.", "Elles regardent la télévision."];

function forme(): Question {
  const neg = Math.random() < 0.5;
  const p = pick(neg ? NEG : POS);
  return qcmFixe(
    `Quelle est la forme de cette phrase ? <b>${p}</b>`,
    neg ? "négative" : "positive",
    ["positive", "négative"],
    neg ? "La phrase contient « ne … pas » (ou « ne … jamais », « ne … plus ») : elle est négative." : "Il n’y a ni « ne … pas » ni « n’… pas » : la phrase est positive.",
  );
}

/* [phrase positive, forme négative correcte, formes fausses]. */
const TRANSFO: readonly (readonly [string, string, readonly string[]])[] = [
  ["Tom aime les épinards.", "Tom n’aime pas les épinards.", ["Tom aime pas les épinards.", "Tom ne aime pas les épinards.", "Tom n’aime les épinards pas."]],
  ["Le bus est en retard.", "Le bus n’est pas en retard.", ["Le bus est pas en retard.", "Le bus ne est pas en retard.", "Le bus n’est en retard pas."]],
  ["Nous jouons dehors.", "Nous ne jouons pas dehors.", ["Nous jouons pas dehors.", "Nous ne pas jouons dehors.", "Nous ne jouons dehors pas."]],
  ["Lina a faim.", "Lina n’a pas faim.", ["Lina a pas faim.", "Lina ne a pas faim.", "Lina n’a faim pas."]],
  ["Il neige à Sion.", "Il ne neige pas à Sion.", ["Il neige pas à Sion.", "Il ne pas neige à Sion.", "Il ne neige à Sion pas."]],
  ["Je range ma chambre.", "Je ne range pas ma chambre.", ["Je range pas ma chambre.", "Je ne range ma chambre pas.", "Je pas range ma chambre."]],
  ["Vous écoutez la radio.", "Vous n’écoutez pas la radio.", ["Vous écoutez pas la radio.", "Vous ne écoutez pas la radio.", "Vous n’écoutez la radio pas."]],
];

function transformer(): Question {
  const [p, a, faux] = pick(TRANSFO);
  return qcm(
    `Quelle phrase est la forme négative de <b>${p}</b> ?`,
    a,
    faux,
    "La négation entoure le verbe conjugué : « ne … pas ». Devant une voyelle, « ne » devient « n’ ».",
  );
}

/* Actes de parole : [phrase, ce que fait la personne qui parle]. */
const ACTES: readonly (readonly [string, string])[] = [
  ["Ferme la fenêtre, s’il te plaît.", "elle demande de faire quelque chose"], ["Range tes affaires.", "elle demande de faire quelque chose"],
  ["Mets ton bonnet avant de sortir.", "elle demande de faire quelque chose"],
  ["Quelle heure est-il ?", "elle pose une question"], ["Tu as vu mon écharpe ?", "elle pose une question"], ["Où est la gare ?", "elle pose une question"],
  ["Quel beau gâteau !", "elle s’exclame"], ["Oh, comme il neige !", "elle s’exclame"], ["Bravo, quelle belle course !", "elle s’exclame"],
  ["Le cours de natation commence à deux heures.", "elle donne une information"], ["Mon cousin habite à Bienne.", "elle donne une information"],
  ["La bibliothèque est fermée le lundi.", "elle donne une information"],
];

function acte(): Question {
  const [p, a] = pick(ACTES);
  return qcmFixe(
    `Que fait la personne qui dit : <b>${p}</b>`,
    a,
    ["elle donne une information", "elle pose une question", "elle demande de faire quelque chose", "elle s’exclame"],
    {
      "elle demande de faire quelque chose": "Elle donne une consigne, un ordre ou un conseil : elle veut qu’on agisse.",
      "elle pose une question": "Elle attend une réponse : c’est une question.",
      "elle s’exclame": "Elle exprime une émotion (joie, surprise, admiration).",
      "elle donne une information": "Elle dit quelque chose de vrai sur le monde : elle informe.",
    }[a]!,
  );
}

/** Types de phrase (déclaratif, interrogatif), formes (positive, négative), ponctuation finale, actes de parole. */
export function gen(): Question {
  return tirer([type, type, ponctuation, ponctuation, forme, transformer, acte]);
}
