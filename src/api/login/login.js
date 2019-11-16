const login = require('./index');

module.exports = async (options) => {
    const { user, password, cookieJar, proxy } = options;
    const stateData = await login.fetchState({
        cookieJar, 
        proxy
    });

    const { wa, wresult, wctx } = await login.submitCredentials(stateData.clientID, {
        state: stateData.state, 
        user, 
        password, 
        cookieJar, 
        proxy
    });

    await login.submitCallback({
        wa, 
        wresult, 
        wctx, 
        cookieJar,
        proxy
    });
};