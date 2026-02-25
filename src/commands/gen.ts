import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import pc from 'picocolors';
import { isGitRepo, isValidRef, getCommitsBetween } from '../lib/git.js';
import { parseCommits, groupByType } from '../lib/parser.js';
import { formatMarkdown, formatText } from '../lib/formatter.js';

interface GenOptions {
  output?: 'markdown' | 'text';
  append?: boolean;
}

export function cmdGen(from: string, to: string | undefined, options: GenOptions): void {
  const cwd = process.cwd();

  if (!isGitRepo(cwd)) {
    console.error(pc.red('Error: Not a git repository.'));
    process.exit(1);
  }

  if (!isValidRef(cwd, from)) {
    console.error(pc.red(`Error: Invalid ref "${from}". Check the tag or commit exists.`));
    process.exit(1);
  }

  const toRef = to || 'HEAD';
  if (to && !isValidRef(cwd, to)) {
    console.error(pc.red(`Error: Invalid ref "${to}". Check the tag or commit exists.`));
    process.exit(1);
  }

  const rawCommits = getCommitsBetween(cwd, from, toRef);

  if (rawCommits.length === 0) {
    console.log(pc.yellow('No commits found in the specified range.'));
    return;
  }

  const parsed = parseCommits(rawCommits);
  const grouped = groupByType(parsed);

  // Determine version label
  const versionLabel = to || 'Unreleased';
  const dateStr = new Date().toISOString().slice(0, 10);

  const format = options.output || 'markdown';
  const output = format === 'text'
    ? formatText(versionLabel, dateStr, grouped)
    : formatMarkdown(versionLabel, dateStr, grouped);

  if (options.append) {
    appendToChangelog(cwd, output);
    console.log(pc.green(`✓ Appended to CHANGELOG.md (${parsed.length} commits)`));
  } else {
    console.log(output);
  }

  // Summary
  const summary = [
    grouped.feat.length && `${grouped.feat.length} features`,
    grouped.fix.length && `${grouped.fix.length} fixes`,
    grouped.breaking.length && `${grouped.breaking.length} breaking`,
  ].filter(Boolean).join(', ');

  console.error(pc.dim(`${parsed.length} commits processed${summary ? ': ' + summary : ''}`));
}

function appendToChangelog(cwd: string, content: string): void {
  const changelogPath = join(cwd, 'CHANGELOG.md');

  if (!existsSync(changelogPath)) {
    writeFileSync(changelogPath, `# Changelog\n\n${content}`, 'utf-8');
    return;
  }

  const existing = readFileSync(changelogPath, 'utf-8');
  const insertIndex = existing.indexOf('\n## ');

  if (insertIndex === -1) {
    // No existing version headers, append at end
    writeFileSync(changelogPath, existing.trimEnd() + '\n\n' + content, 'utf-8');
  } else {
    // Insert before the first ## header (after the newline)
    const before = existing.slice(0, insertIndex + 1);
    const after = existing.slice(insertIndex + 1);
    writeFileSync(changelogPath, before + content + after, 'utf-8');
  }
}
