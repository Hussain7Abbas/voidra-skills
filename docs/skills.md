# Skills and authoring

Each `skills/<name>/` directory is an independent installable unit. Its `SKILL.md` contains YAML frontmatter with a matching `name`, a description explaining when to use the skill, and Markdown instructions below the frontmatter. The [Agent Skills specification](https://agentskills.io/specification) describes the format.

## Included skill: init

[init](../skills/init/SKILL.md) creates and updates root and scoped `AGENTS.md` files, sibling `CLAUDE.md` imports, and a linked `docs/` tree. Its generated instructions require maintaining rules and documentation alongside changes to the code.

The initial folder was copied from the global `~/.agents/skills/init` installation, including `tile.json`. That file retains the inherited `mcollina/init` identity; it is source metadata, not this repository's skills.sh identity or a publication configuration. The repository copy and global installation are independent. Future repository edits do not modify the installed copy.

## Electron desktop conventions

[electron-best-practices](../skills/electron-best-practices/SKILL.md) is Hussain's customized edition of the MIT-licensed jwynia/agent-skills Electron skill. It preserves the original author, source revision and supporting material, with Hussain recorded as a contributor. Its [personal desktop style](../skills/electron-best-practices/references/personal-desktop-style.md) covers main-action hotkeys, custom titlebars with Settings opposite the window controls, General/Appearance settings tabs, independent scrolling, accessibility and persistent preferences. Optional upstream helpers use Deno; ordinary skill use does not require it.

In the enclosing dot-skills checkout, this distribution copy is synchronized from its canonical `skills/electron-best-practices/` folder. Global agent links point to the canonical folder; copying for distribution does not change global installation by itself.

## Canonical dot-skills distribution

The [README catalog](../README.md#skills) lists 326 public packages synchronized from dot-skills. The 311 `eai-` packages retain explicit-only invocation settings for Codex and Claude Code. Installation does not enable hooks, background observers, automatic upstream updates or unavailable connectors. Conditional practice references stay inside each package; loading one does not invoke sibling skills. Preserve original authors, contributors, licenses and source provenance on every refresh.

Use dot-skills as the editing source for these distribution copies. Run its `make publish SKILL=<name>` for each selected package, then validate this repository and update the catalog/groupings.

## Add another skill

1. Create `skills/<name>/SKILL.md` using the [authoring rules](../skills/AGENTS.md).
2. Include any supporting scripts, references, assets, and applicable attribution/license files in that folder. Use relative links that remain valid when only the skill is installed.
3. Add the skill to the [README catalog](../README.md#skills).
4. Run `make validate SKILL=<name>` and `make discover`.
5. Publish the catalog/documentation update separately from the skill's own commit when using the single-skill publishing target.

Skill folders need no individual package.json or Makefile unless they acquire their own executable development workflow. Root tooling handles ordinary Markdown skills uniformly. New nested documentation sections should have an `Intro.md` index linked from their parent.

[Back to documentation](intro.md)
