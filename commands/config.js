const inquirer = require('inquirer');
const validator = require('validator');

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
  inquirer
    .prompt([
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
    ])
    .then(answers => {
      // Use user feedback for... whatever!!
    })
    .catch(error => {
      if (error.isTtyError) {
        // Prompt couldn't be rendered in the current environment
      } else {
        // Something else when wrong
      }
    });
};

module.exports = { setup };
