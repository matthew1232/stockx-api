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

var _cheerio = _interopRequireDefault(require("cheerio"));

var _base = _interopRequireDefault(require("../../base"));

var UserApi = function (_Api) {
  (0, _inherits2["default"])(UserApi, _Api);

  function UserApi(props) {
    var _this;

    (0, _classCallCheck2["default"])(this, UserApi);
    _this = (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(UserApi).call(this, props));
    _this.isLoggedIn = false;
    return _this;
  }

  (0, _createClass2["default"])(UserApi, [{
    key: "getState",
    value: function getState() {
      var res, _res$headers, state, clientID, status, err;

      return _regenerator["default"].async(function getState$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return _regenerator["default"].awrap(this.axios({
                method: 'GET',
                url: 'https://stockx.com/login',
                headers: {
                  host: 'stockx.com',
                  'upgrade-insecure-requests': 1,
                  'sec-fetch-mode': 'navigate',
                  'sec-fetch-user': '?1',
                  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3'
                }
              }));

            case 3:
              res = _context.sent;
              _res$headers = res.headers, state = _res$headers.state, clientID = _res$headers.clientID, status = res.status;

              if (!(!state || !clientID)) {
                _context.next = 7;
                break;
              }

              throw new Error('Invalid state and/or client id!');

            case 7:
              return _context.abrupt("return", {
                state: state,
                clientID: clientID
              });

            case 10:
              _context.prev = 10;
              _context.t0 = _context["catch"](0);
              err = new Error('Unable to retrieve logged in status!');
              err.status = _context.t0.status || 404;
              throw err;

            case 15:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[0, 10]]);
    }
  }, {
    key: "logout",
    value: function logout() {
      var options,
          _args2 = arguments;
      return _regenerator["default"].async(function logout$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : {};

            case 1:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "login",
    value: function login() {
      var options,
          username,
          password,
          _ref,
          state,
          clientID,
          _ref2,
          wa,
          wresult,
          wctx,
          err,
          _args3 = arguments;

      return _regenerator["default"].async(function login$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : {};
              username = options.username, password = options.password;
              _context3.prev = 2;

              if (!(!username || !password)) {
                _context3.next = 5;
                break;
              }

              throw new Error('Username and/or password not provided!');

            case 5:
              _context3.next = 7;
              return _regenerator["default"].awrap(this.getState());

            case 7:
              _ref = _context3.sent;
              state = _ref.state;
              clientID = _ref.clientID;
              _context3.next = 12;
              return _regenerator["default"].awrap(this.submitCredentials({
                state: state,
                clientID: clientID,
                username: username,
                password: password
              }));

            case 12:
              _ref2 = _context3.sent;
              wa = _ref2.wa;
              wresult = _ref2.wresult;
              wctx = _ref2.wctx;
              return _context3.abrupt("return", checkStatus({
                wa: wa,
                wresult: wresult,
                wctx: wctx
              }));

            case 19:
              _context3.prev = 19;
              _context3.t0 = _context3["catch"](2);
              err = new Error('Unable to login!');
              err.status = _context3.t0.status || 404;
              throw err;

            case 24:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this, [[2, 19]]);
    }
  }, {
    key: "submitCredentials",
    value: function submitCredentials(_ref3) {
      var state, clientID, username, password, res, data, status, $, wa, wctx, wresult, err;
      return _regenerator["default"].async(function submitCredentials$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              state = _ref3.state, clientID = _ref3.clientID, username = _ref3.username, password = _ref3.password;
              _context4.prev = 1;
              _context4.next = 4;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: 'https://accounts.stockx.com/usernamepassword/login',
                headers: {
                  'auth0-client': clientID
                },
                data: {
                  client_id: clientID,
                  redirect_uri: 'https://stockx.com/callback?path=/',
                  tenant: 'stockx-prod',
                  response_type: 'code',
                  audience: 'gateway.stockx.com',
                  state: state,
                  _csrf: 'OnRjJjWty9Fw6jz95NFqwoPV',
                  username: username,
                  password: password,
                  _instate: 'deprecated',
                  connection: 'production'
                }
              }));

            case 4:
              res = _context4.sent;
              data = res.data, status = res.status;
              $ = _cheerio["default"].load(data);
              wa = $('input[name="wa"]').val();
              wctx = $('input[name="wctx"]').val();
              wresult = $('input[name="wresult"]').val();

              if (!(!wa || !wctx || !wresult)) {
                _context4.next = 12;
                break;
              }

              throw new Error('Invalid parameters found after login!');

            case 12:
              return _context4.abrupt("return", {
                wa: wa,
                wctx: wctx,
                wresult: wresult
              });

            case 15:
              _context4.prev = 15;
              _context4.t0 = _context4["catch"](1);
              err = new Error('Unable to submit credentials!');
              err.status = _context4.t0.status || 404;
              throw err;

            case 20:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this, [[1, 15]]);
    }
  }, {
    key: "checkStatus",
    value: function checkStatus(_ref4) {
      var wa, wresult, wctx, res, status;
      return _regenerator["default"].async(function checkStatus$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              wa = _ref4.wa, wresult = _ref4.wresult, wctx = _ref4.wctx;
              _context5.prev = 1;
              _context5.next = 4;
              return _regenerator["default"].awrap(this.axios({
                method: 'POST',
                url: "https://accounts.stockx.com/login/callback",
                headers: {
                  authority: 'accounts.stockx.com',
                  'cache-control': 'max-age=0',
                  'content-type': 'application/x-www-form-urlencoded',
                  'sec-fetch-mode': 'navigate',
                  'sec-fetch-user': '?1'
                },
                data: "wa=".concat(wa, "&wresult=").concat(wresult, "&wctx=").concat(wctx)
              }));

            case 4:
              res = _context5.sent;
              status = res.status;

              if (!(!status || status && status !== 200)) {
                _context5.next = 8;
                break;
              }

              throw new Error('Invalid login status!');

            case 8:
              this.isLoggedIn = true;
              return _context5.abrupt("return", true);

            case 12:
              _context5.prev = 12;
              _context5.t0 = _context5["catch"](1);

            case 14:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this, [[1, 12]]);
    }
  }]);
  return UserApi;
}(_base["default"]);

exports["default"] = UserApi;