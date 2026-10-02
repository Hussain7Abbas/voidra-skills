# voidra-skills

A monorepo of agent skills, with each skill independently installable through the [skills CLI](https://github.com/vercel-labs/skills) and discoverable on [skills.sh](https://skills.sh).

## Skills

| Skill | Purpose |
| --- | --- |
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
