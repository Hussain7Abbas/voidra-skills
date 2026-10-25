---
name: makefile-standards
description: "Generate or update a project's Makefile to a consistent standard: strict-mode shell, self-documenting `make help` (awk over `# ` target comments), .PHONY grouping, an abspath ROOT, and Setup/App/Quality/Deploy target groups. Use whenever the user asks to create, scaffold, standardize, or clean up a Makefile for a project in any language (Node/Bun, Python, Go, Rust, Ruby, Java, Docker, etc.), or references 'the Makefile standard'."
metadata:
  contributors: hussain7abbas <hussain@iscoded.com>
---

# Makefile standards

Generate a `Makefile` for any project (any language, any package manager) that
follows one consistent shape. The reference implementation this standard was
extracted from lives in `references/example.mk` (KIOS Scan, a Bun/Next.js
project) — read it if you want a concrete worked example, but always adapt
the actual commands to the target project's real language/tooling. Never
copy Bun/Next.js-specific commands into a project that doesn't use them.

## Before writing anything

1. Detect the project's language/toolchain from what's actually in the repo
   (`package.json` + lockfile flavor, `pyproject.toml`/`requirements.txt`,
   `go.mod`, `Cargo.toml`, `Gemfile`, `pom.xml`/`build.gradle`, `Dockerfile`,
   etc.). Don't guess — look.
2. Check for an existing `Makefile`. If one exists, preserve any
   project-specific targets/logic that aren't covered by this standard
   (custom deploy scripts, migrations, seed data, etc.) — restructure them
   into the right group rather than deleting them.
3. Identify the real commands for: install deps, run dev server, build,
   start/run production, lint, typecheck (if applicable), test (if a test
   suite exists), clean. Only include a target if the project actually has
   the corresponding capability — don't invent a `typecheck` target for a
   plain JS project with no type checker, don't invent a `test` target if
   there are no tests yet (a stub that just prints "no tests" is worse than
   omitting it).

## Structural rules (non-negotiable)

- **Header comment**: one line — `# <Project Name> — local setup & run (uses <primary tool>)` — plus `# Run `make help` for targets.`
- **Shell strict mode**, always:
  ```make
  SHELL := /bin/bash
  .SHELLFLAGS := -eu -o pipefail -c
  ```
- **ROOT**, always, so targets work regardless of caller's cwd:
  ```make
  ROOT := $(abspath $(dir $(lastword $(MAKEFILE_LIST))))
  ```
- **`.DEFAULT_GOAL := help`** — running bare `make` always shows help, never
  runs a side-effecting target.
- **`.PHONY`** lists every target, grouped with line-continuation backslashes
  in the same section order as the targets are defined (see example.mk for the
  exact layout style).
- **`help` target** is the first target defined, is self-documenting, and
  uses exactly this recipe — never hand-written `@echo` lines:
  ```make
  help: # Show this help
  	@awk 'BEGIN {FS = ": *#+ *"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z0-9_-]+( +[a-zA-Z0-9_-]+)*: *#/ { gsub(/ +/, ", ", $$1); printf "  \033[36m%-25s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
  ```
  - Every public target documents itself with a trailing `# <description>`
    on its rule line, e.g. `run: # Run Docker container locally`. The
    description is short, sentence case, and may name the underlying
    command (`lint: # Run next lint`). A legacy `##` still works, but
    write single `#` in new files.
  - Descriptions are printed raw, so write literal values, not Make
    variables (`# pm2 start ecosystem.config.cjs`, not `$(ECOSYSTEM)`).
    A `#` inside the description itself is fine — only the first `#` run
    after the colon ends the target names.
  - Aliases are extra names on the same rule, listed in one help row as
    `push, image-push`: `push image-push: # Push Docker image to ECR`.
    Add every alias to `.PHONY` too. Don't create a separate
    `image-push: push` rule for an alias.
  - Internal helper targets (e.g. `stop-conflicting-dev`) get **no**
    trailing comment so they stay out of `make help`. Since a single `#`
    is enough to publish a target, never leave an incidental note (a TODO,
    a reminder) on a rule line — put it on its own line above the rule.
  - The `#` must come **directly after the colon** (any spaces are fine:
    `run:# …`, `run: # …`, `run:    # …`). A rule with prerequisites
    therefore cannot be documented — `setup: install env # …` is skipped,
    because something stands between the colon and the `#`. Give such a
    target an empty prerequisite list and invoke its dependencies from the
    recipe instead: `setup: # Install deps + create .env` with
    `@$(MAKE) install env` as the first recipe line.
  - `help` lists targets in file order, so **define targets grouped in
    section order: Setup → App → Quality → Test (if present) →
    Production/Deploy (if present)**, each group introduced by a plain
    comment banner (`# ── Setup ───…`). Omit any section with no targets.
  - Never add `@echo` help blocks or color variables just for help output
    (the awk hardcodes cyan). Only define color variables if some other
    recipe actually prints colored output.
- **Every target body** that touches the filesystem runs from `$(ROOT)`:
  `@cd "$(ROOT)" && <command>`. Prefer one command per recipe line; keep
  multi-line bash blocks (loops, conditionals) only when a single target
  genuinely needs them, and keep them defensive (`|| true` on cleanup-style
  kills, existence checks before `cp`/`mkdir`).
- Idempotent setup: an `env` target that copies `.env.example` → `.env`
  only if `.env` doesn't already exist yet, and says so either way. A
  `setup` target that chains `install` + `env` (+ any other one-time init)
  and prints clear "next steps" (which vars to edit, which command to run
  next).
- Target names are short, lowercase, hyphenated verbs/nouns matching the
  underlying tool's own vocabulary where one exists (`lint`, `typecheck`,
  `build`, `test`, `clean`, `dev`, `start`) — don't invent unfamiliar names
  for standard actions.

## Section → target mapping (adapt commands per language)

- **Setup**: `install` (install deps), `env` (create `.env` from example if
  missing), `setup` (install + env, prints next steps).
- **App**: `dev` (run local dev/watch mode), `build` (production build, if
  the language has a build step — omit for pure scripts), `start` (run the
  built/production artifact).
- **Quality**: `lint`, `typecheck` (only for typed languages / TS), `clean`
  (remove build caches/artifacts — list exact paths, don't `rm -rf .`).
- **Test** (only if tests exist): `test`, and `test-watch` if the test
  runner supports a watch mode.
- **Production/Deploy** (only if the project actually deploys somewhere —
  don't add this section for a library or a purely local tool): process
  manager targets (pm2/systemd/docker), and any deploy/sync/nginx-style
  targets the project already has scripts for. Mirror the existing
  `pm2-*` / `nginx-*` naming pattern in example.mk when the target project
  also uses pm2 + nginx; otherwise name for the tool actually in use
  (`docker-build`, `docker-up`, `systemctl-restart`, etc.).
  - **Default for JS/Node projects (npm/pnpm/yarn/bun) that deploy to a
    long-running server** (i.e. have a `start` script and aren't a pure
    static/library build): standardize on pm2 unless the project already
    uses a different process manager. Create an `ecosystem.config.js` at
    the repo root if one doesn't exist (`apps: [{ name, script, args, cwd:
    __dirname, env: { NODE_ENV: 'production' } }]`, pointing `script`/`args`
    at the project's real start command, e.g. `node_modules/.bin/next` +
    `start -p ${process.env.PORT || 3000}`). Add exactly these four
    targets, all operating on that file:
    - `pm2-start` — `pm2 start ecosystem.config.js`
    - `pm2-stop` — `pm2 stop ecosystem.config.js`
    - `pm2-restart` — `pm2 restart ecosystem.config.js`
    - `pm2-delete` — `pm2 delete ecosystem.config.js`
    Plus a `sync` target that pulls, rebuilds, and restarts the running
    instance: `git pull` → install deps → `build` → `pm2-restart` (call the
    existing `pm2-restart` target via `$(MAKE) pm2-restart` rather than
    duplicating its recipe). If `pm2-start`/`pm2-restart` need `PORT` or
    other `.env` values, source `.env` the same way `dev`/`start` do
    (`set -a && [ -f .env ] && . ./.env || true; set +a`) before invoking
    `pm2`.

## Per-language command cheatsheet

Use these as defaults, but verify against the project's actual `package.json`
scripts / task runner / Makefile-adjacent config rather than assuming:

| Language / stack | install | dev | build | start | lint | typecheck | test |
|---|---|---|---|---|---|---|---|
| Node (bun) | `bun install` | `bun run dev` | `bun run build` | `bun run start` | `bun run lint` | `bunx tsc --noEmit` | `bun test` |
| Node (npm/pnpm/yarn) | `npm ci` / `pnpm install` / `yarn install` | `npm run dev` | `npm run build` | `npm run start` | `npm run lint` | `npx tsc --noEmit` | `npm test` |
| Python (uv) | `uv sync` | `uv run <entry>` | — (or `uv build`) | `uv run <entry>` | `uv run ruff check .` | `uv run mypy .` | `uv run pytest` |
| Python (poetry) | `poetry install` | `poetry run <entry>` | `poetry build` | `poetry run <entry>` | `poetry run ruff check .` | `poetry run mypy .` | `poetry run pytest` |
| Go | `go mod download` | `go run ./...` | `go build -o bin/app ./...` | `./bin/app` | `golangci-lint run` | — (compiler covers it) | `go test ./...` |
| Rust | `cargo fetch` | `cargo run` | `cargo build --release` | `./target/release/<bin>` | `cargo clippy` | — (compiler covers it) | `cargo test` |
| Ruby | `bundle install` | `bundle exec rails s` (or app entry) | — | `bundle exec rails s` | `bundle exec rubocop` | — | `bundle exec rspec` |
| Java (gradle) | `./gradlew build --dry-run` or just rely on build | — | `./gradlew build` | `./gradlew run` | `./gradlew check` | — | `./gradlew test` |

If the project's toolchain isn't in this table, infer the equivalent
commands from its config files and follow the same slotting.

## Workflow

1. Detect toolchain, read any existing Makefile, list available capabilities
   (build step? typechecker? test suite? deploy scripts?).
2. Draft the full Makefile following the structural rules above, dropping
   any target/section that has no corresponding capability.
3. Write the file, then validate it: `make -n help` should print without
   errors, and `make help` should list every public target with its
   description (and no internal helpers).
4. Show the user the resulting `help` output (or a summary of the target
   list) rather than just claiming success.
