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

var BidsApi = function (_Api) {
  (0, _inherits2["default"])(BidsApi, _Api);

  function BidsApi() {
    (0, _classCallCheck2["default"])(this, BidsApi);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(BidsApi).apply(this, arguments));
  }

  (0, _createClass2["default"])(BidsApi, [{
    key: "getBids",
    value: function getBids() {
      var options,
          _args = arguments;
      return _regenerator["default"].async(function getBids$(_context) {
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
    key: "updateBid",
    value: function updateBid() {
      var options,
          amount,
          variantID,
          chainId,
          expiresAt,
          res,
          status,
          err,
          id,
          _args2 = arguments;
      return _regenerator["default"].async(function updateBid$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};
              amount = options.amount, variantID = options.variantID, chainId = options.chainId;
              expiresAt = moment().add(30, 'days').utc().format();
              _context2.prev = 3;

              if (!(!amount || !variantID || !chainId)) {
                _context2.next = 6;
                break;
              }

              throw new Error('Invalid amount, chainId, and/or variant id!');

            case 6:
              if (this.bearer) {
                _context2.next = 8;
                break;
              }

              throw new Error('Please login first!');

            case 8:
              _context2.next = 10;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=bid',
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

            case 10:
              res = _context2.sent;
              status = res.status;

              if (!(!status || status && status !== 200)) {
                _context2.next = 16;
                break;
              }

              err = new Error('Invalid status code!');
              err.status = status || 404;
              throw err;

            case 16:
              id = res.data.PortfolioItem.chainId;
              return _context2.abrupt("return", {
                id: id
              });

            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](3);

            case 22:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[3, 20]]);
    }
  }, {
    key: "placeBid",
    value: function placeBid() {
      var options,
          amount,
          variantID,
          expiresAt,
          res,
          status,
          err,
          id,
          _err,
          _args3 = arguments;

      return _regenerator["default"].async(function placeBid$(_context3) {
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
              if (this.bearer) {
                _context3.next = 8;
                break;
              }

              throw new Error('Please login first!');

            case 8:
              _context3.next = 10;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: 'https://stockx.com/api/portfolio?a=bid',
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

            case 10:
              res = _context3.sent;
              status = res.status;

              if (!(!status || status && status !== 200)) {
                _context3.next = 16;
                break;
              }

              err = new Error('Invalid response code!');
              err.status = status || 404;
              throw err;

            case 16:
              id = res.data.PortfolioItem.chainId;
              return _context3.abrupt("return", {
                id: id
              });

            case 20:
              _context3.prev = 20;
              _context3.t0 = _context3["catch"](3);
              _err = new Error('Unable to place bid!');
              _err.status = _context3.t0.status || 404;
              throw _err;

            case 25:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[3, 20]]);
    }
  }, {
    key: "removeBid",
    value: function removeBid() {
      var options,
          _args4 = arguments;
      return _regenerator["default"].async(function removeBid$(_context4) {
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
  return BidsApi;
}(_base["default"]);

exports["default"] = BidsApi;