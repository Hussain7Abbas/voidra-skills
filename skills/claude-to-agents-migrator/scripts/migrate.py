#!/usr/bin/env python3
"""Migrate repository CLAUDE.md instruction files to AGENTS.md."""

from __future__ import annotations

import argparse
from pathlib import Path


EXCLUDED_DIRS = {
    ".git",
    ".next",
    ".turbo",
    ".venv",
    "build",
    "coverage",
    "dist",
    "node_modules",
    "vendor",
}
POINTER = "@AGENTS.md\n"
MERGE_MARKER = "<!-- Migrated from CLAUDE.md -->"


def is_excluded(path: Path, root: Path) -> bool:
    return any(part in EXCLUDED_DIRS for part in path.relative_to(root).parts[:-1])


def meaningful(text: str) -> str:
    lines = text.splitlines()
    if lines and lines[0].strip() == "@AGENTS.md":
        lines = lines[1:]
    return "\n".join(lines).strip()


def combine(existing: str, incoming: str) -> tuple[str, str]:
    current = existing.strip()
    addition = meaningful(incoming)
    if not addition:
        return (existing if existing.endswith("\n") else existing + "\n", "pointer-only")
    if addition in current:
        return (existing if existing.endswith("\n") else existing + "\n", "already-present")
    if not current:
        return addition + "\n", "moved"
    return f"{current}\n\n{MERGE_MARKER}\n{addition}\n", "merged"


def migrate(root: Path, dry_run: bool) -> None:
    root = root.resolve()
    if not root.is_dir():
        raise SystemExit(f"Not a directory: {root}")

    sources = sorted(path for path in root.rglob("CLAUDE.md") if not is_excluded(path, root))

    for source in sources:
        target = source.with_name("AGENTS.md")
        incoming = source.read_text(encoding="utf-8")
        existing = target.read_text(encoding="utf-8") if target.exists() else ""
        output, action = combine(existing, incoming)
        print(f"{action}: {source.relative_to(root)} -> {target.relative_to(root)}")
        print(f"shim: {source.relative_to(root)} -> @AGENTS.md")
        if dry_run:
            continue
        if meaningful(incoming) or target.exists():
            target.write_text(output, encoding="utf-8")
            source.write_text(POINTER, encoding="utf-8")

    agents_files = sorted(path for path in root.rglob("AGENTS.md") if not is_excluded(path, root))
    for target in agents_files:
        source = target.with_name("CLAUDE.md")
        if source.exists():
            continue
        print(f"shim: {source.relative_to(root)} -> @AGENTS.md")
        if not dry_run:
            source.write_text(POINTER, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", nargs="?", default=".", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    migrate(args.root, args.dry_run)


if __name__ == "__main__":
    main()
