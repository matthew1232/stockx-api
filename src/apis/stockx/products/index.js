
import Base from '../../base';
import { filterAndLimit, checkStatus } from '../../../utils';

export default class Products extends Base {
  async search(query, options = {}) {
    const { limit, type } = options;
    const { headers, proxy, request } = this.context;
    const url = `https://stockx.com/api/browse?&_search=${query}&dataType=product`;

    const res = await request(url, {
      headers,
      json: true,
      proxy,
      resolveWithFullResponse: true,
      simple: false,
    });
    
    checkStatus(res);

    const { Products } = res.body;
    const products = filterAndLimit(Products, null, limit);

    return products.map(product => {
      const image = new URL(product.media.imageUrl, 'https://stockx.com').href;

      const { title, retailPrice, releaseDate, styleId, urlKey, market } = product;
      const { productUuid } = market;

      return { title, retailPrice, releaseDate, styleId, productUuid, image, urlKey, market };
    });
  }

  async details(product) {
    const { currency, headers, request } = this.context;
    const productURL = typeof product == 'string' ? product : product.urlKey;
    const { pathname } = new URL(productURL, 'https://stockx.com');

    if (!pathname) {
      const err = new Error('Invalid product path!');
      err.status = 404;
      err.body = '';
      throw err;
    }

    const url = `https://stockx.com/api/products${pathname}?includes=market&currency=${currency}`;

    const res = await request(url, {
      headers,
      json: true,
      resolveWithFullResponse: true,
      simple: false,
    });

    checkStatus(res);
    
    const { body } = res;
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
  }
};
