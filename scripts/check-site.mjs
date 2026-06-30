import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "styles.css",
  "script.js",
  "assets/logo.png",
  "assets/logo-mark.png",
];

const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  throw new Error(`Missing required files: ${missing.join(", ")}`);
}

const html = readFileSync("index.html", "utf8");
const css = readFileSync("styles.css", "utf8");
const js = readFileSync("script.js", "utf8");

const checks = [
  ["HTML language is Japanese", html.includes('<html lang="ja">')],
  ["Viewport meta tag exists", html.includes('name="viewport"')],
  ["Main heading exists", html.includes("NoPlanCoders")],
  ["GitHub organization link exists", html.includes("https://github.com/NoPlanCoders")],
  ["Japanese hreflang exists", html.includes('hreflang="ja"')],
  ["English hreflang exists", html.includes('hreflang="en"')],
  ["Language switch exists", html.includes('class="lang-switch"')],
  ["English translations exist", js.includes("About NoPlanCoders")],
  ["Reduced motion support exists", css.includes("prefers-reduced-motion")],
  ["Focus visible styles exist", css.includes(":focus-visible")],
];

const failed = checks.filter(([, passed]) => !passed).map(([label]) => label);

if (failed.length > 0) {
  throw new Error(`Site checks failed: ${failed.join(", ")}`);
}

console.log("Site checks passed.");
