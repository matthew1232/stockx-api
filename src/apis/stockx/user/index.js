import Api from '../../base';

import { getState, submitCredentials, checkStatus } from './helpers';

export default class UserApi extends Api {
  constructor({ currency, jar, headers, proxy, bearer, isLoggedIn }) {
    super({ currency, jar, headers, proxy, bearer, isLoggedIn, name: 'User' });
  }

  // todo:
  async logout(options = {}) {}

  async login(options = {}) {
    const { username, password } = options;

    try {
      if (!username || !password) {
        throw new Error('Username and/or password not provided!');
      }

      const { state, client_id } = await getState({
        request: this._request,
        jar: this._jar,
        proxy: this.proxy
      });

      const { wa, wresult, wctx } = await submitCredentials({
        request: this._request,
        jar: this._jar,
        proxy: this.proxy,
        state,
        client_id,
        username,
        password,
      });

      const isLoggedIn = await checkStatus({
        request: this._request,
        jar: this._jar,
        proxy: this.proxy, 
        wa,
        wresult,
        wctx
      });

      if (isLoggedIn) {
        this._bearer = this._jar._jar.store.idx["stockx.com"]["/"].token;
        this._isLoggedIn = true;
        return true;
      }

      return false;
    } catch (error) {
      const err = new Error(error.message || 'Unable to login!');
      err.status = error.status || 404;
      throw err;
    }
  }
}
