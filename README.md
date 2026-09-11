# Scroll Reveal Motion

Two Agent Skills for web motion: **headlines that fade in on page entry**, and **sections that reveal as you scroll**.

English | [简体中文](README.zh-CN.md)

[![Validate](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml/badge.svg)](https://github.com/zhoulinhua0-star/scroll-reveal-motion/actions/workflows/validate.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-18181b.svg)](LICENSE)

## What you get

| Skill | Trigger | Effect |
| --- | --- | --- |
| [`hero-text-reveal`](skills/hero-text-reveal/SKILL.md) | Page entry | Headline fades in character by character — 1,000ms per character, 80ms apart, with optional accent color arriving after the text settles |
| [`scroll-reveal-motion`](skills/scroll-reveal-motion/SKILL.md) | Viewport entry | Sections and cards rise 20–24px and fade in once, 90ms apart, capped at four visible steps |

Both keep the text readable the whole way: complete content with JavaScript disabled, intact heading semantics, and the finished composition shown immediately under `prefers-reduced-motion: reduce`.

These are instructions and resources a coding agent adapts to your frontend — not a drop-in library. `scroll-reveal-motion` ships a React/Next.js component, a Vanilla controller, and shared CSS. `hero-text-reveal` ships implementation guidance and reference timing; it has no reusable React component or general-purpose text splitter yet.

## Install

### Claude Code

```text
/plugin marketplace add zhoulinhua0-star/scroll-reveal-motion
```

```text
/plugin install scroll-reveal-motion@scroll-reveal-motion
```

Restart Claude Code afterwards — a running session keeps the version it started with. Later, `/plugin update scroll-reveal-motion@scroll-reveal-motion` picks up new releases.

### Codex

Copy and paste this sentence into Codex and let the agent handle installation:

```text
Please use $skill-installer to download and install skills/hero-text-reveal and skills/scroll-reveal-motion from https://github.com/zhoulinhua0-star/scroll-reveal-motion as my personal Codex skills, updating existing copies if already installed to avoid duplicates.
```

After installation, invoke `$hero-text-reveal` or `$scroll-reveal-motion` with your request. If the skills don't appear, [restart Codex](https://learn.chatgpt.com/docs/build-skills#install-curated-skills-for-local-use).

## Use

| Installation | Hero headline | Scroll sections |
| --- | --- | --- |
| Claude Code plugin | `/scroll-reveal-motion:hero-text-reveal` | `/scroll-reveal-motion:scroll-reveal-motion` |
| Claude Code personal skills | `/hero-text-reveal` | `/scroll-reveal-motion` |
| Codex | `$hero-text-reveal` | `$scroll-reveal-motion` |

Invoke a skill together with the target and any constraints — the skill inspects your stack before adapting the effect, so it needs to know what to animate:

```text
Use /scroll-reveal-motion:hero-text-reveal for a staggered entrance on the h1 in
src/app/page.tsx, and /scroll-reveal-motion:scroll-reveal-motion for the feature
cards below it. Preserve the existing typography, reuse existing animation
dependencies, and show the completed composition when reduced motion is enabled.
```

Either skill works on its own. Using both on one page, keep the hero outside scroll-reveal wrappers: each effect owns its own elements and timing, and neither waits for the other.

## License

[MIT](LICENSE). Contributions: see [CONTRIBUTING.md](CONTRIBUTING.md). No affiliation with or endorsement by any reference website.
