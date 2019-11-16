const updateBid = require('./updateBid');

module.exports = async (bearer, options) => {
    const bidResponse = await updateBid(bearer, options);

    return bidResponse;
};