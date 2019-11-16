"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(list, sorter, limit) {
  if (!list) {
    return [];
  }

  var sorted = list;

  if (sorter) {
    sorted = sortBy(list, sorter);
  }

  var _limit = limit || 0;

  if (_limit === 0) {
    return sorted;
  }

  if (_limit > 0) {
    return sorted.slice(_limit);
  }

  return sorted.slice(0, _limit).reverse();
};

exports["default"] = _default;