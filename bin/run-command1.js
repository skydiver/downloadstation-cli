const program = require('commander');
const pkg = require('../package.json');
const command1 = require('../commands/command1');
const helpers = require('../lib/helpers');

program
  .version(pkg.version);

program
  .command('print')
  .description('Just a console ouput message')
  .action(() => command1
    .print(helpers.extractName(pkg.name))
    .catch(helpers.handleError));

program
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}