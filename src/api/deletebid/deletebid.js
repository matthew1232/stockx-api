const request = require('request-promise');

module.exports = async (bearer, options) => {
    const { bidID, cookieJar, proxy, userAgent } = options;
    
    const res = await request({
        uri: `https://stockx.com/api/portfolio/${bidID}`,
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
        method: 'DELETE',
        jar: cookieJar, 
        proxy,
        json: {
            "chain_id": bidID.toString(),
            "notes": "Customer Removed Bid"
        },
        simple: false,
        resolveWithFullResponse: true
    });

    if (res.statusCode !== 200){
        const e = new Error(`Status code error: ${res.statusCode}`);
        e.statusCode = res.statusCode;
        e.body = res.body;

        throw e;
    };

    return {
        id: res.body.PortfolioItem.chainId,
        response: res.body
    };
};