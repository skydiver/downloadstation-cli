const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');

const initialize = require('./init');
const { isUrl } = require('../lib/validation');

const create = async () => {
  // initialize synology connection
  const synology = await initialize();

  // get download url
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Download URL',
      validate: isUrl,
    },
  ]);

  const spinner = ora('Adding new task ...').start();

  // create new task
  const task = await synology.create(answers.url);

  spinner.stop();

  if (task.success === true) {
    console.log(chalk.green('Download task successfully created'));
  } else {
    console.log(
      chalk.white.bgRed('There was a problem while trying to create the task')
    );
  }
};

module.exports = { create };
