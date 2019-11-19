
import Api from '../../base';
import { filterAndLimit } from '../../../utils';

export default class ProductsApi extends Api {
  async search(query, options = {}) {
    const { limit, type } = options;
    const { proxy, headers } = this.data;
    const url = 'https://stockx.com/api/browse?&_search=${query}?dataType=product';

    try {
      const res = await this._request(url, {
        headers,
        json: true,
        proxy,
        resolveWithFullResponse: true,
        simple: false,
      });

      const { Products } = res.body;
      const products = filterAndLimit(Products, null, limit);

      return products.map(product => {
        const image = new URL(product.media.imageUrl, 'https://stockx.com').href;

        const { title, retailPrice, releaseDate, styleId, urlKey, market } = product;
        const { productUuid } = market;

        return { title, retailPrice, releaseDate, styleId, productUuid, image, urlKey, market };
      });
    } catch (error) {
      const err = new Error('Failed to complete search!');
      err.stack = error.stack || {};
      err.status = error.status || 404;
      err.body = error.body || '';
      throw err;
    }
  }

  async details(product) {
    try {
      const productURL = typeof product == 'string' ? product : product.urlKey;
      const { currency, headers } = this.data;
      const { pathname } = new URL(productURL, 'https://stockx.com');
      const url = `https://stockx.com/api/products${pathname}?includes=market&currency=${currency}`;
      
      const res = await this._request(url, {
        headers,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
      });

      const { Product } = res.body;
      const { children, title, urlKey, styleId, uuid } = Product;

      const variants = [];
      Object.values(children).map(p => {
        const { shoeSize: size, uuid, market } = p;
        variants.push({ size, uuid, market });
      });

      return {
        title,
        urlKey,
        styleId,
        uuid,
        variants,
      };

    } catch (error) {
      const err = new Error('Failed to fetch product details!');
      err.stack = error.stack || {};
      err.status = error.status || 404;
      err.body = error.body || '';
      throw err;
    }
  }
};
