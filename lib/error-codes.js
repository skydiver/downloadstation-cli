const errorCodes = {
  100: 'Unknown error',
  101: 'Invalid parameter',
  102: 'The requested API does not exist',
  103: 'The requested method does not exist',
  104: 'The requested version does not support the functionality',
  105: 'The logged in session does not have permission',
  106: 'Session timeout',
  107: 'Session interrupted by duplicate login',
};

const getError = code => `Error ${code}: ${errorCodes[code]}`;

module.exports = { getError, errorCodes };
