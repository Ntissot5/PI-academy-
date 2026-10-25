import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [objet d'autrefois, objet d'aujourd'hui qui sert à la même chose]
const OBJETS: [string, string][] = [
  ["la lampe à pétrole", "la lampe électrique"],
  ["le téléphone fixe à cadran", "le téléphone portable"],
  ["la plume et l’encrier", "le stylo"],
  ["le lavoir du village", "la machine à laver"],
  ["la calèche tirée par des chevaux", "la voiture"],
  ["le poêle à bois", "le chauffage central"],
  ["la lettre envoyée par la poste", "le message sur un téléphone"],
];
const MODERNES = ["la tablette", "le téléphone portable", "la trottinette électrique", "le four à micro-ondes", "la télévision à écran plat"];
const ANCIENS = ["la lampe à pétrole", "la plume et l’encrier", "le moulin à café à manivelle", "le fer à repasser en fonte", "la calèche"];

const ITEMS: [string, string, string[], string][] = [
  ["Un dragon qui crache du feu, est-ce réel ou imaginaire ?", "Imaginaire", ["Réel", "Je l’ai vu au zoo"], "Les dragons existent dans les contes et les légendes, pas dans la réalité."],
  ["Les châteaux forts, ont-ils vraiment existé ?", "Oui, on peut encore en visiter", ["Non, seulement dans les contes", "Non, ce sont des dessins"], "Le château de Chillon, au bord du Léman, en est un exemple."],
  ["Une fée qui exauce des vœux, est-ce réel ou imaginaire ?", "Imaginaire", ["Réel", "Réel, seulement le dimanche"], "Les fées sont des personnages de contes."],
  ["Les dinosaures ont-ils existé ?", "Oui, il y a très, très longtemps", ["Non, jamais", "Oui, ils vivent encore dans nos forêts"], "On a retrouvé leurs os fossiles. Ils ont disparu bien avant les humains."],
  ["Les premiers humains ont-ils vécu en même temps que les dinosaures ?", "Non, les dinosaures avaient disparu depuis très longtemps", ["Oui, ils jouaient ensemble", "Oui, ils les élevaient"], "Les dinosaures ont disparu des millions d’années avant l’arrivée des humains."],
  ["Comment sait-on comment vivaient tes arrière-grands-parents ?", "Avec des photos, des objets et des récits de la famille", ["On ne peut pas le savoir", "Avec un dessin animé"], "Photos, objets et témoignages sont des traces du passé."],
  ["Une vieille photo de ton village, c’est…", "une trace du passé", ["une invention", "un objet du futur"], "Elle montre comment c’était avant."],
  ["Autrefois, beaucoup d’enfants allaient à l’école…", "à pied, même loin", ["en avion", "en trottinette électrique"], "Il y avait peu de voitures ; on marchait beaucoup."],
  ["Quand tes grands-parents étaient petits, il n’y avait pas…", "de téléphone portable", ["de pain", "d’école"], "Le téléphone portable est une invention récente."],
  ["Le château de ta région est vieux de plusieurs siècles. Aujourd’hui, il sert souvent…", "de musée qu’on peut visiter", ["de supermarché", "de garage"], "Beaucoup de châteaux sont devenus des musées : une trace du passé conservée."],
  ["Qu’est-ce qui n’a pas changé depuis l’époque de tes grands-parents ?", "On mange toujours du pain", ["On écrit tous avec une plume", "On s’éclaire à la bougie"], "Certaines choses changent, d’autres restent : c’est la permanence."],
];

/** Cycle 1 · le temps passé : objets d'autrefois et d'aujourd'hui, traces, réel ou imaginaire. */
export function gen(): Question {
  const t = Math.random();
  if (t < 0.3) {
    const [ancien, moderne] = pick(OBJETS);
    const faux = shuffle(OBJETS.filter((o) => o[1] !== moderne)).slice(0, 2).map((o) => o[1]);
    return { q: `Autrefois, on utilisait ${ancien}. Qu’utilise-t-on aujourd’hui pour la même chose ?`, txt: 1, a: moderne, choices: shuffle([moderne, ...faux]), why: `Aujourd’hui, ${moderne} remplace ${ancien}.` };
  }
  if (t < 0.5) {
    const a = pick(ANCIENS);
    const faux = shuffle(MODERNES).slice(0, 2);
    return { q: "Quel objet vient d’autrefois ?", txt: 1, a, choices: shuffle([a, ...faux]), why: `${a[0].toUpperCase() + a.slice(1)} : c’est un objet d’autrefois. Les autres sont récents.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
