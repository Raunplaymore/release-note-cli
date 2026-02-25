#!/usr/bin/env node

import { Command } from 'commander';
import { cmdGen } from './commands/gen.js';
import { cmdLatest } from './commands/latest.js';

const program = new Command();

program
  .name('notes')
  .description('Generate release notes from git commit logs')
  .version('0.1.0', '-v, --version');

program
  .command('gen <from> [to]')
  .description('Generate release notes between two git refs (tags, commits, branches)')
  .option('-o, --output <format>', 'Output format: markdown or text', 'markdown')
  .option('-a, --append', 'Append to CHANGELOG.md')
  .action(cmdGen);

program
  .command('latest')
  .description('Generate notes from latest tag to HEAD')
  .option('-o, --output <format>', 'Output format: markdown or text', 'markdown')
  .option('-a, --append', 'Append to CHANGELOG.md')
  .action(cmdLatest);

program.parse();
