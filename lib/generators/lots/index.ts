import { LOT as maths3 } from "./maths3";
import { LOT as maths2 } from "./maths2";
import { LOT as maths1 } from "./maths1";
import { LOT as francais } from "./francais";
import { LOT as sciencesShs } from "./sciences-shs";
import { LOT as langues } from "./langues";
import type { Lot } from "./types";

/** Tous les lots d'exercices ajoutés pour couvrir le PER (un fichier par lot, sans doublon d'identifiant). */
export const LOTS: Record<string, Lot> = { maths3, maths2, maths1, francais, "sciences-shs": sciencesShs, langues };
