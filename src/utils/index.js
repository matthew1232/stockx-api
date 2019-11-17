import HttpsProxyAgent from 'https-proxy-agent';

import filterAndLimit from './filterAndLimit';

const split = (input = '', delimiter) => input.split(delimiter);

const format = input => {
    try {
        const parts = split(input, ':');

        if (!parts || !parts.length) {
            return null;
        }

        const { host, port, username, password } = parts;

        if (username && password) {
            return new HttpsProxyAgent(`http://${username}:${password}@${host}:${port}`);
        }
        return new HttpsProxyAgent(`http://${host}:${port}`);
    } catch (e) {
        return null;
    }
}

const currencies = {
    USD: 'USD',
    GBP: 'GBP',
    EUR: 'EUR',
}

export { format, split, currencies, filterAndLimit };
