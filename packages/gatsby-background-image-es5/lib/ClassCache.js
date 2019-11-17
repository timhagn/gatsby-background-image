"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.resetComponentClassCache = exports.activateCacheForComponentClass = exports.inComponentClassCache = void 0;

var _create = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/create"));

var componentClassCache = (0, _create.default)({});
/**
 * Cache component classes as we never know if a Component wasn't already set.
 *
 * @param className   string  className given by props
 * @return {*|boolean}
 */

var inComponentClassCache = function inComponentClassCache(className) {
  return componentClassCache[className] || false;
};
/**
 * Adds a component's classes to componentClassCache.
 *
 * @param className   string  className given by props
 */


exports.inComponentClassCache = inComponentClassCache;

var activateCacheForComponentClass = function activateCacheForComponentClass(className) {
  if (className) {
    componentClassCache[className] = true;
  }
};
/**
 * Resets the componentClassCache (especially important for reliable tests).
 */


exports.activateCacheForComponentClass = activateCacheForComponentClass;

var resetComponentClassCache = function resetComponentClassCache() {
  for (var className in componentClassCache) {
    delete componentClassCache[className];
  }
};

exports.resetComponentClassCache = resetComponentClassCache;