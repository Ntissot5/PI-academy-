import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec ___, bonne réponse, autre choix, astuce]
const ITEMS: [string, string, string, string][] = [
  ["Léa ___ un vélo rouge.", "a", "à", "On peut dire « avait » : c’est le verbe avoir."],
  ["Nous allons ___ Lausanne demain.", "à", "a", "On ne peut pas dire « avait » : c’est la préposition."],
  ["Il pense ___ ses vacances.", "à", "a", "On ne peut pas dire « avait »."],
  ["Mon frère ___ peur des araignées.", "a", "à", "On peut dire « avait peur »."],
  ["Le chat ___ le chien dorment.", "et", "est", "On peut dire « et puis » : c’est un lien."],
  ["Le lac ___ très calme ce matin.", "est", "et", "On peut dire « était » : c’est le verbe être."],
  ["Elle ___ partie tôt.", "est", "et", "On peut dire « était partie »."],
  ["J’achète du pain ___ du fromage.", "et", "est", "On peut dire « et puis »."],
  ["Les élèves ___ en retard.", "sont", "son", "On peut dire « étaient » : c’est le verbe être."],
  ["Il range ___ classeur.", "son", "sont", "On peut dire « mon classeur » : c’est un déterminant."],
  ["Mes amis ___ contents.", "sont", "son", "On peut dire « étaient contents »."],
  ["Elle a perdu ___ écharpe.", "son", "sont", "On peut dire « mon écharpe »."],
  ["Tu veux du thé ___ du chocolat ?", "ou", "où", "On peut dire « ou bien »."],
  ["___ as-tu mis tes clés ?", "Où", "Ou", "C’est une question sur le lieu."],
  ["La ville ___ j’habite est petite.", "où", "ou", "On parle d’un lieu."],
  ["Il prend le bus ___ le train.", "ou", "où", "On peut dire « ou bien »."],
  ["Regarde ___ montagnes, là-bas !", "ces", "ses", "On les montre : « ces montagnes-là »."],
  ["Paul a oublié ___ gants.", "ses", "ces", "Ce sont les gants de Paul : « les siens »."],
  ["Elle range ___ livres dans son sac.", "ses", "ces", "Ce sont ses livres à elle."],
  ["___ chaussures-ci sont trop petites.", "Ces", "Ses", "On les montre : « ces chaussures-ci »."],
  ["Ils ___ gagné le match.", "ont", "on", "On peut dire « avaient » : c’est le verbe avoir."],
  ["___ part en course d’école lundi.", "On", "Ont", "On peut remplacer par « il » : c’est un pronom."],
  ["Mes voisins ___ un grand jardin.", "ont", "on", "On peut dire « avaient »."],
  ["Le soir, ___ regarde un film.", "on", "ont", "On peut dire « il regarde »."],
  ["Il ___ lave les mains.", "se", "ce", "On peut dire « je me lave » : c’est un pronom avant le verbe."],
  ["___ matin, il pleut.", "Ce", "Se", "On peut dire « ce matin-là » : c’est un déterminant."],
  ["Il y a ___ de neige cette année.", "peu", "peut", "On peut dire « beaucoup » : c’est l’adverbe."],
  ["Il ___ venir avec nous.", "peut", "peu", "On peut dire « pouvait » : c’est le verbe pouvoir."],
];

/** Homophones grammaticaux : a/à, et/est, son/sont, ou/où, ces/ses, on/ont, se/ce, peu/peut. */
export function gen(): Question {
  const [phrase, bon, autre, astuce] = pick(ITEMS);
  const choices = Math.random() < 0.5 ? [bon, autre] : [autre, bon];
  return { q: phrase.replace("___", "<b>___</b>"), txt: 1, a: bon, choices, why: `« ${bon} ». ${astuce}` };
}
