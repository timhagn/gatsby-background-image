"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.logDeprecationNotice = exports.combineArray = exports.filteredJoin = exports.hashString = exports.stringToArray = exports.toKebabCase = exports.toCamelCase = exports.hasImageArray = exports.convertProps = exports.stripRemainingProps = exports.isString = exports.isBrowser = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _filterInvalidDomProps = _interopRequireDefault(require("filter-invalid-dom-props"));

var _MediaUtils = require("./MediaUtils");

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
 * Strip BackgroundImage propTypes from remaining props to be passed to <Tag />
 *
 * @param props
 * @return {Object}
 */


exports.isString = isString;

var stripRemainingProps = function stripRemainingProps(props) {
  return (0, _filterInvalidDomProps.default)(props);
};
/**
 * Handle legacy names for image queries
 *
 * @param props
 * @return {Object}
 */


exports.stripRemainingProps = stripRemainingProps;

var convertProps = function convertProps(props) {
  var convertedProps = (0, _extends2.default)({}, props);
  var resolutions = convertedProps.resolutions,
      sizes = convertedProps.sizes,
      classId = convertedProps.classId,
      fixed = convertedProps.fixed,
      fluid = convertedProps.fluid;

  if (resolutions) {
    convertedProps.fixed = resolutions;
    delete convertedProps.resolutions;
  }

  if (sizes) {
    convertedProps.fluid = sizes;
    delete convertedProps.sizes;
  }

  if (classId) {
    logDeprecationNotice("classId", "gatsby-background-image should provide unique classes automatically. Open an Issue should you still need this property.");
  } // if (fluid && !hasImageArray(props)) {
  //   convertedProps.fluid = [].concat(fluid)
  // }
  //
  // if (fixed && !hasImageArray(props)) {
  //   convertedProps.fixed = [].concat(fixed)
  // }
  // convert fluid & fixed to arrays so we only have to work with arrays


  if (fluid && (0, _MediaUtils.hasArtDirectionFluidArray)(props)) {
    convertedProps.fluid = (0, _MediaUtils.groupByMedia)(convertedProps.fluid);
  }

  if (fixed && (0, _MediaUtils.hasArtDirectionFixedArray)(props)) {
    convertedProps.fixed = (0, _MediaUtils.groupByMedia)(convertedProps.fixed);
  }

  return convertedProps;
};
/**
 * Checks if fluid or fixed are image arrays.
 *
 * @param props   object   The props to check for images.
 * @return {boolean}
 */


exports.convertProps = convertProps;

var hasImageArray = function hasImageArray(props) {
  return props.fluid && Array.isArray(props.fluid) || props.fixed && Array.isArray(props.fixed);
};
/**
 * Converts CSS kebab-case strings to camel-cased js style rules.
 *
 * @param str   string    Rule to transform
 * @return {boolean|string}
 */


exports.hasImageArray = hasImageArray;

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
/**
 * Logs a warning if deprecated props where used.
 *
 * @param prop
 * @param notice
 */


exports.combineArray = combineArray;

var logDeprecationNotice = function logDeprecationNotice(prop, notice) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log("\n    The \"" + prop + "\" prop is now deprecated and will be removed in the next major version\n    of \"gatsby-background-image\".\n    ");

  if (notice) {
    console.log(notice);
  }
};

exports.logDeprecationNotice = logDeprecationNotice;