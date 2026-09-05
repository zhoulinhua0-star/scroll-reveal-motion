# Contributing

Thank you for helping improve Scroll Reveal Motion.

## Scope

Keep changes focused on reliable reveal-on-scroll implementation and guidance. Avoid adding an animation dependency, framework variant, or configuration option without a concrete use case.

Repository-facing documentation belongs at the repository root. Keep `skills/scroll-reveal-motion/` limited to the instructions and reusable resources an agent needs while performing the task.

The repository root is also the Claude Code plugin root. Keep `.claude-plugin/` limited to `plugin.json` and `marketplace.json`; `skills/` and every other component directory stay beside it, never inside it.

## Make a change

1. Update the relevant Skill instruction or asset.
2. Keep the React and Vanilla implementations on the shared data-attribute contract.
3. Add or update a test for behavioral changes.
4. Run the full validation command.

```bash
npm run validate
```

When you change the release version, update it in `.claude-plugin/plugin.json` and the `.claude-plugin/marketplace.json` listing together. `npm run validate` fails if the two drift apart.

If Claude Code is installed locally, also run:

```bash
claude plugin validate . --strict
```

If Codex is installed locally, also run:

```bash
python3 ~/.codex/skills/.system/skill-creator/scripts/quick_validate.py \
  skills/scroll-reveal-motion
```

## Compatibility requirements

- Keep `SKILL.md` frontmatter to `name` and `description` so the package stays loadable in Claude Code, Codex, and claude.ai.
- Keep server-rendered and no-JavaScript content visible.
- Honor `prefers-reduced-motion` without delaying access to content.
- Animate only `opacity` and `transform` by default.
- Preserve semantic DOM and keyboard behavior.
- Disconnect observers after one-time reveals and during cleanup.
- Do not claim ownership of or affiliation with a reference site's implementation.
