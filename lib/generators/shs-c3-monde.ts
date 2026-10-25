import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [pays, capitale, continent]
const PAYS: [string, string, string][] = [
  ["France", "Paris", "Europe"], ["Allemagne", "Berlin", "Europe"], ["Italie", "Rome", "Europe"], ["Autriche", "Vienne", "Europe"],
  ["Espagne", "Madrid", "Europe"], ["Portugal", "Lisbonne", "Europe"], ["Belgique", "Bruxelles", "Europe"], ["Pologne", "Varsovie", "Europe"],
  ["Grèce", "Athènes", "Europe"], ["Suède", "Stockholm", "Europe"], ["Norvège", "Oslo", "Europe"], ["Danemark", "Copenhague", "Europe"],
  ["Irlande", "Dublin", "Europe"], ["Royaume-Uni", "Londres", "Europe"], ["Hongrie", "Budapest", "Europe"], ["Liechtenstein", "Vaduz", "Europe"],
  ["Égypte", "Le Caire", "Afrique"], ["Maroc", "Rabat", "Afrique"], ["Sénégal", "Dakar", "Afrique"], ["Kenya", "Nairobi", "Afrique"], ["Éthiopie", "Addis-Abeba", "Afrique"],
  ["Canada", "Ottawa", "Amérique"], ["États-Unis", "Washington", "Amérique"], ["Mexique", "Mexico", "Amérique"], ["Brésil", "Brasilia", "Amérique"], ["Argentine", "Buenos Aires", "Amérique"], ["Pérou", "Lima", "Amérique"],
  ["Japon", "Tokyo", "Asie"], ["Chine", "Pékin", "Asie"], ["Inde", "New Delhi", "Asie"], ["Thaïlande", "Bangkok", "Asie"], ["Corée du Sud", "Séoul", "Asie"],
  ["Australie", "Canberra", "Océanie"],
];
const CONTINENTS = ["Europe", "Afrique", "Amérique", "Asie", "Océanie"];

const ITEMS: [string, string, string[], string][] = [
  ["Quel est le plus grand océan du monde ?", "L’océan Pacifique", ["L’océan Atlantique", "L’océan Indien", "L’océan Arctique"], "Le Pacifique couvre environ un tiers de la surface de la Terre."],
  ["Quel océan sépare l’Europe de l’Amérique ?", "L’océan Atlantique", ["L’océan Pacifique", "L’océan Indien", "La mer Méditerranée"], "On traverse l’Atlantique pour aller d’Europe en Amérique."],
  ["Quelle mer borde le sud de la France, de l’Italie et de la Grèce ?", "La mer Méditerranée", ["La mer du Nord", "La mer Baltique", "La mer Noire"], "La Méditerranée est entourée par l’Europe, l’Asie et l’Afrique."],
  ["Quel fleuve traverse l’Égypte ?", "Le Nil", ["Le Danube", "L’Amazone", "Le Mississippi"], "Le Nil, l’un des plus longs fleuves du monde, se jette dans la Méditerranée."],
  ["Quel grand fleuve traverse Vienne et Budapest ?", "Le Danube", ["Le Rhin", "Le Rhône", "La Seine"], "Le Danube traverse plusieurs capitales d’Europe centrale."],
  ["Quel fleuve né en Suisse se jette dans la mer du Nord ?", "Le Rhin", ["Le Rhône", "Le Danube", "Le Pô"], "Le Rhin traverse Bâle, puis l’Allemagne et les Pays-Bas."],
  ["Quel fleuve né en Suisse se jette dans la Méditerranée ?", "Le Rhône", ["Le Rhin", "L’Inn", "La Seine"], "Le Rhône naît au glacier du Rhône, traverse le Léman et la France."],
  ["Quel est le plus grand désert chaud du monde ?", "Le Sahara", ["Le désert de Gobi", "Le désert d’Atacama", "Le Kalahari"], "Le Sahara couvre une grande partie du nord de l’Afrique."],
  ["Quelle grande forêt tropicale se trouve surtout au Brésil ?", "L’Amazonie", ["La Forêt-Noire", "La taïga sibérienne", "Le Jura"], "L’Amazonie est la plus grande forêt tropicale du monde."],
  ["Quelle chaîne de montagnes contient le plus haut sommet du monde (l’Everest) ?", "L’Himalaya", ["Les Alpes", "Les Andes", "Les Rocheuses"], "L’Everest culmine à plus de 8 800 m, entre le Népal et la Chine."],
  ["Quelle chaîne de montagnes longe l’ouest de l’Amérique du Sud ?", "Les Andes", ["L’Himalaya", "Les Alpes", "L’Oural"], "Les Andes s’étendent du nord au sud du continent."],
  ["Quels sont les pays voisins de la Suisse ?", "France, Allemagne, Autriche, Liechtenstein, Italie", ["France, Belgique, Autriche, Italie", "Allemagne, Italie, Espagne, Autriche", "France, Italie, Slovénie, Allemagne"], "La Suisse a 5 pays voisins."],
  ["Quelle ligne imaginaire partage la Terre en hémisphère nord et hémisphère sud ?", "L’équateur", ["Le méridien de Greenwich", "Le tropique du Cancer", "Le cercle polaire"], "La Suisse est dans l’hémisphère nord."],
];

/** Cycle 3 · repères spatiaux : l'Europe, l'Afrique, l'Amérique, l'Asie et le monde (capitales, continents, océans, fleuves, reliefs). */
export function gen(): Question {
  const t = R(0, 2);
  if (t === 0) {
    const [p, cap] = pick(PAYS);
    const faux = shuffle(PAYS.filter((x) => x[1] !== cap)).slice(0, 3).map((x) => x[1]);
    return { q: `Quelle est la capitale du pays suivant : ${p} ?`, txt: 1, a: cap, choices: shuffle([cap, ...faux]), why: `${p} : capitale ${cap}.` };
  }
  if (t === 1) {
    const [p, , cont] = pick(PAYS);
    const faux = shuffle(CONTINENTS.filter((c) => c !== cont)).slice(0, 3);
    return { q: `Sur quel continent se trouve ce pays : ${p} ?`, txt: 1, a: cont, choices: shuffle([cont, ...faux]), why: `${p} se trouve en ${cont}.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
