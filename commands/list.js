const Configstore = require('configstore');
const keytar = require('keytar');

const packageJson = require('../package.json');
const Synology = require('../lib/synology');

const list = async () => {
  const config = new Configstore(packageJson.name);
  const { url, username, token } = config.all;
  const password = await keytar.getPassword('downloadstation-cli', username);

  const synology = new Synology({ url, username, password });

  if (!token) {
    const sid = await synology.login();
    config.set('token', sid);
  }

  const tasks = await synology.tasks();

  console.log(tasks);
};

module.exports = { list };
