import filterAndLimit from './filterAndLimit';
import { checkStatus, checkLoginStatus } from './errors';

const split = (input = '', delimiter) => input.split(delimiter);

const formatProxy = proxy => {
  try {
    const parts = split(proxy, ':');
    if (!parts || !parts.length) {
      return null;
    }

    const [host, port, username, password] = parts;

    if (username && password) {
      return `http://${username}:${password}@${host}:${port}`;
    }
    return `http://${host}:${port}`;
  } catch (e) {
    return null;
  }
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randomInclusive = set => set[getRandomInt(0, set.length - 1)];

const decodeHtmlEntity = str => {
  return str.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
};

const currencies = {
  AUD: 'AUD',
  CAD: 'CAD',
  EUR: 'EUR',
  GBP: 'GBP',
  USD: 'USD'
}

export { 
  formatProxy, 
  currencies, 
  filterAndLimit, 
  randomInclusive, 
  decodeHtmlEntity,
  checkLoginStatus,
  checkStatus
};
