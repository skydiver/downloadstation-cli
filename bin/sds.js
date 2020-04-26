#! /usr/bin/env node

const program = require('commander');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');

updateNotifier({ pkg }).notify({ isGlobal: true });

const { list } = require('../commands/list');
const { create } = require('../commands/add');
const { setup } = require('../commands/config');

program.version(pkg.version);

program
  .command('list')
  .description('List your tasks')
  .action(list);

program
  .command('add')
  .description('Add new download task')
  .action(create);

program
  .command('config')
  .description('Setup your Synology Download Station')
  .action(setup);

program.parse(process.argv);
