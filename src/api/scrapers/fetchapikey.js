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

    let globalConstantString, constantsObject;
    
    try {
        globalConstantString = res.body.split('window.globalConstants = ')[1].split('</script>')[0].trim();
        constantsObject = globalConstantString.endsWith(';') ? parseJSON(globalConstantString.slice(0, globalConstantString.length - 1)) : JSON.parse(globalConstantString);
    }
    catch(err){
        throw new Error("Failed to parse API key for search");
    };

    return constantsObject.search.SEARCH_ONLY_API_KEY;
};