import type { Generator } from "../types";

/** Un lot de types d'exercices : générateur, libellé (admin, tests) et icône par défaut. */
export type Lot = Record<string, { gen: Generator; label: string; icon: string }>;
