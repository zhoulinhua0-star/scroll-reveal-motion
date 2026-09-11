import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(repositoryRoot, "skills", "scroll-reveal-motion");
const manifestRoot = path.join(repositoryRoot, ".claude-plugin");
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

async function readManifest(fileName) {
  return JSON.parse(await readFile(path.join(manifestRoot, fileName), "utf8"));
}

const skill = await readFile(skillPath, "utf8");
const frontmatter = parseFrontmatter(skill);

const heroRoot = path.join(repositoryRoot, "skills", "hero-text-reveal");
const heroSkill = await readFile(path.join(heroRoot, "SKILL.md"), "utf8");
const heroFrontmatter = parseFrontmatter(heroSkill);
assert.equal(heroFrontmatter.name, "hero-text-reveal", "Hero Skill name must match its folder");
assert.deepEqual(Object.keys(heroFrontmatter).sort(), ["description", "name"]);
assert(heroFrontmatter.description.length >= 80, "Hero description must explain capability and triggers");
assert(!heroSkill.includes("[TODO:"), "Hero Skill contains unfinished scaffold text");
const heroMetadata = await readFile(path.join(heroRoot, "agents", "openai.yaml"), "utf8");
assert(heroMetadata.includes("$hero-text-reveal"), "Hero default prompt must invoke its Skill");
for (const reference of heroSkill.matchAll(/\]\((references\/[^)]+)\)/g)) {
  await access(path.join(heroRoot, reference[1]));
}

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
  "--reveal-fade-duration",
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

const plugin = await readManifest("plugin.json");
const marketplace = await readManifest("marketplace.json");

assert.equal(plugin.name, "scroll-reveal-motion", "Plugin name must match the Skill folder");
for (const field of ["description", "version", "license", "repository"]) {
  assert(plugin[field], `plugin.json is missing ${field}`);
}

for (const field of ["name", "description", "owner"]) {
  assert(marketplace[field], `marketplace.json is missing ${field}`);
}
assert.equal(marketplace.plugins?.length, 1, "This repository publishes exactly one plugin");

const [listing] = marketplace.plugins;
assert.equal(listing.name, plugin.name, "Marketplace listing must match plugin.json name");
assert.equal(listing.source, "./", "The plugin is the repository root");
assert.equal(listing.version, plugin.version, "Marketplace listing version must match plugin.json");

// Every Skill this repository ships must be discoverable as a Claude Code plugin Skill
// (auto-loaded from skills/<name>/SKILL.md) and advertised in the manifests users browse.
const publishedSkills = ["hero-text-reveal", "scroll-reveal-motion"];
const skillDirectories = (
  await readdir(path.join(repositoryRoot, "skills"), { withFileTypes: true })
)
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.deepEqual(
  skillDirectories,
  publishedSkills,
  "skills/ must contain exactly the published Skill packages",
);

for (const name of publishedSkills) {
  await access(path.join(repositoryRoot, "skills", name, "SKILL.md"));
}

for (const [label, description] of [
  ["plugin.json", plugin.description],
  ["marketplace listing", listing.description],
]) {
  for (const capability of ["hero", "scroll"]) {
    assert(
      description.toLowerCase().includes(capability),
      `${label} description must mention the ${capability} Skill so plugin users can find it`,
    );
  }
}

const manifestEntries = await readdir(manifestRoot, { recursive: true });
assert.deepEqual(
  manifestEntries.sort(),
  ["marketplace.json", "plugin.json"],
  "Only manifests belong in .claude-plugin/; skills and assets stay at the repository root",
);

console.log("Skill structure, motion contract, and plugin manifests are valid.");
