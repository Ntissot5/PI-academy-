import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const CONDUCTEURS = ["un clou en fer", "un trombone en métal", "une pièce de monnaie", "du papier d’aluminium", "un fil de cuivre"];
const ISOLANTS = ["une gomme", "un crayon en bois", "une règle en plastique", "un élastique", "un bouchon de liège", "un verre"];

const ITEMS: [string, string, string[], string][] = [
  ["Pour qu’une ampoule s’allume avec une pile, le circuit doit être…", "fermé (une boucle complète)", ["ouvert", "coupé en deux", "sans fil"], "Le courant ne circule que si le chemin forme une boucle fermée de la pile à la pile."],
  ["On relie directement les deux bornes d’une pile avec un fil, sans ampoule. C’est…", "un court-circuit (dangereux : la pile chauffe)", ["un circuit normal", "un circuit ouvert", "une façon de recharger la pile"], "Le courant passe sans rien traverser : la pile s’use vite et chauffe."],
  ["À quoi sert un interrupteur ?", "À ouvrir ou fermer le circuit", ["À fabriquer du courant", "À rendre l’ampoule plus forte", "À stocker l’énergie"], "Interrupteur fermé : le courant passe. Ouvert : il ne passe plus."],
  ["Dans une lampe de poche, d’où vient l’énergie électrique ?", "Des piles", ["De l’ampoule", "Du bouton", "Du boîtier en plastique"], "Les piles fournissent l’énergie ; l’ampoule la transforme en lumière."],
  ["Pourquoi les fils électriques sont-ils entourés de plastique ?", "Le plastique est isolant : il protège", ["Pour faire joli", "Pour conduire mieux le courant", "Pour que le fil soit plus lourd"], "Le métal à l’intérieur conduit, le plastique autour isole et évite de toucher le courant."],
  ["Pourquoi ne faut-il jamais mettre un objet en métal dans une prise ?", "Le métal conduit le courant : risque d’électrocution", ["Le métal fond dans la prise", "La prise s’éteint", "Il n’y a aucun danger"], "Le courant de la prise (230 V) est dangereux pour le corps humain."],
  ["Laquelle est une source d’énergie renouvelable ?", "Le soleil", ["Le pétrole", "Le charbon", "Le gaz naturel"], "Le soleil se renouvelle chaque jour ; le pétrole, le charbon et le gaz s’épuisent."],
  ["Laquelle est une source d’énergie renouvelable ?", "Le vent", ["Le mazout", "Le charbon", "L’essence"], "Le vent ne s’épuise pas : il est renouvelable."],
  ["Laquelle est une source d’énergie non renouvelable ?", "Le pétrole", ["L’eau des barrages", "Le vent", "Le soleil"], "Le pétrole s’est formé en millions d’années : on l’épuise plus vite qu’il ne se forme."],
  ["En Suisse, beaucoup d’électricité vient des barrages. Quelle énergie utilisent-ils ?", "L’énergie de l’eau (hydraulique)", ["L’énergie du vent", "L’énergie du charbon", "L’énergie du pétrole"], "L’eau qui descend fait tourner des turbines : c’est l’énergie hydraulique."],
  ["Un inconvénient du pétrole et du charbon ?", "Ils rejettent du CO₂ et polluent l’air", ["Ils sont inépuisables", "Ils ne chauffent pas", "Ils ne servent qu’à éclairer"], "En brûlant, ils rejettent du CO₂, un gaz qui réchauffe le climat."],
  ["Un radiateur électrique transforme l’énergie électrique en…", "chaleur", ["lumière seulement", "son", "eau"], "Le radiateur transforme l’électricité en énergie thermique (chaleur)."],
  ["Un moteur électrique transforme l’énergie électrique en…", "mouvement", ["froid", "eau", "lumière"], "Le moteur met en mouvement : énergie électrique → énergie de mouvement."],
  ["À quoi sert l’énergie de la nourriture pour le corps ?", "À bouger, grandir et rester au chaud", ["À rien", "Seulement à dormir", "À fabriquer de l’électricité"], "Les aliments sont le « carburant » du corps."],
  ["Pour garder une boisson chaude longtemps, on choisit une bouteille…", "isolante (thermos)", ["en métal fin", "ouverte", "en verre mince"], "Un isolant thermique limite les échanges de chaleur."],
  ["On met une cuillère en métal et une cuillère en bois dans une soupe chaude. Laquelle devient vite chaude au bout ?", "La cuillère en métal", ["La cuillère en bois", "Les deux pareil", "Aucune"], "Le métal conduit bien la chaleur ; le bois est un isolant thermique."],
  ["Pourquoi met-on de la laine de verre dans les murs d’une maison ?", "Pour isoler et garder la chaleur", ["Pour rendre les murs plus lourds", "Pour conduire le courant", "Pour décorer"], "La laine de verre est un isolant thermique : moins de chaleur s’échappe."],
];

/** Cycle 2 · électricité (circuits, conducteurs, isolants, sécurité) et formes et sources d'énergie. */
export function gen(): Question {
  if (Math.random() < 0.25) {
    const cond = Math.random() < 0.5;
    const a = pick(cond ? CONDUCTEURS : ISOLANTS);
    const faux = shuffle(cond ? ISOLANTS : CONDUCTEURS).slice(0, 2);
    return {
      q: cond ? "On l’ajoute dans un circuit pile-ampoule. Avec quel objet l’ampoule s’allume-t-elle ?" : "On l’ajoute dans un circuit pile-ampoule. Avec quel objet l’ampoule reste-t-elle éteinte ?",
      txt: 1, a, choices: shuffle([a, ...faux]),
      why: cond ? `${a[0].toUpperCase() + a.slice(1)} : c’est du métal, et le métal conduit le courant.` : `${a[0].toUpperCase() + a.slice(1)} : ce n’est pas du métal. C’est un isolant, le courant ne passe pas.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
