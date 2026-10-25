import { expect, type Page } from "@playwright/test";

/** Répond aux 10 questions de la série en cours ; `wrong` = indices à rater. */
export async function playSeries(page: Page, wrong: number[] = [], stopAfter = 10) {
  for (let q = 0; q < stopAfter; q++) {
    await expect(page.locator(".qbar .mono")).toHaveText(`${q + 1}/10`);
    const a = await page.evaluate(() => (window as unknown as { __piAnswer: string }).__piAnswer);
    const choices = page.locator(".choices button");
    if (await choices.count()) {
      // QCM : un clic corrige tout de suite
      const target = wrong.includes(q) ? choices.filter({ hasNotText: new RegExp(`^${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).first() : choices.filter({ hasText: new RegExp(`^${a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`) }).first();
      await target.click();
    } else {
      await page.fill("#ain", wrong.includes(q) ? "999999" : a);
      await page.click("#ok");
    }
    await expect(page.locator("#chk")).toHaveClass(wrong.includes(q) ? /ko/ : /ok/);
    if (q < stopAfter - 1 || stopAfter === 10) await page.click("#ok");
  }
}

export const uniqueEmail = (p: string) => `${p}.${Date.now()}${Math.floor(Math.random() * 1e4)}@example.ch`;
