import type { Question } from "./types";
import { lecture, type Texte } from "./data/l2-lecture";

const TEXTES: Texte[] = [
  {
    genre: "blog",
    texte: "My name is Priya and I'm fifteen. Last summer I spent three weeks with a host family in Brighton. Every morning I went to a language school, and in the afternoons we did activities like surfing and visiting museums. At first I was nervous because my English wasn't very good, but my host family was really kind. Now I'm planning to go back next year.",
    questions: [
      ["How long did Priya stay in Brighton?", "three weeks", ["three months", "one week", "one year"], "« I spent three weeks with a host family in Brighton »."],
      ["Why was she nervous at first?", "Her English wasn't very good.", ["She didn't like her host family.", "She couldn't swim.", "She was ill."], "« I was nervous because my English wasn't very good »."],
      ["What is she planning to do?", "to go back next year", ["to study surfing", "to move to Brighton", "to invite her host family"], "« Now I'm planning to go back next year »."],
    ],
  },
  {
    genre: "fait divers",
    texte: "A 14-year-old boy from Bern has found an old Roman coin in his garden. Luca was helping his father plant a tree when he saw something shiny in the soil. Experts from the museum say the coin is about 1,800 years old. Luca will give the coin to the museum, where it will be shown in an exhibition next spring.",
    questions: [
      ["What was Luca doing when he found the coin?", "helping his father plant a tree", ["playing football", "visiting a museum", "digging for treasure"], "« Luca was helping his father plant a tree when he saw something shiny »."],
      ["How old is the coin?", "about 1,800 years old", ["14 years old", "about 180 years old", "about 18,000 years old"], "« the coin is about 1,800 years old »."],
      ["What will happen to the coin?", "It will be shown in a museum.", ["Luca will sell it.", "Luca will keep it in his room.", "It will be given back to Rome."], "« it will be shown in an exhibition next spring »."],
    ],
  },
  {
    genre: "article d’opinion",
    texte: "Should homework be banned? Some people think so. They say students are already tired after a long school day and need time for sport, hobbies and family. Others disagree: homework helps students practise what they have learnt and teaches them to work independently. In my opinion, a little homework is useful, but it shouldn't take more than thirty minutes a day.",
    questions: [
      ["What is the writer's opinion?", "A little homework is useful, but not too much.", ["Homework should be banned.", "Students need more homework.", "Homework is only useful at the weekend."], "« a little homework is useful, but it shouldn't take more than thirty minutes a day »."],
      ["Which is an argument AGAINST homework?", "Students need time for hobbies and family.", ["It teaches students to work independently.", "It helps students practise.", "It takes thirty minutes."], "« students … need time for sport, hobbies and family »."],
      ["What type of text is this?", "an opinion article", ["a recipe", "a postcard", "an advertisement"], "Le texte présente deux points de vue puis l’avis de l’auteur (« In my opinion ») : un texte argumentatif."],
    ],
  },
  {
    genre: "biographie",
    texte: "Roger Federer was born in Basel in 1981. As a boy he played football and tennis, but at the age of twelve he decided to focus on tennis. He won his first Wimbledon title in 2003 and became one of the most successful players in history, with 20 Grand Slam titles. He retired in 2022. Today his foundation supports education projects in Africa.",
    questions: [
      ["When did he win his first Wimbledon title?", "in 2003", ["in 1981", "in 2022", "in 1993"], "« He won his first Wimbledon title in 2003 »."],
      ["What did he decide at the age of twelve?", "to focus on tennis", ["to play football", "to move to Africa", "to stop school"], "« at the age of twelve he decided to focus on tennis »."],
      ["What does his foundation do?", "It supports education projects in Africa.", ["It builds tennis courts in Basel.", "It organises football matches.", "It trains young players at Wimbledon."], "« his foundation supports education projects in Africa »."],
    ],
  },
  {
    genre: "lettre formelle",
    texte: "Dear Sir or Madam, I am writing to complain about a pair of headphones I bought on your website. When they arrived, the left side did not work. I sent you two emails last week, but nobody answered. I would like a full refund as soon as possible. Yours faithfully, Tom Baker",
    questions: [
      ["Why is Tom writing?", "to complain about faulty headphones", ["to order new headphones", "to say thank you", "to apply for a job"], "« I am writing to complain about a pair of headphones … the left side did not work »."],
      ["What does Tom want?", "his money back", ["new headphones", "a discount", "a phone call"], "« a full refund » = être entièrement remboursé."],
      ["What is the register of this letter?", "formal", ["informal, for a friend", "slang", "a text message"], "« Dear Sir or Madam », « Yours faithfully », pas de formes contractées : registre soutenu (formal)."],
    ],
  },
  {
    genre: "recette",
    texte: "Easy pancakes. You need 200 g flour, 2 eggs, 300 ml milk and a pinch of salt. Mix the flour and the salt in a bowl. Add the eggs and the milk slowly and mix well. Heat a little oil in a pan and cook each pancake for about one minute on each side. Serve with fruit or maple syrup.",
    questions: [
      ["How much milk do you need?", "300 ml", ["200 ml", "2 litres", "30 ml"], "« 300 ml milk »."],
      ["How long do you cook each side?", "about one minute", ["about five minutes", "ten seconds", "half an hour"], "« cook each pancake for about one minute on each side »."],
      ["What type of text is this?", "a recipe", ["a news article", "a letter", "a poem"], "Ingrédients puis étapes à l’impératif (Mix, Add, Heat) : une recette."],
    ],
  },
];

/** Reading (9e-11e) : blog, fait divers, texte d'opinion, biographie, lettre formelle, recette. */
export function gen(): Question {
  return lecture(TEXTES, "Read:");
}
