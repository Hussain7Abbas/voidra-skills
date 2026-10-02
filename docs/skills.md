# Skills and authoring

Each `skills/<name>/` directory is an independent installable unit. Its `SKILL.md` contains YAML frontmatter with a matching `name`, a description explaining when to use the skill, and Markdown instructions below the frontmatter. The [Agent Skills specification](https://agentskills.io/specification) describes the format.

## Included skill: init

[init](../skills/init/SKILL.md) creates and updates root and scoped `AGENTS.md` files, sibling `CLAUDE.md` imports, and a linked `docs/` tree. Its generated instructions require maintaining rules and documentation alongside changes to the code.

The initial folder was copied from the global `~/.agents/skills/init` installation, including `tile.json`. That file retains the inherited `mcollina/init` identity; it is source metadata, not this repository's skills.sh identity or a publication configuration. The repository copy and global installation are independent. Future repository edits do not modify the installed copy.

## Raseen skills

[raseen-adl](../skills/raseen-adl/SKILL.md) writes, edits, and reviews ADL 1 designs. Its self-contained language reference and three examples cover isolated handoff/return, shared-context approval, and bounded retries.

[raseen-mcp](../skills/raseen-mcp/SKILL.md) operates the existing Raseen MCP surface, including service updates, live chat, sub-agent configuration, user administration, and exact ADL save/read-back. Its connection, tool, and persistence references stay inside the skill folder.

Use both when authoring and saving a workflow. Each works independently: the ADL skill can deliver a file without MCP, and the MCP skill can save user-supplied source. Installation does not configure a server, supply credentials, or run an ADL workflow. Service designs require an admin with dashboard read/write scopes.

Install both for Codex:

```sh
npx skills add hussain7abbas/voidra-skills --skill raseen-adl raseen-mcp --agent codex --global --yes
```

## Add another skill

1. Create `skills/<name>/SKILL.md` using the [authoring rules](../skills/AGENTS.md).
2. Include any supporting scripts, references, assets, and applicable attribution/license files in that folder. Use relative links that remain valid when only the skill is installed.
3. Add the skill to the [README catalog](../README.md#skills).
4. Run `make validate SKILL=<name>` and `make discover`.
5. Publish the catalog/documentation update separately from the skill's own commit when using the single-skill publishing target.

Skill folders need no individual package.json or Makefile unless they acquire their own executable development workflow. Root tooling handles ordinary Markdown skills uniformly. New nested documentation sections should have an `Intro.md` index linked from their parent.

[Back to documentation](intro.md)
