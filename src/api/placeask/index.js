const placeAsk = require('./placeask');

module.exports = async (bearer, options) => {
    const askResponse = await placeAsk(bearer, options);
        
    return askResponse;
};