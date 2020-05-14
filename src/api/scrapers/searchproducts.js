const request = require('request-promise');

module.exports = async (query, options = {}) => {
    const { limit, dataType, proxy } = options;
    const uri = dataType == undefined ? `https://stockx.com/api/browse?&_search=${query}` : `https://stockx.com/api/browse?&_search=${query}&dataType=${dataType}`;

    const requestOptions = {
        uri: uri,
        headers: {
            'sec-fetch-mode': 'cors',
            'accept-language': 'en-US,en;q=0.9',
            'authorization': '',
            'x-requested-with': 'XMLHttpRequest',
            'appos': 'web',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
            'accept': '*/*',
            'authority': 'stockx.com',
            'sec-fetch-site': 'same-origin',
            'appversion': '0.1'
        },
        simple: false,
        resolveWithFullResponse: true,
        proxy: proxy
    };

    const res = await request(requestOptions);
    const body = JSON.parse(res.body);

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