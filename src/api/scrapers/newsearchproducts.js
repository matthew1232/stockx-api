const util = require('util');
const { checkRes, parseJSON, writeBody } = require('../../utils');
const request = util.promisify(require('postman-request'));

const fetchAPIKey = require('./fetchapikey');

module.exports = async (query, options = {}) => {
    const { limit, proxy, userAgent, cookieJar } = options;

    const apiKey = await fetchAPIKey(options);

    const res = await request({
        url: "https://xw7sbct9v6-dsn.algolia.net/1/indexes/products/query?x-algolia-agent=Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser",
        headers: {
            "user-agent": userAgent,
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "x-algolia-agent": "Algolia%20for%20JavaScript%20(4.9.1)%3B%20Browser",
            "x-algolia-api-key": apiKey,
            "x-algolia-application-id": "XW7SBCT9V6"
        },
        body: `{\"params\":\"query=${encodeURIComponent(query)}&facets=*&filters=\"}`,
        method: "POST",
        proxy,
        //jar: cookieJar
    });

    checkRes(res);

    const { body } = res;

    const { hits } = parseJSON(body);
    const target = limit !== undefined ? hits.slice(0, limit) : hits;

    if (hits == "") throw new Error("No products found");
    else return target;
};