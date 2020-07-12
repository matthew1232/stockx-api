const got = require('got');

module.exports = async (query, options = {}) => {
    const { limit, proxy, userAgent } = options;

    const res = await got("https://xw7sbct9v6-1.algolianet.com/1/indexes/products/query?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%203.32.1&x-algolia-application-id=XW7SBCT9V6&x-algolia-api-key=6bfb5abee4dcd8cea8f0ca1ca085c2b3", {
        headers: {
            "user-agent": userAgent,
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site"
        },
        body: `{\"params\":\"query=${encodeURIComponent(query)}&facets=*&filters=\"}`,
        method: "POST",
        http2: true,
        responseType: 'json'
    });

    const { body } = res;

    const { hits } = body;
    const target = limit !== undefined ? hits.slice(0, limit) : hits;

    if (hits == "") throw new Error("No products found");
    else return target;
};