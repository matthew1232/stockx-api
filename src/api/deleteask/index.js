const deleteAsk = require('./deleteask');

module.exports = async (bearer, options) => {
    const askResponse = await deleteAsk(bearer, options);
        
    return askResponse;
};