import { expect, test } from "@playwright/test";
import { playSeries, uniqueEmail } from "./helpers";

// Phase 3 : plusieurs matières, canton, réponses en texte et QCM.
test("matières : canton, français (texte), histoire (QCM), citoyenneté du canton", async ({ page, browser }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const email = uniqueEmail("matieres");
  await page.goto("/connexion?role=adulte");
  await page.fill("#email", email);
  await page.fill("#pw", "mot-de-passe-e2e");
  await page.fill("#pw2", "mot-de-passe-e2e");
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await page.waitForURL("**/parcours");

  // canton → plan d'études mis en avant, choix gardé dans le profil
  await page.selectOption("#canton", "GE");
  await expect(page.locator(".daily.canton")).toContainText("Plan d’études romand");
  for (const m of ["Mathématiques", "Sciences de la nature", "Français", "Allemand", "Anglais", "Géographie", "Histoire", "Citoyenneté"]) {
    await expect(page.locator(".mat-h h2", { hasText: m })).toBeVisible();
  }
  await page.waitForTimeout(500);
  await page.reload();
  await expect(page.locator("#canton")).toHaveValue("GE");

  // français : réponses en texte, une erreur
  await page.getByRole("button", { name: /Français · Conjugaison/ }).click();
  await expect(page.locator(".hero .kick")).toHaveText("Cours · Français");
  await page.click("#cont");
  await page.click("#go");
  await expect(page.locator(".keys button", { hasText: "é" })).toBeVisible();
  await playSeries(page, [3]);
  await expect(page.locator(".res .score")).toHaveText("9/10");
  await expect(page.locator(".miss")).toContainText("999999");

  // histoire : QCM, boss gagné
  await page.goto("/parcours/histoire-suisse/unite/1");
  await page.click("#boss");
  await expect(page.locator(".choices button")).toHaveCount(4);
  await playSeries(page, [5]);
  await expect(page.locator(".res h2")).toHaveText("Boss battu !");

  // citoyenneté : après le boss de l'unité 1, l'unité « Ton canton » parle de Genève
  await page.goto("/parcours/citoyennete/unite/1");
  await page.click("#boss");
  await playSeries(page);
  await expect(page.locator(".res h2")).toHaveText("Boss battu !");
  await page.click("#nextU");
  await page.click("#go");
  await expect(page.locator(".qcard .q")).toContainText("Genève");

  // un canton du Lehrplan 21 : les parcours romands passent en « Autre plan d'études »
  const other = await (await browser.newContext()).newPage();
  await other.goto("/connexion");
  await other.fill("#email", email);
  await other.fill("#pw", "mot-de-passe-e2e");
  await other.getByRole("button", { name: "Me connecter" }).click();
  await other.waitForURL("**/parcours");
  await other.selectOption("#canton", "ZH");
  await expect(other.locator(".unit", { hasText: "Allemand · Les bases" })).toContainText("Autre plan d’études");
  await expect(other.locator(".unit", { hasText: "Citoyenneté · Institutions suisses" })).not.toContainText("Autre plan d’études");

  expect(errors).toEqual([]);
});
