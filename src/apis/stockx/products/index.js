
import Api from '../../base';
import { filterAndLimit } from '../../../utils';

export default class ProductsApi extends Api {
    async search(query, options = {}) {
        const { limit, type } = options;

        let url = `https://stockx.com/api/browse?&_search=${query}`;

        if (type) {
            url += `&dataType=${dataType}`;
        }

        try {
            const res = await this.axios({
                method: 'GET',
                url,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
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
            const err = new Error('Failed to complete search!');
            err.status = error.status || 404;
            throw err;
        }
    }

    async details(product) {
        try {
            const { pathname } = new URL(product, 'https://stockx.com');
            let url = `https://stockx.com/api/products/${pathname}?includes=market&currency=${this.currency}`;

            const res = await this.axios({
                method: 'GET',
                url,
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
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