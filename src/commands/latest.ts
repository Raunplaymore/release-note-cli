import pc from 'picocolors';
import { isGitRepo, getLatestTag } from '../lib/git.js';
import { cmdGen } from './gen.js';

interface LatestOptions {
  output?: 'markdown' | 'text';
  append?: boolean;
}

export function cmdLatest(options: LatestOptions): void {
  const cwd = process.cwd();

  if (!isGitRepo(cwd)) {
    console.error(pc.red('Error: Not a git repository.'));
    process.exit(1);
  }

  const tag = getLatestTag(cwd);
  if (!tag) {
    console.error(pc.red('Error: No tags found.'));
    console.error(pc.dim('Hint: Use "notes gen <commit-hash> HEAD" instead.'));
    process.exit(1);
  }

  console.error(pc.dim(`Latest tag: ${tag}`));
  cmdGen(tag, undefined, options);
}
