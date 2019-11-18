import cheerio from 'cheerio';

export const getState = async ({ request, headers, jar, proxy }) => {
  try {
    const res = await request('https://stockx.com/login', {
      followAllRedirects: true,
      followRedirect: true,  
      headers: {
        ...headers,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
      },
      jar,
      proxy,
      resolveWithFullResponse: true
    });

    const { statusCode, req: { _header } } = res;

    if (!statusCode || (statusCode && statusCode !== 200)) {
      const err = new Error('Invalid response code!');
      err.status = statusCode || 404;
      throw err;
    }

    // Get state and client ID
    const state = _header.split('state=')[1].split('&')[0];
    const client_id = _header.split('client=')[1].split('&')[0];
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

export const submitCredentials = async ({ request, headers, jar, proxy, state, client_id, username, password }) => {
  try {
    const res = await request('https://accounts.stockx.com/usernamepassword/login', {
      headers: {
        ...headers,
        'auth0-client': client_id,
        'content-type': 'application/json',
        host: 'accounts.stockx.com',
        origin: 'https://accounts.stockx.com',
      },
      jar,
      json: {
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
        connection: 'production',
      },
      method: 'POST',
      proxy,
      resolveWithFullResponse: true,
      simple: false,
    });

    const { statusCode, body } = res;
    if (!statusCode || (statusCode && statusCode === 401)) {
      const err = new Error('Invalid email and/or password!');
      err.status = statusCode || 404;
      throw err;
    }

    const $ = cheerio.load(body);
    const wa = $('input[name="wa"]').val();
    const wctx = $('input[name="wctx"]').val();
    const wresult = $('input[name="wresult"]').val();
    if (!wa || !wctx || !wresult) {
      throw new Error('Invalid parameters!');
    }

    return { wa, wctx, wresult };
  } catch (error) {
    const err = new Error(`Unable to login: ${error.message}`);
    err.status = error.status || 404;
    throw err;
  }
}

export const checkStatus = async ({ request, headers, jar, proxy, wa, wresult, wctx }) => {
  try {
    const res = await request(`https://accounts.stockx.com/login/callback`, {
      body: encodeURI(`wa=${wa}&wresult=${wresult}&wctx=${wctx}`),  
      followAllRedirects: true,
      followRedirect: true,  
      headers: {
        ...headers,
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
        authority: 'accounts.stockx.com',
        origin: 'https://accounts.stockx.com',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
      },
      jar,
      method: 'POST',
      proxy,
      resolveWithFullResponse: true,
      simple: false,
    });

    const { statusCode } = res;
    if (!statusCode || (statusCode && statusCode !== 200)) {
      const err = new Error('Invalid response code!');
      err.status = statusCode || 400;
      throw err;
    }

    return true;
  } catch (error) {
    const err = new Error(`Unable to login: ${error.message}`);
    err.status = error.status || 404;
    throw err;
  }
}
