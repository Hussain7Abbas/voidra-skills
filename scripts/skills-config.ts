import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

interface Grouping {
  title?: unknown;
  description?: unknown;
  skills?: unknown;
}

interface SkillsConfig {
  $schema?: unknown;
  notGrouped?: unknown;
  groupings?: unknown;
}

export function validateSkillsConfig(root: string): void {
  const config = JSON.parse(readFileSync(join(root, 'skills.sh.json'), 'utf8')) as SkillsConfig;
  if (config.$schema !== 'https://skills.sh/schemas/skills.sh.schema.json') {
    throw new Error('skills.sh.json must declare the official skills.sh schema.');
  }
  if (config.notGrouped !== undefined && !['top', 'bottom'].includes(String(config.notGrouped))) {
    throw new Error('skills.sh.json notGrouped must be "top" or "bottom".');
  }
  if (!Array.isArray(config.groupings) || config.groupings.length === 0 || config.groupings.length > 50) {
    throw new Error('skills.sh.json must contain 1–50 groupings.');
  }
  const seen = new Set<string>();
  for (const rawGroup of config.groupings) {
    const group = rawGroup as Grouping;
    if (typeof group.title !== 'string' || !group.title.trim()) {
      throw new Error('Every skills.sh grouping needs a nonempty title.');
    }
    if (group.description !== undefined && typeof group.description !== 'string') {
      throw new Error(`${group.title}: description must be a string.`);
    }
    if (!Array.isArray(group.skills) || group.skills.length === 0 || group.skills.length > 500) {
      throw new Error(`${group.title}: skills must contain 1–500 slugs.`);
    }
    for (const value of group.skills) {
      if (typeof value !== 'string' || !value.trim()) throw new Error(`${group.title}: every skill slug must be a string.`);
      const slug = value.toLowerCase().replace(/[\s_]+/g, '-');
      if (seen.has(slug)) throw new Error(`${slug}: appears in more than one skills.sh grouping.`);
      if (!existsSync(join(root, 'skills', slug, 'SKILL.md'))) {
        throw new Error(`${slug}: grouped skill does not exist under skills/.`);
      }
      seen.add(slug);
    }
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    validateSkillsConfig(resolve(fileURLToPath(new URL('..', import.meta.url))));
    console.log('Valid: skills.sh.json');
  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
