const util = require('util');
const { checkRes, parseJSON } = require('../../utils');
const request = util.promisify(require('postman-request'));

module.exports = async (options = {}) => {
    const { limit, proxy, userAgent, cookieJar } = options;

    const reqOptions = {
        url: 'https://www.stockx.com/',
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
        //jar: cookieJar,
        followAllRedirects: true,
        followRedirect: true,
        proxy
    };

    const res = await request(reqOptions);

    checkRes(res);

    const parseError = new Error("Failed to parse API key for search");
    let searchOnlyApiKeyString;
    try {
        let splittedBodyContent = res.body.split('window.searchOnlyApiKey = ');

        if (splittedBodyContent.length < 2) {
            throw parseError
        }

        splittedBodyContent = splittedBodyContent[1].split("';")
        searchOnlyApiKeyString = splittedBodyContent[0].replace("'", "").trim();
    } catch (err) {
        console.error(err)
        throw parseError;
    }

    return searchOnlyApiKeyString;
};