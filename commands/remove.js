const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

const { handleError } = require('../lib/helpers');
const { getError } = require('../lib/error-codes');

const initialize = require('./init');

const remove = async () => {
  const spinner = ora('Retrieving tasks ...').start();

  // initialize synology connection
  const synology = await initialize();

  // get list of tasks
  const tasksResponse = await synology.tasks();
  const { tasks } = tasksResponse.data;
  const ids = tasks.map((task) => task.id);

  // no tasks found, terminate here
  if (ids.length === 0) {
    spinner.stop();
    console.log(chalk.green('No downloads tasks found'));
    process.exit();
  }

  // get tasks details
  const tasksInfo = await synology.tasksInfo(ids.join(','));

  // check for valid response
  if (tasksInfo.success === false) {
    spinner.stop();
    const errorMessage = getError(tasksInfo.error.code);
    handleError(errorMessage);
  }

  spinner.stop();

  const tasksDetails = tasksInfo.data.tasks;

  const choices = tasksDetails.map((task) => {
    const { status } = tasks.find((t) => t.id === task.id);

    return {
      name: `${task.title} - [${status.toUpperCase()}]`,
      value: task.id,
    };
  });

  const tasksToRemove = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'url',
      message: 'Select tasks to remove',
      choices,
    },
  ]);

  console.log(tasksToRemove);
};

module.exports = { remove };
