const Table = require('cli-table');
const pretty = require('prettysize');

const ConfigStore = require('../lib/config-store');
const Synology = require('../lib/synology');

const list = async () => {
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

  // get list of tasks
  const tasksResponse = await synology.tasks();
  const { tasks } = tasksResponse.data;
  const ids = tasks.map(task => task.id);

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
