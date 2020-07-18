const got = require('got');

module.exports = async (product, options) => {
    const { currency, proxy, userAgent } = options;
    const variantArray = [];
    let webURL;
    
    if (typeof product == 'string'){
        if (product.includes('stockx.com/')) webURL = product.split('stockx.com/')[1].split('/')[0];
        else webURL = product;
    }
    else webURL = product.urlKey;

    const res = await got(`https://stockx.com/api/products/${webURL}?includes=market&currency=${currency}`, {
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
        image: body["Product"].media.imageUrl,
        urlKey: body["Product"].urlKey,
        pid: body["Product"].styleId,
        uuid: body["Product"].uuid,
        variants: variantArray
    };
};