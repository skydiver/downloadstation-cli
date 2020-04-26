const ConfigStore = require('../lib/config-store');
const Synology = require('../lib/synology');

const list = async () => {
  const configStore = new ConfigStore();
  const { url, username, token, password } = await configStore.getAll();

  const synology = new Synology({ url, username, password });

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

  const tasks = await synology.tasks();

  console.log(tasks);
};

module.exports = { list };
