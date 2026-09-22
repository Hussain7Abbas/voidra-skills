# Publishing

skills.sh distributes skills from GitHub repositories. There is no separate registry upload step: users install a skill with the skills CLI, and its installation telemetry contributes to directory listings. See the [official FAQ](https://skills.sh/docs/faq) and [CLI reference](https://github.com/vercel-labs/skills#install-a-skill).

The root `skills.sh.json` controls grouping on the repository page. Keep its skill slugs synchronized with the folders under `skills/`. skills.sh reads configuration changes after a telemetry-enabled CLI installation and may cache the resulting page.

## First-time setup

The local repository must have an initial commit and a public GitHub remote with a published `main` branch. This checkout already has `origin` configured as `https://github.com/hussain7abbas/voidra-skills.git`. Review the files, then make the initial commit and push:

```sh
make setup
make check
git add .
git commit -m "Set up voidra-skills monorepo"
git push -u origin main
```

This initial push publishes the repository scaffold and its initial skills together. The single-skill target requires this baseline so it can distinguish later skill changes from unrelated repository changes. For a new checkout without a remote, add your public GitHub repository as `origin` first. The local scaffolding process does not commit or push these files.

## Publish one skill

On `main`, commit changes limited to the selected skill and preview the push:

```sh
git add skills/init
git commit -m "Update init skill"
make publish SKILL=init DRY_RUN=1
make publish SKILL=init
```

The target validates `init`, requires a clean working tree, fetches the destination branch, and checks every outgoing commit. All changed files in those commits must be under `skills/init/`. It then pushes the checked commit without tags or force. It never creates a commit or changes global skill installations.

If another skill or shared files such as the README, docs, or tooling changed in outgoing history, the target stops. Publish those repository-wide changes separately with an ordinary reviewed Git push, or reorganize the pending commits before retrying. A change followed by a revert is still outgoing history and is rejected. Branch protection rules still apply; use a pull request if direct pushes are prohibited.

Use `REMOTE=<name>` or `BRANCH=<name>` to select another configured destination. The local checkout must be on that branch, and the remote must use one matching fetch/push URL. A dry run fetches remote state but does not push. Local Git remotes are supported for testing; public distribution requires a GitHub remote. If the branch is already current, publishing reports that and prints the installation information when it recognizes GitHub.

## Install and discover

After the public GitHub push:

```sh
npx skills add hussain7abbas/voidra-skills --skill init
```

For a non-default branch, use its direct skill URL:

```sh
npx skills add https://github.com/hussain7abbas/voidra-skills/tree/BRANCH/skills/init --skill init
```

The publish target prints the concrete install command from the remote URL. It does not generate synthetic installs or promise immediate indexing. A corresponding [directory page](https://skills.sh/hussain7abbas/voidra-skills/init) may appear after real CLI installations with telemetry enabled.

[Back to documentation](intro.md)
