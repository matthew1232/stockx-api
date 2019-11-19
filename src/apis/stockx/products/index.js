
import Base from '../../base';
import { filterAndLimit, errors } from '../../../utils';

export default class Products extends Base {
  async search(query, options = {}) {
    const { limit, type } = options;
    const { headers, proxy, request } = this.context;

    let url = `https://stockx.com/api/browse?&_search=${query}`;

    if (type) {
      url += `&dataType=${type}`;
    }

    try {
      const res = await request(url, {
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
      return errors(error, 'search products');
    }
  }

  async details(product) {
    try {
      const { currency, headers, request } = this.context;
      const { pathname } = new URL(product, 'https://stockx.com');
      
      if (!pathname) {
        const err = new Error('Invalid product path!');
        err.status = 404;
        throw err;
      }
      
      let url = `https://stockx.com/api/products${pathname}?includes=market&currency=${currency}`;

      const res = await request(url, {
        headers,
        json: true,
        resolveWithFullResponse: true,
        simple: false,
      });

      const { statusCode, body } = res;
      if (!statusCode || (statusCode && statusCode !== 200)) {
        const err = new Error('Invalid response code!');
        err.status = statusCode || 404;
        throw err;
      }

      const { Product } = body;
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
      return errors(error, 'fetch product details');
    }
  }
};
