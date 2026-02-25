import type { RawCommit } from './git.js';

export type CommitType =
  | 'feat' | 'fix' | 'docs' | 'refactor' | 'perf'
  | 'style' | 'test' | 'chore' | 'ci' | 'build' | 'other';

export interface ParsedCommit {
  hash: string;
  shortHash: string;
  subject: string;
  body: string;
  author: string;
  date: string;
  type: CommitType;
  scope?: string;
  description: string;
  breaking: boolean;
}

const KNOWN_TYPES: Set<string> = new Set([
  'feat', 'fix', 'docs', 'refactor', 'perf',
  'style', 'test', 'chore', 'ci', 'build',
]);

const CONVENTIONAL_RE = /^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)/;

export function parseCommit(raw: RawCommit): ParsedCommit {
  const match = raw.subject.match(CONVENTIONAL_RE);

  let type: CommitType = 'other';
  let scope: string | undefined;
  let description = raw.subject;
  let breaking = false;

  if (match) {
    const [, rawType, rawScope, bangMark, desc] = match;
    if (KNOWN_TYPES.has(rawType)) {
      type = rawType as CommitType;
    }
    scope = rawScope || undefined;
    description = desc;
    breaking = bangMark === '!';
  }

  if (!breaking && raw.body.includes('BREAKING CHANGE:')) {
    breaking = true;
  }

  return {
    hash: raw.hash,
    shortHash: raw.shortHash,
    subject: raw.subject,
    body: raw.body,
    author: raw.author,
    date: raw.date,
    type,
    scope,
    description,
    breaking,
  };
}

export function parseCommits(raws: RawCommit[]): ParsedCommit[] {
  return raws.map(parseCommit);
}

export interface GroupedCommits {
  feat: ParsedCommit[];
  fix: ParsedCommit[];
  docs: ParsedCommit[];
  refactor: ParsedCommit[];
  perf: ParsedCommit[];
  other: ParsedCommit[];
  breaking: ParsedCommit[];
}

export function groupByType(commits: ParsedCommit[]): GroupedCommits {
  const groups: GroupedCommits = {
    feat: [],
    fix: [],
    docs: [],
    refactor: [],
    perf: [],
    other: [],
    breaking: [],
  };

  for (const c of commits) {
    if (c.breaking) {
      groups.breaking.push(c);
    }

    if (c.type === 'feat') groups.feat.push(c);
    else if (c.type === 'fix') groups.fix.push(c);
    else if (c.type === 'docs') groups.docs.push(c);
    else if (c.type === 'refactor') groups.refactor.push(c);
    else if (c.type === 'perf') groups.perf.push(c);
    else groups.other.push(c);
  }

  return groups;
}
