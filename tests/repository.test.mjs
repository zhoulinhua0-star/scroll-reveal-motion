import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const skillRoot = new URL("../skills/scroll-reveal-motion/", import.meta.url);

test("shared CSS hides content only after client initialization", async () => {
  const css = await readFile(new URL("assets/scroll-reveal.css", skillRoot), "utf8");

  assert.match(css, /prefers-reduced-motion:\s*no-preference/);
  assert.match(css, /data-reveal-ready="true"/);
  assert.doesNotMatch(css.split("@media")[0], /opacity:\s*0/);
});

test("React template supports semantic container elements", async () => {
  const react = await readFile(new URL("assets/react/scroll-reveal.tsx", skillRoot), "utf8");

  assert.match(react, /as\?: RevealElement/);
  assert.match(react, /createElement\(/);
  assert.match(react, /"section"/);
  assert.match(react, /"ul"/);
});

test("package metadata declares the stable release contract", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.equal(packageJson.version, "1.0.0");
  assert.equal(packageJson.private, true);
});
