"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _axios = _interopRequireDefault(require("axios"));

var _axiosCookieJarSupport = _interopRequireDefault(require("axiosCookieJarSupport"));

var Api = function Api(_ref) {
  var currency = _ref.currency,
      jar = _ref.jar,
      baseURL = _ref.baseURL,
      proxy = _ref.proxy;
  (0, _classCallCheck2["default"])(this, Api);
  this.axios = _axios["default"].create({
    baseURL: baseURL,
    headers: headers,
    proxy: proxy
  });
  this.currency = currency;
  this.proxy = proxy;
  this.bearer = null;
  (0, _axiosCookieJarSupport["default"])(instance);
  instance.defaults.jar = jar;
};

exports["default"] = Api;