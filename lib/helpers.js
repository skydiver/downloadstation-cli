const packageJson = require('../package.json');

const getCommandName = () => Object.keys(packageJson.bin)[0];

module.exports = {
  getCommandName,
};
