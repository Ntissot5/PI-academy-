import { gen as m2Figures56 } from "../m2-figures-56";
import { gen as m2Figures78 } from "../m2-figures-78";
import { gen as m2Solides } from "../m2-solides";
import { gen as m2Reperage } from "../m2-reperage";
import { gen as m2Paver } from "../m2-paver";
import { gen as m2Nombres56 } from "../m2-nombres-56";
import { gen as m2Nombres78 } from "../m2-nombres-78";
import { gen as m2Denombrer } from "../m2-denombrer";
import { gen as m2Enigmes } from "../m2-enigmes";
import { gen as m2Calcul56 } from "../m2-calcul-56";
import { gen as m2Calcul78 } from "../m2-calcul-78";
import { gen as m2Multiples56 } from "../m2-multiples-56";
import { gen as m2Multiples78 } from "../m2-multiples-78";
import { gen as m2Calculatrice } from "../m2-calculatrice";
import { gen as m2Problemes56 } from "../m2-problemes-56";
import { gen as m2Problemes78 } from "../m2-problemes-78";
import { gen as m2Mesures56 } from "../m2-mesures-56";
import { gen as m2Mesures78 } from "../m2-mesures-78";
import { gen as m2Aires } from "../m2-aires";
import type { Lot } from "./types";

/** Lot « maths2 » : mathématiques du cycle 2 (5e-8e), voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "m2-figures-56": { gen: m2Figures56, label: "Maths · figures planes (5e-6e)", icon: "star" },
  "m2-figures-78": { gen: m2Figures78, label: "Maths · figures et isométries (7e-8e)", icon: "star" },
  "m2-solides": { gen: m2Solides, label: "Maths · solides", icon: "molecule" },
  "m2-reperage": { gen: m2Reperage, label: "Maths · repérage", icon: "pin" },
  "m2-paver": { gen: m2Paver, label: "Maths · décomposer des surfaces", icon: "flower" },
  "m2-nombres-56": { gen: m2Nombres56, label: "Maths · nombres jusqu’à 10 000", icon: "note" },
  "m2-nombres-78": { gen: m2Nombres78, label: "Maths · décimaux et fractions", icon: "note" },
  "m2-denombrer": { gen: m2Denombrer, label: "Maths · dénombrer et estimer", icon: "eye" },
  "m2-enigmes": { gen: m2Enigmes, label: "Maths · énigmes numériques", icon: "folder" },
  "m2-calcul-56": { gen: m2Calcul56, label: "Maths · calculs (5e-6e)", icon: "laptop" },
  "m2-calcul-78": { gen: m2Calcul78, label: "Maths · calculs (7e-8e)", icon: "laptop" },
  "m2-multiples-56": { gen: m2Multiples56, label: "Maths · multiples et suites (5e-6e)", icon: "report" },
  "m2-multiples-78": { gen: m2Multiples78, label: "Maths · diviseurs et suites (7e-8e)", icon: "report" },
  "m2-calculatrice": { gen: m2Calculatrice, label: "Maths · calculatrice", icon: "laptop" },
  "m2-problemes-56": { gen: m2Problemes56, label: "Maths · problèmes (5e-6e)", icon: "mail" },
  "m2-problemes-78": { gen: m2Problemes78, label: "Maths · problèmes (7e-8e)", icon: "mail" },
  "m2-mesures-56": { gen: m2Mesures56, label: "Maths · mesures (5e-6e)", icon: "cal31" },
  "m2-mesures-78": { gen: m2Mesures78, label: "Maths · mesures et conversions (7e-8e)", icon: "cal31" },
  "m2-aires": { gen: m2Aires, label: "Maths · périmètres, aires, volumes", icon: "plane" },
};
