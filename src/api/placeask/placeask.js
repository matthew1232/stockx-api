const request = require('request-promise');
const moment = require('moment');

module.exports = async (bearer, options) => {
    const { amount, variantID, currency, cookieJar, proxy } = options;
    const expiresAt = moment().add(30, 'days').utc().format();
    
    const res = await request({
        uri: 'https://stockx.com/api/portfolio?a=ask',
        method: 'POST',
        headers: {
            'Host': 'stockx.com',
            'sec-fetch-mode': 'cors',
            'origin': 'https://stockx.com',
            'authorization': `Bearer ${bearer}`,
            'content-type': 'application/json',
            'appos': 'web',
            'x-requested-with': 'XMLHttpRequest',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
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
                expiresAt: expiresAt
            }
        },
        jar: cookieJar,
        simple: false,
        resolveWithFullResponse: true,
        proxy: proxy
    });

    if (res.statusCode != 200) throw new Error(`Status code error: ${res.statusCode} - Response: ${res.body}`);

    return {
        id: res.body.PortfolioItem.chainId,
        response: res.body
    };
};