import Api from '../../base';

import { getState, submitCredentials, checkStatus } from './helpers';
import { getCookie } from '../../../utils';

export default class UserApi extends Api {
  constructor({ currency, jar, baseURL, headers, proxy }) {
    super({ currency, jar, baseURL, headers, proxy, name: 'User' });
  }

  // todo:
  async logout(options = {}) {}

  async login(options = {}) {
    const { username, password } = options;

    try {
      if (!username || !password) {
        throw new Error('Username and/or password not provided!');
      }

      const { state, client_id } = await getState(this._fetch, this.proxy);
      // console.log(state, client_id);
      console.log('cookies after first step: ');
      await getCookie(this.jar, 'testetstestes');
      const { wa, wresult, wctx } = await submitCredentials(this._fetch, this.proxy, { state, client_id, username, password });
      // console.log(wa, wresult, wctx);
      console.log('cookies after second step: ');
      await getCookie(this.jar, 'testetstestes');
      const isLoggedIn = await checkStatus(this._fetch, this.proxy, { wa, wresult, wctx });
      console.log('cookies after final step: ');
      await getCookie(this.jar, 'testetstestes');

      if (isLoggedIn) {
        this.isLoggedIn = true;
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
