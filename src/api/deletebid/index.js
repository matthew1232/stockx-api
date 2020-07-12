const deleteBid = require('./deleteBid');

module.exports = async (bearer, options) => {
    const bidResponse = await deleteBid(bearer, options);
        
    return bidResponse;
};