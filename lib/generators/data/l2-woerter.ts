/** Vocabulaire allemand de base, par thème. Orthographe suisse (ss pour ß, Velo, Spital). */

export type Art = "der" | "die" | "das";

export interface Nomen {
  de: string;
  art: Art;
  /** Pluriel (sans article) ; null quand il n'est pas utile ou pas sûr. */
  pl: string | null;
  fr: string;
  theme: string;
  /** Autres mots allemands acceptés pour la même traduction (avec leur article). */
  alt?: string[];
  /** Personne ou animal (pour les phrases du type « Ich helfe … »). */
  personne?: 1;
}

const N = (de: string, art: Art, pl: string | null, fr: string, theme: string, alt?: string[], personne?: 1): Nomen => ({ de, art, pl, fr, theme, alt, personne });

export const NOMEN: Nomen[] = [
  // Famille
  N("Vater", "der", "Väter", "le père", "famille", ["der Papa"], 1), N("Mutter", "die", "Mütter", "la mère", "famille", ["die Mama"], 1),
  N("Bruder", "der", "Brüder", "le frère", "famille", undefined, 1), N("Schwester", "die", "Schwestern", "la sœur", "famille", undefined, 1),
  N("Sohn", "der", "Söhne", "le fils", "famille", undefined, 1), N("Tochter", "die", "Töchter", "la fille (de quelqu’un)", "famille", undefined, 1),
  N("Tante", "die", "Tanten", "la tante", "famille", undefined, 1), N("Grossmutter", "die", "Grossmütter", "la grand-mère", "famille", ["die Oma"], 1),
  N("Grossvater", "der", "Grossväter", "le grand-père", "famille", ["der Opa"], 1), N("Kind", "das", "Kinder", "l’enfant", "famille", undefined, 1),
  N("Mädchen", "das", "Mädchen", "la fille (enfant)", "famille", undefined, 1), N("Junge", "der", "Jungen", "le garçon", "famille", ["der Bub"], 1),
  N("Familie", "die", "Familien", "la famille", "famille"), N("Freund", "der", "Freunde", "l’ami", "famille", undefined, 1),
  N("Freundin", "die", "Freundinnen", "l’amie", "famille", undefined, 1),
  // École
  N("Schule", "die", "Schulen", "l’école", "école"), N("Buch", "das", "Bücher", "le livre", "école"), N("Heft", "das", "Hefte", "le cahier", "école"),
  N("Bleistift", "der", "Bleistifte", "le crayon", "école"), N("Lehrer", "der", "Lehrer", "l’enseignant", "école", undefined, 1),
  N("Lehrerin", "die", "Lehrerinnen", "l’enseignante", "école", undefined, 1), N("Tafel", "die", "Tafeln", "le tableau noir", "école", ["die Wandtafel"]),
  N("Tisch", "der", "Tische", "la table", "école"), N("Stuhl", "der", "Stühle", "la chaise", "école"), N("Klasse", "die", "Klassen", "la classe", "école"),
  N("Pause", "die", "Pausen", "la récréation", "école"), N("Lineal", "das", "Lineale", "la règle (à mesurer)", "école"),
  N("Radiergummi", "der", "Radiergummis", "la gomme", "école"), N("Fach", "das", "Fächer", "la branche (scolaire)", "école", ["das Schulfach"]),
  // Nourriture
  N("Apfel", "der", "Äpfel", "la pomme", "nourriture"), N("Banane", "die", "Bananen", "la banane", "nourriture"), N("Brot", "das", "Brote", "le pain", "nourriture"),
  N("Käse", "der", null, "le fromage", "nourriture"), N("Milch", "die", null, "le lait", "nourriture"), N("Ei", "das", "Eier", "l’œuf", "nourriture"),
  N("Kartoffel", "die", "Kartoffeln", "la pomme de terre", "nourriture", ["der Erdapfel"]), N("Tomate", "die", "Tomaten", "la tomate", "nourriture"),
  N("Kuchen", "der", "Kuchen", "le gâteau", "nourriture"), N("Wasser", "das", null, "l’eau", "nourriture"), N("Saft", "der", "Säfte", "le jus", "nourriture"),
  N("Suppe", "die", "Suppen", "la soupe", "nourriture"), N("Fleisch", "das", null, "la viande", "nourriture"), N("Wurst", "die", "Würste", "la saucisse", "nourriture"),
  N("Birne", "die", "Birnen", "la poire", "nourriture"), N("Schokolade", "die", null, "le chocolat", "nourriture"),
  // Animaux
  N("Hund", "der", "Hunde", "le chien", "animaux", undefined, 1), N("Katze", "die", "Katzen", "le chat", "animaux", undefined, 1),
  N("Pferd", "das", "Pferde", "le cheval", "animaux", undefined, 1), N("Kuh", "die", "Kühe", "la vache", "animaux", undefined, 1),
  N("Schwein", "das", "Schweine", "le cochon", "animaux", undefined, 1), N("Maus", "die", "Mäuse", "la souris", "animaux", undefined, 1),
  N("Vogel", "der", "Vögel", "l’oiseau", "animaux", undefined, 1), N("Fisch", "der", "Fische", "le poisson", "animaux", undefined, 1),
  N("Schaf", "das", "Schafe", "le mouton", "animaux", undefined, 1), N("Bär", "der", "Bären", "l’ours", "animaux", undefined, 1),
  N("Ente", "die", "Enten", "le canard", "animaux", undefined, 1), N("Kaninchen", "das", "Kaninchen", "le lapin", "animaux", ["der Hase"], 1),
  // Maison
  N("Haus", "das", "Häuser", "la maison", "maison"), N("Wohnung", "die", "Wohnungen", "l’appartement", "maison"), N("Zimmer", "das", "Zimmer", "la chambre, la pièce", "maison"),
  N("Küche", "die", "Küchen", "la cuisine (pièce)", "maison"), N("Bett", "das", "Betten", "le lit", "maison"), N("Fenster", "das", "Fenster", "la fenêtre", "maison"),
  N("Tür", "die", "Türen", "la porte", "maison"), N("Garten", "der", "Gärten", "le jardin", "maison"), N("Lampe", "die", "Lampen", "la lampe", "maison"),
  N("Schrank", "der", "Schränke", "l’armoire", "maison"), N("Sofa", "das", "Sofas", "le canapé", "maison"),
  // Corps
  N("Kopf", "der", "Köpfe", "la tête", "corps"), N("Hand", "die", "Hände", "la main", "corps"), N("Fuss", "der", "Füsse", "le pied", "corps"),
  N("Auge", "das", "Augen", "l’œil", "corps"), N("Ohr", "das", "Ohren", "l’oreille", "corps"), N("Nase", "die", "Nasen", "le nez", "corps"),
  N("Mund", "der", "Münder", "la bouche", "corps"), N("Arm", "der", "Arme", "le bras", "corps"), N("Bein", "das", "Beine", "la jambe", "corps"),
  N("Bauch", "der", "Bäuche", "le ventre", "corps"), N("Zahn", "der", "Zähne", "la dent", "corps"),
  // Vêtements
  N("Hose", "die", "Hosen", "le pantalon", "vêtements"), N("Pullover", "der", "Pullover", "le pull", "vêtements", ["der Pulli"]),
  N("Jacke", "die", "Jacken", "la veste", "vêtements"), N("Schuh", "der", "Schuhe", "la chaussure", "vêtements"), N("Mütze", "die", "Mützen", "le bonnet", "vêtements"),
  N("Rock", "der", "Röcke", "la jupe", "vêtements"), N("Kleid", "das", "Kleider", "la robe", "vêtements"), N("Socke", "die", "Socken", "la chaussette", "vêtements"),
  N("Hut", "der", "Hüte", "le chapeau", "vêtements"), N("Hemd", "das", "Hemden", "la chemise", "vêtements"),
  // Ville, transports
  N("Stadt", "die", "Städte", "la ville", "ville"), N("Strasse", "die", "Strassen", "la rue", "ville"), N("Bahnhof", "der", "Bahnhöfe", "la gare", "ville"),
  N("Kino", "das", "Kinos", "le cinéma", "ville"), N("Kirche", "die", "Kirchen", "l’église", "ville"), N("Platz", "der", "Plätze", "la place", "ville"),
  N("Bus", "der", "Busse", "le bus", "ville"), N("Zug", "der", "Züge", "le train", "ville"), N("Velo", "das", "Velos", "le vélo", "ville", ["das Fahrrad", "das Rad"]),
  N("Auto", "das", "Autos", "la voiture", "ville", ["der Wagen"]), N("Spital", "das", "Spitäler", "l’hôpital", "ville", ["das Krankenhaus"]),
  N("Bibliothek", "die", "Bibliotheken", "la bibliothèque", "ville"), N("Geschäft", "das", "Geschäfte", "le magasin", "ville", ["der Laden"]),
  // Loisirs
  N("Spiel", "das", "Spiele", "le jeu", "loisirs"), N("Ball", "der", "Bälle", "le ballon", "loisirs"), N("Lied", "das", "Lieder", "la chanson", "loisirs"),
  N("Film", "der", "Filme", "le film", "loisirs"), N("Musik", "die", null, "la musique", "loisirs"), N("Schwimmbad", "das", "Schwimmbäder", "la piscine", "loisirs", ["das Hallenbad"]),
  // Temps (météo et calendrier)
  N("Sonne", "die", null, "le soleil", "temps"), N("Regen", "der", null, "la pluie", "temps"), N("Schnee", "der", null, "la neige", "temps"),
  N("Wolke", "die", "Wolken", "le nuage", "temps"), N("Tag", "der", "Tage", "le jour", "temps"), N("Woche", "die", "Wochen", "la semaine", "temps"),
  N("Monat", "der", "Monate", "le mois", "temps"), N("Jahr", "das", "Jahre", "l’année", "temps"), N("Stunde", "die", "Stunden", "l’heure (durée)", "temps"),
  N("Nacht", "die", "Nächte", "la nuit", "temps"), N("Abend", "der", "Abende", "le soir", "temps"),
];

/** Mots qui ne sont pas des noms : [allemand, français, thème, autres formes acceptées]. */
export const WOERTER: [string, string, string, string[]?][] = [
  ["rot", "rouge", "couleurs"], ["blau", "bleu", "couleurs"], ["grün", "vert", "couleurs"], ["gelb", "jaune", "couleurs"],
  ["schwarz", "noir", "couleurs"], ["weiss", "blanc", "couleurs"], ["braun", "brun", "couleurs"], ["grau", "gris", "couleurs"],
  ["Montag", "lundi", "jours"], ["Dienstag", "mardi", "jours"], ["Mittwoch", "mercredi", "jours"], ["Donnerstag", "jeudi", "jours"],
  ["Freitag", "vendredi", "jours"], ["Samstag", "samedi", "jours", ["Sonnabend"]], ["Sonntag", "dimanche", "jours"],
  ["Januar", "janvier", "mois"], ["Februar", "février", "mois"], ["März", "mars", "mois"], ["April", "avril", "mois"], ["Mai", "mai", "mois"],
  ["Juni", "juin", "mois"], ["Juli", "juillet", "mois"], ["August", "août", "mois"], ["September", "septembre", "mois"],
  ["Oktober", "octobre", "mois"], ["November", "novembre", "mois"], ["Dezember", "décembre", "mois"],
  ["schwimmen", "nager", "loisirs"], ["tanzen", "danser", "loisirs"], ["singen", "chanter", "loisirs"], ["lesen", "lire", "loisirs"],
  ["malen", "peindre", "loisirs"], ["kochen", "cuisiner", "loisirs"], ["wandern", "faire de la randonnée", "loisirs"], ["reiten", "faire du cheval", "loisirs"],
  ["Es regnet", "il pleut", "temps"], ["Es schneit", "il neige", "temps"], ["Die Sonne scheint", "le soleil brille", "temps"],
  ["Es ist kalt", "il fait froid", "temps"], ["Es ist warm", "il fait chaud", "temps", ["Es ist heiss"]],
  ["gross", "grand", "adjectifs"], ["klein", "petit", "adjectifs"], ["müde", "fatigué", "adjectifs"], ["hungrig", "affamé", "adjectifs"],
  ["lustig", "drôle", "adjectifs"], ["schnell", "rapide", "adjectifs"], ["teuer", "cher", "adjectifs"], ["krank", "malade", "adjectifs"],
];

export const THEME_FR: Record<string, string> = {
  famille: "la famille", école: "l’école", nourriture: "la nourriture", animaux: "les animaux", maison: "la maison", corps: "le corps",
  vêtements: "les vêtements", ville: "la ville", loisirs: "les loisirs", temps: "le temps", couleurs: "les couleurs", jours: "les jours",
  mois: "les mois", adjectifs: "les adjectifs",
};

export const avecArt = (n: Nomen): string => `${n.art} ${n.de}`;
