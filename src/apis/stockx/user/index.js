import Api from '../../base';

import { getState, submitCredentials, checkStatus } from './helpers';

export default class UserApi extends Api {
    // todo:
    async logout(options = {}) {}

    async login(options = {}) {
        const { username, password } = options;

        try {
            if (!username || !password) {
                throw new Error('Username and/or password not provided!');
            }

            const { state, client_id } = await getState(this._fetch);
            console.log(state, client_id);
            const { wa, wresult, wctx } = await submitCredentials(this._fetch, { state, client_id, username, password });
            const isLoggedIn = await checkStatus(this._fetch, { wa, wresult, wctx });

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
