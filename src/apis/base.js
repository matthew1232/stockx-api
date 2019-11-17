import fetch from 'node-fetch';
import defaults from 'fetch-defaults';

export default class Api {
  constructor({ currency, jar, baseURL, headers, proxy, name }) {

    const _fetch = require('fetch-cookie/node-fetch')(fetch, jar);
    this._fetch = defaults(_fetch, baseURL, {
      timeout: 10000, // can be overridden as necessary
      headers,
      proxy,
    });

    // TEMPORARY PATCH TO ALLOW ALL PROXY TRAFFIC!!!
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    this.currency = currency;
    this.jar = jar;
    this.headers = headers;
    this.proxy = proxy;
    this.name = name;

    this.bearer = null;
    this.isLoggedIn = false;
  }
}
