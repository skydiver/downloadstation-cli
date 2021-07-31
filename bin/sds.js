#!/usr/bin/env node

const cli = require('sywac');
const chalk = require('chalk');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify({ isGlobal: true });

const { list } = require('../commands/list');
const { create } = require('../commands/add');
const { setup } = require('../commands/config');

const name = 'Synology Download Station / CLI Manager';
const version = chalk.green(pkg.version);

cli.preface(`${name} ${version}`);

cli.usage({
  prefix: `${chalk.yellow('Usage:')}\n  $0`,
  commandPlaceholder: 'command',
  optionsPlaceholder: false,
});

cli.style({
  group: (str) => {
    const string = str === 'Commands:' ? 'Available commands:' : str;
    return chalk.yellow(string);
  },
  flags: (str) => chalk.green(str),
  hints: () => null,
});

cli.groupOrder(['Arguments:', 'Options:', 'Commands:', 'Required Options:']);

cli
  .help('-h, --help', {
    desc: 'Display this help message',
    implicitCommand: false,
  })
  .version('-v, --version', {
    desc: 'Display this application version',
    implicitCommand: false,
    version,
  });

cli
  .command('list', { desc: 'List your tasks', run: list })
  .command('add', { desc: 'Add new download task', run: create })
  .command('config', {
    desc: 'Setup your Synology Download Station',
    run: setup,
  });

cli.showHelpByDefault().outputSettings({ maxWidth: 150 });

module.exports = cli;

async function main() {
  await cli.parseAndExit();
}

if (require.main === module) main();
