import { gen as rel } from "./rel";
import { gen as frac } from "./frac";
import { gen as pow } from "./pow";
import { gen as eq1 } from "./eq1";
import { gen as geo } from "./geo";
import { gen as iso } from "./iso";
import { gen as lin } from "./lin";
import { gen as eq2 } from "./eq2";
import { gen as trig } from "./trig";
import { gen as log } from "./log";
import { gen as der } from "./der";
import { gen as frPresent } from "./fr-present";
import { gen as frImparfait } from "./fr-imparfait";
import { gen as frFutur } from "./fr-futur";
import { gen as frPc } from "./fr-pc";
import { gen as frHomophones } from "./fr-homophones";
import { gen as frNature } from "./fr-nature";
import { gen as dePraesens } from "./de-praesens";
import { gen as deArtikel } from "./de-artikel";
import { gen as deZahlen } from "./de-zahlen";
import { gen as dePerfekt } from "./de-perfekt";
import { gen as enIrregular } from "./en-irregular";
import { gen as enPresent } from "./en-present";
import { gen as sciUnites } from "./sci-unites";
import { gen as sciMasseVolumique } from "./sci-masse-volumique";
import { gen as sciElectricite } from "./sci-electricite";
import { gen as chiSymboles } from "./chi-symboles";
import { gen as geoCantons } from "./geo-cantons";
import { gen as geoSuisse } from "./geo-suisse";
import { gen as histSuisse } from "./hist-suisse";
import { gen as histMonde } from "./hist-monde";
import { gen as citFederal } from "./cit-federal";
import { gen as citCanton } from "./cit-canton";
import { createFinal } from "./final";
import { perExercice } from "../per";
import type { Generator } from "./types";

export type { Generator, Question } from "./types";
export { createFinal };

/** Générateurs disponibles, référencés par `unites.id_generateur`. "final" est géré à part. */
export const GENERATORS: Record<string, Generator> = {
  // Mathématiques (prototype)
  rel, frac, pow, eq1, geo, iso, lin, eq2, trig, log, der,
  // Français
  "fr-present": frPresent, "fr-imparfait": frImparfait, "fr-futur": frFutur, "fr-pc": frPc,
  "fr-homophones": frHomophones, "fr-nature": frNature,
  // Allemand, anglais
  "de-praesens": dePraesens, "de-artikel": deArtikel, "de-zahlen": deZahlen, "de-perfekt": dePerfekt,
  "en-irregular": enIrregular, "en-present": enPresent,
  // Sciences de la nature
  "sci-unites": sciUnites, "sci-masse-volumique": sciMasseVolumique, "sci-electricite": sciElectricite, "chi-symboles": chiSymboles,
  // Sciences humaines et sociales
  "geo-cantons": geoCantons, "geo-suisse": geoSuisse, "hist-suisse": histSuisse, "hist-monde": histMonde,
  "cit-federal": citFederal, "cit-canton": citCanton,
};

/** Ce que l'élève tape : nombre (clavier − / ,), texte (accents) ou QCM. Sert aux tests et à l'admin. */
export const GENERATOR_LABEL: Record<string, string> = {
  rel: "Nombres négatifs", frac: "Fractions et pourcentages", pow: "Puissances", eq1: "Équations du 1er degré",
  geo: "Aires et volumes", iso: "Isoler une inconnue", lin: "Fonctions et droites", eq2: "Équations du 2e degré",
  trig: "Trigonométrie", log: "Exponentielles et logarithmes", der: "Dérivées",
  "fr-present": "Français · présent", "fr-imparfait": "Français · imparfait", "fr-futur": "Français · futur",
  "fr-pc": "Français · passé composé", "fr-homophones": "Français · homophones", "fr-nature": "Français · nature des mots",
  "de-praesens": "Allemand · Präsens", "de-artikel": "Allemand · der, die, das", "de-zahlen": "Allemand · Zahlen",
  "de-perfekt": "Allemand · Perfekt", "en-irregular": "Anglais · verbes irréguliers", "en-present": "Anglais · present simple",
  "sci-unites": "Sciences · unités", "sci-masse-volumique": "Sciences · masse volumique", "sci-electricite": "Sciences · électricité",
  "chi-symboles": "Chimie · symboles", "geo-cantons": "Géographie · cantons", "geo-suisse": "Géographie · la Suisse",
  "hist-suisse": "Histoire · la Suisse", "hist-monde": "Histoire · le monde", "cit-federal": "Citoyenneté · Confédération",
  "cit-canton": "Citoyenneté · ton canton", final: "Examen final (mélange du parcours)",
};

export const FINAL_ID = "final";

/** Icône par défaut de chaque générateur (rôles définis dans DESIGN.md). */
export const DEFAULT_ICON: Record<string, string> = {
  rel: "flower", frac: "report", pow: "molecule", eq1: "pin", geo: "folder", iso: "mail",
  lin: "plane", eq2: "note", trig: "eye", log: "cal31", der: "laptop", final: "star",
  "fr-present": "note", "fr-imparfait": "mail", "fr-futur": "plane", "fr-pc": "cal31", "fr-homophones": "eye", "fr-nature": "report",
  "de-praesens": "note", "de-artikel": "pin", "de-zahlen": "cal31", "de-perfekt": "mail", "en-irregular": "plane", "en-present": "note",
  "sci-unites": "folder", "sci-masse-volumique": "molecule", "sci-electricite": "laptop", "chi-symboles": "molecule",
  "geo-cantons": "pin", "geo-suisse": "eye", "hist-suisse": "cal31", "hist-monde": "plane", "cit-federal": "report", "cit-canton": "folder",
};

/** Résout le générateur d'une unité ; pour l'examen final, mélange les autres unités du parcours. */
export function resolveGenerator(
  id: string,
  parcoursUnits: readonly { id_generateur: string; titre: string }[],
): Generator {
  if (id === FINAL_ID) {
    return createFinal(
      parcoursUnits
        .filter((u) => u.id_generateur !== FINAL_ID && GENERATORS[u.id_generateur])
        .map((u) => ({ titre: u.titre, gen: withPer(u.id_generateur) })),
    );
  }
  if (!GENERATORS[id]) throw new Error(`Générateur inconnu : ${id}`);
  return withPer(id);
}

/** Chaque question porte le code PER et l'année de son type d'exercices. */
function withPer(id: string): Generator {
  const g = GENERATORS[id];
  const per = perExercice(id);
  return (ctx) => ({ ...g(ctx), ...per });
}
