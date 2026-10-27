import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Remplace le ou les groupes en gras par des pronoms : ";
const UN: readonly Item[] = [
  ["Je donne *le livre* à Léa.", "Je le donne à Léa.", ["Je lui donne à Léa.", "Je la donne à Léa.", "Je donne le à Léa."], "« le livre » est complément direct masculin singulier : « le », placé avant le verbe."],
  ["Je donne le livre *à Léa*.", "Je lui donne le livre.", ["Je la donne le livre.", "Je leur donne le livre.", "Je donne lui le livre."], "« à Léa » est complément indirect (à quelqu’un) : « lui »."],
  ["Nous parlons *à nos voisins*.", "Nous leur parlons.", ["Nous les parlons.", "Nous leurs parlons.", "Nous lui parlons."], "« à nos voisins » (à des personnes, pluriel) : « leur », sans s."],
  ["Elle mange *des framboises*.", "Elle en mange.", ["Elle les mange.", "Elle y mange.", "Elle leur mange."], "« des framboises » (une quantité) : « en »."],
  ["Il va *à Neuchâtel*.", "Il y va.", ["Il en va.", "Il lui va.", "Il la va."], "Complément de lieu introduit par « à » : « y »."],
  ["Il revient *de la piscine*.", "Il en revient.", ["Il y revient.", "Il la revient.", "Il lui revient."], "Complément de lieu introduit par « de » : « en »."],
  ["Je pense *à mes vacances*.", "J’y pense.", ["Je leur pense.", "J’en pense.", "Je les pense."], "« penser à » + une chose : « y »."],
  ["Tu regardes *les étoiles*.", "Tu les regardes.", ["Tu leur regardes.", "Tu en regardes.", "Tu les regarde."], "Complément direct pluriel : « les »."],
];
const PLUS: readonly Item[] = [
  ["Je donne *le livre* *à Léa*.", "Je le lui donne.", ["Je lui le donne.", "Je la lui donne.", "Je le leur donne."], "D’abord le complément direct (le), puis le complément indirect (lui)."],
  ["Il prête *ses skis* *à ses cousins*.", "Il les leur prête.", ["Il leur les prête.", "Il les leurs prête.", "Il leur en prête."], "Ordre : les + leur. « leur » pronom ne prend jamais de s."],
  ["Elle me montre *la photo*.", "Elle me la montre.", ["Elle la me montre.", "Elle me le montre.", "Elle lui la montre."], "« me » se place avant « la »."],
  ["Nous offrons *des fleurs* *à notre mère*.", "Nous lui en offrons.", ["Nous en lui offrons.", "Nous la lui offrons.", "Nous leur en offrons."], "« des fleurs » → en ; « à notre mère » → lui ; « en » se place en dernier."],
  ["Tu envoies *la carte* *à tes grands-parents*.", "Tu la leur envoies.", ["Tu leur la envoies.", "Tu la lui envoies.", "Tu les leur envoies."], "« la carte » → la ; « à tes grands-parents » → leur."],
  ["Il conduit *ses enfants* *à l’école*.", "Il les y conduit.", ["Il y les conduit.", "Il leur y conduit.", "Il les en conduit."], "« ses enfants » → les ; « à l’école » (lieu) → y ; « y » après « les »."],
];

export function gen1(): Question {
  return tirer([deBanque(UN, C)]);
}

/** Pronominalisation de plusieurs groupes (ordre des pronoms). */
export function gen2(): Question {
  return tirer([deBanque(PLUS, C), deBanque(UN, C)]);
}
