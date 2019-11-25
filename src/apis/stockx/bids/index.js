import moment from 'moment';

import Base from '../../base';
import { randomInclusive, checkStatus } from '../../../utils';

export default class Bids extends Base {
  // TODO!
  async list(options = {}) {}

  async update(bid = {}, options = {}) {
    const { amount } = options;
    const { bearer, currency, headers, jar, proxy, request } = this.context;
    const expiresAt = moment().add(30, 'days').utc().format();
    const { chainId, skuUuid } = bid;

    if (!amount || !skuUuid || !chainId) {
      const error = new Error('Invalid amount product id, and/or ask id!');
      error.status = 404;
      error.body = '';
      throw error;
    }

    if (!bearer) {
      const error = new Error('Please login first!');
      error.status = 401;
      error.body = '';
      throw error;
    }

    const res = await request('https://stockx.com/api/portfolio?a=bid', {
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

    checkStatus(res);

    const body = JSON.parse(res.body);
    const { PortfolioItem } = body;

    return PortfolioItem;
  }

  async place(product, options = {}) {
    const { amount, size } = options;
    const { bearer, currency, headers, jar, proxy, request } = this.context;
    const expiresAt = moment().add(30, 'days').utc().format();

    if (!amount || !size || !product) {
      const error = new Error('Invalid product, amount, and/or size!');
      error.status = 404;
      error.body = '';
      throw error;
    }

    if (!bearer) {
      const error = new Error('Please login first!');
      error.status = 401;
      error.body = '';
      throw error;
    }

    const desiredSize = /random/i.test(size) ? randomInclusive(product.variants) : product.variants.find(v => v.size === size);

    if (!desiredSize || (desiredSize && !desiredSize.uuid)) {
      const error = new Error('Size not found!');
      error.status = 404;
      error.body = '';
      throw error;
    }

    const { uuid } = desiredSize;

    const res = await request('https://stockx.com/api/portfolio?a=bid', {
      headers: {
        ...headers,
        authorization: `Bearer ${bearer}`,
        'content-type': 'application/json'
      },
      jar,
      json: {
        PortfolioItem: {
          localAmount: amount,
          skuUuid: uuid,
          localCurrency: currency,
          expiresAt
        }
      },
      method: 'POST',
      proxy,
      resolveWithFullResponse: true,
      simple: false,
    });

    checkStatus(res);

    const body = JSON.parse(res.body);
    const { PortfolioItem } = body;

    return PortfolioItem;
  }

  // TODO!
  async remove(bid = {}) {
    const { chainId } = bid;
    const { bearer, headers, jar, proxy, request } = this.context;

    if (!chainId){
      const err = new Error("No bid ID found!");
      err.status = 404;
      throw err;
    };

    const URL = `https://stockx.com/api/portfolio/${chainId}`;

    const res = await request(URL, {
      headers: {
        ...headers,
        authorization: `Bearer ${bearer}`,
        'content-type': 'application/json'
      },
      method: 'DELETE',
      jar, 
      proxy,
      json: {
        "chain_id": chainId.toString(),
        "notes": "Customer Removed Bid"
      },
      simple: false,
      resolveWithFullResponse: true
    });

    checkStatus(res);
  
    const body = JSON.parse(res.body);
    const { PortfolioItem } = body;

    return PortfolioItem;
  }
}
