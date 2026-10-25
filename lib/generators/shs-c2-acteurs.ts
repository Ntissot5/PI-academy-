import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Filières : [produit, producteur, distributeur, consommateur]
const FILIERES: [string, string, string, string][] = [
  ["le Gruyère", "le fromager (avec le paysan qui fournit le lait)", "le magasin d’alimentation", "la famille qui l’achète"],
  ["le pain", "le boulanger", "la boulangerie ou le supermarché", "l’élève qui achète son goûter"],
  ["les pommes", "l’arboriculteur", "le marché ou le supermarché", "le client qui les mange"],
  ["le chocolat", "la fabrique de chocolat", "le grand magasin", "la personne qui le déguste"],
];
const ROLES = ["producteur", "distributeur", "consommateur"];

const ITEMS: [string, string, string[], string][] = [
  ["La commune qui construit une nouvelle école est un acteur…", "public", ["privé", "étranger", "imaginaire"], "Commune, canton, Confédération : acteurs publics."],
  ["Une entreprise de construction qui bâtit l’école est un acteur…", "privé (économique)", ["public (politique)", "international", "religieux"], "Une entreprise est un acteur privé, économique."],
  ["Un club de football du village est un acteur…", "social (une association)", ["politique (le gouvernement)", "économique uniquement", "naturel"], "Les associations sont des acteurs sociaux."],
  ["Qui est un acteur collectif ?", "Une association de quartier", ["Un promeneur seul", "Un enfant qui joue", "Une cycliste"], "Un acteur collectif regroupe plusieurs personnes."],
  ["Pour un nouveau parc, quel acteur pense surtout à la tranquillité ?", "Les habitants voisins", ["L’entreprise de bus", "Les touristes de passage", "Les camions de livraison"], "Chaque groupe voit le même espace selon ses besoins."],
  ["Range ces espaces du plus petit au plus grand.", "Quartier, commune, canton, pays", ["Commune, quartier, pays, canton", "Canton, commune, quartier, pays", "Pays, canton, quartier, commune"], "Changer d’échelle : du local au national."],
  ["Range ces échelles de la plus petite à la plus grande.", "Locale, régionale, nationale, continentale, mondiale", ["Mondiale, locale, nationale, régionale, continentale", "Régionale, locale, mondiale, nationale, continentale", "Nationale, régionale, locale, continentale, mondiale"], "On peut étudier un problème à chacune de ces échelles."],
  ["Le réchauffement climatique est un problème à l’échelle…", "mondiale", ["seulement de ton quartier", "seulement de ta commune", "seulement de ta maison"], "Il concerne toute la planète, même si on peut agir localement."],
  ["Le choix de l’emplacement d’un passage piéton devant l’école se décide à l’échelle…", "locale (la commune)", ["mondiale", "continentale", "nationale"], "C’est une question communale."],
  ["La construction d’une autoroute entre deux cantons concerne surtout l’échelle…", "nationale (la Confédération)", ["de l’appartement", "du quartier seulement", "mondiale"], "Les routes nationales sont gérées par la Confédération."],
  ["Une ville et ses communes voisines qui travaillent ensemble forment une…", "région (agglomération)", ["planète", "continent", "maison"], "L’agglomération dépasse la limite d’une seule commune."],
  ["En Suisse, l’échelon entre la commune et la Confédération est…", "le canton", ["le quartier", "le continent", "la région touristique"], "Commune → canton → Confédération."],
  ["Les produits d’un supermarché suisse viennent…", "de Suisse et d’autres pays", ["seulement de ta commune", "seulement de ton canton", "uniquement d’Asie"], "Notre espace vécu est relié à des espaces lointains par les échanges."],
];

/** Cycle 2 · acteurs (public/privé, producteur/distributeur/consommateur) et échelles (locale à mondiale). */
export function gen(): Question {
  if (Math.random() < 0.35) {
    const f = pick(FILIERES);
    const i = Math.floor(Math.random() * 3);
    return {
      q: `Filière : ${f[0]}. Quel rôle joue ${f[i + 1]} ?`, txt: 1, a: ROLES[i], choices: shuffle([...ROLES]),
      why: `Producteur : ${f[1]}. Distributeur : ${f[2]}. Consommateur : ${f[3]}.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
