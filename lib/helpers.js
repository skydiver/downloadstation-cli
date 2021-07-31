const chalk = require('chalk');

const packageJson = require('../package.json');

const getCommandName = () => Object.keys(packageJson.bin)[0];

const handleError = (message) => {
  console.error(chalk.white.bgRed(message));
  process.exit(1);
};

module.exports = {
  getCommandName,
  handleError,
};
