const util = require('util');
const request = util.promisify(require('postman-request'));
const { checkRes, parseJSON, writeBody } = require('../../utils');

module.exports = async (product, options) => {
    const { currency, proxy, userAgent, cookieJar } = options;
    const variantArray = [];
    let webURL;
    
    if (typeof product == 'string'){
        if (product.includes('stockx.com/')) webURL = product.split('stockx.com/')[1].split('/')[0];
        else webURL = product;
    }
    else webURL = product.objectID;

    const reqOptions = {
        url: `https://stockx.com/api/products/${webURL}?includes=market&currency=${currency}&country=US`,
        headers: {
            'user-agent': userAgent,
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1"
        },
        followAllRedirects: true,
        followRedirect: true,
        proxy,
        //jar: cookieJar
    };

    const res = await request(reqOptions);

    checkRes(res);

    const { body } = res;
    const shoeObj = parseJSON(body);

    const variants = shoeObj.Product.children;

    for (let key in variants){
        variantArray.push({
            size: variants[key].shoeSize,
            uuid: key,
            market: variants[key].market
        });
    };

    return {
        name: shoeObj.Product.shoe,
        image: shoeObj.Product.media.imageUrl,
        urlKey: shoeObj.Product.urlKey,
        pid: shoeObj.Product.styleId,
        uuid: shoeObj.Product.uuid,
        variants: variantArray
    };
};