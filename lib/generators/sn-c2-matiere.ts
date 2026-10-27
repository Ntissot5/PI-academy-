import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quels sont les trois états de la matière ?", "Solide, liquide, gazeux", ["Chaud, froid, tiède", "Dur, mou, cassant", "Lourd, léger, moyen"], "L’eau peut être solide (glace), liquide (eau) ou gazeuse (vapeur d’eau)."],
  ["À quelle température l’eau pure gèle-t-elle (au niveau de la mer) ?", "0 °C", ["10 °C", "−10 °C", "100 °C"], "L’eau pure gèle et la glace fond à 0 °C."],
  ["À quelle température l’eau pure bout-elle (au niveau de la mer) ?", "100 °C", ["50 °C", "0 °C", "200 °C"], "L’eau pure bout à 100 °C. En montagne, elle bout un peu plus bas."],
  ["Comment s’appelle le passage de l’état solide à l’état liquide ?", "La fusion", ["La solidification", "L’évaporation", "La condensation"], "La glace qui fond : c’est la fusion."],
  ["Comment s’appelle le passage de l’état liquide à l’état solide ?", "La solidification", ["La fusion", "L’ébullition", "La filtration"], "L’eau qui gèle : c’est la solidification."],
  ["Comment s’appelle le passage de l’eau liquide à la vapeur, sans bouillir (une flaque qui sèche) ?", "L’évaporation", ["La condensation", "La fusion", "La décantation"], "Au soleil, l’eau de la flaque s’évapore."],
  ["De la buée apparaît sur un miroir froid. Comment s’appelle ce phénomène ?", "La condensation", ["L’évaporation", "La fusion", "La filtration"], "La vapeur d’eau de l’air redevient liquide au contact du froid : c’est la condensation."],
  ["On fait fondre 200 g de glace. Quelle est la masse de l’eau obtenue ?", "200 g", ["Moins de 200 g", "Plus de 200 g", "0 g"], "La masse se conserve lors d’un changement d’état."],
  ["On écrase une boule de pâte à modeler de 50 g en galette. Sa masse est…", "toujours 50 g", ["plus petite", "plus grande", "impossible à savoir"], "Changer la forme d’un objet ne change pas sa masse."],
  ["Le cycle de l’eau : que devient l’eau qui s’évapore des lacs et de la mer ?", "Elle forme des nuages en refroidissant", ["Elle disparaît pour toujours", "Elle devient du sel", "Elle part dans l’espace"], "La vapeur monte, se refroidit et se condense en gouttelettes : les nuages. Puis il pleut ou il neige."],
  ["Dans le cycle de l’eau, la pluie et la neige s’appellent…", "les précipitations", ["les évaporations", "les condensations", "les infiltrations"], "Les précipitations : pluie, neige, grêle qui tombent des nuages."],
  ["Le brouillard, c’est…", "un nuage au ras du sol", ["de la fumée", "de la vapeur invisible", "de la neige fondue"], "Le brouillard est fait de minuscules gouttelettes d’eau, comme un nuage posé au sol."],
  ["Le givre se forme…", "quand il fait très froid, sur les surfaces gelées", ["quand il fait très chaud", "seulement en été", "seulement sous la pluie"], "La vapeur d’eau de l’air se dépose en glace sur les surfaces très froides."],
  ["Du sel dissous dans l’eau forme un mélange…", "homogène (on ne voit qu’une seule phase)", ["hétérogène (on voit plusieurs phases)", "solide", "gazeux"], "On ne distingue plus le sel : le mélange est homogène."],
  ["De l’huile et de l’eau forment un mélange…", "hétérogène (on voit deux couches)", ["homogène", "transparent et uniforme", "gazeux"], "L’huile flotte sur l’eau : on voit deux couches, le mélange est hétérogène."],
  ["Comment séparer le sable de l’eau ?", "Par filtration (avec un filtre à café)", ["Par congélation", "En secouant", "En ajoutant du sel"], "Le filtre retient le sable et laisse passer l’eau."],
  ["Comment récupérer le sel dissous dans de l’eau salée ?", "Par évaporation de l’eau", ["Par filtration", "Par décantation", "En ajoutant de l’huile"], "Le sel passe à travers le filtre. En évaporant l’eau, le sel reste au fond."],
  ["On laisse reposer de l’eau boueuse : la terre tombe au fond. C’est…", "la décantation", ["l’évaporation", "la fusion", "la condensation"], "En décantant, les particules lourdes se déposent au fond."],
  ["L’air est-il de la matière ?", "Oui, c’est de la matière à l’état gazeux", ["Non, l’air n’est rien", "Oui, c’est un liquide", "Non, c’est de l’énergie"], "L’air occupe de la place et a une masse : c’est un gaz."],
  ["Une seringue bouchée remplie d’air : on peut pousser le piston un peu. Pourquoi ?", "L’air se comprime", ["L’air disparaît", "L’air devient liquide", "L’air se transforme en eau"], "Les gaz peuvent se comprimer ; l’eau liquide, presque pas."],
  ["L’air chaud a tendance à…", "monter", ["descendre", "geler", "rester collé au sol"], "L’air chaud est plus léger que l’air froid : il monte (comme une montgolfière)."],
  ["Le vent, c’est…", "de l’air qui se déplace", ["de l’eau qui s’évapore", "de la lumière", "du bruit"], "Des différences de température et de pression mettent l’air en mouvement : c’est le vent."],
  ["Sur Terre, la plus grande partie de l’eau est…", "salée (mers et océans)", ["douce (lacs et rivières)", "gelée dans les glaciers", "dans les nuages"], "Environ 97 % de l’eau de la Terre est salée. L’eau douce est rare et précieuse."],
  ["Où se trouve la plus grande réserve d’eau douce sur Terre ?", "Dans les glaces (calottes, glaciers)", ["Dans les rivières", "Dans les nuages", "Dans les bouteilles"], "La plus grande partie de l’eau douce est gelée, aux pôles et dans les glaciers."],
  ["Pourquoi l’eau est-elle essentielle à la vie ?", "Tous les êtres vivants en ont besoin pour vivre", ["Seuls les poissons en ont besoin", "Elle sert seulement à se laver", "Les plantes n’en ont pas besoin"], "Les plantes, les animaux et les humains ont tous besoin d’eau."],
  ["Les gaz d’échappement des voitures polluent…", "l’air", ["seulement l’eau", "seulement le sol", "rien du tout"], "Les gaz d’échappement rejettent des polluants dans l’air que nous respirons."],
  ["Des engrais et des produits chimiques versés en trop sur un champ polluent…", "le sol et l’eau", ["seulement l’air", "uniquement les nuages", "rien du tout"], "La pluie les entraîne dans le sol, les rivières et les lacs."],
];

/** Cycle 2 · matière : états de l'eau, cycle de l'eau, mélanges et séparations, air, ressources et pollutions. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
