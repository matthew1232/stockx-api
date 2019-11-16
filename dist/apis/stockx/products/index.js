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

var _utils = require("../../../utils");

var ProductsApi = function (_Api) {
  (0, _inherits2["default"])(ProductsApi, _Api);

  function ProductsApi() {
    (0, _classCallCheck2["default"])(this, ProductsApi);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ProductsApi).apply(this, arguments));
  }

  (0, _createClass2["default"])(ProductsApi, [{
    key: "search",
    value: function search(query) {
      var options,
          limit,
          type,
          url,
          res,
          Products,
          products,
          err,
          _args = arguments;
      return _regenerator["default"].async(function search$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
              limit = options.limit, type = options.type;
              url = "https://stockx.com/api/browse?&_search=".concat(query);

              if (type) {
                url += "&dataType=".concat(dataType);
              }

              _context.prev = 4;
              _context.next = 7;
              return _regenerator["default"].awrap(this.axios({
                method: 'GET',
                url: url,
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json'
                }
              }));

            case 7:
              res = _context.sent;
              Products = res.data.Products;
              products = (0, _utils.filterAndLimit)(Products, null, limit);
              return _context.abrupt("return", products.map(function (product) {
                var image = new URL(product.media.imageUrl, 'https://stockx.com').href;
                var title = product.title,
                    retailPrice = product.retailPrice,
                    releaseDate = product.releaseDate,
                    styleId = product.styleId,
                    urlKey = product.urlKey,
                    market = product.market;
                var productUuid = market.productUuid;
                return {
                  title: title,
                  retailPrice: retailPrice,
                  releaseDate: releaseDate,
                  styleId: styleId,
                  productUuid: productUuid,
                  image: image,
                  urlKey: urlKey,
                  market: market
                };
              }));

            case 13:
              _context.prev = 13;
              _context.t0 = _context["catch"](4);
              err = new Error('Failed to complete search!');
              err.status = _context.t0.status || 404;
              throw err;

            case 18:
            case "end":
              return _context.stop();
          }
        }
      }, null, this, [[4, 13]]);
    }
  }, {
    key: "details",
    value: function details(product) {
      var _ref, pathname, url, res, Product, children, title, urlKey, styleId, uuid, variants, err;

      return _regenerator["default"].async(function details$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _ref = new URL(product, 'https://stockx.com'), pathname = _ref.pathname;
              url = "https://stockx.com/api/products/".concat(pathname, "?includes=market&currency=").concat(this.currency);
              _context2.next = 5;
              return _regenerator["default"].awrap(this.axios({
                method: 'GET',
                url: url,
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json'
                }
              }));

            case 5:
              res = _context2.sent;
              Product = res.data.Product;
              children = Product.children, title = Product.title, urlKey = Product.urlKey, styleId = Product.styleId, uuid = Product.uuid;
              variants = [];
              Object.values(children).map(function (p) {
                var size = p.shoeSize,
                    uuid = p.uuid,
                    market = p.market;
                variants.push({
                  size: size,
                  uuid: uuid,
                  market: market
                });
              });
              return _context2.abrupt("return", {
                title: title,
                urlKey: urlKey,
                styleId: styleId,
                uuid: uuid,
                variants: variants
              });

            case 13:
              _context2.prev = 13;
              _context2.t0 = _context2["catch"](0);
              err = new Error('Failed to fetch product details!');
              err.status = _context2.t0.status || 404;
              throw err;

            case 18:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this, [[0, 13]]);
    }
  }]);
  return ProductsApi;
}(_base["default"]);

exports["default"] = ProductsApi;
;