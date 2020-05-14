const request = require('request-promise');

module.exports = async (product, options) => {
    const { currency, proxy } = options;
    const variantArray = [];
    let webURL;
    
    if (typeof product == 'string'){
        if (product.includes('stockx.com/')) webURL = product.split('stockx.com/')[1].split('/')[0];
        else webURL = product;
    }
    else webURL = product.urlKey;

    const requestOptions = {
        uri: `https://stockx.com/api/products/${webURL}?includes=market&currency=${currency}`,
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
    const variants = body.Product.children;

    for (let key in variants){
        variantArray.push({
            size: variants[key].shoeSize,
            uuid: key,
            market: variants[key].market
        });
    };

    return {
        name: body["Product"].title,
        urlKey: body["Product"].urlKey,
        pid: body["Product"].styleId,
        uuid: body["Product"].uuid,
        variants: variantArray
    };
};