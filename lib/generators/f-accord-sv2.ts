import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ELOIGNE: readonly Item[] = [
  ["Les enfants de ma voisine *…* au parc.", "jouent", ["joue", "joues"], "Le sujet est « les enfants » (et non « ma voisine ») : jouent."],
  ["Le chien des voisins *…* toute la nuit.", "aboie", ["aboient", "aboies"], "Le sujet est « le chien » : aboie."],
  ["La couleur de ces fleurs *…* magnifique.", "est", ["sont", "es"], "Le sujet est « la couleur » : est."],
  ["Les élèves, qui avaient bien travaillé, *…* contents.", "étaient", ["était", "étais"], "Le sujet est « les élèves » : étaient."],
  ["Les feuilles de cet arbre *…* en automne.", "tombent", ["tombe", "tombes"], "Le sujet est « les feuilles » : tombent."],
  ["Le bruit des vagues *…* les enfants.", "endort", ["endorment", "endors"], "Le sujet est « le bruit » : endort."],
  ["Mes amis les *…* souvent.", "invitent", ["invite", "invites"], "« les » est un pronom complément ; le sujet est « mes amis » : invitent."],
  ["Le maître leur *…* une histoire.", "lit", ["lisent", "lis"], "« leur » est un pronom complément ; le sujet est « le maître » : lit."],
];
const MULTIPLE: readonly Item[] = [
  ["Mon père et ma mère *…* au marché.", "vont", ["va", "vas"], "Deux sujets à la 3e personne = ils : vont."],
  ["Mon père et moi *…* au marché.", "allons", ["vont", "va"], "« Mon père et moi » = nous : allons."],
  ["Toi et moi *…* les meilleurs amis.", "sommes", ["êtes", "sont"], "« Toi et moi » = nous : sommes."],
  ["Paul et toi *…* en retard.", "êtes", ["sont", "sommes"], "« Paul et toi » = vous : êtes."],
  ["Le chat et le chien *…* ensemble.", "dorment", ["dort", "dors"], "Deux sujets = ils : dorment."],
  ["Ta sœur et toi *…* le piano.", "jouez", ["jouent", "jouons"], "« Ta sœur et toi » = vous : jouez."],
  ["Léa, Sami et moi *…* une cabane.", "construisons", ["construisent", "construisez"], "Plusieurs sujets dont « moi » = nous : construisons."],
  ["Le vent et la pluie *…* la fenêtre.", "frappent", ["frappe", "frappes"], "Deux sujets = ils : frappent."],
];
const QUI: readonly Item[] = [
  ["C’est moi qui *…* le gâteau.", "ai fait", ["a fait", "as fait"], "« qui » remplace « moi » : le verbe est à la 1re personne (j’ai fait)."],
  ["C’est toi qui *…* raison.", "as", ["a", "ai"], "« qui » remplace « toi » : 2e personne (tu as)."],
  ["C’est nous qui *…* gagné.", "avons", ["ont", "a"], "« qui » remplace « nous » : avons."],
  ["Les enfants qui *…* dans la cour sont bruyants.", "jouent", ["joue", "jouons"], "« qui » remplace « les enfants » : jouent."],
  ["J’aime les livres qui *…* peur.", "font", ["fait", "fais"], "« qui » remplace « les livres » : font."],
  ["C’est vous qui *…* choisi ce film.", "avez", ["ont", "a"], "« qui » remplace « vous » : avez."],
];
const ATTRIBUT: readonly Item[] = [
  ["Les montagnes sont *…*.", "enneigées", ["enneigé", "enneigés"], "L’attribut s’accorde avec le sujet « les montagnes » (féminin pluriel)."],
  ["Mes sœurs semblent *…*.", "fatiguées", ["fatigué", "fatiguée"], "L’attribut s’accorde avec le sujet « mes sœurs »."],
  ["Ces exercices paraissent *…*.", "faciles", ["facile", "facils"], "L’attribut s’accorde avec le sujet « ces exercices » : faciles."],
  ["La soupe est *…*.", "chaude", ["chaud", "chaudes"], "L’attribut s’accorde avec « la soupe » (féminin singulier)."],
  ["Les chats restent *…*.", "calmes", ["calme", "calmés"], "L’attribut s’accorde avec « les chats » : calmes."],
  ["Lina et Zoé deviennent *…*.", "grandes", ["grands", "grande"], "Deux sujets féminins : l’attribut est au féminin pluriel."],
  ["Mon frère et ma sœur sont *…*.", "contents", ["contentes", "content"], "Sujets masculin + féminin : l’attribut est au masculin pluriel."],
];

const consigne = "Choisis la bonne forme : ";

/** Accord sujet-verbe : sujet éloigné, sujets multiples et de personnes différentes, « qui », accord de l'attribut. */
export function gen(): Question {
  return tirer([ELOIGNE, MULTIPLE, MULTIPLE, QUI, ATTRIBUT].map((b) => deBanque(b, consigne)));
}
