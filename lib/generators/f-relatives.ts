import { pick } from "../math";
import { deBanque, gras, melange, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* [phrase avec ___, pronom relatif, explication]. */
const CHOIX: readonly (readonly [string, string, string])[] = [
  ["Le garçon ___ court est mon cousin.", "qui", "« qui » est sujet du verbe « court »."],
  ["Le livre ___ je lis est passionnant.", "que", "« que » est complément direct de « lis » (je lis le livre)."],
  ["Le film ___ tu parles est sorti hier.", "dont", "« dont » remplace « de + nom » : tu parles du film."],
  ["La ville ___ j’habite est au bord du lac.", "où", "« où » indique le lieu : j’habite dans la ville."],
  ["Le chien ___ aboie appartient au voisin.", "qui", "« qui » est sujet de « aboie »."],
  ["La chanson ___ tu chantes me plaît.", "que", "« que » est complément direct de « chantes »."],
  ["C’est un ami ___ je suis fier.", "dont", "Être fier de quelqu’un : « dont »."],
  ["Je me souviens du jour ___ tu es arrivé.", "où", "« où » peut aussi indiquer le temps."],
  ["La montagne ___ on voit le sommet est le Moléson.", "dont", "On voit le sommet de la montagne : « dont »."],
  ["Les élèves ___ ont fini peuvent sortir.", "qui", "« qui » est sujet de « ont fini »."],
  ["La lettre ___ j’ai reçue vient de Bâle.", "que", "« que » est complément direct de « ai reçue »."],
  ["Le village ___ nous passons nos vacances est calme.", "où", "« où » indique le lieu."],
];

function choisir(): Question {
  const [p, a, why] = pick(CHOIX);
  return { q: gras(p.replace("___", "<b>___</b>")), txt: 1, a, choices: melange(["qui", "que", "dont", "où"]), why: `« ${a} ». ${why}` };
}

/* Antécédent du pronom relatif. */
const ANTE: readonly Item[] = [
  ["Dans *Le vélo que mon frère a acheté est rouge*, quel est l’antécédent de « que » ?", "le vélo", ["mon frère", "rouge", "acheté"], "« que » reprend « le vélo » : c’est l’antécédent."],
  ["Dans *J’ai rencontré la fille qui habite en face*, quel est l’antécédent de « qui » ?", "la fille", ["j’", "en face", "habite"], "« qui » reprend « la fille »."],
  ["Dans *Voici la maison où j’ai grandi*, quel est l’antécédent de « où » ?", "la maison", ["j’", "grandi", "voici"], "« où » reprend « la maison »."],
  ["Dans *Le sport dont il rêve est le hockey*, quel est l’antécédent de « dont » ?", "le sport", ["il", "le hockey", "rêve"], "« dont » reprend « le sport »."],
];

/* Identifier la subordonnée relative. */
const IDENT: readonly Item[] = [
  ["Quelle est la subordonnée relative dans *Les fleurs que tu as cueillies sentent bon* ?", "que tu as cueillies", ["les fleurs", "sentent bon", "tu as cueillies"], "La relative commence par le pronom relatif « que » et complète le nom « fleurs »."],
  ["Quelle est la subordonnée relative dans *Le chat qui dort sur le canapé s’appelle Pacha* ?", "qui dort sur le canapé", ["le chat", "s’appelle Pacha", "sur le canapé"], "La relative commence par « qui » et complète « le chat »."],
  ["Quelle est la subordonnée relative dans *C’est la forêt où nous avons vu un cerf* ?", "où nous avons vu un cerf", ["c’est la forêt", "un cerf", "nous avons vu"], "La relative commence par « où » et complète « la forêt »."],
];

/** Pronoms relatifs (qui, que, dont, où) et subordonnées relatives compléments du nom. */
export function gen(): Question {
  return tirer([choisir, choisir, deBanque(ANTE), deBanque(IDENT)]);
}
