import cheerio from 'cheerio';
import Api from '../../base';

export default class UserApi extends Api {
    constructor(props) {
        super(props);

        this.isLoggedIn = false;
    }

    async getState() {
        try {
            const res = await this.axios({
                method: 'GET',
                url: 'https://stockx.com/login',
                headers: {
                    host: 'stockx.com',
                    'upgrade-insecure-requests': 1,
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-user': '?1',
                    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                },
            });

            // todo: status checking
            const { headers: { state, clientID }, status } = res;

            if (!state || !clientID) {
                throw new Error('Invalid state and/or client id!');
            }

            return { state, clientID };
        } catch (error) {
            const err = new Error('Unable to retrieve logged in status!');
            err.status = error.status || 404;
            throw err;
        }
    }

    // todo:
    async logout(options = {}) {}

    async login(options = {}) {
        const { username, password } = options;

        try {
            if (!username || !password) {
                throw new Error('Username and/or password not provided!');
            }

            const { state, clientID } = await this.getState();
            const { wa, wresult, wctx } = await this.submitCredentials({ state, clientID, username, password });
            
            return checkStatus({ wa, wresult, wctx });
        } catch (error) {
            const err = new Error('Unable to login!');
            err.status = error.status || 404;
            throw err;
        }
    }

    async submitCredentials({ state, clientID, username, password }) {
        
        try {
            const res = await this.axios({
                method: 'POST',
                url: 'https://accounts.stockx.com/usernamepassword/login',
                headers: {
                    'auth0-client': clientID,
                },
                data: {
                    client_id: clientID,
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

            // todo: status checking
            const { data, status } = res;

            const $ = cheerio.load(data);
            const wa = $('input[name="wa"]').val();
            const wctx = $('input[name="wctx"]').val();
            const wresult = $('input[name="wresult"]').val();

            if (!wa || !wctx || !wresult) {
                throw new Error('Invalid parameters found after login!');
            }

            return { wa, wctx, wresult };
        } catch (error) {
            const err = new Error('Unable to submit credentials!');
            err.status = error.status || 404;
            throw err;
        }
    }

    async checkStatus({ wa, wresult, wctx }) {
        try {
            const res = await this.axios({
                method: 'POST',
                url: `https://accounts.stockx.com/login/callback`,
                headers: {
                    authority: 'accounts.stockx.com',
                    'cache-control': 'max-age=0',
                    'origin': 'https://accounts.stockx.com',
                    'upgrade-insecure-requests': 1,
                    'content-type': 'application/x-www-form-urlencoded',
                    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-user': '?1',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
                },
                data: `wa=${wa}&wresult=${wresult}&wctx=${wctx}`,
            });

            const { status } = res;

            if (!status || (status && status !== 200)) {
                throw new Error('Invalid login status!');
            }

            this.isLoggedIn = true;
            return true;
        } catch (error) {

        }
    }
}