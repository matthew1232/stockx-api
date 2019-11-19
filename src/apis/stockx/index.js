
import { jar } from 'request-promise-native';

// Context
import SharedContext from '../context';

// APIs
import Products from './products';
import Asks from './asks';
import Bids from './bids';
import User from './user';

// Utils
import { format, currencies } from '../../utils';

export default class StockX  {

  /**
   *
   * @param {Object} options
   * @param options.proxy - The proxy to use for future requests
   * @param options.currency - The currency used when making requests
   */
  constructor(options = {}){
    const { proxy = null, currency = currencies.USD } = options;

    this._context = new SharedContext({
      bearer: null,
      currency,
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        appos: 'web',
        appversion: '0.1',
        authority: 'stockx.com',
        host: 'stockx.com',
        origin: 'https://stockx.com',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'upgrade-insecure-requests': 1,
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
      isLoggedIn: false,
      jar: jar(),
      proxy: proxy ? format(proxy) : null,
    });

    // sub-module constructors
    this.products = new Products(this._context);
    this.asks = new Asks(this._context);
    this.bids = new Bids(this._context);
    this.user = new User(this._context);
  };

  // expose mutation methods..
  setCurrency(currency) {
    this._context.setCurrency(currency);
  }

  setProxy(proxy) {
    this._context.setProxy(proxy);
  }
};
