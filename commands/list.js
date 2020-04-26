const Table = require('cli-table');
const chalk = require('chalk');
const pretty = require('prettysize');

const initialize = require('./init');

const list = async () => {
  // initialize synology connection
  const synology = await initialize();

  // get list of tasks
  const tasksResponse = await synology.tasks();
  const { tasks } = tasksResponse.data;
  const ids = tasks.map(task => task.id);

  if (ids.length === 0) {
    console.log(chalk.green('No downloads tasks found'));
    process.exit();
  }

  // get tasks details
  const tasksInfo = await synology.tasksInfo(ids.join(','));
  const tasksDetails = tasksInfo.data.tasks;

  const width = process.stdout.columns - 67;

  // build output table
  const table = new Table({
    style: { head: ['green'] },
    colWidths: [width, 12, 12, 12, 12, 12],
    head: [
      'File name',
      'File size',
      'Downloaded',
      'Progress',
      'Status',
      'Type',
    ],
  });

  tasksDetails.forEach(task => {
    const { status } = tasks.find(t => t.id === task.id);
    const size = pretty(task.size, { places: 2 });
    const { size_downloaded } = task.additional.transfer;
    const downloaded = pretty(size_downloaded, { places: 2 });

    const progress = `${((size_downloaded * 100) / task.size).toFixed(1)}%`;

    table.push([task.title, size, downloaded, progress, status, task.type]);
  });

  console.log(table.toString());
};

module.exports = { list };
