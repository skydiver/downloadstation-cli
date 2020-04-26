const Configstore = require('configstore');
const keytar = require('keytar');

const packageJson = require('../package.json');

class ConfigStore {
  constructor() {
    this.config = new Configstore(packageJson.name);
  }

  async getAll() {
    const { url, username, token } = this.config.all;
    const password = await keytar.getPassword('downloadstation-cli', username);
    return { url, username, token, password };
  }

  async set(key, value) {
    this.config.set(key, value);
  }
}

module.exports = ConfigStore;
