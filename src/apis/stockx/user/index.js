import Api from '../../base';

import { getState, submitCredentials, checkStatus } from './helpers';

export default class UserApi extends Api {
  // todo:
  async logout(options = {}) {}

  async login(options = {}) {
    const { username, password } = options;
    const { headers, proxy, jar } = this.data;

    try {
      if (!username || !password) {
        throw new Error('Username and/or password not provided!');
      }

      const { state, client_id } = await getState({
        request: this._request,
        headers,
        jar,
        proxy,
      });

      const { wa, wresult, wctx } = await submitCredentials({
        request: this._request,
        headers,
        jar,
        proxy,
        state,
        client_id,
        username,
        password,
      });

      const isLoggedIn = await checkStatus({
        request: this._request,
        headers,
        jar,
        proxy, 
        wa,
        wresult,
        wctx
      });

      if (isLoggedIn) {
        const { token } = jar._jar.store.idx["stockx.com"]["/"];
        if (!token) {
          const error = new Error('Invalid token!');
          error.status = 401;
          throw error;
        }
        const [bearer] = token.toString().split('token=')[1].split(';');
        this.data.setBearer(bearer);
        this.data.setIsLoggedIn(isLoggedIn);
        return isLoggedIn;
      }

      return false;
    } catch (error) {
      const err = new Error(error.message || 'Unable to login!');
      err.status = error.status || 404;
      throw err;
    }
  }
}
