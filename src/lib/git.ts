import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const COMMIT_DELIM = '---COMMIT_DELIM---';
const FIELD_DELIM = '---FIELD_DELIM---';

export interface RawCommit {
  hash: string;
  shortHash: string;
  subject: string;
  body: string;
  author: string;
  date: string;
}

function git(path: string, args: string): string | null {
  try {
    return execSync(`git ${args}`, {
      cwd: path,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
  } catch {
    return null;
  }
}

export function isGitRepo(path: string): boolean {
  return existsSync(join(path, '.git'));
}

export function getLatestTag(path: string): string | null {
  return git(path, 'describe --abbrev=0 --tags');
}

export function getCommitsBetween(path: string, from: string, to: string): RawCommit[] {
  const format = [
    '%H', '%h', '%s', '%b', '%an', '%cI',
  ].join(FIELD_DELIM);

  const raw = git(path, `log ${from}..${to} --format=${COMMIT_DELIM}${format}`);
  if (!raw) return [];

  return raw
    .split(COMMIT_DELIM)
    .filter(chunk => chunk.trim().length > 0)
    .map(chunk => {
      const fields = chunk.trim().split(FIELD_DELIM);
      return {
        hash: fields[0] || '',
        shortHash: fields[1] || '',
        subject: fields[2] || '',
        body: fields[3] || '',
        author: fields[4] || '',
        date: fields[5] || '',
      };
    });
}

export function isValidRef(path: string, ref: string): boolean {
  return git(path, `rev-parse --verify ${ref}`) !== null;
}
