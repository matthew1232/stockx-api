const updateBid = require('./updatebid');

module.exports = async (bearer, options) => {
    const bidResponse = await updateBid(bearer, options);

    return bidResponse;
};