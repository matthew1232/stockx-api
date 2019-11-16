const request = require('request-promise');

module.exports = async (options) => {
    const { cookieJar, proxy } = options;
    const reqOptions = {
        uri: 'https://stockx.com/login',
        headers: {
            'Host': 'stockx.com',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
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