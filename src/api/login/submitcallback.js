const request = require('request-promise');

module.exports = async (options) => {
    const { wa, wresult, wctx, cookieJar, proxy, userAgent } = options;

    const dataString = `wa=${wa}&wresult=${wresult}&wctx=${wctx}`;
    const reqOptions = {
        uri: `https://accounts.stockx.com/login/callback`,
        method: 'POST',
        headers: {
            'authority': 'accounts.stockx.com',
            'cache-control': 'max-age=0',
            'origin': 'https://accounts.stockx.com',
            'upgrade-insecure-requests': '1',
            'content-type': 'application/x-www-form-urlencoded',
            'user-agent': userAgent,
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'sec-fetch-site': 'same-origin'
        },
        body: encodeURI(dataString),
        jar: cookieJar,
        followAllRedirects: true,
        followRedirect: true,
        simple: false,
        resolveWithFullResponse: true,
        proxy
    };

    //Go through stockX callback
    const res = await request(reqOptions);

    if (res.statusCode != 200) throw new Error(`Status code error ${res.statusCode} - Response: ${res.body}`);
};