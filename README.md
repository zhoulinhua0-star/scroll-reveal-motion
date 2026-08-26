# Scroll Reveal Motion

An Agent Skill for adding restrained, accessible, and performant reveal-on-scroll motion to modern web interfaces.

English | [简体中文](README.zh-CN.md)

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)


## Install

Copy and paste this into Codex:

```text
Use $skill-installer to install the scroll-reveal-motion Skill from this
GitHub repository:
https://github.com/zhoulinhua0-star/scroll-reveal-motion

The Skill is located at skills/scroll-reveal-motion.
```

> **Syntax note:** `$` invokes a Skill in Codex; it is not a terminal prompt.
> ChatGPT uses `@`, while Claude Code uses `/`.

After installation, start a new Codex conversation so the refreshed Skill list is loaded. If it still does not appear, restart Codex.

## Use

Then invoke it explicitly:

```text
Use $scroll-reveal-motion to add restrained fade-up reveals to the
below-the-fold sections and feature cards on this landing page.
```

Or describe the effect naturally:

```text
Add an accessible staggered scroll reveal to these cards without adding
another animation dependency.
```

The Skill will inspect the target frontend first, select the smallest compatible implementation, apply motion only where it improves hierarchy, and run the project's own checks.


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
- Use a restrained 20–24px vertical offset and a 520–560ms decelerating transition.
- Stagger up to four visually related children by 90ms; reveal later children with the fourth.
- Keep content visible before client initialization, without JavaScript, and with reduced motion enabled.
- Preserve DOM order, focus order, pointer behavior, and semantic elements.

The stable integration surface is intentionally small:

```text
data-scroll-reveal="single | stagger"
data-reveal-ready="true"
data-reveal-visible="true"

--reveal-delay
--reveal-distance
--reveal-duration
--reveal-stagger
--reveal-ease
```

## Repository layout

```text
scroll-reveal-motion/
├── skills/scroll-reveal-motion/   # Installable Skill package
│   ├── SKILL.md
│   ├── agents/openai.yaml
│   └── assets/
│       ├── scroll-reveal.css
│       ├── react/scroll-reveal.tsx
│       └── vanilla/scroll-reveal.js
├── scripts/validate-skill.mjs     # Dependency-free repository validator
├── tests/                         # Contract and browser-controller tests
└── .github/workflows/validate.yml
```

Repository documentation and automation stay outside the installable Skill package so agents load only the files needed to perform the task.

## Validate

The runtime templates add no animation dependency. Repository validation needs Node.js 20 or newer and downloads a pinned `esbuild` binary on the first run to parse the React/TypeScript asset.

```bash
npm test
npm run validate
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
