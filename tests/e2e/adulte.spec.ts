import { expect, test } from "@playwright/test";
import { playSeries, uniqueEmail } from "./helpers";

// Phase 1 : un adulte crée un compte, choisit « Prépa EPFL », fait un entraînement puis un boss.
// Sa progression est conservée sur un autre appareil (nouveau contexte navigateur).
test("adulte : inscription, entraînement, boss, progression sur un autre appareil", async ({ page, browser }) => {
  const email = uniqueEmail("adulte");
  const password = "mot-de-passe-e2e";
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  await page.getByRole("link", { name: /Je me prépare seul/ }).click();
  await page.fill("#email", email);
  await page.fill("#pw", password);
  await page.fill("#pw2", password);
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await page.waitForURL("**/parcours");

  // d'abord le canton, puis la matière, puis le programme
  await page.selectOption("#canton", "VD");
  await page.locator(".mat-tile", { hasText: "Mathématiques" }).click();
  await page.getByRole("button", { name: /Prépa EPFL/ }).click();
  await expect(page.locator(".hero h1")).toHaveText("De la 11e au niveau d’entrée EPFL");
  await page.click("#cont");
  await expect(page.locator(".uhead h1")).toHaveText("Nombres négatifs");

  // entraînement : 9/10
  await page.click("#go");
  await playSeries(page, [4]);
  await expect(page.locator(".res h2")).toHaveText("Série réussie");
  await expect(page.locator(".res .score")).toHaveText("9/10");
  await expect(page.locator(".miss")).toContainText("999999");

  // boss : 10/10 → unité 2 débloquée, +100 XP
  await page.click("#home2");
  await page.locator(".units .unit").first().click();
  await page.click("#boss");
  await playSeries(page);
  await expect(page.locator(".res h2")).toHaveText("Boss battu !");
  await expect(page.locator(".res")).toContainText("Unité 2 débloquée : Fractions et pourcentages.");
  await expect(page.locator(".kpi").first()).toContainText("+200");

  // série abandonnée en cours : minutes et erreur gardées
  await page.click("#nextU");
  await page.click("#go");
  await playSeries(page, [1], 2);
  await page.click("#qx");
  await expect(page.locator(".uhead h1")).toHaveText("Fractions et pourcentages");

  // autre appareil
  const other = await browser.newContext({ timezoneId: "Europe/Zurich", locale: "fr-CH", viewport: { width: 1280, height: 860 } });
  const p2 = await other.newPage();
  await p2.goto("/connexion");
  await p2.fill("#email", email);
  await p2.fill("#pw", password);
  await p2.getByRole("button", { name: "Me connecter" }).click();
  await p2.waitForURL("**/parcours");
  await p2.goto("/parcours/prepa-epfl");
  const u1 = p2.locator(".units .unit").nth(0), u2 = p2.locator(".units .unit").nth(1), u3 = p2.locator(".units .unit").nth(2);
  await expect(u1).toContainText("Entraînement 9/10");
  await expect(u1).toContainText("Boss 10/10");
  await expect(u1.locator(".go")).toHaveText("Revoir →");
  await expect(u2.locator(".go")).toHaveText("Continuer →");
  await expect(u3.locator(".go")).toHaveText("Verrouillé");
  await expect(p2.locator(".chip[title=XP]")).toHaveText("300"); // 90 + 100 + 100 bonus + 10 de la série abandonnée
  await expect(p2.locator(".daily .small").first()).toContainText("1 jour de suite · 22 questions faites");
  await other.close();
  expect(errors, "aucune erreur JavaScript").toEqual([]);
});
