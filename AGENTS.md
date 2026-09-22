# voidra-skills

## Purpose and structure

Maintain a monorepo of independently installable agent skills for skills.sh.

- `skills/`: distributable skill folders; follow [scoped authoring rules](skills/AGENTS.md).
- `scripts/`: validation and publishing implementation; follow [tooling rules](scripts/AGENTS.md).
- `tests/`: Node tests, including publishing against temporary local Git repositories.
- `docs/`: project documentation starting at [intro.md](docs/intro.md).
- `Makefile`: public development and publishing commands.
- `.github/workflows/check.yml`: validation, tests, and CLI discovery in CI.
- `skills.sh.json`: skills.sh repository-page grouping configuration.

## Workflow and style

- Use Node.js 22.20+ and the pinned npm dependencies. Run `make setup` after cloning or changing the lockfile.
- Run `make check` for tooling changes and `make validate SKILL=<name>` for a skill edit. Use `make discover` when changing skill layout or discovery metadata.
- Use ES modules, Node built-ins, explicit errors, and argument arrays for subprocesses. Follow `.editorconfig`: two spaces, LF, trailing newlines, and tabs in Makefile recipes.
- Keep package.json private: this repository publishes Git-hosted skills, not an npm package.
- Keep `skills.sh.json` valid against its declared schema and update its groups when published skills are added, renamed, or removed.
- Keep `make publish SKILL=<name>` limited to that skill's committed changes. Publish shared repository changes separately. See [publishing](docs/publishing.md).
- Treat repository skill copies as the editing source. Global installations are independent copies; update them only when requested.

## Keep instructions and documentation synchronized

As part of every task, keep project instructions and documentation synchronized with user-requested changes and relevant changes already made by the user. Before finishing, review the affected `AGENTS.md` files and `docs/` pages and update any rules, directory descriptions, code conventions, commands, architecture, interfaces, configuration, or behavior that changed. Add, move, or remove scoped instructions and documentation when project scopes change, and repair their indexes and links. Update affected documentation in the same task as the code changes; do not leave known stale guidance. Preserve unrelated user edits and document the current intended state without reverting code to match old documentation. If a change has no documentation or instruction impact, leave those files unchanged. Keep every `CLAUDE.md` as only `@AGENTS.md`, with the actual rules in its sibling `AGENTS.md`.
