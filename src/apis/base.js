import axios from 'axios';
import axiosCookieJarSupport from 'axios-cookiejar-support';

export default class Api {
    constructor({ currency, jar, baseURL, proxy }) {
        this.axios = axios.create({
            baseURL,
            headers,
            proxy,
        });
        this.currency = currency;
        this.proxy = proxy;

        this.bearer = null;

        // Monkey patch the jar support in..
        axiosCookieJarSupport(instance);
        instance.defaults.jar = jar;
    }
}