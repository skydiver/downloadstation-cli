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
      name: 'remove',
      message: 'Select tasks to remove',
      choices,
    },
  ]);

  // check for something to remove
  if (tasksToRemove.remove.length === 0) {
    console.log(chalk.green('Nothing to remove'));
    process.exit();
  }

  // get a list of ids to remove
  const idsToRemove = tasksToRemove.remove.join(',');

  const spinnerRemove = ora('Removing tasks ...').start();

  // remove tasks
  const removed = await synology.delete(idsToRemove);

  spinnerRemove.stop();

  // display exit message
  if (removed.success === true) {
    console.log(chalk.green('Selected task(s) successfully removed'));
  } else {
    console.log(
      chalk.white.bgRed('There was a problem while trying to create the task')
    );
  }
};

module.exports = { remove };
