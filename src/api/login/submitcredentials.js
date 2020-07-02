const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = async (clientID, options) => {
    const { state, user, password, cookieJar, proxy, userAgent } = options;
    //Submit credentials
    const reqOptions = {
        uri: 'https://accounts.stockx.com/usernamepassword/login',
        method: 'POST',
        headers: {
            'Host': 'accounts.stockx.com',
            'sec-fetch-mode': 'cors',
            'auth0-client': clientID,
            'origin': 'https://accounts.stockx.com',
            'user-agent': userAgent,
            'content-type': 'application/json',
            'sec-fetch-site': 'same-origin'
        },
        json: {
            client_id: clientID,
            redirect_uri: 'https://stockx.com/callback?path=/',
            tenant: 'stockx-prod',
            response_type: 'code',
            audience: 'gateway.stockx.com',
            state: state,
            _csrf: 'OnRjJjWty9Fw6jz95NFqwoPV',
            username: user,
            password: password,
            _instate: 'deprecated',
            connection: 'production'
        },
        jar: cookieJar,
        proxy: proxy,
        resolveWithFullResponse: true,
        simple: false
    };

    const res = await request(reqOptions);

    if (res.statusCode == 401 && JSON.stringify(res.body).includes('Incorrect email or password')) throw new Error("Invalid credentials!");
    else if (res.statusCode != 200) throw new Error(`Status code error ${res.statusCode} - Response: ${JSON.stringify(res.body)}`);

    //Fetch params needed for callback
    const $ = cheerio.load(res.body);
    const wa = $('input[name="wa"]').val();
    const wctx = $('input[name="wctx"]').val();
    const wresult = $('input[name="wresult"]').val();

    if (wa == undefined || wctx == undefined || wresult == undefined || wa == "" || wctx == "" || wresult == "") throw new Error("No paramaters found for callback");

    return {
        wa,
        wctx,
        wresult
    };
};