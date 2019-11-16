const placeBid = require('./placebid');

module.exports = async (bearer, options) => {
    const bidResponse = await placeBid(bearer, options);
    
    return bidResponse;
};