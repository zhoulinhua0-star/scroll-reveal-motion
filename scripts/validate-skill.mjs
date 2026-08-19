import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "scroll-reveal-motion");
const skillPath = path.join(skillRoot, "SKILL.md");

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n/);
  assert(match, "SKILL.md must start with YAML frontmatter");

  return Object.fromEntries(
    match[1].split("\n").map((line) => {
      const separator = line.indexOf(":");
      assert(separator > 0, `Invalid frontmatter line: ${line}`);
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
    }),
  );
}

async function assertFile(relativePath) {
  await access(path.join(skillRoot, relativePath));
}

const skill = await readFile(skillPath, "utf8");
const frontmatter = parseFrontmatter(skill);

assert.deepEqual(
  Object.keys(frontmatter).sort(),
  ["description", "name"],
  "Skill frontmatter may contain only name and description",
);
assert.equal(frontmatter.name, "scroll-reveal-motion", "Skill name must match its folder");
assert(frontmatter.description.length >= 80, "Description must explain capability and triggers");
assert(skill.split("\n").length < 500, "Keep SKILL.md under 500 lines");

const requiredAssets = [
  "agents/openai.yaml",
  "assets/scroll-reveal.css",
  "assets/react/scroll-reveal.tsx",
  "assets/vanilla/scroll-reveal.js",
];
await Promise.all(requiredAssets.map(assertFile));

for (const reference of skill.matchAll(/`((?:agents|assets)\/[^`]+)`/g)) {
  await assertFile(reference[1]);
}

const forbiddenSkillFiles = new Set([
  "README.md",
  "CHANGELOG.md",
  "CONTRIBUTING.md",
  "INSTALLATION_GUIDE.md",
]);
const skillEntries = await readdir(skillRoot, { recursive: true });
for (const entry of skillEntries) {
  assert(!forbiddenSkillFiles.has(path.basename(entry)), `${entry} belongs outside the Skill package`);
}

const openaiYaml = await readFile(path.join(skillRoot, "agents", "openai.yaml"), "utf8");
assert(openaiYaml.includes('display_name: "Scroll Reveal Motion"'));
assert(openaiYaml.includes('short_description: "Add polished, accessible scroll-reveal motion"'));
assert(openaiYaml.includes("$scroll-reveal-motion"), "Default prompt must invoke the Skill explicitly");

const css = await readFile(path.join(skillRoot, "assets", "scroll-reveal.css"), "utf8");
for (const token of [
  "prefers-reduced-motion: no-preference",
  "data-reveal-ready",
  "data-reveal-visible",
  "--reveal-delay",
  "--reveal-distance",
  "--reveal-duration",
  "--reveal-stagger",
  "--reveal-ease",
]) {
  assert(css.includes(token), `Shared CSS is missing ${token}`);
}

const react = await readFile(path.join(skillRoot, "assets", "react", "scroll-reveal.tsx"), "utf8");
const vanilla = await readFile(path.join(skillRoot, "assets", "vanilla", "scroll-reveal.js"), "utf8");
for (const [label, source] of [["React", react], ["Vanilla", vanilla]]) {
  for (const token of ["IntersectionObserver", "prefers-reduced-motion", "revealReady", "revealVisible", "disconnect"]) {
    assert(source.includes(token), `${label} implementation is missing ${token}`);
  }
}

console.log("Skill structure and motion contract are valid.");
