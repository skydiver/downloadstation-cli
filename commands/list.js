const Configstore = require('configstore');
const keytar = require('keytar');

const packageJson = require('../package.json');
const { login } = require('../lib/synology');

const list = async () => {
  const config = new Configstore(packageJson.name);
  const { url, username, token } = config.all;
  const password = await keytar.getPassword('downloadstation-cli', username);

  if (!token) {
    const sid = await login({ url, username, password });
    config.set('token', sid);
  }

  console.log(token);

  // console.log(info);
};

module.exports = { list };
