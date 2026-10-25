import { expect, test, type Browser } from "@playwright/test";
import { playSeries, uniqueEmail } from "./helpers";

const ctx = (b: Browser, width = 1280) => b.newContext({ timezoneId: "Europe/Zurich", locale: "fr-CH", viewport: { width, height: 900 } });

// Phase 2 : un prof crée une classe, un élève la rejoint (code + pseudo + PIN, sans e-mail),
// le prof voit en temps réel la maîtrise et les erreurs de l'élève, puis le repère comme bloqué.
test("prof et élève : classe, code, maîtrise et erreurs en temps réel", async ({ browser }) => {
  const errors: string[] = [];

  /* prof */
  const profCtx = await ctx(browser);
  const prof = await profCtx.newPage();
  prof.on("pageerror", (e) => errors.push(e.message));
  await prof.goto("/");
  await prof.getByRole("link", { name: /Je suis prof/ }).click();
  await prof.fill("#email", uniqueEmail("prof"));
  await prof.fill("#pw", "mot-de-passe-prof");
  await prof.fill("#pw2", "mot-de-passe-prof");
  await prof.getByRole("button", { name: "Créer mon compte prof" }).click();
  await prof.waitForURL("**/prof");
  await prof.fill("#class-name", "9e C · test");
  await prof.getByRole("button", { name: "Créer la classe" }).click();
  const code = (await prof.locator("#class-code").textContent())!.trim();
  expect(code).toMatch(/^[A-Z0-9]{6}$/);
  await prof.locator(".assign-row", { hasText: "9e Harmos · Bases" }).locator("input").check();
  await expect(prof.locator(".board")).toHaveCount(0);
  await expect(prof.getByText(`Donne-leur le code ${code}`, { exact: false })).toBeVisible();

  /* élève, sur un autre appareil (téléphone) */
  const eleveCtx = await ctx(browser, 400);
  const eleve = await eleveCtx.newPage();
  eleve.on("pageerror", (e) => errors.push(e.message));
  await eleve.goto("/");
  await eleve.getByRole("link", { name: /Je suis élève/ }).click();
  await eleve.fill("#code", code.toLowerCase());
  await eleve.fill("#pseudo", "Léa");
  await eleve.fill("#pin", "2468");
  await eleve.fill("#pin2", "2468");
  await eleve.getByRole("button", { name: "Rejoindre ma classe" }).click();
  // un seul parcours assigné : l'élève arrive directement dessus
  await eleve.waitForURL("**/parcours/9e-bases");
  await expect(eleve.locator(".hero h1")).toHaveText("Les bases de la 9e Harmos");

  // le prof voit l'élève arriver sans recharger
  const row = prof.locator(".board tbody tr", { hasText: "Léa" });
  await expect(row).toBeVisible();
  await expect(row.locator("td .cell").first()).toHaveAttribute("data-lv", "0");

  // un deuxième élève ne peut pas prendre le même pseudo (même avec d'autres majuscules)
  const other = await (await ctx(browser, 400)).newPage();
  await other.goto("/eleve");
  await other.fill("#code", code);
  await other.fill("#pseudo", "LÉA");
  await other.fill("#pin", "1111");
  await other.fill("#pin2", "1111");
  await other.getByRole("button", { name: "Rejoindre ma classe" }).click();
  await expect(other.locator(".form .err")).toContainText("déjà pris");

  /* l'élève s'entraîne : 8/10 → « Familier », 2 erreurs */
  await eleve.click("#cont");
  await eleve.click("#go");
  await playSeries(eleve, [2, 6]);
  await expect(eleve.locator(".res .score")).toHaveText("8/10");

  await expect(row.locator("td .cell").first()).toHaveAttribute("data-lv", "2");
  await row.click();
  const errs = prof.locator("#errors > div");
  await expect(errs).toHaveCount(2);
  await expect(errs.first()).toContainText("999999");

  /* deux boss ratés → l'élève apparaît dans « À regarder » */
  for (let k = 0; k < 2; k++) {
    await eleve.click("#home2");
    await eleve.locator(".units .unit").first().click();
    await eleve.click("#boss");
    await playSeries(eleve, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    await expect(eleve.locator(".res h2")).toHaveText("Le boss résiste");
  }
  await expect(prof.locator(".stuck")).toContainText("Léa");
  await expect(prof.locator(".stuck")).toContainText("Boss « Nombres négatifs » raté 2 fois");
  await expect(row.locator(".badge.bad")).toHaveText("Bloqué");
  await expect(errs).toHaveCount(10); // les 10 dernières seulement

  /* le prof donne un nouveau PIN ; l'élève se reconnecte avec */
  await prof.fill("#new-pin", "1357");
  await prof.getByRole("button", { name: "Donner ce PIN" }).click();
  await expect(prof.locator(".toast")).toContainText("1357");
  const again = await (await ctx(browser, 400)).newPage();
  await again.goto("/eleve");
  await again.getByRole("tab", { name: "J’ai déjà un pseudo" }).click();
  await again.fill("#code", code);
  await again.fill("#pseudo", "léa");
  await again.fill("#pin", "1357");
  await again.getByRole("button", { name: "Entrer" }).click();
  await again.waitForURL("**/parcours/9e-bases");

  /* un autre prof ne voit pas cette classe */
  const p2 = await (await ctx(browser)).newPage();
  await p2.goto("/connexion?role=prof");
  await p2.fill("#email", uniqueEmail("prof2"));
  await p2.fill("#pw", "mot-de-passe-prof");
  await p2.fill("#pw2", "mot-de-passe-prof");
  await p2.getByRole("button", { name: "Créer mon compte prof" }).click();
  await p2.waitForURL("**/prof");
  await expect(p2.locator(".class-tabs button")).toHaveCount(0);
  await expect(p2.getByText("Léa")).toHaveCount(0);

  expect(errors, "aucune erreur JavaScript").toEqual([]);
});

test("élève : 5 PIN faux puis blocage de 10 minutes", async ({ page, request }) => {
  // Classe et élève créés directement par l'API, pour ne tester ici que la connexion.
  const PB = process.env.E2E_PB_URL || "http://127.0.0.1:8091";
  const email = uniqueEmail("prof-pin");
  await request.post(`${PB}/api/collections/users/records`, { data: { email, password: "mot-de-passe-prof", passwordConfirm: "mot-de-passe-prof", role: "prof" } });
  const auth = await (await request.post(`${PB}/api/collections/users/auth-with-password`, { data: { identity: email, password: "mot-de-passe-prof" } })).json();
  const classe = await (await request.post(`${PB}/api/collections/classes/records`, { headers: { Authorization: auth.token }, data: { prof: auth.record.id, nom: "Classe PIN" } })).json();
  expect((await request.post(`${PB}/api/pi/eleve/rejoindre`, { data: { code: classe.code, pseudo: "Noé", pin: "1234" } })).ok()).toBe(true);

  await page.goto("/eleve");
  await page.getByRole("tab", { name: "J’ai déjà un pseudo" }).click();
  await page.fill("#code", classe.code);
  await page.fill("#pseudo", "Noé");
  for (let i = 1; i <= 4; i++) {
    await page.fill("#pin", "0000");
    await page.getByRole("button", { name: "Entrer" }).click();
    await expect(page.locator(".form .err")).toContainText(`Encore ${5 - i} essai`);
  }
  await page.fill("#pin", "0000");
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page.locator(".form .err")).toContainText("Trop d’essais. Réessaie dans 10 min");
  // même avec le bon PIN, c'est bloqué
  await page.fill("#pin", "1234");
  await page.getByRole("button", { name: "Entrer" }).click();
  await expect(page.locator(".form .err")).toContainText("Trop d’essais");
});
