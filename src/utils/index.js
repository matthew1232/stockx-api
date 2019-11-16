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
            return {
                host,
                port,
                auth: {
                    username,
                    password,
                },
            };
        }

        return { host, port };
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