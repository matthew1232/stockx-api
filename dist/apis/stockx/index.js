"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _toughCookie = require("tough-cookie");

var _products = _interopRequireDefault(require("./products"));

var _asks = _interopRequireDefault(require("./asks"));

var _bids = _interopRequireDefault(require("./bids"));

var _user = _interopRequireDefault(require("./user"));

var _utils = require("../utils");

var StockX = function StockX() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  (0, _classCallCheck2["default"])(this, StockX);
  var _options$proxy = options.proxy,
      proxy = _options$proxy === void 0 ? null : _options$proxy,
      _options$currency = options.currency,
      currency = _options$currency === void 0 ? _utils.currencies.USD : _options$currency;
  this.currency = currency;
  this.cookieJar = new _toughCookie.CookieJar();
  this.proxy = proxy ? (0, _utils.format)(proxy) : null;
  this.context = {
    currency: this.currency,
    jar: this.cookieJar,
    baseURL: 'https://stockx.com/api',
    headers: {
      origin: 'https://accounts.stockx.com',
      host: 'accounts.stockx.com',
      'sec-fetch-mode': 'cors',
      'accept-language': 'en-US,en;q=0.9',
      'x-requested-with': 'XMLHttpRequest',
      'upgrade-insecure-requests': 1,
      appos: 'web',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
      accept: '*/*',
      authority: 'stockx.com',
      'sec-fetch-site': 'same-origin',
      appversion: '0.1',
      'content-type': 'application/json'
    },
    proxy: this.proxy
  };
  this.products = new _products["default"](this.context);
  this.asks = new _asks["default"](this.context);
  this.bids = new _bids["default"](this.context);
  this.user = new _user["default"](this.context);
};

exports["default"] = StockX;
;