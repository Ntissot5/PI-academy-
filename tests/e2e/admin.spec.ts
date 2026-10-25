import { expect, test } from "@playwright/test";

// L'admin modifie le texte d'une unité et l'ordre des parcours, sans toucher au code.
test("admin : éditer une règle et l'ordre des parcours", async ({ page, browser }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/connexion");
  await page.fill("#email", "admin.e2e@example.ch");
  await page.fill("#pw", "admin-e2e-2026");
  await page.getByRole("button", { name: "Me connecter" }).click();
  await page.waitForURL("**/parcours");
  await page.getByRole("link", { name: /Admin/ }).click();
  await page.waitForURL("**/admin");

  // texte d'une unité
  const regle = `Règle modifiée par l’admin ${Date.now()}.`;
  await page.locator(".admin-list button", { hasText: "1. Nombres négatifs" }).first().click();
  await page.fill("#u-regle", regle);
  await page.getByRole("button", { name: "Enregistrer l’unité" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Enregistré." })).toBeVisible();

  // ordre des parcours : 9e Harmos passe devant
  await page.getByRole("button", { name: "Monter 9e Harmos · Bases" }).click();
  await expect(page.locator(".toast")).toContainText("Ordre des parcours enregistré");

  // un adulte voit le nouveau texte et le nouvel ordre
  const adult = await (await browser.newContext()).newPage();
  await adult.goto("/connexion");
  await adult.fill("#email", "adulte.demo@example.ch");
  await adult.fill("#pw", "demo-adulte-2026");
  await adult.getByRole("button", { name: "Me connecter" }).click();
  await adult.waitForURL("**/parcours");
  await expect(adult.locator(".units .unit h3").first()).toHaveText("9e Harmos · Bases");
  await adult.goto("/parcours/prepa-epfl/unite/1");
  await expect(adult.locator(".article")).toContainText(regle);

  // un non-admin n'entre pas
  await adult.goto("/admin");
  await adult.waitForURL((u) => !u.pathname.startsWith("/admin"));
  expect(errors).toEqual([]);
});
