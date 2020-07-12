const deleteAsk = require('./deleteAsk');

module.exports = async (bearer, options) => {
    const askResponse = await deleteAsk(bearer, options);
        
    return askResponse;
};