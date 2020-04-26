const inquirer = require('inquirer');
const chalk = require('chalk');

const ConfigStore = require('../lib/config-store');
const Synology = require('../lib/synology');
const { isUrl } = require('../lib/validation');

const create = async () => {
  const configStore = new ConfigStore();
  const { url, username, token, password } = await configStore.getAll();

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

  // get download url
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Download URL',
      validate: isUrl,
    },
  ]);

  // create new task
  const task = await synology.create(answers.url);

  if (task.success === true) {
    console.log(chalk.green('Download task successfully created'));
  } else {
    console.log(
      chalk.white.bgRed('There was a problem while trying to create the task')
    );
  }
};

module.exports = { create };
