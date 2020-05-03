const Configstore = require('configstore');

const packageJson = require('../package.json');

class ConfigStore {
  constructor() {
    this.config = new Configstore(packageJson.name);
  }

  /**
   * Return configuration
   */
  async getCredentials() {
    const { url, username, password, token } = this.config.all;

    if (!url || !username || !password || !token) {
      return null;
    }

    return { url, username, password, token };
  }

  async set(key, value) {
    this.config.set(key, value);
  }
}

module.exports = ConfigStore;
