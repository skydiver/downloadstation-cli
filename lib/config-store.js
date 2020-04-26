const Configstore = require('configstore');
const keytar = require('keytar');

const packageJson = require('../package.json');

class ConfigStore {
  constructor() {
    this.config = new Configstore(packageJson.name);
  }

  /**
   * Return configuration
   */
  async getCredentials() {
    const { url, username, token } = this.config.all;

    if (!url || !username || !token) {
      return null;
    }

    const password = await keytar.getPassword(packageJson.name, username);

    if (password === null) {
      return null;
    }

    return { url, username, token, password };
  }

  async set(key, value) {
    this.config.set(key, value);
  }
}

module.exports = ConfigStore;
