const updateAsk = require('./updateAsk');

module.exports = async (bearer, options) => {
    const bidResponse = await updateAsk(bearer, options);
    
    return bidResponse;
};