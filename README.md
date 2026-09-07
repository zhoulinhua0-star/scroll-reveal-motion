# Scroll Reveal Motion

An Agent Skill for adding restrained, accessible, and performant reveal-on-scroll motion to modern web interfaces.

English | [简体中文](README.zh-CN.md)

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)


## Install

The same Skill package works in both Claude Code and Codex. Pick your agent below.

> **Syntax note:** the leading symbol invokes a Skill; it is not a terminal
> prompt. Claude Code uses `/`, Codex uses `$`, and ChatGPT uses `@`.

### Claude Code

This repository is also a Claude Code plugin marketplace, so it installs in two commands and stays updatable:

```text
/plugin marketplace add zhoulinhua0-star/scroll-reveal-motion
/plugin install scroll-reveal-motion@scroll-reveal-motion
```

Run `/reload-plugins` if the install summary asks for it. Later, `/plugin update scroll-reveal-motion@scroll-reveal-motion` picks up new releases.

<details>
<summary>Manual install, without the marketplace</summary>

Copy the Skill directory to whichever scope you want:

```bash
git clone https://github.com/zhoulinhua0-star/scroll-reveal-motion.git

# Every project on this machine
cp -R scroll-reveal-motion/skills/scroll-reveal-motion ~/.claude/skills/

# Or a single project, shareable by committing it
mkdir -p .claude/skills
cp -R scroll-reveal-motion/skills/scroll-reveal-motion .claude/skills/
```

Claude Code watches these directories, so the Skill appears in the current session. If you had to create a top-level `.claude/skills/` that did not exist when the session started, restart Claude Code once.

</details>

### Codex

Copy and paste this into Codex:

```text
Use $skill-installer to install the scroll-reveal-motion Skill from this
GitHub repository:
https://github.com/zhoulinhua0-star/scroll-reveal-motion

The Skill is located at skills/scroll-reveal-motion.
```

After installation, start a new Codex conversation so the refreshed Skill list is loaded. If it still does not appear, restart Codex.

## Use

Invoke it explicitly, using your agent's Skill prefix.

**Claude Code**

```text
Use /scroll-reveal-motion to add restrained fade-up reveals to the
below-the-fold sections and feature cards on this landing page.
```

**Codex**

```text
Use $scroll-reveal-motion to add restrained fade-up reveals to the
below-the-fold sections and feature cards on this landing page.
```

Or describe the effect naturally, with no prefix at all:

```text
Add an accessible staggered scroll reveal to these cards without adding
another animation dependency.
```

In Claude Code that last form is enough on its own. Skills there are model-invoked: the agent reads the Skill description and loads it when a request mentions scroll reveal, fade-up motion, staggered viewport entrances, or below-the-fold sections that appear on entry.

Either way, the Skill will inspect the target frontend first, select the smallest compatible implementation, apply motion only where it improves hierarchy, and run the project's own checks.

### Invocation names

| Install method | Name to type |
| --- | --- |
| Claude Code plugin | `/scroll-reveal-motion:scroll-reveal-motion`, or the bare `/scroll-reveal-motion` |
| Claude Code manual copy | `/scroll-reveal-motion` |
| Codex | `$scroll-reveal-motion` |


## What it gives you

| Target | Bundled implementation | Runtime dependency |
| --- | --- | --- |
| React and Next.js | Semantic `ScrollReveal` component | React only |
| Vanilla HTML/CSS/JS | `initScrollReveal()` controller | None |
| Motion, Framer Motion, or GSAP projects | Integration guidance | Reuses the project dependency |

Both bundled implementations share the same data attributes, CSS variables, motion defaults, and one-time reveal behavior.


## Inputs and outputs

Provide:

- The target frontend repository, page, or component.
- Which sections or groups should reveal, or permission for the Skill to select them.
- Any motion or dependency constraints, if applicable.

The Skill produces:

- An adapted React component or Vanilla controller.
- Integrated reveal styles and updated target markup or components.
- A summary of changed files and validation results, including reduced-motion behavior.

## Motion contract

- Reveal once at roughly 16% viewport intersection.
- Animate only `opacity` and `transform`.
- Use a restrained 20–24px vertical offset, a 520–560ms decelerating transform, and a shorter 440–480ms fade.
- Stagger up to four visually related children by 90ms; reveal later children with the fourth.
- Keep content visible before client initialization, without JavaScript, and with reduced motion enabled.
- Under reduced motion, rest the whole composition in its completed frame, not only the reveal.
- Preserve DOM order, focus order, pointer behavior, and semantic elements.

The stable integration surface is intentionally small:

```text
data-scroll-reveal="single | stagger"
data-reveal-ready="true"
data-reveal-visible="true"

--reveal-delay
--reveal-distance
--reveal-duration
--reveal-fade-duration
--reveal-stagger
--reveal-ease
```

## Repository layout

```text
scroll-reveal-motion/
├── .claude-plugin/                # Claude Code plugin and marketplace manifests
│   ├── plugin.json
│   └── marketplace.json
├── skills/scroll-reveal-motion/   # Installable Skill package
│   ├── SKILL.md
│   ├── agents/openai.yaml         # Codex presentation metadata; inert elsewhere
│   └── assets/
│       ├── scroll-reveal.css
│       ├── react/scroll-reveal.tsx
│       └── vanilla/scroll-reveal.js
├── scripts/validate-skill.mjs     # Dependency-free repository validator
├── tests/                         # Contract and browser-controller tests
└── .github/workflows/validate.yml
```

The repository root doubles as the plugin root, which is why `skills/` sits beside `.claude-plugin/` rather than inside it. Only the two manifests belong in `.claude-plugin/`.

`SKILL.md` frontmatter is limited to `name` and `description`, the fields common to the [Agent Skills](https://agentskills.io) specification, so the same package loads in Claude Code, Codex, and claude.ai without per-agent edits.

Repository documentation and automation stay outside the installable Skill package so agents load only the files needed to perform the task.

## Validate

The runtime templates add no animation dependency. Repository validation needs Node.js 20 or newer and downloads a pinned `esbuild` binary on the first run to parse the React/TypeScript asset.

```bash
npm test
npm run validate
```

`npm run validate` also checks the plugin and marketplace manifests, so no extra tooling is required in CI.

Contributors with Claude Code installed can additionally run the official plugin validator:

```bash
claude plugin validate . --strict
```

Contributors with Codex installed can additionally run the official Skill validator:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/scroll-reveal-motion
```

## Release status

The source tree targets the `v1.0.0` contract: React/Next.js and Vanilla implementations, framework-selection guidance, stable attributes and CSS variables, and repeatable validation. A Git tag and GitHub release should be created only after the initial commit is reviewed.

## Contributing

Keep the Skill concise and dependency-free. See [CONTRIBUTING.md](CONTRIBUTING.md) for the validation and compatibility requirements.

## License

[MIT](LICENSE). This project implements a common scroll-reveal pattern and is not affiliated with or endorsed by any referenced product or website.
