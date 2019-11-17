import cheerio from 'cheerio';

export const getState = async fetch => {
    try {
        const res = await fetch('https://stockx.com/login', {
            redirect: 'follow',
            follow: 5,
            headers: {
                host: 'stockx.com',
                'upgrade-insecure-requests': '1',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
                'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                'sec-fetch-site': 'none',
                'accept-language': 'en-US,en;q=0.9'
            }
        });

        const { status, url } = res;
        if (!status || (status && status !== 200)) {
            const err = new Error('Invalid response code!');
            err.status = status || 400;
            throw err;
        }

        // Get state and client ID
        const state = url.split('state=')[1].split('&')[0];
        const client_id = url.split('client_id=')[1].split('&')[0];
        if (!state || !client_id) {
            throw new Error('Invalid State and/or Client ID!');
        }

        return { state, client_id };
    } catch (error) {
        const err = new Error(`Unable to login: ${error.message}`);
        err.status = error.status || 404;
        throw err;
    }
};

export const submitCredentials = async (fetch, { state, client_id, username, password }) => {
    try {
        const res = await fetch({
            method: 'POST',
            url: 'https://accounts.stockx.com/usernamepassword/login',
            headers: {
                'Host': 'accounts.stockx.com',
                'sec-fetch-mode': 'cors',
                'auth0-client': client_id,
                'origin': 'https://accounts.stockx.com',
                'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                'content-type': 'application/json',
                'sec-fetch-site': 'same-origin'
            },
            data: {
                client_id,
                redirect_uri: 'https://stockx.com/callback?path=/',
                tenant: 'stockx-prod',
                response_type: 'code',
                audience: 'gateway.stockx.com',
                state,
                _csrf: 'OnRjJjWty9Fw6jz95NFqwoPV',
                username,
                password,
                _instate: 'deprecated',
                connection: 'production'
            }
        });

        const { status } = res;
        if (!status || (status && status !== 200)) {
            const err = new Error('Invalid response code!');
            err.status = status || 400;
            throw err;
        }

        const body = await res.text();
        const $ = cheerio.load(body);
        const wa = $('input[name="wa"]').val();
        const wctx = $('input[name="wctx"]').val();
        const wresult = $('input[name="wresult"]').val();

        if (!wa || !wctx || !wresult) {
            throw new Error('Invalid parameters!');
        }

        return { wa, wctx, wresult };
    } catch (error) {
        // console.log(error);
        const err = new Error(`Unable to login: ${error.message}!`);
        err.status = error.status || 404;
        throw err;
    }
}

export const checkStatus = async (fetch, { wa, wresult, wctx }) => {
    try {
        const res = await fetch({
            method: 'POST',
            url: `https://accounts.stockx.com/login/callback`,
            headers: {
                origin: 'https://accounts.stockx.com',
                host: 'accounts.stockx.com',
                authority: 'accounts.stockx.com',
                'cache-control': 'max-age=0',
                'content-type': 'application/x-www-form-urlencoded',
                'sec-fetch-mode': 'navigate',
                'sec-fetch-user': '?1',
            },
            data: `wa=${wa}&wresult=${wresult}&wctx=${wctx}`,
        });

        const { status } = res;
        if (!status || (status && status !== 200)) {
            const err = new Error('Invalid response code!');
            err.status = status || 400;
            throw err;
        }

        return true;
    } catch (error) {
        const err = new Error(`Unable to login: ${error.message}!`);
        err.status = error.status || 404;
        throw err;
    }
}