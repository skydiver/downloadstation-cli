const chalk = require('chalk');

const ConfigStore = require('../lib/config-store');
const Synology = require('../lib/synology');
const { getCommandName } = require('../lib/helpers');

const initialize = async () => {
  const configStore = new ConfigStore();
  const credentials = await configStore.getCredentials();

  if (!credentials) {
    const command = chalk.underline.bold(`${getCommandName()} config`);
    const message = `Configuration missing. Run ${command} and try again.`;
    console.log(chalk.white.bgRed(message));
    process.exit();
  }

  const { url, username, token, password } = credentials;

  const synology = new Synology({ url, username, password, sid: token });

  if (!token) {
    const sid = await synology.login();
    configStore.set('token', sid);
  }

  // check credentials
  const info = await synology.info();

  // wrong credentials? login again
  if (info.success !== true) {
    const sid = await synology.login();
    configStore.set('token', sid);
  }

  return synology;
};

module.exports = initialize;
