import { existsSync, readFileSync } from "node:fs";

const requiredFiles = [
  "index.html",
  "src/App.jsx",
  "src/Plasma.jsx",
  "src/Plasma.css",
  "src/main.jsx",
  "src/styles.css",
  "assets/logo.png",
  "assets/logo-mark.png",
  "vite.config.js",
];

const missing = requiredFiles.filter((file) => !existsSync(file));

if (missing.length > 0) {
  throw new Error(`Missing required files: ${missing.join(", ")}`);
}

const html = readFileSync("index.html", "utf8");
const css = readFileSync("src/styles.css", "utf8");
const app = readFileSync("src/App.jsx", "utf8");
const plasma = readFileSync("src/Plasma.jsx", "utf8");
const packageJson = readFileSync("package.json", "utf8");

const checks = [
  ["HTML language is Japanese", html.includes('<html lang="ja">')],
  ["Viewport meta tag exists", html.includes('name="viewport"')],
  ["Main heading exists", html.includes("NoPlanCoders")],
  ["React root exists", html.includes('id="root"')],
  ["Vite entry exists", html.includes('/src/main.jsx')],
  ["GitHub organization link exists", app.includes("https://github.com/NoPlanCoders")],
  ["Japanese hreflang exists", html.includes('hreflang="ja"')],
  ["English hreflang exists", html.includes('hreflang="en"')],
  ["Language switch exists", app.includes('className="lang-switch"')],
  ["English translations exist", app.includes("Nothing is fixed yet")],
  ["Plasma component exists", app.includes("<Plasma")],
  ["OGL dependency is installed", packageJson.includes('"ogl"')],
  ["Plasma imports OGL", plasma.includes('from "ogl"')],
  ["Reduced motion support exists", css.includes("prefers-reduced-motion")],
  ["Focus visible styles exist", css.includes(":focus-visible")],
];

const failed = checks.filter(([, passed]) => !passed).map(([label]) => label);

if (failed.length > 0) {
  throw new Error(`Site checks failed: ${failed.join(", ")}`);
}

console.log("Site checks passed.");
