
import Api from '../../base';
import { filterAndLimit } from '../../../utils';

export default class ProductsApi extends Api {
    async search(query, options = {}) {
        const { limit, type } = options;

        let url = `/browse?&_search=${query}`;

        if (type) {
            url += `&dataType=${dataType}`;
        }

        try {
            const res = await this._fetch({
                url,
                headers: {
                    'sec-fetch-mode': 'cors',
                    'accept-language': 'en-US,en;q=0.9',
                    'authorization': '',
                    'x-requested-with': 'XMLHttpRequest',
                    'appos': 'web',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                    'accept': '*/*',
                    'authority': 'stockx.com',
                    'sec-fetch-site': 'same-origin',
                    'appversion': '0.1'
                },
            });

            const { data: { Products } } = res;

            const products = filterAndLimit(Products, null, limit);

            return products.map(product => {
                const image = new URL(product.media.imageUrl, 'https://stockx.com').href;

                const { title, retailPrice, releaseDate, styleId, urlKey, market } = product;
                const { productUuid } = market;

                return { title, retailPrice, releaseDate, styleId, productUuid, image, urlKey, market };
            });

        } catch (error) {
            console.log(error);
            const err = new Error('Failed to complete search!');
            err.status = error.status || 404;
            throw err;
        }
    }

    async details(product) {
        try {
            const { pathname } = new URL(product, 'https://stockx.com');
            let url = `/products${pathname}?includes=market&currency=${this.currency}`;

            const res = await this._fetch({
                url,
                headers: {
                    'sec-fetch-mode': 'cors',
                    'accept-language': 'en-US,en;q=0.9',
                    'authorization': '',
                    'x-requested-with': 'XMLHttpRequest',
                    'appos': 'web',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                    'accept': '*/*',
                    'authority': 'stockx.com',
                    'sec-fetch-site': 'same-origin',
                    'appversion': '0.1'
                },
            });

            const { data: { Product } } = res;
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
            err.status = error.status || 404;
            throw err;
        }
    }
};