import type { Lot } from "./types";
import { gen as angles } from "../m3-angles";
import { gen as figures } from "../m3-figures";
import { gen as polygones } from "../m3-polygones";
import { gen as cercle } from "../m3-cercle";
import { gen as solides } from "../m3-solides";
import { gen as transfo } from "../m3-transfo";
import { gen as homothetie } from "../m3-homothetie";
import { gen as reperage } from "../m3-reperage";
import { gen as nombres } from "../m3-nombres";
import { gen as racines } from "../m3-racines";
import { gen as estimation } from "../m3-estimation";
import { gen as probas } from "../m3-probas";
import { gen as proportion } from "../m3-proportion";
import { gen as echelle } from "../m3-echelle";
import { gen as vitesse } from "../m3-vitesse";
import { gen as fonctions } from "../m3-fonctions";
import { gen as diagrammes } from "../m3-diagrammes";
import { gen as mesures } from "../m3-mesures";
import { gen as pythagore } from "../m3-pythagore";
import { gen as thales } from "../m3-thales";

/** Lot « maths3 » : mathématiques du cycle 3 (9e-11e). Voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "m3-angles": { gen: angles, label: "Maths · Angles et triangles", icon: "star" },
  "m3-figures": { gen: figures, label: "Maths · Figures planes", icon: "flower" },
  "m3-polygones": { gen: polygones, label: "Maths · Polygones réguliers", icon: "star" },
  "m3-cercle": { gen: cercle, label: "Maths · Angles et cercle", icon: "eye" },
  "m3-solides": { gen: solides, label: "Maths · Solides", icon: "folder" },
  "m3-transfo": { gen: transfo, label: "Maths · Isométries", icon: "plane" },
  "m3-homothetie": { gen: homothetie, label: "Maths · Homothéties", icon: "eye" },
  "m3-reperage": { gen: reperage, label: "Maths · Repérage", icon: "pin" },
  "m3-nombres": { gen: nombres, label: "Maths · Divisibilité et numération", icon: "note" },
  "m3-racines": { gen: racines, label: "Maths · Racines", icon: "molecule" },
  "m3-estimation": { gen: estimation, label: "Maths · Problèmes et estimation", icon: "laptop" },
  "m3-probas": { gen: probas, label: "Maths · Probabilités", icon: "star" },
  "m3-proportion": { gen: proportion, label: "Maths · Proportionnalité", icon: "report" },
  "m3-echelle": { gen: echelle, label: "Maths · Échelles, %, pentes", icon: "pin" },
  "m3-vitesse": { gen: vitesse, label: "Maths · Vitesse, débit, ρ", icon: "plane" },
  "m3-fonctions": { gen: fonctions, label: "Maths · Fonctions (9e)", icon: "report" },
  "m3-diagrammes": { gen: diagrammes, label: "Maths · Diagrammes", icon: "report" },
  "m3-mesures": { gen: mesures, label: "Maths · Problèmes de mesure", icon: "folder" },
  "m3-pythagore": { gen: pythagore, label: "Maths · Pythagore", icon: "molecule" },
  "m3-thales": { gen: thales, label: "Maths · Thalès", icon: "eye" },
};
