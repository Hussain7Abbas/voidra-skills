# Development

Use Node.js 22.20+, npm, Git, and GNU Make. The Makefile supports macOS's bundled GNU Make 3.81 as well as newer versions. `npm ci` installs exact versions from `package-lock.json`.

| Command | Behavior |
| --- | --- |
| `make` | Show available commands. |
| `make setup` | Install the pinned development dependencies. |
| `make list` | List local skills and descriptions. |
| `make validate` | Validate every skill folder. |
| `make validate SKILL=init` | Validate one skill. |
| `make skills-config` | Validate `skills.sh.json` and every grouped skill slug. |
| `make test` | Run Node's test runner. |
| `make check` | Validate skills and run the tests. |
| `make discover` | List local skills using the official CLI without installing them. |
| `make publish SKILL=init DRY_RUN=1` | Check a proposed release without pushing. |

Validation checks skill names, directory/frontmatter agreement, YAML syntax and duplicate keys, description length, nonempty instructions, and discovery visibility. It does not judge instruction quality or execute a skill. Review authored guidance and its linked resources before publishing.

Publishing tests use temporary local repositories and bare Git remotes. They cover a successful single-skill push, dry runs, uncommitted files, missing/behind branches, unrelated outgoing history, and tag exclusion. They make no GitHub changes and install no skills.

The [CI workflow](../.github/workflows/check.yml) runs setup, skill and skills.sh configuration validation, tests, and official CLI discovery on pushes and pull requests. Discovery runs with telemetry disabled because it is a development check.

See the [tooling rules](../scripts/AGENTS.md) before changing publishing behavior.

[Back to documentation](intro.md)
