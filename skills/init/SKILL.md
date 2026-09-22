---
name: init
description: Create or update project instructions and documentation with root and selectively scoped AGENTS.md files covering project rules, structure, and code style; CLAUDE.md files that import their sibling AGENTS.md; and a linked docs/ tree. Use when initializing repository guidance or refreshing it after project changes. Includes maintenance rules that keep instructions and documentation synchronized with user changes.
metadata:
  author: mcollina
  contributors: hussain7abbas <hussain@iscoded.com>
  tags: initialization, agents, context-engineering, agents-md, documentation, maintenance
---

## Outcome

Create and maintain a concise instruction hierarchy and a navigable documentation tree. `AGENTS.md` is the single source of truth for agent rules; `CLAUDE.md` only imports it. Documentation explains the project in more detail and links back to relevant instructions instead of duplicating rules.

## Inspect the project

Read existing root and scoped `AGENTS.md` and `CLAUDE.md` files, the README, existing docs, package/build configuration, formatter/linter configuration, CI, and representative code. Check other existing instruction files for project-specific conventions when relevant.

Identify the main scopes, directory responsibilities, code style, development commands, and complex areas that need local guidance. Base content on the current project and explicit user decisions; do not invent architecture, commands, or conventions. Preserve useful existing instructions and documentation while correcting stale content.

## Write scoped AGENTS.md files

Always create or update the root `AGENTS.md` with:

- Project purpose, shared rules, constraints, and development workflow.
- A concise map of the main directories and their responsibilities, with links to scoped instructions.
- Established code style and conventions: naming, organization, imports, error handling, testing, and formatting where applicable. Reference tooling configuration for exact settings.
- Relevant setup, build, test, and lint commands, including project-specific caveats.
- A link to `docs/intro.md` and the maintenance rule below.

Create additional `AGENTS.md` files only in main or complex directories that benefit from distinct guidance, such as a major application, package, service, or subsystem. Do not create one in every directory or in generated output, dependencies, or vendor code. A small project may need only the root file.

Each scoped file describes that area's purpose, internal structure, local rules, code style, and relevant commands. Include only details that add to or intentionally specialize ancestor guidance; link to shared rules instead of copying them. Add a brief instruction to keep the scoped file current whenever that area's rules, structure, or conventions change, following the root maintenance rule.

Keep summaries concise and actionable. Include useful structure and style even when discoverable from code; move detailed explanations to `docs/` and link to them. Avoid exhaustive file inventories, generic advice, and repeated configuration dumps.

## Build the documentation tree

Create or update `docs/` at the project root:

- `docs/intro.md` is the entry point: explain the project briefly and link to every main documentation scope.
- Give each main scope a meaningful `.md` page covering its purpose, design, behavior, interfaces, or development workflow as relevant to the project.
- When a scope needs multiple pages, group them in a subdirectory with an `Intro.md` index linking to its pages. Every further documentation subdirectory also gets an `Intro.md` index.
- Use lowercase `intro.md` at the docs root and capitalized `Intro.md` in nested directories. Link using the exact filename case and relative paths.
- Link the root index to each scope page or scope index, and link nested indexes and pages back to their parent index so the tree remains navigable.

Choose scopes from the actual project rather than imposing a fixed template. Reuse and improve existing documentation, preserving useful content and repairing links when reorganizing it. Avoid empty placeholders, duplicate pages, and invented behavior. Keep agent rules in `AGENTS.md`; documentation should explain the project and reference those rules when needed.

## Keep instructions and docs synchronized

Include the following rule, adapted only for the project's actual paths, in the root `AGENTS.md`:

> As part of every task, keep project instructions and documentation synchronized with user-requested changes and relevant changes already made by the user. Before finishing, review the affected `AGENTS.md` files and `docs/` pages and update any rules, directory descriptions, code conventions, commands, architecture, interfaces, configuration, or behavior that changed. Add, move, or remove scoped instructions and documentation when project scopes change, and repair their indexes and links. Update affected documentation in the same task as the code changes; do not leave known stale guidance. Preserve unrelated user edits and document the current intended state without reverting code to match old documentation. If a change has no documentation or instruction impact, leave those files unchanged. Keep every `CLAUDE.md` as only `@AGENTS.md`, with the actual rules in its sibling `AGENTS.md`.

This is also the Claude documentation maintenance rule: Claude receives it through the root `CLAUDE.md` import. Do not duplicate it in `CLAUDE.md` or a separate Claude rules file. It is a standing instruction for future tasks, not a background watcher.

## Always create CLAUDE.md reference files

For every root or scoped `AGENTS.md`, ensure a sibling `CLAUDE.md` exists whose entire content is this single line, followed by a newline:

```text
@AGENTS.md
```

Before replacing an existing `CLAUDE.md`, read it and migrate any still-relevant rules or referenced guidance into its sibling `AGENTS.md`, preserving their scope and resolving duplication. Do not copy the `@AGENTS.md` import into `AGENTS.md` or introduce circular references. If a directory has a standalone `CLAUDE.md`, create the corresponding `AGENTS.md` there to retain that existing scope, then replace `CLAUDE.md` with the import. Do not discard unique guidance during conversion or use symlinks or copied rules as a substitute for the requested import. If `CLAUDE.md` is a symlink, replace the link itself without overwriting its target.

## Verify the result

- Root and scoped instructions accurately describe the current project's rules, structure, and code style, with scoped files only where justified.
- Every `AGENTS.md` has a sibling `CLAUDE.md` containing only `@AGENTS.md`, and no existing Claude-only guidance was lost.
- `docs/intro.md` exists, each main scope is covered, and each nested documentation directory has a linked `Intro.md`.
- Relative links and referenced paths resolve with the correct case; no obsolete guidance, orphaned pages, or placeholders remain in the affected content.
- Root instructions include the maintenance rule, and scoped instructions require keeping their local guidance current.

Report the files created or updated and any facts that could not be verified.
