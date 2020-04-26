const inquirer = require('inquirer');
const validator = require('validator');
const Configstore = require('configstore');
const keytar = require('keytar');

const packageJson = require('../package.json');

const isUrl = value => {
  const isValid = validator.isURL(value, {
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  });

  if (isValid) {
    return true;
  }

  return 'Invalid URL';
};

const isRequired = value => {
  if (value !== '') {
    return true;
  }
  return 'This value is required';
};

const setup = async () => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'url',
      message: 'Synology URL with port',
      validate: isUrl,
    },
    {
      type: 'input',
      name: 'username',
      message: 'Your Synology account',
      validate: isRequired,
    },
    {
      type: 'password',
      name: 'password',
      message: 'Your Synology password',
      validate: isRequired,
    },
  ]);

  const config = new Configstore(packageJson.name);
  config.set('url', answers.url);
  config.set('username', answers.username);

  keytar.setPassword('downloadstation-cli', answers.username, answers.password);
};

module.exports = { setup };
