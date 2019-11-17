import fetch from 'node-fetch';
import defaults from 'fetch-defaults';

export default class Api {
    constructor({ currency, jar, baseURL, headers, proxy }) {

        const _fetch = require('fetch-cookie')(fetch, jar);
        this._fetch = defaults(_fetch, baseURL, {
            timeout: 10000, // can be overridden as necessary
            headers,
            proxy,
        });

        this.currency = currency;
        this.proxy = proxy;

        this.bearer = null;
        this.isLoggedIn = false;
    }
}
