import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { githubSource, publish, skillName, validateSkill } from '../scripts/skills.mjs';

const skill = '---\nname: init\ndescription: Initialize project guidance.\n---\n\nWrite project rules.\n';

function fixture(t) {
  const temporary = mkdtempSync(join(tmpdir(), 'voidra-skills-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  const root = join(temporary, 'repo');
  const remote = join(temporary, 'remote.git');
  mkdirSync(join(root, 'skills', 'init'), { recursive: true });
  writeFileSync(join(root, 'skills', 'init', 'SKILL.md'), skill);
  writeFileSync(join(root, 'README.md'), '# Fixture\n');
  const git = (...args) => execFileSync('git', args, {
    cwd: root,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null' },
  }).trim();
  git('init', '-b', 'main');
  git('config', 'user.name', 'Test');
  git('config', 'user.email', 'test@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  git('config', 'tag.gpgsign', 'false');
  git('init', '--bare', remote);
  git('remote', 'add', 'origin', remote);
  git('add', '.');
  git('commit', '-m', 'Initial repository');
  git('push', 'origin', 'main');
  const remoteHead = () => git('ls-remote', 'origin', 'refs/heads/main').split(/\s/)[0];
  const change = (path = 'skills/init/SKILL.md', contents = `${skill}\nKeep docs current.\n`) => {
    writeFileSync(join(root, path), contents);
    git('add', path);
    git('commit', '-m', `Update ${path}`);
  };
  return { root, git, remoteHead, change };
}

test('validates the imported skill and rejects malformed frontmatter', (t) => {
  const { root } = fixture(t);
  assert.equal(validateSkill(root, 'init').name, 'init');
  writeFileSync(join(root, 'skills/init/SKILL.md'), '---\nname: init\nname: duplicate\n---\nBody\n');
  assert.throws(() => validateSkill(root, 'init'), /unique/i);
});

test('rejects mismatched names, missing descriptions, and empty instructions', (t) => {
  const { root } = fixture(t);
  for (const [content, expected] of [
    [skill.replace('name: init', 'name: other'), /match directory/],
    [skill.replace('description: Initialize project guidance.', 'description: 42'), /description/],
    ['---\nname: init\ndescription: Valid\n---\n', /empty/],
  ]) {
    writeFileSync(join(root, 'skills/init/SKILL.md'), content);
    assert.throws(() => validateSkill(root, 'init'), expected);
  }
});

test('requires one safe skill name', () => {
  for (const name of ['', '../init', 'init other', '*', 'UPPER', 'x'.repeat(65)]) {
    assert.throws(() => skillName(name), /Select one skill/);
  }
});

test('recognizes GitHub HTTPS and SSH remotes', () => {
  for (const url of ['https://github.com/owner/repo.git', 'git@github.com:owner/repo.git', 'ssh://git@github.com/owner/repo.git']) {
    assert.equal(githubSource(url), 'owner/repo');
  }
  assert.equal(githubSource('/tmp/remote.git'), null);
});

test('publishes the selected skill and does not push tags', (t) => {
  const { root, git, remoteHead, change } = fixture(t);
  change();
  git('config', 'push.followTags', 'true');
  git('tag', '-a', 'unrelated-tag', '-m', 'Do not publish this tag');
  publish(root, { skill: 'init' });
  assert.equal(remoteHead(), git('rev-parse', 'HEAD'));
  assert.equal(git('ls-remote', '--tags', 'origin'), '');
});

test('dry run leaves the remote unchanged', (t) => {
  const { root, remoteHead, change } = fixture(t);
  const before = remoteHead();
  change();
  publish(root, { skill: 'init', dryRun: true });
  assert.equal(remoteHead(), before);
});

test('rejects unrelated outgoing skill changes', (t) => {
  const { root, remoteHead, change } = fixture(t);
  const before = remoteHead();
  mkdirSync(join(root, 'skills', 'other'));
  change('skills/other/SKILL.md', skill.replace('name: init', 'name: other'));
  change();
  assert.throws(() => publish(root, { skill: 'init' }), /outside skills\/init/);
  assert.equal(remoteHead(), before);
});

test('rejects unrelated changes even when reverted in a later commit', (t) => {
  const { root, remoteHead, change } = fixture(t);
  const before = remoteHead();
  const original = readFileSync(join(root, 'README.md'), 'utf8');
  change('README.md', '# Changed\n');
  change('README.md', original);
  change();
  assert.throws(() => publish(root, { skill: 'init' }), /README.md/);
  assert.equal(remoteHead(), before);
});

test('rejects uncommitted changes without staging them', (t) => {
  const { root, git, remoteHead } = fixture(t);
  const before = remoteHead();
  writeFileSync(join(root, 'skills/init/SKILL.md'), `${skill}\nUncommitted.\n`);
  const status = git('status', '--porcelain');
  assert.throws(() => publish(root, { skill: 'init' }), /Commit or stash/);
  assert.equal(git('status', '--porcelain'), status);
  assert.equal(remoteHead(), before);
});

test('refuses a missing destination branch and a wrong local branch', (t) => {
  const { root, git } = fixture(t);
  git('branch', '-m', 'new-branch');
  assert.throws(() => publish(root, { skill: 'init' }), /Switch to main/);
  assert.throws(() => publish(root, { skill: 'init', branch: 'new-branch' }), /first-time setup/);
});

test('refuses a branch behind the remote', (t) => {
  const { root, git, remoteHead, change } = fixture(t);
  const original = git('rev-parse', 'HEAD');
  change();
  git('push', 'origin', 'main');
  const before = remoteHead();
  git('reset', '--hard', original);
  assert.throws(() => publish(root, { skill: 'init' }), /behind or diverged/);
  assert.equal(remoteHead(), before);
});

test('refuses a different push destination', (t) => {
  const { root, git, change } = fixture(t);
  change();
  git('remote', 'set-url', '--push', 'origin', '/tmp/unexpected-destination.git');
  assert.throws(() => publish(root, { skill: 'init' }), /same single fetch and push URL/);
});
