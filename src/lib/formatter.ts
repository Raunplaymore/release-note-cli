import type { ParsedCommit, GroupedCommits } from './parser.js';

interface SectionDef {
  key: keyof GroupedCommits;
  mdTitle: string;
  textTitle: string;
}

const SECTIONS: SectionDef[] = [
  { key: 'breaking', mdTitle: 'Breaking Changes', textTitle: 'Breaking Changes' },
  { key: 'feat',     mdTitle: 'Features',         textTitle: 'Features' },
  { key: 'fix',      mdTitle: 'Bug Fixes',        textTitle: 'Bug Fixes' },
  { key: 'docs',     mdTitle: 'Documentation',    textTitle: 'Documentation' },
  { key: 'refactor', mdTitle: 'Refactoring',      textTitle: 'Refactoring' },
  { key: 'perf',     mdTitle: 'Performance',      textTitle: 'Performance' },
  { key: 'other',    mdTitle: 'Other Changes',    textTitle: 'Other Changes' },
];

function formatCommitLine(c: ParsedCommit, withScope: boolean): string {
  const scope = withScope && c.scope ? `**${c.scope}:** ` : '';
  return `${scope}${c.description} (${c.shortHash})`;
}

export function formatMarkdown(version: string, date: string, groups: GroupedCommits): string {
  const lines: string[] = [];
  lines.push(`## ${version} (${date})`);
  lines.push('');

  for (const section of SECTIONS) {
    const commits = groups[section.key];
    if (commits.length === 0) continue;

    lines.push(`### ${section.mdTitle}`);
    lines.push('');
    for (const c of commits) {
      lines.push(`- ${formatCommitLine(c, true)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

export function formatText(version: string, date: string, groups: GroupedCommits): string {
  const lines: string[] = [];
  lines.push(`${version} (${date})`);
  lines.push('');

  for (const section of SECTIONS) {
    const commits = groups[section.key];
    if (commits.length === 0) continue;

    lines.push(`${section.textTitle}:`);
    for (const c of commits) {
      lines.push(`  - ${formatCommitLine(c, true)}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
