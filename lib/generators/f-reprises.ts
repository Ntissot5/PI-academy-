import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ITEMS: readonly Item[] = [
  ["« La buse plane au-dessus du champ. *Ce rapace* guette une souris. » Que désigne « ce rapace » ?", "la buse", ["le champ", "une souris", "un autre oiseau"], "« ce rapace » reprend « la buse » : c’est une reprise par un terme générique."],
  ["« Le bouquetin grimpe sur les rochers. *Il* a de longues cornes. » Que désigne « il » ?", "le bouquetin", ["les rochers", "un chasseur", "un rocher"], "Le pronom « il » reprend « le bouquetin »."],
  ["« Mia a reçu un chiot. *L’animal* dort dans sa chambre. » Que désigne « l’animal » ?", "le chiot", ["Mia", "la chambre", "un chat"], "« l’animal » est un terme générique qui reprend « un chiot »."],
  ["« Guillaume Tell refusa de saluer le chapeau. *Le héros* fut arrêté. » Que désigne « le héros » ?", "Guillaume Tell", ["le chapeau", "un soldat", "le bailli"], "« le héros » reprend « Guillaume Tell »."],
  ["« Les enfants ont construit une cabane. *Elle* est cachée dans les arbres. » Que désigne « elle » ?", "la cabane", ["les enfants", "les arbres", "une fille"], "« elle » (féminin singulier) reprend « une cabane »."],
  ["« Paul a rencontré Inès. *Celle-ci* lui a souri. » Que désigne « celle-ci » ?", "Inès", ["Paul", "une voisine", "la rencontre"], "« celle-ci » reprend le dernier nom féminin cité : Inès."],
  ["« Le Rhône traverse le Valais. *Le fleuve* se jette ensuite dans le Léman. » Que désigne « le fleuve » ?", "le Rhône", ["le Valais", "le Léman", "un torrent"], "« le fleuve » reprend « le Rhône »."],
  ["« Le cambrioleur entra par la fenêtre. *L’homme* portait une cagoule. » Que désigne « l’homme » ?", "le cambrioleur", ["un policier", "le propriétaire", "la fenêtre"], "« l’homme » reprend « le cambrioleur »."],
  ["« Mes grands-parents habitent à Bulle. Je *leur* rends visite chaque dimanche. » Que désigne « leur » ?", "mes grands-parents", ["les habitants de Bulle", "mes parents", "mes cousins"], "« leur » reprend « mes grands-parents »."],
  ["« Ramuz est né à Lausanne en 1878. *L’écrivain vaudois* a décrit la vie des paysans. » Que désigne « l’écrivain vaudois » ?", "Ramuz", ["un paysan", "un habitant de Lausanne", "un journaliste"], "« l’écrivain vaudois » est une périphrase qui reprend « Ramuz »."],
];

const PROCEDE: readonly Item[] = [
  ["« Le chat dort. *Il* ronronne. » La reprise se fait par…", "un pronom", ["un synonyme", "un terme générique", "une périphrase"], "« il » est un pronom."],
  ["« La voiture démarre. *Le véhicule* s’éloigne. » La reprise se fait par…", "un terme générique", ["un pronom", "une répétition", "un terme spécifique"], "« véhicule » est plus général que « voiture » : terme générique."],
  ["« Le lion rugit. *Le roi des animaux* est en colère. » La reprise se fait par…", "une périphrase", ["un pronom", "un synonyme", "un déterminant"], "Une périphrase désigne le lion par plusieurs mots."],
  ["« Il a acheté un vélo. *Cette bicyclette* est rapide. » La reprise se fait par…", "un synonyme", ["un pronom", "un terme générique", "une périphrase"], "« bicyclette » est un synonyme de « vélo »."],
];

/** Reprises de l'information (anaphores) : que désigne le mot ou le groupe de mots ? */
export function gen(): Question {
  return tirer([deBanque(ITEMS), deBanque(ITEMS), deBanque(PROCEDE)]);
}
