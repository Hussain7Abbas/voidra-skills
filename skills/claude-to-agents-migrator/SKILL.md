---
name: claude-to-agents-migrator
description: Migrate repository-owned CLAUDE.md instruction files to AGENTS.md while retaining sibling CLAUDE.md compatibility pointers. Use when converting Claude-oriented repository instructions for Codex or maintaining shared Codex and Claude instructions.
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
---

# CLAUDE.md to AGENTS.md Migrator

Run the bundled migration script from the repository root:

```bash
python3 scripts/migrate.py /absolute/path/to/repository
```

The script:

- finds repository-owned `CLAUDE.md` files while excluding dependencies, generated output, caches, and VCS metadata;
- moves each scoped file's meaningful instructions into the sibling `AGENTS.md`;
- preserves existing `AGENTS.md` content and appends non-duplicate `CLAUDE.md` content when both exist;
- leaves every migrated scoped `CLAUDE.md` as an `@AGENTS.md` compatibility shim;
- creates the same shim beside repository-owned `AGENTS.md` files that did not previously have a `CLAUDE.md`;
- merges meaningful root `CLAUDE.md` instructions into root `AGENTS.md`; and
- leaves the root `CLAUDE.md` containing exactly `@AGENTS.md` plus a trailing newline.

Use `--dry-run` first when the repository has many instruction files or existing `AGENTS.md` files. Review the reported merge cases after execution. Do not migrate third-party files under excluded directories.

The script changes instruction files only. Update links or prose references from `CLAUDE.md` to `AGENTS.md` separately when they refer to migrated repository files; do not rewrite references to external/global Claude configuration.
