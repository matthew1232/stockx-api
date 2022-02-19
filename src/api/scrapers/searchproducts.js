const util = require('util');
const request = util.promisify(require('postman-request'));
const { checkRes, parseJSON } = require('../../utils');

module.exports = async (query, options = {}) => {
    const { limit, proxy, userAgent, cookieJar } = options;

    const res = await request({
        url: `https://www.stockx.com/api/browse?_search=${query}`,
        headers: {
            'user-agent': userAgent,
            'sec-fetch-dest': 'empty',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
            'accept': 'application/json',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'accept-encoding': '*',
            'authority': 'stockx.com',
            'x-requested-with': 'XMLHttpRequest',
            // 'referer': 'https://stockx.com/de-de/new-balance-test-run-30-salehe-bembury-finders-keepers',
            'app-platform': 'Iron',
            'sec-ch-ua-platform': '"macOS"',
            'app-version': '2022.02.13.03',
            'accept-language': 'en-US'
        },
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
