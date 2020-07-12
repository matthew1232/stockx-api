const got = require('got');

module.exports = async (query, options = {}) => {
    const { limit, proxy, userAgent } = options;

    const res = await got(`https://stockx.com/api/browse?_search=${query}`, {
        headers: {
            'user-agent': userAgent,
            'sec-fetch-dest': 'none',
            'accept': '*/*',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'accept-language': 'en-US'
        },
        responseType: 'json',
        http2: true
    });

    const { body } = res;

    const { Products } = body;
    const target = limit !== undefined ? Products.slice(0, limit) : Products;
    const productArray = target.map(product => {
        const image = new URL(product.media.imageUrl, 'https://stockx.com').href;

        return {
            name: product.title,
            retail: product.retailPrice,
            releaseDate: product.releaseDate,
            pid: product.styleId,
            uuid: product.market.productUuid,
            image,
            urlKey: product.urlKey,
            market: product.market
        };
    });

    if (productArray == "") throw new Error("No products found!");
    else return productArray;
};