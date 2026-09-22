import { spawnSync } from 'node:child_process';
import { lstatSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseDocument } from 'yaml';

const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function skillName(value) {
  if (!value || value.length > 64 || !namePattern.test(value)) {
    throw new Error('Select one skill by directory name, for example: make publish SKILL=init');
  }
  return value;
}

export function validateSkill(root, name) {
  skillName(name);
  const directory = join(root, 'skills', name);
  if (!lstatSync(directory).isDirectory()) {
    throw new Error(`skills/${name} must be a real directory.`);
  }
  const content = readFileSync(join(directory, 'SKILL.md'), 'utf8');
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`skills/${name}/SKILL.md needs YAML frontmatter.`);
  const document = parseDocument(match[1], { uniqueKeys: true });
  if (document.errors.length) throw new Error(document.errors.map((error) => error.message).join('\n'));
  const data = document.toJS();
  if (!data || data.name !== name) throw new Error(`Frontmatter name must match directory: ${name}`);
  if (typeof data.description !== 'string' || !data.description.trim() || data.description.length > 1024) {
    throw new Error(`${name}: description must contain 1–1024 characters.`);
  }
  if (!match[2].trim()) throw new Error(`${name}: instructions cannot be empty.`);
  if (data.metadata?.internal === true || data.metadata?.internal === 'true') {
    throw new Error(`${name}: metadata.internal hides the skill from normal skills.sh discovery.`);
  }
  return data;
}

export function listSkills(root) {
  return readdirSync(join(root, 'skills'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name)
    .sort();
}

function git(root, args, options = {}) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || `git ${args[0]} failed.`);
  }
  return result.stdout?.trimEnd() ?? '';
}

function splitPaths(output) {
  return output.split('\0').filter(Boolean);
}

export function githubSource(url) {
  const match = url.match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w.-]+\/[\w.-]+?)\/?$/);
  return match?.[1].replace(/\.git$/, '') ?? null;
}

export function publish(root, { skill, remote = 'origin', branch = 'main', dryRun = false }) {
  skillName(skill);
  validateSkill(root, skill);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(remote)) throw new Error('REMOTE must be a Git remote name.');
  git(root, ['check-ref-format', `refs/heads/${branch}`]);
  const currentBranch = git(root, ['symbolic-ref', '--short', 'HEAD']);
  if (currentBranch !== branch) throw new Error(`Switch to ${branch} before publishing.`);
  if (git(root, ['status', '--porcelain', '--untracked-files=all'])) {
    throw new Error('Commit or stash working-tree changes before publishing. No files were staged or committed.');
  }
  const head = git(root, ['rev-parse', 'HEAD']);
  const fetchUrl = git(root, ['remote', 'get-url', remote]);
  const pushUrls = git(root, ['remote', 'get-url', '--push', '--all', remote]).split('\n');
  if (pushUrls.length !== 1 || pushUrls[0] !== fetchUrl) {
    throw new Error('Publishing requires the same single fetch and push URL.');
  }
  const remoteRef = `refs/heads/${branch}`;
  const remoteHead = git(root, ['ls-remote', '--heads', remote, remoteRef]).split(/\s/)[0];
  if (!remoteHead) {
    throw new Error(`Remote branch ${branch} is missing. Complete the first-time setup in docs/publishing.md.`);
  }
  // Fetch the exact destination rather than trusting a potentially stale tracking ref.
  git(root, ['fetch', '--quiet', '--no-tags', remote, remoteRef]);
  const base = git(root, ['rev-parse', 'FETCH_HEAD']);
  try {
    git(root, ['merge-base', '--is-ancestor', base, head]);
  } catch {
    throw new Error(`Local ${branch} is behind or diverged. Fetch and reconcile it before publishing.`);
  }
  // Inspect every outgoing commit: reverted unrelated changes also travel in Git history.
  const commits = git(root, ['rev-list', `${base}..${head}`]).split('\n').filter(Boolean);
  const paths = new Set(commits.flatMap((commit) => splitPaths(git(root, [
    'diff-tree', '--root', '--no-commit-id', '--name-only', '--no-renames', '-r', '-m', '-z', commit,
  ]))));
  const outside = [...paths].filter((path) => !path.startsWith(`skills/${skill}/`));
  if (outside.length) {
    throw new Error(`Outgoing commits include files outside skills/${skill}/:\n${outside.join('\n')}\nPublish repository-wide changes separately; this target only releases one skill.`);
  }
  const source = githubSource(fetchUrl);
  if (commits.length === 0) {
    console.log(`${skill} is already up to date on ${remote}/${branch}.`);
  } else if (dryRun) {
    console.log(`Would push ${commits.length} commit(s) for skills/${skill}/ to ${remote}/${branch}.`);
  } else {
    // Push the checked commit explicitly. Never force-push or include tags.
    git(root, ['-c', 'push.followTags=false', 'push', remote, `${head}:${remoteRef}`], { stdio: 'inherit' });
    console.log(`Published ${skill} to ${remote}/${branch}.`);
  }
  if (source) {
    console.log(`Install: npx skills add https://github.com/${source}/tree/${branch}/skills/${skill} --skill ${skill}`);
    console.log(`Directory: https://skills.sh/${source}/${skill} (listing follows CLI installs; it may not exist yet)`);
  } else {
    console.log('skills.sh discovery requires a public GitHub repository; this remote is not a GitHub URL.');
  }
}

export function main(root, command, env = process.env) {
  if (command === 'publish') {
    if (env.DRY_RUN && !['0', '1'].includes(env.DRY_RUN)) throw new Error('DRY_RUN must be 0 or 1.');
    publish(root, { skill: env.SKILL, remote: env.REMOTE || 'origin', branch: env.BRANCH || 'main', dryRun: env.DRY_RUN === '1' });
    return;
  }
  if (!['list', 'validate'].includes(command)) throw new Error('Usage: node scripts/skills.mjs list|validate|publish');
  const names = env.SKILL ? [skillName(env.SKILL)] : listSkills(root);
  if (!names.length) throw new Error('No skills found in skills/.');
  for (const name of names) {
    const data = validateSkill(root, name);
    console.log(command === 'list' ? `${name}\t${data.description}` : `Valid: skills/${name}`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main(resolve(fileURLToPath(new URL('..', import.meta.url))), process.argv[2]);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
