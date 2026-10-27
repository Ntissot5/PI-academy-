import type { Lot } from "./types";
import { gen as snC1Matiere } from "../sn-c1-matiere";
import { gen as snC1ForcesSaisons } from "../sn-c1-forces-saisons";
import { gen as snC1Corps } from "../sn-c1-corps";
import { gen as snC1Sens } from "../sn-c1-sens";
import { gen as snC1Vivant } from "../sn-c1-vivant";
import { gen as snC1Demarche } from "../sn-c1-demarche";
import { gen as snC2Matiere } from "../sn-c2-matiere";
import { gen as snC2Mecanique } from "../sn-c2-mecanique";
import { gen as snC2Energie } from "../sn-c2-energie";
import { gen as snC2Ciel } from "../sn-c2-ciel";
import { gen as snC2Demarche } from "../sn-c2-demarche";
import { gen as snC2Corps } from "../sn-c2-corps";
import { gen as snC2Appareils } from "../sn-c2-appareils";
import { gen as snC2Classification } from "../sn-c2-classification";
import { gen as snC2Chaines } from "../sn-c2-chaines";
import { gen as snC2Cycles } from "../sn-c2-cycles";
import { gen as snC3Matiere } from "../sn-c3-matiere";
import { gen as snC3Optique } from "../sn-c3-optique";
import { gen as snC3Mecanique } from "../sn-c3-mecanique";
import { gen as snC3Energie } from "../sn-c3-energie";
import { gen as snC3Demarche } from "../sn-c3-demarche";
import { gen as snC3Organisme } from "../sn-c3-organisme";
import { gen as snC3NerfsSquelette } from "../sn-c3-nerfs-squelette";
import { gen as snC3DigestionCirculation } from "../sn-c3-digestion-circulation";
import { gen as snC3Reproduction } from "../sn-c3-reproduction";
import { gen as snC3Ecosystemes } from "../sn-c3-ecosystemes";
import { gen as snC3CelluleGenetique } from "../sn-c3-cellule-genetique";
import { gen as shsC1Espace } from "../shs-c1-espace";
import { gen as shsC1Amenagement } from "../shs-c1-amenagement";
import { gen as shsC2Cartes } from "../shs-c2-cartes";
import { gen as shsC2Territoire } from "../shs-c2-territoire";
import { gen as shsC2Acteurs } from "../shs-c2-acteurs";
import { gen as shsC3Monde } from "../shs-c3-monde";
import { gen as shsC3Territoires } from "../shs-c3-territoires";
import { gen as shsC3ActeursEchelles } from "../shs-c3-acteurs-echelles";
import { gen as shsC1Calendrier } from "../shs-c1-calendrier";
import { gen as shsC1Autrefois } from "../shs-c1-autrefois";
import { gen as shsC2Siecles } from "../shs-c2-siecles";
import { gen as shsC2Periodes } from "../shs-c2-periodes";
import { gen as shsC2Sources } from "../shs-c2-sources";
import { gen as shsC3Sources } from "../shs-c3-sources";
import { gen as shsC3Societes } from "../shs-c3-societes";
import { gen as shsC3Religions } from "../shs-c3-religions";
import { gen as shsC2DroitsEnfant } from "../shs-c2-droits-enfant";
import { gen as shsC2Commune } from "../shs-c2-commune";
import { gen as shsC3Etat } from "../shs-c3-etat";
import { gen as shsC3SuisseMonde } from "../shs-c3-suisse-monde";

/** Lot « sciences-shs » : sciences de la nature, géographie, histoire et citoyenneté (cycles 1 à 3). Voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "sn-c1-matiere": { gen: snC1Matiere, label: "Sciences · la matière (cycle 1)", icon: "molecule" },
  "sn-c1-forces-saisons": { gen: snC1ForcesSaisons, label: "Sciences · forces et saisons (cycle 1)", icon: "flower" },
  "sn-c1-corps": { gen: snC1Corps, label: "Sciences · mon corps (cycle 1)", icon: "star" },
  "sn-c1-sens": { gen: snC1Sens, label: "Sciences · les 5 sens (cycle 1)", icon: "eye" },
  "sn-c1-vivant": { gen: snC1Vivant, label: "Sciences · le vivant (cycle 1)", icon: "flower" },
  "sn-c1-demarche": { gen: snC1Demarche, label: "Sciences · observer et mesurer (cycle 1)", icon: "folder" },
  "sn-c2-matiere": { gen: snC2Matiere, label: "Sciences · eau, air et mélanges", icon: "molecule" },
  "sn-c2-mecanique": { gen: snC2Mecanique, label: "Sciences · leviers et mouvements", icon: "laptop" },
  "sn-c2-energie": { gen: snC2Energie, label: "Sciences · électricité et énergie (cycle 2)", icon: "laptop" },
  "sn-c2-ciel": { gen: snC2Ciel, label: "Sciences · lumière, Soleil et planètes", icon: "star" },
  "sn-c2-demarche": { gen: snC2Demarche, label: "Sciences · démarche scientifique (cycle 2)", icon: "folder" },
  "sn-c2-corps": { gen: snC2Corps, label: "Sciences · corps et santé (cycle 2)", icon: "report" },
  "sn-c2-appareils": { gen: snC2Appareils, label: "Sciences · digestion, respiration, squelette", icon: "report" },
  "sn-c2-classification": { gen: snC2Classification, label: "Sciences · classer les êtres vivants", icon: "flower" },
  "sn-c2-chaines": { gen: snC2Chaines, label: "Sciences · chaînes alimentaires", icon: "flower" },
  "sn-c2-cycles": { gen: snC2Cycles, label: "Sciences · cycles de vie", icon: "flower" },
  "sn-c3-matiere": { gen: snC3Matiere, label: "Sciences · matière et réactions", icon: "molecule" },
  "sn-c3-optique": { gen: snC3Optique, label: "Sciences · couleurs et lumière", icon: "eye" },
  "sn-c3-mecanique": { gen: snC3Mecanique, label: "Sciences · vitesse et forces", icon: "plane" },
  "sn-c3-energie": { gen: snC3Energie, label: "Sciences · énergie", icon: "laptop" },
  "sn-c3-demarche": { gen: snC3Demarche, label: "Sciences · démarche scientifique (cycle 3)", icon: "folder" },
  "sn-c3-organisme": { gen: snC3Organisme, label: "Sciences · organisme et santé", icon: "report" },
  "sn-c3-nerfs-squelette": { gen: snC3NerfsSquelette, label: "Sciences · nerfs, os et muscles", icon: "report" },
  "sn-c3-digestion-circulation": { gen: snC3DigestionCirculation, label: "Sciences · digestion, cœur, poumons", icon: "report" },
  "sn-c3-reproduction": { gen: snC3Reproduction, label: "Sciences · puberté et reproduction", icon: "note" },
  "sn-c3-ecosystemes": { gen: snC3Ecosystemes, label: "Sciences · écosystèmes et photosynthèse", icon: "flower" },
  "sn-c3-cellule-genetique": { gen: snC3CelluleGenetique, label: "Sciences · cellule et hérédité", icon: "molecule" },
  "shs-c1-espace": { gen: shsC1Espace, label: "Géographie · se repérer (cycle 1)", icon: "pin" },
  "shs-c1-amenagement": { gen: shsC1Amenagement, label: "Géographie · mon espace (cycle 1)", icon: "pin" },
  "shs-c2-cartes": { gen: shsC2Cartes, label: "Géographie · cartes et échelle", icon: "pin" },
  "shs-c2-territoire": { gen: shsC2Territoire, label: "Géographie · aménager l’espace", icon: "pin" },
  "shs-c2-acteurs": { gen: shsC2Acteurs, label: "Géographie · acteurs et échelles (cycle 2)", icon: "pin" },
  "shs-c3-monde": { gen: shsC3Monde, label: "Géographie · l’Europe et le monde", icon: "plane" },
  "shs-c3-territoires": { gen: shsC3Territoires, label: "Géographie · risques, villes, migrations", icon: "plane" },
  "shs-c3-acteurs-echelles": { gen: shsC3ActeursEchelles, label: "Géographie · acteurs et échelles (cycle 3)", icon: "pin" },
  "shs-c1-calendrier": { gen: shsC1Calendrier, label: "Histoire · le temps qui passe (cycle 1)", icon: "cal31" },
  "shs-c1-autrefois": { gen: shsC1Autrefois, label: "Histoire · autrefois (cycle 1)", icon: "cal31" },
  "shs-c2-siecles": { gen: shsC2Siecles, label: "Histoire · siècles et durées", icon: "cal31" },
  "shs-c2-periodes": { gen: shsC2Periodes, label: "Histoire · les grandes périodes", icon: "cal31" },
  "shs-c2-sources": { gen: shsC2Sources, label: "Histoire · traces et sources (cycle 2)", icon: "folder" },
  "shs-c3-sources": { gen: shsC3Sources, label: "Histoire · sources et mémoire (cycle 3)", icon: "folder" },
  "shs-c3-societes": { gen: shsC3Societes, label: "Histoire · les sociétés", icon: "cal31" },
  "shs-c3-religions": { gen: shsC3Religions, label: "Histoire · le fait religieux", icon: "note" },
  "shs-c2-droits-enfant": { gen: shsC2DroitsEnfant, label: "Citoyenneté · droits de l’enfant", icon: "star" },
  "shs-c2-commune": { gen: shsC2Commune, label: "Citoyenneté · la commune", icon: "mail" },
  "shs-c3-etat": { gen: shsC3Etat, label: "Citoyenneté · l’État et les droits", icon: "report" },
  "shs-c3-suisse-monde": { gen: shsC3SuisseMonde, label: "Citoyenneté · la Suisse et le monde", icon: "plane" },
};
