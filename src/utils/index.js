import HttpsProxyAgent from 'https-proxy-agent';

import filterAndLimit from './filterAndLimit';

const split = (input = '', delimiter) => input.split(delimiter);

const format = input => {
  try {
    const parts = split(input, ':');
    console.log(parts);
    if (!parts || !parts.length) {
      return null;
    }

    const [ host, port, username, password ] = parts;

    if (username && password) {
      return new HttpsProxyAgent(`http://${username}:${password}@${host}:${port}`);
    }
    return new HttpsProxyAgent(`http://${host}:${port}`);
  } catch (e) {
    return null;
  }
}

const getCookie = async (jar, name) => {
  const store = jar.Store || jar.store;

  if (!store) {
    return null;
  }

  let found = null;
  store.getAllCookies((_, cookies) => {
    for (let i = 0; i < cookies.length; i += 1) {
      const { key, value } = cookies[i];
      console.info(`${key}=${value};\n`)
      if (key.indexOf(name) > -1) {
        console.info(`found cookie with value: ${value}`);
        found = value;
        break;
      }
    }
  });
  return found;
}

const currencies = {
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
}

export { format, split, currencies, filterAndLimit, getCookie };
