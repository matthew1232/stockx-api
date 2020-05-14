const request = require('request-promise');
const moment = require('moment');

module.exports = (bearer, options) => new Promise(async (resolve, reject) => {
    const { amount, variantID, bidID, currency, cookieJar, proxy } = options;

    const expiresAt = moment().add(30, 'days').utc().format();
    const res = await request({
        uri: 'https://stockx.com/api/portfolio?a=bid',
        method: 'POST',
        headers: {
            'Host': 'stockx.com',
            'sec-fetch-mode': 'cors',
            'origin': 'https://stockx.com',
            'authorization': `Bearer ${bearer}`,
            'content-type': 'application/json',
            'appos': 'web',
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36',
            'appversion': '0.1',
            'accept': '*/*',
            'sec-fetch-site': 'same-origin',
            'accept-language': 'en-US,en;q=0.9',
        },
        json: {
            PortfolioItem: {
                localAmount: amount,
                skuUuid: variantID,
                localCurrency: currency,
                expiresAt: expiresAt,
                chainId: bidID
            }
        },
        jar: cookieJar,
        simple: false,
        resolveWithFullResponse: true,
        proxy: proxy
    })
    .catch(err => reject(err));

    if (res.statusCode != 200) return reject(new Error(`Status code error: ${res.statusCode} - Response: ${res.body}`))
    
    resolve({
        id: res.body.PortfolioItem.chainId,
        response: res.body
    });
});