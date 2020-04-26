const fetch = require('node-fetch');
const querystring = require('querystring');

class Synology {
  constructor({ url, username, password }) {
    this.url = url;
    this.username = username;
    this.password = password;
    this.sid = null;
  }

  makeRequest = async (url, params) => {
    const qs = querystring.stringify(params);
    const request = await fetch(`${this.url}/webapi/${url}?${qs}`);
    const response = await request.json();
    return response;
  };

  login = async () => {
    const response = await this.makeRequest('/auth.cgi', {
      api: 'SYNO.API.Auth',
      version: 6,
      method: 'login',
      account: this.username,
      passwd: this.password,
      session: 'DownloadStation',
      format: 'sid',
    });

    const { sid } = response.data;
    this.sid = sid;

    return sid;
  };

  info = async () =>
    this.makeRequest('/DownloadStation/info.cgi', {
      api: 'SYNO.DownloadStation.Info',
      version: 1,
      method: 'getinfo',
      _sid: this.sid,
    });

  tasks = async () =>
    this.makeRequest('/DownloadStation/task.cgi', {
      api: 'SYNO.DownloadStation.Task',
      version: 1,
      method: 'list',
      _sid: this.sid,
    });
}

module.exports = Synology;
