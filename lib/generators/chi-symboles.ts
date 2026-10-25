import { R, pick } from "../math";
import type { Question } from "./types";

// [symbole, nom, variantes du nom]
const EL: [string, string, string[]?][] = [
  ["H", "hydrogène"], ["He", "hélium"], ["Li", "lithium"], ["C", "carbone"], ["N", "azote"], ["O", "oxygène"],
  ["F", "fluor"], ["Ne", "néon"], ["Na", "sodium"], ["Mg", "magnésium"], ["Al", "aluminium"], ["Si", "silicium"],
  ["P", "phosphore"], ["S", "soufre"], ["Cl", "chlore"], ["Ar", "argon"], ["K", "potassium"], ["Ca", "calcium"],
  ["Fe", "fer"], ["Cu", "cuivre"], ["Zn", "zinc"], ["Ag", "argent"], ["Au", "or"], ["Hg", "mercure"],
  ["Pb", "plomb"], ["Sn", "étain"], ["I", "iode"], ["Ni", "nickel"], ["Pt", "platine"], ["U", "uranium"],
];

/** Symboles chimiques, dans les deux sens. */
export function gen(): Question {
  const [sym, nom, alt = []] = pick(EL);
  const latin: Record<string, string> = { Na: "natrium", K: "kalium", Fe: "ferrum", Cu: "cuprum", Ag: "argentum", Au: "aurum", Hg: "hydrargyrum", Pb: "plumbum", Sn: "stannum" };
  const why = latin[sym] ? `${sym} = ${nom} (du latin ${latin[sym]}).` : `${sym} = ${nom}.`;
  if (R(0, 1) === 0) return { q: `Quel élément a pour symbole <b>${sym}</b> ?`, txt: 1, a: nom, accept: [`le ${nom}`, `l’${nom}`, `l'${nom}`, ...alt], keys: ["é", "è"], why };
  return { q: `Symbole chimique de l’élément « ${nom} » ?`, txt: 1, a: sym, why };
}
