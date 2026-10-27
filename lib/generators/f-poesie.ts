import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const P1: readonly Item[] = [
  ["Dans un poème, une ligne s’appelle…", "un vers", ["une strophe", "une rime", "un paragraphe"], "Le vers est une ligne du poème."],
  ["Un groupe de vers séparé des autres par une ligne blanche s’appelle…", "une strophe", ["un vers", "un refrain", "une rime"], "La strophe regroupe plusieurs vers."],
  ["Le retour du même son à la fin de deux vers s’appelle…", "une rime", ["un refrain", "une strophe", "une allitération"], "La rime est la répétition d’un son en fin de vers."],
  ["Une strophe ou un vers qui revient plusieurs fois dans une chanson s’appelle…", "un refrain", ["une rime", "une métaphore", "un titre"], "Le refrain se répète."],
  ["Rimes AABB (été / jeté / soleil / pareil) : ce sont des rimes…", "plates (ou suivies)", ["croisées", "embrassées", "libres"], "AABB : les rimes se suivent deux à deux."],
  ["Rimes ABAB (lune / ciel / brune / miel) : ce sont des rimes…", "croisées", ["plates (ou suivies)", "embrassées", "riches"], "ABAB : les rimes s’alternent."],
  ["Rimes ABBA (nuit / blanc / dent / bruit) : ce sont des rimes…", "embrassées", ["croisées", "plates (ou suivies)", "pauvres"], "ABBA : les rimes B sont entourées par les rimes A."],
  ["Un vers de douze syllabes s’appelle…", "un alexandrin", ["un octosyllabe", "un décasyllabe", "un sonnet"], "Alexandrin : 12 syllabes ; octosyllabe : 8 ; décasyllabe : 10."],
  ["Un poème de quatorze vers (deux quatrains et deux tercets) s’appelle…", "un sonnet", ["une ballade", "un rondeau", "un haïku"], "Le sonnet est une forme fixe."],
  ["Une strophe de quatre vers s’appelle…", "un quatrain", ["un tercet", "un distique", "un sizain"], "Quatrain : 4 vers ; tercet : 3 vers."],
  ["Un poème écrit sans rimes ni nombre fixe de syllabes est en…", "vers libres", ["alexandrins", "rimes croisées", "prose rimée"], "Les vers libres ne suivent pas de règles de mètre ni de rime."],
  ["Dans *Sur la branche chante l’oiseau*, l’ordre habituel des mots est changé. C’est…", "une inversion", ["une rime", "un refrain", "une ellipse"], "L’inversion place le sujet (l’oiseau) après le verbe."],
];
const P2: readonly Item[] = [
  ["*Pour qui sont ces serpents qui sifflent sur vos têtes ?* (Racine) La répétition du son [s] est…", "une allitération", ["une assonance", "une anaphore", "un enjambement"], "Allitération : répétition d’un son consonne."],
  ["*Tout m’afflige et me nuit et conspire à me nuire* (Racine) La répétition du son [i] est…", "une assonance", ["une allitération", "une rime", "une anaphore"], "Assonance : répétition d’un son voyelle."],
  ["*Mon pays, c’est la neige. Mon pays, c’est le vent. Mon pays, c’est l’hiver.* La répétition de « Mon pays » en début de phrase est…", "une anaphore", ["une assonance", "un enjambement", "une rime"], "Anaphore : reprise d’un même mot en tête de vers ou de phrase."],
  ["Quand une phrase commence dans un vers et se poursuit sur le vers suivant, on parle…", "d’un enjambement", ["d’une anaphore", "d’une rime", "d’un refrain"], "L’enjambement prolonge la phrase au-delà du vers."],
];

export function gen1(): Question {
  return tirer([deBanque(P1)]);
}

/** Poésie : vers, strophes, rimes, formes fixes ; assonances, allitérations, anaphores, enjambements. */
export function gen2(): Question {
  return tirer([deBanque(P2), deBanque(P1)]);
}
