const request = require('request-promise');
const moment = require('moment');
const { checkRes } = require('../../utils');

module.exports = async (bearer, options) => {
    const { amount, variantID, currency, proxy, cookieJar, userAgent } = options;
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
            'user-agent': userAgent,
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
        proxy
    });

    checkRes(res);

    return {
        id: res.body.PortfolioItem.chainId,
        response: res.body
    };
};