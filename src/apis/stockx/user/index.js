import Base from '../../base';

// helper methods (prevents exposure of these functions)
import { getState, submitCredentials, checkStatus } from './helpers';
import { errors } from '../../../utils';

export default class User extends Base {
  // todo:
  async logout(options = {}) {}

  async login(options = {}) {
    const { password, username } = options;
    const { headers, jar, proxy, request } = this.context;

    try {
      if (!username || !password) {
        throw new Error('Unable to login: Username and/or password not provided!');
      }

      const { state, client_id } = await getState({
        headers,
        jar,
        proxy,
        request,
      });

      const { wa, wresult, wctx } = await submitCredentials({
        client_id,
        headers,
        jar,
        password,
        proxy,
        request,
        state,
        username,
      });

      const isLoggedIn = await checkStatus({
        jar,
        proxy, 
        request,
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
      this.context.setBearer(bearer);
      this.context.setIsLoggedIn(isLoggedIn);
      return isLoggedIn;

    } catch (error) {
      return errors(error, 'login');
    }
  }
}
