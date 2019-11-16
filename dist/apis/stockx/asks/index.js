"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _base = _interopRequireDefault(require("../../base"));

var AsksApi = function (_Api) {
  (0, _inherits2["default"])(AsksApi, _Api);

  function AsksApi() {
    (0, _classCallCheck2["default"])(this, AsksApi);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(AsksApi).apply(this, arguments));
  }

  (0, _createClass2["default"])(AsksApi, [{
    key: "list",
    value: function list() {
      var options,
          _args = arguments;
      return _regenerator["default"].async(function list$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "update",
    value: function update() {
      var options,
          amount,
          variantID,
          chainId,
          expiresAt,
          res,
          status,
          err,
          id,
          _err,
          _args2 = arguments;

      return _regenerator["default"].async(function update$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              amount = options.amount, variantID = options.variantID, chainId = options.chainId;
              expiresAt = moment().add(30, 'days').utc().format();
              _context2.prev = 3;

              if (!(!amount || !variantID)) {
                _context2.next = 6;
                break;
              }

              throw new Error('Invalid amount and/or variant id!');

            case 6:
              _context2.next = 8;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=ask',
                headers: {
                  host: 'stockx.com',
                  origin: 'https://stockx.com',
                  authorization: "Bearer ".concat(this.bearer)
                },
                data: {
                  PortfolioItem: {
                    localAmount: amount,
                    skuUuid: variantID,
                    localCurrency: this.currency,
                    expiresAt: expiresAt,
                    chainId: chainId
                  }
                }
              }));

            case 8:
              res = _context2.sent;
              status = res.status;

              if (!(!status || status && status !== 200)) {
                _context2.next = 14;
                break;
              }

              err = new Error('Invalid response code!');
              err.status = status || 404;
              throw err;

            case 14:
              id = res.data.PortfolioItem.chainId;
              return _context2.abrupt("return", {
                id: id
              });

            case 18:
              _context2.prev = 18;
              _context2.t0 = _context2["catch"](3);
              _err = new Error('Unable to place ask!');
              _err.status = _context2.t0.status || 404;
              throw _err;

            case 23:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[3, 18]]);
    }
  }, {
    key: "place",
    value: function place() {
      var options,
          amount,
          variantID,
          expiresAt,
          res,
          status,
          err,
          id,
          _err2,
          _args3 = arguments;

      return _regenerator["default"].async(function place$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              amount = options.amount, variantID = options.variantID;
              expiresAt = moment().add(30, 'days').utc().format();
              _context3.prev = 3;

              if (!(!amount || !variantID)) {
                _context3.next = 6;
                break;
              }

              throw new Error('Invalid amount and/or variant id!');

            case 6:
              _context3.next = 8;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=ask',
                headers: {
                  host: 'stockx.com',
                  origin: 'https://stockx.com',
                  authorization: "Bearer ".concat(this.bearer)
                },
                data: {
                  PortfolioItem: {
                    localAmount: amount,
                    skuUuid: variantID,
                    localCurrency: this.currency,
                    expiresAt: expiresAt
                  }
                }
              }));

            case 8:
              res = _context3.sent;
              status = res.status;

              if (!(!status || status && status !== 200)) {
                _context3.next = 14;
                break;
              }

              err = new Error('Invalid response code!');
              err.status = status || 404;
              throw err;

            case 14:
              id = res.data.PortfolioItem.chainId;
              return _context3.abrupt("return", {
                id: id
              });

            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](3);
              _err2 = new Error('Unable to place ask!');
              _err2.status = _context3.t0.status || 404;
              throw _err2;

            case 23:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[3, 18]]);
    }
  }, {
    key: "remove",
    value: function remove() {
      var options,
          _args4 = arguments;
      return _regenerator["default"].async(function remove$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              options = _args4.length > 0 && _args4[0] !== undefined ? _args4[0] : {};

            case 1:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }]);
  return AsksApi;
}(_base["default"]);

exports["default"] = AsksApi;