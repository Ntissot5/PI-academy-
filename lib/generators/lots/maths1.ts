import type { Lot } from "./types";
import { gen as compter } from "../m1-compter";
import { gen as avantApres } from "../m1-avant-apres";
import { gen as add10 } from "../m1-add10";
import { gen as position } from "../m1-position";
import { gen as formes } from "../m1-formes";
import { gen as grandeurs } from "../m1-grandeurs";
import { gen as trajet } from "../m1-trajet";
import { gen as formes2 } from "../m1-formes2";
import { gen as nombres } from "../m1-nombres";
import { gen as compterPar } from "../m1-compter-par";
import { gen as comparer } from "../m1-comparer";
import { gen as calc20 } from "../m1-calc20";
import { gen as calc200 } from "../m1-calc200";
import { gen as prob20 } from "../m1-prob20";
import { gen as prob200 } from "../m1-prob200";
import { gen as mesures } from "../m1-mesures";

/** Lot « maths1 » (cycle 1, 1re-4e) : voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "m1-compter": { gen: compter, label: "Compter jusqu’à 12 (1re-2e)", icon: "star" },
  "m1-avant-apres": { gen: avantApres, label: "Avant, après jusqu’à 30 (1re-2e)", icon: "cal31" },
  "m1-add10": { gen: add10, label: "Ajouter, enlever jusqu’à 10 (1re-2e)", icon: "flower" },
  "m1-position": { gen: position, label: "Devant, derrière, entre (1re-2e)", icon: "pin" },
  "m1-formes": { gen: formes, label: "Formes et frises (1re-2e)", icon: "molecule" },
  "m1-grandeurs": { gen: grandeurs, label: "Plus long, plus lourd (1re-2e)", icon: "eye" },
  "m1-trajet": { gen: trajet, label: "Gauche, droite, trajets (3e-4e)", icon: "plane" },
  "m1-formes2": { gen: formes2, label: "Formes : décrire, trier (3e-4e)", icon: "molecule" },
  "m1-nombres": { gen: nombres, label: "Dizaines, unités, lettres (3e-4e)", icon: "note" },
  "m1-compter-par": { gen: compterPar, label: "Compter de 2, 5, 10 en… (3e-4e)", icon: "report" },
  "m1-comparer": { gen: comparer, label: "Comparer, ranger jusqu’à 200 (3e-4e)", icon: "folder" },
  "m1-calc20": { gen: calc20, label: "Calculs jusqu’à 20 (3e-4e)", icon: "laptop" },
  "m1-calc200": { gen: calc200, label: "Calcul réfléchi jusqu’à 200 (4e)", icon: "laptop" },
  "m1-prob20": { gen: prob20, label: "Problèmes jusqu’à 20 (3e-4e)", icon: "mail" },
  "m1-prob200": { gen: prob200, label: "Problèmes jusqu’à 200 (4e)", icon: "mail" },
  "m1-mesures": { gen: mesures, label: "Mesurer, unités, durées (3e-4e)", icon: "cal31" },
};
