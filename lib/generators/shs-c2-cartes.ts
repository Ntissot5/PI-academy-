import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
/** 25000 → « 25 000 ». */
const mil = (n: number): string => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const ITEMS: [string, string, string[], string][] = [
  ["Sur une carte, le nord est en général…", "en haut", ["en bas", "à gauche", "à droite"], "Par convention, le nord est en haut de la carte."],
  ["Si le nord est en haut de la carte, l’est est…", "à droite", ["à gauche", "en bas", "en haut"], "Nord en haut, sud en bas, ouest à gauche, est à droite."],
  ["Si le nord est en haut de la carte, l’ouest est…", "à gauche", ["à droite", "en bas", "en haut"], "Ouest à gauche, est à droite."],
  ["Le contraire du nord, c’est…", "le sud", ["l’est", "l’ouest", "le centre"], "Nord ↔ sud ; est ↔ ouest."],
  ["Quel outil indique le nord ?", "Une boussole", ["Une règle", "Un thermomètre", "Un calendrier"], "L’aiguille aimantée de la boussole indique le nord."],
  ["Sur une carte, à quoi sert la légende ?", "À expliquer les couleurs et les symboles", ["À donner le titre seulement", "À décorer la carte", "À mesurer la température"], "Sans légende, on ne sait pas ce que veulent dire les symboles."],
  ["Sur une carte topographique, des courbes de niveau très serrées indiquent…", "une pente raide", ["un terrain plat", "un lac", "une route"], "Chaque courbe relie des points de même altitude : serrées = la pente monte vite."],
  ["Une carte à l’échelle 1 : 25 000 montre…", "plus de détails qu’une carte au 1 : 1 000 000", ["moins de détails qu’une carte au 1 : 1 000 000", "le monde entier", "seulement les pays"], "Plus le nombre est petit, plus la carte est détaillée (grande échelle)."],
  ["Pour voir toute la Suisse sur une page, quelle échelle choisir ?", "1 : 1 000 000", ["1 : 5 000", "1 : 25 000", "1 : 100"], "Une petite échelle montre un grand territoire avec peu de détails."],
  ["Pour dessiner le plan de ta classe sur une feuille, quelle échelle choisir ?", "1 : 50", ["1 : 1 000 000", "1 : 25 000", "1 : 500 000"], "Un petit espace se dessine à grande échelle."],
  ["Le Rhône coule du Valais vers le Léman, puis traverse…", "Genève", ["Bâle", "Lugano", "Coire"], "Le Rhône sort du Léman à Genève puis entre en France."],
  ["Quel grand lac borde Lausanne ?", "Le Léman", ["Le lac de Neuchâtel", "Le lac de Constance", "Le lac Majeur"], "Lausanne est au bord du Léman."],
  ["Quelle chaîne de montagnes se trouve au nord-ouest de la Suisse ?", "Le Jura", ["Les Alpes", "Les Pyrénées", "Les Dolomites"], "Le Jura s’étend de Genève à Bâle et Schaffhouse."],
  ["La région entre le Jura et les Alpes, où vivent la plupart des habitants, est…", "le Plateau", ["l’Engadine", "le Tessin", "les Préalpes"], "Le Plateau suisse concentre villes, routes et industries."],
];

/** Cycle 2 · cartes : points cardinaux, légende, courbes de niveau, échelle (calculs), repères suisses. */
export function gen(): Question {
  const t = R(0, 4);
  if (t <= 1) {
    // Distance réelle à partir de la carte.
    const ech = pick([10000, 25000, 50000, 100000]);
    const cm = R(2, 12);
    const km = (cm * ech) / 100000;
    return { q: `Sur une carte au 1 : ${mil(ech)}, deux villages sont à ${cm} cm. Distance réelle en km ?`, txt: 1, a: km, tol: tolAbs(km, 0.01, 0.01), why: `1 cm sur la carte = ${fr(ech / 100000)} km en réalité. ${cm} × ${fr(ech / 100000)} = ${fr(km)} km.` };
  }
  if (t === 2) {
    const ech = pick([25000, 50000, 100000]);
    const km = pick([1, 2, 3, 5]);
    const cm = (km * 100000) / ech;
    return { q: `Carte au 1 : ${mil(ech)}. Un chemin de ${km} km mesure combien de cm sur la carte ?`, txt: 1, a: cm, tol: tolAbs(cm, 0.01, 0.01), why: `${km} km = ${mil(km * 100000)} cm ; ${mil(km * 100000)} ÷ ${mil(ech)} = ${fr(cm)} cm.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
