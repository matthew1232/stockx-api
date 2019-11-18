import moment from 'moment';

import Api from '../../base';
import { randomInclusive } from '../../../utils';

export default class AsksApi extends Api {
  constructor({ currency, jar, headers, proxy, bearer, isLoggedIn }) {
    super({ currency, jar, headers, proxy, bearer, isLoggedIn, name: 'Asks' });
  }

  // TODO!
  async list(options = {}) {}

  async update(ask = {}, options = {}) {
    const { amount } = options;
    const expiresAt = moment().add(30, 'days').utc().format();

    let chainId;
    let skuUuid;
    try {
      ({ chainId, skuUuid } = ask);

      if (!amount || !skuUuid || !chainId) {
        throw new Error('Invalid amount product id, and/or ask id!');
      }

      if (!this._bearer) {
        throw new Error('Please login first!');
      }

      const res = await this._request('https://stockx.com/api/portfolio?a=ask', {
        method: 'POST',
        headers: {
          'Host': 'stockx.com',
          'sec-fetch-mode': 'cors',
          'origin': 'https://stockx.com',
          'authorization': `Bearer ${this._bearer}`,
          'content-type': 'application/json',
          'appos': 'web',
          'x-requested-with': 'XMLHttpRequest',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
          'appversion': '0.1',
          'accept': '*/*',
          'sec-fetch-site': 'same-origin',
          'accept-language': 'en-US,en;q=0.9',
        },
        jar: this._jar,
        proxy: this.proxy,
        simple: false,
        resolveWithFullResponse: true,
        json: {
          PortfolioItem: {
            localAmount: amount,
            skuUuid,
            localCurrency: this.currency,
            expiresAt: expiresAt,
            chainId,
          },
        },
      });

      const { statusCode, body } = res;
      if (!statusCode || (statusCode && statusCode !== 200)) {
        const err = new Error('Invalid response code!');
        err.status = statusCode || 404;
        throw err;
      }

      ({ PortfolioItem: { chainId, skuUuid }} = body);
      return { chainId, skuUuid };
    } catch (error) {
      const err = new Error(`Unable to place ask: ${error.message}`);
      err.status = error.status || 404;
      throw err;
    }
  }

  async place(product, options = {}) {
    const { amount, size } = options;
    const expiresAt = moment().add(30, 'days').utc().format();

    try {
      if (!amount || !size || !product) {
        throw new Error('Invalid product, amount, and/or size!');
      }

      if (!this._bearer) {
        throw new Error('Please login first!');
      }

      const desiredSize = /random/i.test(size) ? randomInclusive(product.variants) : product.variants.find(v => v.size === size);

      if (!desiredSize || (desiredSize && !desiredSize.uuid)) {
        throw new Error('No size found!');
      }

      const { uuid } = desiredSize;

      const res = await this._request('https://stockx.com/api/portfolio?a=ask', {
        method: 'POST',
        headers: {
          'Host': 'stockx.com',
          'sec-fetch-mode': 'cors',
          'origin': 'https://stockx.com',
          'authorization': `Bearer ${this._bearer}`,
          'content-type': 'application/json',
          'appos': 'web',
          'x-requested-with': 'XMLHttpRequest',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
          'appversion': '0.1',
          'accept': '*/*',
          'sec-fetch-site': 'same-origin',
          'accept-language': 'en-US,en;q=0.9',
        },
        body: {
          PortfolioItem: {
            localAmount: amount,
            skuUuid: uuid,
            localCurrency: this.currency,
            expiresAt
          },
        },
      });

      const { statusCode, body } = res;
      if (!statusCode || (statusCode && statusCode !== 200)) {
        const err = new Error('Invalid response code!');
        err.status = statusCode || 404;
        throw err;
      }

      const { PortfolioItem: { chainId, skuUuid }} = body;
      return { chainId, skuUuid };
    } catch (error) {
      const err = new Error(`Unable to place ask: ${error.message}`);
      err.status = error.status || 404;
      throw err;
    }
  }

  // TODO!
  async remove(options = {}) {}
}
