import Api from '../../base';

import { getState, submitCredentials, checkStatus } from './helpers';

export default class UserApi extends Api {
  // todo:
  async logout(options = {}) {}

  async login(options = {}) {
    const { password, username } = options;
    const { headers, jar, proxy } = this.data;

    try {
      if (!username || !password) {
        throw new Error('Unable to login: Username and/or password not provided!');
      }

      const { state, client_id } = await getState({
        headers,
        jar,
        proxy,
        request: this._request,
      });

      const { wa, wresult, wctx } = await submitCredentials({
        client_id,
        headers,
        jar,
        password,
        proxy,
        request: this._request,
        state,
        username,
      });

      const isLoggedIn = await checkStatus({
        headers,
        jar,
        proxy, 
        request: this._request,
        wa,
        wctx,
        wresult,
      });

      if (!isLoggedIn) {
        const error = new Error('Unable to login: Invalid callback response!');
        error.status = 400;
        throw error;
      }

      const { token } = jar._jar.store.idx["stockx.com"]["/"];
      if (!token) {
        const error = new Error('Unable to login: Invalid token!');
        error.status = 401;
        throw error;
      }
      const [bearer] = token.toString().split('token=')[1].split(';');
      this.data.setBearer(bearer);
      this.data.setIsLoggedIn(isLoggedIn);
      return isLoggedIn;

    } catch (error) {
      const err = new Error(error.message || 'Unable to login!');
      err.status = error.status || 404;
      throw err;
    }
  }
}
