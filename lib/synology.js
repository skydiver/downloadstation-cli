const fetch = require('node-fetch');
const querystring = require('querystring');

const makeRequest = async (url, params) => {
  const qs = querystring.stringify(params);
  const request = await fetch(`${url}?${qs}`);
  const response = await request.json();
  return response.data.sid;
};

const login = async ({ url, username, password }) =>
  makeRequest(`${url}webapi/auth.cgi`, {
    api: 'SYNO.API.Auth',
    version: '6',
    method: 'login',
    account: username,
    passwd: password,
    session: 'DownloadStation',
    format: 'sid',
  });

module.exports = { login };
