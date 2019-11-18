import filterAndLimit from './filterAndLimit';

const split = (input = '', delimiter) => input.split(delimiter);

const format = input => {
  try {
    const parts = split(input, ':');
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

const randomInclusive = set => set[getRandomInt(0, set.length)];

const currencies = {
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR',
}

export { format, split, currencies, filterAndLimit, randomInclusive };
