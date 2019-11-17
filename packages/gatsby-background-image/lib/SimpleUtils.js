"use strict";

exports.__esModule = true;
exports.combineArray = exports.filteredJoin = exports.hashString = exports.stringToArray = exports.toKebabCase = exports.toCamelCase = exports.isString = exports.isBrowser = void 0;

/**
 * Are we in the browser?
 *
 * @return {boolean}
 */
var isBrowser = function isBrowser() {
  return typeof window !== 'undefined';
};
/**
 * Tests a given value on being a string.
 *
 * @param value *   Value to test
 * @return {boolean}
 */


exports.isBrowser = isBrowser;

var isString = function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
};
/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */


exports.isString = isString;

var toCamelCase = function toCamelCase(str) {
  return isString(str) && str.toLowerCase().replace(/(?:^\w|-|[A-Z]|\b\w)/g, function (letter, index) {
    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/\s|\W+/g, '');
};
/**
 * Converts camel-cased js style rules to CSS kebab-case strings.
 *
 * @param str string    Rule to transform
 * @return {boolean|string}
 */


exports.toCamelCase = toCamelCase;

var toKebabCase = function toKebabCase(str) {
  return isString(str) && str.replace(/\s|\W+/g, '').replace(/[A-Z]/g, function (match) {
    return "-" + match.toLowerCase();
  });
};
/**
 * Splits a given string (e.g. from classname) to an array.
 *
 * @param str string|array  String to split or return as array
 * @param delimiter string  Delimiter on which to split str
 * @return {array|boolean}  Returns (split) string as array, false on failure
 */


exports.toKebabCase = toKebabCase;

var stringToArray = function stringToArray(str, delimiter) {
  if (delimiter === void 0) {
    delimiter = " ";
  }

  if (str instanceof Array) {
    return str;
  }

  if (isString(str)) {
    if (str.includes(delimiter)) {
      return str.split(delimiter);
    }

    return [str];
  }

  return false;
};
/**
 * Hashes a String to a 32bit integer with the simple Java 8 hashCode() func.
 *
 * @param str   string    String to hash.
 * @return {number}
 */


exports.stringToArray = stringToArray;

var hashString = function hashString(str) {
  return isString(str) && [].reduce.call(str, function (hash, item) {
    hash = (hash << 5) - hash + item.charCodeAt(0);
    return hash | 0;
  }, 0);
};
/**
 * As the name says, it filters out empty strings from an array and joins it.
 *
 * @param arrayToJoin   array   Array to join after filtering.
 * @return {string}
 */


exports.hashString = hashString;

var filteredJoin = function filteredJoin(arrayToJoin) {
  return arrayToJoin.filter(function (item) {
    return item !== "";
  }).join();
};
/**
 * Combines two arrays while keeping fromArrays indexes & values.
 *
 * @param fromArray   array   Array the values shall be taken from.
 * @param toArray     array   Array to copy values into.
 * @return {array}
 */


exports.filteredJoin = filteredJoin;

var combineArray = function combineArray(fromArray, toArray) {
  // Fallback for singular images.
  if (!Array.isArray(fromArray)) {
    return [fromArray];
  }

  return fromArray.map(function (item, index) {
    return item || toArray[index];
  });
};

exports.combineArray = combineArray;