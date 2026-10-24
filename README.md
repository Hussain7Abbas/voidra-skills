# voidra-skills

A monorepo of agent skills, with each skill independently installable through the [skills CLI](https://github.com/vercel-labs/skills) and discoverable on [skills.sh](https://skills.sh).

## Skills

| Skill | Purpose |
| --- | --- |
| [electron-best-practices](skills/electron-best-practices/SKILL.md) | Build secure Electron apps with main-action hotkeys, custom titlebars, tabbed settings and independent scrolling. |
| [init](skills/init/SKILL.md) | Create scoped project instructions, Claude imports, and documentation that stays synchronized with code changes. |
| [raseen-adl](skills/raseen-adl/SKILL.md) | Write and validate ADL 1 workflow designs with typed ports, caller context, approval, and bounded retries. |
| [raseen-mcp](skills/raseen-mcp/SKILL.md) | Use Raseen MCP tools for services, chats, live sub-agents, user administration, and verified design saves. |

## Install Raseen skills for Codex

```sh
npx skills add hussain7abbas/voidra-skills --skill raseen-adl raseen-mcp --agent codex --global --yes
```

After installation, ask Codex to use `$raseen-adl` to write a workflow or `$raseen-mcp` to operate your configured Raseen connection. ADL authoring works without a server connection. MCP operations need your own server URL and scoped personal API key; credentials are not included. Saved ADL supports interactive preview rather than live workflow execution.

Share the [ADL skill](https://skills.sh/hussain7abbas/voidra-skills/raseen-adl) and [MCP skill](https://skills.sh/hussain7abbas/voidra-skills/raseen-mcp) pages once indexed. The GitHub folders and installation command are available immediately after publication.

## Development

Requires Node.js 22.20 or newer, npm, Git, and GNU Make. The root npm package supplies development tools; skill directories are the distributable units.

```sh
make setup
make list
make check
make discover
```

Add skills under `skills/<name>/SKILL.md`. See [authoring](docs/skills.md) and the [documentation index](docs/intro.md).

## Publish one skill

After the [one-time GitHub setup](docs/publishing.md#first-time-setup), commit your changes to one skill and run:

```sh
make publish SKILL=init DRY_RUN=1
make publish SKILL=init
```

The target validates the skill and pushes committed changes to `origin/main`. It refuses outgoing commits that touch anything outside the selected skill, including other skills. It does not stage, commit, force-push, or install skills.

After the repository is pushed publicly, users can install just that skill:

```sh
npx skills add hussain7abbas/voidra-skills --skill init
```

skills.sh hosts a directory of GitHub skills. Listings follow CLI installations; a Git push does not guarantee immediate listing. See the [official publishing explanation](https://skills.sh/docs/faq#how-do-i-get-my-skill-listed-on-the-leaderboard).

The root `skills.sh.json` groups published skills on the repository page. Update it whenever public skills are added, renamed, or removed, and run `make skills-config` to validate the configuration.

<!-- voidra-project-release:start -->
## Voidra Project release skills

These AGPL-3.0-or-later release copies come from [Voidra Project](https://github.com/Hussain7Abbas/voidra-project); develop changes there. Each skill contains its own runtime, matching references/templates and license. Shared template copies are in [templates/](templates/).

| Skill | Purpose |
| --- | --- |
| [voidra-architect-general](skills/voidra-architect-general/SKILL.md) | Run Discovery and propose plans or thin slices for Voidra actions using the general project profile. Stops for questions or plan approval; writes planning records and settled glossary terms without implementing or committing. |
| [voidra-go](skills/voidra-go/SKILL.md) | Run queued Voidra actions through Discovery, planning, implementation and verification in a local Git repository. Leave questions, exact plans, Research findings or committed results for human decisions. |
| [voidra-init](skills/voidra-init/SKILL.md) | Bring an existing codebase into Voidra with a source-linked inferred profile, a glossary draft and instruction pointers. Use when code exists but .voidra does not. Creates no commits and changes no source code. |
| [voidra-plan](skills/voidra-plan/SKILL.md) | Run only queued Voidra Discovery and planning stages, proposing questions, plans, slices or Research findings. Preserve source files, repository instructions, HEAD and tags; stop before implementation. |
| [voidra-release](skills/voidra-release/SKILL.md) | Start a local Voidra release from completed, unreleased actions, creating and queueing its Release action for Go planning and exact Review acceptance. Does not publish releases. |
| [voidra-sync](skills/voidra-sync/SKILL.md) | Catch Voidra planning up with commits made outside its tracked actions. Infer source-linked profile updates, protect confirmed answers, propose follow-up ideas or actions, and record the examined Git revision without editing code or committing. |

Install selected copies with `npx skills add Hussain7Abbas/voidra-skills --skill voidra-architect-general voidra-go voidra-init voidra-plan voidra-release voidra-sync`. For Codex, check the installed CLI's global destination against current agent documentation; the desktop installer owns exact local copies. A Git push does not promise immediate skills.sh indexing.
<!-- voidra-project-release:end -->
