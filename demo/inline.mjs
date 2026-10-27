// Après vite build : met le JS et le CSS (polices comprises) dans index.html, pour une page autonome.
import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("./dist/", import.meta.url));
let html = await readFile(dist + "index.html", "utf8");
const js = html.match(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/);
const css = html.match(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/);
if (!js || !css) throw new Error("index.html inattendu");
const code = (await readFile(dist + js[1], "utf8")).replace(/<\/script/gi, "<\\/script");
const style = await readFile(dist + css[1], "utf8");
html = html.replace(js[0], "").replace(css[0], "");
// Fonction de remplacement : le code contient des « $& » et « $' » que replace() interpréterait.
html = html.replace("<div id=\"root\"></div>", () => `<style>${style}</style>\n<div id="root"></div>\n<script type="module">${code}</script>`);
await writeFile(dist + "index.html", html);
await rm(dist + "assets", { recursive: true });
console.log(`index.html autonome : ${(html.length / 1024).toFixed(0)} Ko`);
