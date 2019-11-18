import moment from 'moment';

import Api from '../../base';
import { randomInclusive } from '../../../utils';

export default class BidsApi extends Api {
  // TODO!
  async list(options = {}) {}

  async update(bid = {}, options = {}) {
    const { amount } = options;
    const { headers, bearer, jar, proxy, currency } = this.data;
    const expiresAt = moment().add(30, 'days').utc().format();

    let chainId;
    let skuUuid;
    try {
      ({ chainId, skuUuid } = bid);
      if (!amount || !skuUuid || !chainId) {
        const error = new Error('Invalid amount product id, and/or ask id!');
        error.status = 404;
        throw error;
      }

      if (!bearer) {
        const error = new Error('Please login first!');
        error.status = 401;
        throw error;
      }

      const res = await this._request('https://stockx.com/api/portfolio?a=bid', {
        headers: {
          ...headers,
          authorization: `Bearer ${bearer}`,
          'content-type': 'application/json',
        },
        jar,
        json: {
          PortfolioItem: {
            localAmount: amount,
            skuUuid,
            localCurrency: currency,
            expiresAt,
            chainId,
          },
        },
        method: 'POST',
        proxy,
        resolveWithFullResponse: true,
        simple: false,
      });

      const { statusCode, body } = res;
      if (!statusCode || (statusCode && statusCode !== 200)) {
        const err = new Error('Invalid status code!');
        err.status = statusCode || 404;
        throw err;
      }

      ({ PortfolioItem: { chainId, skuUuid }} = body);
      return { chainId, skuUuid };
    } catch (error) {
      const err = new Error(`Unable to update bid: ${error.message}`);
      err.stack = error.stack || {};
      err.status = error.status || 404;
      throw err;
    }
  }

  async place(product, options = {}) {
    const { amount, size } = options;
    const { headers, bearer, currency } = this.data;
    const expiresAt = moment().add(30, 'days').utc().format();

    try {
      if (!amount || !size || !product) {
        const error = new Error('Invalid product, amount, and/or size!');
        error.status = 404;
        throw error;
      }

      if (!bearer) {
        const error = new Error('Please login first!');
        error.status = 401;
        throw error;
      }

      const desiredSize = /random/i.test(size) ? randomInclusive(product.variants) : product.variants.find(v => v.size === size);

      if (!desiredSize || (desiredSize && !desiredSize.uuid)) {
        throw new Error('No size found!');
      }

      const { uuid } = desiredSize;

      const res = await this._request('https://stockx.com/api/portfolio?a=bid', {
        headers: {
          ...headers,
          authorization: `Bearer ${bearer}`,
          'content-type': 'application/json',
        },
        json: {
          PortfolioItem: {
            localAmount: amount,
            skuUuid: uuid,
            localCurrency: currency,
            expiresAt,
          },
        },
        method: 'POST',
      });

      const { statusCode, body } = res;
      if (!statusCode || (statusCode && statusCode !== 200)) {
        const err = new Error('Invalid response code!');
        if (statusCode === 400) {
          err.message = 'Account on hold!';
        }

        err.status = statusCode || 404;
        throw err;
      }

      const { PortfolioItem: { chainId, skuUuid } } = body;
      return { chainId, skuUuid };
    } catch (error) {
      const err = new Error(`Unable to place bid: ${error.message}`);
      err.stack = error.stack || {};
      err.status = error.status || 404;
      throw err;
    }
  }

  // TODO!
  async remove(options = {}) {}
}
