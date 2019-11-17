import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';

export default class Api {
    constructor({ currency, jar, baseURL, headers, proxy }) {
        this._axios = axios.create({
            baseURL,
            headers,
            proxy,
        });
        this.currency = currency;
        this.proxy = proxy;

        this.bearer = null;
        this.isLoggedIn = false;

        // Monkey patch the jar support in..
        axiosCookieJarSupport(this._axios);
        this._axios.defaults.jar = jar;
    }
}