# Repository tooling

`skills.mjs` implements local discovery, frontmatter validation, and single-skill publishing. `skills-config.ts` validates the public skills.sh page configuration and grouped slugs. The Makefile delegates to these CLIs; tests import the publishing exports.

- Keep subprocess arguments separate from executable names; do not interpolate skill names or remote settings into shell commands.
- Inspect every outgoing commit before publishing. Checking only the final diff can miss unrelated files that were changed and reverted.
- Push the exact checked commit to the explicit destination ref, with automatic tag pushing disabled. Never stage, commit, force-push, or install skills as a publishing side effect.
- Keep dry runs free of remote writes; fetching remote state is allowed. Exercise publishing changes using temporary local Git remotes in `tests/`.
- Keep this file and [development](../docs/development.md) and [publishing](../docs/publishing.md) docs current when tooling changes, following the [root maintenance rule](../AGENTS.md).
