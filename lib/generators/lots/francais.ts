import type { Lot } from "./types";
import { gen as fSyllabes } from "../f-syllabes";
import { gen as fRimes } from "../f-rimes";
import { gen as fLettres } from "../f-lettres";

/** Lot « francais » : voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "f-syllabes": { gen: fSyllabes, label: "Français · syllabes", icon: "note" },
  "f-rimes": { gen: fRimes, label: "Français · rimes", icon: "star" },
  "f-lettres": { gen: fLettres, label: "Français · lettres et mots", icon: "eye" },
};
