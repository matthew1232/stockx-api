const login = require('./index');

module.exports = async (options) => {
    const { user, password, cookieJar, proxy, userAgent } = options;
    const stateData = await login.fetchState({
        cookieJar, 
        proxy,
        userAgent
    });

    const { wa, wresult, wctx } = await login.submitCredentials(stateData.clientID, {
        state: stateData.state, 
        user, 
        password, 
        cookieJar, 
        proxy,
        userAgent
    });

    await login.submitCallback({
        wa, 
        wresult, 
        wctx, 
        cookieJar,
        proxy,
        userAgent
    });
};