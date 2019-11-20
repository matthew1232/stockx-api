import parse from 'html-dom-parser';

import { decodeHtmlEntity } from '../../../utils';
import { checkLoginStatus, checkStatus } from '../../../utils/errors';

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
    const [state] = _header.split('state=')[1].split('&');
    const [client_id] = _header.split('client=')[1].split('&');
    if (!state || !client_id) {
      const err = new Error('Invalid State and/or Client ID!');
      err.status = 404;
      throw err;
    }

    return { state, client_id };
  } catch (error) {
    // bubble this up...
    throw error;
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

    const { body } = res;

    checkLoginStatus(res);

    let wa;
    let wctx;
    let wresult;
    try {
      const elements = parse(body);

      if (!elements || !elements.length || elements.length !== 1) {
        throw new Error('Invalid login form!');
      }

      const { children } = elements[0];
      
      children.forEach(child => {
        if (child.name === 'input') {
          const { name, value } = child.attribs;
          if (/wa/i.test(name)) {
            wa = value;
          } else if (/wctx/i.test(name)) {
            wctx = decodeHtmlEntity(value);
          } else if (/wresult/i.test(name)) {
            wresult = value;
          }
        }
      });
    } catch (err) {
      const e = new Error('Invalid login form!');
      e.status = 404;
      throw e;
    }

    if (!wa || !wctx || !wresult) {
      const err = new Error('Invalid login form parameters!');
      err.status = 404;
      throw err;
    }

    return { wa, wctx, wresult };
  } catch (error) {
    // bubble this up...
    throw error;
  }
}

export const submitCallback = async ({ request, jar, proxy, wa, wresult, wctx }) => {
  let res;
  try {
    res = await request(`https://accounts.stockx.com/login/callback`, {
        body: encodeURI(`wa=${wa}&wresult=${wresult}&wctx=${wctx}`),  
        followAllRedirects: true,
        followRedirect: true,  
        headers: {
          'authority': 'accounts.stockx.com',
          'cache-control': 'max-age=0',
          'origin': 'https://accounts.stockx.com',
          'upgrade-insecure-requests': '1',
          'content-type': 'application/x-www-form-urlencoded',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
          'sec-fetch-mode': 'navigate',
          'sec-fetch-user': '?1',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
          'sec-fetch-site': 'same-origin'
        },
        jar,
        method: 'POST',
        proxy,
        resolveWithFullResponse: true,
        simple: false
    });
  }
  catch(e){
    const { status = 404, body = '' } = e;
    const error = new Error(`Error requesting: ${e.message}`);

    error.status = status;
    error.body = body;
  }

  checkStatus(res);

  return true;
};
