import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis la bonne orthographe : ";
const REG: readonly Item[] = [
  ["Ce sont des enfants *…*.", "obéissants", ["obéissant"], "Adjectif verbal (il exprime une qualité, on peut dire « sages ») : il s’accorde."],
  ["Les enfants, *…* à leurs parents, rangent leur chambre.", "obéissant", ["obéissants"], "Participe présent (il a un complément : à leurs parents) : invariable."],
  ["J’ai vu des étoiles *…*.", "brillantes", ["brillant"], "Adjectif verbal (= lumineuses) : il s’accorde."],
  ["Les étoiles, *…* dans la nuit, guidaient les marins.", "brillant", ["brillantes"], "Participe présent suivi d’un complément : invariable."],
  ["Les rues sont *…*.", "glissantes", ["glissant"], "Adjectif verbal attribut : accordé."],
  ["Les skieurs, *…* sur la neige, arrivent en bas.", "glissant", ["glissants"], "Participe présent (action) : invariable."],
  ["Ce sont des histoires *…*.", "amusantes", ["amusant"], "Adjectif verbal : accordé."],
];
const IRREG: readonly Item[] = [
  ["Cette promenade est *…*.", "fatigante", ["fatiguante"], "Adjectif verbal : -gant (fatigant). Le participe présent s’écrit -guant : en fatiguant."],
  ["En *…* ses amis, il a perdu le match.", "fatiguant", ["fatigant"], "Participe présent (après « en ») : il garde le u du verbe (fatiguant)."],
  ["Ses arguments sont *…*.", "convaincants", ["convainquants"], "Adjectif verbal : -cant (convaincant)."],
  ["*…* ses parents, il a obtenu un chien.", "Convainquant", ["Convaincant"], "Participe présent : -quant (convainquant)."],
  ["Les élèves *…* leurs devoirs seront punis.", "négligeant", ["négligents"], "Participe présent (avec complément) : -geant, invariable."],
  ["Ce sont des élèves *…*.", "négligents", ["négligeants"], "Adjectif verbal : -gent (négligent)."],
  ["Il a dormi le jour *…* la course.", "précédant", ["précédent"], "Participe présent (= qui précède) : -ant."],
  ["Il a dormi la veille, le jour *…*.", "précédent", ["précédant"], "Adjectif : -ent (le jour précédent)."],
  ["Ils ont des avis *…*.", "différents", ["différants"], "Adjectif : -ent (différent)."],
  ["Nos points de vue *…*, nous discutons.", "différant", ["différents"], "Participe présent (= qui diffèrent) : -ant, invariable."],
  ["Une remarque *…* l’a vexé.", "provocante", ["provoquante"], "Adjectif verbal : -cant (provocant)."],
];

/** Participe présent ou adjectif verbal : accord et orthographe. */
export function gen(): Question {
  return tirer([deBanque(REG, C), deBanque(IRREG, C)]);
}
