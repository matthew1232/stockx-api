const request = require('request-promise');

module.exports = async (options) => {
    const { cookieJar, proxy, userAgent } = options;
    const reqOptions = {
        uri: 'https://www.stockx.com/login',
        headers: {
            'Host': 'stockx.com',
            'upgrade-insecure-requests': '1',
            'user-agent': userAgent,
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
            'sec-fetch-site': 'none',
            'accept-language': 'en-US,en;q=0.9'
        },
        jar: cookieJar,
        followAllRedirects: true,
        followRedirect: true,
        proxy,
        resolveWithFullResponse: true
    };

    //Fetch login page
    const res = await request(reqOptions);

    if (res.statusCode != 200) throw new Error(`Status code error ${res.statusCode} - Response: ${res.body}`);

    //Get state and client ID
    const state = res.req._header.split('state=')[1].split('&')[0];
    const clientID = res.req._header.split('client=')[1].split('&')[0];

    if (state == undefined || clientID == undefined) throw new Error("Could not find state or Client ID!");

    return {
        state, 
        clientID
    };
};