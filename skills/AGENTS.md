# Skill authoring

- Keep each distributable skill self-contained in `skills/<name>/`, with a `SKILL.md` whose YAML `name` matches the directory. Use lowercase letters, digits, and single hyphens; maximum 64 characters.
- Write a nonempty description of at most 1024 characters explaining capability and when to use it. Keep instructions concise; add `references/`, `scripts/`, or `assets/` only when needed.
- Keep dependencies and file links inside the skill folder so installing one skill does not require the rest of this repository. Shared repository instructions belong here, outside individual skill payloads.
- Preserve attribution and license information when importing skills. The initial `init` copy includes its original `tile.json`; that metadata is not a skills.sh publishing manifest.
- Add new skills to the README catalog and [authoring docs](../docs/skills.md). Validate with `make validate SKILL=<name>` from the root.
- Keep this file current when skill layout or conventions change, following the [root maintenance rule](../AGENTS.md).
