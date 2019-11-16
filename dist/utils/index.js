"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "filterAndLimit", {
  enumerable: true,
  get: function get() {
    return _filterAndLimit["default"];
  }
});
exports.currencies = exports.split = exports.format = void 0;

var _filterAndLimit = _interopRequireDefault(require("./filterAndLimit"));

var split = function split() {
  var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var delimiter = arguments.length > 1 ? arguments[1] : undefined;
  return input.split(delimiter);
};

exports.split = split;

var format = function format(input) {
  try {
    var parts = split(input, ':');

    if (!parts || !parts.length) {
      return null;
    }

    var host = parts.host,
        port = parts.port,
        username = parts.username,
        password = parts.password;

    if (username && password) {
      return {
        host: host,
        port: port,
        auth: {
          username: username,
          password: password
        }
      };
    }

    return {
      host: host,
      port: port
    };
  } catch (e) {
    return null;
  }
};

exports.format = format;
var currencies = {
  USD: 'USD',
  GBP: 'GBP',
  EUR: 'EUR'
};
exports.currencies = currencies;