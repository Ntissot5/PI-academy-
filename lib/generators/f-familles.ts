import { pick } from "../math";
import { deBanque, saisie, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* Lettre muette finale qu'un mot de la même famille fait entendre : [mot à compléter, lettre, mot de la famille]. */
const MUETTE: readonly (readonly [string, string, string])[] = [
  ["un cam…", "p", "camper"], ["le galo…", "p", "galoper"], ["gourman…", "d", "gourmandise"], ["un tapi…", "s", "tapisser"],
  ["le regar…", "d", "regarder"], ["un accro…", "c", "accrocher"], ["le bavar…", "d", "bavarder"], ["un candida…", "t", "candidature"],
  ["le respec…", "t", "respecter"], ["un souri…", "s", "souriceau"], ["le pla…", "t", "plateau"], ["un débu…", "t", "débuter"],
  ["le san…", "g", "sanguin"], ["un repo…", "s", "reposer"],
];

function muette(): Question {
  const [m, l, fam] = pick(MUETTE);
  return saisie(
    `Quelle lettre muette termine ce mot ? <b>${m}</b> (pense à « ${fam} »)`,
    l,
    `${m.replace("…", l)} : on entend le « ${l} » dans le mot de la même famille « ${fam} ».`,
    [],
    "Écris seulement la lettre.",
  );
}

/* Masculin et féminin des noms. */
const FEM: readonly Item[] = [
  ["Quel est le féminin de *un marchand* ?", "une marchande", ["une marchante", "une marchandesse", "une marchandière"], "Au féminin, on entend le « d » qui était muet au masculin."],
  ["Quel est le féminin de *un voisin* ?", "une voisine", ["une voisinne", "une voisenne", "une voisinière"], "voisin → voisine : on ajoute un -e."],
  ["Quel est le féminin de *un lion* ?", "une lionne", ["une lione", "une lionnesse", "une lionette"], "Les noms en -on doublent souvent le n : lionne."],
  ["Quel est le féminin de *un chat* ?", "une chatte", ["une chate", "une chatesse", "une chatonne"], "chat → chatte : le t est doublé."],
  ["Quel est le féminin de *un boulanger* ?", "une boulangère", ["une boulangerie", "une boulangeuse", "une boulangeresse"], "-er → -ère (avec un accent grave)."],
  ["Quel est le féminin de *un skieur* ?", "une skieuse", ["une skieure", "une skieresse", "une skitrice"], "-eur → souvent -euse."],
  ["Quel est le féminin de *un instituteur* ?", "une institutrice", ["une instituteuse", "une institutrisse", "une institutresse"], "-teur → souvent -trice."],
  ["Quel est le féminin de *un prince* ?", "une princesse", ["une princette", "une princière", "une princeuse"], "Certains noms prennent -esse au féminin."],
];

/* Dérivation : trouver le mot de la même famille. */
const DERIV: readonly Item[] = [
  ["Quel nom de la même famille désigne l’action de *planter* ?", "plantation", ["planteur", "plantoir", "plantade"], "planter → plantation (suffixe -ation)."],
  ["Quel adjectif est formé sur le nom *courage* ?", "courageux", ["courageant", "couragé", "courageable"], "courage → courageux (suffixe -eux)."],
  ["Quel nom est formé sur l’adjectif *gentil* ?", "gentillesse", ["gentilité", "gentilement", "gentillage"], "gentil → gentillesse (suffixe -esse)."],
  ["Quel verbe est formé sur le nom *glace* ?", "glacer", ["glacier", "glaçon", "glacial"], "glace → glacer (verbe)."],
  ["Quel nom désigne la personne qui *nage* ?", "nageur", ["nageoire", "natation", "nage"], "nager → nageur (suffixe -eur)."],
  ["Quel adjectif est formé sur le nom *nation* ?", "national", ["nationalité", "nationaliser", "natal"], "nation → national (suffixe -al)."],
  ["Quel nom désigne l’action de *ranger* ?", "rangement", ["rangée", "rangeur", "rangeable"], "ranger → rangement (suffixe -ement)."],
  ["Quel adjectif est formé sur le verbe *laver* ?", "lavable", ["lavage", "lavabo", "laverie"], "laver → lavable (= qu’on peut laver)."],
];

/** Familles de mots : lettres muettes, féminin des noms, dérivation. */
export function gen(): Question {
  return tirer([muette, muette, deBanque(FEM), deBanque(DERIV), deBanque(DERIV)]);
}
