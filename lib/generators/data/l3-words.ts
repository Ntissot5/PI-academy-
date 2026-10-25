/** Vocabulaire anglais de base : [français, anglais, autres réponses acceptées (britannique / américain), thème]. */
export const WORDS: [string, string, string[], string][] = [
  // family
  ["la mère", "mother", ["mum", "mom"], "family"], ["le père", "father", ["dad"], "family"], ["la sœur", "sister", [], "family"],
  ["le frère", "brother", [], "family"], ["la grand-mère", "grandmother", ["grandma", "granny"], "family"], ["le grand-père", "grandfather", ["grandpa"], "family"],
  ["l’oncle", "uncle", [], "family"], ["la tante", "aunt", [], "family"], ["le cousin", "cousin", [], "family"], ["la fille (enfant de…)", "daughter", [], "family"],
  ["le fils", "son", [], "family"], ["les parents", "parents", [], "family"],
  // school
  ["le crayon", "pencil", [], "school"], ["le stylo", "pen", [], "school"], ["la gomme", "rubber", ["eraser"], "school"], ["la règle (à mesurer)", "ruler", [], "school"],
  ["le cahier", "exercise book", ["notebook"], "school"], ["le livre", "book", [], "school"], ["la trousse", "pencil case", [], "school"],
  ["l’enseignant", "teacher", [], "school"], ["les devoirs", "homework", [], "school"], ["la récréation", "break", ["recess", "playtime"], "school"],
  ["la bibliothèque", "library", [], "school"], ["l’horaire (des cours)", "timetable", ["schedule"], "school"],
  // food
  ["la pomme", "apple", [], "food"], ["le pain", "bread", [], "food"], ["le fromage", "cheese", [], "food"], ["le lait", "milk", [], "food"],
  ["l’œuf", "egg", [], "food"], ["le poulet", "chicken", [], "food"], ["le poisson", "fish", [], "food"], ["les frites", "chips", ["fries", "french fries"], "food"],
  ["les bonbons", "sweets", ["candy", "candies"], "food"], ["le biscuit", "biscuit", ["cookie"], "food"], ["le petit-déjeuner", "breakfast", [], "food"],
  ["le jus d’orange", "orange juice", [], "food"], ["le gâteau", "cake", [], "food"], ["les légumes", "vegetables", [], "food"],
  // colours
  ["rouge", "red", [], "colours"], ["bleu", "blue", [], "colours"], ["vert", "green", [], "colours"], ["jaune", "yellow", [], "colours"],
  ["noir", "black", [], "colours"], ["blanc", "white", [], "colours"], ["gris", "grey", ["gray"], "colours"], ["violet", "purple", [], "colours"],
  ["rose", "pink", [], "colours"], ["brun", "brown", [], "colours"],
  // animals
  ["le chien", "dog", [], "animals"], ["le chat", "cat", [], "animals"], ["le cheval", "horse", [], "animals"], ["la vache", "cow", [], "animals"],
  ["l’oiseau", "bird", [], "animals"], ["la souris", "mouse", [], "animals"], ["le lapin", "rabbit", ["bunny"], "animals"], ["le mouton", "sheep", [], "animals"],
  ["le cochon", "pig", [], "animals"], ["le singe", "monkey", [], "animals"],
  // house
  ["la cuisine (pièce)", "kitchen", [], "house"], ["la chambre à coucher", "bedroom", [], "house"], ["la salle de bains", "bathroom", [], "house"],
  ["le salon", "living room", ["lounge", "sitting room"], "house"], ["le jardin", "garden", ["yard"], "house"], ["l’appartement", "flat", ["apartment"], "house"],
  ["la fenêtre", "window", [], "house"], ["la porte", "door", [], "house"], ["le lit", "bed", [], "house"], ["les escaliers", "stairs", [], "house"],
  // body
  ["la tête", "head", [], "body"], ["la main", "hand", [], "body"], ["le pied", "foot", [], "body"], ["l’œil", "eye", [], "body"],
  ["l’oreille", "ear", [], "body"], ["le nez", "nose", [], "body"], ["la bouche", "mouth", [], "body"], ["la jambe", "leg", [], "body"],
  ["le bras", "arm", [], "body"], ["la dent", "tooth", [], "body"], ["les cheveux", "hair", [], "body"],
  // weather & time
  ["la pluie", "rain", [], "weather"], ["la neige", "snow", [], "weather"], ["le soleil", "sun", [], "weather"], ["le nuage", "cloud", [], "weather"],
  ["le vent", "wind", [], "weather"], ["l’hiver", "winter", [], "weather"], ["l’été", "summer", [], "weather"], ["l’automne", "autumn", ["fall"], "weather"],
  ["le printemps", "spring", [], "weather"],
  // hobbies
  ["nager", "swim", ["to swim"], "hobbies"], ["danser", "dance", ["to dance"], "hobbies"], ["chanter", "sing", ["to sing"], "hobbies"],
  ["lire", "read", ["to read"], "hobbies"], ["dessiner", "draw", ["to draw"], "hobbies"], ["cuisiner", "cook", ["to cook"], "hobbies"],
  ["le football", "football", ["soccer"], "hobbies"], ["les vacances", "holidays", ["holiday", "vacation"], "hobbies"],
  // town
  ["la gare", "station", ["train station", "railway station"], "town"], ["le magasin", "shop", ["store"], "town"], ["la rue", "street", ["road"], "town"],
  ["l’hôpital", "hospital", [], "town"], ["le cinéma", "cinema", ["movie theater", "movie theatre"], "town"], ["la piscine", "swimming pool", ["pool"], "town"],
  ["le pont", "bridge", [], "town"], ["l’église", "church", [], "town"], ["le parc", "park", [], "town"],
  // clothes
  ["le pantalon", "trousers", ["pants"], "clothes"], ["la chemise", "shirt", [], "clothes"], ["la jupe", "skirt", [], "clothes"], ["la robe", "dress", [], "clothes"],
  ["les chaussures", "shoes", [], "clothes"], ["la veste", "jacket", [], "clothes"], ["le pull", "jumper", ["sweater", "pullover"], "clothes"],
  ["le chapeau", "hat", [], "clothes"], ["les chaussettes", "socks", [], "clothes"], ["l’écharpe", "scarf", [], "clothes"],
];

export const THEME_FR: Record<string, string> = {
  family: "la famille", school: "l’école", food: "la nourriture", colours: "les couleurs", animals: "les animaux", house: "la maison",
  body: "le corps", weather: "le temps et les saisons", hobbies: "les loisirs", town: "la ville", clothes: "les vêtements",
};
