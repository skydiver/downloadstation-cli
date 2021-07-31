const validator = require('validator');

const isUrl = (value) => {
  const isValid = validator.isURL(value, {
    require_protocol: true,
    require_valid_protocol: true,
    protocols: ['http', 'https'],
  });

  const isMagnet = value.startsWith('magnet:');

  if (isValid || isMagnet) {
    return true;
  }

  return 'Invalid URL';
};

const isRequired = (value) => {
  if (value !== '') {
    return true;
  }
  return 'This value is required';
};

module.exports = { isUrl, isRequired };
