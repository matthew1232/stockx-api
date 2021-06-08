const util = require('util');
const request = util.promisify(require('postman-request'));
const { checkRes, parseJSON } = require('../../utils');

module.exports = async (query, options = {}) => {
    const { limit, proxy, userAgent, cookieJar } = options;

    const res = await request({
        url: `https://www.stockx.com/api/browse?_search=${query}`, 
        headers: {
            'user-agent': userAgent,
            'sec-fetch-dest': 'none',
            'accept': '*/*',
            'sec-fetch-site': 'cross-site',
            'sec-fetch-mode': 'cors',
            'accept-language': 'en-US'
        }.
        proxy,
        //jar: cookieJar
    });

    checkRes(res);

    const { body } = res;
    const { Products } = parseJSON(body);
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